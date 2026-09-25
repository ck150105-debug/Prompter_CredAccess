import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import RegistrationForm from './components/RegistrationForm';
import WorkVerificationModal from './components/WorkVerificationModal';
import Dashboard from './components/Dashboard';
import LoanEligibilityPage from './components/LoanEligibilityPage';
import FinancialPortfolioView from './components/FinancialPortfolioView';
import CertificateView from './components/CertificateView';
import DocumentsPage from './components/DocumentsPage';
import ProfilePage from './components/ProfilePage';
import { api, getAuthToken, setAuthToken } from './api';

export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentTab, setCurrentTab] = useState('dashboard'); // dashboard, portfolio, documents, eligibility, certificate, profile, registration

  // Shared Data
  const [summaryData, setSummaryData] = useState(null);
  const [eligibilityData, setEligibilityData] = useState(null);
  const [loadingInitial, setLoadingInitial] = useState(true);

  // Verification Modal State
  const [verificationModalOpen, setVerificationModalOpen] = useState(false);
  const [modalProfileData, setModalProfileData] = useState(null);
  const [modalPlatforms, setModalPlatforms] = useState([]);

  // Check login on startup
  useEffect(() => {
    checkActiveSession();
  }, []);

  const checkActiveSession = async () => {
    setLoadingInitial(true);
    try {
      const token = getAuthToken();
      if (!token) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setLoadingInitial(false);
        return;
      }
      const user = await api.getCurrentUser();
      if (user && user.id) {
        setCurrentUser(user);
        setIsAuthenticated(true);
        if (!user.profile_completed) {
          setCurrentTab('registration');
        } else {
          setCurrentTab('dashboard');
        }
        await loadCoreFinancialData();
      } else {
        setIsAuthenticated(false);
      }
    } catch (err) {
      console.warn('No active session found', err);
      setIsAuthenticated(false);
      setAuthToken(null);
    } finally {
      setLoadingInitial(false);
    }
  };

  const loadCoreFinancialData = async () => {
    try {
      const [summary, eligibility] = await Promise.all([
        api.getFinancialSummary().catch(() => null),
        api.getEligibility().catch(() => null)
      ]);
      setSummaryData(summary);
      setEligibilityData(eligibility);
    } catch (err) {
      console.error('Failed to load financial summary', err);
    }
  };

  // Auth Callbacks
  const handleAuthSuccess = async (user, profileCompleted) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    if (profileCompleted) {
      setCurrentTab('dashboard');
      await loadCoreFinancialData();
    } else {
      // New user goes to registration form first!
      setCurrentTab('registration');
    }
  };

  const handleLogout = async () => {
    try {
      await api.logout().catch(() => {});
    } finally {
      setAuthToken(null);
      setCurrentUser(null);
      setIsAuthenticated(false);
      setCurrentTab('dashboard');
    }
  };

  // Demo Switcher
  const handleDemoSwitch = async (mode) => {
    try {
      const res = await api.switchDemoUser(mode);
      setAuthToken(res.user_id);
      const user = await api.getCurrentUser();
      setCurrentUser(user);
      setIsAuthenticated(true);
      if (!res.profile_completed) {
        setCurrentTab('registration');
      } else {
        setCurrentTab('dashboard');
      }
      await loadCoreFinancialData();
    } catch (err) {
      console.error('Demo switch failed', err);
    }
  };

  // Triggered when RegistrationForm is submitted
  const handleVerificationTrigger = (profileData, platforms) => {
    setModalProfileData(profileData);
    setModalPlatforms(platforms);
    setVerificationModalOpen(true);
  };

  // Triggered when Work Verification passes
  const handleVerificationComplete = async () => {
    setVerificationModalOpen(false);
    // Refresh user state and financial summary
    const user = await api.getCurrentUser();
    setCurrentUser(user);
    await loadCoreFinancialData();
    // Route to Dashboard
    setCurrentTab('dashboard');
  };

  if (loadingInitial) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
        <div className="text-center">
          <p className="font-extrabold text-xl tracking-tight">CredAccess</p>
          <p className="text-xs text-brand-300 font-medium">Unlocking Credit for the Unbanked</p>
        </div>
      </div>
    );
  }

  // If not logged in, show Landing Page with Auth
  if (!isAuthenticated) {
    return <LandingPage onAuthSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Navbar (visible when authenticated) */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        currentUser={currentUser}
        onLogout={handleLogout}
        onDemoSwitch={handleDemoSwitch}
        eligibilityData={eligibilityData}
      />

      {/* Main View Switcher */}
      <main className="flex-1">
        {currentTab === 'registration' && (
          <RegistrationForm
            currentUser={currentUser}
            onVerificationTrigger={handleVerificationTrigger}
          />
        )}

        {currentTab === 'dashboard' && (
          <Dashboard
            currentUser={currentUser}
            summaryData={summaryData}
            onRefresh={loadCoreFinancialData}
            onNavigateToEligibility={() => setCurrentTab('eligibility')}
            onNavigateToPortfolio={() => setCurrentTab('portfolio')}
          />
        )}

        {currentTab === 'eligibility' && (
          <LoanEligibilityPage
            eligibilityData={eligibilityData}
            summaryData={summaryData}
            onGenerateCertificate={(cert) => setCurrentTab('certificate')}
            onNavigateToPortfolio={() => setCurrentTab('portfolio')}
          />
        )}

        {currentTab === 'portfolio' && (
          <FinancialPortfolioView
            onBackToDashboard={() => setCurrentTab('dashboard')}
            onNavigateToCertificate={() => setCurrentTab('certificate')}
          />
        )}

        {currentTab === 'certificate' && (
          <CertificateView
            onBackToDashboard={() => setCurrentTab('dashboard')}
          />
        )}

        {currentTab === 'documents' && (
          <DocumentsPage
            onNavigateToPortfolio={() => setCurrentTab('portfolio')}
            onNavigateToCertificate={() => setCurrentTab('certificate')}
          />
        )}

        {currentTab === 'profile' && (
          <ProfilePage
            currentUser={currentUser}
            onUpdateSuccess={loadCoreFinancialData}
          />
        )}
      </main>

      {/* Work Verification Modal (Authenticates with mock databases) */}
      <WorkVerificationModal
        isOpen={verificationModalOpen}
        onClose={() => setVerificationModalOpen(false)}
        profileData={modalProfileData}
        platformsToVerify={modalPlatforms}
        onVerificationComplete={handleVerificationComplete}
      />

      {/* Bottom Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 no-print">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 CredAccess Technologies Inc. • Unlocking Credit for the Unbanked</p>
          <p className="text-[11px] text-slate-400">
            Hackathon Demo Prototype • Empowering Gig Workers & Small Vendors with Verified Credit Eligibility
          </p>
        </div>
      </footer>
    </div>
  );
}
