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
    <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] font-mono text-xs space-y-3 select-none shadow-xs">
      <div className="flex items-center justify-between pb-2 border-b border-[#DDD4C5]">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-[#C46A32]" />
          <span className="text-[10px] text-[#272A27] font-bold uppercase tracking-wider">
            {ws.eventStreamTitle || 'REAL-TIME OPERATIONAL EVENT STREAM & INCIDENT AUDIT'}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-[#2D7A4D] font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A4D] animate-pulse" />
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
                  ? 'bg-[#FBF0EE] border-[#EAA29A] text-[#8F2D24]'
                  : isHigh
                  ? 'bg-[#FDF6E9] border-[#F2C97D] text-[#8F6518]'
                  : isWarning
                  ? 'bg-[#FDF6E9] border-[#F2C97D] text-[#8F6518]'
                  : isResolved
                  ? 'bg-[#EEF5F0] border-[#9DC4A5] text-[#355239]'
                  : 'bg-[#F5F1E9] border-[#DDD4C5] text-[#272A27]'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-[#85877E] text-[10px] font-mono">{ev.time}</span>
                <span className={`px-1.5 py-0.2 rounded text-[9px] font-bold ${
                  isCritical ? 'bg-[#C84B3F]/20 text-[#8F2D24]' :
                  isHigh ? 'bg-[#C46A32]/20 text-[#8F6518]' :
                  isResolved ? 'bg-[#2D7A4D]/20 text-[#355239]' : 'bg-[#DDD4C5] text-[#5F625C]'
                }`}>
                  {ev.type}
                </span>
                <span className="truncate font-sans font-medium">{ev.message}</span>
              </div>
              <span className="text-[9px] text-[#85877E] uppercase font-mono hidden sm:inline flex-shrink-0">
                {ev.severity}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
