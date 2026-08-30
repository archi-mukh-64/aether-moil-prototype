import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LeftKpiRail } from '../components/workspace/LeftKpiRail.jsx';
import { DigitalTwinContainer } from '../components/GeospatialTwin/DigitalTwinContainer.jsx';
import { RightTelemetryRail } from '../components/workspace/RightTelemetryRail.jsx';
import { HourlyProductionChart } from '../components/workspace/HourlyProductionChart.jsx';
import { CommandEventStream } from '../components/workspace/CommandEventStream.jsx';
import { ScenarioLab } from '../components/scenario/ScenarioLab.jsx';
import { BeforeAfterDelta } from '../components/BeforeAfterDelta.jsx';
import { SectionHeader } from '../components/design/SectionHeader.jsx';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { Radio, Activity } from 'lucide-react';

export const CommandCenterPage = () => {
  return (
    <ErrorBoundary title="COMMAND CENTER COCKPIT RECOVERY">
      <CommandCenterContent />
    </ErrorBoundary>
  );
};

const CommandCenterContent = () => {
  const { activeMine, activeScenario } = useApp();

  const currentMine = activeMine || {
    id: 'balaghat',
    name: 'Balaghat Mine',
    district: 'Balaghat',
    state: 'Madhya Pradesh',
    productionTarget: 6200,
    coordinatesDMS: "21°51'N 80°14'E"
  };

  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto space-y-6 font-sans">
      
      {/* 1. TOP SINGLE-MINE COCKPIT HEADER */}
      <SectionHeader
        category={`${currentMine.district.toUpperCase()}, ${currentMine.state.toUpperCase()} • ${currentMine.coordinatesDMS}`}
        categoryColor="#FFB000"
        badge="ACTIVE OPERATIONAL COCKPIT"
        badgeColor="#21D4C5"
        title={`${currentMine.name} — Real-Time Command Center`}
        subtitle="High-frequency pithead SCADA telemetry, multi-physics digital twin simulation, and hourly extraction tracking for active shift operations."
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-[#151B23] border border-cyan-500/30 text-cyan-400 font-bold flex items-center gap-1.5 shadow-glow-cyan">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span>SCADA STREAM: 100 Hz LIVE</span>
            </span>
          </div>
        }
      />

      {/* 2. SCENARIO STRESS DIFF BANNER (Active only during stress tests) */}
      {activeScenario && <BeforeAfterDelta />}

      {/* 3. PRIMARY 3-COLUMN INDUSTRIAL COCKPIT WORKSPACE */}
      <div className="flex flex-col lg:flex-row gap-4 items-start w-full font-mono">
        
        {/* LEFT COLUMN: Production Target Gauge, Key Performance & Risk Rail (approx 290px) */}
        <LeftKpiRail />

        {/* CENTER COLUMN: Geospatial Digital Twin (2D / 3D) + Hourly Shift Chart (Flexible 1fr) */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-4">
          <DigitalTwinContainer />
          <HourlyProductionChart />
        </div>

        {/* RIGHT COLUMN: Live SCADA Telemetry & Sparklines Rail (approx 270px) */}
        <RightTelemetryRail />

      </div>

      {/* 4. REAL-TIME INCIDENT EVENT STREAM & OPERATIONAL TIMELINE */}
      <div className="pt-2 border-t border-[#222D3A]">
        <CommandEventStream />
      </div>

      {/* 5. OPERATIONAL SCENARIO STRESS LAB DRAWER */}
      <div className="pt-2 border-t border-[#222D3A]">
        <ScenarioLab />
      </div>

    </div>
  );
};
