import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { reportApi } from '../../services/api/reportApi.js';
import {
  FileText,
  Download,
  X,
  CheckCircle2,
  Loader2,
  Layers,
  ShieldCheck,
  MapPin,
  Sparkles,
  Server,
  FileCheck,
  Presentation
} from 'lucide-react';

export const ReportModal = ({ isOpen, onClose }) => {
  const { activeMine, lang, t } = useApp();
  const [reportScope, setReportScope] = useState('NATIONAL'); // 'NATIONAL', 'MINE', 'SCENARIO'
  const [reportFormat, setReportFormat] = useState('PDF'); // 'PDF', 'PPTX'
  const [selectedLanguage, setSelectedLanguage] = useState(lang || 'en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const mod = t?.modals || {};
  const comm = t?.common || {};

  const steps = [
    'Collecting 10-mine SCADA telemetry & baseline quotas...',
    'Running 40-permutation scenario stress matrix...',
    'Compiling geostatistical prospectivity & block models...',
    'Synthesizing Bayesian AI trust metrics & audit ledgers...',
    'Rendering vector document with multilingual typography...'
  ];

  const handleGenerate = async () => {
    setIsGenerating(true);
    setIsReady(false);
    setProgressStep(0);

    for (let i = 0; i < steps.length; i++) {
      setProgressStep(i);
      await new Promise(r => setTimeout(r, 400));
    }

    try {
      if (reportFormat === 'PDF') {
        if (reportScope === 'NATIONAL' || reportScope === 'SCENARIO') {
          await reportApi.downloadNationalReport(selectedLanguage);
        } else {
          await reportApi.downloadMineReport(activeMine.id, selectedLanguage);
        }
      } else {
        if (reportScope === 'NATIONAL' || reportScope === 'SCENARIO') {
          await reportApi.downloadNationalPresentation(selectedLanguage);
        } else {
          await reportApi.downloadMinePresentation(activeMine.id, selectedLanguage);
        }
      }
      setIsReady(true);
    } catch (err) {
      console.error('Report Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="relative w-full max-w-xl rounded-2xl bg-[#0f172a] border border-[#1e293b] shadow-2xl p-6 text-[#272A27] font-mono">

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#272A27] tracking-wide">
                {mod.reportTitle || 'MOIL MINING INTELLIGENCE REPORT'}
              </h2>
              <p className="text-xs text-[#5F625C]">
                {mod.reportSubtitle || 'Authoritative Multi-Mine Telemetry & Executive Deck'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#5F625C] hover:text-[#272A27] hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="mt-5 space-y-4 text-xs">

          {/* Format Selection: PDF vs PPTX */}
          <div>
            <label className="text-[11px] font-bold text-[#5F625C] uppercase tracking-wider block mb-2">
              {mod.exportFormat || 'Export Format'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setReportFormat('PDF')}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  reportFormat === 'PDF'
                    ? 'bg-[#1e293b] border-amber-500 text-white'
                    : 'bg-[#0b1220] border-zinc-800 text-[#5F625C] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-400" />
                  <span className="font-bold">{mod.pdfVector || 'PDF Vector Report'}</span>
                </div>
                {reportFormat === 'PDF' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </button>

              <button
                type="button"
                onClick={() => setReportFormat('PPTX')}
                className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                  reportFormat === 'PPTX'
                    ? 'bg-[#1e293b] border-amber-500 text-white'
                    : 'bg-[#0b1220] border-zinc-800 text-[#5F625C] hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Presentation className="w-4 h-4 text-orange-400" />
                  <span className="font-bold">{mod.pptxDeck || 'PowerPoint Deck (.pptx)'}</span>
                </div>
                {reportFormat === 'PPTX' && <CheckCircle2 className="w-4 h-4 text-amber-400" />}
              </button>
            </div>
          </div>

          {/* Report Scope Selection */}
          <div>
            <label className="text-[11px] font-bold text-[#5F625C] uppercase tracking-wider block mb-2">
              {mod.scopeSelection || 'Report Scope Selection'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'NATIONAL', label: mod.nationalScope || 'National (10 Mines)', desc: mod.nationalScopeDesc || 'Full corporate overview' },
                { id: 'MINE', label: `${activeMine.shortName || 'Active'} Mine`, desc: mod.mineScopeDesc || 'Deep dive SCADA & geology' },
                { id: 'SCENARIO', label: mod.scenarioScope || 'Scenario Matrix', desc: mod.scenarioScopeDesc || '40 stress permutations' }
              ].map(s => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setReportScope(s.id)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    reportScope === s.id
                      ? 'bg-[#1e293b] border-amber-500 text-white shadow'
                      : 'bg-[#0b1220] border-zinc-800 text-[#5F625C] hover:border-zinc-700'
                  }`}
                >
                  <div className="font-bold text-xs">{s.label}</div>
                  <div className="text-[9px] text-[#85877E] mt-0.5">{s.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Multilingual Localization Selector */}
          <div>
            <label className="text-[11px] font-bold text-[#5F625C] uppercase tracking-wider block mb-2">
              {mod.docLang || 'Document Language / भाषा'}
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { code: 'en', label: 'English' },
                { code: 'hi', label: 'हिन्दी (Hindi)' },
                { code: 'mr', label: 'मराठी (Marathi)' }
              ].map(l => (
                <button
                  key={l.code}
                  type="button"
                  onClick={() => setSelectedLanguage(l.code)}
                  className={`p-2 rounded-xl border text-center transition-all ${
                    selectedLanguage === l.code
                      ? 'bg-[#1e293b] border-sky-500 text-sky-300 font-bold'
                      : 'bg-[#0b1220] border-zinc-800 text-[#5F625C] hover:text-[#272A27]'
                  }`}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* Progress Sequence */}
          {isGenerating && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 space-y-2">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>{mod.generating || 'GENERATING AUTHORITATIVE DOCUMENT...'}</span>
              </div>
              <div className="text-[11px] text-[#272A27]">
                {steps[progressStep]}
              </div>
              <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {isReady && !isGenerating && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center gap-2 text-emerald-300">
              <CheckCircle2 className="w-4 h-4" />
              <span>{mod.docReady || 'Document successfully generated and downloaded.'}</span>
            </div>
          )}

        </div>

        {/* Modal Actions */}
        <div className="mt-6 flex items-center justify-end gap-3 border-t border-zinc-800 pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl border border-zinc-700 text-[#272A27] hover:bg-zinc-800 text-xs transition-colors"
          >
            {mod.close || comm.close || 'Close'}
          </button>
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-2 transition-all disabled:opacity-50"
          >
            <Download className="w-4 h-4" />
            <span>{mod.generateDownload || 'Generate & Download'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
