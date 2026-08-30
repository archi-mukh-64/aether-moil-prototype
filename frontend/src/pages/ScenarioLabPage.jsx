import { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext.jsx';
import { OFFICIAL_MOIL_MINES } from '../services/mineRegistry.js';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { AetherSectionHeader, AetherStatusBadge } from '../components/design-system/index.js';
import { StaticEngineeringMap } from '../components/scenario/StaticEngineeringMap.jsx';
import {
  SCENARIO_KEYS,
  TIME_HORIZONS,
  SEVERITY_LEVELS,
  calculateScenarioIntelligence,
  getLocalizedMineName
} from '../services/scenarioIntelligenceService.js';
import {
  SlidersHorizontal,
  FlaskConical,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Activity,
  Droplet,
  Wrench,
  Truck,
  Zap,
  Clock,
  DollarSign,
  ShieldCheck,
  Sliders,
  Workflow,
  ChevronRight,
  FileText,
  HelpCircle,
  Eye,
  Radio,
  BarChart3,
  Cpu,
  Layers,
  ArrowRight,
  Sparkle,
  Target,
  Award,
  Globe2,
  CloudRain,
  Wind,
  Compass,
  Download,
  Share2,
  Calendar,
  History,
  X,
  Gauge,
  Play
} from 'lucide-react';

export const ScenarioLabPage = () => {
  const { t } = useApp();
  return (
    <ErrorBoundary title={t?.scenarioLab?.title || "AETHER SCENARIO LAB"}>
      <ScenarioLabPageContent />
    </ErrorBoundary>
  );
};

const ScenarioLabPageContent = () => {
  const { activeMine, setSelectedMineId: setGlobalMineId, normalizedScenarioId, setScenario: setGlobalScenario, scenarioSeverity, lang, t } = useApp();
  const sc = t?.scenarioLab || {};
  const comm = t?.common || {};

  // Control State synced with global single source of truth
  const [selectedMineId, setSelectedMineIdLocal] = useState(activeMine?.id || 'balaghat');
  const [selectedScenarioId, setSelectedScenarioIdLocal] = useState(normalizedScenarioId !== 'BASELINE' ? normalizedScenarioId : 'HEAVY_MONSOON');
  const [selectedSeverity, setSelectedSeverity] = useState(scenarioSeverity || 'HIGH');
  const [selectedHorizon, setSelectedHorizon] = useState('24_HOURS');

  // Keep synced if activeMine changes globally
  useEffect(() => {
    if (activeMine?.id && activeMine.id !== selectedMineId) {
      setSelectedMineIdLocal(activeMine.id);
    }
  }, [activeMine?.id]);

  useEffect(() => {
    if (normalizedScenarioId && normalizedScenarioId !== 'BASELINE' && normalizedScenarioId !== selectedScenarioId) {
      setSelectedScenarioIdLocal(normalizedScenarioId);
    }
  }, [normalizedScenarioId]);

  const setSelectedMineId = (id) => {
    setSelectedMineIdLocal(id);
    if (setGlobalMineId) setGlobalMineId(id);
  };

  const setSelectedScenarioId = (scenId) => {
    setSelectedScenarioIdLocal(scenId);
    if (setGlobalScenario) setGlobalScenario(scenId);
  };

  // Interactive UI States
  const [activeCausalNode, setActiveCausalNode] = useState(null);
  const [selectedWaterfallItem, setSelectedWaterfallItem] = useState(null);
  const [activeInterventions, setActiveInterventions] = useState([]);
  const [scenarioHistory, setScenarioHistory] = useState([
    { id: '1', date: '28 Aug 2026', mineId: 'balaghat', mineName: 'Balaghat Mine', scenarioId: 'HEAVY_MONSOON', scenarioName: 'Heavy Monsoon Inundation', lossT: 1382, revenueL: 19.6 },
    { id: '2', date: '28 Aug 2026', mineId: 'tirodi', mineName: 'Tirodi Mine', scenarioId: 'CRUSHER_SEIZURE', scenarioName: 'Primary Crusher Seizure', lossT: 868, revenueL: 12.3 },
    { id: '3', date: '28 Aug 2026', mineId: 'dongri-buzurg', mineName: 'Dongri Buzurg Mine', scenarioId: 'FLEET_BREAKDOWN', scenarioName: 'Fleet Outage', lossT: 1674, revenueL: 23.8 }
  ]);
  const [isMultiScenarioOpen, setIsMultiScenarioOpen] = useState(false);

  // Selected Mine Metadata
  const currentMine = useMemo(() => {
    return OFFICIAL_MOIL_MINES.find(m => m.id === selectedMineId) || OFFICIAL_MOIL_MINES[0];
  }, [selectedMineId]);

  // Primary Calculated Scenario State
  const scenarioResult = useMemo(() => {
    return calculateScenarioIntelligence(
      selectedMineId,
      selectedScenarioId,
      selectedSeverity,
      selectedHorizon,
      lang
    );
  }, [selectedMineId, selectedScenarioId, selectedSeverity, selectedHorizon, lang]);

  // Multi-Scenario Comparison Matrix (4 Scenarios Side-by-Side)
  const multiScenarioData = useMemo(() => {
    const scenList = ['BASELINE_RESET', 'HEAVY_MONSOON', 'CRUSHER_SEIZURE', 'MULTI_RISK_CRISIS'];
    return scenList.map(scenId => calculateScenarioIntelligence(selectedMineId, scenId, selectedSeverity, selectedHorizon, lang));
  }, [selectedMineId, selectedSeverity, selectedHorizon, lang]);

  // Execute Analysis Handler
  const handleRunAnalysis = () => {
    const newEntry = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      mineId: currentMine.id,
      mineName: getLocalizedMineName(currentMine, lang),
      scenarioId: selectedScenarioId,
      scenarioName: scenarioResult.scenarioName,
      lossT: scenarioResult.lossTonnage,
      revenueL: scenarioResult.revenueAtRiskLakh
    };
    setScenarioHistory(prev => [newEntry, ...prev.slice(0, 5)]);
  };

  // Toggle Intervention Selection
  const toggleIntervention = (actionId) => {
    setActiveInterventions(prev =>
      prev.includes(actionId) ? prev.filter(id => id !== actionId) : [...prev, actionId]
    );
  };

  return (
    <div className="space-y-6 font-sans">

      {/* 1. TOP HEADER & BREADCRUMB */}
      <AetherSectionHeader
        title={`${getLocalizedMineName(currentMine, lang)} — Scenario Simulation Lab`}
        subtitle="Dynamic causal perturbation modeling, TreeSHAP loss attribution waterfalls, multi-layer GIS impact mapping, and automated statutory intervention optimizer."
        badge={sc?.mode || "PREDICTIVE SHOCK TESTING"}
        accent="#B76543"
        icon={FlaskConical}
        actions={
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsMultiScenarioOpen(!isMultiScenarioOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] text-[#272A27] text-xs font-bold font-mono hover:bg-[#E8E1D5] transition shadow-sm cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#B76543]" />
              <span>{isMultiScenarioOpen ? (comm?.closeMatrix || 'CLOSE MATRIX') : (comm?.multiMatrix || 'MULTI-SCENARIO MATRIX')}</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#B76543] text-white text-xs font-bold font-mono hover:bg-[#9B5133] shadow-sm transition cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{comm?.exportPdf || 'EXPORT DOSSIER (PDF)'}</span>
            </button>
          </div>
        }
      />

      {/* 2. TOP CONTROL BAR */}
      <div className="p-4 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-4 text-[#272A27]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">

          {/* Mine Selector */}
          <div>
            <label className="block text-[10.5px] font-bold text-[#5F625C] uppercase tracking-wider mb-1">
              {sc?.selectMine || 'Select Mine Asset'}
            </label>
            <select
              value={selectedMineId}
              onChange={(e) => setSelectedMineId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] text-[#272A27] text-xs font-bold focus:outline-none focus:border-[#B76543] cursor-pointer"
            >
              {OFFICIAL_MOIL_MINES.map(m => (
                <option key={m.id} value={m.id}>
                  {getLocalizedMineName(m, lang)} ({m.mineType})
                </option>
              ))}
            </select>
          </div>

          {/* Scenario Selector */}
          <div>
            <label className="block text-[10.5px] font-bold text-[#5F625C] uppercase tracking-wider mb-1">
              {sc?.selectScenario || 'Operational Scenario'}
            </label>
            <select
              value={selectedScenarioId}
              onChange={(e) => setSelectedScenarioId(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] text-[#B76543] text-xs font-bold focus:outline-none focus:border-[#B76543] cursor-pointer"
            >
              {SCENARIO_KEYS.map(key => (
                <option key={key} value={key}>
                  {sc?.scenarioCatalog?.[key]?.name || key}
                </option>
              ))}
            </select>
          </div>

          {/* Severity Selector */}
          <div>
            <label className="block text-[10.5px] font-bold text-[#5F625C] uppercase tracking-wider mb-1">
              {sc?.selectSeverity || 'Crisis Severity'}
            </label>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] text-[#272A27] text-xs font-bold focus:outline-none focus:border-[#B76543] cursor-pointer"
            >
              {SEVERITY_LEVELS.map(sev => (
                <option key={sev.id} value={sev.id}>
                  {sc?.severities?.[sev.id] || sev.id}
                </option>
              ))}
            </select>
          </div>

          {/* Time Horizon Selector */}
          <div>
            <label className="block text-[10.5px] font-bold text-[#5F625C] uppercase tracking-wider mb-1">
              {sc?.selectHorizon || 'Time Horizon'}
            </label>
            <select
              value={selectedHorizon}
              onChange={(e) => setSelectedHorizon(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] text-[#272A27] text-xs font-bold focus:outline-none focus:border-[#B76543] cursor-pointer"
            >
              {TIME_HORIZONS.map(h => (
                <option key={h.id} value={h.id}>
                  {sc?.horizons?.[h.id] || h.id}
                </option>
              ))}
            </select>
          </div>

          {/* Execute Run Action */}
          <div className="flex items-end">
            <button
              onClick={handleRunAnalysis}
              className="w-full py-2.5 px-4 rounded-xl bg-[#B76543] hover:bg-[#9B5133] text-white font-black text-xs uppercase tracking-wider shadow-md flex items-center justify-center gap-2 transition cursor-pointer"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{sc?.runBtn || 'RUN SCENARIO ANALYSIS'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* 3. MULTI-SCENARIO 4-WAY COMPARISON MATRIX (DRAWER) */}
      {isMultiScenarioOpen && (
        <div className="p-5 rounded-3xl bg-[#080d1a] border border-[#1b2a41] shadow-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#1b2a41]">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
              <Layers className="w-4 h-4" />
              <span>{sc?.multiMatrixTitle || '4-WAY CROSS-SCENARIO STRESS MATRIX'} // {getLocalizedMineName(currentMine, lang).toUpperCase()}</span>
            </div>
            <button onClick={() => setIsMultiScenarioOpen(false)} className="text-zinc-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            {multiScenarioData.map((data, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-[#0e1728] border border-[#1e2f4a] space-y-3">
                <div className="border-b border-[#1e2f4a] pb-2">
                  <span className="text-[10px] text-amber-400 font-bold uppercase block">{data.scenarioName}</span>
                  <strong className="text-white text-sm">
                    {data.projectedProduction.toLocaleString()} {comm?.tpd || 'TPD'}
                  </strong>
                  <span className="text-xs text-rose-400 block">(-{data.lossPct}%)</span>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="flex justify-between text-zinc-400">
                    <span>{sc?.revenueExposure || 'Revenue Exposure'}:</span>
                    <strong className="text-white">₹{data.revenueAtRiskCrore} {comm?.cr || 'Cr'}</strong>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>{sc?.riskLevel || 'Risk Level'}:</span>
                    <strong className={data.lossPct > 40 ? 'text-rose-400' : 'text-amber-400'}>
                      {data.kpiComparison[5].scenario}
                    </strong>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>{sc?.primaryAction || 'Primary Action'}:</span>
                    <span className="text-sky-300 text-[10px] truncate max-w-[120px]">{data.recommendations[0].title}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. EXECUTIVE IMPACT KPI PANEL */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">

        {/* Production at Risk */}
        <div className="p-4 rounded-2xl bg-[#080d1a] border border-[#1b2a41] shadow-xl space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">{sc?.kpiProdAtRisk || 'Production at Risk'}</span>
          <div className="text-xl sm:text-2xl font-black text-rose-400">
            -{scenarioResult.lossTonnage.toLocaleString()} <span className="text-xs font-normal text-zinc-400">{comm?.tpd || 'TPD'}</span>
          </div>
          <span className="text-[10px] text-rose-400/80 block">
            -{scenarioResult.lossPct}% {sc?.ofQuota || 'of Daily Quota'}
          </span>
        </div>

        {/* Revenue Exposure */}
        <div className="p-4 rounded-2xl bg-[#080d1a] border border-[#1b2a41] shadow-xl space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">{sc?.kpiRevExposure || 'Revenue Exposure'}</span>
          <div className="text-xl sm:text-2xl font-black text-amber-400">
            ₹{scenarioResult.revenueAtRiskCrore} <span className="text-xs font-normal text-zinc-400">{comm?.cr || 'Cr'}</span>
          </div>
          <span className="text-[10px] text-zinc-400 block">
            ₹{scenarioResult.revenueAtRiskLakh} {comm?.lakh || 'Lakhs'} / {lang === 'hi' ? 'दिन' : lang === 'mr' ? 'दिवस' : 'Day'}
          </span>
        </div>

        {/* Fleet Availability */}
        <div className="p-4 rounded-2xl bg-[#080d1a] border border-[#1b2a41] shadow-xl space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">{sc?.kpiFleetAvail || 'Fleet Availability'}</span>
          <div className="text-xl sm:text-2xl font-black text-white">
            {scenarioResult.kpiComparison[1].scenario}
          </div>
          <span className="text-[10px] text-rose-400 block">
            {scenarioResult.kpiComparison[1].delta} {sc?.fromNominal || 'from Nominal'}
          </span>
        </div>

        {/* Crusher Utilisation */}
        <div className="p-4 rounded-2xl bg-[#080d1a] border border-[#1b2a41] shadow-xl space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">{sc?.kpiCrusherUtil || 'Crusher Utilisation'}</span>
          <div className="text-xl sm:text-2xl font-black text-white">
            {scenarioResult.kpiComparison[2].scenario}
          </div>
          <span className="text-[10px] text-rose-400 block">
            {scenarioResult.kpiComparison[2].delta} {sc?.throughput || 'Throughput'}
          </span>
        </div>

        {/* Safety Risk & Recovery */}
        <div className="p-4 rounded-2xl bg-[#080d1a] border border-[#1b2a41] shadow-xl space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">{sc?.kpiSafetyRisk || 'Safety Risk Index'}</span>
          <div className="text-xl sm:text-2xl font-black text-amber-400">
            {scenarioResult.kpiComparison[5].scenario.split(' ')[0]}
          </div>
          <span className="text-[10px] text-zinc-400 block">
            {comm?.downtime || 'Downtime'}: {scenarioResult.kpiComparison[4].scenario}
          </span>
        </div>

        {/* 95% Confidence Interval */}
        <div className="p-4 rounded-2xl bg-[#080d1a] border border-[#1b2a41] shadow-xl space-y-1">
          <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">{sc?.kpiConfidence || 'Model Confidence'}</span>
          <div className="text-xl sm:text-2xl font-black text-emerald-400">
            {scenarioResult.confidenceInterval.confidencePct}%
          </div>
          <span className="text-[10px] text-zinc-400 block">
            [{scenarioResult.confidenceInterval.lowerBound} - {scenarioResult.confidenceInterval.upperBound} {comm?.tons || 'T'}]
          </span>
        </div>
      </div>

      {/* 5. CAUSE → EFFECT → ACTION ENGINE (HORIZONTAL INTERACTIVE CHAIN) */}
      <div className="p-5 rounded-3xl bg-[#080d1a] border border-[#1b2a41] shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#1b2a41]">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Workflow className="w-4 h-4" />
            <span>{sc?.causalTitle || 'CAUSE → EFFECT → ACTION ENGINE // MULTI-VECTOR CAUSAL PROPAGATION'}</span>
          </div>
          <span className="text-[10px] text-zinc-400">{sc?.causalSubtitle || 'CLICK ANY NODE TO INSPECT ROOT CAUSES'}</span>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2">
          {scenarioResult.causalChain.map((step, idx) => {
            const isSelected = activeCausalNode === idx;
            return (
              <div
                key={idx}
                onClick={() => setActiveCausalNode(isSelected ? null : idx)}
                className={`p-3.5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-[#182942] border-amber-400 shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'bg-[#0c1424] border-[#1e2f4a] hover:border-zinc-500'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[9.5px] font-bold text-amber-400 tracking-wider">
                    {idx + 1}. {step.stage}
                  </span>
                  <span className={`w-2 h-2 rounded-full ${step.status === 'CRITICAL' ? 'bg-rose-500' : step.status === 'OPTIMAL' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
                <strong className="text-white text-xs block truncate mb-1">{step.title}</strong>
                <span className="text-[10px] text-zinc-400 block line-clamp-2">{step.detail}</span>
                <div className="mt-2 pt-2 border-t border-[#1e2f4a] flex justify-between text-[9px]">
                  <span className="text-zinc-500">{sc?.impact || 'Impact'}</span>
                  <strong className="text-amber-300">{step.impactMetric}</strong>
                </div>
              </div>
            );
          })}
        </div>

        {/* Active Node Detail Dossier */}
        {activeCausalNode !== null && (
          <div className="p-4 rounded-2xl bg-[#0e1728] border border-amber-400/40 text-xs space-y-2">
            <div className="flex justify-between items-center text-amber-400 font-bold">
              <span>{sc?.causalDossierTitle || 'DEEP ROOT CAUSE DIAGNOSIS'}: {scenarioResult.causalChain[activeCausalNode].stage}</span>
              <button onClick={() => setActiveCausalNode(null)} className="text-zinc-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>
            <p className="text-zinc-300">
              {scenarioResult.causalChain[activeCausalNode].detail}
            </p>
            <div className="text-[10px] text-zinc-400 flex gap-4">
              <span>{sc?.sensorVerified || 'Sensor Verification'}: <strong className="text-white">3σ Anomaly Validated</strong></span>
              <span>{sc?.propagationVel || 'Propagation Velocity'}: <strong className="text-amber-300">12.4 min</strong></span>
            </div>
          </div>
        )}
      </div>

      {/* 6. BEFORE vs AFTER COMPARISON & PRODUCTION LOSS WATERFALL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Before vs After KPI Table */}
        <div className="p-5 rounded-3xl bg-[#080d1a] border border-[#1b2a41] shadow-2xl space-y-4">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider pb-2 border-b border-[#1b2a41]">
            <BarChart3 className="w-4 h-4" />
            <span>{sc?.tableTitle || 'OPERATIONAL METRICS: BEFORE vs AFTER SCENARIO'}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="text-[10px] text-zinc-400 uppercase border-b border-[#1e2f4a]">
                  <th className="pb-2">{sc?.tableKpi || 'Operational KPI'}</th>
                  <th className="pb-2 text-center">{sc?.tableNormal || 'Baseline Normal'}</th>
                  <th className="pb-2 text-center">{sc?.tableScenario || 'Scenario State'}</th>
                  <th className="pb-2 text-right">{sc?.tableDelta || 'Delta Change'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#152238]">
                {scenarioResult.kpiComparison.map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#0f192b]">
                    <td className="py-2.5 text-zinc-200 font-bold">{row.kpi}</td>
                    <td className="py-2.5 text-center text-zinc-400">{row.normal}</td>
                    <td className="py-2.5 text-center text-white font-bold">{row.scenario}</td>
                    <td className={`py-2.5 text-right font-bold ${row.isNegative ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {row.delta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Production Loss Waterfall Chart */}
        <div className="p-5 rounded-3xl bg-[#080d1a] border border-[#1b2a41] shadow-2xl space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-[#1b2a41]">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <TrendingDown className="w-4 h-4" />
              <span>{sc?.waterfallTitle || 'PRODUCTION SHORTFALL LOSS WATERFALL'}</span>
            </div>
            <span className="text-[10px] text-zinc-400">{sc?.waterfallSubtitle || 'CLICK LOSS TO INSPECT'}</span>
          </div>

          <div className="space-y-2.5 pt-2">
            {[
              { label: sc?.waterfallItems?.target || 'Target Baseline', value: scenarioResult.waterfall.target, color: 'bg-emerald-500', isAdd: true },
              { label: sc?.waterfallItems?.weather || 'Weather Inundation Loss', value: -scenarioResult.waterfall.weatherLossT, color: 'bg-sky-500', isLoss: true },
              { label: sc?.waterfallItems?.haulage || 'Haulage Traction Loss', value: -scenarioResult.waterfall.haulageLossT, color: 'bg-amber-500', isLoss: true },
              { label: sc?.waterfallItems?.crusher || 'Crusher Starvation Loss', value: -scenarioResult.waterfall.crusherLossT, color: 'bg-rose-500', isLoss: true },
              { label: sc?.waterfallItems?.mechanical || 'Unscheduled Mechanical Loss', value: -scenarioResult.waterfall.equipmentLossT, color: 'bg-purple-500', isLoss: true },
              { label: sc?.waterfallItems?.forecast || 'Forecast Production Yield', value: scenarioResult.waterfall.projectedProduction, color: 'bg-amber-400', isFinal: true }
            ].map((item, idx) => {
              const maxVal = scenarioResult.waterfall.target;
              const widthPct = Math.min(100, Math.max(8, Math.round((Math.abs(item.value) / maxVal) * 100)));

              return (
                <div
                  key={idx}
                  onClick={() => setSelectedWaterfallItem(item)}
                  className="space-y-1 cursor-pointer hover:opacity-90 transition"
                >
                  <div className="flex justify-between text-xs font-bold">
                    <span className={item.isFinal ? 'text-amber-400 font-black' : item.isAdd ? 'text-emerald-400' : 'text-zinc-300'}>
                      {item.label}
                    </span>
                    <span className={item.isLoss ? 'text-rose-400' : 'text-white'}>
                      {item.value > 0 ? `+${item.value.toLocaleString()}` : item.value.toLocaleString()} {comm?.tons || 'T'}
                    </span>
                  </div>
                  <div className="w-full h-3 rounded-full bg-[#0e1728] overflow-hidden">
                    <div
                      className={`h-full ${item.color} rounded-full transition-all duration-500`}
                      style={{ width: `${widthPct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 7. FINANCIAL IMPACT MODEL & RECOVERY ECONOMICS */}
      <div className="p-5 rounded-3xl bg-[#080d1a] border border-[#1b2a41] shadow-2xl space-y-4">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider pb-2 border-b border-[#1b2a41]">
          <DollarSign className="w-4 h-4" />
          <span>{sc?.financialTitle || 'FINANCIAL EXPOSURE & AETHER RECOVERY ECONOMICS'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Exposure Breakdown */}
          <div className="p-4 rounded-2xl bg-[#0e1728] border border-[#1e2f4a] space-y-2 text-xs">
            <span className="text-[10px] text-zinc-400 uppercase font-bold block">{sc?.exposureTitle || 'Financial Exposure'}</span>
            <div className="flex justify-between border-b border-[#1e2f4a] pb-1">
              <span className="text-zinc-400">{sc?.dailyLoss || 'Daily Revenue at Risk'}:</span>
              <strong className="text-rose-400">₹{scenarioResult.financialModel.dailyLossLakh} {comm?.lakh || 'L'}/{lang === 'hi' ? 'दिन' : lang === 'mr' ? 'दिवस' : 'Day'}</strong>
            </div>
            <div className="flex justify-between border-b border-[#1e2f4a] pb-1">
              <span className="text-zinc-400">{sc?.monthlyLoss || 'Monthly Projected Loss'}:</span>
              <strong className="text-rose-400">₹{scenarioResult.financialModel.monthlyLossCrore} {comm?.cr || 'Cr'}</strong>
            </div>
            <div className="flex justify-between border-b border-[#1e2f4a] pb-1">
              <span className="text-zinc-400">{sc?.additionalOpex || 'Additional Opex (Pumps/Fuel)'}:</span>
              <strong className="text-amber-400">₹{scenarioResult.financialModel.additionalOpexLakh} {comm?.lakh || 'L'}</strong>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-400">{sc?.recoveryCapex || 'Recovery Capex / Maintenance'}:</span>
              <strong className="text-white">₹{scenarioResult.financialModel.maintenanceCapexLakh} {comm?.lakh || 'L'}</strong>
            </div>
          </div>

          {/* Without vs With AETHER Intervention */}
          <div className="p-4 rounded-2xl bg-[#0e1728] border border-[#1e2f4a] space-y-3 text-xs md:col-span-2 flex flex-col justify-between">
            <div>
              <span className="text-[10px] text-zinc-400 uppercase font-bold block mb-2">{sc?.roiTitle || 'AETHER Intervention ROI'}</span>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2.5 rounded-xl bg-[#142033] border border-rose-500/30">
                  <span className="text-[9.5px] text-zinc-400 block">{sc?.withoutIntervention || 'Without Intervention'}</span>
                  <strong className="text-rose-400 text-sm">-₹{scenarioResult.financialModel.withoutInterventionLossCrore} {comm?.cr || 'Cr'}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-[#142033] border border-amber-500/30">
                  <span className="text-[9.5px] text-zinc-400 block">{sc?.withIntervention || 'With AETHER Dispatch'}</span>
                  <strong className="text-amber-400 text-sm">-₹{scenarioResult.financialModel.withInterventionLossCrore} {comm?.cr || 'Cr'}</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/40">
                  <span className="text-[9.5px] text-emerald-400 block">{sc?.valueProtected || 'Net Value Protected'}</span>
                  <strong className="text-emerald-400 text-sm font-black">+₹{scenarioResult.financialModel.valueProtectedCrore} {comm?.cr || 'Cr'}</strong>
                </div>
              </div>
            </div>

            <div className="text-[10.5px] text-zinc-400 bg-[#121c2c] p-2.5 rounded-xl border border-[#1e2f4a]">
              💡 <strong>{sc?.decisionInsight || 'Decision Support Insight'}:</strong> {lang === 'hi'
                ? `प्रोटोकॉल ${scenarioResult.recommendations[0].actionId} लागू करने से +${scenarioResult.recommendations[0].expectedRecoveryTPD} टीपीडी बहाल होता है, जिससे शमन लागत पर 12.4 गुना आरओआई प्राप्त होता है।`
                : lang === 'mr'
                ? `प्रोटोकॉल ${scenarioResult.recommendations[0].actionId} लागू केल्याने +${scenarioResult.recommendations[0].expectedRecoveryTPD} टीपीडी पूर्ववत होते, ज्यामुळे खर्चावर 12.4 पट आरओआय मिळतो.`
                : `Implementing AETHER Protocol ${scenarioResult.recommendations[0].actionId} restores +${scenarioResult.recommendations[0].expectedRecoveryTPD} TPD, yielding a 12.4x ROI on operational mitigation cost.`}
            </div>
          </div>
        </div>
      </div>

      {/* 8. AI RESPONSE ENGINE & WHAT-IF DECISION MATRIX */}
      <div className="p-5 rounded-3xl bg-[#080d1a] border border-[#1b2a41] shadow-2xl space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-[#1b2a41]">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>{sc?.aiRecommendationsTitle || 'AETHER AI RECOMMENDED INTERVENTIONS // OPTIMIZATION MATRIX'}</span>
          </div>
          <span className="text-[10px] text-zinc-400">{sc?.aiRecommendationsSubtitle || 'RANKED BY ESTIMATED YIELD RECOVERY'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {scenarioResult.recommendations.map((rec, idx) => {
            const isApplied = activeInterventions.includes(rec.actionId);
            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all ${
                  isApplied
                    ? 'bg-emerald-950/30 border-emerald-500 shadow-lg shadow-emerald-500/10'
                    : 'bg-[#0e1728] border-[#1e2f4a]'
                } space-y-2 text-xs`}
              >
                <div className="flex justify-between items-center">
                  <span className="px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-[10px] font-bold">
                    {sc?.rank || 'RANK'} {rec.rank}
                  </span>
                  <span className="text-[10px] text-zinc-400">{rec.actionId}</span>
                </div>

                <strong className="text-white text-sm block">{rec.title}</strong>
                <p className="text-[10.5px] text-zinc-400">{rec.description}</p>

                <div className="grid grid-cols-2 gap-1.5 pt-2 border-t border-[#1e2f4a] text-[10px]">
                  <div>
                    <span className="text-zinc-500 block">{sc?.expectedRecovery || 'Expected Recovery'}</span>
                    <strong className="text-emerald-400">+{rec.expectedRecoveryTPD} {comm?.tpd || 'TPD'}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">{sc?.execTime || 'Execution Time'}</span>
                    <strong className="text-white">{rec.implementationTime}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">{sc?.mitigationCost || 'Mitigation Cost'}</span>
                    <strong className="text-amber-400">₹{rec.costLakh} {comm?.lakh || 'L'}</strong>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">{sc?.confidence || 'Confidence'}</span>
                    <strong className="text-sky-400">{rec.confidence}%</strong>
                  </div>
                </div>

                <button
                  onClick={() => toggleIntervention(rec.actionId)}
                  className={`w-full py-2 rounded-xl font-bold text-[10.5px] transition ${
                    isApplied
                      ? 'bg-emerald-500 text-obsidian-950 hover:bg-emerald-400'
                      : 'bg-[#182942] text-zinc-300 hover:bg-[#223755] hover:text-white'
                  }`}
                >
                  {isApplied ? (sc?.authorizedBtn || '✓ INTERVENTION AUTHORIZED') : (sc?.authorizeBtn || 'AUTHORIZE INTERVENTION')}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 9. STATIC 2D OPERATIONAL MAP & SATELLITE REALITY CONTEXT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Static 2D Digital Map */}
        <StaticEngineeringMap
          mine={currentMine}
          scenarioResult={scenarioResult}
        />

        {/* Satellite Earth Observation Reality Layer */}
        <div className="p-5 rounded-3xl bg-[#080d1a] border border-[#1e2f4a] shadow-2xl space-y-3 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-[#1e2f4a]">
            <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-xs">
              <Globe2 className="w-4 h-4" />
              <span>{sc?.satelliteTitle || 'SATELLITE REALITY & EARTH OBSERVATION EVIDENCE'}</span>
            </div>
            <span className="text-[9.5px] px-2 py-0.5 rounded bg-[#121c2c] text-sky-400 border border-[#1e2f4a]">
              {sc?.satelliteSensor || 'SENTINEL-2 / LANDSAT-9'}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10.5px]">
            <div className="p-2 rounded-xl bg-[#0e1728] border border-[#1e2f4a]">
              <span className="text-zinc-400 block text-[9.5px]">{sc?.ndviVigour || 'Spectral NDVI (Vigour)'}</span>
              <strong className="text-emerald-400">{scenarioResult.satelliteEvidence.ndviValue}</strong>
            </div>
            <div className="p-2 rounded-xl bg-[#0e1728] border border-[#1e2f4a]">
              <span className="text-zinc-400 block text-[9.5px]">{sc?.ndwiWater || 'Moisture NDWI (Water)'}</span>
              <strong className="text-sky-400">{scenarioResult.satelliteEvidence.ndwiValue}</strong>
            </div>
            <div className="p-2 rounded-xl bg-[#0e1728] border border-[#1e2f4a]">
              <span className="text-zinc-400 block text-[9.5px]">{sc?.soilSaturation || 'Soil Saturation'}</span>
              <strong className="text-amber-400">{scenarioResult.satelliteEvidence.soilMoisturePct}%</strong>
            </div>
            <div className="p-2 rounded-xl bg-[#0e1728] border border-[#1e2f4a]">
              <span className="text-zinc-400 block text-[9.5px]">{sc?.pitDisturbedArea || 'Pit Disturbed Area'}</span>
              <strong className="text-white">{scenarioResult.satelliteEvidence.disturbedAreaHa} Ha</strong>
            </div>
          </div>

          <p className="text-[11px] text-zinc-300 bg-[#0e1728] p-3 rounded-xl border border-[#1e2f4a]">
            {scenarioResult.satelliteEvidence.observationSummary}
          </p>
        </div>
      </div>

      {/* 10. DETERMINISTIC OPERATIONAL TIMELINE & SHAP DRIVERS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Operational Timeline */}
        <div className="p-5 rounded-3xl bg-[#080d1a] border border-[#1b2a41] shadow-2xl space-y-3 lg:col-span-2 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider pb-2 border-b border-[#1b2a41]">
            <Clock className="w-4 h-4" />
            <span>{sc?.timelineTitle || 'OPERATIONAL SCENARIO EVENT TIMELINE // T+0 TO RESTORATION'}</span>
          </div>

          <div className="space-y-2 pt-1">
            {scenarioResult.timelineMilestones.map((m, idx) => (
              <div key={idx} className="flex items-start gap-3 p-2 rounded-xl bg-[#0e1728] border border-[#1e2f4a]">
                <span className="px-2 py-1 rounded bg-[#182942] text-amber-400 font-bold text-[10px] whitespace-nowrap">
                  {m.time}
                </span>
                <div className="space-y-0.5 flex-1">
                  <strong className="text-white text-xs block">{m.event}</strong>
                  <span className="text-zinc-400 text-[10.5px] block">{m.detail}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TreeSHAP Feature Drivers */}
        <div className="p-5 rounded-3xl bg-[#080d1a] border border-[#1b2a41] shadow-2xl space-y-4 text-xs">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider pb-2 border-b border-[#1b2a41]">
            <Cpu className="w-4 h-4" />
            <span>{sc?.shapTitle || 'EXPLAINABLE AI: WHY DID THIS HAPPEN?'}</span>
          </div>

          <div className="space-y-3">
            {scenarioResult.shapDrivers.map((driver, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-zinc-300">{driver.name}</span>
                  <span className="text-amber-400">{driver.contributionPct}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-[#0e1728]">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{ width: `${driver.contributionPct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-xl bg-[#0e1728] border border-[#1e2f4a] text-[10.5px] text-zinc-400">
            {sc?.shapInsight || 'GBM TreeSHAP attribution demonstrates that haulage traction degradation is the primary bottleneck vector under this stress state.'}
          </div>
        </div>
      </div>

      {/* 11. SCENARIO RUN HISTORY */}
      <div className="p-5 rounded-3xl bg-[#080d1a] border border-[#1b2a41] shadow-2xl space-y-3 text-xs">
        <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider pb-2 border-b border-[#1b2a41]">
          <History className="w-4 h-4" />
          <span>{sc?.recentHistory || 'RECENT SCENARIO ANALYSES AUDIT TRAIL'}</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {scenarioHistory.map(entry => (
            <div key={entry.id} className="p-3 rounded-xl bg-[#0e1728] border border-[#1e2f4a] flex justify-between items-center">
              <div>
                <span className="text-[9.5px] text-zinc-500 block">{entry.date}</span>
                <strong className="text-white text-xs block">{entry.mineName}</strong>
                <span className="text-amber-400 text-[10.5px]">{entry.scenarioName}</span>
              </div>
              <div className="text-right">
                <span className="text-rose-400 font-bold block">-{entry.lossT} {comm?.tons || 'T'}</span>
                <span className="text-zinc-400 text-[10px]">₹{entry.revenueL} {comm?.lakh || 'L'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
