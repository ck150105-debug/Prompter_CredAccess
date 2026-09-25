import React, { useState } from 'react';
import { 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  ArrowRight, 
  Building2, 
  Bike, 
  Car, 
  Coins, 
  Home, 
  Wrench, 
  Check, 
  Info,
  HelpCircle,
  FileCheck2
} from 'lucide-react';

const PLATFORM_OPTIONS = [
  { id: 'Uber', label: 'Uber', sampleId: 'UB10001', altSample: 'UB10002', icon: Car },
  { id: 'Rapido', label: 'Rapido', sampleId: 'RP10001', altSample: 'RP10002', icon: Bike },
  { id: 'Swiggy', label: 'Swiggy', sampleId: 'SW10001', altSample: 'SW10002', icon: Bike },
  { id: 'Zomato', label: 'Zomato', sampleId: 'ZO10001', altSample: 'ZO10002', icon: Bike },
  { id: 'Ola', label: 'Ola', sampleId: 'OL10001', altSample: 'OL10002', icon: Car },
  { id: 'Dunzo', label: 'Dunzo', sampleId: 'DU10001', altSample: '', icon: Bike },
  { id: 'Porter', label: 'Porter', sampleId: 'PO10001', altSample: '', icon: Car },
  { id: 'Urban Company', label: 'Urban Company', sampleId: 'UC10001', altSample: '', icon: Wrench },
  { id: 'Freelancer', label: 'Freelancer', sampleId: 'FL10001', altSample: '', icon: Building2 },
  { id: 'Small Vendor', label: 'Small Vendor', sampleId: 'SV10001', altSample: '', icon: Building2 },
  { id: 'Other', label: 'Other', sampleId: 'TEST99', altSample: '', icon: Building2 },
];

const PLATFORM_WORK_ID_EXAMPLES = {
  'Uber': 'UB10001',
  'Rapido': 'RP10001',
  'Swiggy': 'SW10001',
  'Zomato': 'ZO10001',
  'Ola': 'OL10001',
  'Dunzo': 'DU10001',
  'Porter': 'PO10001',
  'Urban Company': 'UC10001',
  'Freelancer': 'FL10001',
  'Small Vendor': 'SV10001',
  'Other': 'TEST99',
};

