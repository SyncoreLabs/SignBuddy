import React, { useState } from 'react';

const ReportIssue: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        issueType: 'technical',
        description: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Create mailto link with form data
        const subject = `Issue Report: ${formData.issueType}`;
        const body = `
Name: ${formData.name}
Email: ${formData.email}
Issue Type: ${formData.issueType}
Description: ${formData.description}
        `;

        window.location.href = `mailto:official@signbuddy.in?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Header */}
            <div className="bg-black/80 backdrop-blur-sm border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center py-6 md:py-10">
                        Report an Issue
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-2xl mx-auto px-4 py-8">
                <form onSubmit={handleSubmit} className="space-y-6">
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
                        <label htmlFor="issueType" className="block text-sm font-medium mb-2">
                            Issue Type
                        </label>
                        <select
                            id="issueType"
                            required
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.issueType}
                            onChange={(e) => setFormData({ ...formData, issueType: e.target.value })}
                        >
                            <option value="technical">Technical Issue</option>
                            <option value="account">Account Issue</option>
                            <option value="billing">Billing Issue</option>
                            <option value="security">Security Concern</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium mb-2">
                            Description
                        </label>
                        <textarea
                            id="description"
                            required
                            rows={4}
                            className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>

                    <button
                        type="submit"
                        className="w-full px-6 py-3 bg-white text-black rounded-lg hover:bg-white transition-colors"
                    >
                        Submit Report
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ReportIssue;