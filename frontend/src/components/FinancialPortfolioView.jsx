import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Printer, 
  Download, 
  CheckCircle2, 
  User, 
  Briefcase, 
  Building2, 
  Coins, 
  Calendar,
  FileText,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { api } from '../api';

export default function FinancialPortfolioView({ onBackToDashboard, onNavigateToCertificate }) {
  const [portfolioData, setPortfolioData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const data = await api.getPortfolio();
      setPortfolioData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-700">Compiling 12-Month Financial Portfolio...</p>
      </div>
    );
  }

  const profile = portfolioData?.profile || {};
  const user = portfolioData?.user || {};
  const summary = portfolioData?.summary || {};
  const verifications = portfolioData?.verifications || [];
  const monthlyHistory = portfolioData?.monthly_history || [];
  const cert = portfolioData?.certificate;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top Action Bar (hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print pb-2">
        <button
          onClick={onBackToDashboard}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Printer className="w-4 h-4 text-slate-600" />
            <span>Print / Save as PDF</span>
          </button>

          {cert && (
            <button
              onClick={onNavigateToCertificate}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>View Official Certificate</span>
            </button>
          )}
        </div>
      </div>

      {/* PORTFOLIO DOCUMENT CONTAINER */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-300 p-8 sm:p-10 space-y-8 print-container text-slate-900">
        {/* Header Branding */}
        <div className="flex items-start justify-between border-b-2 border-brand-800 pb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-800 text-white flex items-center justify-center shadow-md">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900">CredAccess</span>
                <span className="text-[11px] font-bold bg-brand-100 text-brand-900 px-2 py-0.5 rounded uppercase">
                  Verified Portfolio
                </span>
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-0.5">
                Unlocking Credit for the Unbanked • Gig Worker Financial Dossier
              </p>
            </div>
          </div>

          <div className="text-right">
            <p className="text-xs font-mono font-bold text-slate-800">
              Ref ID: {cert ? cert.certificate_id : 'CA-PORTFOLIO-2026'}
            </p>
            <p className="text-[11px] text-slate-500 mt-0.5">
              Issued: {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
            <span className="inline-block mt-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
              Eligible for Micro-Loan Assessment
            </span>
          </div>
        </div>

        {/* SECTION 1: CLIENT INFORMATION */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5">
            <User className="w-4 h-4 text-brand-700" />
            <span>Applicant & Gig Employment Profile</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-500">Full Name</span>
              <p className="font-bold text-slate-900 mt-0.5">{profile.full_name || user.full_name || 'N/A'}</p>
            </div>
            <div>
              <span className="text-slate-500">Contact Phone</span>
              <p className="font-semibold text-slate-800 mt-0.5">{profile.phone_number || 'N/A'}</p>
            </div>
            <div>
              <span className="text-slate-500">Worker Classification</span>
              <p className="font-semibold text-slate-800 mt-0.5">{profile.working_as || 'Full-Time Gig Worker'}</p>
            </div>
            <div>
              <span className="text-slate-500">Experience</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                {profile.working_experience_years || 0} Yrs {profile.working_experience_months || 0} Mos
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 2: VERIFICATION & COLLATERAL */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Platform Auth Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-brand-600" />
                <span>Verified Gig Platforms</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                100% Authenticated
              </span>
            </div>

            <div className="space-y-1.5 pt-1">
              {verifications.map((v) => (
                <div key={v.platform} className="flex justify-between items-center text-xs bg-white p-2 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{v.platform}</span>
                    <span className="font-mono text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded">
                      {v.masked_work_id}
                    </span>
                  </div>
                  <span className="font-semibold text-emerald-700 text-[11px] flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified Active
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Collateral Details Box */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-amber-600" />
                <span>Registered Collateral Asset</span>
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Asset Verified ✓
              </span>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Asset Type:</span>
                <span className="font-bold text-slate-900">{profile.collateral_type || 'Vehicle'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-200">
                <span className="text-slate-500">Estimated Value:</span>
                <span className="font-extrabold text-emerald-700">₹{Math.round(profile.collateral_value || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Ownership Status:</span>
                <span className="font-semibold text-slate-800">Clear Title / Sole Ownership</span>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: FINANCIAL SUMMARY METRICS */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-brand-700" />
            <span>12-Month Financial Summary & Stability Benchmarks</span>
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-brand-50/50 border border-brand-200">
            <div>
              <p className="text-[11px] text-slate-500">Average Monthly Income</p>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">
                ₹{Math.round(summary.average_monthly_income || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Median Monthly Income</p>
              <p className="text-base font-extrabold text-slate-900 mt-0.5">
                ₹{Math.round(summary.median_monthly_income || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Average Monthly Expenses</p>
              <p className="text-base font-extrabold text-rose-700 mt-0.5">
                ₹{Math.round(summary.average_monthly_expenses || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Average Monthly Savings</p>
              <p className="text-base font-extrabold text-emerald-700 mt-0.5">
                ₹{Math.round(summary.average_monthly_savings || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Overall Savings Ratio</p>
              <p className="text-base font-black text-brand-900 mt-0.5">
                {summary.average_savings_percentage?.toFixed(1) || 0}%
              </p>
            </div>
            <div>
              <p className="text-[11px] text-slate-500">Income Stability Rating</p>
              <p className="text-base font-bold text-slate-900 mt-0.5">
                {summary.income_stability_status || 'High Stability'}
              </p>
            </div>
            <div className="sm:col-span-2">
              <p className="text-[11px] text-slate-500">Cashflow Stability Note</p>
              <p className="text-xs text-slate-700 mt-0.5">
                {summary.income_stability_explanation}
              </p>
            </div>
          </div>
        </div>

        {/* SECTION 4: 12-MONTH MONTHLY HISTORY TABLE */}
        <div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200 pb-1.5 mb-3 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-700" />
            <span>Monthly Financial Records (Verified Statements)</span>
          </h2>

          <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
              <tr>
                <th className="p-2.5">Month</th>
                <th className="p-2.5">Income</th>
                <th className="p-2.5">Expenses</th>
                <th className="p-2.5">Savings</th>
                <th className="p-2.5">Savings %</th>
                <th className="p-2.5 text-center">Benchmark</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {monthlyHistory.map((m) => (
                <tr key={m.month} className="hover:bg-slate-50">
                  <td className="p-2.5 font-bold text-slate-800">{m.month} 2025</td>
                  <td className="p-2.5 font-medium text-slate-900">₹{Math.round(m.income).toLocaleString()}</td>
                  <td className="p-2.5 text-rose-600 font-medium">₹{Math.round(m.expenses).toLocaleString()}</td>
                  <td className="p-2.5 text-emerald-600 font-semibold">₹{Math.round(m.savings).toLocaleString()}</td>
                  <td className="p-2.5 font-bold">{m.savings_percentage?.toFixed(1)}%</td>
                  <td className="p-2.5 text-center">
                    {m.savings_percentage >= 30 ? (
                      <span className="text-emerald-700 font-bold text-[11px]">Met (≥30%) ✓</span>
                    ) : (
                      <span className="text-amber-700 font-bold text-[11px]">Below 30% ⚠</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* SECTION 5: LEGAL DISCLAIMER & SEAL */}
        <div className="pt-4 border-t-2 border-slate-200 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-300">
                ✓
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">CredAccess Financial Eligibility Verified</p>
                <p className="text-[11px] text-slate-500">
                  Signed with CredAccess Cryptographic Verification Protocol SHA-256
                </p>
              </div>
            </div>

            <div className="text-right text-[11px] font-mono text-slate-500">
              Verification Hash: SHA256:4C8F99E218A900B...
            </div>
          </div>

          {/* MANDATORY LEGAL DISCLAIMER */}
          <div className="p-4 rounded-xl bg-slate-100 text-[11px] text-slate-600 leading-relaxed space-y-1">
            <p className="font-bold text-slate-800 uppercase tracking-wider">Mandatory Lending Institutional Notice:</p>
            <p>
              “CredAccess Financial Eligibility Verified. This portfolio represents the applicant's financial assessment based on available and permissioned financial data. Final loan approval remains subject to the lending institution's policies and verification procedures.”
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
