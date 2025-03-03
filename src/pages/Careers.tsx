import React from 'react';

const Careers: React.FC = () => {
    return (
        <div className="min-h-screen flex flex-col justify-center bg-black text-white">
            {/* Header */}
            <div className="bg-black/80 backdrop-blur-sm ">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-5xl md:text-6xl lg:text-8xl font-bold text-center ">
                        CAREERS
                    </h1>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="prose prose-invert max-w-none">
                    <p className="text-gray-300 text-sm md:text-sm lg:text-lg text-center mb-8 px-4 md:px-8 lg:px-16">
                        There is always room for amazing people, if you think you could collaborate with us or work with us anyway send us your details and CV/Resume at our below mail
                    </p>
                    
                    <div className="text-center px-4">
                        <a 
                            href="mailto:official@signbuddy.in" 
                            className="text-blue-400 hover:text-blue-300 text-xl md:text-lg lg:text-lg font-semibold break-words"
                        >
                            official@signbuddy.in
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Careers;