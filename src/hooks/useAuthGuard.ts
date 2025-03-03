import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthGuard = (isPublicRoute: boolean) => {
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const hasCompletedSetup = localStorage.getItem('hasCompletedSetup') === 'true';

    if (isAuthenticated && isPublicRoute) {
      navigate('/dashboard', { replace: true });
    } else if (!isAuthenticated && !isPublicRoute) {
      navigate('/login', { replace: true });
    } else if (isAuthenticated && !hasCompletedSetup && window.location.pathname !== '/profile-setup') {
      navigate('/profile-setup', { replace: true });
    }
  }, [isPublicRoute, navigate]);
};