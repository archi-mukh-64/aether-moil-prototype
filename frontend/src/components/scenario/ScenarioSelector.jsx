import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { SCENARIO_MINES, SCENARIO_TYPES } from '../../data/mockScenarios.js';
import {
  Play,
  RotateCcw,
  CloudRain,
  Cpu,
  Truck,
  Layers,
  Sparkles,
  AlertTriangle,
  SlidersHorizontal,
  Compass,
  Clock,
  ShieldCheck,
  CheckCircle2,
  BrainCircuit,
  Binary
} from 'lucide-react';

export const ScenarioSelector = () => {
  const {
    selectedMineId,
    setSelectedMineId,
    activeScenarioId,
    scenarioSeverity,
    setScenarioSeverity,
    scenarioTimeHorizon,
    setScenarioTimeHorizon,
    intelligenceMode,
    setIntelligenceMode,
    runScenario,
    resetDemo,
    activeScenario,
    t,
    lang
  } = useApp();

  const [selectedScenarioKey, setSelectedScenarioKey] = React.useState(activeScenarioId || 'MONSOON');
  const scenT = t?.scenarioLab || {};
  const comm = t?.common || {};

  // Keep selected key synchronized
  React.useEffect(() => {
    if (activeScenarioId) {
      setSelectedScenarioKey(activeScenarioId);
    }
  }, [activeScenarioId]);

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'CloudRain': return CloudRain;
      case 'Cpu': return Cpu;
      case 'Truck': return Truck;
      case 'Layers': return Layers;
      case 'Sparkles': return Sparkles;
      default: return AlertTriangle;
    }
  };

  const handleScenarioSelect = (scenId) => {
    setSelectedScenarioKey(scenId);
    if (activeScenarioId) {
      runScenario(scenId, scenarioSeverity, scenarioTimeHorizon);
    }
  };

  const handleRun = () => {
    runScenario(selectedScenarioKey, scenarioSeverity, scenarioTimeHorizon);
  };

  const isMlMode = intelligenceMode === 'ML_MODEL';

  return (
    <div className="panel-surface p-6 sm:p-8 border border-[#C8BFAF] font-mono text-xs space-y-6 select-none">

      {/* Header with Mode Toggle & Metadata */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#C8BFAF] gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-manganese-500/20 border border-manganese-500/30 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4 text-manganese-400" />
          </div>
          <div>
            <h3 className="font-display text-base font-bold text-white">
              {scenT.pageTitle || 'Operational Scenario Lab'}
            </h3>
            <span className="text-[10px] text-[#85877E]">
              {lang === 'hi' ? 'नियतिवादी तनाव इंजेक्शन एवं बहु-इंजन एमएल अनुमान' : lang === 'mr' ? 'नियतात्मक ताण इंजेक्शन व बहु-इंजिन एमएल अंदाज' : 'Deterministic Stress Injection & Multi-Engine ML Inference'}
            </span>
          </div>
        </div>

        {/* Intelligence Engine Mode Switcher */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <div className="flex items-center p-1 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
            <button
              onClick={() => setIntelligenceMode('DETERMINISTIC_DEMO')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                !isMlMode
                  ? 'bg-[#C8BFAF] text-white shadow-sm'
                  : 'text-[#85877E] hover:text-[#272A27]'
              }`}
            >
              <Binary className="w-3 h-3" />
              <span>{lang === 'hi' ? 'डेमो इंजन' : lang === 'mr' ? 'डेमो इंजिन' : 'DEMO ENGINE'}</span>
            </button>
            <button
              onClick={() => setIntelligenceMode('ML_MODEL')}
              className={`px-3 py-1 rounded-lg text-[10px] font-bold transition-all flex items-center gap-1.5 ${
                isMlMode
                  ? 'bg-gradient-to-r from-manganese-500 to-amber-500 text-obsidian-950 shadow-sm'
                  : 'text-[#85877E] hover:text-[#272A27]'
              }`}
            >
              <BrainCircuit className="w-3 h-3" />
              <span>{lang === 'hi' ? 'एमएल अनुमान' : lang === 'mr' ? 'एमएल अंदाज' : 'ML INFERENCE'}</span>
            </button>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-[#F0EBE2] border border-[#C8BFAF] text-[10px] text-[#5F625C] font-bold hidden sm:block">
            {lang === 'hi' ? 'सिंथेटिक प्रदर्शन डेटा' : lang === 'mr' ? 'सिंथेटिक प्रात्यक्षिक डेटा' : 'SYNTHETIC DEMONSTRATION DATA'}
          </div>
        </div>
      </div>

      {/* Model Metadata Sub-Bar */}
      {isMlMode && (
        <div className="p-3 rounded-xl bg-manganese-950/20 border border-manganese-500/30 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#272A27] animate-fade-in">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-4 h-4 text-manganese-400" />
            <span>{lang === 'hi' ? 'सक्रिय मॉडल:' : lang === 'mr' ? 'सक्रिय मॉडेल:' : 'Active Model:'} <strong className="text-white">SHORTFALL-GBM v1.0</strong> (140 Trees • 99.7% ROC-AUC)</span>
          </div>
          <div className="flex items-center gap-4 text-[10px]">
            <span>{lang === 'hi' ? 'मोड:' : lang === 'mr' ? 'मोड:' : 'Mode:'} <strong className="text-telemetry-400">{lang === 'hi' ? 'एमएल मॉडल' : lang === 'mr' ? 'एमएल मॉडेल' : 'ML MODEL'}</strong></span>
            <span>{lang === 'hi' ? 'विश्वास:' : lang === 'mr' ? 'विश्वास:' : 'Confidence:'} <strong className="text-manganese-400">91.4%</strong></span>
            <span>{lang === 'hi' ? 'रजिस्ट्री:' : lang === 'mr' ? 'नोंदवही:' : 'Registry:'} <strong className="text-[#5F625C]">models/model_registry.json</strong></span>
          </div>
        </div>
      )}

      {/* 1. Target Mine Selection */}
      <div>
        <label className="text-[10px] text-[#5F625C] uppercase tracking-wider block mb-2 font-bold">
          {lang === 'hi' ? '1. लक्षित मैंगनीज खदान संपत्ति (आधारभूत कोटा एवं अयस्क ग्रेड):' : lang === 'mr' ? '1. लक्ष्यित मॅंगनीज खाण मालमत्ता (पायाभूत कोटा व खनिज प्रत):' : '1. Target Manganese Mine Asset (Affects Baseline Quota & Ore Grade):'}
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {SCENARIO_MINES.map((m) => (
            <button
              key={m.id}
              onClick={() => setSelectedMineId(m.id)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                selectedMineId === m.id
                  ? 'bg-manganese-500/15 border-manganese-500/60 text-white ring-1 ring-manganese-400/40 shadow-sm'
                  : 'bg-[#F5F1E9] border-[#C8BFAF] text-[#5F625C] hover:text-[#272A27] hover:bg-[#DDD4C5]'
              }`}
            >
              <div className="font-bold text-xs truncate">{m.shortName || m.name.split(' ')[0]}</div>
              <div className="text-[10px] text-[#85877E] truncate">{m.state.split(' ')[0]} • {m.grade}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Scenario Type Selection */}
      <div>
        <label className="text-[10px] text-[#5F625C] uppercase tracking-wider block mb-2 font-bold">
          {lang === 'hi' ? '2. परिचालन परिदृश्य चुनें:' : lang === 'mr' ? '2. ऑपरेशनल परिस्थिती निवडा:' : '2. Select Operational Scenario:'}
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
          {SCENARIO_TYPES.map((scen) => {
            const Icon = getIcon(scen.icon);
            const isSelected = selectedScenarioKey === scen.id;

            return (
              <div
                key={scen.id}
                onClick={() => handleScenarioSelect(scen.id)}
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-[#DDD4C5] border-manganese-500/60 ring-1 ring-manganese-500/30 shadow-md'
                    : 'bg-[#F5F1E9] border-[#C8BFAF] hover:border-[#C8BFAF] hover:bg-[#DDD4C5]/50'
                }`}
              >
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                  isSelected ? 'bg-manganese-500/20 text-manganese-400' : 'bg-[#C8BFAF] text-[#5F625C]'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-white text-xs truncate">{scen.title}</div>
                  <div className="text-[10px] text-[#85877E] line-clamp-2 mt-0.5 font-sans">
                    {scen.shortDesc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. Severity & Time Horizon Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

        {/* Severity */}
        <div>
          <label className="text-[10px] text-[#5F625C] uppercase tracking-wider block mb-2 font-bold">
            {lang === 'hi' ? '3. तनाव गंभीरता (हानि एवं जोखिम गुणांक):' : lang === 'mr' ? '3. ताण तीव्रता (तूट व जोखीम गुणक):' : '3. Stress Severity (Multiplies Loss & Risk):'}
          </label>
          <div className="flex gap-1.5 p-1 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
            {['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].map((sev) => (
              <button
                key={sev}
                onClick={() => setScenarioSeverity(sev)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  scenarioSeverity === sev
                    ? 'bg-manganese-500 text-obsidian-950 shadow-sm'
                    : 'text-[#5F625C] hover:text-[#272A27] hover:bg-[#DDD4C5]'
                }`}
              >
                {sev === 'LOW' ? (lang === 'hi' ? 'कम' : lang === 'mr' ? 'कमी' : sev) :
                 sev === 'MEDIUM' ? (lang === 'hi' ? 'मध्यम' : lang === 'mr' ? 'मध्यम' : sev) :
                 sev === 'HIGH' ? (lang === 'hi' ? 'उच्च' : lang === 'mr' ? 'उच्च' : sev) :
                 (lang === 'hi' ? 'गंभीर' : lang === 'mr' ? 'गंभीर' : sev)}
              </button>
            ))}
          </div>
        </div>

        {/* Time Horizon */}
        <div>
          <label className="text-[10px] text-[#5F625C] uppercase tracking-wider block mb-2 font-bold">
            {lang === 'hi' ? '4. भविष्यवाणी समय-सीमा:' : lang === 'mr' ? '4. अंदाज कालावधी:' : '4. Prediction Horizon (Scales Cumulative Deficit):'}
          </label>
          <div className="flex gap-1.5 p-1 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
            {['6 HOURS', '24 HOURS', '7 DAYS'].map((h) => (
              <button
                key={h}
                onClick={() => setScenarioTimeHorizon(h)}
                className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                  scenarioTimeHorizon === h
                    ? 'bg-telemetry-500 text-obsidian-950 shadow-sm'
                    : 'text-[#5F625C] hover:text-[#272A27] hover:bg-[#DDD4C5]'
                }`}
              >
                {h === '6 HOURS' ? (lang === 'hi' ? '6 घंटे' : lang === 'mr' ? '6 तास' : h) :
                 h === '24 HOURS' ? (lang === 'hi' ? '24 घंटे' : lang === 'mr' ? '24 तास' : h) :
                 (lang === 'hi' ? '7 दिन' : lang === 'mr' ? '7 दिवस' : h)}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={handleRun}
          className="w-full sm:flex-1 py-3 rounded-xl bg-gradient-to-r from-manganese-500 to-amber-500 hover:from-manganese-400 hover:to-amber-400 text-obsidian-950 font-bold text-xs font-mono uppercase tracking-wider shadow-[0_0_25px_rgba(245,158,11,0.25)] transition-all flex items-center justify-center gap-2 hover:scale-[1.01]"
        >
          <Play className="w-4 h-4" />
          <span>{lang === 'hi' ? 'व्हॉट-इफ सिमुलेशन चलाएं' : lang === 'mr' ? 'व्हॉट-इफ सिम्युलेशन चालवा' : (activeScenario ? `EXECUTE ${isMlMode ? 'ML MODEL INFERENCE' : 'DEMO ENGINE'}` : `RUN ${isMlMode ? 'ML INFERENCE' : 'SIMULATION'}`)}</span>
        </button>

        <button
          onClick={resetDemo}
          className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#DDD4C5] hover:bg-[#C8BFAF] text-[#5F625C] hover:text-[#272A27] font-bold text-xs font-mono uppercase tracking-wide border border-[#C8BFAF] transition-colors flex items-center justify-center gap-1.5"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'परिदृश्य रीसेट करें' : lang === 'mr' ? 'परिस्थिती रीसेट करा' : 'RESET SCENARIO'}</span>
        </button>
      </div>

    </div>
  );
};
