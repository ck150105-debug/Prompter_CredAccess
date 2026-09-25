import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Printer, 
  Download, 
  CheckCircle2, 
  QrCode, 
  Award, 
  Calendar, 
  Building2, 
  ArrowLeft,
  Sparkles,
  Lock
} from 'lucide-react';
import { api } from '../api';

export default function CertificateView({ onBackToDashboard }) {
  const [cert, setCert] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCert();
  }, []);

  const loadCert = async () => {
    setLoading(true);
    try {
      const data = await api.getCertificate();
      setCert(data);
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
        <p className="text-sm font-semibold text-slate-700">Loading Certificate Seal...</p>
      </div>
    );
  }

  if (!cert) {
    return (
      <div className="max-w-xl mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <Award className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Certificate Not Yet Issued</h2>
        <p className="text-xs text-slate-500">
          This account has not yet completed the 30% savings eligibility benchmark or has pending criteria.
        </p>
        <button
          onClick={onBackToDashboard}
          className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Top action bar */}
      <div className="flex items-center justify-between no-print">
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
            className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 shadow-md shadow-brand-600/25"
          >
            <Printer className="w-4 h-4" />
            <span>Download / Print Official Certificate</span>
          </button>
        </div>
      </div>

      {/* LUXURY FINTECH CERTIFICATE CONTAINER */}
      <div className="bg-white rounded-3xl shadow-2xl border-8 border-brand-900 p-8 sm:p-12 relative overflow-hidden print-container text-slate-900">
        {/* Subtle decorative inner border */}
        <div className="border border-brand-200/80 rounded-2xl p-6 sm:p-8 space-y-8 relative bg-gradient-to-b from-brand-50/20 via-white to-slate-50/30">
          
          {/* Top Logo & Certificate Title */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-900 to-brand-700 text-white shadow-xl mx-auto mb-1">
              <ShieldCheck className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <p className="text-xs uppercase tracking-[0.25em] font-extrabold text-brand-800">
                CredAccess Micro-Lending Verification Authority
              </p>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                CredAccess Financial Verification Certificate
              </h1>
              <p className="text-xs text-slate-500 font-medium italic">
                “Unlocking Credit for the Unbanked” • Informal Economy Credit Enablement
              </p>
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs font-bold mt-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Certificate ID: {cert.certificate_id}</span>
            </div>
          </div>

          {/* Recipient Statement */}
          <div className="text-center max-w-xl mx-auto pt-2">
            <p className="text-xs uppercase tracking-widest text-slate-400 font-bold">This is to certify that</p>
            <h2 className="text-2xl sm:text-3xl font-black text-brand-950 mt-1">
              {cert.client_name}
            </h2>
            <p className="text-xs text-slate-600 mt-1 font-medium">
              Classified as <strong className="text-slate-800">{cert.worker_type}</strong>, has successfully fulfilled the financial documentation and stability benchmarks established by CredAccess.
            </p>
          </div>

          {/* Assessment Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Assessment Period</p>
              <p className="text-xs font-bold text-slate-900 mt-1">{cert.assessment_period}</p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Avg Monthly Income</p>
              <p className="text-xs font-bold text-slate-900 mt-1">₹{Math.round(cert.average_monthly_income).toLocaleString()}</p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Average Savings Rate</p>
              <p className="text-xs font-black text-emerald-700 mt-1">{cert.average_savings_rate.toFixed(1)}%</p>
            </div>

            <div>
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Stability Rating</p>
              <p className="text-xs font-bold text-brand-800 mt-1">{cert.income_stability_rating}</p>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Verified Gig Employment</p>
              <p className="text-xs font-bold text-slate-800 mt-1">
                {cert.verified_platforms.join(' + ')} (Authenticated ✓)
              </p>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Collateral Verification</p>
              <p className="text-xs font-bold text-slate-800 mt-1">
                {cert.collateral_type} • Value: ₹{Math.round(cert.collateral_value).toLocaleString()}
              </p>
            </div>
          </div>

          {/* Eligibility Banner */}
          <div className="text-center py-2">
            <span className="text-xs font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 px-4 py-1.5 rounded-full shadow-2xs">
              ★ {cert.eligibility_status} ★
            </span>
          </div>

          {/* Verification Seal & Cryptographic Hash Footer */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center pt-4 border-t border-slate-200">
            {/* Left QR Code representation */}
            <div className="sm:col-span-4 flex items-center gap-3">
              <div className="w-20 h-20 bg-slate-900 text-white rounded-xl p-2 flex flex-col items-center justify-center shrink-0 shadow-md">
                <QrCode className="w-12 h-12 text-white" />
                <span className="text-[8px] font-mono mt-0.5 tracking-tighter">SCAN TO VERIFY</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono space-y-0.5">
                <p className="font-bold text-slate-700">Digital Authenticator</p>
                <p>Hash: {cert.verification_hash ? cert.verification_hash.substring(0, 16) : '4C8F99E218A'}...</p>
                <p>Issued: {cert.issued_date}</p>
              </div>
            </div>

            {/* Right Official Digital Seal */}
            <div className="sm:col-span-8 flex flex-col sm:items-end justify-center">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs font-extrabold text-slate-900 tracking-tight">Digitally Verified by CredAccess</p>
                  <p className="text-[11px] text-slate-500 font-serif italic">Chief Risk Officer & Compliance Seal</p>
                </div>
                <div className="w-14 h-14 rounded-full border-4 border-brand-800 bg-brand-50 flex items-center justify-center text-brand-900 shadow-md">
                  <ShieldCheck className="w-8 h-8 text-brand-800" />
                </div>
              </div>
            </div>
          </div>

          {/* Mandatory Regulatory & Legal Notice */}
          <div className="p-3 bg-slate-100 rounded-xl text-[10px] text-slate-500 text-center leading-relaxed">
            {cert.disclaimer}
          </div>
        </div>
      </div>
    </div>
  );
}
