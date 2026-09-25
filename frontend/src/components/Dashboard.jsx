import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PiggyBank, 
  Percent, 
  Calendar, 
  Upload, 
  FileCheck, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  FileSpreadsheet,
  ArrowUpRight,
  ShieldCheck,
  Fuel,
  Wrench,
  ShoppingBag,
  Zap,
  Home,
  Check,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import { api } from '../api';

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June", 
  "July", "August", "September", "October", "November", "December"
];

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Dashboard({ 
  currentUser, 
  summaryData, 
  onRefresh, 
  onNavigateToEligibility,
  onNavigateToPortfolio 
}) {
  const [selectedMonth, setSelectedMonth] = useState('Jan');
  const [uploadFile, setUploadFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [parsedResult, setParsedResult] = useState(null);
  const [simulatingAll, setSimulatingAll] = useState(false);

  // File Drag & Drop
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setAnalyzing(true);
    setUploadMessage(null);
    setParsedResult(null);

    try {
      const res = await api.uploadStatement(selectedMonth, uploadFile, 2025);
      setParsedResult(res.analysis);
      setUploadMessage({ type: 'success', text: res.message });
      onRefresh();
    } catch (err) {
      setUploadMessage({ type: 'error', text: err.message || 'Failed to analyze bank statement.' });
    } finally {
      setAnalyzing(false);
    }
  };

  const handleSimulateAll = async (targetRate = 0.35) => {
    setSimulatingAll(true);
    try {
      await api.simulateAllStatements(targetRate);
      onRefresh();
      setUploadMessage({ 
        type: 'success', 
        text: `Successfully populated 12 months with simulated statements (target savings ~${Math.round(targetRate * 100)}%).` 
      });
    } catch (err) {
      setUploadMessage({ type: 'error', text: 'Failed to populate 12 months.' });
    } finally {
      setSimulatingAll(false);
    }
  };

  const clientName = currentUser?.full_name || 'Valued Member';
  const history = summaryData?.monthly_history || [];
  const chartData = summaryData?.platform_breakdown || [];
  const monthsCompleted = summaryData?.months_completed || 0;
  const progressRatio = Math.round((monthsCompleted / 12) * 100);

  // Platform keys for stacked bars (exclude 'month' and 'total')
  const platformKeys = chartData.length > 0 
    ? Object.keys(chartData[0]).filter(k => k !== 'month' && k !== 'total')
    : ['Uber', 'Rapido'];

  const platformColors = ['#0c8fe9', '#025aa1', '#f59e0b', '#10b981', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-8 pb-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
      {/* GREETING & HERO HEADER */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-indigo-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-brand-200 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5 text-brand-300" />
              <span>Verified Financial Identity • Micro-Loan Ready</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {clientName}
            </h1>
            <p className="text-sm text-brand-200 max-w-xl">
              Build your financial history and track your micro-loan eligibility. Upload monthly bank statements to document verified savings surplus.
            </p>
          </div>

          {/* Quick CTA to Eligibility */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onNavigateToEligibility}
              className="px-5 py-2.5 bg-white text-brand-900 font-bold text-xs rounded-xl shadow-lg hover:bg-brand-50 transition-all flex items-center gap-2 hover:scale-[1.02]"
            >
              <span>View Loan Eligibility</span>
              <ArrowUpRight className="w-4 h-4 text-brand-600" />
            </button>
            <button
              onClick={onNavigateToPortfolio}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl border border-white/20 transition-all flex items-center gap-2"
            >
              <span>Financial Portfolio</span>
            </button>
          </div>
        </div>

        {/* 12-Month Progress Bar */}
        <div className="mt-6 pt-5 border-t border-white/15">
          <div className="flex items-center justify-between text-xs text-brand-200 mb-2">
            <span className="font-semibold">Financial History Maturity:</span>
            <span className="font-bold text-white">
              {monthsCompleted} / 12 Months Completed ({progressRatio}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-emerald-400 to-sky-300 rounded-full transition-all duration-500"
              style={{ width: `${progressRatio}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* TOP 4 SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Average Monthly Income */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Avg Monthly Income
            </span>
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{Math.round(summaryData?.average_monthly_income || 0).toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
              <span className="text-emerald-600 font-bold">Verified</span> from gig platform records
            </p>
          </div>
        </div>

        {/* Card 2: Average Monthly Expenses */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Avg Monthly Expenses
            </span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <TrendingDown className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{Math.round(summaryData?.average_monthly_expenses || 0).toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Extracted from bank statement debits
            </p>
          </div>
        </div>

        {/* Card 3: Average Monthly Savings */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Avg Monthly Savings
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <PiggyBank className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">
              ₹{Math.round(summaryData?.average_monthly_savings || 0).toLocaleString()}
            </h3>
            <p className="text-[11px] text-slate-500 mt-1">
              Income minus living & operating debits
            </p>
          </div>
        </div>

        {/* Card 4: Savings Ratio */}
        <div className={`p-5 rounded-2xl border shadow-xs transition-shadow ${
          (summaryData?.average_savings_percentage || 0) >= 30
            ? 'bg-emerald-50/50 border-emerald-200'
            : 'bg-amber-50/50 border-amber-200'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
              Savings Ratio
            </span>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              (summaryData?.average_savings_percentage || 0) >= 30
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-amber-100 text-amber-700'
            }`}>
              <Percent className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">
                {summaryData?.average_savings_percentage?.toFixed(1) || 0}%
              </h3>
              <span className={`text-xs font-bold ${
                (summaryData?.average_savings_percentage || 0) >= 30
                  ? 'text-emerald-700'
                  : 'text-amber-700'
              }`}>
                {(summaryData?.average_savings_percentage || 0) >= 30 ? 'Target Met (>=30%)' : 'Below 30%'}
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              CredAccess benchmark: Min 30% savings
            </p>
          </div>
        </div>
      </div>

      {/* INCOME OVERVIEW GRAPH & STABILITY PANEL */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Income Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-900">Gig Income Overview</h2>
              <p className="text-xs text-slate-500">
                Monthly verified earnings across authenticated gig platforms
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-brand-50 text-brand-700 font-semibold px-2.5 py-1 rounded-full border border-brand-200">
                12-Month Timeline
              </span>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                  axisLine={false} 
                  tickLine={false}
                  tickFormatter={(val) => `₹${val/1000}k`}
                />
                <Tooltip 
                  formatter={(value, name) => [`₹${value.toLocaleString()}`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                {platformKeys.map((pKey, idx) => (
                  <Bar 
                    key={pKey} 
                    dataKey={pKey} 
                    stackId="a" 
                    fill={platformColors[idx % platformColors.length]} 
                    radius={idx === platformKeys.length - 1 ? [4, 4, 0, 0] : [0, 0, 0, 0]} 
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Stability & Metrics Card */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h2 className="text-base font-bold text-slate-900">Income Stability</h2>
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                summaryData?.income_stability_status === 'High Stability'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : summaryData?.income_stability_status === 'Moderate Stability'
                    ? 'bg-blue-50 text-blue-800 border-blue-200'
                    : 'bg-amber-50 text-amber-800 border-amber-200'
              }`}>
                {summaryData?.income_stability_status || 'Pending'}
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {summaryData?.income_stability_explanation || 'Awaiting full 12 months records to establish statistical variance.'}
            </p>

            <div className="mt-5 space-y-3">
              <div className="flex justify-between items-center text-xs py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Median Monthly Income</span>
                <span className="font-bold text-slate-900">
                  ₹{Math.round(summaryData?.median_monthly_income || 0).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Variance Index (CV)</span>
                <span className="font-mono font-bold text-slate-900">
                  {summaryData?.income_stability_cv ? (summaryData.income_stability_cv * 100).toFixed(1) + '%' : 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center text-xs py-2 border-b border-slate-50">
                <span className="text-slate-500 font-medium">Months Documented</span>
                <span className="font-bold text-brand-700">
                  {monthsCompleted} of 12 Months
                </span>
              </div>
            </div>
          </div>

          {/* Quick Hackathon Demo Helper */}
          <div className="mt-6 pt-4 border-t border-slate-100 bg-slate-50/80 p-3.5 rounded-xl border">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Judge Fast-Forward:</span>
            </div>
            <p className="text-[11px] text-slate-500 mb-2">
              Populate all 12 months of statement data instantly:
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleSimulateAll(0.35)}
                disabled={simulatingAll}
                className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-[11px] rounded-lg transition-colors"
              >
                {simulatingAll ? 'Populating...' : '12M (35% Savings)'}
              </button>
              <button
                type="button"
                onClick={() => handleSimulateAll(0.22)}
                disabled={simulatingAll}
                className="flex-1 py-1.5 px-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-[11px] rounded-lg transition-colors"
              >
                {simulatingAll ? 'Populating...' : '12M (22% Savings)'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BANK STATEMENT UPLOAD & PARSER SECTION */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Upload Monthly Bank Statement</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload your bank statement to calculate monthly expenses and savings.
            </p>
          </div>

          {/* Sample CSV Download Link */}
          <a
            href="/sample_statements/sample_bank_statement.csv"
            download="Sample_Bank_Statement.csv"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors shrink-0"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Download Sample Statement CSV</span>
          </a>
        </div>

        <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left: Upload Form */}
          <form onSubmit={handleUploadSubmit} className="lg:col-span-6 space-y-4">
            {uploadMessage && (
              <div className={`p-3.5 rounded-xl text-xs flex items-start gap-2.5 ${
                uploadMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border border-rose-200'
              }`}>
                {uploadMessage.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                )}
                <span>{uploadMessage.text}</span>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Select Month <span className="text-rose-500">*</span>
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-brand-500 focus:outline-none"
              >
                {MONTH_SHORT.map((m, idx) => (
                  <option key={m} value={m}>
                    {MONTH_NAMES[idx]} (2025)
                  </option>
                ))}
              </select>
            </div>

            {/* Drag & Drop Area */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">
                Bank Statement Document (PDF / CSV)
              </label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                  isDragging 
                    ? 'border-brand-500 bg-brand-50/50' 
                    : uploadFile 
                      ? 'border-emerald-400 bg-emerald-50/30' 
                      : 'border-slate-300 hover:border-brand-400 bg-slate-50/50'
                }`}
                onClick={() => document.getElementById('file-upload-input')?.click()}
              >
                <input
                  id="file-upload-input"
                  type="file"
                  accept=".csv,.pdf,.txt"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setUploadFile(e.target.files[0]);
                    }
                  }}
                />

                <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 text-brand-600 flex items-center justify-center mx-auto mb-3 shadow-2xs">
                  <Upload className="w-6 h-6" />
                </div>

                {uploadFile ? (
                  <div>
                    <p className="text-sm font-bold text-slate-900">{uploadFile.name}</p>
                    <p className="text-xs text-emerald-600 font-semibold mt-1">
                      Ready to analyze • {(uploadFile.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-xs font-bold text-slate-800">
                      Drag & drop your statement here, or <span className="text-brand-600 underline">browse</span>
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Supports PDF or CSV statements from HDFC, SBI, ICICI, Axis, PayTM Bank, etc.
                    </p>
                  </div>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={analyzing}
              className="w-full py-2.5 px-4 bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs rounded-xl shadow-md shadow-brand-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {analyzing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Parsing Bank Transactions...</span>
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>Analyze Statement & Compute Savings</span>
                </>
              )}
            </button>
          </form>

          {/* Right: Visual Analysis Results */}
          <div className="lg:col-span-6 bg-slate-50/80 rounded-2xl p-5 border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Statement Parser Output
              </span>
              <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                Simulated AI Engine
              </span>
            </div>

            {parsedResult ? (
              <div className="space-y-4 animate-in fade-in">
                {/* Result Highlights */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold">Total Credits</p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">
                      ₹{Math.round(parsedResult.total_credits || parsedResult.verified_income).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold">Total Debits</p>
                    <p className="text-base font-bold text-rose-600 mt-0.5">
                      ₹{Math.round(parsedResult.total_debits || parsedResult.monthly_expenses).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold">Monthly Expenses</p>
                    <p className="text-base font-bold text-rose-600 mt-0.5">
                      ₹{Math.round(parsedResult.monthly_expenses).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold">Verified Gig Income</p>
                    <p className="text-base font-bold text-slate-900 mt-0.5">
                      ₹{Math.round(parsedResult.verified_income).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold">Net Monthly Savings</p>
                    <p className="text-base font-bold text-emerald-600 mt-0.5">
                      ₹{Math.round(parsedResult.monthly_savings).toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <p className="text-[11px] text-slate-500 font-semibold">Savings Percentage</p>
                    <p className={`text-base font-bold mt-0.5 ${
                      parsedResult.savings_percentage >= 30 ? 'text-emerald-700' : 'text-amber-600'
                    }`}>
                      {parsedResult.savings_percentage}%
                    </p>
                  </div>
                </div>

                {/* Recurring Breakdown */}
                {parsedResult.recurring_expenses && Object.keys(parsedResult.recurring_expenses).length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2">Recurring Expenses Identified:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {Object.entries(parsedResult.recurring_expenses).map(([cat, amt]) => (
                        <div key={cat} className="flex justify-between items-center text-xs bg-white px-2.5 py-1.5 rounded-lg border border-slate-200/80">
                          <span className="text-slate-600 truncate">{cat}</span>
                          <span className="font-semibold text-slate-900 ml-1">₹{Math.round(amt).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Major Transactions */}
                {parsedResult.major_transactions && parsedResult.major_transactions.length > 0 && (
                  <div>
                    <p className="text-xs font-bold text-slate-700 mb-2">Major Transactions:</p>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                      {parsedResult.major_transactions.map((tx, idx) => (
                        <div key={idx} className="flex justify-between items-center text-xs bg-white p-2 rounded-lg border border-slate-200/80">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                              tx.type === 'CREDIT' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                            }`}>
                              {tx.type}
                            </span>
                            <span className="text-slate-700 font-medium truncate max-w-xs">{tx.description}</span>
                          </div>
                          <span className={`font-mono font-bold ${
                            tx.type === 'CREDIT' ? 'text-emerald-700' : 'text-slate-900'
                          }`}>
                            {tx.type === 'CREDIT' ? '+' : '-'}₹{Math.round(tx.amount).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <FileCheck className="w-10 h-10 mx-auto text-slate-300" />
                <p className="text-xs font-medium text-slate-500">No statement selected yet for real-time analysis</p>
                <p className="text-[11px] text-slate-400">
                  Select a month and click "Analyze Statement" or click the 12M demo quick-fill above.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 12-MONTH FINANCIAL HISTORY TABLE & CARDS */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">12-Month Financial Portfolio</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Comprehensive month-by-month income, verified expenses and savings percentage records.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-600">
              {monthsCompleted} of 12 months documented
            </span>
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-3.5">Month</th>
                <th className="px-6 py-3.5">Income</th>
                <th className="px-6 py-3.5">Expenses</th>
                <th className="px-6 py-3.5">Savings</th>
                <th className="px-6 py-3.5">Savings %</th>
                <th className="px-6 py-3.5">Statement</th>
                <th className="px-6 py-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {history.map((row) => (
                <tr key={row.month} className="hover:bg-slate-50/60 transition-colors">
                  <td className="px-6 py-3.5 font-bold text-slate-900">{row.month} 2025</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">
                    ₹{Math.round(row.income).toLocaleString()}
                  </td>
                  <td className="px-6 py-3.5 text-rose-600 font-medium">
                    {row.statement_status === 'Uploaded' ? `₹${Math.round(row.expenses).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-6 py-3.5 text-emerald-600 font-semibold">
                    {row.statement_status === 'Uploaded' ? `₹${Math.round(row.savings).toLocaleString()}` : '—'}
                  </td>
                  <td className="px-6 py-3.5">
                    {row.statement_status === 'Uploaded' ? (
                      <span className={`font-bold ${row.savings_percentage >= 30 ? 'text-emerald-700' : 'text-amber-600'}`}>
                        {row.savings_percentage.toFixed(1)}%
                      </span>
                    ) : (
                      <span className="text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      row.statement_status === 'Uploaded'
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-amber-50 text-amber-800 border border-amber-200'
                    }`}>
                      {row.statement_status}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    {row.statement_status === 'Uploaded' ? (
                      row.meets_savings_goal ? (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold" title="Savings >= 30%">
                          ✓
                        </span>
                      ) : (
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 text-amber-800 font-bold" title="Savings < 30%">
                          ⚠
                        </span>
                      )
                    ) : (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 text-slate-400">
                        —
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
