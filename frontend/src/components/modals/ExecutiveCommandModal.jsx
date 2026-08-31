import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  X,
  ShieldCheck,
  Activity,
  TrendingUp,
  Cpu,
  AlertTriangle,
  Building2,
  Award,
  Sparkles
} from 'lucide-react';
import { OFFICIAL_MOIL_MINES } from '../../services/mineRegistry.js';

export const ExecutiveCommandModal = ({ isOpen, onClose }) => {
  const { setSelectedMineId, activeMine, t, lang } = useApp();

  if (!isOpen) return null;

  const totalTarget = OFFICIAL_MOIL_MINES.reduce((acc, m) => acc + (m.productionTarget || 0), 0);
  const totalFleet = OFFICIAL_MOIL_MINES.reduce((acc, m) => acc + (m.fleetCount || 0), 0);
  const avgGrade = (OFFICIAL_MOIL_MINES.reduce((acc, m) => acc + (m.baseGradeNum || 40), 0) / OFFICIAL_MOIL_MINES.length).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#F0EBE2]/85 backdrop-blur-xl animate-fade-in font-mono text-xs select-none">
      <div
        className="w-full max-w-5xl max-h-[90vh] rounded-2xl bg-[#0a0e14] border border-[#1e293b] shadow-2xl flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Header */}
        <div className="p-5 border-b border-[#141b27] flex items-center justify-between bg-[#070a0f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#141c2b] border border-cyan-500/30 flex items-center justify-center">
              <Building2 className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                {lang === 'hi' ? 'पीएसयू कार्यकारी कमान // मॉयल लिमिटेड उद्यम नेटवर्क' : lang === 'mr' ? 'पीएसयू कार्यकारी कमांड // मॉयल लिमिटेड उपक्रम नेटवर्क' : 'PSU EXECUTIVE COMMAND // MOIL LTD ENTERPRISE NETWORK'}
              </div>
              <h2 className="font-display text-lg font-bold text-[#272A27]">
                {lang === 'hi' ? 'उद्यम खनन संचालन कमान दृश्य' : lang === 'mr' ? 'उपक्रम खाणकाम ऑपरेशन्स कमांड दृश्य' : 'Enterprise Mining Operations Command View'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#141b27] hover:bg-[#1f2c42] text-[#5F625C] hover:text-[#272A27] flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Aggregate KPI Strip */}
        <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#080b10] border-b border-[#141b27]">
          <div className="p-3.5 rounded-xl bg-[#0c1017] border border-[#1a2333] space-y-1">
            <span className="text-[#85877E] text-[10px] uppercase block">
              {lang === 'hi' ? 'कुल नेटवर्क उत्पादन लक्ष्य' : lang === 'mr' ? 'एकूण नेटवर्क उत्पादन उद्दिष्ट' : 'Total Network Output Target'}
            </span>
            <div className="text-xl font-bold text-[#272A27]">{totalTarget.toLocaleString()} T/day</div>
            <span className="text-[10px] text-teal-400">{lang === 'hi' ? 'मध्य प्रदेश एवं महाराष्ट्र में 10 खदानें' : lang === 'mr' ? 'मध्य प्रदेश व महाराष्ट्रातील 10 खाणी' : '10 Mines in MP & MH'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c1017] border border-[#1a2333] space-y-1">
            <span className="text-[#85877E] text-[10px] uppercase block">
              {lang === 'hi' ? 'उद्यम एचईएमएम फ्लीट' : lang === 'mr' ? 'उपक्रम एचईएमएम फ्लीट' : 'Enterprise HEMM Fleet'}
            </span>
            <div className="text-xl font-bold text-[#272A27]">{totalFleet} Units</div>
            <span className="text-[10px] text-[#5F625C]">{lang === 'hi' ? '91% नेटवर्क उपलब्धता' : lang === 'mr' ? '91% नेटवर्क उपलब्धता' : '91% Network Availability'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c1017] border border-[#1a2333] space-y-1">
            <span className="text-[#85877E] text-[10px] uppercase block">
              {lang === 'hi' ? 'औसत नेटवर्क अयस्क ग्रेड' : lang === 'mr' ? 'सरासरी नेटवर्क खनिज प्रत' : 'Average Network Ore Grade'}
            </span>
            <div className="text-xl font-bold text-amber-400">{avgGrade}% Mn</div>
            <span className="text-[10px] text-[#5F625C]">{lang === 'hi' ? 'उच्च-ग्रेड ब्राउनाइट प्रमुख' : lang === 'mr' ? 'उच्च-प्रत ब्राउनाइट प्रमुख' : 'High-Grade Braunite Dominant'}</span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#0c1017] border border-[#1a2333] space-y-1">
            <span className="text-[#85877E] text-[10px] uppercase block">
              {lang === 'hi' ? 'एआई मॉडल गवर्नेंस' : lang === 'mr' ? 'एआय मॉडेल गव्हर्नन्स' : 'AI Model Governance'}
            </span>
            <div className="text-xl font-bold text-teal-400">94.8% {t?.common?.trust || 'Trust'}</div>
            <span className="text-[10px] text-[#5F625C]">{lang === 'hi' ? 'डीजीएमएस ट्रैसेबिलिटी सक्रिय' : lang === 'mr' ? 'डीजीएमएस नियम पालन सक्रिय' : 'DGMS Traceability Active'}</span>
          </div>
        </div>

        {/* Network Asset Roster */}
        <div className="p-6 overflow-y-auto space-y-4 max-h-[420px]">
          <div className="text-xs font-bold text-[#272A27] uppercase tracking-wider">
            {lang === 'hi' ? 'सक्रिय परिसंपत्ति पोर्टफोलियो' : lang === 'mr' ? 'सक्रिय मालमत्ता पोर्टफोलिओ' : 'Active Asset Portfolio'}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {OFFICIAL_MOIL_MINES.map((m) => (
              <div
                key={m.id}
                onClick={() => {
                  setSelectedMineId(m.id);
                  onClose();
                }}
                className={`p-3.5 rounded-xl bg-[#0c1017] border transition-all cursor-pointer hover:border-amber-500/40 flex items-center justify-between gap-3 ${
                  activeMine.id === m.id ? 'border-amber-500/50 bg-amber-950/10' : 'border-[#1a2333]'
                }`}
              >
                <div>
                  <div className="font-bold text-[#272A27] text-xs">{m.name}</div>
                  <div className="text-[10px] text-[#5F625C] mt-0.5">
                    {m.district}, {m.state} • {m.mineType}
                  </div>
                  <div className="text-[10px] text-amber-400 mt-0.5">
                    {t?.common?.target || 'Target'}: {m.productionTarget?.toLocaleString()} TPD • {m.baseGradeNum}% Mn
                  </div>
                </div>

                <div className="text-right">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-500/20 text-teal-300 border border-teal-500/30">
                    {t?.common?.optimal || 'NOMINAL'}
                  </span>
                  <div className="text-[10px] text-[#85877E] mt-1">{lang === 'hi' ? 'चुनने के लिए क्लिक करें →' : lang === 'mr' ? 'निवडण्यासाठी क्लिक करा →' : 'Click to Switch →'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#141b27] bg-[#070a0f] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#141c2b] hover:bg-[#1f2c42] text-white font-bold"
          >
            {t?.modals?.close || t?.common?.close || 'Close Executive View'}
          </button>
        </div>

      </div>
    </div>
  );
};
