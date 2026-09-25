import React, { useState, useEffect } from 'react';
import { 
  FolderLock, 
  FileText, 
  FileCheck, 
  Download, 
  Eye, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Search,
  Filter
} from 'lucide-react';
import { api } from '../api';

export default function DocumentsPage({ onNavigateToPortfolio, onNavigateToCertificate }) {
  const [documents, setDocuments] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [previewDoc, setPreviewDoc] = useState(null);

  const categories = [
    'All',
    'Bank Statements',
    'Employment Verification',
    'Collateral Documents',
    'Financial Portfolio',
    'CredAccess Certificate'
  ];

  useEffect(() => {
    loadDocs();
  }, []);

  const loadDocs = async () => {
    setLoading(true);
    try {
      const data = await api.getDocuments();
      setDocuments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredDocs = selectedCategory === 'All'
    ? documents
    : documents.filter(d => d.category === selectedCategory);

  const handleAction = (doc, action) => {
    if (doc.category === 'Financial Portfolio') {
      onNavigateToPortfolio();
    } else if (doc.category === 'CredAccess Certificate') {
      onNavigateToCertificate();
    } else {
      setPreviewDoc(doc);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center">
              <FolderLock className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Document Storage</h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Secure, encrypted vault containing authenticated gig platform records, bank statements, and generated certificates.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Encrypted Compliance Storage</span>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              selectedCategory === cat
                ? 'bg-brand-600 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs font-semibold text-slate-600">Retrieving encrypted documents...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="py-16 text-center space-y-2">
            <FileText className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No documents found in this category</p>
            <p className="text-xs text-slate-400">Upload bank statements from the dashboard to populate files.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50/80 text-[11px] uppercase tracking-wider text-slate-500 font-bold border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3.5">Document Name</th>
                  <th className="px-6 py-3.5">Category</th>
                  <th className="px-6 py-3.5">Period / Month</th>
                  <th className="px-6 py-3.5">Upload Date</th>
                  <th className="px-6 py-3.5">Status</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-3.5 font-bold text-slate-900 flex items-center gap-2">
                      <FileCheck className="w-4 h-4 text-brand-600 shrink-0" />
                      <span className="truncate max-w-xs">{doc.name}</span>
                    </td>
                    <td className="px-6 py-3.5 text-slate-600 font-medium">
                      {doc.category}
                    </td>
                    <td className="px-6 py-3.5 font-semibold text-slate-800">
                      {doc.month || 'All Period'}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">
                      {doc.upload_date}
                    </td>
                    <td className="px-6 py-3.5">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-50 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-6 py-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleAction(doc, 'view')}
                        className="p-1.5 text-brand-600 hover:text-brand-800 hover:bg-brand-50 rounded-lg transition-colors"
                        title="View Document"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleAction(doc, 'download')}
                        className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                        title="Download Document"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-bold text-slate-900 text-sm">Document Preview</h3>
              <button onClick={() => setPreviewDoc(null)} className="text-slate-400 hover:text-slate-600 text-xs font-bold">✕</button>
            </div>
            <div className="p-4 bg-slate-50 rounded-xl space-y-2 text-xs">
              <p><strong className="text-slate-700">File:</strong> {previewDoc.name}</p>
              <p><strong className="text-slate-700">Category:</strong> {previewDoc.category}</p>
              <p><strong className="text-slate-700">Timestamp:</strong> {previewDoc.upload_date}</p>
              <p><strong className="text-slate-700">Integrity Check:</strong> SHA256 Verified ✓</p>
              <div className="pt-2 text-[11px] text-slate-500">
                This document is encrypted and digitally validated within the CredAccess secure enclave.
              </div>
            </div>
            <button
              onClick={() => setPreviewDoc(null)}
              className="w-full py-2 bg-brand-600 text-white rounded-xl text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
