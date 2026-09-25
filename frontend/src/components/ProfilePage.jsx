import React, { useState, useEffect } from 'react';
import { 
  User, 
  Briefcase, 
  Coins, 
  ShieldCheck, 
  CheckCircle2, 
  Save, 
  Edit3, 
  Phone, 
  MapPin, 
  Clock, 
  Calendar,
  AlertCircle
} from 'lucide-react';
import { api } from '../api';

export default function ProfilePage({ currentUser, onUpdateSuccess }) {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Editable fields
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const data = await api.getProfile();
      setProfileData(data);
      if (data.profile) {
        setFullName(data.profile.full_name || '');
        setPhoneNumber(data.profile.phone_number || '');
        setPermanentAddress(data.profile.permanent_address || '');
        setCurrentAddress(data.profile.current_address || '');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      const updatedPayload = {
        ...profileData.profile,
        full_name: fullName,
        phone_number: phoneNumber,
        permanent_address: permanentAddress,
        current_address: currentAddress
      };
      await api.saveProfile(updatedPayload);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      loadProfile();
      if (onUpdateSuccess) onUpdateSuccess();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center">
        <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
        <p className="text-xs font-semibold text-slate-600">Loading Client Profile...</p>
      </div>
    );
  }

  const profile = profileData?.profile || {};
  const verifications = profileData?.verifications || [];

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Client Financial Profile</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Verified identity, registered collateral, and authenticated gig platform credentials.
          </p>
        </div>

        <div>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
            >
              <Edit3 className="w-4 h-4 text-slate-500" />
              <span>Edit Details</span>
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 bg-slate-100 text-slate-600 text-xs font-semibold rounded-xl hover:bg-slate-200"
            >
              Cancel Editing
            </button>
          )}
        </div>
      </div>

      {saveSuccess && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span>Profile changes saved successfully!</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Main Profile Cards */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* PERSONAL DETAILS CARD */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <User className="w-4 h-4 text-brand-600" />
              <span>Personal Information</span>
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Identity Verified ✓
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-500 font-semibold mb-1">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 text-xs font-semibold"
                />
              ) : (
                <p className="font-bold text-slate-900 text-sm">{fullName || '—'}</p>
              )}
            </div>

            <div>
              <label className="block text-slate-500 font-semibold mb-1">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 text-xs"
                />
              ) : (
                <p className="font-semibold text-slate-800">{phoneNumber || '—'}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-500 font-semibold mb-1">Permanent Address</label>
              {isEditing ? (
                <textarea
                  rows={2}
                  required
                  value={permanentAddress}
                  onChange={(e) => setPermanentAddress(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 text-xs"
                />
              ) : (
                <p className="text-slate-800 leading-relaxed">{permanentAddress || '—'}</p>
              )}
            </div>

            <div className="sm:col-span-2">
              <label className="block text-slate-500 font-semibold mb-1">Current Address</label>
              {isEditing ? (
                <textarea
                  rows={2}
                  required
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500 text-xs"
                />
              ) : (
                <p className="text-slate-800 leading-relaxed">{currentAddress || '—'}</p>
              )}
            </div>
          </div>
        </div>

        {/* WORK & VERIFIED PLATFORMS CARD */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-brand-600" />
              <span>Work & Authenticated Gig Platforms</span>
            </h2>
            <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full border border-brand-200">
              {profile.working_as || 'Full-Time Gig Worker'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-semibold">Total Working Experience:</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                {profile.working_experience_years || 0} Years, {profile.working_experience_months || 0} Months
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Data Authorization Consent:</span>
              <p className="font-semibold text-emerald-700 mt-0.5 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Authorized & Active
              </p>
            </div>
          </div>

          {/* Authenticated Platforms list */}
          <div className="pt-2 space-y-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
              Authenticated Platform Credentials
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {verifications.map((v) => (
                <div key={v.platform} className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-xs">{v.platform}</span>
                      <span className="text-[11px] font-mono font-medium text-slate-600 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                        {v.masked_work_id}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Status: <strong className="text-emerald-800">{v.status}</strong>
                    </p>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-300 flex items-center gap-1">
                    Verified ✓
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* COLLATERAL INFORMATION CARD */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Coins className="w-4 h-4 text-amber-600" />
              <span>Registered Collateral Asset</span>
            </h2>
            <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              Mandatory Rule Satisfied ✓
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <span className="text-slate-500 font-semibold">Collateral Asset Type:</span>
              <p className="font-bold text-slate-900 text-sm mt-0.5">
                {profile.collateral_type || 'Vehicle'}
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Estimated Market Value:</span>
              <p className="font-black text-emerald-700 text-base mt-0.5">
                ₹{Math.round(profile.collateral_value || 0).toLocaleString()}
              </p>
            </div>
            <div>
              <span className="text-slate-500 font-semibold">Ownership Verification:</span>
              <p className="font-semibold text-slate-800 mt-0.5">
                Unencumbered / Documented
              </p>
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center gap-1.5 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>Save Profile Changes</span>
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
