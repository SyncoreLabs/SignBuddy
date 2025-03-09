import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import lightningIcon from '../../assets/images/credits-icon.png';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface PaymentPopupProps {
  isOpen: boolean;
  onClose: () => void;
  planType: 'credits' | 'subscription';
  selectedPrice: string;
  selectedCredits?: number;
  isYearly?: boolean;
}

const Pricing: React.FC = () => {
  const [isCreditsTab, setIsCreditsTab] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeBottomFaq, setActiveBottomFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('general');
  const [isYearly, setIsYearly] = useState(false);  // Add this state
  const [activeSubscription, setActiveSubscription] = useState<{
    isActive: boolean;
    expiryDate?: string;
    type?: string;
  }>({ isActive: false });
  const navigate = useNavigate();
  const [isPaymentPopupOpen, setIsPaymentPopupOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<{
    type: 'credits' | 'subscription';
    price: string;
    credits?: number;
  } | null>(null);

  useEffect(() => {
    const fetchSubscriptionStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://server.signbuddy.in/api/v1/getcredits', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
  
        if (!response.ok) throw new Error('Failed to fetch subscription status');
        
        const data = await response.json();
        if (data.subscription && data.subscription.endDate) {
          // Check if subscription is valid
          const endDate = new Date(data.subscription.endDate);
          const now = new Date();
          
          if (endDate > now && endDate.getFullYear() > 1970) {
            setActiveSubscription({
              isActive: true,
              expiryDate: data.subscription.endDate,
              type: data.subscription.type
            });
          } else {
            setActiveSubscription({ isActive: false });
          }
        } else {
          setActiveSubscription({ isActive: false });
        }
      } catch (error) {
        console.error('Error fetching subscription status:', error);
        setActiveSubscription({ isActive: false });
      }
    };
  
    fetchSubscriptionStatus();
  }, [isPaymentPopupOpen]);

  const PaymentPopup: React.FC<PaymentPopupProps> = ({ isOpen, onClose, planType, selectedPrice, selectedCredits, isYearly }) => {
    const [userDetails, setUserDetails] = useState({
      name: '',
      email: '',
      contact: ''
    });

    useEffect(() => {
      const fetchUserDetails = async () => {
        try {
          const token = localStorage.getItem('token');
          if (!token) return;

          const response = await fetch('https://server.signbuddy.in/api/v1/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });

          if (response.ok) {
            const data = await response.json();
            setUserDetails(prev => ({
              ...prev,
              name: data.user.userName || '',
              email: data.user.email || ''
            }));
          }
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      };

      fetchUserDetails();
    }, []);

    if (!isOpen) return null;
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const token = localStorage.getItem("token");
      if (!token) {
        console.error('No token found');
        return;
      }
    
      if (!userDetails.name || !userDetails.email || !userDetails.contact) {
        alert('Please fill in all fields');
        return;
      }
    
      // Add check for Razorpay script
      if (typeof window.Razorpay === 'undefined') {
        // Try to load the script dynamically if not present
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        script.onload = () => {
          // Retry the payment process after script loads
          handlePayment();
        };
        document.head.appendChild(script);
        return;
      }
    
      // Move payment logic to separate function
      handlePayment();
    };
    
    const handlePayment = async () => {
      try {
        const data = planType === 'credits' 
          ? {
              planType: "credits",
              creditPackage: selectedCredits?.toString()
            }
          : {
              planType: "subscription",
              subscriptionPlan: isYearly ? 'yearly' : 'monthly'
            };
    
        console.log('Sending order request:', data);
        const orderResponse = await fetch(
          "https://server.signbuddy.in/api/v1/payments/place-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(data),
          }
        );

        const orderData = await orderResponse.json();
        
        if (!orderData.order) {
          throw new Error(orderData.message || 'Failed to create order');
        }

  
        if (!orderData.order || !orderData.order.id) {
          throw new Error('Invalid order data received');
        }

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: orderData.order.amount,
          currency: orderData.order.currency || 'INR',
          name: "SignBuddy",
          description: `Purchase ${planType === 'credits' ? `${selectedCredits} credits` : `${isYearly ? 'yearly' : 'monthly'} subscription`}`,
          order_id: orderData.order.id,
          handler: async function (response: any) {
            try {
              // Updated verification endpoint and request structure
              const verifyResponse = await fetch(
                "https://server.signbuddy.in/api/v1/payments/verify-payment",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                  },
                  body: JSON.stringify({
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_signature: response.razorpay_signature,
                    planType: planType,
                    subscriptionPlan: isYearly ? 'yearly' : 'monthly'
                  }),
                }
              );
              
              const verifyData = await verifyResponse.json();
              if (!verifyResponse.ok || !verifyData.success) {
                throw new Error(verifyData.message || 'Payment verification failed');
              }
              
              alert('Payment successful!');
              onClose();
            } catch (error) {
              console.error('Payment verification error:', error);
              alert('Payment verification failed. Please contact support.');
            }
          },
          prefill: {
            name: userDetails.name,
            email: userDetails.email,
            contact: userDetails.contact
          },
          theme: {
            color: "#09090b",
          },
          modal: {
            ondismiss: function() {
              console.log('Payment window closed');
            }
          }
        };

        // Check if Razorpay is loaded
        if (typeof window.Razorpay === 'undefined') {
          throw new Error('Razorpay SDK not loaded! Please check your internet connection.');
        }
        
        // Initialize Razorpay
        try {
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } catch (error) {
          console.error('Razorpay initialization error:', error);
          alert('Failed to initialize payment. Please try again.');
        }
      } catch (error) {
        console.error('Error in payment process:', error);
        alert(error instanceof Error ? error.message : 'Failed to initialize payment. Please try again.');
      }
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-black rounded-lg p-8 max-w-md w-full border border-white/30">
          <h2 className="text-2xl font-bold text-white mb-4">Confirm Purchase</h2>
          <div className="mb-6">
            <p className="text-gray-400 mb-4">
              {planType === 'credits' 
                ? `Purchase ${selectedCredits} credits for ${selectedPrice}`
                : `Subscribe to ${isYearly ? 'yearly' : 'monthly'} plan for ${selectedPrice}`
              }
            </p>
            
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white/20"
                  value={userDetails.contact}
                  onChange={(e) => setUserDetails(prev => ({ ...prev, contact: e.target.value }))}
                />
              </div>
            </form>
          </div>
          <div className="flex justify-end gap-4">
            <button
              className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-colors"
              onClick={handleSubmit}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    );
  };

  const [plans, setPlans] = useState<{
    creditPackages: Array<{ credits: number; price: number }>;
    subscriptionPlans: Array<{ planType: string; price: number; description: string }>;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await fetch('https://server.signbuddy.in/api/v1/getplans');
        if (!response.ok) throw new Error('Failed to fetch plans');

        const data = await response.json();
        if (data.success && data.plans) {
          setPlans(data.plans);
        }
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const renderActionButton = (price: string, credits?: number) => {
    const token = localStorage.getItem('token');
    const hasActiveSubscription = activeSubscription.isActive;
  
    // For subscription plans, show expiry if active subscription
    if (!isCreditsTab && hasActiveSubscription) {
      return (
        <div className="text-center px-4 py-2 bg-gray-800 rounded-lg text-gray-400">
          {activeSubscription.type === 'monthly' ? 'Monthly' : 'Annual'} plan - Expires on {new Date(activeSubscription.expiryDate!).toLocaleDateString()}
        </div>
      );
    }
  
    // For credits tab or no active subscription
    return (
      <button
        onClick={() => {
          if (!token) {
            navigate('/signup');
            return;
          }
          // Prevent subscription purchase if already subscribed
          if (!isCreditsTab && hasActiveSubscription) {
            return;
          }
          setSelectedPlan({
            type: isCreditsTab ? 'credits' : 'subscription',
            price: price.replace('₹', ''),
            credits: credits || 0
          });
          setIsPaymentPopupOpen(true);
        }}
        className={`w-full text-center px-4 py-2 rounded-lg transition-colors font-medium
          ${!isCreditsTab && hasActiveSubscription
            ? 'bg-gray-300 text-gray-700 cursor-not-allowed' 
            : 'bg-white text-black hover:bg-gray-100'}`}
        disabled={!isCreditsTab && hasActiveSubscription}
      >
        {token 
          ? (!isCreditsTab && hasActiveSubscription)
            ? `Active ${activeSubscription.type} plan`
            : `Get started with ${price}`
          : "Sign up to continue"}
      </button>
    );
  };

  // Replace the existing faqs array with categorized FAQs
  const faqs = {
    general: [
      {
        question: 'How does the credits system work?',
        answer: 'We use a credit-based approach for the entire Platform, each document sent will cost you 10 credits and a reminder would cost a single credit.'
      },
      {
        question: 'Is the platform free to join?',
        answer: "Yes, signing up is completely free. And every month you'll be getting the 30 Credits free refill which could be used to send documents."
      },
      {
        question: 'Can I use the platform on mobile devices?',
        answer: 'Absolutely. Our interface adapts to phones and tablets, ensuring a seamless signing experience. Just log in through your mobile browser.'
      },
      {
        question: 'How do I add credits to my account?',
        answer: 'Click the pricing page at the top, then choose the credit plan you want to purchase and proceed to payment.'
      },
      {
        question: 'What happens once all parties have signed the document?',
        answer: 'After every party signs, the document is finalized, securely stored, and accessible in your dashboard. Everyone also receives a download link to the completed file in their email.'
      }
    ],
    credits: [
      {
        question: 'Do credits ever expire?',
        answer: "Purchased credits doesn't have any expiration, they will remain in your account if once purchased. However, promotional or bonus credits may carry an expiration date."
      },
      {
        question: 'What if I run out of credits mid-transaction?',
        answer: "You’ll have to purchase some credits and then proceed with the transaction."
      },
      {
        question: 'Is there a monthly free credits allowance?',
        answer: "Yes. Each month, you automatically receive 30 free credits refilled. That covers up to three standard documents at no cost, with any extras requiring additional credits."
      },
      {
        question: 'Can I transfer credits to another user?',
        answer: "No. Credits stay tied to each individual account. We don’t currently offer team or organizational plans, so each user manages their own credit balance."
      },
      {
        question: 'How do I purchase credits?',
        answer: "Go to pricing page, pick a credit package, and finalize payment. The purchased credits immediately show in your balance, ready for all document actions."
      }
    ],
    payments: [
      {
        question: 'Which payment methods are accepted?',
        answer: 'In India, we accept credit cards, debit cards, and select local options like UPI or net banking.'
      },
      {
        question: 'Are there any hidden fees??',
        answer: 'No. Our pricing is completely transparent, where we charge 10 credits for sending a document and a reminder would 1 credit. Apart from these two Nothing else.'
      },
      {
        question: 'How do I view my payment history?',
        answer: 'Visit your Billing section from the profile menu. You’ll see all past transactions, including purchase dates, amounts, and receipts, which can be easily downloaded or printed.'
      },
      {
        question: 'What if my payment fails?',
        answer: 'You’ll receive a notification with steps to retry or update your billing details. Contact support if issues persist, and we’ll quickly help resolve payment complications.'
      },
      {
        question: 'Is there a monthly subscription plan?',
        answer: 'Yes. We have a single monthly plan, plus an annual option with a 15% discount. You can pick whichever best fits your signing needs.'
      }
    ],
    platform: [
      {
        question: 'Which file formats are supported?',
        answer: 'SignBuddy supports PDFs and Word documents. Simply upload your file, and we’ll handle the entire signing process seamlessly.'
      },
      {
        question: 'Can I customize my signing workflow?',
        answer: 'You can reorder signers and add fields to each document. We’ll add more customization features in future updates, so stay tuned for additional options.'
      },
      {
        question: 'Is my data secure on SignBuddy?',
        answer: 'We use robust encryption, secure servers, and strict routine security audits. Your information stays protected in transit and at rest, meeting all industry-standard privacy requirements.'
      },
      {
        question: 'How do I contact support if I need help?',
        answer: 'Email us at official@signbuddy.in. We’ll respond as soon as possible to assist with any questions, technical issues, or account concerns you may have.'
      },
      {
        question: 'Is there a limit on the document size I can upload?',
        answer: 'Yes. You can upload files up to 200 MB. Larger file support is on our roadmap, so please watch for future updates.'
      }
    ]
  };

  // Update the FAQ rendering section
  <div className="space-y-4">
    {faqs[activeCategory as keyof typeof faqs].map((faq, index) => (
      <div key={index} className="border border-white/30 rounded-lg overflow-hidden">
        <button
          className="w-full px-6 py-4 flex items-center justify-between text-left"
          onClick={() => setActiveFaq(activeFaq === index ? null : index)}
        >
          <span>{faq.question}</span>
          <svg
            className={`w-5 h-5 transform transition-transform ${activeFaq === index ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {activeFaq === index && (
          <div className="px-6 py-4 border-t border-white/30 text-white text-bold">
            {faq.answer}
          </div>
        )}
      </div>
    ))}
  </div>

  return (
    <div className="bg-black min-h-screen">
      {isPaymentPopupOpen && selectedPlan && (
        <PaymentPopup
          isOpen={isPaymentPopupOpen}
          onClose={() => setIsPaymentPopupOpen(false)}
          planType={selectedPlan.type}
          selectedPrice={selectedPlan.price}
          selectedCredits={selectedPlan.credits}
          isYearly={isYearly}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 py-5">
        <div className="mb-6">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Pricing Plans</h1>
          <p className="text-gray-400 max-w-[500px]">
            Choose the perfect plan for your needs. Whether you're an individual or a team,
            we have flexible options to help you sign and manage documents efficiently.
          </p>
        </div>

        <div className="flex justify-start gap-2 mb-6 mt-0">
          <button
            className={`px-4 py-1 rounded-lg ${isCreditsTab ? 'bg-white text-black' : 'bg-transparent text-gray-400 border border-white/30'}`}
            onClick={() => setIsCreditsTab(true)}
          >
            Credit based
          </button>
          <button
            className={`px-4 py-1 rounded-lg ${!isCreditsTab ? 'bg-white text-black' : 'bg-transparent text-gray-400 border border-white/30'}`}
            onClick={() => setIsCreditsTab(false)}
          >
            Subscription based
          </button>
        </div>

        {/* Change flex to flex-col on mobile, and back to row on md screens */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-16 mb-8">
          {isCreditsTab ? (
            <>
              <div className="w-full md:flex-1">
                <p className="text-gray-400 mb-2">Pay only for what you want!</p>
                <h2 className="text-4xl font-bold mb-8">Select what suits you the best</h2>

                <div className="space-y-5 max-w-lg">
                  <div>
                    <button
                      className="w-full py-2 flex items-center justify-between text-left"
                      onClick={() => setActiveFaq(activeFaq === 0 ? null : 0)}
                    >
                      <span className="font-bold">What is a credit based plan?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 0 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 0 && (
                      <div className="pt-2 text-gray-400">
                        Credits are our platform's currency for document signing. Each document sent requires 10 credit, and you can purchase credits in bundles. Choose the plan that matches your signing needs, and use credits whenever you need them.
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      className="w-full py-3 flex items-center justify-between text-left"
                      onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
                    >
                      <span className="font-bold">Do my Credits expire?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 1 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 1 && (
                      <div className="pt-2 text-gray-400">
                        No, your credits never expire. Once purchased, you can use them anytime without worrying about time limits.
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      className="w-full py-3 flex items-center justify-between text-left"
                      onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
                    >
                      <span className="font-bold">Can I purchase multiple times?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 2 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 2 && (
                      <div className="pt-2 text-gray-400">
                        Yes, you can purchase credits as many times as you need. Your new credits will be added to your existing balance.
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      className="w-full py-3 flex items-center justify-between text-left"
                      onClick={() => setActiveFaq(activeFaq === 3 ? null : 3)}
                    >
                      <span className="font-bold">How many signatures per credit?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 3 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 3 && (
                      <div className="pt-2 text-gray-400">
                        We don't charge for each signature we charge per each document sent.
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      className="w-full py-3 flex items-center justify-between text-left"
                      onClick={() => setActiveFaq(activeFaq === 4 ? null : 4)}
                    >
                      <span className="font-bold">What happens to unused credits?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 4 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 4 && (
                      <div className="pt-2 text-gray-400">
                        Your unused credits remain in your account indefinitely and never expire. You can use them anytime for future document signings. We believe in giving you full control over your purchased credits.
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-400 mt-4">
                  Still have any doubts or questions? Please Checkout FAQs
                </p>
              </div>

              <div className="w-full md:max-w-xl space-y-4">
              {!isLoading && plans?.creditPackages.map((plan, index) => {
                  const planNames = ['Basic', 'Standard', 'Premium'];
                  const discounts = [null, '12% off', '16% off'];
                  const discountColors = [null, 'bg-yellow-400', 'bg-emerald-400'];

                  return (
                    <div key={index} className="bg-black rounded-lg border border-white/30 p-5 relative">
                      {discounts[index] && (
                        <div className={`absolute -top-3 left-4 ${discountColors[index]} text-black px-3 py-1 rounded-full text-sm font-medium`}>
                          {discounts[index]}
                        </div>
                      )}
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{planNames[index]}</h3>
                          <p className="text-gray-400 text-sm">For individuals who needs just the required amount of features.</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <img src={lightningIcon} alt={planNames[index]} className="w-5 h-5" />
                          <div>
                            <span className="text-3xl font-bold">{plan.credits}</span>
                            <span className="text-gray-400 ml-1 text-sm">Credits</span>
                          </div>
                        </div>
                      </div>
                      {renderActionButton(`₹${plan.price}`, plan.credits)}
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <>
              <div className="w-full md:flex-1">
                <p className="text-gray-400 mb-2">Truly Unlimited</p>
                <h2 className="text-4xl font-bold mb-8">For Growing Businesses</h2>

                <div className="space-y-5 max-w-lg">
                  <div>
                    <button
                      className="w-full py-2 flex items-center justify-between text-left"
                      onClick={() => setActiveFaq(activeFaq === 0 ? null : 0)}
                    >
                      <span className="font-bold">What is included in subscription plan?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 0 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 0 && (
                      <div className="pt-2 text-gray-400">
                        Our subscription plan includes unlimited document creations, unlimited reminders.
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      className="w-full py-3 flex items-center justify-between text-left"
                      onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
                    >
                      <span className="font-bold">What features are included?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 1 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 1 && (
                      <div className="pt-2 text-gray-400">
                        Our subscription includes unlimited document processing, unlimited reminders, priority customer support.
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      className="w-full py-3 flex items-center justify-between text-left"
                      onClick={() => setActiveFaq(activeFaq === 2 ? null : 2)}
                    >
                      <span className="font-bold">Can I cancel anytime?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 2 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 2 && (
                      <div className="pt-2 text-gray-400">
                        Yes, you can cancel your subscription at any time. You'll continue to have access until the end of your current billing period.
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      className="w-full py-3 flex items-center justify-between text-left"
                      onClick={() => setActiveFaq(activeFaq === 3 ? null : 3)}
                    >
                      <span className="font-bold">Is there a limit on documents?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 3 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 3 && (
                      <div className="pt-2 text-gray-400">
                        No, with the subscription plan you can send unlimited document. There are no hidden limits or restrictions.
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      className="w-full py-3 flex items-center justify-between text-left"
                      onClick={() => setActiveFaq(activeFaq === 4 ? null : 4)}
                    >
                      <span className="font-bold">What happens after subscription ends?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 4 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 4 && (
                      <div className="pt-2 text-gray-400">
                        When your subscription ends, you'll have read-only access to your documents. To continue sending and managing new documents, simply renew your subscription or purchase some credits and if you don't remember you will also get 30 free credits for every month.                      </div>
                    )}
                  </div>
                  <div />
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Still have any doubts or questions? Please Checkout FAQs
                </p>
              </div>

              <div className="w-full md:max-w-xl">
                <div className="bg-black rounded-lg border border-white/30 p-5 md:p-8">
                  <div className="mb-4">
                    <h3 className="text-4xl font-bold mb-2">Truly Unlimited</h3>
                    <p className="text-gray-400">Perfect for businesses that need unlimited document processing</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-center justify-end gap-2 mb-4 px-2 md:px-0">
                      <span className={`${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
                      <button
                        className="relative w-12 h-6 rounded-full bg-gray-600"
                        onClick={() => setIsYearly(!isYearly)}
                      >
                        <div className={`absolute w-4 h-4 bg-white rounded-full top-1 transition-all ${isYearly ? 'left-7' : 'left-1'}`} />
                      </button>
                      <span className={`${isYearly ? 'text-white' : 'text-gray-400'}`}>Yearly</span>
                    </div>
                    {/* Replace this pricing section */}
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">
                        ₹{isYearly
                          ? plans?.subscriptionPlans.find(p => p.planType === 'yearly')?.price
                          : plans?.subscriptionPlans.find(p => p.planType === 'monthly')?.price}
                      </span>
                      <span className="text-gray-400">
                        Per {isYearly ? 'month, billed yearly' : 'month'}
                      </span>
                    </div>
                    {isYearly && (
                      <div className="mt-2 text-sm text-emerald-400">Save 15% with yearly billing</div>
                    )}
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Unlimited credits</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Send Unlimited documents</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Unlimited reminders</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Fixed monthly costs</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Priority Support</span>
                    </div>
                  </div>

                  {renderActionButton(isYearly ? '₹599/mo' : '₹699/mo')}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto mt-40 mb-40">
        <h2 className="text-5xl font-bold text-center mb-2">Frequently asked questions</h2>
        <p className="text-gray-400 text-center mb-8 mx-4 md:mx-[100px]">
          These are the most commonly asked questions about SignBuddy. Can't find what you are looking for? Message us.
        </p>

        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            className={`px-4 py-2 rounded-lg ${activeCategory === 'general' ? 'bg-white text-black' : 'bg-transparent text-gray-400 border border-white/30'}`}
            onClick={() => setActiveCategory('general')}
          >
            General
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeCategory === 'credits' ? 'bg-white text-black' : 'bg-transparent text-gray-400 border border-white/30'}`}
            onClick={() => setActiveCategory('credits')}
          >
            Credits
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeCategory === 'payments' ? 'bg-white text-black' : 'bg-transparent text-gray-400 border border-white/30'}`}
            onClick={() => setActiveCategory('payments')}
          >
            Payments
          </button>
          <button
            className={`px-4 py-2 rounded-lg ${activeCategory === 'platform' ? 'bg-white text-black' : 'bg-transparent text-gray-400 border border-white/30'}`}
            onClick={() => setActiveCategory('platform')}
          >
            Platform related
          </button>
        </div>

        {/* Bottom FAQ Section */}
        <div className="space-y-4">
          {faqs[activeCategory as keyof typeof faqs].map((faq, index) => (
            <div key={index} className="overflow-hidden">
              <button
                className="w-full px-6 py-4 flex items-center justify-between text-left"
                onClick={() => setActiveBottomFaq(activeBottomFaq === index ? null : index)}
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${activeBottomFaq === index ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeBottomFaq === index && (
                <div className="px-6 py-4 text-gray-400">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};

export default Pricing;