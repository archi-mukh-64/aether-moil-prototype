import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { alertApi } from '../services/api/alertApi.js';
import { feedbackApi } from '../services/api/feedbackApi.js';
import { generateRiskMatrix, CANONICAL_MOIL_THREATS } from '../services/riskEngine.js';
import {
  AlertTriangle,
  ShieldAlert,
  ArrowUpRight,
  CheckCircle2,
  Zap,
  Clock,
  MapPin,
  Filter,
  Layers,
  ChevronRight,
  Radio,
  SlidersHorizontal,
  Flame,
  ShieldCheck,
  Search,
  Check,
  Send,
  XCircle,
  Eye,
  RefreshCw,
  Server,
  Activity,
  AlertCircle,
  Cpu,
  Gauge,
  TrendingDown,
  FileText
} from 'lucide-react';

export const RiskCenterPreview = () => {
  const {
    t,
    lang,
    activeMine,
    selectedMineId,
    mines,
    activeScenarioId,
    scenarioSeverity,
    auditLogs,
    setAuditLogs
  } = useApp();

  // 1. Canonical Threat Dataset (Single Source of Truth)
  const [canonicalThreats, setCanonicalThreats] = useState(() =>
    generateRiskMatrix('all', activeScenarioId ? { scenarioId: activeScenarioId, severity: scenarioSeverity } : null)
  );

  // 2. Active Filter States
  const [selectedMineFilter, setSelectedMineFilter] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // 3. UI State
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [lastUpdatedTime, setLastUpdatedTime] = useState(() => new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
  const [actionLoading, setActionLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  // Sync with global scenario shocks or load from Backend API
  const loadThreats = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const params = {
        scenario: activeScenarioId || undefined,
        scenario_severity: scenarioSeverity || undefined
      };

      const res = await alertApi.listAlerts(params);
      if (res && Array.isArray(res.alerts) && res.alerts.length > 0) {
        // Merge with existing acknowledgement / resolution overrides if any
        setCanonicalThreats(prev => {
          const statusMap = new Map(prev.map(p => [p.id, p]));
          return res.alerts.map(a => {
            const existing = statusMap.get(a.id);
            if (existing && existing.status !== 'ACTIVE') {
              return {
                ...a,
                status: existing.status,
                acknowledgement_state: existing.acknowledgement_state || existing.acknowledgementState,
                acknowledgementState: existing.acknowledgementState || existing.acknowledgement_state,
                escalation_state: existing.escalation_state || existing.escalationState,
                escalationState: existing.escalationState || existing.escalation_state,
                resolved_at: existing.resolved_at || existing.resolvedAt,
                resolvedAt: existing.resolvedAt || existing.resolved_at,
                resolved_by: existing.resolved_by || existing.resolvedBy,
                resolvedBy: existing.resolvedBy || existing.resolved_by,
                resolution_action: existing.resolution_action || existing.resolutionAction,
                resolutionAction: existing.resolutionAction || existing.resolution_action
              };
            }
            return a;
          });
        });
      } else {
        // Fallback to rich deterministic multi-physics matrix
        setCanonicalThreats(generateRiskMatrix('all', activeScenarioId ? { scenarioId: activeScenarioId, severity: scenarioSeverity } : null));
      }
    } catch (err) {
      console.warn('[RISK CENTER] Using deterministic threat matrix:', err.message);
      setCanonicalThreats(generateRiskMatrix('all', activeScenarioId ? { scenarioId: activeScenarioId, severity: scenarioSeverity } : null));
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastUpdatedTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }
  }, [activeScenarioId, scenarioSeverity]);

  // Initial load and scenario coupling
  useEffect(() => {
    loadThreats(false);
  }, [loadThreats]);

  // 4. Pure Reactive Filtering & Search Pipeline
  const derivedThreats = useMemo(() => {
    let list = [...canonicalThreats];

    // Filter 1: Mine Filter
    if (selectedMineFilter !== 'ALL') {
      const norm = selectedMineFilter.toLowerCase();
      list = list.filter(t => (t.mineId || t.mine_id || '').toLowerCase() === norm);
    }

    // Filter 2: Operational Lifecycle Status
    if (selectedStatus !== 'ALL') {
      const st = selectedStatus.toUpperCase();
      list = list.filter(t => (t.status || 'ACTIVE').toUpperCase() === st);
    }

    // Filter 3: Severity Vector Tab
    if (selectedSeverity !== 'ALL') {
      const sev = selectedSeverity.toUpperCase();
      if (sev === 'MEDIUM' || sev === 'WATCH') {
        list = list.filter(t => {
          const s = (t.severity || t.level || '').toUpperCase();
          return s === 'MEDIUM' || s === 'WATCH';
        });
      } else if (sev === 'LOW' || sev === 'NOMINAL') {
        list = list.filter(t => {
          const s = (t.severity || t.level || '').toUpperCase();
          return s === 'LOW' || s === 'NOMINAL' || s === 'NORMAL';
        });
      } else {
        list = list.filter(t => (t.severity || t.level || '').toUpperCase() === sev);
      }
    }

    // Filter 4: Keyword Multi-Term Search
    if (searchQuery && searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(t =>
        (t.title || '').toLowerCase().includes(q) ||
        (t.description || '').toLowerCase().includes(q) ||
        (t.primaryDriver || '').toLowerCase().includes(q) ||
        (t.mineName || t.mine_name || t.mine || '').toLowerCase().includes(q) ||
        (t.mineId || t.mine_id || '').toLowerCase().includes(q) ||
        (t.id || '').toLowerCase().includes(q) ||
        (t.category || '').toLowerCase().includes(q) ||
        (t.affectedEquipment || t.affected_equipment || '').toLowerCase().includes(q) ||
        (t.affectedSystem || t.affected_system || '').toLowerCase().includes(q) ||
        (t.sensorType || t.sensor_type || '').toLowerCase().includes(q) ||
        (t.sensorId || t.sensor_id || '').toLowerCase().includes(q) ||
        (t.recommendedAction || t.recommended_action || '').toLowerCase().includes(q)
      );
    }

    // Priority Sort Hierarchy: Status (Active/Escalated first) > Severity (Critical > High > Elevated > Med > Low) > Risk Score Desc > Production Impact Desc
    const severityRank = { 'CRITICAL': 0, 'HIGH': 1, 'ELEVATED': 2, 'MEDIUM': 3, 'WATCH': 3, 'LOW': 4, 'NOMINAL': 4, 'NORMAL': 4 };
    const statusRank = { 'ACTIVE': 0, 'ESCALATED': 1, 'ACKNOWLEDGED': 2, 'RESOLVED': 3 };

    list.sort((a, b) => {
      const sA = statusRank[(a.status || 'ACTIVE').toUpperCase()] ?? 0;
      const sB = statusRank[(b.status || 'ACTIVE').toUpperCase()] ?? 0;
      if (sA !== sB) return sA - sB;

      const sevA = severityRank[(a.severity || a.level || 'LOW').toUpperCase()] ?? 4;
      const sevB = severityRank[(b.severity || b.level || 'LOW').toUpperCase()] ?? 4;
      if (sevA !== sevB) return sevA - sevB;

      const scoreA = Number(a.riskScore || a.risk_score || 0);
      const scoreB = Number(b.riskScore || b.risk_score || 0);
      if (scoreA !== scoreB) return scoreB - scoreA;

      const prodA = Number(a.productionImpactTpd || a.production_impact_tpd || 0);
      const prodB = Number(b.productionImpactTpd || b.production_impact_tpd || 0);
      return prodB - prodA;
    });

    return list;
  }, [canonicalThreats, selectedMineFilter, selectedStatus, selectedSeverity, searchQuery]);

  // 5. Dynamic Scope for Counts (Mine & Status scoped)
  const mineScopedThreats = useMemo(() => {
    let list = [...canonicalThreats];
    if (selectedMineFilter !== 'ALL') {
      const norm = selectedMineFilter.toLowerCase();
      list = list.filter(t => (t.mineId || t.mine_id || '').toLowerCase() === norm);
    }
    if (selectedStatus !== 'ALL') {
      const st = selectedStatus.toUpperCase();
      list = list.filter(t => (t.status || 'ACTIVE').toUpperCase() === st);
    }
    return list;
  }, [canonicalThreats, selectedMineFilter, selectedStatus]);

  // Dynamic Severity Spectrum Tab Counts
  const severitySpectrum = useMemo(() => {
    return [
      {
        id: 'ALL',
        label: lang === 'hi' ? 'सभी खतरे' : lang === 'mr' ? 'सर्व धोके' : 'ALL THREAT VECTORS',
        count: mineScopedThreats.length,
        color: 'text-[#272A27]'
      },
      {
        id: 'CRITICAL',
        label: lang === 'hi' ? 'गंभीर' : lang === 'mr' ? 'गंभीर' : 'CRITICAL',
        count: mineScopedThreats.filter(r => (r.severity || r.level || '').toUpperCase() === 'CRITICAL').length,
        color: 'text-hazard-400',
        bg: 'bg-hazard-500/15 border-hazard-500/40'
      },
      {
        id: 'HIGH',
        label: lang === 'hi' ? 'उच्च' : lang === 'mr' ? 'उच्च' : 'HIGH',
        count: mineScopedThreats.filter(r => (r.severity || r.level || '').toUpperCase() === 'HIGH').length,
        color: 'text-manganese-400',
        bg: 'bg-manganese-500/15 border-manganese-500/40'
      },
      {
        id: 'ELEVATED',
        label: lang === 'hi' ? 'बढ़ा हुआ' : lang === 'mr' ? 'वाढलेला' : 'ELEVATED',
        count: mineScopedThreats.filter(r => (r.severity || r.level || '').toUpperCase() === 'ELEVATED').length,
        color: 'text-amber-400',
        bg: 'bg-amber-500/15 border-amber-500/40'
      },
      {
        id: 'MEDIUM',
        label: lang === 'hi' ? 'मध्यम / निगरानी' : lang === 'mr' ? 'मध्यम / देखरेख' : 'MEDIUM / WATCH',
        count: mineScopedThreats.filter(r => {
          const s = (r.severity || r.level || '').toUpperCase();
          return s === 'MEDIUM' || s === 'WATCH';
        }).length,
        color: 'text-radar-400',
        bg: 'bg-radar-500/15 border-radar-500/40'
      },
      {
        id: 'LOW',
        label: lang === 'hi' ? 'सामान्य' : lang === 'mr' ? 'सामान्य' : 'LOW / NOMINAL',
        count: mineScopedThreats.filter(r => {
          const s = (r.severity || r.level || '').toUpperCase();
          return s === 'LOW' || s === 'NOMINAL' || s === 'NORMAL';
        }).length,
        color: 'text-telemetry-400',
        bg: 'bg-telemetry-500/15 border-telemetry-500/40'
      },
    ];
  }, [mineScopedThreats, lang]);

  // Dynamic KPI Totals
  const totalActiveThreats = useMemo(() => {
    return canonicalThreats.filter(t => (t.status || 'ACTIVE').toUpperCase() === 'ACTIVE').length;
  }, [canonicalThreats]);

  const totalProductionAtRisk = useMemo(() => {
    return derivedThreats
      .filter(t => (t.status || 'ACTIVE').toUpperCase() !== 'RESOLVED')
      .reduce((acc, curr) => acc + Number(curr.productionImpactTpd || curr.production_impact_tpd || 0), 0);
  }, [derivedThreats]);

  // 6. Interactive Action Handlers (Acknowledge / Resolve / Escalate)
  const handleAcknowledge = async (threatId) => {
    setActionLoading(true);
    const now = new Date().toISOString();

    // Instant Optimistic Reactive Update
    setCanonicalThreats(prev => prev.map(t => {
      if (t.id === threatId) {
        return {
          ...t,
          status: 'ACKNOWLEDGED',
          acknowledgementState: true,
          acknowledgement_state: true,
          acknowledgedAt: now,
          acknowledged_at: now,
          acknowledgedBy: 'DGMS Shift Controller',
          acknowledged_by: 'DGMS Shift Controller',
          lastUpdated: now,
          last_updated: now
        };
      }
      return t;
    }));

    // Record in Audit Ledger
    const targetThreat = canonicalThreats.find(t => t.id === threatId);
    if (setAuditLogs && targetThreat) {
      setAuditLogs(prev => [
        {
          id: `AUD-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `ACKNOWLEDGED ${threatId}`,
          user: 'DGMS Shift Controller',
          mine: targetThreat.mineName || targetThreat.mine_name || 'MOIL Mine',
          status: 'ACKNOWLEDGED',
          details: `Threat vector acknowledged: ${targetThreat.title || targetThreat.description}`
        },
        ...(Array.isArray(prev) ? prev : [])
      ]);
    }

    try {
      await alertApi.acknowledgeAlert({
        alert_id: threatId,
        operator: 'DGMS Shift Controller',
        note: 'Anomaly verified in operational telemetry. Operator watch activated.'
      });
      feedbackApi.recordDecision({
        decision_id: `DEC-ACK-${threatId}`,
        action_id: threatId,
        action_title: targetThreat?.title || 'Operational Threat Acknowledged',
        mine_id: targetThreat?.mineId || targetThreat?.mine_id || 'balaghat',
        decision: 'ACKNOWLEDGED',
        operator_id: 'DGMS Shift Controller',
        operator_notes: 'Threat vector acknowledged by shift controller.',
        system_confidence: '95.0%'
      }).catch(() => {});
    } catch (e) {
      console.warn('[ACKNOWLEDGE] Network sync deferred:', e.message);
    } finally {
      setActionLoading(false);
      setActionSuccess(lang === 'hi' ? 'चेतावनी स्वीकार कर ली गई है' : lang === 'mr' ? 'इशारा स्वीकारला गेला आहे' : 'Threat Vector Acknowledged Successfully');
      setTimeout(() => setActionSuccess(null), 2500);
    }
  };

  const handleResolve = async (threatId) => {
    setActionLoading(true);
    const now = new Date().toISOString();

    // Instant Optimistic Reactive Update
    setCanonicalThreats(prev => prev.map(t => {
      if (t.id === threatId) {
        return {
          ...t,
          status: 'RESOLVED',
          resolvedAt: now,
          resolved_at: now,
          resolvedBy: 'DGMS Shift Controller',
          resolved_by: 'DGMS Shift Controller',
          resolutionAction: t.recommendedAction || t.recommended_action || 'Mitigation protocol executed and telemetry normalized.',
          resolution_action: t.recommendedAction || t.recommended_action || 'Mitigation protocol executed and telemetry normalized.',
          lastUpdated: now,
          last_updated: now
        };
      }
      return t;
    }));

    // Record in Audit Ledger
    const targetThreat = canonicalThreats.find(t => t.id === threatId);
    if (setAuditLogs && targetThreat) {
      setAuditLogs(prev => [
        {
          id: `AUD-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `RESOLVED ${threatId}`,
          user: 'DGMS Shift Controller',
          mine: targetThreat.mineName || targetThreat.mine_name || 'MOIL Mine',
          status: 'RESOLVED',
          details: `Mitigation protocol executed: ${targetThreat.recommendedAction || targetThreat.recommended_action}`
        },
        ...(Array.isArray(prev) ? prev : [])
      ]);
    }

    try {
      await alertApi.resolveAlert({
        alert_id: threatId,
        operator: 'DGMS Shift Controller',
        note: targetThreat?.recommendedAction || 'Mitigation protocol executed. Sensor telemetry restored to baseline.'
      });
      feedbackApi.recordDecision({
        decision_id: `DEC-RES-${threatId}`,
        action_id: threatId,
        action_title: targetThreat?.title || 'Operational Threat Resolved',
        mine_id: targetThreat?.mineId || targetThreat?.mine_id || 'balaghat',
        decision: 'RESOLVED',
        operator_id: 'DGMS Shift Controller',
        operator_notes: 'Mitigation executed. Telemetry restored.',
        system_confidence: '98.0%'
      }).catch(() => {});
    } catch (e) {
      console.warn('[RESOLVE] Network sync deferred:', e.message);
    } finally {
      setActionLoading(false);
      setActionSuccess(lang === 'hi' ? 'खतरा सफलतापूर्वक हल किया गया' : lang === 'mr' ? 'धोका यशस्वीपणे सोडवला गेला' : 'Threat Vector Resolved with Mitigation Protocol Recorded');
      setTimeout(() => setActionSuccess(null), 2500);
    }
  };

  const handleEscalate = async (threatId) => {
    setActionLoading(true);
    const now = new Date().toISOString();

    // Instant Optimistic Reactive Update
    setCanonicalThreats(prev => prev.map(t => {
      if (t.id === threatId) {
        return {
          ...t,
          status: 'ESCALATED',
          escalationState: true,
          escalation_state: true,
          escalatedTo: 'DGMS Regional Inspector & General Manager',
          escalated_to: 'DGMS Regional Inspector & General Manager',
          escalatedAt: now,
          escalated_at: now,
          lastUpdated: now,
          last_updated: now
        };
      }
      return t;
    }));

    // Record in Audit Ledger
    const targetThreat = canonicalThreats.find(t => t.id === threatId);
    if (setAuditLogs && targetThreat) {
      setAuditLogs(prev => [
        {
          id: `AUD-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          action: `ESCALATED ${threatId}`,
          user: 'DGMS Shift Controller',
          mine: targetThreat.mineName || targetThreat.mine_name || 'MOIL Mine',
          status: 'ESCALATED',
          details: `Escalated to DGMS Regional Inspector & General Manager. Immediate intervention required.`
        },
        ...(Array.isArray(prev) ? prev : [])
      ]);
    }

    try {
      await alertApi.escalateAlert({
        alert_id: threatId,
        operator: 'DGMS Shift Controller',
        target: 'DGMS Regional Inspector & General Manager'
      });
      feedbackApi.recordDecision({
        decision_id: `DEC-ESC-${threatId}`,
        action_id: threatId,
        action_title: targetThreat?.title || 'Operational Threat Escalated',
        mine_id: targetThreat?.mineId || targetThreat?.mine_id || 'balaghat',
        decision: 'ESCALATED',
        operator_id: 'DGMS Shift Controller',
        operator_notes: 'Escalated to Regional Inspector & GM.',
        system_confidence: '99.0%'
      }).catch(() => {});
    } catch (e) {
      console.warn('[ESCALATE] Network sync deferred:', e.message);
    } finally {
      setActionLoading(false);
      setActionSuccess(lang === 'hi' ? 'डीजीएमएस महानिरीक्षक को सूचना अग्रेषित की गई' : lang === 'mr' ? 'डीजीएमएस अधिकार्‍यांकडे पाठवले गेले' : 'Threat Escalated to DGMS Regional Inspector & GM');
      setTimeout(() => setActionSuccess(null), 2500);
    }
  };

  return (
    <section className="command-container py-12 select-none">

      {/* Section Header with Live Status & Refresh Button */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-[#C8BFAF] pb-6">
        <div>
          <div className="badge-hazard mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-hazard-400 animate-pulse" />
            <span>{lang === 'hi' ? 'परिचालन जोखिम एवं खतरा मैट्रिक्स' : lang === 'mr' ? 'ऑपरेशनल जोखीम व धोका मॅट्रिक्स' : 'OPERATIONAL RISK & THREAT MATRIX'}</span>
          </div>
          <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-[#272A27]">
            {lang === 'hi' ? 'परिचालन जोखिम नियंत्रण केंद्र' : lang === 'mr' ? 'ऑपरेशनल जोखीम नियंत्रण केंद्र' : 'Operational Risk Center'}
          </h2>
          <p className="text-xs sm:text-sm text-[#5F625C] mt-1 max-w-2xl font-mono">
            {lang === 'hi' ? `वास्तविक समय बहु-सेंसर खतरा आकलन जो हाइड्रो-जियोलॉजी, उपकरण हार्मोनिक्स, और ढुलाई चक्रों की निगरानी करता है।` :
             lang === 'mr' ? `थेट वेळ बहु-सेन्सर धोका मूल्यांकन जे हायड्रो-भूविज्ञान, उपकरण सुसंगती आणि वाहतूक चक्रांवर लक्ष ठेवते.` :
             `Real-time multi-sensor threat assessment tracking hydrogeology, equipment harmonics, and haulage cycles across active assets.`}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Refresh Button */}
          <button
            onClick={() => loadThreats(true)}
            disabled={loading || refreshing}
            className="px-3.5 py-2 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] hover:border-manganese-500/50 hover:bg-[#DDD4C5] font-mono text-xs text-[#272A27] flex items-center gap-2 transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-manganese-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? (lang === 'hi' ? 'ताज़ा हो रहा है...' : lang === 'mr' ? 'रिफ्रेश होत आहे...' : 'REFRESHING...') : (lang === 'hi' ? 'ताज़ा करें' : lang === 'mr' ? 'रिफ्रेश करा' : 'REFRESH')}</span>
          </button>

          {/* Active Threats Counter */}
          <div className="px-3.5 py-2 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] font-mono text-xs text-[#272A27] flex items-center gap-2 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-hazard-400 animate-ping" />
            <span><strong className="text-[#272A27]">{totalActiveThreats}</strong> {lang === 'hi' ? 'सक्रिय खतरे' : lang === 'mr' ? 'सक्रिय धोके' : 'ACTIVE THREATS'}</span>
          </div>

          {/* Production At Risk Metric */}
          <div className="px-3.5 py-2 rounded-xl bg-hazard-950/40 border border-hazard-500/30 font-mono text-xs text-hazard-300 flex items-center gap-2 shadow-sm">
            <TrendingDown className="w-3.5 h-3.5 text-hazard-400" />
            <span><strong className="text-hazard-200">-{totalProductionAtRisk.toLocaleString()} TPD</strong> {lang === 'hi' ? 'जोखिम में उत्पादन' : lang === 'mr' ? 'जोखमीतील उत्पादन' : 'AT RISK'}</span>
          </div>
        </div>
      </div>

      {/* Filter Controls Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6 font-mono text-xs">

        {/* Mine Selector Filter */}
        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] flex items-center gap-3 shadow-inner hover:border-[#85877E] transition-colors">
          <MapPin className="w-4 h-4 text-manganese-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-[10px] text-[#85877E] uppercase font-bold tracking-wider">{lang === 'hi' ? 'खदान फ़िल्टर' : lang === 'mr' ? 'खाण फिल्टर' : 'MINE FILTER'}</div>
            <select
              value={selectedMineFilter}
              onChange={(e) => setSelectedMineFilter(e.target.value)}
              aria-label="Filter Alerts by MOIL Mine Asset"
              className="w-full bg-transparent text-[#272A27] font-bold outline-none text-xs cursor-pointer mt-0.5"
            >
              <option value="ALL" className="bg-[#F0EBE2] text-[#272A27]">{lang === 'hi' ? 'सभी 10 मॉयल खदानें' : lang === 'mr' ? 'सर्व 10 मॉयल खाणी' : 'ALL 10 MOIL MINES'}</option>
              {mines && mines.map(m => (
                <option key={m.id} value={m.id} className="bg-[#F0EBE2] text-[#272A27]">{m.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter */}
        <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] flex items-center gap-3 shadow-inner hover:border-[#85877E] transition-colors">
          <Activity className="w-4 h-4 text-sky-400 flex-shrink-0" />
          <div className="flex-1">
            <div className="text-[10px] text-[#85877E] uppercase font-bold tracking-wider">{lang === 'hi' ? 'स्थिति फ़िल्टर' : lang === 'mr' ? 'स्थिती फिल्टर' : 'STATUS FILTER'}</div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              aria-label="Filter Alerts by Operational Lifecycle Status"
              className="w-full bg-transparent text-[#272A27] font-bold outline-none text-xs cursor-pointer mt-0.5"
            >
              <option value="ALL" className="bg-[#F0EBE2] text-[#272A27]">{lang === 'hi' ? 'सभी स्थितियाँ' : lang === 'mr' ? 'सर्व स्थिती' : 'ALL STATUSES'}</option>
              <option value="ACTIVE" className="bg-[#F0EBE2] text-hazard-400 font-bold">{lang === 'hi' ? 'सक्रिय (ACTIVE)' : lang === 'mr' ? 'सक्रिय (ACTIVE)' : 'ACTIVE'}</option>
              <option value="ACKNOWLEDGED" className="bg-[#F0EBE2] text-amber-400 font-bold">{lang === 'hi' ? 'स्वीकृत (ACKNOWLEDGED)' : lang === 'mr' ? 'स्वीकृत (ACKNOWLEDGED)' : 'ACKNOWLEDGED'}</option>
              <option value="RESOLVED" className="bg-[#F0EBE2] text-emerald-400 font-bold">{lang === 'hi' ? 'हल किया गया (RESOLVED)' : lang === 'mr' ? 'सोडवले गेले (RESOLVED)' : 'RESOLVED'}</option>
              <option value="ESCALATED" className="bg-[#F0EBE2] text-purple-400 font-bold">{lang === 'hi' ? 'अग्रेषित (ESCALATED)' : lang === 'mr' ? 'पाठवले गेले (ESCALATED)' : 'ESCALATED'}</option>
            </select>
          </div>
        </div>

        {/* Keyword Search Input */}
        <div className="lg:col-span-2 p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] flex items-center gap-3 shadow-inner hover:border-[#85877E] transition-colors">
          <Search className="w-4 h-4 text-[#5F625C] flex-shrink-0" />
          <div className="flex-1">
            <div className="text-[10px] text-[#85877E] uppercase font-bold tracking-wider">{lang === 'hi' ? 'खोज' : lang === 'mr' ? 'शोध' : 'SEARCH THREAT INTELLIGENCE'}</div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={lang === 'hi' ? 'शीर्षक, सेंसर आईडी, उपकरण, खदान या विवरण खोजें...' : lang === 'mr' ? 'शीर्षक, सेन्सर आयडी, उपकरण किंवा तपशील शोधा...' : 'Search title, sensor ID, equipment, mine, or telemetry...'}
              className="w-full bg-transparent text-[#272A27] placeholder:text-[#85877E] outline-none text-xs mt-0.5"
            />
          </div>
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="text-[#85877E] hover:text-[#272A27] p-1">
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Horizontal Severity Spectrum Filter Bar */}
      <div className="p-1.5 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] mb-8 shadow-xl overflow-x-auto no-scrollbar">
        <div className="flex items-center justify-between min-w-[720px] gap-2">
          {severitySpectrum.map((s) => {
            const isSelected = selectedSeverity === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSelectedSeverity(s.id)}
                className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono font-bold transition-all flex items-center justify-center gap-2 ${
                  isSelected
                    ? `${s.bg || 'bg-[#C8BFAF] border-obsidian-600 text-[#272A27]'} border shadow-md`
                    : 'text-[#5F625C] hover:text-[#272A27] hover:bg-[#DDD4C5]/60'
                }`}
              >
                <span className={s.color}>{s.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  isSelected ? 'bg-[#F0EBE2] text-[#272A27] border border-[#C8BFAF]' : 'bg-[#F0EBE2] text-[#5F625C]'
                }`}>
                  {s.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono text-xs flex items-center gap-3 animate-fade-in shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
          <span className="font-bold">{actionSuccess}</span>
        </div>
      )}

      {/* Empty State */}
      {!loading && derivedThreats.length === 0 && (
        <div className="p-12 rounded-2xl bg-[#F0EBE2] border border-[#C8BFAF] text-center font-mono space-y-3">
          <ShieldCheck className="w-12 h-12 text-emerald-400 mx-auto opacity-80" />
          <h3 className="text-[#272A27] text-base font-bold">
            {lang === 'hi' ? 'कोई परिचालन खतरा नहीं मिला' : lang === 'mr' ? 'कोणताही ऑपरेशनल धोका आढळला नाही' : 'No Operational Threats Found'}
          </h3>
          <p className="text-[#5F625C] text-xs max-w-md mx-auto">
            {lang === 'hi' ? 'वर्तमान फ़िल्टर मानदंडों के लिए सभी प्रणालियाँ सामान्य हैं। (0 खतरे मेल खाते हैं)' :
             lang === 'mr' ? 'सध्याच्या फिल्टर निकषांसाठी सर्व यंत्रणा सामान्य आहेत. (0 धोके जुळतात)' :
             '0 operational threats match the selected mine, status, severity, or search query filter combination.'}
          </p>
          {(selectedMineFilter !== 'ALL' || selectedStatus !== 'ALL' || selectedSeverity !== 'ALL' || searchQuery) && (
            <button
              onClick={() => {
                setSelectedMineFilter('ALL');
                setSelectedStatus('ALL');
                setSelectedSeverity('ALL');
                setSearchQuery('');
              }}
              className="mt-3 px-4 py-2 rounded-xl bg-[#DDD4C5] hover:bg-obsidian-750 text-xs text-manganese-400 font-bold border border-[#C8BFAF] transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सभी फ़िल्टर रीसेट करें' : lang === 'mr' ? 'सर्व फिल्टर रीसेट करा' : 'Reset All Filters'}</span>
            </button>
          )}
        </div>
      )}

      {/* Visual Threat Objects List */}
      <div className="space-y-4 font-mono text-xs">
        {derivedThreats.map((risk) => {
          let borderGlow = 'border-[#C8BFAF] hover:border-telemetry-500/40 bg-[#F5F1E9]';
          let impactColor = 'text-telemetry-400';
          let severityPill = 'bg-telemetry-500/15 text-telemetry-400 border-telemetry-500/30';

          const levelUpper = (risk.severity || risk.level || 'NORMAL').toUpperCase();
          if (levelUpper === 'CRITICAL') {
            borderGlow = 'border-hazard-500/40 bg-gradient-to-r from-hazard-950/20 via-obsidian-900/90 to-obsidian-900/90 shadow-[0_0_25px_rgba(239,68,68,0.06)]';
            impactColor = 'text-hazard-400';
            severityPill = 'bg-hazard-500/20 text-hazard-300 border-hazard-500/40 font-black';
          } else if (levelUpper === 'HIGH' || levelUpper === 'ELEVATED') {
            borderGlow = 'border-manganese-500/40 bg-gradient-to-r from-manganese-950/20 via-obsidian-900/90 to-obsidian-900/90';
            impactColor = 'text-manganese-400';
            severityPill = 'bg-manganese-500/20 text-manganese-300 border-manganese-500/40 font-bold';
          } else if (levelUpper === 'WATCH' || levelUpper === 'MEDIUM') {
            borderGlow = 'border-radar-500/30 hover:border-radar-500/60 bg-[#F5F1E9]';
            impactColor = 'text-radar-400';
            severityPill = 'bg-radar-500/20 text-radar-300 border-radar-500/40';
          }

          const statusUpper = (risk.status || 'ACTIVE').toUpperCase();
          let statusBadge = 'bg-hazard-500/20 text-hazard-300 border-hazard-500/40 font-bold';
          if (statusUpper === 'ACKNOWLEDGED') statusBadge = 'bg-amber-500/20 text-amber-300 border-amber-500/40 font-bold';
          if (statusUpper === 'RESOLVED') statusBadge = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 font-bold';
          if (statusUpper === 'ESCALATED') statusBadge = 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold';

          return (
            <div
              key={risk.id}
              className={`p-6 rounded-2xl border ${borderGlow} backdrop-blur-xl transition-all duration-300 hover:scale-[1.002]`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">

                {/* Left 4 Cols: Mine, Equipment & Threat Metadata */}
                <div className="lg:col-span-4 space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-[#5F625C]">{risk.id}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${severityPill}`}>
                      {levelUpper}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] border ${statusBadge}`}>
                      {statusUpper}
                    </span>
                    <span className="text-[10px] text-[#85877E] flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {lastUpdatedTime}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#272A27] flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-manganese-400 flex-shrink-0" />
                    <span>{risk.mineName || risk.mine_name || risk.mine || 'Balaghat Mine'}</span>
                    <span className="text-xs text-[#85877E] font-normal">({risk.state || 'MOIL Central'})</span>
                  </h3>

                  <div className="text-[11px] text-[#5F625C] space-y-1">
                    <div>
                      <span>{lang === 'hi' ? 'श्रेणी:' : lang === 'mr' ? 'वर्गवारी:' : 'Category:'} <strong className="text-[#272A27]">{risk.category}</strong></span>
                      <span className="mx-2 text-[#85877E]">•</span>
                      <span>{lang === 'hi' ? 'सेंसर:' : lang === 'mr' ? 'सेन्सर:' : 'Sensor:'} <strong className="text-sky-300">{risk.sensorId || risk.sensor_id || 'SCADA'} ({risk.sensorType || risk.sensor_type || 'Telemetry'})</strong></span>
                    </div>
                    {(risk.affectedEquipment || risk.affected_equipment) && (
                      <div className="text-[#5F625C]">
                        <span>{lang === 'hi' ? 'उपकरण:' : lang === 'mr' ? 'उपकरण:' : 'Asset:'} <strong className="text-amber-300">{risk.affectedEquipment || risk.affected_equipment}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Middle 5 Cols: Primary Root Cause & Mitigating Action */}
                <div className="lg:col-span-5 space-y-2.5">
                  <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF]">
                    <div className="text-[10px] text-[#85877E] uppercase tracking-wider mb-0.5 font-bold flex items-center gap-1.5">
                      <Activity className="w-3 h-3 text-[#5F625C]" />
                      <span>{risk.title || (lang === 'hi' ? 'मूल कारण विसंगति' : lang === 'mr' ? 'मूळ कारण विसंगती' : 'Root Cause Anomaly')}</span>
                    </div>
                    <div className="text-[#272A27] font-sans text-xs leading-relaxed">
                      {risk.description || risk.primaryDriver}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-manganese-950/25 border border-manganese-500/20">
                    <div className="text-[10px] text-manganese-400 uppercase tracking-wider mb-0.5 font-bold flex items-center gap-1.5">
                      <Zap className="w-3 h-3 text-manganese-400" />
                      <span>{lang === 'hi' ? 'अनुशंसित नुस्खा कार्रवाई' : lang === 'mr' ? 'शिफारस केलेली कृती' : 'Recommended Prescriptive Action'}</span>
                    </div>
                    <div className="text-manganese-200 font-medium font-sans text-xs leading-relaxed">
                      {risk.recommendedAction || risk.recommended_action}
                    </div>
                  </div>
                </div>

                {/* Right 3 Cols: Impact Metrics & Interactive Workflow Actions */}
                <div className="lg:col-span-3 flex flex-col justify-between items-start lg:items-end gap-3 text-left lg:text-right border-t lg:border-t-0 lg:border-l border-[#C8BFAF] pt-4 lg:pt-0 lg:pl-6">
                  <div>
                    <div className="text-[10px] text-[#85877E] uppercase font-bold">{lang === 'hi' ? 'जोखिम स्कोर / वित्तीय जोखिम' : lang === 'mr' ? 'जोखीम स्कोअर / आर्थिक जोखीम' : 'Risk Score / Financial Exposure'}</div>
                    <div className={`text-base font-bold ${impactColor}`}>
                      {risk.riskScore || risk.risk_score ? `${risk.riskScore || risk.risk_score}% Threat Score` : risk.expectedImpact}
                    </div>
                    <div className="text-[11px] text-[#5F625C] mt-0.5">
                      <span>Impact: <strong className="text-hazard-300">-{risk.productionImpactTpd || risk.production_impact_tpd || 0} T/day</strong> ({risk.financialExposure || risk.financial_exposure || '₹0.50 Cr'})</span>
                    </div>
                  </div>

                  {/* Operational Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto">
                    {statusUpper === 'ACTIVE' && (
                      <button
                        onClick={() => handleAcknowledge(risk.id)}
                        disabled={actionLoading}
                        className="flex-1 lg:flex-none px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'स्वीकारें' : lang === 'mr' ? 'स्वीकारा' : 'Acknowledge'}</span>
                      </button>
                    )}

                    {statusUpper !== 'RESOLVED' && (
                      <button
                        onClick={() => handleResolve(risk.id)}
                        disabled={actionLoading}
                        className="flex-1 lg:flex-none px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'हल करें' : lang === 'mr' ? 'सोडवा' : 'Resolve'}</span>
                      </button>
                    )}

                    {statusUpper !== 'ESCALATED' && statusUpper !== 'RESOLVED' && (
                      <button
                        onClick={() => handleEscalate(risk.id)}
                        disabled={actionLoading}
                        className="flex-1 lg:flex-none px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{lang === 'hi' ? 'अग्रेषित करें' : lang === 'mr' ? 'पाठवा' : 'Escalate'}</span>
                      </button>
                    )}

                    <Link
                      to="/protocol"
                      className="px-3 py-1.5 rounded-lg bg-[#C8BFAF] hover:bg-obsidian-750 text-manganese-400 hover:text-manganese-300 font-bold border border-[#C8BFAF] transition-colors text-[11px] flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>{lang === 'hi' ? 'प्रोटोकॉल' : lang === 'mr' ? 'प्रोटोकॉल' : 'Protocol'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>

              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
};

