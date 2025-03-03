import React from 'react';

const PrivacyPolicy: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold">Privacy Policy</h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 mb-8">
                        Welcome to SignBuddy. Your privacy is important to us. This Privacy Policy explains how we collect, use, store, and protect your personal data when you use our digital signing platform. We encourage you to read this policy carefully to understand how we handle your data and what rights you have as a user of our service.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                        <p className="text-gray-300 mb-4">
                            We are committed to protecting your personal information and ensuring compliance with applicable privacy laws, including the General Data Protection Regulation (GDPR), California Consumer Privacy Act (CCPA), and India's Information Technology Act, 2000.
                        </p>
                        <p className="text-gray-300">
                            By using our platform, you consent to the collection, use, and sharing of your information as described in this Privacy Policy. We regularly update our practices to comply with evolving regulations and industry standards, ensuring that your personal and document data remains secure at all times.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
                        <p className="text-gray-300 mb-4">
                            We collect different types of information to provide and improve our services. The information collected includes, but is not limited to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">Personal Information:</strong> Name, email address, phone number, billing details, and any information provided during account creation.</li>
                            <li><strong className="text-white">Document Data:</strong> Any files uploaded for signing, reviewing, or storage. These documents are securely stored and remain available until the user chooses to delete them or the account is closed.</li>
                            <li><strong className="text-white">Usage Data:</strong> Device type, browser details, IP address, time of access, cookies, and log files. This data helps us improve user experience, troubleshoot issues, and enhance platform security.</li>
                            <li><strong className="text-white">Communication Data:</strong> Any messages or support requests submitted to us, as well as responses and resolutions provided by our support team.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
                        <p className="text-gray-300 mb-4">
                            We use collected information for the following purposes:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li className="text-white">To provide secure digital signing services and ensure documents are authenticated.</li>
                            <li className="text-white">To verify user identity and prevent fraudulent activities.</li>
                            <li className="text-white">To maintain and improve platform performance, security, and user experience.</li>
                            <li className="text-white">To communicate service updates, security alerts, and promotional materials (users may opt out of marketing emails).</li>
                            <li className="text-white">To comply with legal obligations and assist law enforcement when necessary.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. How We Protect Your Information</h2>
                        <p className="text-gray-300 mb-4">
                        We take security seriously and implement stringent measures to safeguard user data. These include:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">Encryption:</strong> All sensitive data, including documents and personal information, is encrypted both in transit and at rest.</li>
                            <li><strong className="text-white">Access Controls:</strong>Only authorized personnel have access to user data, and strict authentication methods are in place.</li>
                            <li><strong className="text-white">Regular Security Audits:</strong>Our systems undergo periodic security reviews to identify and address potential vulnerabilities.</li>
                            <li><strong className="text-white">User-Controlled Privacy Settings: </strong>Users can configure their privacy settings to limit data visibility and adjust security preferences.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Data Storage & Retention Policy</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li className="text-white">All documents uploaded by users will remain stored indefinitely unless the user decides to delete them.</li>
                            <li className="text-white">If a user deletes their account, all their data, including personal information and documents, will be permanently removed from our system.</li>
                            <li className="text-white">Users can also manually delete specific documents at any time, and once deleted, they cannot be recovered.</li>
                            <li className="text-white">We do not impose automatic document deletion policies; users have full control over their files unless required by law.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Data Sharing & Third Parties</h2>
                        <p className="text-gray-300 mb-4">
                        We do not sell your data. However, we may share necessary information with:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li className="text-white">Cloud storage providers for document retention and security.</li>
                            <li className="text-white">Payment processors for handling transactions and subscription billing.</li>
                            <li className="text-white">Legal authorities when required to comply with applicable laws and regulations.</li>
                            <li className="text-white">Third-party analytics tools to improve platform functionality and user experience.</li>
                            <li className="text-white">Any third parties with whom we share data must comply with strict security and privacy regulations to ensure user information remains protected.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Cookies & Tracking Technologies</h2>
                        <p className="text-gray-300 mb-4">
                        We use cookies and similar tracking technologies to enhance user experience, optimize platform performance, and analyze site traffic. Users can manage cookie preferences via browser settings or opt out of non-essential tracking technologies.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. User Rights & Data Control</h2>
                        <p className="text-gray-300 mb-4">
                        Users have the right to:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li className="text-white">Access their stored personal information and request a copy of it.</li>
                            <li className="text-white">Edit or correct inaccurate data.</li>
                            <li className="text-white">Delete their account and associated data at any time.</li>
                            <li className="text-white">Manage communication preferences and opt out of marketing emails.</li>
                            <li className="text-white">Restrict data processing under certain conditions, as permitted by applicable laws.</li>
                        </ul>
                        <p className="text-gray-300 mb-4">
                        If users wish to exercise these rights, they can contact us through the <a href="mailto:official@signbuddy.in" className="text-blue-400 hover:text-blue-300">official@signbuddy.in</a> provided below.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">9. Compliance with Legal Authorities</h2>
                        <p className="text-gray-300 mb-4">
                        We may disclose user data in response to legal requests, court orders, or regulatory requirements. However, we will only share the minimum necessary information required by law and will notify affected users whenever possible.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
                        <p className="text-gray-300 mb-4">
                        We may update this policy periodically to reflect changes in regulations, security practices, or our service offerings. Users will be notified of significant changes, and continued use of our platform constitutes acceptance of the updated terms.
                        </p>
                        <p className="text-gray-300 mb-4">
                        To ensure transparency, we recommend users review this policy regularly to stay informed about how their data is handled.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">11. Contact Information</h2>
                        <p className="text-gray-300 mb-4">
                            For privacy-related questions, data access requests, or concerns, users can reach out to us at:
                        </p>
                        <p className="text-gray-300">
                            Support Email: <a href="mailto:official@signbuddy.in" className="text-blue-400 hover:text-blue-300">official@signbuddy.in</a>
                        </p>
                        <p className="text-gray-300 mt-4">
                            By using our service, you acknowledge and agree to this Privacy Policy. We value your trust and are committed to protecting your personal information and digital documents with the highest level of security and transparency.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;