import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import SignUp from './components/pages/SignUp';
import EmailSuccessPage from './components/email/EmailSuccessPage';
import Pricing from './components/pricing/Pricing';
import Home from './components/pages/Home';
import Document from './components/pages/Document';
import Login from './components/pages/Login';
import ProfileSetup from './components/pages/ProfileSetup';
import Billing from './components/pages/Billing';
import EmailComposePage from './components/email/EmailComposePage';
import DocumentSigning from './components/documents/DocumentSigning';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AccountSettings from './components/pages/AccountSettings';
import DocumentRecipients from './components/documents/DocumentRecipient';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import SecurityMeasures from './pages/SecurityMeasures';
import Compliance from './pages/Compliance';
import Careers from './pages/Careers';
import Faqs from './pages/Faqs';
import ReportIssue from './pages/ReportIssue';
import AboutUs from './pages/AboutUs';
import Contact from './pages/Contact';
import ForgotPassword from './components/pages/ForgotPassword';

function App() {
  return (
    <Routes>
      {/* Public routes with unauthenticated navbar and footer */}
      <Route path="/" element={
        <ProtectedRoute isPublic>
          <Layout showNavbar={true} showFooter={true} isAuthenticated={false}><Home /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/signup" element={
        <ProtectedRoute isPublic>
          <Layout showNavbar={false} showFooter={false} isAuthenticated={false}><SignUp /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/login" element={
        <ProtectedRoute isPublic>
          <Layout showNavbar={false} showFooter={false} isAuthenticated={false}><Login /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/forgotpassword" element={
        <ProtectedRoute isPublic>
          <Layout showNavbar={false} showFooter={false} isAuthenticated={false}><ForgotPassword /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/pricing" element={
        <Layout
          showNavbar={true}
          showFooter={true}
          isAuthenticated={localStorage.getItem('isAuthenticated') === 'true'}
        >
          <Pricing />
        </Layout>
      } />
      <Route path="/termsandconditions" element={
        <Layout
          showNavbar={true}
          showFooter={true}
          isAuthenticated={localStorage.getItem('isAuthenticated') === 'true'}
        >
          <TermsAndConditions />
        </Layout>
      } />
      <Route path="/privacypolicy" element={
        <Layout
          showNavbar={true}
          showFooter={true}
          isAuthenticated={localStorage.getItem('isAuthenticated') === 'true'}
        >
          <PrivacyPolicy />
        </Layout>
      } />
      <Route path="/securitymeasures" element={
        <Layout
          showNavbar={true}
          showFooter={true}
          isAuthenticated={localStorage.getItem('isAuthenticated') === 'true'}
        >
          <SecurityMeasures />
        </Layout>
      } />
      <Route path="/compliance" element={
        <Layout
          showNavbar={true}
          showFooter={true}
          isAuthenticated={localStorage.getItem('isAuthenticated') === 'true'}
        >
          <Compliance />
        </Layout>
      } />
      <Route path="/careers" element={
        <Layout
          showNavbar={true}
          showFooter={true}
          isAuthenticated={localStorage.getItem('isAuthenticated') === 'true'}
        >
          <Careers />
        </Layout>
      } />
      <Route path="/faqs" element={
        <Layout
          showNavbar={true}
          showFooter={true}
          isAuthenticated={localStorage.getItem('isAuthenticated') === 'true'}
        >
          <Faqs />
        </Layout>
      } />
      <Route path="/reportanissue" element={
        <Layout
          showNavbar={true}
          showFooter={true}
          isAuthenticated={localStorage.getItem('isAuthenticated') === 'true'}
        >
          <ReportIssue />
        </Layout>
      } />
      <Route path="/aboutus" element={
        <Layout
          showNavbar={true}
          showFooter={true}
          isAuthenticated={localStorage.getItem('isAuthenticated') === 'true'}
        >
          <AboutUs />
        </Layout>
      } />
      <Route path="/contact" element={
        <Layout
          showNavbar={true}
          showFooter={true}
          isAuthenticated={localStorage.getItem('isAuthenticated') === 'true'}
        >
          <Contact />
        </Layout>
      } />

      {/* Protected routes with authenticated navbar and footer */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout showNavbar={true} showFooter={true} isAuthenticated={true}><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/profile-setup" element={
        <ProtectedRoute isProfileSetup>
          <Layout showNavbar={false} showFooter={false} isAuthenticated={true}>
            <ProfileSetup />
          </Layout>
        </ProtectedRoute>
      } />
      <Route path="/billing" element={
        <ProtectedRoute>
          <Layout showNavbar={true} showFooter={true} isAuthenticated={true}><Billing /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/account-settings" element={
        <ProtectedRoute>
          <Layout showNavbar={true} showFooter={true} isAuthenticated={true}><AccountSettings /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/email-compose" element={
        <ProtectedRoute>
          <Layout showNavbar={true} showFooter={true} isAuthenticated={true}><EmailComposePage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/sign-document" element={
        <ProtectedRoute>
          <Layout showNavbar={false} showFooter={false} isAuthenticated={true}><DocumentSigning /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/email-success" element={
        <ProtectedRoute>
          <Layout showNavbar={true} showFooter={true} isAuthenticated={true}><EmailSuccessPage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/document" element={
        <ProtectedRoute>
          <Layout showNavbar={true} showFooter={true} isAuthenticated={true}><Document /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/document-recipients" element={
        <ProtectedRoute>
          <Layout showNavbar={false} showFooter={false} isAuthenticated={true}><DocumentRecipients /></Layout>
        </ProtectedRoute>
      } />

      {/* 404 page */}
      <Route path="*" element={<Layout showNavbar={false} showFooter={false} isAuthenticated={false}><div>404 Not Found</div></Layout>} />
    </Routes>
  );
}

export default App;