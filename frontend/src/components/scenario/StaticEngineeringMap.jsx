import React, { useState } from 'react';
import { Truck, Wrench, Droplet, Zap, ShieldAlert, Cpu, Activity, CheckCircle2, X } from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const StaticEngineeringMap = ({ mine, scenarioResult, onSelectAsset }) => {
  const { lang, t } = useApp();
  const [selectedAsset, setSelectedAsset] = useState(null);
  const isUnderground = mine?.mineType?.toLowerCase().includes('underground');
  const sc = t?.scenarioLab || {};

  const assets = [
    {
      id: 'CRUSHER-01',
      name: lang === 'hi' ? 'प्राथमिक साइजिंग गायरेटरी क्रशर' : lang === 'mr' ? 'प्राथमिक साइजिंग गायरेटरी क्रशर' : 'Primary Sizing Gyratory Crusher',
      type: lang === 'hi' ? 'क्रशर स्टेशन' : lang === 'mr' ? 'क्रशर स्टेशन' : 'Crusher Station',
      x: 72,
      y: 35,
      status: scenarioResult?.waterfall?.crusherLossT > 0 ? 'CRITICAL' : 'OPTIMAL',
      health: scenarioResult?.waterfall?.crusherLossT > 0
        ? (lang === 'hi' ? '42% - हार्मोनिक जाम' : lang === 'mr' ? '42% - हार्मोनिक बिघाड' : '42% - Harmonic Seizure')
        : (lang === 'hi' ? '96% - सामान्य' : lang === 'mr' ? '96% - सामान्य' : '96% - Nominal'),
      utilization: scenarioResult?.waterfall?.crusherLossT > 0
        ? (lang === 'hi' ? '14% (गिरावट)' : lang === 'mr' ? '14% (घसरण)' : '14% (Degraded)')
        : (lang === 'hi' ? '86% (उत्कृष्ट)' : lang === 'mr' ? '86% (उत्कृष्ट)' : '86% (Optimal)'),
      throughput: `${scenarioResult?.waterfall?.crusherLossT > 0 ? '60' : '380'} TPH`,
      risk: scenarioResult?.waterfall?.crusherLossT > 0 ? 'HIGH' : 'LOW'
    },
    {
      id: 'RAMP-EAST',
      name: lang === 'hi' ? 'मुख्य ढुलाई रैंप (पूर्वी गलियारा)' : lang === 'mr' ? 'मुख्य वाहतूक रस्ता (पूर्व कॉरिडॉर)' : 'Main Haul Ramp (East Corridor)',
      type: lang === 'hi' ? 'ढुलाई गलियारा' : lang === 'mr' ? 'वाहतूक कॉरिडॉर' : 'Haulage Corridor',
      x: 48,
      y: 62,
      status: scenarioResult?.waterfall?.haulageLossT > 0 ? 'WARNING' : 'OPTIMAL',
      health: scenarioResult?.waterfall?.haulageLossT > 0
        ? (lang === 'hi' ? 'कर्षण -38% (कीचड़)' : lang === 'mr' ? 'कर्षण -38% (चिखल)' : 'Traction -38% (Slurry)')
        : (lang === 'hi' ? 'घर्षण 0.85 (सामान्य)' : lang === 'mr' ? 'घर्षण 0.85 (सामान्य)' : 'Friction 0.85 (Nominal)'),
      utilization: '18 Trucks / Hr',
      throughput: '3,200 TPD Corridor',
      risk: scenarioResult?.waterfall?.haulageLossT > 0 ? 'HIGH' : 'LOW'
    },
    {
      id: 'SUMP-DEEP',
      name: lang === 'hi' ? 'नाबदान जल निकासी स्टेशन' : lang === 'mr' ? 'नाबदान पाणी उपसा स्टेशन' : 'Pit Sump Dewatering Station',
      type: lang === 'hi' ? 'सबमर्सिबल पंप सरणी' : lang === 'mr' ? 'सबमर्सिबल पंप संच' : 'Submersible Pump Array',
      x: 32,
      y: 45,
      status: scenarioResult?.waterfall?.weatherLossT > 0 ? 'WARNING' : 'OPTIMAL',
      health: '450 kW Submersible Array',
      utilization: scenarioResult?.waterfall?.weatherLossT > 0
        ? (lang === 'hi' ? '94% (बाढ़ प्रवाह)' : lang === 'mr' ? '94% (पूर प्रवाह)' : '94% (Surge Inflow)')
        : (lang === 'hi' ? '42% (सामान्य)' : lang === 'mr' ? '42% (सामान्य)' : '42% (Nominal)'),
      throughput: '120 m³/hr Clearance',
      risk: scenarioResult?.waterfall?.weatherLossT > 0 ? 'HIGH' : 'LOW'
    },
    {
      id: 'STOCKPILE-ROM',
      name: lang === 'hi' ? 'आरओएम सर्ज स्टॉकपाइल बफर' : lang === 'mr' ? 'आरओएम सर्ज साठा बफर' : 'ROM Surge Stockpile Buffer',
      type: lang === 'hi' ? 'मिश्रण यार्ड' : lang === 'mr' ? 'मिश्रण यार्ड' : 'Surge Blending Yard',
      x: 82,
      y: 68,
      status: 'OPTIMAL',
      health: '12,500T Active Reserve',
      utilization: '68% Capacity',
      throughput: 'Blending Feed Grade 42.4% Mn',
      risk: 'LOW'
    },
    {
      id: isUnderground ? 'SHAFT-HEADFRAME' : 'EXCAVATION-BENCH',
      name: isUnderground
        ? (lang === 'hi' ? 'मुख्य उत्पादन स्किप शाफ्ट (42मी)' : lang === 'mr' ? 'मुख्य उत्पादन स्किप शाफ्ट (42मी)' : 'Main Production Skip Shaft (42m)')
        : (lang === 'hi' ? 'सक्रिय मैंगनीज उत्पादन फेस' : lang === 'mr' ? 'सक्रिय मॅंगनीज उत्पादन फेस' : 'Active Manganese Production Face'),
      type: isUnderground
        ? (lang === 'hi' ? 'हॉइस्टिंग टॉवर' : lang === 'mr' ? 'हॉइस्टिंग टॉवर' : 'Hoisting Tower')
        : (lang === 'hi' ? 'हाइड्रोलिक फावड़ा लोडिंग' : lang === 'mr' ? 'हायड्रॉलिक लोडिंग' : 'Hydraulic Shovel Loading'),
      x: 52,
      y: 28,
      status: 'OPTIMAL',
      health: isUnderground ? 'Double-Drum Winder (12.5 m/s)' : 'Komatsu PC2000 Face',
      utilization: '92% Shift Efficiency',
      throughput: `${mine?.productionTarget || 4000} TPD Quota`,
      risk: 'LOW'
    }
  ];

  const handleAssetClick = (asset) => {
    setSelectedAsset(asset);
    if (onSelectAsset) onSelectAsset(asset);
  };

  return (
    <div className="relative w-full rounded-3xl bg-[#080d16] border border-[#1e2f4a] p-4 sm:p-5 overflow-hidden font-mono text-xs select-none shadow-2xl">

      {/* Header */}
      <div className="flex justify-between items-center pb-3 border-b border-[#1e2f4a] mb-3">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-amber-400" />
          <span className="text-white font-bold tracking-wider text-xs uppercase">
            {scenarioResult?.mineName?.toUpperCase()} // {sc?.staticMapTitle || '2D STATIC OPERATIONAL SCHEMATIC'}
          </span>
        </div>
        <span className="text-[10px] text-[#5F625C] bg-[#121c2c] px-2.5 py-1 rounded-lg border border-[#1e2f4a]">
          {isUnderground ? (sc?.undergroundLayout || 'UNDERGROUND MINE LAYOUT') : (sc?.opencastLayout || 'OPEN-CAST QUARRY SCHEMATIC')}
        </span>
      </div>

      {/* SVG Engineering Map */}
      <div className="relative w-full h-64 bg-[#05080f] rounded-2xl border border-[#142032] overflow-hidden">
        <svg viewBox="0 0 100 100" className="w-full h-full preserve-3d">
          {/* Background Grid */}
          <defs>
            <pattern id="eng-grid" width="10" height="10" patternUnits="userSpaceOnUse">
              <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#0e1726" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100" height="100" fill="url(#eng-grid)" />

          {/* Lease Boundary */}
          <polygon
            points="10,15 88,10 94,82 15,88"
            fill="rgba(56, 189, 248, 0.03)"
            stroke="#1e3a5f"
            strokeWidth="0.8"
            strokeDasharray="2,2"
          />

          {/* Haul Road Splines */}
          <path
            d="M 18,80 Q 45,75 52,50 T 72,35"
            fill="none"
            stroke="#334155"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <path
            d="M 18,80 Q 45,75 52,50 T 72,35"
            fill="none"
            stroke="#eab308"
            strokeWidth="0.8"
            strokeDasharray="1.5,1.5"
          />

          {/* Pit Terraces / Stope Boundaries */}
          <ellipse cx="50" cy="50" rx="35" ry="24" fill="none" stroke="#1e293b" strokeWidth="1" />
          <ellipse cx="48" cy="48" rx="25" ry="16" fill="none" stroke="#334155" strokeWidth="1" />
          <ellipse cx="46" cy="46" rx="14" ry="9" fill="rgba(168, 85, 247, 0.08)" stroke="#7c3aed" strokeWidth="1" />

          {/* Sump Area */}
          <ellipse cx="32" cy="45" rx="8" ry="5" fill="rgba(6, 182, 212, 0.3)" stroke="#06b6d4" strokeWidth="0.8" />
          <text x="32" y="46" fontSize="2.5" fill="#38bdf8" textAnchor="middle" fontWeight="bold">SUMP</text>

          {/* Stockpile */}
          <polygon points="78,64 88,64 83,56" fill="rgba(100, 116, 139, 0.4)" stroke="#94a3b8" strokeWidth="0.8" />
          <text x="83" y="68" fontSize="2.5" fill="#94a3b8" textAnchor="middle">ROM STOCKPILE</text>

          {/* Interactive Asset Hotspots */}
          {assets.map((asset) => {
            const isWarn = asset.status === 'WARNING';
            const isCrit = asset.status === 'CRITICAL';
            const pinColor = isCrit ? '#ef4444' : isWarn ? '#f59e0b' : '#10b981';

            return (
              <g
                key={asset.id}
                className="cursor-pointer transition-transform hover:scale-125"
                onClick={() => handleAssetClick(asset)}
              >
                <circle cx={asset.x} cy={asset.y} r="3" fill={pinColor} opacity="0.3" className="animate-ping" />
                <circle cx={asset.x} cy={asset.y} r="2.2" fill="#0b1220" stroke={pinColor} strokeWidth="0.8" />
                <circle cx={asset.x} cy={asset.y} r="1" fill={pinColor} />
                <text
                  x={asset.x}
                  y={asset.y - 3.5}
                  fontSize="2.4"
                  fill="#ffffff"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {asset.id}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Map Legend */}
        <div className="absolute bottom-2 left-2 flex items-center gap-3 bg-[#0b1220]/90 px-3 py-1.5 rounded-lg border border-[#1e2f4a] text-[9.5px] text-[#272A27]">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>{lang === 'hi' ? 'सामान्य' : lang === 'mr' ? 'सामान्य' : 'Nominal'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>{lang === 'hi' ? 'उच्च तनाव' : lang === 'mr' ? 'उच्च ताण' : 'Elevated Stress'}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>{lang === 'hi' ? 'अवरोध' : lang === 'mr' ? 'अडथळा' : 'Bottleneck'}</span>
          </div>
        </div>
      </div>

      {/* Selected Asset Modal Dossier */}
      {selectedAsset && (
        <div className="mt-3 p-3.5 rounded-xl bg-[#0e1726] border border-[#1e2f4a] space-y-2">
          <div className="flex justify-between items-center pb-1.5 border-b border-[#1e2f4a]">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
              <Cpu className="w-3.5 h-3.5" />
              <span>{selectedAsset.id} // {selectedAsset.name}</span>
            </div>
            <button
              onClick={() => setSelectedAsset(null)}
              className="text-[#5F625C] hover:text-[#272A27] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-[10.5px]">
            <div className="p-2 rounded-lg bg-[#121c2c] border border-[#1e2f4a]">
              <span className="text-[#5F625C] block text-[9.5px]">
                {lang === 'hi' ? 'संपत्ति प्रकार' : lang === 'mr' ? 'मालमत्ता प्रकार' : 'Asset Type'}
              </span>
              <strong className="text-[#272A27]">{selectedAsset.type}</strong>
            </div>
            <div className="p-2 rounded-lg bg-[#121c2c] border border-[#1e2f4a]">
              <span className="text-[#5F625C] block text-[9.5px]">
                {lang === 'hi' ? 'स्थिति स्थिति' : lang === 'mr' ? 'स्थिती' : 'Condition Status'}
              </span>
              <strong className={selectedAsset.status === 'CRITICAL' ? 'text-rose-400' : 'text-emerald-400'}>
                {selectedAsset.health}
              </strong>
            </div>
            <div className="p-2 rounded-lg bg-[#121c2c] border border-[#1e2f4a]">
              <span className="text-[#5F625C] block text-[9.5px]">
                {lang === 'hi' ? 'सक्रिय उपयोगिता' : lang === 'mr' ? 'सक्रिय वापर' : 'Active Utilization'}
              </span>
              <strong className="text-sky-400">{selectedAsset.utilization}</strong>
            </div>
            <div className="p-2 rounded-lg bg-[#121c2c] border border-[#1e2f4a]">
              <span className="text-[#5F625C] block text-[9.5px]">
                {lang === 'hi' ? 'थ्रूपुट दर' : lang === 'mr' ? 'थ्रूपुट दर' : 'Throughput Rate'}
              </span>
              <strong className="text-amber-400">{selectedAsset.throughput}</strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
