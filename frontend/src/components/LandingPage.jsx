import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle, 
  ArrowRight, 
  Briefcase, 
  TrendingUp, 
  FileCheck2, 
  Sparkles,
  Lock,
  Mail,
  UserCheck,
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { api, setAuthToken } from '../api';

export default function LandingPage({ onAuthSuccess }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (isSignUp && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      if (isSignUp) {
        // Register NEW USER -> starts with 100% blank registration form -> work verification -> dashboard
        const res = await api.register({
          email: email.trim(),
          password,
          confirm_password: confirmPassword
        });
        setAuthToken(res.token);
        // Important: false = profile not completed -> open blank registration form!
        onAuthSuccess(res, false);
      } else {
        // Sign in EXISTING USER -> dashboard directly if completed, or registration if incomplete
        const res = await api.login({
          email: email.trim(),
          password
        });
        setAuthToken(res.token);
        onAuthSuccess(res, res.profile_completed);
      }
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemo = async (mode) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.switchDemoUser(mode);
      setAuthToken(res.user_id);
      onAuthSuccess({
        id: res.user_id,
        username: mode === 'arun' ? 'arun@credaccess.demo' : mode === 'ravi' ? 'ravi@credaccess.demo' : 'fresh.worker@credaccess.demo',
        full_name: res.name,
        profile_completed: res.profile_completed
      }, res.profile_completed);
    } catch (err) {
      setError(err.message || 'Could not load demo persona.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-brand-950 to-slate-900 text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 -right-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none"></div>

      {/* Top Header */}
      <header className="max-w-7xl w-full mx-auto px-6 py-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-600 to-sky-400 flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="font-extrabold text-2xl tracking-tight text-white">CredAccess</span>
            <p className="text-xs text-brand-300 font-medium tracking-wide">Unlocking Credit for the Unbanked</p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Hackathon Demo Prototype • Financial Eligibility Platform</span>
        </div>
      </header>

      {/* Main Grid: Left Hero vs Right Floating Card */}
      <main className="max-w-7xl w-full mx-auto px-6 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-10 flex-1">
        {/* LEFT SIDE: Brand & Value Proposition */}
        <div className="lg:col-span-7 space-y-7">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-400/30 text-brand-300 text-xs font-semibold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping"></span>
            Fintech Loan Pre-Screening Engine
          </div>

          <div className="space-y-4">
            <div className="text-brand-400 font-extrabold text-lg tracking-wider uppercase">CredAccess</div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.12]">
              Turn Your Gig Income Into <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-400 via-sky-300 to-indigo-300">Financial Credibility.</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-300 font-normal leading-relaxed max-w-2xl">
              Build a verified financial portfolio from your gig income, monthly expenses and savings history to improve access to loans.
            </p>
          </div>

          {/* 3 Short Benefit Indicators */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs hover:border-brand-500/40 transition-all">
              <div className="w-9 h-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-3">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Verified Gig Employment</h3>
              <p className="text-xs text-slate-400 mt-1">Multi-platform authentication across Uber, Rapido, Swiggy, Zomato & more.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs hover:border-brand-500/40 transition-all">
              <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center mb-3">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">12-Month Financial Portfolio</h3>
              <p className="text-xs text-slate-400 mt-1">Automated expense extraction and 30% savings threshold assessment.</p>
            </div>

            <div className="p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-xs hover:border-brand-500/40 transition-all">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-3">
                <FileCheck2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-white text-sm">Loan Eligibility</h3>
              <p className="text-xs text-slate-400 mt-1">Digitally signed verification certificate for lending institutions.</p>
            </div>
          </div>

          {/* DEMO MODE: COMPLETELY SEPARATE FROM NEW USER REGISTRATION */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-brand-900/70 to-indigo-900/70 border border-brand-500/40 backdrop-blur-md space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Demo Mode (Pre-configured Hackathon Personas)
                </span>
              </div>
              <span className="text-[10px] bg-white/10 text-slate-300 px-2 py-0.5 rounded-full border border-white/10">
                Evaluation Scenarios
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Test pre-populated applicant profiles without manual data entry. Real new user accounts start 100% blank.
            </p>

            <div className="flex flex-wrap gap-2.5 pt-1">
              <button
                type="button"
                onClick={() => handleQuickDemo('arun')}
                className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-900/40"
              >
                <CheckCircle className="w-4 h-4" />
                <span>TEST USER 1 — ELIGIBLE (Arun Kumar • ~35% Savings)</span>
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemo('ravi')}
                className="px-3.5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shadow-amber-900/40"
              >
                <AlertCircle className="w-4 h-4" />
                <span>TEST USER 2 — NOT ELIGIBLE (Ravi • ~22% Savings)</span>
              </button>
            </div>

            {/* Quick Mock Test IDs Info */}
            <div className="pt-2 border-t border-white/10 text-[11px] text-slate-300 flex flex-wrap gap-x-3 gap-y-1 items-center">
              <span className="font-semibold text-amber-200">Valid Mock Test IDs:</span>
              <span>Uber: <strong className="text-white font-mono">UB10001</strong></span>
              <span>Rapido: <strong className="text-white font-mono">RP10001</strong></span>
              <span>Swiggy: <strong className="text-white font-mono">SW10001</strong></span>
              <span>Zomato: <strong className="text-white font-mono">ZO10001</strong></span>
              <span>Ola: <strong className="text-white font-mono">OL10001</strong></span>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Authentication Card & Collateral Notice */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <div className="w-full max-w-md flex flex-col gap-3">
            {/* Collateral Required Warning Box */}
            <div className="w-full p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 backdrop-blur-md flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-amber-300 text-sm tracking-tight">Collateral Required</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Collateral is mandatory to proceed with the loan eligibility assessment. Users without eligible collateral cannot proceed with the CredAccess loan assessment.
                </p>
              </div>
            </div>

            {/* Existing white Login / Create Account credential box */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-slate-900 border border-slate-100 relative">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-50 text-brand-600 mb-3 border border-brand-100">
                <UserCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                {isSignUp ? 'Create Account' : 'Sign In'}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {isSignUp 
                  ? 'Open a new, completely blank registration profile' 
                  : 'Access your saved CredAccess financial portfolio'}
              </p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email ID <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email ID"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter password"
                    className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                  />
                </div>
              </div>

              {isSignUp && (
                <div className="animate-in fade-in duration-150">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Confirm Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm password"
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-colors"
                    />
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-semibold rounded-lg text-sm shadow-md shadow-brand-600/25 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                ) : (
                  <>
                    <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-4 border-t border-slate-100 text-center">
              {isSignUp ? (
                <p className="text-xs text-slate-600">
                  Already have an account?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(false); setError(''); }}
                    className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
                  >
                    Sign In
                  </button>
                </p>
              ) : (
                <p className="text-xs text-slate-600">
                  New to CredAccess?{' '}
                  <button
                    type="button"
                    onClick={() => { setIsSignUp(true); setError(''); }}
                    className="font-bold text-brand-600 hover:text-brand-700 hover:underline"
                  >
                    Create Account
                  </button>
                </p>
              )}
            </div>

            {/* Privacy note */}
            <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Zero-knowledge financial data handling</span>
            </div>
          </div>
        </div>
      </div>
    </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 border-t border-white/5 z-10">
        <p>© 2026 CredAccess Technologies Inc. All rights reserved.</p>
        <p className="mt-1 sm:mt-0 text-[11px]">
          Tagline: “Unlocking Credit for the Unbanked” • Informal Economy Credit Enablement
        </p>
      </footer>
    </div>
  );
}
