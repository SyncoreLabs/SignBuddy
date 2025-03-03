import React from 'react';

const TermsAndConditions: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold">Our Terms and Conditions</h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="prose prose-invert max-w-none">
                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Definitions</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>"Service" refers to SignBuddy and all related features, including document signing, storage, and authentication.</li>
                            <li>"User" refers to anyone who accesses or uses our platform, including individuals and businesses.</li>
                            <li>"Document" means any file uploaded for signing, review, or storage within our platform.</li>
                            <li>"Electronic Signature" means a legally recognized digital signature used for authenticating documents and agreements.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. User Responsibilities</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Users must provide accurate and lawful information when registering and using the platform.</li>
                            <li>Users must not engage in fraudulent activities, including forging signatures, submitting false documents, or misrepresenting identity.</li>
                            <li>Users are responsible for securing their account credentials and must not share login details with others.</li>
                            <li>Users should ensure compliance with local, national, and international laws when using our platform for signing documents.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. Legality of Electronic Signatures</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Our platform complies with applicable laws such as the ESIGN Act (USA), eIDAS Regulation (EU), and IT Act, 2000 (India).</li>
                            <li>Electronic signatures processed through our service hold the same legal status as traditional signatures and are legally binding where applicable.</li>
                            <li>Users must ensure that the parties involved in the signing process agree to the use of electronic signatures.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Account Security</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Users must maintain the confidentiality of their login credentials and are solely responsible for any activities performed under their account.</li>
                            <li>Any unauthorized use of an account must be reported immediately to our support team to prevent misuse.</li>
                            <li>We implement industry-standard security measures, but users acknowledge that no online platform is completely secure.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Prohibited Uses</h2>
                        <p className="text-gray-300 mb-4">
                            Users must NOT:            
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Upload, sign, or distribute illegal, fraudulent, or unauthorized documents.</li>
                            <li>Use the service for spam, phishing, deceptive activities, or any fraudulent purposes.</li>
                            <li>Attempt to hack, disrupt, or interfere with the platform’s security or operations.</li>
                            <li>Engage in any activity that violates applicable laws, regulations, or the rights of other users.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Subscription, Credits & Payment</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Free users are credited 30 credits per month, which can be used for all features available on the website, including document uploads, signatures, and authentication.</li>
                            <li>Paid plans allow users to purchase additional credits or subscribe to premium features.</li>
                            <li>Subscription fees are non-refundable unless explicitly stated in our refund policy.</li>
                            <li>We reserve the right to modify pricing and credit allocation, with prior notice to users.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Document Storage & Retention</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Documents will be securely stored for a limited time period.</li>
                            <li>Users are responsible for downloading their documents before they are automatically deleted from our system.</li>
                            <li>We do not guarantee indefinite document storage and may remove inactive documents after a certain period.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. Privacy Policy</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>Our Privacy Policy outlines how user data is collected, stored, used, and protected. <a href="/privacypolicy" className="text-blue-400 hover:text-blue-300">Privacy policy</a></li>
                            <li>We take user privacy seriously and do not share personal data with third parties without consent.</li>
                            <li>Users have the right to request access to their stored data and modify or delete their account information as per our policy.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">9. Termination & Account Suspension</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>We reserve the right to terminate or suspend accounts that violate these terms or engage in any fraudulent or harmful activities.</li>
                            <li>Users may request account deletion by contacting support, but they will lose access to stored documents and credits.</li>
                            <li>We are not responsible for any loss of data due to account suspension or termination.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">10. Limitation of Liability</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>We are not liable for any data loss, unauthorized access, system failures, or service disruptions beyond our control.</li>
                            <li>Users acknowledge that digital services may be subject to technical issues, and we do not guarantee 100% uptime.</li>
                            <li>Users agree to use the service at their own risk and waive any claims against us for incidental damages.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">11. Dispute Resolution & Governing Law</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>These terms are governed by the laws of India.</li>
                            <li>Disputes shall be resolved through arbitration or legal proceedings in Law.</li>
                            <li>Users must attempt to resolve disputes informally before resorting to legal action.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">12. Changes to Terms</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>We may update these Terms and Conditions at any time to reflect changes in law, policies, or service improvements.</li>
                            <li>Users will be notified of significant changes, and continued use of the service constitutes acceptance of the updated terms.</li>
                            <li>Users are encouraged to periodically review these terms for updates.</li>
                            <li>By using our service, you acknowledge and agree to these Terms and Conditions.</li>
                            <li>For any questions, please contact us at <a href="mailto:official@signbuddy.in" className="text-blue-400 hover:text-blue-300">official@signbuddy.in</a>.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;