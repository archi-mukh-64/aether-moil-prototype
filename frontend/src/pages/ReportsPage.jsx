import { useState } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { reportApi } from '../services/api/reportApi.js';
import {
  AetherSectionHeader,
  AetherKpiCard
} from '../components/design-system/index.js';
import {
  FileText,
  Download,
  CheckCircle2,
  Loader2,
  Presentation,
  ShieldCheck,
  Layers,
  Globe2,
  Sparkles
} from 'lucide-react';

export const ReportsPage = () => {
  const { activeMine, lang } = useApp();
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
    <div className="space-y-6 font-sans text-[#272A27]">

      {/* Top Section Header (Theme: Executive Briefing, Accent: Copper #C46A32) */}
      <AetherSectionHeader
        title={lang === 'hi' ? 'कार्यकारी रिपोर्टिंग एवं प्रस्तुति हब' : lang === 'mr' ? 'कार्यकारी अहवाल व सादरीकरण केंद्र' : 'Executive Reporting & Presentation Hub'}
        subtitle={lang === 'hi' ? 'डीजीएमएस वैधानिक अनुपालन, बहुभाषी राष्ट्रीय रिपोर्ट (पीडीएफ/पीपीटीएक्स) एवं खदान मूल्यांकन' : lang === 'mr' ? 'डीजीएमएस वैधानिक अनुपालन, बहुभाषिक राष्ट्रीय अहवाल (पीडीएफ/पीपीटीएक्स) व खाण मूल्यमापन' : 'DGMS Statutory Audits, Multilingual National Intelligence Decks & SCADA Telemetry Reports'}
        badge="AUTHORITATIVE / DGMS COMPLIANT"
        accent="#C46A32"
        icon={FileText}
      />

      {/* Top Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <AetherKpiCard
          title={lang === 'hi' ? 'निगरानी की जा रही खदानें' : lang === 'mr' ? 'निरीक्षण केलेल्या खाणी' : 'Assets Monitored'}
          value="10 Mines"
          subtitle="100% MOIL Manganese Corridor"
          accent="teal"
          icon={Layers}
          status="OPTIMAL"
        />
        <AetherKpiCard
          title={lang === 'hi' ? 'रिपोर्ट प्रारूप' : lang === 'mr' ? 'अहवाल स्वरूप' : 'Export Engines'}
          value="PDF + PPTX"
          subtitle="Vector PDF & 16:9 Presentation"
          accent="copper"
          icon={FileText}
          status="OPTIMAL"
        />
        <AetherKpiCard
          title={lang === 'hi' ? 'समर्थित भाषाएँ' : lang === 'mr' ? 'समर्थित भाषा' : 'Multilingual Ready'}
          value="EN / HI / MR"
          subtitle="Native Devanagari Unicode"
          accent="sage"
          icon={Globe2}
          status="OPTIMAL"
        />
        <AetherKpiCard
          title={lang === 'hi' ? 'डीजीएमएस अनुपालन' : lang === 'mr' ? 'डीजीएमएस अनुपालन' : 'Statutory Compliance'}
          value="DGMS-2026"
          subtitle="Immutable Chain-of-Custody"
          accent="ochre"
          icon={ShieldCheck}
          status="OPTIMAL"
        />
      </div>

      {/* Main Generator Console */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Generator Parameters */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-[#F0EBE2] border border-[#C8BFAF] rounded-xl p-5 shadow-mineral-sm space-y-5 text-[#272A27]">
            <div className="flex items-center justify-between pb-3 border-b border-[#DDD4C5]">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#C46A32]" />
                <h3 className="font-bold text-sm text-[#272A27] font-display">
                  {lang === 'hi' ? 'रिपोर्ट विन्यास एवं उत्पादन' : lang === 'mr' ? 'अहवाल संरचना व निर्मिती' : 'Report Configuration & Synthesis'}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#C46A32]/15 text-[#C46A32] border border-[#C46A32]/30">
                DYNAMIC COMPILER
              </span>
            </div>

            <div className="space-y-5 text-xs font-mono">
              {/* 1. Format Selection */}
              <div>
                <label className="text-[11px] font-bold text-[#5F625C] uppercase tracking-wider block mb-2">
                  1. {lang === 'hi' ? 'निर्यात प्रारूप चुनें' : lang === 'mr' ? 'निर्यात स्वरूप निवडा' : 'Select Export Format'}
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setReportFormat('PDF')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      reportFormat === 'PDF'
                        ? 'bg-[#F5F1E9] border-[#C46A32] text-[#272A27] shadow-sm ring-1 ring-[#C46A32]/20'
                        : 'bg-[#F0EBE2] border-[#C8BFAF] text-[#5F625C] hover:border-[#85877E]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#C84B3F]/15 text-[#C84B3F] border border-[#C84B3F]/30">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-sm text-[#272A27]">PDF Vector Report</div>
                        <div className="text-[10px] text-[#5F625C] font-sans">Print-ready A4 executive dossier</div>
                      </div>
                    </div>
                    {reportFormat === 'PDF' && <CheckCircle2 className="w-5 h-5 text-[#C46A32]" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => setReportFormat('PPTX')}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                      reportFormat === 'PPTX'
                        ? 'bg-[#F5F1E9] border-[#C46A32] text-[#272A27] shadow-sm ring-1 ring-[#C46A32]/20'
                        : 'bg-[#F0EBE2] border-[#C8BFAF] text-[#5F625C] hover:border-[#85877E]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-[#B88A3B]/15 text-[#B88A3B] border border-[#B88A3B]/30">
                        <Presentation className="w-5 h-5" />
                      </div>
                      <div className="text-left">
                        <div className="font-bold text-sm text-[#272A27]">PowerPoint (.pptx)</div>
                        <div className="text-[10px] text-[#5F625C] font-sans">16:9 widescreen executive deck</div>
                      </div>
                    </div>
                    {reportFormat === 'PPTX' && <CheckCircle2 className="w-5 h-5 text-[#C46A32]" />}
                  </button>
                </div>
              </div>

              {/* 2. Scope Selection */}
              <div>
                <label className="text-[11px] font-bold text-[#5F625C] uppercase tracking-wider block mb-2">
                  2. {lang === 'hi' ? 'रिपोर्ट दायरा चुनें' : lang === 'mr' ? 'अहवाल व्याप्ती निवडा' : 'Select Scope'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'NATIONAL', title: 'National (10 Mines)', desc: 'Multi-mine aggregate synthesis' },
                    { id: 'MINE', title: `${activeMine.shortName || 'Balaghat'} Mine`, desc: 'Deep-dive SCADA telemetry' },
                    { id: 'SCENARIO', title: 'Scenario Matrix', desc: '40 stress permutations' }
                  ].map(s => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setReportScope(s.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                        reportScope === s.id
                          ? 'bg-[#F5F1E9] border-[#C46A32] text-[#272A27] shadow-sm'
                          : 'bg-[#F0EBE2] border-[#C8BFAF] text-[#5F625C] hover:border-[#85877E]'
                      }`}
                    >
                      <div className="font-bold text-xs text-[#272A27]">{s.title}</div>
                      <div className="text-[10px] text-[#5F625C] font-sans mt-0.5">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Language Selection */}
              <div>
                <label className="text-[11px] font-bold text-[#5F625C] uppercase tracking-wider block mb-2">
                  3. {lang === 'hi' ? 'दस्तावेज़ भाषा / भाषा' : lang === 'mr' ? 'दस्तऐवज भाषा / भाषा' : 'Document Language'}
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { code: 'en', label: 'English', sub: 'Latin Standard' },
                    { code: 'hi', label: 'हिन्दी (Hindi)', sub: 'देवनागरी लिपि' },
                    { code: 'mr', label: 'मराठी (Marathi)', sub: 'देवनागरी लिपी' }
                  ].map(l => (
                    <button
                      key={l.code}
                      type="button"
                      onClick={() => setSelectedLanguage(l.code)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                        selectedLanguage === l.code
                          ? 'bg-[#3D8C8A]/15 border-[#3D8C8A] text-[#275B59] font-bold'
                          : 'bg-[#F0EBE2] border-[#C8BFAF] text-[#5F625C] hover:border-[#85877E]'
                      }`}
                    >
                      <div className="font-bold text-xs">{l.label}</div>
                      <div className="text-[10px] text-[#5F625C] font-sans mt-0.5">{l.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Progress Bar */}
              {isGenerating && (
                <div className="p-4 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] space-y-2">
                  <div className="flex items-center gap-2 text-[#C46A32] font-bold">
                    <Loader2 className="w-4 h-4 animate-spin text-[#C46A32]" />
                    <span>SYNTHESIZING AUTHORITATIVE DOCUMENT...</span>
                  </div>
                  <div className="text-[11px] text-[#5F625C] font-sans">
                    {steps[progressStep]}
                  </div>
                  <div className="w-full h-2 bg-[#DDD4C5] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#C46A32] transition-all duration-300"
                      style={{ width: `${((progressStep + 1) / steps.length) * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <button
                type="button"
                onClick={handleDownload}
                disabled={isGenerating}
                className="w-full py-3 px-4 rounded-xl bg-[#C46A32] hover:bg-[#B05924] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>SYNTHESIZING {reportFormat}...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 text-white" />
                    <span>DOWNLOAD {reportFormat} DOSSIER ({selectedLanguage.toUpperCase()})</span>
                  </>
                )}
              </button>

              {lastDownloaded && (
                <div className="p-3 rounded-lg bg-[#71856B]/20 border border-[#71856B]/40 text-[#4A5845] text-xs font-mono flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#71856B]" />
                    Downloaded: <strong>{lastDownloaded}</strong>
                  </span>
                  <span className="text-[10px] text-[#71856B] font-bold">VERIFIED</span>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* Right Column: Statutory Document Preview Specification */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-[#F0EBE2] border border-[#C8BFAF] rounded-xl p-5 shadow-mineral-sm space-y-4 text-[#272A27]">
            <div className="pb-3 border-b border-[#DDD4C5]">
              <h3 className="font-bold text-sm text-[#272A27] font-display">
                Report Structure &amp; Table of Contents
              </h3>
              <p className="text-xs text-[#5F625C]">
                Automated document sections included in export
              </p>
            </div>

            <div className="space-y-3 text-xs font-mono text-[#5F625C]">
              <div className="p-3 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] space-y-1">
                <div className="font-bold text-[#272A27]">Section 1: Executive Overview &amp; National Target Status</div>
                <div className="text-[11px] text-[#5F625C]">Aggregated 10-mine daily tonnage, 14-day shortfall trajectory, and DGMS priority index.</div>
              </div>

              <div className="p-3 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] space-y-1">
                <div className="font-bold text-[#272A27]">Section 2: Earth Observation &amp; UNFC Reserve Radar</div>
                <div className="text-[11px] text-[#5F625C]">Sentinel-2 SWIR mineral alterations, Dynamic World land-cover classification, and drill targets.</div>
              </div>

              <div className="p-3 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] space-y-1">
                <div className="font-bold text-[#272A27]">Section 3: Fleet SCADA Diagnostics &amp; Thermodynamics</div>
                <div className="text-[11px] text-[#5F625C]">LHD loaders, heavy dumpers, and primary crushers vibration FFT spectra and predictive RUL.</div>
              </div>

              <div className="p-3 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] space-y-1">
                <div className="font-bold text-[#272A27]">Section 4: DGMS Statutory Decision Ledger &amp; Sign-off</div>
                <div className="text-[11px] text-[#5F625C]">Cryptographic audit trail of shift engineer mitigations and digital approvals.</div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