export default function RegistrationForm({ currentUser, onVerificationTrigger }) {
  const userEmail = currentUser?.email || currentUser?.username || '';

  // 1-5. PERSONAL INFORMATION (All start completely blank for new users, email is read-only)
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [permanentAddress, setPermanentAddress] = useState('');
  const [currentAddress, setCurrentAddress] = useState('');
  const [sameAsPermanent, setSameAsPermanent] = useState(false);

  // 5-7. COLLATERAL INFORMATION (Mandatory rule: DO NOT pre-select either option)
  const [hasCollateral, setHasCollateral] = useState(null); // null = unselected, 'yes', 'no'
  const [collateralType, setCollateralType] = useState('');
  const [collateralOther, setCollateralOther] = useState('');
  const [collateralValue, setCollateralValue] = useState('');

  // 8-9. WORK INFORMATION (DO NOT pre-select platforms or pre-fill IDs)
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [workIds, setWorkIds] = useState({});
  const [otherPlatformName, setOtherPlatformName] = useState('');

  // 10-11. WORK EXPERIENCE (Both blank initially, Working As not pre-selected)
  const [expYears, setExpYears] = useState('');
  const [expMonths, setExpMonths] = useState('');
  const [workingAs, setWorkingAs] = useState('');

  // PRIVACY & CONSENT (Must start UNCHECKED)
  const [consentAuthorized, setConsentAuthorized] = useState(false);

  // Validation State
  const [formError, setFormError] = useState('');

  // Handle address copy
  const handleSameAddressChange = (checked) => {
    setSameAsPermanent(checked);
    if (checked) {
      setCurrentAddress(permanentAddress);
    } else {
      setCurrentAddress('');
    }
  };

  // Toggle platform selection (NEVER auto-fill Work ID)
  const togglePlatform = (platformId) => {
    if (selectedPlatforms.includes(platformId)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== platformId));
      const newIds = { ...workIds };
      delete newIds[platformId];
      setWorkIds(newIds);
    } else {
      setSelectedPlatforms([...selectedPlatforms, platformId]);
      // Initialize Work ID field as completely BLANK
      setWorkIds(prev => ({ ...prev, [platformId]: '' }));
    }
  };

  const handleWorkIdChange = (platformId, val) => {
    setWorkIds(prev => ({ ...prev, [platformId]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError('');

    // 1. Personal details completed validation
    if (!fullName.trim()) {
      setFormError('Please enter your full name.');
      return;
    }
    if (!phoneNumber.trim()) {
      setFormError('Please enter your phone number.');
      return;
    }
    if (!permanentAddress.trim()) {
      setFormError('Please enter your permanent address.');
      return;
    }
    if (!currentAddress.trim()) {
      setFormError('Please enter your current address.');
      return;
    }

    // 2. Collateral check (Mandatory Rule)
    if (hasCollateral === null) {
      setFormError('Please indicate whether you have collateral.');
      return;
    }
    if (hasCollateral === 'no') {
      setFormError('Collateral is mandatory to proceed with the CredAccess loan eligibility assessment.');
      return;
    }
    if (!collateralType) {
      setFormError('Please select a collateral type.');
      return;
    }
    if (collateralType === 'Other' && !collateralOther.trim()) {
      setFormError('Please specify your collateral type.');
      return;
    }
    if (!collateralValue || parseFloat(collateralValue) <= 0) {
      setFormError('Please enter a valid estimated collateral value.');
      return;
    }

    // 3. Platform selection validation
    if (selectedPlatforms.length === 0) {
      setFormError('Please select at least one gig platform / work.');
      return;
    }

    if (selectedPlatforms.includes('Other') && !otherPlatformName.trim()) {
      setFormError('Please enter your platform / occupation.');
      return;
    }

    // 4. Work ID manual entry validation for EVERY selected platform
    const platformsPayload = [];
    for (const p of selectedPlatforms) {
      const pName = p === 'Other' ? otherPlatformName.trim() : p;
      const enteredId = (workIds[p] || '').trim();
      if (!enteredId) {
        setFormError(`Please enter your Work ID for ${pName}.`);
        return;
      }
      platformsPayload.push({
        platform: pName,
        work_id: enteredId
      });
    }

    // 5. Work experience validation
    if (expYears === '' && expMonths === '') {
      setFormError('Please enter your working experience.');
      return;
    }
    if (!workingAs) {
      setFormError('Please select your working classification (Working As?).');
      return;
    }

    // 6. Consent accepted validation
    if (!consentAuthorized) {
      setFormError('I authorize CredAccess to process the financial and employment information I provide for generating my financial profile and eligibility assessment.');
      return;
    }

    const profileData = {
      full_name: fullName.trim(),
      email: userEmail,
      phone_number: phoneNumber.trim(),
      permanent_address: permanentAddress.trim(),
      current_address: currentAddress.trim(),
      same_as_permanent: sameAsPermanent,
      has_collateral: true,
      collateral_type: collateralType === 'Other' ? collateralOther.trim() : collateralType,
      collateral_other: collateralOther.trim(),
      collateral_value: parseFloat(collateralValue),
      selected_platforms: platformsPayload,
      working_experience_years: parseInt(expYears || 0),
      working_experience_months: parseInt(expMonths || 0),
      working_as: workingAs,
      consent_authorized: consentAuthorized
    };

    // Open Work Verification Modal only after user submits the registration form!
    onVerificationTrigger(profileData, platformsPayload);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-emerald-100">
              <Check className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-700 mt-1.5">Account</span>
          </div>
          <div className="flex-1 h-0.5 bg-brand-500 mx-2 -mt-4"></div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold ring-4 ring-brand-100 shadow-xs">
              2
            </div>
            <span className="text-[11px] font-bold text-brand-700 mt-1.5">Personal Details</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-200 mx-2 -mt-4"></div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 border border-slate-300 flex items-center justify-center text-xs font-bold">
              3
            </div>
            <span className="text-[11px] font-medium text-slate-500 mt-1.5">Work Verification</span>
          </div>
          <div className="flex-1 h-0.5 bg-slate-200 mx-2 -mt-4"></div>

          <div className="flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 border border-slate-300 flex items-center justify-center text-xs font-bold">
              4
            </div>
            <span className="text-[11px] font-medium text-slate-500 mt-1.5">Dashboard</span>
          </div>
        </div>
      </div>

      {/* Main Form Card */}
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200/80 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-brand-900 to-indigo-900 text-white px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-xs">
              <ShieldCheck className="w-6 h-6 text-brand-300" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Create Your CredAccess Profile</h1>
              <p className="text-xs text-brand-200 mt-0.5">
                Complete your details and authenticate your gig work records for loan eligibility.
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {formError && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-3 animate-in fade-in">
              <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
              <div>
                <p className="font-bold">Required Information Incomplete</p>
                <p className="mt-0.5">{formError}</p>
              </div>
            </div>
          )}

          {/* SECTION 1: PERSONAL INFORMATION */}
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-5">
              <span className="w-6 h-6 rounded-md bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">1</span>
              <h2 className="text-base font-bold text-slate-900">Personal Information</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  1. Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  2. Email ID <span className="text-slate-400 font-normal">(Registered Account • Read-Only)</span>
                </label>
                <input
                  type="email"
                  readOnly
                  disabled
                  value={userEmail}
                  className="w-full px-3.5 py-2 text-sm border border-slate-200 rounded-lg bg-slate-100 text-slate-600 font-medium cursor-not-allowed select-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  3. Phone Number <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  4. Permanent Address <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={permanentAddress}
                  onChange={(e) => {
                    setPermanentAddress(e.target.value);
                    if (sameAsPermanent) setCurrentAddress(e.target.value);
                  }}
                  placeholder="Enter your permanent address"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    5. Current Address <span className="text-rose-500">*</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs text-brand-700 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={sameAsPermanent}
                      onChange={(e) => handleSameAddressChange(e.target.checked)}
                      className="rounded text-brand-600 focus:ring-brand-500 w-3.5 h-3.5"
                    />
                    <span>Same as Permanent Address</span>
                  </label>
                </div>
                <textarea
                  rows={2}
                  required
                  disabled={sameAsPermanent}
                  value={currentAddress}
                  onChange={(e) => setCurrentAddress(e.target.value)}
                  placeholder="Enter your current address"
                  className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none disabled:bg-slate-100 disabled:text-slate-600"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: COLLATERAL INFORMATION (MANDATORY RULE) */}
          <div className="pt-2">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-5">
              <span className="w-6 h-6 rounded-md bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">2</span>
              <h2 className="text-base font-bold text-slate-900">Collateral Information</h2>
              <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-full ml-auto">
                Mandatory Assessment Rule
              </span>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  6. Collateral — Do you have collateral? <span className="text-rose-500">*</span>
                </label>
                {/* DO NOT PRE-SELECT EITHER OPTION */}
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="collateral_radio"
                      value="yes"
                      checked={hasCollateral === 'yes'}
                      onChange={() => setHasCollateral('yes')}
                      className="w-4 h-4 text-brand-600 focus:ring-brand-500"
                    />
                    <span>Yes</span>
                  </label>
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-800 cursor-pointer">
                    <input
                      type="radio"
                      name="collateral_radio"
                      value="no"
                      checked={hasCollateral === 'no'}
                      onChange={() => setHasCollateral('no')}
                      className="w-4 h-4 text-rose-600 focus:ring-rose-500"
                    />
                    <span>No</span>
                  </label>
                </div>
              </div>

              {/* MANDATORY WARNING BANNER IF NO */}
              {hasCollateral === 'no' && (
                <div className="p-4 rounded-xl bg-rose-50 border-2 border-rose-300 text-rose-900 text-xs flex items-start gap-3 animate-in fade-in">
                  <AlertCircle className="w-5 h-5 shrink-0 text-rose-600 mt-0.5" />
                  <div>
                    <p className="font-extrabold text-sm text-rose-700">Collateral is Mandatory</p>
                    <p className="mt-1 font-semibold leading-relaxed">
                      Collateral is mandatory to proceed with the CredAccess loan eligibility assessment.
                    </p>
                    <p className="mt-2 text-rose-600 font-medium">
                      The "Verify Employment & Continue" action is disabled until collateral is provided.
                    </p>
                  </div>
                </div>
              )}

              {/* COLLATERAL DETAILS IF YES */}
              {hasCollateral === 'yes' && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 animate-in fade-in space-y-4">
                  <div className="border-b border-slate-200 pb-2">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                      7. Collateral Type and Value
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Collateral Type <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={collateralType}
                        onChange={(e) => setCollateralType(e.target.value)}
                        className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                      >
                        <option value="" disabled>-- Select Collateral Type --</option>
                        <option value="Gold">Gold</option>
                        <option value="Vehicle">Vehicle</option>
                        <option value="Property">Property</option>
                        <option value="Fixed Deposit">Fixed Deposit</option>
                        <option value="Equipment / Machinery">Equipment / Machinery</option>
                        <option value="Other">Other</option>
                      </select>

                      {collateralType === 'Other' && (
                        <div className="mt-2.5">
                          <label className="block text-xs font-semibold text-slate-700 mb-1">
                            Specify Collateral Type <span className="text-rose-500">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            value={collateralOther}
                            onChange={(e) => setCollateralOther(e.target.value)}
                            placeholder="Specify Collateral Type"
                            className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                          />
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                        Estimated Collateral Value <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-sm font-bold text-slate-500">₹</span>
                        <input
                          type="number"
                          min="1"
                          required
                          value={collateralValue}
                          onChange={(e) => setCollateralValue(e.target.value)}
                          placeholder="Enter estimated collateral value"
                          className="w-full pl-8 pr-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none bg-white font-medium"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 3: WORK INFORMATION */}
          <div className="pt-2">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-200 mb-5">
              <span className="w-6 h-6 rounded-md bg-brand-100 text-brand-700 text-xs font-bold flex items-center justify-center">3</span>
              <h2 className="text-base font-bold text-slate-900">Gig Work & Platform Authentication</h2>
            </div>

            <div className="space-y-5">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-semibold text-slate-800">
                    8. Select Gig Platforms / Work (Multiple Selection Allowed) <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-500">None pre-selected</span>
                </div>

                {/* Multiple platform checkbox cards - ALL UNCHECKED INITIALLY */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  {PLATFORM_OPTIONS.map((item) => {
                    const isSelected = selectedPlatforms.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        onClick={() => togglePlatform(item.id)}
                        className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-2.5 ${
                          isSelected
                            ? 'bg-brand-50/70 border-brand-600 shadow-xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                          isSelected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5" />}
                        </div>
                        <span className={`text-xs font-semibold ${isSelected ? 'text-brand-900' : 'text-slate-700'}`}>
                          {item.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {selectedPlatforms.includes('Other') && (
                  <div className="mt-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Enter Platform / Occupation <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={otherPlatformName}
                      onChange={(e) => setOtherPlatformName(e.target.value)}
                      placeholder="Enter Platform / Occupation"
                      className="w-full px-3 py-1.5 text-sm border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                )}
              </div>

              {/* 9. WORK ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-800 mb-2">
                  9. Work ID <span className="text-rose-500">*</span>
                </label>

                {selectedPlatforms.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-500 italic">
                    Work ID fields will appear here dynamically once you select one or more gig platforms above.
                  </div>
                ) : (
                  <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-700">
                        Manually Enter Work ID for Every Selected Platform
                      </p>
                      <span className="text-[11px] text-slate-500 font-medium">
                        Must be manually typed • Verified against partner databases
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {selectedPlatforms.map((p) => {
                        const pLabel = p === 'Other' ? (otherPlatformName.trim() || 'Other Platform') : p;
                        const exampleId = PLATFORM_WORK_ID_EXAMPLES[p] || (p === 'Other' ? 'TEST99' : `${p.substring(0, 2).toUpperCase()}10001`);
                        const placeholderText = `Example: ${exampleId}`;
                        const currentVal = workIds[p] || '';

                        return (
                          <div key={p} className="bg-white p-3.5 rounded-lg border border-slate-200 shadow-2xs space-y-1.5">
                            <label className="block text-xs font-bold text-slate-900">
                              {pLabel} Work ID <span className="text-rose-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={currentVal}
                              onChange={(e) => handleWorkIdChange(p, e.target.value)}
                              placeholder={placeholderText}
                              className="w-full px-3.5 py-2 text-xs font-mono font-medium border border-slate-300 rounded-md focus:ring-2 focus:ring-brand-500 focus:outline-none uppercase placeholder:text-slate-400 placeholder:normal-case"
                            />
                            <p className="text-[10px] text-slate-500">
                              Format: <span className="font-mono text-slate-600 font-medium">{placeholderText}</span>
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* 10. Working Experience & 11. Working As */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    10. Working Experience (Years) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="50"
                    required
                    value={expYears}
                    onChange={(e) => setExpYears(e.target.value)}
                    placeholder="Years"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Working Experience (Months) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    required
                    value={expMonths}
                    onChange={(e) => setExpMonths(e.target.value)}
                    placeholder="Months"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    11. Working As? <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={workingAs}
                    onChange={(e) => setWorkingAs(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
                  >
                    <option value="" disabled>-- Select Employment Type --</option>
                    <option value="Full-Time Gig Worker">Full-Time Gig Worker</option>
                    <option value="Part-Time Gig Worker">Part-Time Gig Worker</option>
                    <option value="Independent Contractor">Independent Contractor</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Small Vendor">Small Vendor</option>
                    <option value="Self-Employed">Self-Employed</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 4: PRIVACY AND CONSENT (MUST START UNCHECKED) */}
          <div className="pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  required
                  checked={consentAuthorized}
                  onChange={(e) => setConsentAuthorized(e.target.checked)}
                  className="mt-1 w-4 h-4 text-brand-600 rounded focus:ring-brand-500"
                />
                <div className="text-xs text-slate-700 leading-relaxed">
                  <span className="font-bold text-slate-900">Consent Authorization: </span>
                  “I authorize CredAccess to process the financial and employment information I provide for the purpose of generating my financial profile and eligibility assessment.”
                </div>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-slate-500">
              Step 2 of 4: Gig Employment Authentication
            </div>

            <button
              type="submit"
              disabled={hasCollateral === 'no' || hasCollateral === null}
              className={`py-3 px-8 rounded-xl font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
                hasCollateral === 'no' || hasCollateral === null
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
                  : 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/30 hover:scale-[1.01]'
              }`}
            >
              <span>Verify Employment & Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
