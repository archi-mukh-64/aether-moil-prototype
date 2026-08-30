import React, { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { reportApi } from '../services/api/reportApi.js';
import { SectionHeader } from '../components/design/SectionHeader.jsx';
import { IntelligencePanel } from '../components/design/IntelligencePanel.jsx';
import { OperationalPanel } from '../components/design/OperationalPanel.jsx';
import { MetricTile } from '../components/design/MetricTile.jsx';
import { 
  FileText, 
  Download, 
  CheckCircle2, 
  Loader2, 
  Presentation, 
  FileCheck, 
  ShieldCheck, 
  Layers, 
  Calendar, 
  MapPin, 
  Globe2,
  Sparkles,
  BarChart2,
  Database
} from 'lucide-react';

export const ReportsPage = () => {
  const { activeMine, lang, t } = useApp();
  const [reportScope, setReportScope] = useState('NATIONAL'); // 'NATIONAL', 'MINE', 'SCENARIO'
  const [reportFormat, setReportFormat] = useState('PDF'); // 'PDF', 'PPTX'
  const [selectedLanguage, setSelectedLanguage] = useState(lang || 'en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [lastDownloaded, setLastDownloaded] = useState(null);

  const steps = [
    lang === 'hi' ? '10-खदान स्काडा टेलीमेट्री एवं कोटा संकलन...' : lang === 'mr' ? '10-खाण स्काडा टेलिमेट्री व कोटा संकलन...' : 'Collecting 10-mine SCADA telemetry & baseline quotas...',
    lang === 'hi' ? '40-परिदृश्य तनाव मैट्रिक्स सिमुलेशन...' : lang === 'mr' ? '40-परिदृश्य ताण मॅट्रिक्स सिम्युलेशन...' : 'Running 40-permutation scenario stress matrix...',
    lang === 'hi' ? 'भू-सांख्यिकीय पूर्वेक्षण एवं ब्लॉक मॉडल संकलन...' : lang === 'mr' ? 'भू-सांख्यिकी पूर्वेक्षण व ब्लॉक मॉडेल संकलन...' : 'Compiling geostatistical prospectivity & block models...',
    lang === 'hi' ? 'बायेसियन एआई विश्वास मेट्रिक्स एवं ऑडिट लेजर...' : lang === 'mr' ? 'बायेसियन एआय विश्वास मेट्रिक्स व ऑडिट लेजर...' : 'Synthesizing Bayesian AI trust metrics & audit ledgers...',
    lang === 'hi' ? 'त्रिभाषी देवनागरी टाइपोग्राफी के साथ वेक्टर दस्तावेज़ निर्माण...' : lang === 'mr' ? 'त्रिभाषिक देवनागरी टाइपोग्राफीसह वेक्टर दस्तऐवज निर्मिती...' : 'Rendering vector document with multilingual typography...'
  ];

  const handleDownload = async () => {
    setIsGenerating(true);
    setProgressStep(0);

    for (let i = 0; i < steps.length; i++) {
      setProgressStep(i);
      await new Promise(r => setTimeout(r, 450));
    }

    try {
      let docName = '';
      if (reportFormat === 'PDF') {
        if (reportScope === 'NATIONAL' || reportScope === 'SCENARIO') {
          await reportApi.downloadNationalReport(selectedLanguage);
          docName = `MOIL_National_Mining_Intelligence_Report_${selectedLanguage.toUpperCase()}.pdf`;
        } else {
          await reportApi.downloadMineReport(activeMine.id, selectedLanguage);
          docName = `MOIL_${activeMine.id.toUpperCase()}_Assessment_${selectedLanguage.toUpperCase()}.pdf`;
        }
      } else {
        if (reportScope === 'NATIONAL' || reportScope === 'SCENARIO') {
          await reportApi.downloadNationalPresentation(selectedLanguage);
          docName = `MOIL_National_Executive_Presentation_${selectedLanguage.toUpperCase()}.pptx`;
        } else {
          await reportApi.downloadMinePresentation(activeMine.id, selectedLanguage);
          docName = `MOIL_${activeMine.id.toUpperCase()}_Presentation_${selectedLanguage.toUpperCase()}.pptx`;
        }
      }
      setLastDownloaded(docName);
    } catch (err) {
      console.error('Report Generation Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 pb-16 font-sans">
      {/* Top Section Header */}
      <SectionHeader
        title={lang === 'hi' ? 'कार्यकारी रिपोर्टिंग एवं प्रस्तुति हब' : lang === 'mr' ? 'कार्यकारी अहवाल व सादरीकरण केंद्र' : 'Executive Reporting & Presentation Hub'}
        subtitle={lang === 'hi' ? 'डीजीएमएस वैधानिक अनुपालन, बहुभाषी राष्ट्रीय रिपोर्ट (पीडीएफ/पीपीटीएक्स) एवं खदान मूल्यांकन' : lang === 'mr' ? 'डीजीएमएस वैधानिक अनुपालन, बहुभाषिक राष्ट्रीय अहवाल (पीडीएफ/पीपीटीएक्स) व खाण मूल्यमापन' : 'DGMS Statutory Audits, Multilingual National Intelligence Decks & SCADA Telemetry Reports'}
        badgeText="AUTHORITATIVE / DGMS COMPLIANT"
        badgeVariant="amber"
      />

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricTile
          title={lang === 'hi' ? 'निगरानी की जा रही खदानें' : lang === 'mr' ? 'निरीक्षण केलेल्या खाणी' : 'Assets Monitored'}
          value="10 Mines"
          subtext="100% MOIL Manganese Corridor"
          variant="amber"
          icon={Layers}
        />
        <MetricTile
          title={lang === 'hi' ? 'रिपोर्ट प्रारूप' : lang === 'mr' ? 'अहवाल स्वरूप' : 'Export Engines'}
          value="PDF + PPTX"
          subtext="Vector PDF & 16:9 Presentation"
          variant="cyan"
          icon={FileText}
        />
        <MetricTile
          title={lang === 'hi' ? 'समर्थित भाषाएँ' : lang === 'mr' ? 'समर्थित भाषा' : 'Multilingual Ready'}
          value="EN / HI / MR"
          subtext="Native Devanagari Unicode"
          variant="green"
          icon={Globe2}
        />
        <MetricTile
          title={lang === 'hi' ? 'डीजीएमएस अनुपालन' : lang === 'mr' ? 'डीजीएमएस अनुपालन' : 'Statutory Compliance'}
          value="DGMS-2026"
          subtext="Immutable Chain-of-Custody"
          variant="violet"
          icon={ShieldCheck}
        />
      </div>

      {/* Main Generator Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generator Parameters */}
        <div className="lg:col-span-7 space-y-6">
          <IntelligencePanel
            title={lang === 'hi' ? 'रिपोर्ट विन्यास एवं उत्पादन' : lang === 'mr' ? 'अहवाल संरचना व निर्मिती' : 'Report Configuration & Generation'}
            badgeText="SYNTHESIS ENGINE"
            variant="amber"
            icon={Sparkles}
          >
            <div className="space-y-5 text-xs font-mono">
              {/* 1. Format Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  1. {lang === 'hi' ? 'निर्यात प्रारूप चुनें' : lang === 'mr' ? 'निर्यात स्वरूप निवडा' : 'Select Export Format'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReportFormat('PDF')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      reportFormat === 'PDF'
                        ? 'bg-[#1A232E] border-amber-500 text-white shadow-md'
                        : 'bg-[#0B0F14] border-[#222D3A] text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-sm text-white">PDF Vector Report</div>
                        <div className="text-[10px] text-slate-400 font-sans">Print-ready A4 executive document</div>
                      </div>
                    </div>
                    {reportFormat === 'PDF' && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportFormat('PPTX')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      reportFormat === 'PPTX'
                        ? 'bg-[#1A232E] border-amber-500 text-white shadow-md'
                        : 'bg-[#0B0F14] border-[#222D3A] text-slate-400 hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/30 text-orange-400">
                        <Presentation className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-sm text-white">PowerPoint (.pptx)</div>
                        <div className="text-[10px] text-slate-400 font-sans">16:9 widescreen executive deck</div>
                      </div>
                    </div>
                    {reportFormat === 'PPTX' && <CheckCircle2 className="w-5 h-5 text-amber-400" />}
                  </button>
                </div>
              </div>

              {/* 2. Scope Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  2. {lang === 'hi' ? 'रिपोर्ट दायरा चुनें' : lang === 'mr' ? 'अहवाल व्याप्ती निवडा' : 'Select Scope'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'NATIONAL', title: 'National (10 Mines)', desc: 'Complete multi-mine synthesis' },
                    { id: 'MINE', title: `${activeMine.shortName || 'Balaghat'} Mine`, desc: 'Deep dive single asset SCADA' },
                    { id: 'SCENARIO', title: 'Scenario Matrix', desc: '40 stress permutations' }
                  ].map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setReportScope(s.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        reportScope === s.id
                          ? 'bg-[#1A232E] border-amber-500 text-white shadow'
                          : 'bg-[#0B0F14] border-[#222D3A] text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-200">{s.title}</div>
                      <div className="text-[10px] text-slate-400 font-sans mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Language Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-2">
                  3. {lang === 'hi' ? 'दस्तावेज़ भाषा / भाषा' : lang === 'mr' ? 'दस्तऐवज भाषा / भाषा' : 'Document Language'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { code: 'en', label: 'English', sub: 'Latin Characters' },
                    { code: 'hi', label: 'हिन्दी (Hindi)', sub: 'देवनागरी लिपि' },
                    { code: 'mr', label: 'मराठी (Marathi)', sub: 'देवनागरी लिपी' }
                  ].map(l => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setSelectedLanguage(l.code)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedLanguage === l.code
                          ? 'bg-[#1A232E] border-cyan-500 text-cyan-300 font-bold'
                          : 'bg-[#0B0F14] border-[#222D3A] text-slate-400 hover:border-slate-600'
                      }`}
                    >
                      <div className="font-bold text-xs">{l.label}</div>
                      <div className="text-[10px] text-slate-400 font-sans mt-0.5">{l.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center gap-2 text-amber-400 font-bold">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>SYNTHESIZING AUTHORITATIVE DOCUMENT...</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-sans">
                    {steps[progressStep]}
                  </div>
                  <div className="w-full h-2 bg-[#0B0F14] rounded-full overflow-hidden border border-[#222D3A]">
                    <div 
                      className="h-full bg-amber-500 transition-all duration-300 shadow-glow-amber"
                      style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Download Action Button */}
              <div className="pt-2">
                <button
                  onClick={handleDownload}
                  disabled={isGenerating}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-[#0B0F14] font-extrabold text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-lg hover:shadow-glow-amber transition-all cursor-pointer disabled:opacity-50"
                >
                  <Download className="w-5 h-5" />
                  <span>{isGenerating ? 'Generating Artifact...' : 'Generate & Download Report'}</span>
                </button>
              </div>

              {lastDownloaded && !isGenerating && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center gap-2 text-emerald-300">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                  <div className="text-xs font-sans">
                    Downloaded: <span className="font-mono font-bold text-white">{lastDownloaded}</span>
                  </div>
                </div>
              )}

            </div>
          </IntelligencePanel>
        </div>

        {/* Right Column: Report Specifications & Audit Info */}
        <div className="lg:col-span-5 space-y-6">
          <OperationalPanel
            title={lang === 'hi' ? 'दस्तावेज़ विनिर्देश एवं सत्यापन' : lang === 'mr' ? 'दस्तऐवज तपशील व पडताळणी' : 'Document Specifications & Audit Standards'}
            badgeText="DGMS VERIFIED"
            variant="cyan"
            icon={ShieldCheck}
          >
            <div className="space-y-4 text-xs font-sans text-slate-300">
              <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#222D3A] space-y-2">
                <div className="flex items-center gap-2 font-bold text-white text-xs">
                  <Database className="w-4 h-4 text-cyan-400" />
                  <span>Included Data Modules</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                  <li>10-Mine Production targets vs actual achievement</li>
                  <li>40-Permutation scenario shortfall risk forecasts</li>
                  <li>UNFC 111 / 122 geological reserves & grade distribution</li>
                  <li>Komatsu fleet health, vibration RMS & RUL hours</li>
                  <li>Copernicus Sentinel-2 NDVI & NDWI satellite indices</li>
                  <li>DGMS statutory dispatch authorizations & audit ledger</li>
                </ul>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#222D3A] space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Typography & Font Engine
                </div>
                <div className="text-xs text-slate-200">
                  ReportLab 4.1.0 with Nirmala UI / Noto Sans Devanagari Unicode TrueType engine.
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0B0F14] border border-[#222D3A] space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                  Corporate Seal & Metadata
                </div>
                <div className="text-xs text-slate-200">
                  Authoritative Ministry of Steel & MOIL Limited digital verification watermark.
                </div>
              </div>
            </div>
          </OperationalPanel>
        </div>
      </div>
    </div>
  );
};
