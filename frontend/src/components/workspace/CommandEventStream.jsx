import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Terminal, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  Zap, 
  Radio,
  Clock
} from 'lucide-react';

export const CommandEventStream = () => {
  const { activeMine, activeScenario, decisionStage, t, lang } = useApp();
  const [events, setEvents] = useState([]);
  const ws = t?.workspace || {};
  const comm = t?.common || {};

  useEffect(() => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour12: false });
    const mineName = activeMine?.shortName || 'Balaghat';

    const baseEvents = [
      { id: 'EV-101', time: '07:00:00', type: 'SYS', message: `${mineName} ${ws.shiftCommenced || 'Shift A Commenced'} (${ws.dailyTarget || 'Target'}: ${activeMine?.productionTarget || 6200} TPD)`, severity: 'NORMAL' },
      { id: 'EV-102', time: '08:15:22', type: 'SCADA', message: `${ws.telemetryNominal || 'Telemetry Ingestion Nominal'}: ${activeMine?.sensorCount || 38} ${ws.sensorsStreaming || 'Sensors Streaming'} (200 OK)`, severity: 'NORMAL' },
      { id: 'EV-103', time: '09:30:14', type: 'ML', message: `SHORTFALL-GBM ${ws.inferenceActive || 'Model Inference Active'} (${ws.confidence || 'Confidence'}: 94.8%)`, severity: 'NORMAL' }
    ];

    if (activeScenario) {
      const scenTime = timeStr;
      const stressEvents = [
        { id: `EV-${Date.now()}-1`, time: scenTime, type: 'ALERT', message: `${ws.anomalyDetected || 'ANOMALY DETECTED'}: ${activeScenario.detectionHeadline || 'Operational Stress Inundation'}`, severity: 'CRITICAL' },
        { id: `EV-${Date.now()}-2`, time: scenTime, type: 'MODEL', message: `${ws.predictedShortfall || 'Predicted Shortfall'}: ${activeScenario.prediction?.productionAtRiskFormatted} (${activeScenario.prediction?.shortfallProbability} ${ws.probability || 'Probability'})`, severity: 'HIGH' },
        { id: `EV-${Date.now()}-3`, time: scenTime, type: 'PRESCRIPT', message: `${ws.countermeasureGenerated || 'AI Countermeasure Generated'}: ${activeScenario.recommendation?.title}`, severity: 'WARNING' }
      ];

      if (decisionStage === 'APPROVED') {
        stressEvents.push({
          id: `EV-${Date.now()}-4`,
          time: scenTime,
          type: 'DISPATCH',
          message: ws.operatorAuthGranted || 'OPERATOR AUTHORIZATION GRANTED: Mitigation Protocol Dispatched to Field Controllers',
          severity: 'RESOLVED'
        });
      }

      setEvents([...stressEvents, ...baseEvents]);
    } else {
      setEvents(baseEvents);
    }
  }, [activeScenario, activeMine, decisionStage, ws]);

  return (
    <div className="p-4 rounded-xl bg-[#0c1017] border border-[#1a2333] font-mono text-xs space-y-3 select-none">
      <div className="flex items-center justify-between pb-2 border-b border-[#141c2b]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-[10px] text-zinc-300 font-bold uppercase tracking-wider">
            {ws.eventStreamTitle || 'REAL-TIME OPERATIONAL EVENT STREAM & INCIDENT AUDIT'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-teal-400 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-400 animate-pulse" />
          <span>{ws.liveAuditFeed || 'LIVE AUDIT FEED'}</span>
        </div>
      </div>

      <div className="space-y-1.5 max-h-40 overflow-y-auto no-scrollbar">
        {events.map((ev) => {
          const isCritical = ev.severity === 'CRITICAL';
          const isHigh = ev.severity === 'HIGH';
          const isWarning = ev.severity === 'WARNING';
          const isResolved = ev.severity === 'RESOLVED';

          return (
            <div
              key={ev.id}
              className={`px-3 py-2 rounded-lg flex items-center justify-between gap-3 text-[11px] border transition-all ${
                isCritical
                  ? 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  : isHigh
                  ? 'bg-amber-950/25 border-amber-500/40 text-amber-200'
                  : isWarning
                  ? 'bg-amber-950/20 border-amber-500/30 text-zinc-200'
                  : isResolved
                  ? 'bg-teal-950/30 border-teal-500/40 text-teal-200'
                  : 'bg-[#080b10] border-[#141b27] text-zinc-300'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-zinc-500 text-[10px]">{ev.time}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                  isCritical ? 'bg-rose-500/20 text-rose-300' :
                  isHigh ? 'bg-amber-500/20 text-amber-300' :
                  isResolved ? 'bg-teal-500/20 text-teal-300' : 'bg-zinc-800 text-zinc-400'
                }`}>
                  {ev.type}
                </span>
                <span className="truncate">{ev.message}</span>
              </div>

              <span className="text-[9px] text-zinc-500 uppercase flex-shrink-0">
                {ev.id}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
