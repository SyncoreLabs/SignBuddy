import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  showNavbar?: boolean;
  showFooter?: boolean;
  isAuthenticated?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  showNavbar = true, 
  showFooter = true, 
  isAuthenticated: initialAuthState = false 
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthState);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setIsAuthenticated(false);
          return;
        }

        const response = await fetch('https://server.signbuddy.in/api/v1/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.user) {
            setIsAuthenticated(true);
            localStorage.setItem('isAuthenticated', 'true');
          } else {
            setIsAuthenticated(false);
            localStorage.removeItem('isAuthenticated');
          }
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem('isAuthenticated');
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated');
      }
    };

    verifyAuth();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      {showNavbar && <Navbar isAuthenticated={isAuthenticated} />}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout;