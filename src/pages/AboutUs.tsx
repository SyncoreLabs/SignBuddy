import React from 'react';

const AboutUs: React.FC = () => {
    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center py-6 md:py-10">
                        About Us
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 py-8">
                <div className="space-y-8">
                    {/* Mission Section */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Our Mission</h2>
                        <p className="text-gray-300">
                            At SignBuddy, our mission is to revolutionize the way documents are signed and managed digitally. 
                            We strive to provide a secure, efficient, and user-friendly platform that makes digital signatures 
                            accessible to everyone while maintaining the highest standards of security and legal compliance.
                        </p>
                    </section>

                    {/* Who We Are */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Who We Are</h2>
                        <p className="text-gray-300">
                            We are a team of passionate innovators dedicated to transforming document signing into a seamless 
                            digital experience. Founded with the vision of making digital signatures accessible and secure, 
                            SignBuddy has grown into a trusted platform serving individuals and businesses worldwide.
                        </p>
                    </section>

                    {/* Our Values */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Our Values</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-white/5 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">Security First</h3>
                                <p className="text-gray-300">
                                    We prioritize the security of your documents and personal information above all else.
                                </p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                                <p className="text-gray-300">
                                    We continuously evolve our platform with cutting-edge technology.
                                </p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">User Experience</h3>
                                <p className="text-gray-300">
                                    We believe in creating intuitive and accessible solutions for everyone.
                                </p>
                            </div>
                            <div className="bg-white/5 p-4 rounded-lg">
                                <h3 className="text-xl font-semibold mb-2">Reliability</h3>
                                <p className="text-gray-300">
                                    We ensure our services are available and dependable when you need them.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Our Commitment */}
                    <section>
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Our Commitment</h2>
                        <p className="text-gray-300">
                            We are committed to providing a secure and efficient digital signature solution that meets the 
                            highest standards of legal compliance and user privacy. Our platform is designed to make document 
                            signing simple while ensuring the utmost security and authenticity of every signature.
                        </p>
                    </section>

                    {/* Contact Section */}
                    <section className="border-t border-white/10 pt-8">
                        <h2 className="text-2xl md:text-3xl font-semibold mb-4">Get in Touch</h2>
                        <p className="text-gray-300">
                            Have questions or want to learn more about SignBuddy? We'd love to hear from you.
                            Contact us at{' '}
                            <a href="mailto:official@signbuddy.in" className="text-blue-400 hover:text-blue-300">
                                official@signbuddy.in
                            </a>
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;