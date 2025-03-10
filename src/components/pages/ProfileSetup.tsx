import React, { useState, useEffect } from 'react';
import { usePageTitle } from '../hooks/usePageTitle';
import { useNavigate } from 'react-router-dom';

interface Avatar {
  key: string;
  url: string;
}

const ProfileSetup = () => {
  usePageTitle('Complete Profile');
  const [username, setUsername] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const avatarsPerPage = 10;
  const totalPages = Math.ceil((avatars.length - 1) / avatarsPerPage); // -1 to exclude the first item

  const navigate = useNavigate();

  useEffect(() => {
    const fetchAvatars = async () => {
      try {
        const response = await fetch('https://server.signbuddy.in/api/v1/getavatars');
        if (!response.ok) throw new Error('Failed to fetch avatars');
        const data = await response.json();
        // Remove the first item as it's just the base path
        setAvatars(data.filter((avatar: Avatar) => avatar.key !== 'avatars/'));
      } catch (error) {
        console.error('Error fetching avatars:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAvatars();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedAvatar && username) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('https://server.signbuddy.in/api/v1/addDetails', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            avatar: selectedAvatar,
            userName: username
          })
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        // Set the hasCompletedSetup flag
        localStorage.setItem('hasCompletedSetup', 'true');
        navigate('/dashboard');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center lg:justify-start">
      {/* Left Section with Illustration */}
      <div className="hidden lg:flex fixed left-0 w-1/2 h-full bg-[#18181B] p-12 flex-col justify-between">
        <div className="max-w-[720px] ml-auto h-full flex flex-col justify-between">
          <h1 className="text-2xl font-bold text-white">SignBuddy</h1>
          <div>
            <img src="/illustrations/office.png" alt="office" className="w-full max-w-xl mx-auto" />
            <blockquote className="mt-8 text-gray-400">
              <p className="text-xl text-[#DADADB]">"SignBuddy has revolutionized our document signing process. What used to take days now happens in minutes, and the interface is incredibly intuitive."</p>
              <footer className="mt-2 text-[#7A7A81]">Sarah Chen, Product Manager at TechFlow</footer>
            </blockquote>
          </div>
        </div>
      </div>

      {/* Right Section with Form */}
      <div className="flex-1 flex flex-col px-4 sm:px-6 lg:ml-[50%] lg:px-20 xl:px-24">
        <div className="max-w-[720px] h-full flex flex-col">
          <div className="flex-1 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto">
              <h1 className="text-3xl font-bold text-center">Choose a Profile Picture</h1>
              <p className="mt-2 text-[#7A7A81] text-center">Select an avatar and username for your account</p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                {isLoading ? (
                  <div className="text-center text-[#7A7A81]">Loading avatars...</div>
                ) : (
                  <div className="grid grid-cols-5 gap-4">
                    {avatars
                      .slice((currentPage - 1) * avatarsPerPage, currentPage * avatarsPerPage)
                      .map((avatar) => (
                        <button
                          key={avatar.key}
                          type="button"
                          onClick={() => setSelectedAvatar(avatar.url)}
                          className={`relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 ${selectedAvatar === avatar.url ? 'border-blue-500' : 'border-transparent'
                            }`}
                        >
                          <img
                            src={avatar.url}
                            alt={`Avatar ${avatar.key}`}
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                        </button>
                      ))}
                  </div>
                )}

                <div className="flex items-center justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="text-[#7A7A81] disabled:opacity-50"
                  >
                    ←
                  </button>
                  <span className="text-[#7A7A81]">{currentPage} of {totalPages}</span>
                  <button
                    type="button"
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="text-[#7A7A81] disabled:opacity-50"
                  >
                    →
                  </button>
                </div>

                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  className="w-full bg-black/5 border border-[#404040] rounded-lg px-4 py-2"
                />

                <button
                  type="submit"
                  className="w-full bg-white text-black rounded-lg px-4 py-2"
                >
                  Continue
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetup;