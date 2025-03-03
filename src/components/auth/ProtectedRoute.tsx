import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
  isPublic?: boolean;
  isProfileSetup?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, isPublic = false, isProfileSetup = false }) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const hasCompletedSetup = localStorage.getItem('hasCompletedSetup') === 'true';

  if (isPublic && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isPublic && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isProfileSetup) {
    // If user has completed setup or is not authenticated, redirect to appropriate page
    if (!isAuthenticated || hasCompletedSetup) {
      return <Navigate to="/dashboard" replace />;
    }
  } else if (isAuthenticated && !hasCompletedSetup && !isPublic) {
    // Force incomplete profile users to complete setup
    return <Navigate to="/profile-setup" replace />;
  }
  if (isPublic && isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  // Handle protected routes
  if (!isPublic && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isPublic && !hasCompletedSetup && !isProfileSetup && isAuthenticated) {
    return <Navigate to="/profile-setup" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;