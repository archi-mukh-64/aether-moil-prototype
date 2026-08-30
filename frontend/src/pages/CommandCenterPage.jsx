import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { LeftKpiRail } from '../components/workspace/LeftKpiRail.jsx';
import { DigitalTwinContainer } from '../components/GeospatialTwin/DigitalTwinContainer.jsx';
import { RightTelemetryRail } from '../components/workspace/RightTelemetryRail.jsx';
import { HourlyProductionChart } from '../components/workspace/HourlyProductionChart.jsx';
import { CommandEventStream } from '../components/workspace/CommandEventStream.jsx';
import { ScenarioLab } from '../components/scenario/ScenarioLab.jsx';
import { BeforeAfterDelta } from '../components/BeforeAfterDelta.jsx';
import { AetherSectionHeader, AetherStatusBadge } from '../components/design-system/index.js';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { Radio, Activity, Cpu } from 'lucide-react';

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
    <div className="space-y-6 font-sans">
      
      {/* 1. TOP SINGLE-MINE COCKPIT HEADER */}
      <AetherSectionHeader
        title={`${currentMine.name} — Real-Time Command Cockpit`}
        subtitle="High-frequency pithead SCADA telemetry, multi-physics digital twin simulation, and hourly extraction tracking for active shift operations."
        badge={`${currentMine.district.toUpperCase()}, ${currentMine.state.toUpperCase()}`}
        accent="#0284C7"
        icon={Radio}
        actions={
          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="px-3 py-1.5 rounded-xl bg-cyan-50 border border-cyan-300 text-cyan-800 font-bold flex items-center gap-1.5 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-cyan-600 animate-pulse" />
              <span>SCADA STREAM: 100 Hz LIVE</span>
            </span>
          </div>
        }
      />

      {/* 2. SCENARIO STRESS DIFF BANNER (Active only during stress tests) */}
      {activeScenario && <BeforeAfterDelta />}

      {/* 3. PRIMARY 3-COLUMN INDUSTRIAL COCKPIT WORKSPACE */}
      <div className="flex flex-col lg:flex-row gap-5 items-start w-full font-mono">
        
        {/* LEFT COLUMN: Production Target Gauge, Key Performance & Risk Rail */}
        <div className="w-full lg:w-[320px] shrink-0">
          <LeftKpiRail />
        </div>

        {/* CENTER COLUMN: Geospatial Digital Twin (2D / 3D) + Hourly Shift Chart */}
        <div className="flex-1 min-w-0 w-full flex flex-col gap-5">
          <DigitalTwinContainer />
          <HourlyProductionChart />
        </div>

        {/* RIGHT COLUMN: Live SCADA Telemetry & Sparklines Rail */}
        <div className="w-full lg:w-[300px] shrink-0">
          <RightTelemetryRail />
        </div>

      </div>

      {/* 4. REAL-TIME INCIDENT EVENT STREAM & OPERATIONAL TIMELINE */}
      <div className="pt-3 border-t border-[#E2E8F0]">
        <CommandEventStream />
      </div>

      {/* 5. OPERATIONAL SCENARIO STRESS LAB DRAWER */}
      <div className="pt-3 border-t border-[#E2E8F0]">
        <ScenarioLab />
      </div>

    </div>
  );
};
