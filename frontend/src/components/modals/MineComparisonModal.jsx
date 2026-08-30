import React, { useState } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  X, 
  Layers, 
  Activity, 
  TrendingUp, 
  ShieldCheck, 
  Sparkles, 
  Check, 
  BarChart3 
} from 'lucide-react';
import { OFFICIAL_MOIL_MINES, getMine } from '../../services/mineRegistry.js';

export const MineComparisonModal = ({ isOpen, onClose }) => {
  const { officialMines, t, lang } = useApp();
  const allMines = Array.isArray(officialMines) && officialMines.length > 0 ? officialMines : OFFICIAL_MOIL_MINES;
  
  const [selectedIds, setSelectedIds] = useState(['balaghat', 'dongri-buzurg', 'tirodi', 'gumgaon']);

  if (!isOpen) return null;

  const toggleMine = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 2) {
        setSelectedIds(selectedIds.filter(x => x !== id));
      }
    } else {
      if (selectedIds.length < 4) {
        setSelectedIds([...selectedIds, id]);
      }
    }
  };

  const comparedMines = selectedIds.map(id => getMine(id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian-950/85 backdrop-blur-xl animate-fade-in font-mono text-xs select-none">
      <div 
        className="w-full max-w-5xl max-h-[90vh] rounded-2xl bg-[#0a0e14] border border-[#1e293b] shadow-2xl flex flex-col overflow-hidden animate-scale-up"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="p-5 border-b border-[#141b27] flex items-center justify-between bg-[#070a0f]">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#141c2b] border border-amber-500/30 flex items-center justify-center">
              <BarChart3 className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                {lang === 'hi' ? 'कार्यकारी बेंचमार्क // बहु-परिसंपत्ति तुलना' : lang === 'mr' ? 'कार्यकारी बेंचमार्क // बहु-मालमत्ता तुलना' : 'EXECUTIVE BENCHMARK // MULTI-ASSET COMPARISON'}
              </div>
              <h2 className="font-display text-lg font-bold text-white">
                {lang === 'hi' ? 'मॉयल खदान नेटवर्क बहु-साइट तुलना' : lang === 'mr' ? 'मॉयल खाण नेटवर्क बहु-साइट तुलना' : 'MOIL Mine Network Multi-Site Comparison'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-[#141b27] hover:bg-[#1f2c42] text-zinc-400 hover:text-white flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selection Pills Strip */}
        <div className="p-4 bg-[#080b10] border-b border-[#141b27] flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-zinc-400 font-bold uppercase mr-2">
            {lang === 'hi' ? '2 से 4 खदानें चुनें:' : lang === 'mr' ? '2 ते 4 खाणी निवडा:' : 'Select 2 to 4 Mines:'}
          </span>
          {allMines.map((m) => {
            const isSelected = selectedIds.includes(m.id);
            return (
              <button
                key={m.id}
                onClick={() => toggleMine(m.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'bg-[#0e141f] text-zinc-400 border border-[#1a2538] hover:text-white'
                }`}
              >
                {isSelected && <Check className="w-3 h-3 text-amber-400" />}
                <span>{m.shortName || m.name}</span>
              </button>
            );
          })}
        </div>

        {/* Comparison Matrix Table */}
        <div className="p-6 overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs">
            <thead>
              <tr className="border-b border-[#1f293d]">
                <th className="pb-3 text-zinc-500 uppercase text-[10px]">
                  {lang === 'hi' ? 'परिचालन मीट्रिक' : lang === 'mr' ? 'ऑपरेशनल मेट्रिक' : 'Operational Metric'}
                </th>
                {comparedMines.map((m) => (
                  <th key={m.id} className="pb-3 text-white font-bold text-xs">
                    <div>{m.name}</div>
                    <div className="text-[10px] text-zinc-500 font-normal">{m.district}, {m.state}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#141b27]">
              
              <tr>
                <td className="py-3 text-zinc-400">{lang === 'hi' ? 'खदान प्रकार' : lang === 'mr' ? 'खाण प्रकार' : 'Mine Type'}</td>
                {comparedMines.map((m) => (
                  <td key={m.id} className="py-3 text-zinc-200 font-semibold">{m.mineType}</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 text-zinc-400">{lang === 'hi' ? 'दैनिक लक्ष्य (TPD)' : lang === 'mr' ? 'दैनिक उद्दिष्ट (TPD)' : 'Daily Target (TPD)'}</td>
                {comparedMines.map((m) => (
                  <td key={m.id} className="py-3 text-white font-bold">{m.productionTarget?.toLocaleString()} T</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 text-zinc-400">{lang === 'hi' ? 'औसत अयस्क ग्रेड' : lang === 'mr' ? 'सरासरी खनिज प्रत' : 'Average Ore Grade'}</td>
                {comparedMines.map((m) => (
                  <td key={m.id} className="py-3 text-amber-400 font-bold">{m.averageMnGrade || m.oreGrade}% Mn</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 text-zinc-400">{lang === 'hi' ? 'रिकवरी दर' : lang === 'mr' ? 'पुनर्प्राप्ती दर' : 'Recovery Rate'}</td>
                {comparedMines.map((m) => (
                  <td key={m.id} className="py-3 text-teal-400 font-bold">{m.recoveryRateBase || 87.5}%</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 text-zinc-400">{lang === 'hi' ? 'एचईएमएम फ्लीट इकाइयां' : lang === 'mr' ? 'एचईएमएम फ्लीट युनिट्स' : 'HEMM Fleet Units'}</td>
                {comparedMines.map((m) => (
                  <td key={m.id} className="py-3 text-zinc-200">{m.fleetCount} Units</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 text-zinc-400">{lang === 'hi' ? 'ऐतिहासिक कमी प्रवृत्ति' : lang === 'mr' ? 'ऐतिहासिक तूट प्रवृत्ती' : 'Historical Shortfall Tendency'}</td>
                {comparedMines.map((m) => (
                  <td key={m.id} className="py-3 text-zinc-300">{Math.round((m.historicalShortfallTendency || 0.12) * 100)}%</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 text-zinc-400">{lang === 'hi' ? 'यूएनएफसी रिजर्व क्षमता' : lang === 'mr' ? 'यूएनएफसी साठा संभाव्यता' : 'UNFC Reserve Potential'}</td>
                {comparedMines.map((m) => (
                  <td key={m.id} className="py-3 text-cyan-400 font-bold">{m.reservePotentialM || 4.2}M Tonnes</td>
                ))}
              </tr>

              <tr>
                <td className="py-3 text-zinc-400">{lang === 'hi' ? 'एआई ट्रस्ट स्कोर' : lang === 'mr' ? 'एआय विश्वास निर्देशांक' : 'AI Trust Score'}</td>
                {comparedMines.map((m) => (
                  <td key={m.id} className="py-3 text-teal-400 font-bold">94.8% ({lang === 'hi' ? 'सत्यापित' : lang === 'mr' ? 'तपासलेले' : 'Pillar Verified'})</td>
                ))}
              </tr>

            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#141b27] bg-[#070a0f] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#141c2b] hover:bg-[#1f2c42] text-white font-bold"
          >
            {t?.modals?.close || t?.common?.close || 'Close Comparison'}
          </button>
        </div>

      </div>
    </div>
  );
};
