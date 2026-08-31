import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceDot,
  ReferenceLine
} from 'recharts';
import { useApp } from '../context/AppContext.jsx';
import { AlertForecastEngine, SCENARIO_PRESETS, MINE_PHYSICAL_PROFILES } from '../services/alertForecastEngine.js';
import {
  Zap,
  CloudRain,
  Calendar,
  Layers,
  SlidersHorizontal,
  RotateCcw,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Truck,
  Droplet,
  ArrowDownRight,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  Sparkles,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Clock,
  X,
  Info,
  Terminal,
  ChevronDown,
  ChevronUp,
  Fingerprint,
  GitCompare,
  HelpCircle
} from 'lucide-react';

export const ForecastPreview = ({ externalScenarioId, onScenarioSelect }) => {
  const { activeMine, normalizedScenarioId, setScenario, t, lang } = useApp();

  // Active Scenario State initialized to global scenario or prop
  const [selectedScenario, setSelectedScenario] = useState(externalScenarioId || normalizedScenarioId || 'BASELINE');
  const [showDiagnosticHud, setShowDiagnosticHud] = useState(false);
  const [showDriverAnalysis, setShowDriverAnalysis] = useState(true);

  // When active scenario changes in global context or prop, sync local state and presets
  useEffect(() => {
    const targetScen = externalScenarioId || normalizedScenarioId || 'BASELINE';
    if (targetScen !== selectedScenario) {
      setSelectedScenario(targetScen);
      const preset = SCENARIO_PRESETS.find(s => s.id === targetScen) || SCENARIO_PRESETS[0];
      setRainfallMm(preset.defaultRainfall);
      setCrusherAvail(preset.defaultCrusher);
      setFleetAvail(preset.defaultFleet);
      setHaulEff(preset.defaultHaulEff);
      setSumpInflow(preset.defaultSumpInflow);
      setPumpCap(preset.defaultPumpCap);
      setEqHealth(preset.defaultEqHealth);
    }
  }, [externalScenarioId, normalizedScenarioId]);

  const activePreset = useMemo(() => {
    return SCENARIO_PRESETS.find(s => s.id === selectedScenario) || SCENARIO_PRESETS[0];
  }, [selectedScenario]);

  // Interactive Slider States initialized to current scenario preset
  const [rainfallMm, setRainfallMm] = useState(activePreset.defaultRainfall);
  const [crusherAvail, setCrusherAvail] = useState(activePreset.defaultCrusher);
  const [fleetAvail, setFleetAvail] = useState(activePreset.defaultFleet);
  const [haulEff, setHaulEff] = useState(activePreset.defaultHaulEff);
  const [sumpInflow, setSumpInflow] = useState(activePreset.defaultSumpInflow);
  const [pumpCap, setPumpCap] = useState(activePreset.defaultPumpCap);
  const [eqHealth, setEqHealth] = useState(activePreset.defaultEqHealth);

  // Track Previous Mine for Cross-Mine Comparison Delta
  const prevMineIdRef = useRef(activeMine?.id || 'balaghat');
  const [mineTransitionDelta, setMineTransitionDelta] = useState(null);

  // Re-seed slider states whenever the active mine switches so there is NO stale closure
  useEffect(() => {
    const currMineId = activeMine?.id || 'balaghat';
    const phys = AlertForecastEngine.getMineProfile(currMineId);
    const preset = SCENARIO_PRESETS.find(s => s.id === selectedScenario) || SCENARIO_PRESETS[0];

    // Compute Transition Comparison if mine changed
    if (prevMineIdRef.current && prevMineIdRef.current !== currMineId) {
      const prevProfile = AlertForecastEngine.getMineProfile(prevMineIdRef.current);
      const prevSim = AlertForecastEngine.generateAlertForecast({
        mineId: prevMineIdRef.current,
        scenarioId: selectedScenario,
        includeComparisons: false
      });
      const currSim = AlertForecastEngine.generateAlertForecast({
        mineId: currMineId,
        scenarioId: selectedScenario,
        includeComparisons: false
      });

      setMineTransitionDelta({
        fromMine: prevProfile.name,
        toMine: phys.name,
        fromTarget: prevProfile.targetTpd,
        toTarget: phys.targetTpd,
        targetDelta: phys.targetTpd - prevProfile.targetTpd,
        yieldDelta: Math.round(currSim.kpis.avg_predicted_yield - prevSim.kpis.avg_predicted_yield),
        shortfallDelta: Math.round(currSim.kpis.total_shortfall_tonnes - prevSim.kpis.total_shortfall_tonnes),
        fromRisk: prevSim.kpis.risk_classification,
        toRisk: currSim.kpis.risk_classification,
        peakDay: currSim.kpis.worst_day,
        recoveryDay: currSim.kpis.recovery_day
      });
    }

    prevMineIdRef.current = currMineId;

    setRainfallMm(preset.defaultRainfall);
    setCrusherAvail(selectedScenario === 'BASELINE' ? phys.crusherHealthBase : preset.defaultCrusher);
    setFleetAvail(selectedScenario === 'BASELINE' ? Math.round(phys.fleetAvailBase) : preset.defaultFleet);
    setHaulEff(preset.defaultHaulEff);
    setSumpInflow(selectedScenario === 'BASELINE' ? Math.round(phys.maxDrainageM3h * 2.8) : preset.defaultSumpInflow);
    setPumpCap(preset.defaultPumpCap);
    setEqHealth(preset.defaultEqHealth);
  }, [activeMine?.id]);

  // Sync sliders when scenario changes and propagate globally
  const applyScenario = useCallback((scenId) => {
    setSelectedScenario(scenId);
    if (setScenario) {
      setScenario(scenId);
    }
    if (onScenarioSelect) {
      onScenarioSelect(scenId);
    }
    const preset = SCENARIO_PRESETS.find(s => s.id === scenId) || SCENARIO_PRESETS[0];
    setRainfallMm(preset.defaultRainfall);
    setCrusherAvail(preset.defaultCrusher);
    setFleetAvail(preset.defaultFleet);
    setHaulEff(preset.defaultHaulEff);
    setSumpInflow(preset.defaultSumpInflow);
    setPumpCap(preset.defaultPumpCap);
    setEqHealth(preset.defaultEqHealth);
  }, [setScenario, onScenarioSelect]);

  // View Mode Toggles
  const [showRainfall, setShowRainfall] = useState(true);
  const [showAllScenarios, setShowAllScenarios] = useState(false);
  const [showWhatIfControls, setShowWhatIfControls] = useState(true);
  const [selectedDriverDetail, setSelectedDriverDetail] = useState(null);

  // Authoritative Forecast Generation from Active Mine + Scenario + Sliders
  const forecastModel = useMemo(() => {
    return AlertForecastEngine.generateAlertForecast({
      mineId: activeMine?.id || 'balaghat',
      scenarioId: selectedScenario,
      parameters: {
        rainfall: rainfallMm,
        crusherAvailability: crusherAvail,
        fleetAvailability: fleetAvail,
        haulageEfficiency: haulEff,
        sumpInflow: sumpInflow,
        pumpCapacity: pumpCap,
        equipmentHealth: eqHealth
      },
      includeComparisons: true
    });
  }, [
    activeMine?.id,
    activeMine?.productionTarget,
    activeMine?.rainfallSensitivity,
    activeMine?.crusherHealthBase,
    activeMine?.haulDistanceKm,
    activeMine?.stockpileBufferT,
    selectedScenario,
    rainfallMm,
    crusherAvail,
    fleetAvail,
    haulEff,
    sumpInflow,
    pumpCap,
    eqHealth
  ]);

  // Comprehensive dual destructuring with guaranteed fallbacks
  const mine_id = forecastModel?.mine_id || forecastModel?.mineId || 'balaghat';
  const mine_name = forecastModel?.mine_name || forecastModel?.mineName || 'Balaghat Mine';
  const mine_type = forecastModel?.mine_type || forecastModel?.mineType || 'Underground Deep Shaft';
  const daily_target = forecastModel?.daily_target || forecastModel?.dailyTarget || 6200;
  const historical_actual_d1 = forecastModel?.historical_actual_d1 || forecastModel?.historicalActualD1 || 6140;
  const forecast_points = forecastModel?.forecast_points || forecastModel?.forecastPoints || [];
  const waterfall_drivers = forecastModel?.waterfall_drivers || forecastModel?.waterfallDrivers || [];
  const waterfallDrivers = waterfall_drivers; // Alias for 100% scope safety
  const net_impact_tpd = forecastModel?.net_impact_tpd !== undefined ? forecastModel.net_impact_tpd : (forecastModel?.netImpactTpd !== undefined ? forecastModel.netImpactTpd : 0);
  const netImpactTpd = net_impact_tpd; // Alias for 100% scope safety
  const kpis = forecastModel?.kpis || {};
  const ai_explanation = forecastModel?.ai_explanation || forecastModel?.aiExplanation || '';
  const scenarios_comparison = forecastModel?.scenarios_comparison || forecastModel?.scenariosComparison || [];
  const physical_profile = forecastModel?.physical_profile || forecastModel?.physicalProfile || AlertForecastEngine.getMineProfile(mine_id);
  const models_status = forecastModel?.models_status || forecastModel?.modelsStatus || {};

  const targetTpd = Number(daily_target || 6200);
  const yMin = Math.round(targetTpd * 0.10);
  const yMax = Math.round(targetTpd * 1.30);

  // Merge datasets for multi-scenario comparison overlay
  const chartData = useMemo(() => {
    if (!showAllScenarios) return forecast_points;
    return forecast_points.map((pt, idx) => {
      const merged = { ...pt };
      scenarios_comparison.forEach(s => {
        merged[s.scenario_id] = s.points[idx];
      });
      return merged;
    });
  }, [forecast_points, scenarios_comparison, showAllScenarios]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const p = payload[0]?.payload;
      if (!p) return null;
      return (
        <div className="p-4 rounded-xl bg-[#F0EBE2]/95 border border-[#C8BFAF] shadow-2xl font-mono text-xs text-[#272A27] select-none min-w-[280px] space-y-2.5">
          <div className="font-bold text-[#272A27] pb-1.5 border-b border-[#C8BFAF] flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-manganese-400 font-bold">{p.day_label}</span>
              <span className="text-[#5F625C] font-normal">({p.date})</span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#DDD4C5] text-manganese-300 font-bold">{mine_name}</span>
          </div>

          <div className="space-y-1.5 font-mono">
            {p.actual_tpd && (
              <div className="flex justify-between gap-4 text-emerald-400 font-bold">
                <span>{lang === 'hi' ? 'वास्तविक उत्पादन (D1):' : lang === 'mr' ? 'प्रत्यक्ष उत्पादन (D1):' : 'Logged Actual (D1):'}</span>
                <span>{p.actual_tpd.toLocaleString()} TPD</span>
              </div>
            )}
            <div className="flex justify-between gap-4 text-manganese-400 font-bold text-sm">
              <span>{lang === 'hi' ? 'पूर्वानुमानित उत्पादन:' : lang === 'mr' ? 'अंदाजित उत्पादन:' : 'Predicted Yield:'}</span>
              <span>{p.predicted_yield_tpd.toLocaleString()} TPD</span>
            </div>
            <div className="flex justify-between gap-4 text-[#5F625C]">
              <span>{lang === 'hi' ? 'दैनिक कोटा लक्ष्य:' : lang === 'mr' ? 'दैनिक कोटा उद्दिष्ट:' : 'Target Quota:'}</span>
              <span>{p.target_tpd.toLocaleString()} TPD</span>
            </div>
            <div className="flex justify-between gap-4 text-cyan-300 text-[11px]">
              <span>{lang === 'hi' ? '95% आत्मविश्वास सीमा:' : lang === 'mr' ? '95% विश्वास मर्यादा:' : '95% CI Range:'}</span>
              <span>{p.lower_ci_tpd.toLocaleString()} - {p.upper_ci_tpd.toLocaleString()} T</span>
            </div>
            {p.shortfall_tpd > 0 && (
              <div className="flex justify-between gap-4 text-hazard-400 font-bold pt-1.5 border-t border-[#C8BFAF]">
                <span>{lang === 'hi' ? 'अनुमानित दैनिक कमी:' : lang === 'mr' ? 'अंदाजित दैनंदिन तूट:' : 'Projected Deficit:'}</span>
                <span>-{p.shortfall_tpd.toLocaleString()} TPD ({p.shortfall_pct}%)</span>
              </div>
            )}
            {p.rainfall_mm > 0 && (
              <div className="flex justify-between gap-4 text-sky-400 text-[11px]">
                <span>{lang === 'hi' ? 'वर्षा दर:' : lang === 'mr' ? 'पाऊस दर:' : 'Precipitation:'}</span>
                <span>{p.rainfall_mm} mm/day</span>
              </div>
            )}
            <div className="pt-1.5 text-[10px] text-[#5F625C] flex flex-col gap-0.5 border-t border-obsidian-855">
              <div className="text-[#85877E] uppercase">{lang === 'hi' ? 'घटना स्थिति / चालक:' : lang === 'mr' ? 'घटना स्थिती / घटक:' : 'Event Marker / Main Driver:'}</div>
              <strong className="text-amber-300">{p.event_marker}</strong>
              <span className="text-[#272A27]">{p.main_driver}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="space-y-8 font-mono select-none">

      {/* 1. Header & Live Indicator */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#C8BFAF] pb-6">
        <div>
          <div className="badge-manganese mb-2">
            <Zap className="w-3.5 h-3.5 text-manganese-400 animate-pulse" />
            <span>{lang === 'hi' ? 'केंद्रीय एआई 14-दिवसीय उत्पादन पूर्वानुमान पाइपलाइन' : lang === 'mr' ? 'केंद्रीय एआय 14-दिवसांचे उत्पादन अंदाज यंत्रणा' : 'CENTRAL AI 14-DAY PRODUCTION FORECAST PIPELINE'}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#272A27]">
            {lang === 'hi' ? `${mine_name} — 14-दिवसीय गतिशील उत्पादन पूर्वानुमान` : lang === 'mr' ? `${mine_name} — 14-दिवसांचा गतिशील उत्पादन अंदाज` : `${mine_name} — 14-Day Production Yield Forecast`}
          </h2>
          <p className="text-xs sm:text-sm text-[#5F625C] mt-1 max-w-3xl font-mono">
            {lang === 'hi' ? `${mine_name} (${mine_type}) के लिए बहु-भौतिकी सिम्युलेशन (${targetTpd.toLocaleString()} TPD कोटा लक्ष्य)। चयनित परिदृश्य एवं मापदंडों के आधार पर दिन-प्रतिदिन 14 विशिष्ट मान उत्पन्न होते हैं।` :
             lang === 'mr' ? `${mine_name} (${mine_type}) साठी बहु-भौतिकशास्त्र सिम्युलेशन (${targetTpd.toLocaleString()} TPD कोटा उद्दिष्ट). निवडलेले परिदृश्य व मापदंडांनुसार दिवसेंदिवस 14 स्वतंत्र मूल्ये तयार होतात.` :
             `Multi-physics time-series simulation for ${mine_name} (${mine_type}, ${targetTpd.toLocaleString()} TPD Target Quota). Evolving daily trajectories computed from active mine baseline and operational stresses.`}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
          <button
            onClick={() => setShowDriverAnalysis(!showDriverAnalysis)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              showDriverAnalysis
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm'
                : 'bg-[#F5F1E9] text-[#5F625C] border-[#C8BFAF]'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'hi' ? 'पूर्वानुमान चालक विश्लेषण' : lang === 'mr' ? 'अंदाज घटक विश्लेषण' : 'Forecast Driver Analysis'}</span>
          </button>

          <button
            onClick={() => setShowDiagnosticHud(!showDiagnosticHud)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              showDiagnosticHud
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm'
                : 'bg-[#F5F1E9] text-[#5F625C] border-[#C8BFAF]'
            }`}
          >
            <Fingerprint className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'खदान फिंगरप्रिंट एचयूडी' : lang === 'mr' ? 'खाण फिंगरप्रिंट एचयूडी' : 'Mine Fingerprint HUD'}</span>
          </button>

          <button
            onClick={() => setShowWhatIfControls(!showWhatIfControls)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              showWhatIfControls
                ? 'bg-manganese-500/20 text-manganese-300 border-manganese-500/40 shadow-sm'
                : 'bg-[#F5F1E9] text-[#5F625C] border-[#C8BFAF]'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'व्हाट-इफ स्लाइडर्स' : lang === 'mr' ? 'व्हाट-इफ स्लाइडर्स' : 'What-If Sliders'}</span>
          </button>

          <button
            onClick={() => setShowAllScenarios(!showAllScenarios)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              showAllScenarios
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm'
                : 'bg-[#F5F1E9] text-[#5F625C] border-[#C8BFAF]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'परिदृश्य तुलना' : lang === 'mr' ? 'परिदृश्य तुलना' : 'Scenario Overlay'}</span>
          </button>

          <button
            onClick={() => setShowRainfall(!showRainfall)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all border ${
              showRainfall
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40 shadow-sm'
                : 'bg-[#F5F1E9] text-[#5F625C] border-[#C8BFAF]'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            <span>{lang === 'hi' ? 'वर्षा स्तर' : lang === 'mr' ? 'पाऊस स्तर' : 'Rainfall Layer'}</span>
          </button>
        </div>
      </div>

      {/* Cross-Mine Transition Delta Banner (When Mine Switches) */}
      {mineTransitionDelta && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-[#0c1f24] via-obsidian-900 to-[#0c1f24] border border-cyan-500/40 shadow-lg font-mono text-xs text-[#272A27]">
          <div className="flex items-center justify-between gap-4 pb-2 border-b border-[#C8BFAF]">
            <div className="flex items-center gap-2.5">
              <GitCompare className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="font-bold text-cyan-300 tracking-wider uppercase text-[11px]">
                {lang === 'hi' ? 'खदान संक्रमण तुलना // प्रत्यक्ष परिचालन प्रभाव' : lang === 'mr' ? 'खाण संक्रमण तुलना // प्रत्यक्ष परिचालन प्रभाव' : 'MINE TRANSITION DELTA // OPERATIONAL SHIFT COMPARISON'}
              </span>
            </div>
            <div className="text-[11px] text-[#5F625C] font-bold">
              {mineTransitionDelta.fromMine} ({mineTransitionDelta.fromTarget.toLocaleString()} TPD) → <span className="text-[#272A27]">{mineTransitionDelta.toMine} ({mineTransitionDelta.toTarget.toLocaleString()} TPD)</span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-3">
            <div className="p-2 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
              <div className="text-[10px] text-[#5F625C]">Target Delta</div>
              <div className={`text-sm font-bold mt-0.5 ${mineTransitionDelta.targetDelta >= 0 ? 'text-emerald-400' : 'text-hazard-400'}`}>
                {mineTransitionDelta.targetDelta >= 0 ? `+${mineTransitionDelta.targetDelta.toLocaleString()}` : mineTransitionDelta.targetDelta.toLocaleString()} TPD
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
              <div className="text-[10px] text-[#5F625C]">14-Day Mean Yield</div>
              <div className={`text-sm font-bold mt-0.5 ${mineTransitionDelta.yieldDelta >= 0 ? 'text-emerald-400' : 'text-hazard-400'}`}>
                {mineTransitionDelta.yieldDelta >= 0 ? `+${mineTransitionDelta.yieldDelta.toLocaleString()}` : mineTransitionDelta.yieldDelta.toLocaleString()} TPD
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
              <div className="text-[10px] text-[#5F625C]">Shortfall Volume Delta</div>
              <div className={`text-sm font-bold mt-0.5 ${mineTransitionDelta.shortfallDelta <= 0 ? 'text-emerald-400' : 'text-hazard-400'}`}>
                {mineTransitionDelta.shortfallDelta >= 0 ? `+${mineTransitionDelta.shortfallDelta.toLocaleString()}` : mineTransitionDelta.shortfallDelta.toLocaleString()} T
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
              <div className="text-[10px] text-[#5F625C]">Risk Profile Shift</div>
              <div className="text-sm font-bold text-amber-300 mt-0.5">
                {mineTransitionDelta.fromRisk} → {mineTransitionDelta.toRisk}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
              <div className="text-[10px] text-[#5F625C]">Peak Shock Day</div>
              <div className="text-sm font-bold text-hazard-400 mt-0.5">
                {mineTransitionDelta.peakDay}
              </div>
            </div>
            <div className="p-2 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
              <div className="text-[10px] text-[#5F625C]">Stabilization Day</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">
                {mineTransitionDelta.recoveryDay}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* "Why Did the Forecast Change?" Compact Driver Analysis Panel */}
      {showDriverAnalysis && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 border border-cyan-500/40 shadow-xl font-mono text-xs text-[#272A27]">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-[#C8BFAF]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-300">
                <HelpCircle className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                  {lang === 'hi' ? 'पूर्वानुमान परिवर्तन विश्लेषण // प्रत्यक्ष कारण एवं भौतिकी संबंध' : lang === 'mr' ? 'अंदाज बदल विश्लेषण // थेट कारण व भौतिकशास्त्र संबंध' : 'FORECAST DRIVER ANALYSIS // CAUSAL ATTRIBUTION'}
                </div>
                <div className="text-sm font-bold text-[#272A27] mt-0.5">
                  {mine_name} — {activePreset.name}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-[11px]">
              <div className="px-3 py-1.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                <span className="text-[#5F625C]">Baseline Target: </span>
                <strong className="text-[#272A27]">{targetTpd.toLocaleString()} TPD</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                <span className="text-[#5F625C]">14-Day Expected Mean: </span>
                <strong className="text-manganese-300">{kpis.avg_predicted_yield ? kpis.avg_predicted_yield.toLocaleString() : '0'} TPD</strong>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
                <span className="text-[#5F625C]">Projected Shortfall: </span>
                <strong className={net_impact_tpd < 0 ? 'text-hazard-400' : 'text-emerald-400'}>
                  {net_impact_tpd < 0 ? `-${Math.abs(net_impact_tpd).toLocaleString()}` : `+${net_impact_tpd.toLocaleString()}`} TPD
                </strong>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {/* Primary Driver */}
            <div className="p-3.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-1.5">
              <div className="text-[10px] text-cyan-400 font-bold uppercase">Primary Bottleneck Driver</div>
              <div className="text-sm font-bold text-[#272A27] flex items-center justify-between">
                <span>{waterfall_drivers[0]?.name || 'Precipitation Drag'}</span>
                <span className="text-hazard-400 font-mono">{waterfall_drivers[0]?.impact_tpd} TPD</span>
              </div>
              <p className="text-[11px] text-[#5F625C] leading-relaxed">
                {waterfall_drivers[0]?.recommendation} (Confidence: {waterfall_drivers[0]?.confidence_pct}%)
              </p>
            </div>

            {/* Secondary Driver */}
            <div className="p-3.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-1.5">
              <div className="text-[10px] text-purple-400 font-bold uppercase">Secondary Operational Vector</div>
              <div className="text-sm font-bold text-[#272A27] flex items-center justify-between">
                <span>{waterfall_drivers[1]?.name || 'Haul Traction Slip'}</span>
                <span className="text-hazard-400 font-mono">{waterfall_drivers[1]?.impact_tpd} TPD</span>
              </div>
              <p className="text-[11px] text-[#5F625C] leading-relaxed">
                {waterfall_drivers[1]?.recommendation} (Confidence: {waterfall_drivers[1]?.confidence_pct}%)
              </p>
            </div>

            {/* Recovery & Outlook */}
            <div className="p-3.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-1.5">
              <div className="text-[10px] text-emerald-400 font-bold uppercase">Recovery Outlook & Mitigation</div>
              <div className="text-sm font-bold text-[#272A27] flex items-center justify-between">
                <span>Stabilization Horizon</span>
                <span className="text-emerald-400 font-mono">{kpis.recovery_day || 'D11+'}</span>
              </div>
              <p className="text-[11px] text-[#5F625C] leading-relaxed">
                Surge buffer drawdown of {physical_profile.stockpileBufferT} T active under protocol {physical_profile.protocolCode}.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Developer Diagnostic Mine Fingerprint HUD */}
      {showDiagnosticHud && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-obsidian-950 via-obsidian-900 to-obsidian-950 border border-amber-500/40 shadow-xl font-mono text-xs text-[#272A27]">
          <div className="flex items-center justify-between pb-3 border-b border-[#C8BFAF]">
            <div className="flex items-center gap-2.5">
              <Fingerprint className="w-4 h-4 text-amber-400 animate-pulse" />
              <span className="font-bold text-amber-300 tracking-wider uppercase text-[11px]">
                {lang === 'hi' ? 'खदान भौतिकी एवं टेलीमेट्री फिंगरप्रिंट' : lang === 'mr' ? 'खाण भौतिकशास्त्र व टेलीमेट्री फिंगरप्रिंट' : 'MINE PHYSICAL & TELEMETRY FINGERPRINT'}
              </span>
            </div>
            <div className="text-[11px] text-[#5F625C]">
              ID: <strong className="text-[#272A27]">{mine_id}</strong> | Type: <strong className="text-manganese-300">{mine_type}</strong>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mt-4">
            <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
              <div className="text-[10px] text-[#5F625C]">Daily Target</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{targetTpd.toLocaleString()} TPD</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
              <div className="text-[10px] text-[#5F625C]">D1 Logged Actual</div>
              <div className="text-sm font-bold text-cyan-400 mt-0.5">{historical_actual_d1.toLocaleString()} TPD</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
              <div className="text-[10px] text-[#5F625C]">Rain Sensitivity</div>
              <div className="text-sm font-bold text-amber-400 mt-0.5">{physical_profile.rainSens}x</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
              <div className="text-[10px] text-[#5F625C]">Haul Distance</div>
              <div className="text-sm font-bold text-[#272A27] mt-0.5">{physical_profile.haulDistKm} km</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
              <div className="text-[10px] text-[#5F625C]">Max Drainage</div>
              <div className="text-sm font-bold text-sky-400 mt-0.5">{physical_profile.maxDrainageM3h} m³/h</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
              <div className="text-[10px] text-[#5F625C]">Crusher Health</div>
              <div className="text-sm font-bold text-emerald-400 mt-0.5">{physical_profile.crusherHealthBase}%</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
              <div className="text-[10px] text-[#5F625C]">Surge Stockpile</div>
              <div className="text-sm font-bold text-purple-400 mt-0.5">{physical_profile.stockpileBufferT} T</div>
            </div>
            <div className="p-2.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF]">
              <div className="text-[10px] text-[#5F625C]">Protocol Code</div>
              <div className="text-sm font-bold text-hazard-400 mt-0.5">{physical_profile.protocolCode}</div>
            </div>
          </div>

          <div className="mt-3 pt-3 border-t border-[#C8BFAF] text-[11px] text-[#5F625C] flex flex-wrap items-center justify-between gap-2">
            <span>Primary Infrastructure: <strong className="text-[#272A27]">{physical_profile.keyInfrastructure}</strong></span>
            <span>Vulnerability Focus: <strong className="text-amber-300">{physical_profile.vulnCategory}</strong></span>
          </div>
        </div>
      )}

      {/* 2. Interactive Scenario Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {SCENARIO_PRESETS.map((scen) => {
          const isSelected = selectedScenario === scen.id;
          return (
            <button
              key={scen.id}
              onClick={() => applyScenario(scen.id)}
              className={`p-4 rounded-2xl text-left transition-all border relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-[#F5F1E9]/90 border-manganese-500 shadow-lg shadow-manganese-500/10'
                  : 'bg-[#F5F1E9] border border-[#C8BFAF] hover:border-[#C8BFAF] hover:bg-[#F5F1E9]/40'
              }`}
            >
              {isSelected && (
                <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-manganese-500/20 to-transparent pointer-events-none rounded-bl-3xl" />
              )}

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: scen.color }}
                    />
                    <span className="font-bold text-sm text-[#272A27]">{scen.name}</span>
                  </div>
                  {isSelected && (
                    <CheckCircle2 className="w-4 h-4 text-manganese-400" />
                  )}
                </div>
                <p className="text-xs text-[#5F625C] leading-relaxed font-sans">
                  {scen.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-[#C8BFAF] flex items-center justify-between text-[10px] text-[#85877E] font-mono">
                <span>{scen.id === 'BASELINE' ? 'Nominal' : scen.id === 'HEAVY_MONSOON' ? 'Weather Stress' : scen.id === 'CRUSHER_SEIZURE' ? 'Mechanical Stress' : 'Compound Risk'}</span>
                <span style={{ color: scen.color }} className="font-bold">
                  {isSelected ? 'ACTIVE SCENARIO' : 'APPLY STRESS'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* 3. Interactive What-If Parameter Sliders */}
      {showWhatIfControls && (
        <div className="p-6 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#C8BFAF]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-manganese-500/10 border border-manganese-500/30 text-manganese-400">
                <SlidersHorizontal className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-[#272A27] text-sm">
                  {lang === 'hi' ? 'लाइव परिचालन व्हाट-इफ मापदंड ट्यूनर' : lang === 'mr' ? 'थेट परिचालन व्हॉट-इफ मापदंड ट्यूनर' : 'Live Operational What-If Parameter Tuner'}
                </h3>
                <p className="text-xs text-[#5F625C] font-mono">
                  {lang === 'hi' ? 'मापदंडों को स्लाइड करें — 14-दिवसीय पूर्वानुमान वास्तविक समय में गतिशील रूप से पुनर्गणित होता है।' :
                   lang === 'mr' ? 'मापदंड स्लाइड करा — 14-दिवसांचा अंदाज रिअल-टाइममध्ये पुनर्गणित होतो.' :
                   'Modify operational stresses — 14-day production curves, confidence envelopes, and root causes recalculate instantaneously.'}
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                const preset = SCENARIO_PRESETS.find(s => s.id === selectedScenario) || SCENARIO_PRESETS[0];
                setRainfallMm(preset.defaultRainfall);
                setCrusherAvail(preset.defaultCrusher);
                setFleetAvail(preset.defaultFleet);
                setHaulEff(preset.defaultHaulEff);
                setSumpInflow(preset.defaultSumpInflow);
                setPumpCap(preset.defaultPumpCap);
                setEqHealth(preset.defaultEqHealth);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] text-xs text-[#272A27] hover:text-[#272A27] flex items-center gap-2 self-start sm:self-auto transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-[#5F625C]" />
              <span>{lang === 'hi' ? 'परिदृश्य डिफ़ॉल्ट पर रीसेट करें' : lang === 'mr' ? 'परिदृश्य डिफॉल्टवर रीसेट करा' : 'Reset to Scenario Defaults'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono">
            {/* Rainfall Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[#272A27]">
                <span className="flex items-center gap-1.5">
                  <CloudRain className="w-3.5 h-3.5 text-sky-400" />
                  <span>{lang === 'hi' ? 'वर्षा दर:' : lang === 'mr' ? 'पाऊस दर:' : 'Precipitation:'}</span>
                </span>
                <strong className="text-sky-400 font-bold">{rainfallMm} mm/day</strong>
              </div>
              <input
                type="range"
                min="0"
                max="200"
                step="5"
                value={rainfallMm}
                onChange={(e) => setRainfallMm(Number(e.target.value))}
                className="w-full accent-sky-400 bg-[#F5F1E9] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#85877E]">
                <span>0 mm</span>
                <span>Dry</span>
                <span>Storm (200 mm)</span>
              </div>
            </div>

            {/* Crusher Availability Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[#272A27]">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'hi' ? 'क्रशर उपलब्धता:' : lang === 'mr' ? 'क्रशर उपलब्धता:' : 'Crusher Avail:'}</span>
                </span>
                <strong className="text-amber-400 font-bold">{crusherAvail}%</strong>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={crusherAvail}
                onChange={(e) => setCrusherAvail(Number(e.target.value))}
                className="w-full accent-amber-400 bg-[#F5F1E9] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#85877E]">
                <span>10% (Seized)</span>
                <span>50%</span>
                <span>100% (Nominal)</span>
              </div>
            </div>

            {/* Fleet Availability Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[#272A27]">
                <span className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-manganese-400" />
                  <span>{lang === 'hi' ? 'बेड़े की उपलब्धता:' : lang === 'mr' ? 'वाहनांची उपलब्धता:' : 'Fleet Roster:'}</span>
                </span>
                <strong className="text-manganese-400 font-bold">{fleetAvail}%</strong>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                step="5"
                value={fleetAvail}
                onChange={(e) => setFleetAvail(Number(e.target.value))}
                className="w-full accent-manganese-400 bg-[#F5F1E9] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#85877E]">
                <span>20%</span>
                <span>60%</span>
                <span>100% (Full)</span>
              </div>
            </div>

            {/* Sump Inflow Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[#272A27]">
                <span className="flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{lang === 'hi' ? 'सम्प जल अंतर्वाह:' : lang === 'mr' ? 'सम्प पाणी अंतर्प्रवाह:' : 'Sump Inflow:'}</span>
                </span>
                <strong className="text-cyan-400 font-bold">{sumpInflow} m³/h</strong>
              </div>
              <input
                type="range"
                min="20"
                max="800"
                step="20"
                value={sumpInflow}
                onChange={(e) => setSumpInflow(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-[#F5F1E9] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#85877E]">
                <span>20 m³/h</span>
                <span>Normal</span>
                <span>800 m³/h (Flood)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. The 14-Day Multi-Physics Production Forecast Chart */}
      <div className="p-6 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-[#C8BFAF]">
          <div>
            <h3 className="font-bold text-[#272A27] text-base sm:text-lg flex items-center gap-2">
              <span>{lang === 'hi' ? '14-दिवसीय उत्पादन प्रक्षेपवक्र एवं 95% विश्वास अंतराल' : lang === 'mr' ? '14-दिवसांचे उत्पादन प्रक्षेपवक्र व 95% विश्वास मर्यादा' : '14-Day Production Trajectory & 95% Confidence Band'}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-[#F5F1E9] border border-[#C8BFAF] text-manganese-300">
                {activePreset.name}
              </span>
            </h3>
            <p className="text-xs text-[#5F625C] font-mono mt-0.5">
              {lang === 'hi' ? 'D1 पर वास्तविक शिफ्ट डेटा (हरा बिंदु), D2-D14 अनुमानित प्रक्षेपवक्र, दैनिक कोटा लक्ष्य और वर्षा स्तर।' :
               lang === 'mr' ? 'D1 वर प्रत्यक्ष शिफ्ट डेटा (हिरवा बिंदू), D2-D14 अंदाजित प्रक्षेपवक्र, दैनिक कोटा उद्दिष्ट व पाऊस पातळी.' :
               `D1 historical shift log (${historical_actual_d1.toLocaleString()} TPD), D2-D14 multi-physics forecast points, ${targetTpd.toLocaleString()} TPD quota target, and rainfall correlation.`}
            </p>
          </div>

          {/* Chart Legend */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-[#272A27]">Logged Actual (D1)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-manganese-400" />
              <span className="text-[#272A27]">Predicted Yield</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-red-400 border-dashed" />
              <span className="text-[#272A27]">Target Quota</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-2 rounded bg-cyan-500/20 border border-cyan-500/40" />
              <span className="text-[#272A27]">95% CI Band</span>
            </div>
            {showRainfall && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded bg-sky-500/40" />
                <span className="text-sky-300">Rainfall (mm)</span>
              </div>
            )}
          </div>
        </div>

        {/* Recharts Render Canvas */}
        <div className="h-[360px] sm:h-[420px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 10, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#C8BFAF" vertical={false} />

              <XAxis
                dataKey="day_label"
                stroke="#5F625C"
                tick={{ fill: '#5F625C', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#3f3f46' }}
                tickLine={{ stroke: '#3f3f46' }}
              />

              <YAxis
                yAxisId="yieldAxis"
                domain={[yMin, yMax]}
                stroke="#5F625C"
                tick={{ fill: '#5F625C', fontSize: 11, fontFamily: 'monospace' }}
                axisLine={{ stroke: '#3f3f46' }}
                tickLine={{ stroke: '#3f3f46' }}
                tickFormatter={(v) => `${(v / 1000).toFixed(1)}k T`}
              />

              {showRainfall && (
                <YAxis
                  yAxisId="rainAxis"
                  orientation="right"
                  domain={[0, 250]}
                  stroke="#38bdf8"
                  tick={{ fill: '#38bdf8', fontSize: 10, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#0284c7' }}
                  tickLine={{ stroke: '#0284c7' }}
                  tickFormatter={(v) => `${v}mm`}
                />
              )}

              <Tooltip content={<CustomTooltip />} />

              {/* Quota Reference Line */}
              <ReferenceLine
                yAxisId="yieldAxis"
                y={targetTpd}
                stroke="#ef4444"
                strokeDasharray="4 4"
                strokeWidth={2}
                label={{
                  value: `QUOTA: ${targetTpd.toLocaleString()} TPD`,
                  fill: '#ef4444',
                  fontSize: 10,
                  position: 'insideTopLeft',
                  fontFamily: 'monospace'
                }}
              />

              {/* 95% Confidence Upper Band Area */}
              <Area
                yAxisId="yieldAxis"
                type="monotone"
                dataKey="upper_ci_tpd"
                stroke="transparent"
                fill="#06b6d4"
                fillOpacity={0.12}
                name="Confidence Range Upper"
              />

              {/* 95% Confidence Lower Bound Floor */}
              <Area
                yAxisId="yieldAxis"
                type="monotone"
                dataKey="lower_ci_tpd"
                stroke="transparent"
                fill="#09090b"
                fillOpacity={1.0}
                name="Confidence Range Lower"
              />

              {/* Rainfall Bars */}
              {showRainfall && (
                <Bar
                  yAxisId="rainAxis"
                  dataKey="rainfall_mm"
                  fill="#38bdf8"
                  fillOpacity={0.25}
                  barSize={18}
                  radius={[4, 4, 0, 0]}
                  name="Precipitation"
                />
              )}

              {/* Multi-Scenario Overlay Comparison Lines */}
              {showAllScenarios && (
                <>
                  <Line
                    yAxisId="yieldAxis"
                    type="monotone"
                    dataKey="BASELINE"
                    stroke="#10b981"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    name="Baseline Nominal"
                  />
                  <Line
                    yAxisId="yieldAxis"
                    type="monotone"
                    dataKey="HEAVY_MONSOON"
                    stroke="#3b82f6"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    name="Heavy Monsoon"
                  />
                  <Line
                    yAxisId="yieldAxis"
                    type="monotone"
                    dataKey="CRUSHER_SEIZURE"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    name="Crusher Seizure"
                  />
                  <Line
                    yAxisId="yieldAxis"
                    type="monotone"
                    dataKey="MULTI_RISK"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    strokeDasharray="3 3"
                    dot={false}
                    name="Multi-Risk Crisis"
                  />
                </>
              )}

              {/* Primary Active Yield Curve */}
              <Line
                yAxisId="yieldAxis"
                type="monotone"
                dataKey="predicted_yield_tpd"
                stroke={activePreset.color}
                strokeWidth={3}
                dot={{ r: 4, fill: activePreset.color, stroke: '#F0EBE2', strokeWidth: 2 }}
                activeDot={{ r: 7, fill: '#fff', stroke: activePreset.color, strokeWidth: 3 }}
                name="Predicted Yield"
              />

              {/* Historical D1 Actual Shift Dot */}
              <ReferenceDot
                yAxisId="yieldAxis"
                x="D1"
                y={historical_actual_d1}
                r={7}
                fill="#10b981"
                stroke="#ffffff"
                strokeWidth={2}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Day-by-Day Trajectory Event Markers */}
        <div className="pt-4 border-t border-[#C8BFAF]">
          <div className="text-xs font-bold text-[#272A27] mb-3 flex items-center gap-2">
            <Activity className="w-3.5 h-3.5 text-manganese-400" />
            <span>{lang === 'hi' ? 'दैनिक परिचालन घटनाएं एवं प्राथमिक बाधा चालक' : lang === 'mr' ? 'दैनंदिन परिचालन घटना व प्राथमिक घटक' : 'Day-by-Day Operational Timeline & Driver Cascade'}</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {forecast_points.slice(0, 14).map((pt) => {
              const isWorst = pt.day_label === kpis.worst_day?.slice(0, 2);
              return (
                <div
                  key={pt.day_num}
                  className={`p-2.5 rounded-xl border text-[11px] font-mono transition-all ${
                    isWorst
                      ? 'bg-hazard-950/80 border-hazard-500/60 shadow-md'
                      : pt.risk_level === 'CRITICAL'
                      ? 'bg-red-950/40 border-red-500/40'
                      : pt.risk_level === 'HIGH'
                      ? 'bg-amber-950/30 border-amber-500/30'
                      : 'bg-[#F5F1E9] border border-[#C8BFAF]'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-[#272A27]">{pt.day_label}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                      pt.risk_level === 'CRITICAL' ? 'bg-red-950 text-red-400' :
                      pt.risk_level === 'HIGH' ? 'bg-amber-950 text-amber-400' :
                      'bg-[#F0EBE2] text-[#5F625C]'
                    }`}>
                      {pt.risk_level}
                    </span>
                  </div>

                  <div className="font-bold text-manganese-300 text-xs mt-1">
                    {pt.predicted_yield_tpd.toLocaleString()} T
                  </div>

                  {pt.shortfall_tpd > 0 ? (
                    <div className="text-hazard-400 text-[10px] font-bold">
                      -{pt.shortfall_tpd.toLocaleString()} T
                    </div>
                  ) : (
                    <div className="text-emerald-400 text-[10px]">
                      +0 T
                    </div>
                  )}

                  <div className="text-[9px] text-[#5F625C] truncate mt-1 pt-1 border-t border-[#C8BFAF]" title={pt.main_driver}>
                    {pt.event_marker !== 'NORMAL' ? pt.event_marker : pt.main_driver}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Quantitative KPI Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* KPI 1: Mean Predicted Output */}
        <div className="p-4 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
          <div className="text-xs text-[#5F625C] font-mono flex items-center justify-between">
            <span>{lang === 'hi' ? '14-दिन औसत उत्पादन' : lang === 'mr' ? '14-दिवस सरासरी उत्पादन' : '14D Avg Yield'}</span>
            <Activity className="w-3.5 h-3.5 text-manganese-400" />
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-[#272A27] mt-1 font-display">
            {kpis.avg_predicted_yield ? kpis.avg_predicted_yield.toLocaleString() : '0'} <span className="text-xs font-mono font-normal text-[#5F625C]">TPD</span>
          </div>
          <div className="text-[11px] text-[#5F625C] mt-1 font-mono">
            {lang === 'hi' ? 'कोटा लक्ष्य: ' : lang === 'mr' ? 'कोटा उद्दिष्ट: ' : 'Quota: '}{targetTpd.toLocaleString()} TPD
          </div>
        </div>

        {/* KPI 2: Total 14D Shortfall */}
        <div className="p-4 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
          <div className="text-xs text-[#5F625C] font-mono flex items-center justify-between">
            <span>{lang === 'hi' ? 'कुल संचयी कमी' : lang === 'mr' ? 'एकूण संचयी तूट' : '14D Total Deficit'}</span>
            <TrendingDown className="w-3.5 h-3.5 text-hazard-400" />
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-hazard-400 mt-1 font-display">
            {kpis.total_shortfall_tonnes > 0 ? `-${kpis.total_shortfall_tonnes.toLocaleString()}` : '0'} <span className="text-xs font-mono font-normal text-[#5F625C]">T</span>
          </div>
          <div className="text-[11px] text-[#5F625C] mt-1 font-mono">
            {kpis.avg_daily_shortfall > 0 ? `-${kpis.avg_daily_shortfall.toLocaleString()} TPD Mean` : 'No Deficit'}
          </div>
        </div>

        {/* KPI 3: Peak Shock Day */}
        <div className="p-4 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
          <div className="text-xs text-[#5F625C] font-mono flex items-center justify-between">
            <span>{lang === 'hi' ? 'चरम संकट दिन' : lang === 'mr' ? 'कमाल संकट दिवस' : 'Peak Shock Day'}</span>
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-amber-300 mt-1 font-display">
            {kpis.worst_day || 'D5'}
          </div>
          <div className="text-[11px] text-hazard-400 mt-1 font-mono">
            -{kpis.worst_day_shortfall ? kpis.worst_day_shortfall.toLocaleString() : '0'} TPD Shock
          </div>
        </div>

        {/* KPI 4: Stabilization Horizon */}
        <div className="p-4 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
          <div className="text-xs text-[#5F625C] font-mono flex items-center justify-between">
            <span>{lang === 'hi' ? 'स्थिरीकरण क्षितिज' : lang === 'mr' ? 'स्थिरीकरण मर्यादा' : 'Recovery Day'}</span>
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-cyan-300 mt-1 font-display">
            {kpis.recovery_day || 'D11+'}
          </div>
          <div className="text-[11px] text-[#5F625C] mt-1 font-mono">
            {lang === 'hi' ? 'प्रोटोकॉल: ' : lang === 'mr' ? 'प्रोटोकॉल: ' : 'Protocol: '}{physical_profile.protocolCode}
          </div>
        </div>

        {/* KPI 5: Financial Exposure */}
        <div className="p-4 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
          <div className="text-xs text-[#5F625C] font-mono flex items-center justify-between">
            <span>{lang === 'hi' ? 'वित्तीय जोखिम मूल्य' : lang === 'mr' ? 'आर्थिक जोखीम मूल्य' : 'Value at Risk'}</span>
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="text-lg sm:text-2xl font-extrabold text-emerald-400 mt-1 font-display">
            ₹{kpis.financial_exposure_cr || 0} <span className="text-xs font-mono font-normal text-[#5F625C]">Cr</span>
          </div>
          <div className="text-[11px] text-[#5F625C] mt-1 font-mono">
            ₹14,500/T Realization
          </div>
        </div>

        {/* KPI 6: Risk Classification */}
        <div className="p-4 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm">
          <div className="text-xs text-[#5F625C] font-mono flex items-center justify-between">
            <span>{lang === 'hi' ? 'जोखिम वर्गीकरण' : lang === 'mr' ? 'जोखीम वर्गीकरण' : 'Risk Matrix'}</span>
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className={`text-lg sm:text-2xl font-extrabold mt-1 font-display ${
            kpis.risk_classification === 'CRITICAL' ? 'text-red-400' :
            kpis.risk_classification === 'HIGH' ? 'text-amber-400' :
            kpis.risk_classification === 'MODERATE' ? 'text-yellow-400' :
            'text-emerald-400'
          }`}>
            {kpis.risk_classification || 'LOW'}
          </div>
          <div className="text-[11px] text-[#5F625C] mt-1 font-mono">
            {models_status.model_version || 'v4.0'}
          </div>
        </div>
      </div>

      {/* 6. AI Causal Explanation & TreeSHAP Feature Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* AI Bottleneck Narrative Card */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center gap-2 text-manganese-400 text-xs font-bold font-mono uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{lang === 'hi' ? 'एआई कॉज़ल रूट-कॉज नैरेटिव // सक्रिय खदान विश्लेषण' : lang === 'mr' ? 'एआय कॉझल रूट-कॉज विश्लेषण // सक्रिय खाण विश्लेषण' : 'AI CAUSAL ROOT-CAUSE ATTRIBUTION // ACTIVE MINE TELEMETRY'}</span>
            </div>
            <h4 className="font-bold text-[#272A27] text-lg">
              {lang === 'hi' ? `${mine_name} परिचालन स्थिति एवं अनुशंसा` : lang === 'mr' ? `${mine_name} परिचालन स्थिती व शिफारस` : `${mine_name} Operational Diagnosis & Statutory Action`}
            </h4>
            <p className="text-xs sm:text-sm text-[#272A27] mt-3 leading-relaxed font-sans">
              {ai_explanation}
            </p>
          </div>

          <div className="pt-4 border-t border-[#C8BFAF] flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-[#5F625C]">
            <div className="flex items-center gap-2">
              <span className="text-[#85877E]">{lang === 'hi' ? 'मॉडल स्थिति:' : lang === 'mr' ? 'मॉडेल स्थिती:' : 'Status:'}</span>
              <strong className="text-emerald-400">{models_status.status || 'ONLINE'} ({models_status.engine || 'AETHER-ENGINE'})</strong>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[#85877E]">{lang === 'hi' ? 'अयस्क ग्रेड:' : lang === 'mr' ? 'खनिज ग्रेड:' : 'Grade:'}</span>
              <strong className="text-manganese-300">{physical_profile.oreGrade || '44.2% Mn'}</strong>
            </div>
          </div>
        </div>

        {/* TreeSHAP Feature Drivers Waterfall List */}
        <div className="p-6 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-4 font-mono">
          <div className="flex items-center justify-between border-b border-[#C8BFAF] pb-3">
            <div className="font-bold text-[#272A27] text-sm flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>TreeSHAP Waterfall Drivers</span>
            </div>
            <span className="text-[10px] text-[#5F625C]">14D Impact</span>
          </div>

          <div className="space-y-3">
            {waterfall_drivers.map((drv, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedDriverDetail(drv)}
                className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] hover:border-obsidian-600 transition-all cursor-pointer space-y-1.5"
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-[#272A27]">{drv.name}</span>
                  <span className={`font-bold ${drv.impact_tpd < 0 ? 'text-hazard-400' : 'text-emerald-400'}`}>
                    {drv.impact_tpd < 0 ? `${drv.impact_tpd} TPD` : `+${drv.impact_tpd} TPD`}
                  </span>
                </div>
                <div className="flex justify-between items-center text-[10px] text-[#5F625C]">
                  <span>{drv.category}</span>
                  <span className="text-[#85877E]">{drv.current_val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Driver Detail Modal Popup */}
      {selectedDriverDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full p-6 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-2xl font-mono space-y-4">
            <div className="flex justify-between items-center border-b border-[#C8BFAF] pb-3">
              <div className="font-bold text-[#272A27] text-base flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>{selectedDriverDetail.name}</span>
              </div>
              <button
                onClick={() => setSelectedDriverDetail(null)}
                className="p-1 rounded-lg bg-[#F5F1E9] text-[#5F625C] hover:text-[#272A27]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#272A27]">
              <div className="flex justify-between py-1 border-b border-obsidian-900">
                <span className="text-[#5F625C]">Category:</span>
                <strong className="text-[#272A27]">{selectedDriverDetail.category}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-obsidian-900">
                <span className="text-[#5F625C]">14-Day Mean Impact:</span>
                <strong className={selectedDriverDetail.impact_tpd < 0 ? 'text-hazard-400' : 'text-emerald-400'}>
                  {selectedDriverDetail.impact_tpd} TPD
                </strong>
              </div>
              <div className="flex justify-between py-1 border-b border-obsidian-900">
                <span className="text-[#5F625C]">Telemetry Value:</span>
                <strong className="text-cyan-300">{selectedDriverDetail.current_val}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-obsidian-900">
                <span className="text-[#5F625C]">Attribution Confidence:</span>
                <strong className="text-emerald-400">{selectedDriverDetail.confidence_pct}%</strong>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] space-y-1">
              <div className="text-[10px] text-[#5F625C] uppercase font-bold">Algorithmic Recommendation:</div>
              <p className="text-xs text-amber-300 leading-relaxed font-sans">
                {selectedDriverDetail.recommendation}
              </p>
            </div>

            <button
              onClick={() => setSelectedDriverDetail(null)}
              className="w-full py-2 rounded-xl bg-manganese-500 text-obsidian-950 font-bold text-xs hover:bg-manganese-400 transition-colors"
            >
              Close Attribution Detail
            </button>
          </div>
        </div>
      )}

    </section>
  );
};
