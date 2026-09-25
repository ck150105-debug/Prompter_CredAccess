import React, { useState } from 'react';
import { 
  Award, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  TrendingUp, 
  ShieldCheck, 
  ArrowRight, 
  FileCheck2, 
  Percent, 
  PiggyBank, 
  Coins, 
  Briefcase, 
  Calendar,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../api';

export default function LoanEligibilityPage({ 
  eligibilityData, 
  summaryData, 
  onGenerateCertificate,
  onNavigateToPortfolio 
}) {
  const [generating, setGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const isEligible = eligibilityData?.is_eligible;
  const savingsRatio = eligibilityData?.savings_ratio || summaryData?.average_savings_percentage || 0;
  const requiredRatio = 30.0;
  const progressRatio = Math.min(100, Math.round((savingsRatio / requiredRatio) * 100));

  const handleGenerate = async () => {
    setGenerating(true);
    setErrorMsg('');
    try {
      const cert = await api.generateCertificate();
      onGenerateCertificate(cert);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate certificate.');
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Micro-Loan Eligibility</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Automated financial pre-qualification assessment based on 10–12 month verified cashflow & savings.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
            isEligible 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
              : 'bg-amber-50 text-amber-800 border-amber-300'
          }`}>
            {isEligible ? 'Eligible for Assessment' : 'Under Review / Ineligible'}
          </span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* PRIMARY STATUS BANNER */}
      {isEligible ? (
        /* GREEN SUCCESS CARD FOR ELIGIBLE WORKER */
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-emerald-950 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-emerald-500/30">
          <div className="absolute right-0 top-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center border border-emerald-400/30 shadow-inner">
                  <CheckCircle2 className="w-7 h-7 text-emerald-300" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">Assessment Passed</span>
                  <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                    Congratulations! You Meet the CredAccess Financial Eligibility Criteria.
                  </h2>
                </div>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl leading-relaxed">
              Your average monthly savings rate of <strong className="text-white font-bold">{savingsRatio.toFixed(1)}%</strong> exceeds the mandatory 30% financial stability threshold. With verified gig platform employment and registered collateral, you are qualified to present your portfolio to banking and micro-loan partners.
            </p>

            {/* Badges Checklist */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
                <span className="text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Verified Employment ✓
                </span>
                <p className="text-[11px] text-emerald-100 mt-1">Multi-platform active records</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
                <span className="text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Collateral Verified ✓
                </span>
                <p className="text-[11px] text-emerald-100 mt-1">Registered security asset</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
                <span className="text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Financial History ✓
                </span>
                <p className="text-[11px] text-emerald-100 mt-1">12 Months complete</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/15">
                <span className="text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> Savings Req ✓
                </span>
                <p className="text-[11px] text-emerald-100 mt-1">{savingsRatio.toFixed(1)}% (Target: ≥30%)</p>
              </div>
            </div>

            {/* Metrics Snapshot */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-black/20 border border-white/10">
              <div>
                <p className="text-[11px] text-emerald-200">Average Monthly Income</p>
                <p className="text-base font-extrabold text-white mt-0.5">
                  ₹{Math.round(summaryData?.average_monthly_income || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-emerald-200">Average Monthly Savings</p>
                <p className="text-base font-extrabold text-white mt-0.5">
                  ₹{Math.round(summaryData?.average_monthly_savings || 0).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-[11px] text-emerald-200">Savings Ratio</p>
                <p className="text-base font-extrabold text-emerald-300 mt-0.5">
                  {savingsRatio.toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-[11px] text-emerald-200">Income Stability</p>
                <p className="text-base font-extrabold text-white mt-0.5">
                  {summaryData?.income_stability_status || 'High Stability'}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="px-6 py-3 bg-white text-emerald-950 font-bold text-xs sm:text-sm rounded-xl shadow-lg hover:bg-emerald-50 transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
              >
                {generating ? (
                  <div className="w-4 h-4 border-2 border-emerald-900 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <FileCheck2 className="w-4 h-4 text-emerald-700" />
                    <span>Generate Financial Verification Certificate</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onNavigateToPortfolio}
                className="px-5 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 transition-all flex items-center justify-center gap-2"
              >
                <span>View Complete Financial Portfolio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* AMBER/RED CARD FOR INELIGIBLE OR UNDER-REVIEW WORKER */
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden border border-amber-500/30">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30 shadow-inner">
                <AlertTriangle className="w-7 h-7 text-amber-300" />
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Assessment Status</span>
                <h2 className="text-xl sm:text-2xl font-black text-white mt-0.5">
                  You are currently not eligible.
                </h2>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Continue building your financial portfolio and maintaining higher monthly savings.
            </p>

            {/* Exactly Specified Metrics Display */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 bg-white/5 rounded-2xl border border-white/10">
              <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Average Savings Rate</p>
                <p className="text-2xl font-extrabold text-amber-400 mt-0.5">
                  {Math.round(savingsRatio)}%
                </p>
              </div>

              <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Required</p>
                <p className="text-2xl font-extrabold text-white mt-0.5">
                  30%
                </p>
              </div>

              <div className="bg-black/20 p-3 rounded-xl border border-white/5">
                <p className="text-[11px] text-slate-400 font-semibold uppercase tracking-wider">Progress</p>
                <p className="text-2xl font-extrabold text-amber-300 mt-0.5">
                  {Math.round(savingsRatio)} / 30
                </p>
              </div>
            </div>

            {/* Savings Ratio Progress Bar */}
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-2">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-slate-300">Savings Rate vs Minimum Requirement</span>
                <span className="text-amber-400 font-bold">
                  {savingsRatio.toFixed(1)}% / 30.0%
                </span>
              </div>
              <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${progressRatio}%` }}
                ></div>
              </div>
            </div>

            {/* Recommendation list */}
            {eligibilityData?.recommendations && eligibilityData.recommendations.length > 0 && (
              <div className="bg-amber-950/40 border border-amber-500/30 p-4 rounded-2xl space-y-2">
                <p className="text-xs font-bold text-amber-300 uppercase tracking-wider">Actionable Recommendations to Qualify:</p>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside">
                  {eligibilityData.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="p-4 rounded-xl bg-rose-950/30 border border-rose-500/30 text-xs text-rose-200 flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-400 shrink-0" />
              <span>
                Verification Certificate generation is locked until all CredAccess criteria (30% savings ratio, collateral, and employment authentication) are satisfied.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED CRITERIA CHECKLIST TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900">Criteria Evaluation Matrix</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Transparent breakdown of mandatory checks enforced by CredAccess for micro-loan assessment.
          </p>
        </div>

        <div className="divide-y divide-slate-100">
          {eligibilityData?.criteria_checklist?.map((item, idx) => (
            <div key={idx} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 shrink-0">
                  {item.passed ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-rose-100 text-rose-700 flex items-center justify-center">
                      <XCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">{item.name}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      item.passed 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}>
                      {item.passed ? 'PASSED ✓' : 'FAILED ✕'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{item.detail}</p>
                </div>
              </div>

              <div className="text-right sm:border-l sm:border-slate-100 sm:pl-6 shrink-0">
                <p className="text-[11px] text-slate-400">Required: <span className="font-medium text-slate-600">{item.required}</span></p>
                <p className={`text-xs font-bold mt-0.5 ${item.passed ? 'text-emerald-700' : 'text-rose-700'}`}>
                  Actual: {item.actual}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
