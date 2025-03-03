import React from 'react';
import createIcon from '../../assets/images/create-icon.png';

const Footer: React.FC = () => {
  return (
    <footer className="bg-black/40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-16">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <h1 className="text-2xl font-bold text-white mb-4">SignBuddy</h1>
            <p className="text-gray-400 text-sm">
              SignBuddy simplifies document signing and management with secure, legally-binding electronic signatures. Create, manage, and track your documents all in one place.
            </p>
            <div className="flex gap-4 mt-4">
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white">
                <div className="w-10 h-10 rounded-lg border border-white/30 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
              </a>
              <a href="https://instagram.com" className="text-gray-400 hover:text-white">
                <div className="w-10 h-10 rounded-lg border border-white/30 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                </div>
              </a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white">
                <div className="w-10 h-10 rounded-lg border border-white/30 flex items-center justify-center">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
                </div>
              </a>
            </div>
          </div>

          {/* Links Grid for Mobile */}
          <div className="grid grid-cols-2 md:grid-cols-1 gap-16 col-span-1 md:col-span-2">
            {/* Product Links */}
            <div className="col-span-1 md:col-start-3">
              <h3 className="text-xl font-semibold mb-4">Quick links</h3>
              <ul className="space-y-2">
                <li><a href="/aboutus" className="text-gray-400 hover:text-white">About us</a></li>
                <li><a href="/document" className="text-gray-400 hover:text-white">Document</a></li>
                <li><a href="/pricing" className="text-gray-400 hover:text-white">Pricing</a></li>
                <li><a href="/contact" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div className="col-span-1 md:col-start-4">
              <h3 className="text-xl font-semibold mb-4">Legal & Security</h3>
              <ul className="space-y-2">
                <li><a href="/privacypolicy" className="text-gray-400 hover:text-white">Privacy policy</a></li>
                <li><a href="/termsandconditions" className="text-gray-400 hover:text-white">Terms & Conditions</a></li>
                <li><a href="/securitymeasures" className="text-gray-400 hover:text-white">Security Measures</a></li>
                <li><a href="/compliance" className="text-gray-400 hover:text-white">Compliance</a></li>
              </ul>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="col-span-1 md:col-start-5">
            <h3 className="text-xl font-semibold mb-4">Other links</h3>
            <ul className="space-y-2">
              <li><a href="/faqs" className="text-gray-400 hover:text-white">FAQs</a></li>
              <li><a href="/reportanissue" className="text-gray-400 hover:text-white">Report an issue</a></li>
              <li><a href="/careers" className="text-gray-400 hover:text-white">Careers</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-4 sm:mt-8 pt-2 sm:pt-4 flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-0">
          <p className="text-gray-400 text-sm text-center sm:text-left">Copyright © 2025 SignBuddy. All Rights Reserved.</p>
          <div className="flex items-center gap-2 text-gray-400">
            <img src={createIcon} alt="Create Document" className="w-4 h-4" />
            <span className="text-sm">Powered by</span>
            <span className="font-semibold">Syncore Labs</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
export {};