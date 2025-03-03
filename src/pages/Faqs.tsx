import React, { useState } from 'react';

interface FaqItem {
    question: string;
    answer: string;
}

const Faqs: React.FC = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    const faqs: FaqItem[] = [
        {
            question: "What is SignBuddy?",
            answer: "SignBuddy is a digital signature platform that allows you to securely sign, send, and manage documents online. Our platform ensures legal compliance and provides a seamless signing experience for all users."
        },
        {
            question: "Is SignBuddy legally compliant?",
            answer: "Yes, SignBuddy is fully compliant with major e-signature laws including ESIGN Act (USA), eIDAS (EU), and IT Act (India). Our signatures are legally binding and accepted worldwide."
        },
        {
            question: "How secure is SignBuddy?",
            answer: "We implement bank-level security measures including AES-256 encryption, SSL/TLS protocols, and multi-factor authentication. All documents and signatures are protected with advanced security features and regular security audits."
        },
        {
            question: "What types of documents can I sign?",
            answer: "You can sign virtually any type of document including PDFs, Word documents, contracts, agreements, forms, and more. Our platform supports multiple file formats for maximum flexibility."
        },
        {
            question: "How many documents can I sign?",
            answer: "Free users receive 30 credits per month. Each document operation (upload, signature, or authentication) uses one credit. Premium plans offer additional credits and features."
        },
        {
            question: "How long are my documents stored?",
            answer: "Documents are securely stored until you choose to delete them. We recommend downloading and backing up your important documents regularly."
        },
        {
            question: "Can I use SignBuddy on mobile devices?",
            answer: "Yes, SignBuddy is fully responsive and works on all devices including smartphones and tablets. You can sign documents anywhere, anytime."
        },
        {
            question: "What happens if I run out of credits?",
            answer: "When you run out of credits, you can either wait for the next month's free credits or upgrade to a premium plan for additional credits and features."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center py-6 md:py-10">
                        FAQs
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-6">
                <div className="space-y-2">
                    {faqs.map((faq, index) => (
                        <div 
                            key={index}
                            className="border border-white/10 rounded-lg overflow-hidden"
                        >
                            <button
                                className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-white/5"
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                            >
                                <span className="text-base md:text-lg font-semibold">{faq.question}</span>
                                <span className="text-xl transform transition-transform duration-200" style={{
                                    transform: openIndex === index ? 'rotate(45deg)' : 'rotate(0deg)'
                                }}>
                                    +
                                </span>
                            </button>
                            {openIndex === index && (
                                <div className="px-4 py-3 bg-white/5">
                                    <p className="text-gray-300 text-sm md:text-base">{faq.answer}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Faqs;