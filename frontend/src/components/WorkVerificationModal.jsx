import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw,
  Loader2,
  Edit3
} from 'lucide-react';
import { api } from '../api';

export default function WorkVerificationModal({ 
  isOpen, 
  onClose, 
  profileData, 
  platformsToVerify, 
  onVerificationComplete 
}) {
  const [loading, setLoading] = useState(true);
  const [verificationResponse, setVerificationResponse] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOpen && platformsToVerify && platformsToVerify.length > 0) {
      runVerification();
    }
  }, [isOpen]);

  const runVerification = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      // 1. Call verification endpoint
      const res = await api.verifyPlatforms(platformsToVerify);
      setVerificationResponse(res);

      // If all passed, save profile as well
      if (res.all_verified && profileData) {
        await api.saveProfile(profileData);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Verification service failed.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const isSuccess = verificationResponse?.all_verified;
  const results = verificationResponse?.results || [];
  const failedResults = results.filter(r => !r.is_verified);
  const isMultiple = platformsToVerify && platformsToVerify.length > 1;

  // Title logic matching exact prompt requirements:
  // "Employment Verified Successfully" on success
  // "Work ID Not Found" on single failure
  // "Verification Incomplete" on multiple platforms with failure
  let headerTitle = 'Authenticating Gig Records...';
  let headerSubtitle = 'Querying partner platform databases via secure API';
  if (!loading) {
    if (isSuccess) {
      headerTitle = 'Employment Verified Successfully';
      headerSubtitle = 'Gig employment verified with partner database records';
    } else {
      if (isMultiple && failedResults.length > 0) {
        headerTitle = 'Verification Incomplete';
        headerSubtitle = 'One or more Work IDs could not be verified. Please correct the failed Work IDs and retry.';
      } else {
        headerTitle = 'Work ID Not Found';
        headerSubtitle = 'We could not verify this Work ID with the selected gig platform. Please check the Work ID and try again.';
      }
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className={`p-6 text-white ${
          loading 
            ? 'bg-brand-900' 
            : isSuccess 
              ? 'bg-gradient-to-r from-emerald-800 to-teal-700' 
              : 'bg-gradient-to-r from-rose-800 to-red-700'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs shrink-0">
              {loading ? (
                <Loader2 className="w-6 h-6 animate-spin text-brand-300" />
              ) : isSuccess ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-300" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-300" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-bold">
                {headerTitle}
              </h2>
              <p className="text-xs text-white/80 mt-0.5">
                {headerSubtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          {loading ? (
            <div className="py-8 text-center space-y-3">
              <div className="inline-block w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-semibold text-slate-700">Connecting to gig-platform databases...</p>
              <p className="text-xs text-slate-400">Verifying credential tokens & historical records</p>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-50 text-rose-800 text-xs border border-rose-200">
                  {errorMsg}
                </div>
              )}

              {/* Status Table per Platform */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-100">
                  <span>Platform & Work ID</span>
                  <span>Status</span>
                </div>

                {results.map((item) => (
                  <div 
                    key={item.platform}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      item.is_verified 
                        ? 'bg-emerald-50/70 border-emerald-200' 
                        : 'bg-rose-50/70 border-rose-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-slate-900">{item.platform}</span>
                        <span className="text-xs font-mono bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700">
                          {item.is_verified ? item.masked_work_id : item.work_id}
                        </span>
                      </div>
                      <p className={`text-xs mt-1 ${item.is_verified ? 'text-emerald-700 font-medium' : 'text-rose-700 font-medium'}`}>
                        {item.message}
                      </p>
                      {item.worker_name && (
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Worker: <span className="font-semibold text-slate-700">{item.worker_name}</span>
                          {item.joining_date && ` • Joined: ${item.joining_date}`}
                        </p>
                      )}
                    </div>

                    <div className="shrink-0 ml-3">
                      {item.is_verified ? (
                        <div className="flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Verified ✓</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-xs font-bold text-rose-800 bg-rose-100 px-2.5 py-1 rounded-full border border-rose-300">
                          <XCircle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Failed ✕</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Explanatory notes if failed */}
              {!isSuccess && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">
                      {isMultiple ? 'Verification Incomplete' : 'Work ID Not Found'}
                    </p>
                    <p className="mt-0.5 text-amber-800">
                      {isMultiple
                        ? 'One or more Work IDs could not be verified. Please correct the failed Work IDs and retry.'
                        : 'We could not verify this Work ID with the selected gig platform. Please check the Work ID and try again.'}
                    </p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 hover:bg-slate-200/60 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Work IDs</span>
          </button>

          {isSuccess ? (
            <button
              type="button"
              onClick={() => onVerificationComplete()}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
            >
              <span>Proceed to Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={runVerification}
              disabled={loading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Verification</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
