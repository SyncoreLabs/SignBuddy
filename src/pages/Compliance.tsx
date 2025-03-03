import React from 'react';

const Compliance: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold">Compliance Policy</h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 mb-8">
                        At SignBuddy, we are committed to ensuring full compliance with global security, privacy, and regulatory standards. Our platform is designed to meet legal requirements for digital signatures, data protection, and financial transactions, ensuring a safe and trustworthy experience for our users. Compliance is a fundamental aspect of our operations, helping us maintain transparency, reliability, and trust with our customers, partners, and stakeholders.
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">1. Introduction to Compliance</h2>
                        <p className="text-gray-300 mb-4">
                            Compliance is a key component of our commitment to protecting user data, maintaining platform security, and upholding the legal validity of electronic signatures. We follow strict security frameworks and industry best practices to ensure our users' information remains confidential and secure. Our compliance policies are designed to align with international, national, and industry-specific regulations, ensuring that all digital transactions conducted on our platform remain legally binding and protected against fraud or unauthorized modifications.
                        </p>
                        <p className="text-gray-300">
                            We continuously review and update our compliance frameworks to adapt to evolving regulatory landscapes and industry advancements. Our compliance measures extend across all areas of our platform, from user data protection to the validity of digital signatures and secure financial transactions.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">2. Legal and Regulatory Compliance</h2>
                        <p className="text-gray-300 mb-4">
                            Our platform adheres to key global regulations, ensuring that all electronic signatures and stored documents comply with legal standards:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">GDPR (General Data Protection Regulation - EU):</strong> Ensures data privacy and security for EU citizens by enforcing strict regulations on how businesses collect, process, and store personal data.</li>
                            <li><strong className="text-white">CCPA (California Consumer Privacy Act - USA):</strong> Grants California residents greater control over their personal data, including the right to access, delete, and restrict data usage.</li>
                            <li><strong className="text-white">IT Act, 2000 (India):</strong> Regulates digital transactions, e-signatures, and cybersecurity within India, ensuring the legality of electronically signed documents.</li>
                            <li><strong className="text-white">eIDAS Regulation (EU):</strong> Establishes a legal framework for secure and trusted electronic transactions across the European Union, making electronic signatures as legally binding as handwritten ones.</li>
                            <li><strong className="text-white">ESIGN Act (USA):</strong> Recognizes the legal validity of electronic signatures and digital contracts in the United States, ensuring enforceability in business and legal settings.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">3. Security Compliance Certifications</h2>
                        <p className="text-gray-300 mb-4">
                            We adhere to strict security frameworks to protect user data and documents from unauthorized access and cyber threats:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">ISO 27001:</strong> A globally recognized standard for information security management, ensuring robust protection of digital assets.</li>
                            <li><strong className="text-white">SOC 2 Type II:</strong> Ensures security, availability, and confidentiality of user data by maintaining high industry standards for handling sensitive information.</li>
                            <li><strong className="text-white">HIPAA Compliance:</strong> Required for handling healthcare-related documents securely, ensuring privacy and confidentiality for medical records and electronic health information.</li>
                            <li><strong className="text-white">PCI DSS Compliance:</strong> Governs secure payment processing and protection of financial transactions, preventing fraud and unauthorized access to user payment data.</li>
                            <li><strong className="text-white">NIST Cybersecurity Framework:</strong> Implements best practices for identifying, detecting, and mitigating cybersecurity risks, ensuring a proactive approach to security and compliance.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">4. Data Protection & Privacy Policies</h2>
                        <p className="text-gray-300 mb-4">
                            Protecting user privacy is a top priority. Our compliance with GDPR, CCPA, and other privacy laws includes:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">User Rights:</strong> Users have the right to access, modify, or delete their personal data at any time.</li>
                            <li><strong className="text-white">Data Encryption:</strong> All stored and transmitted data is encrypted using AES-256 and SSL/TLS protocols, ensuring protection against unauthorized access.</li>
                            <li><strong className="text-white">Secure Document Storage:</strong> Documents remain stored securely until users delete them or close their accounts, ensuring control over sensitive files.</li>
                            <li><strong className="text-white">Anonymization & Pseudonymization:</strong> Where applicable, we utilize data anonymization techniques to further enhance privacy protection and security.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">5. Electronic Signature Compliance</h2>
                        <p className="text-gray-300 mb-4">
                            SignBuddy ensures that electronic signatures created on our platform are legally valid and enforceable. Our compliance measures include:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">Audit Trails & Tamper-Proof Technology:</strong> Every signed document includes timestamps, IP addresses, and authentication records, ensuring complete traceability.</li>
                            <li><strong className="text-white">Certificate-Based Authentication:</strong> We leverage public-key infrastructure (PKI) to verify the authenticity and integrity of digital signatures, preventing fraud.</li>
                            <li><strong className="text-white">Multi-Level Verification:</strong> Additional layers of verification, such as email authentication and biometric identification (if applicable), ensure enhanced security for signed documents.</li>
                            <li><strong className="text-white">Blockchain-Based Signature Integrity:</strong> (Upcoming Feature) We are actively exploring blockchain technology to further enhance the integrity and security of signed documents.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">6. Financial & Transaction Compliance</h2>
                        <p className="text-gray-300 mb-4">
                            We follow strict guidelines for handling financial transactions securely and in compliance with relevant regulations:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">PCI DSS Compliance:</strong> Ensures secure processing of payments and storage of sensitive financial information.</li>
                            <li><strong className="text-white">Fraud Prevention & Transaction Monitoring:</strong> Real-time fraud detection and AI-driven anomaly detection to prevent unauthorized access to financial transactions.</li>
                            <li><strong className="text-white">Secure Payment Gateways:</strong> We partner with industry-leading payment providers to ensure highly secure, encrypted financial transactions.</li>
                            <li><strong className="text-white">Compliance with Tax Regulations:</strong> Ensures compliance with national and international tax regulations for seamless transactions and accurate reporting.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">7. Risk Management & Audits</h2>
                        <p className="text-gray-300 mb-4">
                            We conduct frequent security audits and risk assessments to safeguard our platform. Our risk mitigation strategies include:
                        </p>
                        <ul className="list-disc pl-6 text-gray-300 space-y-2">
                            <li><strong className="text-white">Regular Compliance Reviews:</strong> Continuous monitoring of new regulatory changes and security standards.</li>
                            <li><strong className="text-white">Automated Threat Detection:</strong> AI-driven threat detection systems identify unauthorized access attempts and security vulnerabilities in real time.</li>
                            <li><strong className="text-white">Incident Response Plan:</strong> A well-defined data breach response policy, including immediate user notifications and security patches in case of breaches.</li>
                            <li><strong className="text-white">Employee Security Training:</strong> All employees undergo security awareness training to ensure compliance with best security practices.</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">8. Reporting & Transparency</h2>
                        <p className="text-gray-300">
                            We maintain full transparency in our compliance efforts. Users receive regular updates regarding policy changes, security improvements, and compliance regulations. We provide easy access to our security and compliance policies to ensure users stay informed about how their data is managed.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-4">9. Contact for Compliance Issues</h2>
                        <p className="text-gray-300 mb-4">
                            If you have any compliance-related inquiries, concerns, or wish to report a potential security issue, please contact our dedicated compliance team at{' '}
                            <a href="mailto:official@signbuddy.in" className="text-blue-400 hover:text-blue-300">
                                official@signbuddy.in
                            </a>
                            . We take compliance seriously and work diligently to ensure that our platform remains secure, legally compliant, and user-friendly.
                        </p>
                        <p className="text-gray-300 mb-4">
                            By using SignBuddy, you acknowledge our compliance policies and agree to operate within the framework of global legal and security regulations. We continuously update our policies to provide the highest level of security, reliability, and legal integrity for our users and their digital transactions.
                        </p>
                        <p className="text-gray-300">
                            For further information, contact our support team at{' '}
                            <a href="mailto:official@signbuddy.in" className="text-blue-400 hover:text-blue-300">
                                official@signbuddy.in
                            </a>
                            .
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Compliance;