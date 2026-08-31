import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Activity,
  Truck,
  Droplet,
  Cpu,
  Fuel,
  Sparkles,
  ShieldCheck,
  HeartHandshake
} from 'lucide-react';

export const RightTelemetryRail = () => {
  const { activeMine, activeScenario, apiConnected, t, lang } = useApp();
  const [lastUpdated, setLastUpdated] = useState('10:32:15 IST');
  const ws = t?.workspace || {};
  const comm = t?.common || {};

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setLastUpdated(`${now.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', timeZone: 'Asia/Kolkata' })} IST`);
    };
    updateTime();
    const interval = setInterval(updateTime, 2000);
    return () => clearInterval(interval);
  }, []);

  const currentMine = activeMine || {
    name: 'Balaghat Mine',
    shortName: 'Balaghat',
    productionTarget: 6200,
    oreGrade: '44.2% Mn',
    fleetCount: 34
  };

  const isScenario = Boolean(activeScenario);

  // Exact 8 SCADA instrumentation rows matching reference image
  const telemetryRows = [
    {
      id: 'extraction',
      icon: Activity,
      iconColor: 'text-[#1D558B] bg-[#E1EBF5]',
      label: ws.extractionRate || 'Extraction Rate',
      val: isScenario && activeScenario.scenarioId === 'MONSOON' ? '3,180' : '4,250',
      unit: 'T/day',
      sparkColor: '#2D7A4D',
      sparkline: [35, 38, 40, 42, 44, 45, 42, 45]
    },
    {
      id: 'haulage',
      icon: Truck,
      iconColor: 'text-[#8F4418] bg-[#F8EFEA]',
      label: ws.haulageEfficiency || 'Haulage Efficiency',
      val: isScenario ? '61.2' : '78.4',
      unit: '%',
      sparkColor: '#2D7A4D',
      sparkline: [72, 74, 75, 76, 78, 77, 78, 78]
    },
    {
      id: 'sump',
      icon: Droplet,
      iconColor: 'text-[#1D4241] bg-[#E1EFEF]',
      label: ws.sumpInflow || 'Sump Inflow',
      val: isScenario && activeScenario.scenarioId === 'MONSOON' ? '2,840' : '1,280',
      unit: 'm³/h',
      sparkColor: isScenario && activeScenario.scenarioId === 'MONSOON' ? '#C84B3F' : '#2D7A4D',
      sparkline: isScenario ? [12, 25, 45, 70, 85, 95] : [14, 15, 14, 13, 14, 13]
    },
    {
      id: 'fleet',
      icon: Cpu,
      iconColor: 'text-[#8F2D24] bg-[#FBF0EE]',
      label: ws.activeEquipment || 'Active Equipment',
      val: isScenario ? '18 / 34' : '23 / 34',
      unit: 'Units',
      sparkColor: '#C84B3F',
      sparkline: [26, 25, 24, 23, 23, 22, 23, 23]
    },
    {
      id: 'fuel',
      icon: Fuel,
      iconColor: 'text-[#8F4418] bg-[#F8EFEA]',
      label: ws.fuelConsumption || 'Fuel Consumption',
      val: '12.6',
      unit: 'KL/hr',
      sparkColor: '#2D7A4D',
      sparkline: [12, 13, 12, 12, 13, 12, 13, 12]
    },
    {
      id: 'grade',
      icon: Sparkles,
      iconColor: 'text-[#1D558B] bg-[#E1EBF5]',
      label: ws.avgGrade || 'Avg. Grade',
      val: isScenario && activeScenario.scenarioId === 'GRADE' ? '34.8' : `${parseFloat(currentMine.oreGrade) || 44.2}`,
      unit: '% Mn',
      sparkColor: '#1D558B',
      sparkline: [42, 43, 44, 44, 43, 44, 44, 44]
    },
    {
      id: 'env',
      icon: ShieldCheck,
      iconColor: 'text-[#2D7A4D] bg-[#EEF5F0]',
      label: ws.envIndex || 'Environment Index',
      val: ws.envGood || 'Good',
      unit: 'AQI 42',
      isTextVal: true,
      valColor: 'text-[#2D7A4D]'
    },
    {
      id: 'health',
      icon: HeartHandshake,
      iconColor: 'text-[#2D7A4D] bg-[#EEF5F0]',
      label: ws.systemHealth || 'System Health',
      val: ws.healthExcellent || 'Excellent',
      unit: '99.2%',
      isTextVal: true,
      valColor: 'text-[#2D7A4D]',
      sparkColor: '#2D7A4D',
      sparkline: [98, 99, 99, 99, 99, 99, 99, 99]
    }
  ];

  return (
    <aside className="w-full flex-shrink-0 flex flex-col gap-2.5 font-sans select-none">

      {/* Title */}
      <div className="p-3 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] flex items-center justify-between shadow-xs">
        <span className="text-[10px] text-[#5F625C] font-mono uppercase font-bold tracking-wider">
          {ws.liveTelemetry || 'LIVE TELEMETRY'}
        </span>
        <span className="w-2 h-2 rounded-full bg-[#2D7A4D] animate-pulse" />
      </div>

      {/* Instrumentation Rows */}
      <div className="space-y-1.5 font-mono text-xs">
        {telemetryRows.map((row) => {
          const Icon = row.icon;
          return (
            <div
              key={row.id}
              className="p-2.5 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] hover:border-[#85877E] transition-all flex items-center justify-between gap-2 shadow-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${row.iconColor}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] text-[#5F625C] font-sans truncate leading-tight">
                    {row.label}
                  </div>
                  <div className="flex items-baseline gap-1 mt-0.5">
                    <span className={`font-mono text-base font-extrabold ${row.valColor || 'text-[#272A27]'}`}>
                      {row.val}
                    </span>
                    <span className="text-[10px] text-[#85877E] font-mono">
                      {row.unit}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sparkline Wave */}
              {row.sparkline && (
                <div className="flex items-center justify-end w-14 flex-shrink-0">
                  <svg className="w-14 h-5 overflow-visible" viewBox="0 0 50 16">
                    <polyline
                      fill="none"
                      stroke={row.sparkColor}
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={row.sparkline.map((v, i) => `${(i / (row.sparkline.length - 1)) * 50},${16 - (v / 100) * 14}`).join(' ')}
                    />
                  </svg>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Timestamp */}
      <div className="p-2 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] flex items-center justify-between text-[10px] font-mono text-[#85877E]">
        <span>{ws.lastUpdated || 'Last Updated'}: {lastUpdated}</span>
        <span className="text-[#2D7A4D] font-bold flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2D7A4D]" />
          <span>{ws.live || 'Live'}</span>
        </span>
      </div>

    </aside>
  );
};
