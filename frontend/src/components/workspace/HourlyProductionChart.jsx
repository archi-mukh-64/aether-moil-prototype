import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

export const HourlyProductionChart = () => {
  const { activeMine, activeScenario, t, lang } = useApp();
  const ws = t?.workspace || {};

  const currentMine = activeMine || {
    name: 'Balaghat Mine',
    productionTarget: 6200
  };

  const dailyTarget = currentMine.productionTarget || 6200;
  const isScenario = Boolean(activeScenario);

  // Discrete 24-hour cycle chart data matching reference image
  const chartData = useMemo(() => {
    const hours = [
      '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
      '13:00', '14:00', '15:00', '16:00', '19:00', '19:00',
      '20:00', '21:00', '22:00', '23:00', '00:00', '01:00',
      '02:00', '03:00', '04:00', '05:00'
    ];

    const baseTarget = Math.round(dailyTarget / 14);

    return hours.map((hour, idx) => {
      let targetVal = idx < 6 ? baseTarget * 1.6 : (idx < 12 ? baseTarget * 1.1 : baseTarget * 0.7);
      let actualVal = 0;

      if (idx === 1 || idx === 2) {
        actualVal = baseTarget * 0.9;
      } else if (idx >= 6 && idx <= 12) {
        actualVal = isScenario ? baseTarget * 0.65 : baseTarget * 1.4;
      } else if (idx === 13) {
        actualVal = baseTarget * 0.8;
      }

      return {
        hour,
        Target: Math.round(targetVal),
        Actual: Math.round(actualVal)
      };
    });
  }, [dailyTarget, isScenario]);

  return (
    <div className="p-3.5 sm:p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] space-y-2.5 font-mono text-xs shadow-xs select-none">

      {/* Title & Legend Header */}
      <div className="flex items-center justify-between">
        <div className="text-[11px] text-[#272A27] uppercase font-bold tracking-wider">
          {ws.hourlyTitle || 'HOURLY EXTRACTION vs TARGET'}
        </div>

        <div className="flex items-center gap-4 text-[10px]">
          <div className="flex items-center gap-1.5 text-[#5F625C]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#1D558B]" />
            <span>{ws.targetLegend || 'Target'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-[#5F625C]">
            <span className="w-2.5 h-2.5 rounded-sm bg-[#C46A32]" />
            <span>{ws.actualLegend || 'Actual'}</span>
          </div>
        </div>
      </div>

      {/* Bar Chart Container */}
      <div className="h-32 sm:h-36 w-full pt-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#DDD4C5" vertical={false} />
            <XAxis dataKey="hour" stroke="#85877E" fontSize={9} tickLine={false} />
            <YAxis stroke="#85877E" fontSize={9} tickLine={false} tickFormatter={(v) => v >= 1000 ? `${Math.round(v / 1000)}K` : `${v}`} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#F5F1E9',
                borderColor: '#C8BFAF',
                borderRadius: '8px',
                color: '#272A27',
                fontSize: '11px',
                fontFamily: 'JetBrains Mono'
              }}
            />
            <Bar dataKey="Target" fill="#1D558B" radius={[2, 2, 0, 0]} opacity={0.85} />
            <Bar dataKey="Actual" fill="#C46A32" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  );
};
