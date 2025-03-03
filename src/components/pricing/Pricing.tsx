import React, { useState , useEffect } from 'react';
import { Link } from 'react-router-dom';
import lightningIcon from '../../assets/images/credits-icon.png';

const Pricing: React.FC = () => {
  const [isCreditsTab, setIsCreditsTab] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeBottomFaq, setActiveBottomFaq] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState('general');
  const [isYearly, setIsYearly] = useState(false);  // Add this state
  const [activeSubscription, setActiveSubscription] = useState<{
    isActive: boolean;
    expiryDate?: string;
  }>({ isActive: false });

  useEffect(() => {
    // Check localStorage or make an API call to get subscription status
    const subscriptionStatus = localStorage.getItem('subscriptionStatus');
    if (subscriptionStatus) {
      setActiveSubscription(JSON.parse(subscriptionStatus));
    }
  }, []);

  const renderActionButton = (price: string) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (isAuthenticated && activeSubscription.isActive && activeSubscription.expiryDate) {
      return (
        <div className="text-center px-4 py-2 bg-gray-800 rounded-lg text-gray-400">
          Expires on {new Date(activeSubscription.expiryDate).toLocaleDateString()}
        </div>
      );
    }

    return (
      <Link
        to={isAuthenticated ? "/dashboard" : "/signup"}
        className="block text-center bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors font-medium"
      >
        {isAuthenticated ? `Get started with ${price}` : "Get started"}
      </Link>
    );
  };

  // Replace the existing faqs array with categorized FAQs
  const faqs = {
    general: [
      {
        question: 'What is SignFastly?',
        answer: 'SignFastly is a digital document signing platform that helps you securely sign and manage documents online.'
      },
      {
        question: 'Is the platform free to join?',
        answer: 'Yes, creating an account is completely free. You only pay when you need to sign documents using credits.'
      },
      {
        question: 'Can I use the platform on mobile devices?',
        answer: 'Yes, SignFastly is fully responsive and works on all devices including smartphones and tablets.'
      }
    ],
    credits: [
      {
        question: 'What is a credit based plan?',
        answer: "Credits are our platform's currency for document signing. Each document sent requires 10 credit, and you can purchase credits in bundles."
      },
      {
        question: 'Do credits expire?',
        answer: 'No, your credits never expire. Once purchased, you can use them anytime without worrying about time limits.'
      },
      {
        question: 'How many signatures per credit?',
        answer: "We don't charge for each signature we charge per each document sent."
      }
    ],
    payments: [
      {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards, debit cards, and UPI payments.'
      },
      {
        question: 'Are there any hidden charges?',
        answer: 'No, we believe in complete transparency. You only pay for the credits you purchase.'
      },
      {
        question: 'Can I get a refund?',
        answer: 'Unused credits can be refunded within 30 days of purchase.'
      }
    ],
    platform: [
      {
        question: 'Is my data secure?',
        answer: 'Yes, we use bank-level encryption to secure all your documents and signatures.'
      },
      {
        question: 'Can I integrate with other platforms?',
        answer: 'Yes, we offer API integration with popular platforms and custom integration solutions.'
      },
      {
        question: 'What file formats are supported?',
        answer: 'We support PDF, Word, Excel, and most common document formats.'
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
                      <span className="font-bold">Can I share credits with my team?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 4 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 4 && (
                      <div className="pt-2 text-gray-400">
                        Yes, if you're on a team plan, credits can be shared among team members. Administrators can manage and allocate credits as needed.
                      </div>
                    )}
                  </div>
                </div>

                <p className="text-sm text-gray-400 mt-4">
                  Still have any doubts or questions? Please Checkout FAQs
                </p>
              </div>

              <div className="w-full md:max-w-xl space-y-4">
                {/* Basic Plan */}
                <div className="bg-black rounded-lg border border-white/30 p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Basic</h3>
                      <p className="text-gray-400 text-sm">For individuals who needs just the required amount of features.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src={lightningIcon} alt="Basic" className="w-5 h-5" />
                      <div>
                        <span className="text-3xl font-bold">50</span>
                        <span className="text-gray-400 ml-1 text-sm">Credits</span>
                      </div>
                    </div>
                  </div>
                  {renderActionButton('₹199')}
                </div>

                {/* Standard Plan */}
                <div className="bg-black rounded-lg border border-white/30 p-5 relative">
                  <div className="absolute -top-3 left-4 bg-yellow-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                    12% off
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Standard</h3>
                      <p className="text-gray-400 text-sm">For individuals who needs just the required amount of features.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src={lightningIcon} alt="Standard" className="w-5 h-5" />
                      <div>
                        <span className="text-3xl font-bold">100</span>
                        <span className="text-gray-400 ml-1 text-sm">Credits</span>
                      </div>
                    </div>
                  </div>
                  {renderActionButton('₹349')}
                </div>

                {/* Premium Plan */}
                <div className="bg-black rounded-lg border border-white/30 p-5 relative">
                  <div className="absolute -top-3 left-4 bg-emerald-400 text-black px-3 py-1 rounded-full text-sm font-medium">
                    16% off
                  </div>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-semibold mb-1">Premium</h3>
                      <p className="text-gray-400 text-sm">For individuals who needs just the required amount of features.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src={lightningIcon} alt="Premium" className="w-5 h-5" />
                      <div>
                        <span className="text-3xl font-bold">300</span>
                        <span className="text-gray-400 ml-1 text-sm">Credits</span>
                      </div>
                    </div>
                  </div>
                  {renderActionButton('₹899')}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="w-full md:flex-1">
                <p className="text-gray-400 mb-2">For Organizations/Teams</p>
                <h2 className="text-4xl font-bold mb-8">Enterprise grade features</h2>

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
                        Our subscription plan includes unlimited document creations, AI-powered features, unlimited emails and reminders, and access to all document templates.
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      className="w-full py-3 flex items-center justify-between text-left"
                      onClick={() => setActiveFaq(activeFaq === 1 ? null : 1)}
                    >
                      <span className="font-bold">How many team members can I add?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 1 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 1 && (
                      <div className="pt-2 text-gray-400">
                        You can add unlimited team members to your organization's account. Each member will have their own login credentials and access levels.
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
                        No, with the subscription plan you get unlimited document creations and signatures. There are no hidden limits or restrictions.
                      </div>
                    )}
                  </div>

                  <div>
                    <button
                      className="w-full py-3 flex items-center justify-between text-left"
                      onClick={() => setActiveFaq(activeFaq === 4 ? null : 4)}
                    >
                      <span className="font-bold">Do you offer custom solutions?</span>
                      <span className="text-2xl text-gray-400">{activeFaq === 4 ? '-' : '+'}</span>
                    </button>
                    {activeFaq === 4 && (
                      <div className="pt-2 text-gray-400">
                        Yes, we can provide custom solutions for enterprises with specific requirements. Contact our sales team for more details.
                      </div>
                    )}
                  </div>
                  <div/>
                </div>
                <p className="text-sm text-gray-400 mt-4">
                  Still have any doubts or questions? Please Checkout FAQs
                </p>
              </div>

              <div className="w-full md:max-w-xl">
              <div className="bg-black rounded-lg border border-white/30 p-5 md:p-8">
                  <div className="mb-4">
                    <h3 className="text-4xl font-bold mb-2">For Organizations/Teams</h3>
                    <p className="text-gray-400">For teams who needs multiple documents and will have multiple users to manage legalities</p>
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
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">₹{isYearly ? '599' : '699'}</span>
                      <span className="text-gray-400">Per {isYearly ? 'month, billed yearly' : 'month'}</span>
                    </div>
                    {isYearly && (
                      <div className="mt-2 text-sm text-emerald-400">Save 15% with yearly billing</div>
                    )}
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Unlimited Documents</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Unlimited Emails and Remainders</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Fixed Monthly Cost</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Subscription users will get early access to upcoming features</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Priority Support</span>
                    </div>
                  </div>

                  {renderActionButton(`₹${isYearly ? '599' : '699'}`)}
                </div>
              </div>
            </>
          )}
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto mt-40 mb-40">
          <h2 className="text-5xl font-bold text-center mb-2">Frequently asked questions</h2>
          <p className="text-gray-400 text-center mb-8 mx-4 md:mx-[100px]">
            These are the most commonly asked questions about SignFastly. Can't find what you are looking for? Chat with our friendly team!
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
      </div>
    </div>
  );
};

export default Pricing;