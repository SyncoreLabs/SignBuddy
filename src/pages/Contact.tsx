import React, { useState } from 'react';

const Contact: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        const subject = `Contact: ${formData.subject}`;
        const body = `
Name: ${formData.name}
Email: ${formData.email}
Message: ${formData.message}
        `;

        window.location.href = `mailto:official@signbuddy.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center py-6 md:py-10">
                        Contact Us
                    </h1>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
                            <p className="text-gray-300">
                                Have questions about SignBuddy? We're here to help. Send us a message and we'll respond as soon as possible.
                            </p>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Email</h3>
                                <a href="mailto:official@signbuddy.in" className="text-blue-400 hover:text-blue-300">
                                    official@signbuddy.in
                                </a>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Office Hours</h3>
                                <p className="text-gray-300">Monday - Friday: 9:00 AM - 6:00 PM IST</p>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Response Time</h3>
                                <p className="text-gray-300">We typically respond within 24-48 business hours.</p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white/5 p-6 rounded-lg">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    required
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    required
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    required
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    required
                                    rows={4}
                                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;