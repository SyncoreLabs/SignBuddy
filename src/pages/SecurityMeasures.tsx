import React from 'react';

const SecurityMeasures: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold">Security Measures</h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 mb-8">
                        At SignBuddy, security is our top priority. We implement stringent measures to ensure your data, documents, and digital signatures are protected from unauthorized access, cyber threats, and breaches. This page outlines the security practices we follow to safeguard our platform and user information.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
                        <p className="text-gray-300">
                            We are committed to maintaining the highest security standards for digital document signing. Our platform utilizes industry-leading security protocols to protect user data and provide a secure, seamless experience. Whether it's data encryption, secure authentication, or regulatory compliance, we ensure that your sensitive information remains confidential and tamper-proof.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Data Encryption</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">End-to-End Encryption (E2EE):</strong> All data is encrypted using SSL/TLS protocols during transmission to prevent interception by malicious parties.</li>
                            <li><strong className="text-white">At-Rest Encryption:</strong> Documents and personal data are stored using AES-256 encryption, one of the most secure encryption standards.</li>
                            <li><strong className="text-white">Hashed & Salted Passwords:</strong> We utilize cryptographic hashing methods to store passwords securely, preventing unauthorized access.</li>
                            <li><strong className="text-white">Tamper-Proof Document Encryption:</strong> Signed documents are protected with advanced cryptographic techniques, ensuring authenticity and integrity.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. Secure Authentication</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">Multi-Factor Authentication (MFA):</strong> Users can enable additional security layers, such as OTP-based login, authentication apps, or biometric verification.</li>
                            <li><strong className="text-white">Role-Based Access Control (RBAC):</strong> Access to sensitive data and administrative controls is restricted based on predefined roles and permissions.</li>
                            <li><strong className="text-white">Session Expiry & Automatic Logout:</strong> To prevent unauthorized access, inactive sessions are automatically logged out after a specified period.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Infrastructure & Network Security</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">Cloud Security:</strong> Our platform is hosted on secure cloud infrastructure such as AWS, Google Cloud, or Azure, offering data redundancy and disaster recovery solutions.</li>
                            <li><strong className="text-white">Firewalls & Intrusion Detection:</strong> Continuous monitoring of traffic to detect and prevent unauthorized access attempts.</li>
                            <li><strong className="text-white">DDoS Protection:</strong> Mechanisms in place to prevent Distributed Denial-of-Service (DDoS) attacks, ensuring uninterrupted service.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Secure Digital Signatures</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">Legally Binding Signatures:</strong> Our platform adheres to international laws, including eIDAS (EU), ESIGN Act (USA), and IT Act (India).</li>
                            <li><strong className="text-white">Tamper-Proof Audit Trails:</strong> Every signed document maintains a detailed audit trail, including timestamps, IP addresses, and user authentication logs.</li>
                            <li><strong className="text-white">Certificate-Based Signatures:</strong> We use public-key infrastructure (PKI) to verify and validate electronic signatures, ensuring document authenticity.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Account & User Protection</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">Session Timeouts:</strong> Users are automatically logged out after a period of inactivity to enhance security.</li>
                            <li><strong className="text-white">Device & Location Monitoring:</strong> Alerts are triggered when an account is accessed from an unrecognized device or location.</li>
                            <li><strong className="text-white">Access Logs & Notifications:</strong> Users can review their account activity and receive notifications for any suspicious login attempts.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Compliance & Certifications</h2>
                        <p className="text-gray-300 mb-4">We comply with major security and data protection regulations, including:</p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li>General Data Protection Regulation (GDPR) (for European users)</li>
                            <li>California Consumer Privacy Act (CCPA) (for U.S. users)</li>
                            <li>ISO 27001 (industry-standard security certification)</li>
                            <li>SOC 2 Type II (security, availability, and confidentiality compliance)</li>
                            <li>HIPAA Compliance (for handling healthcare-related documents securely)</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. Incident Response & Disaster Recovery</h2>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">24/7 Security Monitoring:</strong> Our security team continuously monitors the platform for potential threats and vulnerabilities.</li>
                            <li><strong className="text-white">Automated Backups:</strong> Regular encrypted backups ensure data is recoverable in case of an outage or system failure.</li>
                            <li><strong className="text-white">Data Breach Response:</strong> In the unlikely event of a data breach, we promptly notify affected users and take immediate corrective actions.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">9. User Responsibilities & Best Practices</h2>
                        <p className="text-gray-300 mb-4">While we implement robust security measures, users are encouraged to take additional steps for protection:</p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">Use Strong Passwords:</strong> Avoid using weak passwords and enable multi-factor authentication (MFA) for enhanced security.</li>
                            <li><strong className="text-white">Beware of Phishing Attacks:</strong> Do not click on suspicious links or provide sensitive information to unverified sources.</li>
                            <li><strong className="text-white">Keep Software Updated:</strong> Ensure that your browser and operating system are up to date to prevent security vulnerabilities.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">10. Reporting Security Issues</h2>
                        <p className="text-gray-300 mb-4">
                            If you believe you have discovered a security vulnerability, we encourage responsible disclosure. Please report security concerns to our dedicated security team at <a href="mailto:official@signbuddy.in" className="text-blue-400 hover:text-blue-300">official@signbuddy.in</a>. We take all reports seriously and investigate them promptly.
                        </p>
                        <p className="text-gray-300 mb-4">
                            By using SignBuddy, you acknowledge our security measures and agree to follow best practices to keep your data safe. We continually update our security framework to address emerging threats and ensure the highest level of protection for our users.
                        </p>
                        <p className="text-gray-300">
                            For further inquiries regarding our security policies, feel free to contact us at <a href="mailto:official@signbuddy.in" className="text-blue-400 hover:text-blue-300">official@signbuddy.in</a>.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default SecurityMeasures;