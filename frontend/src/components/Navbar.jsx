import React, { useState } from 'react';
import { 
  ShieldCheck, 
  FileText, 
  Award, 
  FolderLock, 
  LayoutDashboard, 
  Bell, 
  User, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Settings,
  Globe,
  Sliders,
  X
} from 'lucide-react';

export default function Navbar({ 
  currentTab, 
  setCurrentTab, 
  currentUser, 
  onLogout, 
  onDemoSwitch,
  eligibilityData 
}) {
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [demoMenuOpen, setDemoMenuOpen] = useState(false);
  const [settingsModalOpen, setSettingsModalOpen] = useState(false);

  // Settings State
  const [language, setLanguage] = useState('English');
  const [smsAlerts, setSmsAlerts] = useState(true);
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'portfolio', label: 'Financial Portfolio', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FolderLock },
    { id: 'eligibility', label: 'Loan Eligibility', icon: Award },
  ];

  return (
    <>
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Left: Brand */}
            <div className="flex items-center gap-8">
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setCurrentTab('dashboard')}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-800 to-brand-500 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                  <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-extrabold text-xl tracking-tight text-slate-900">CredAccess</span>
                    <span className="text-[10px] uppercase tracking-wider font-bold bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded border border-brand-200">PROTOTYPE</span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium leading-none">Unlocking Credit for the Unbanked</p>
                </div>
              </div>

              {/* Desktop Navigation Links */}
              <div className="hidden md:flex space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentTab(item.id)}
                      className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-semibold rounded-lg transition-colors ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 border border-brand-200/60 shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                      {item.label}
                      {item.id === 'eligibility' && eligibilityData && (
                        <span className={`w-2 h-2 rounded-full ${eligibilityData.is_eligible ? 'bg-emerald-500 ring-2 ring-emerald-200' : 'bg-amber-400'}`}></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Demo Switcher + Notifications + Profile */}
            <div className="flex items-center gap-3">
              {/* Demo Persona Switcher Pill */}
              <div className="relative">
                <button
                  onClick={() => setDemoMenuOpen(!demoMenuOpen)}
                  className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-indigo-50 to-brand-50 border border-indigo-200 text-indigo-800 rounded-full text-xs font-semibold hover:border-indigo-300 transition-all shadow-xs"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600 animate-pulse" />
                  <span>Demo Switcher</span>
                  <ChevronDown className="w-3 h-3 text-indigo-500" />
                </button>

                {demoMenuOpen && (
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Simulated Judge Personas</p>
                    </div>
                    
                    <button
                      onClick={() => { onDemoSwitch('arun'); setDemoMenuOpen(false); }}
                      className="w-full text-left px-3 py-2.5 hover:bg-emerald-50/70 transition-colors flex items-start gap-2.5 border-b border-slate-100/60"
                    >
                      <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-slate-900">Arun Kumar</span>
                          <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">Eligible</span>
                        </div>
                        <p className="text-xs text-slate-500">Uber (UB10001) + Rapido (RP10001) • 35.2% Savings</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { onDemoSwitch('ravi'); setDemoMenuOpen(false); }}
                      className="w-full text-left px-3 py-2.5 hover:bg-amber-50/70 transition-colors flex items-start gap-2.5 border-b border-slate-100/60"
                    >
                      <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm text-slate-900">Ravi</span>
                          <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">Not Eligible</span>
                        </div>
                        <p className="text-xs text-slate-500">Swiggy (SW10001) • 21.8% Savings (&lt; 30% rule)</p>
                      </div>
                    </button>

                    <button
                      onClick={() => { onDemoSwitch('fresh'); setDemoMenuOpen(false); }}
                      className="w-full text-left px-3 py-2 hover:bg-slate-50 transition-colors flex items-center gap-2.5 text-xs font-semibold text-brand-700"
                    >
                      <Sparkles className="w-4 h-4 text-brand-500" />
                      <span>Reset to Clean Blank Registration</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg relative"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-600 rounded-full"></span>
                </button>

                {notifDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 p-3 z-50">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                      <span className="text-xs font-bold text-slate-800">Notifications</span>
                      <span className="text-[10px] bg-brand-50 text-brand-700 font-medium px-2 py-0.5 rounded-full">2 New</span>
                    </div>
                    <div className="mt-2 space-y-2">
                      <div className="text-xs p-2 bg-emerald-50 rounded-lg border border-emerald-100">
                        <p className="font-semibold text-emerald-900">Employment Authentication Verified</p>
                        <p className="text-emerald-700 text-[11px] mt-0.5">Gig platform partner records securely authenticated via mock API.</p>
                      </div>
                      <div className="text-xs p-2 bg-brand-50 rounded-lg border border-brand-100">
                        <p className="font-semibold text-brand-900">Financial Portfolio Ready</p>
                        <p className="text-brand-700 text-[11px] mt-0.5">Your 12-month savings assessment is available for micro-loan review.</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Avatar / Dropdown (Profile, Settings, Logout) */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200/80"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-600 to-indigo-600 text-white font-bold text-xs flex items-center justify-center shadow-xs">
                    {currentUser?.full_name ? currentUser.full_name.charAt(0) : 'U'}
                  </div>
                  <div className="hidden lg:block text-left pr-1">
                    <p className="text-xs font-bold text-slate-800 leading-tight">
                      {currentUser?.full_name || 'Gig Worker'}
                    </p>
                    <p className="text-[10px] text-emerald-600 font-semibold leading-none">Verified Member</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-200 py-1.5 z-50">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-semibold text-slate-900">{currentUser?.full_name || 'User'}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser?.email || currentUser?.username}</p>
                    </div>

                    {/* 1. Profile */}
                    <button
                      onClick={() => { setCurrentTab('profile'); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      <span>Profile</span>
                    </button>

                    {/* 2. Settings */}
                    <button
                      onClick={() => { setSettingsModalOpen(true); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2.5"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>Settings</span>
                    </button>

                    <div className="border-t border-slate-100 my-1"></div>

                    {/* 3. Logout */}
                    <button
                      onClick={() => { onLogout(); setProfileDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 flex items-center gap-2.5"
                    >
                      <LogOut className="w-4 h-4 text-rose-500" />
                      <span>Logout</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Mobile Navigation bar */}
          <div className="flex md:hidden border-t border-slate-200 py-2 space-x-1 overflow-x-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentTab(item.id)}
                  className={`flex-1 inline-flex flex-col items-center justify-center py-1 px-2 text-[10px] font-medium rounded-lg ${
                    isActive ? 'bg-brand-50 text-brand-700' : 'text-slate-600'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-brand-600' : 'text-slate-400'}`} />
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Settings Modal */}
      {settingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-5 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <Settings className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-slate-900 text-base">Account Settings</h3>
              </div>
              <button 
                onClick={() => setSettingsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Platform Language
                </label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg bg-white"
                >
                  <option value="English">English</option>
                  <option value="Hindi">हिंदी (Hindi)</option>
                  <option value="Kannada">ಕನ್ನಡ (Kannada)</option>
                  <option value="Tamil">தமிழ் (Tamil)</option>
                  <option value="Telugu">తెలుగు (Telugu)</option>
                </select>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100">
                <p className="font-semibold text-slate-800">Notification Preferences</p>
                <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg cursor-pointer">
                  <span className="text-slate-700">SMS Statement Reminders</span>
                  <input
                    type="checkbox"
                    checked={smsAlerts}
                    onChange={(e) => setSmsAlerts(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                </label>
                <label className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg cursor-pointer">
                  <span className="text-slate-700">WhatsApp Loan Pre-Approval Alerts</span>
                  <input
                    type="checkbox"
                    checked={whatsappAlerts}
                    onChange={(e) => setWhatsappAlerts(e.target.checked)}
                    className="w-4 h-4 text-brand-600 rounded"
                  />
                </label>
              </div>

              <div className="p-3 bg-brand-50 text-brand-900 rounded-xl space-y-1">
                <p className="font-bold">Security Standard</p>
                <p className="text-[11px] text-brand-700">
                  Gig platform API tokens and uploaded bank statements are encrypted using AES-256 in compliance with RBI fintech security guidelines.
                </p>
              </div>
            </div>

            <button
              onClick={() => setSettingsModalOpen(false)}
              className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Save & Close
            </button>
          </div>
        </div>
      )}
    </>
  );
}
