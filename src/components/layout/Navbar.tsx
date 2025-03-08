import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import creditsIcon from '../../assets/images/credits-icon.png';
import { useNavigate } from 'react-router-dom';

interface UserData {
  user: {
    email: string;
    userName: string;
    avatar: string;
    credits: number;
  };
}

const Navbar: React.FC<{ isAuthenticated?: boolean }> = ({ isAuthenticated = false }) => {
  // const [isDark, setIsDark] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [userData, setUserData] = useState<UserData | null>(null);
  const location = useLocation();
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const profileButtonRef = useRef<HTMLButtonElement>(null);
  const userName = localStorage.getItem('userName');
  const userEmail = localStorage.getItem('userEmail');
  const userAvatar = localStorage.getItem('userAvatar');
  const userCredits = localStorage.getItem('userCredits');
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear all authentication-related items from localStorage
    localStorage.clear(); // Clear all localStorage items
    setUserData(null); // Clear user data from state
    setIsProfileOpen(false); // Close profile menu

    // Navigate and reload
    navigate('/', { replace: true });
    window.location.reload();
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await fetch('https://server.signbuddy.in/api/v1/me', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        if (data.user) {
          setUserData(data);
          // Store user data in localStorage
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userName', data.user.userName);
          localStorage.setItem('userEmail', data.user.email);
          localStorage.setItem('userAvatar', data.user.avatar);
          localStorage.setItem('userCredits', data.user.credits.toString());
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('userName');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userAvatar');
        localStorage.removeItem('userCredits');
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target as Node) &&
        !profileButtonRef.current?.contains(event.target as Node)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // const toggleTheme = () => {
  //   setIsDark(!isDark);
  // };

  const authenticatedLinks = (
    <>
      <Link 
        to="" 
        className="relative text-gray-400 transition-colors flex items-center gap-2"
      >
        <span>Create with AI</span>
        <span className="bg-[#FBB03B] text-black text-xs px-2 py-0.5 rounded-full">Coming soon</span>
      </Link>
      <Link to="/document" className={`${location.pathname === '/document' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}>
        Document
      </Link>
      <Link to="/dashboard" className={`${location.pathname === '/dashboard' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}>
        Dashboard
      </Link>
      <Link to="/pricing" className={`${location.pathname === '/pricing' ? 'text-white' : 'text-gray-400'} hover:text-white transition-colors`}>
        Pricing
      </Link>
    </>
  );

  const publicLinks = (
    <>
      <Link to="/pricing" className="text-gray-400 hover:text-white transition-colors">
        Pricing
      </Link>
    </>
  );

  return (
    <nav className="py-4 px-3 sm:py-6 sm:px-8">
      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-12">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center">
            <span className="text-xl sm:text-2xl font-bold text-white">SignBuddy</span>
          </Link>
          <div className="hidden lg:flex items-center gap-8">
            {isAuthenticated ? authenticatedLinks : publicLinks}
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* <button
            onClick={toggleTheme}
            className="hidden lg:block p-2 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            {isDark ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button> */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-1 sm:p-2 text-white"
          >
            <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {isAuthenticated && userData?.user ? (
            <div className="relative">
              <button
                ref={profileButtonRef}
                onClick={(e) => {
                  e.stopPropagation();
                  setIsProfileOpen(!isProfileOpen);
                }}
                className="flex items-center gap-2 rounded-full hover:bg-black/40"
              >
                <img
                  src={userAvatar || undefined}
                  alt="Profile"
                  className="w-9 h-9 rounded-full object-cover"
                />
              </button>

              {isProfileOpen && (
                <div ref={profileMenuRef} className="absolute right-0 mt-2 w-56 bg-black rounded-lg shadow-lg py-1 border border-white/30 z-[100]">
                  <div className="px-4 py-2">
                    <div className="text-sm font-bold text-white">{userName}</div>
                    <div className="text-xs font-bold text-gray-400">{userEmail}</div>
                    <div className="flex items-center gap-2 mt-2 px-3 py-1.5 bg-[#212121] rounded-md mx-[-5px]">
                      <img
                        src={creditsIcon}
                        alt="Credits"
                        className="w-4 h-4"
                      />
                      <div className="text-xs">
                        <span className="text-white font-bold">{userCredits}</span>
                        <span className="text-gray-400"> credits</span>
                      </div>
                    </div>
                  </div>
                  <div className="px-3 py-1">
                    <hr className="border-white/20" />
                  </div>
                  <Link to="/account-settings" className="block px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white hover:bg-black/60">
                    Account Settings
                  </Link>
                  <Link to="/billing" className="block px-4 py-2 text-sm font-semibold text-gray-400 hover:text-white hover:bg-black/60">
                    Billing
                  </Link>
                  <Link
                    to="/"
                    onClick={handleLogout}  // Replace the inline function with handleLogout
                    className="block px-4 py-2 text-sm text-red-500 hover:bg-black/60"
                  >
                    Log out
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <Link to="/signup" className="bg-white text-black px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg text-sm sm:text-base hover:bg-gray-200 transition-colors">
              Get Started
            </Link>
          )}
        </div>

        {/* Mobile Menu */}
        <div className={`${isMenuOpen ? 'flex' : 'hidden'} lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50`} onClick={() => setIsMenuOpen(false)}>
          <div className="fixed right-0 top-0 h-full w-64 bg-[#18181B] p-6 shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="flex flex-col gap-6">
              {isAuthenticated ? authenticatedLinks : publicLinks}
              {/* <button
                onClick={toggleTheme}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
              >
                {isDark ? 'Light Mode' : 'Dark Mode'}
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d={isDark ? "M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" : "M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"} />
                </svg>
              </button> */}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;