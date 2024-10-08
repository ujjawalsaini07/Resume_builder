import React from "react";

const Footer =()=>{
    return (

            <footer className="w-full bg-gradient-to-t from-green-100 to-white-100 text-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
                <div className="flex items-center space-x-3 mb-6">
                    <img alt="" className="h-11"
                        src="logo.svg" />
                </div>
                <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
                    AI Resume Builder helps you create cleaner, role-focused resumes with AI guidance, modern templates, and live preview editing.
                </p>
                <div className="flex flex-wrap justify-center gap-5 mt-6 text-sm text-slate-600">
                    <a href="#features" className="hover:text-green-700 transition-colors">Features</a>
                    <a href="#testimonials" className="hover:text-green-700 transition-colors">Testimonials</a>
                    <a href="#cta" className="hover:text-green-700 transition-colors">Get Started</a>
                </div>
            </div>
            <div className="border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">
                    <a href="/">AI Resume Builder</a> ©2026. All rights reserved.
                </div>
            </div>
        </footer>



    )

}

export default Footer
