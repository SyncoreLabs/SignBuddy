import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-white py-16">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Refund & Cancellation Policy</h1>
        
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">1. Introduction</h2>
          <p className="text-gray-300 mb-4">
            SignBuddy ("we," "our," or "us") provides digital signing services to our users ("you"). 
            This Refund & Cancellation Policy describes the circumstances under which refunds or cancellations may be considered. 
            By using SignBuddy, you agree to this policy and our{' '}
            <Link to="/terms-of-service" className="text-blue-400 hover:text-blue-300 underline">
              Terms of Service
            </Link>.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">2. General Refund Policy</h2>
          <h3 className="text-lg font-medium mb-2">No Refunds by Default</h3>
          <p className="text-gray-300 mb-4">
            Except as outlined below, all purchases of credits, subscriptions, or other services on SignBuddy are final. 
            We encourage you to review our features and pricing carefully before making a purchase.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">3. Limited Exceptions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Extended Service Downtime</h3>
              <p className="text-gray-300">
                In the rare event of a complete platform outage lasting more than [X hours/days], 
                we may, at our discretion, issue account credits. Full monetary refunds are not provided.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Duplicate Charges or Billing Errors</h3>
              <p className="text-gray-300">
                If a verifiable billing mistake occurs (e.g., double-charged in a single transaction), 
                contact Support. We'll investigate and may credit your account for the erroneous charge.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Legal Obligations</h3>
              <p className="text-gray-300">
                In certain jurisdictions, consumer protection laws may require limited refunds. 
                We will comply with such obligations, but only to the extent mandated by law.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">4. Requesting Consideration for Refunds</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Contact Support</h3>
              <p className="text-gray-300">
                Email{' '}
                <a href="mailto:official@signbuddy.com" className="text-blue-400 hover:text-blue-300 underline">
                  official@signbuddy.com
                </a>{' '}
                with your account details, transaction references, 
                and a clear explanation. Our Support team will respond within [3] business days.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Investigation</h3>
              <p className="text-gray-300">
                We may request additional details to confirm eligibility under this policy. 
                Approval is at our sole discretion.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Outcome</h3>
              <p className="text-gray-300">
                If your request is granted, we typically offer credits to your SignBuddy account. 
                Monetary refunds are rarely provided and only if legally required.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">5. Subscription Cancellation</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Monthly Subscription</h3>
              <p className="text-gray-300">
                You can cancel at any time, effective at the end of the current billing cycle. 
                No prorated refunds apply for unused portions of the cycle.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Annual Subscription</h3>
              <p className="text-gray-300">
                Annual plans can be canceled anytime, but refunds are not provided for remaining months. 
                You retain access to features until your current term ends.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">6. Account Termination</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">User-Initiated Closure</h3>
              <p className="text-gray-300">
                If you close your account voluntarily, any remaining credits or subscription time is forfeited. 
                No refunds will be given.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-medium mb-2">Policy Violations</h3>
              <p className="text-gray-300">
                If we terminate your account for breaching our Terms of Service (e.g., fraud, illegal use), 
                no refunds or credit transfers are provided.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">7. Chargebacks & Disputes</h2>
          <p className="text-gray-300">
            If we receive a chargeback or payment dispute, we reserve the right to suspend or terminate 
            your account while the issue is reviewed. Fees or penalties resulting from such disputes 
            may be charged back to you.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">8. Policy Updates</h2>
          <p className="text-gray-300">
            We may update this Refund & Cancellation Policy from time to time. Material changes will be 
            posted on our website or sent via email. Continued use of SignBuddy after updates signifies 
            acceptance of the revised terms.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">9. Contact Us</h2>
          <p className="text-gray-300">
            For any questions about this policy, please reach out to:
          </p>
          <div className="mt-4">
            <p className="text-gray-300">
              Email:{' '}
              <a href="mailto:official@signbuddy.com" className="text-blue-400 hover:text-blue-300 underline">
                official@signbuddy.com
              </a>
            </p>
            <p className="text-gray-300">
              Website:{' '}
              <Link to="/contact" className="text-blue-400 hover:text-blue-300 underline">
                www.signbuddy.com/contact
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default RefundPolicy;