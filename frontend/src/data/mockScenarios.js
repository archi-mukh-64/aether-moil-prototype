/**
 * MOIL Operational Scenario Lab & Decision Intelligence Dataset
 * Deterministic, offline-ready, reproducible datasets for SIH demonstrations.
 * All numbers are clearly marked as SYNTHETIC DEMONSTRATION DATA.
 */

export const SCENARIO_MINES = [
  { id: 'balaghat', name: 'Balaghat Deep Shaft', shortName: 'Balaghat', state: 'Madhya Pradesh', grade: '44.2% Mn', baseOutput: 6200, depth: '-185m Level' },
  { id: 'ukwa', name: 'Ukwa Low-Phosphorus', shortName: 'Ukwa', state: 'Madhya Pradesh', grade: '42.0% Mn', baseOutput: 2200, depth: '-90m Adit Level' },
  { id: 'tirodi', name: 'Tirodi Manganese Lease', shortName: 'Tirodi', state: 'Madhya Pradesh', grade: '36.2% Mn', baseOutput: 3200, depth: 'Surface Pit RL +310m' },
  { id: 'sitapatore', name: 'Sitapatore Deposit', shortName: 'Sitapatore', state: 'Madhya Pradesh', grade: '37.4% Mn', baseOutput: 1600, depth: '-55m Pit Floor' },
  { id: 'chikla', name: 'Chikla High-Grade', shortName: 'Chikla', state: 'Maharashtra', grade: '41.5% Mn', baseOutput: 3800, depth: '-140m Level' },
  { id: 'dongri-buzurg', name: 'Dongri Buzurg Opencast', shortName: 'Dongri Buzurg', state: 'Maharashtra', grade: '48.5% MnO₂', baseOutput: 4800, depth: '+340m RL Benches' },
  { id: 'beldongri', name: 'Beldongri Mine', shortName: 'Beldongri', state: 'Maharashtra', grade: '39.2% Mn', baseOutput: 1800, depth: '-40m Pit Sump' },
  { id: 'gumgaon', name: 'Gumgaon Incline Mine', shortName: 'Gumgaon', state: 'Maharashtra', grade: '38.6% Mn', baseOutput: 2800, depth: '-120m Incline' },
  { id: 'kandri', name: 'Kandri Hill Mine', shortName: 'Kandri', state: 'Maharashtra', grade: '43.0% Mn', baseOutput: 3100, depth: '-85m Shaft Level' },
  { id: 'munsar', name: 'Munsar Mine', shortName: 'Munsar', state: 'Maharashtra', grade: '40.8% Mn', baseOutput: 3400, depth: '-110m Level' }
];

export const SCENARIO_TYPES = [
  {
    id: 'MONSOON',
    title: 'Heavy Monsoon Cloudburst',
    code: 'SCENARIO-01 // HYDROGEOLOGICAL',
    category: 'Hydrogeological',
    icon: 'CloudRain',
    shortDesc: 'Precipitation surge causing deep sump inundation, pump head overload, and haul-road slurry resistance.',
    defaultSeverity: 'CRITICAL',
    defaultHorizon: '24 HOURS'
  },
  {
    id: 'CRUSHER',
    title: 'Crusher Bearing Degradation',
    code: 'SCENARIO-02 // EQUIPMENT HARMONICS',
    category: 'Equipment',
    icon: 'Cpu',
    shortDesc: 'Primary jaw crusher 42 Hz vibration peak and bearing thermal spike indicating imminent mechanical seizure.',
    defaultSeverity: 'HIGH',
    defaultHorizon: '6 HOURS'
  },
  {
    id: 'FLEET',
    title: 'Haul Truck Fleet Failure',
    code: 'SCENARIO-03 // FLEET & LOGISTICS',
    category: 'Logistics',
    icon: 'Truck',
    shortDesc: 'Simultaneous unscheduled breakdown of 3 heavy dumpers causing shovel loading queue and crusher starvation.',
    defaultSeverity: 'MEDIUM',
    defaultHorizon: '24 HOURS'
  },
  {
    id: 'GRADE',
    title: 'Ore Grade Variation & Penalty',
    code: 'SCENARIO-04 // METALLURGICAL BLEND',
    category: 'Metallurgical',
    icon: 'Layers',
    shortDesc: 'Run-of-mine ore assay dropping to 34.8% Mn due to quartzite intrusion, risking steel plant penalty deductions.',
    defaultSeverity: 'MEDIUM',
    defaultHorizon: '24 HOURS'
  },
  {
    id: 'DISCOVERY',
    title: 'High-Grade Exploration Signal',
    code: 'SCENARIO-05 // GEOSPATIAL RESERVE',
    category: 'Exploration',
    icon: 'Sparkles',
    shortDesc: 'Sentinel-2 SWIR band reflectance anomaly detecting 3.4km strike extension of 46.4% Mn reef at -220m horizon.',
    defaultSeverity: 'LOW',
    defaultHorizon: '7 DAYS'
  },
  {
    id: 'MULTI_RISK',
    title: 'Multi-Risk Compound Crisis',
    code: 'SCENARIO-06 // COMPOUND STRESS',
    category: 'Compound',
    icon: 'AlertTriangle',
    shortDesc: 'Simultaneous cloudburst inundation (+92mm) and primary crusher harmonic flaw causing dual-vector failure.',
    defaultSeverity: 'CRITICAL',
    defaultHorizon: '24 HOURS'
  }
];

export const MOCK_SCENARIOS = [
  {
    id: 'MONSOON',
    title: 'Heavy Monsoon Cloudburst & Sump Inundation',
    code: 'SCENARIO-01 // HYDROGEOLOGICAL',
    category: 'Hydrogeological',
    icon: 'CloudRain',
    defaultMine: 'balaghat',
    timeHorizon: '24 HOURS',

    // Baseline state before shock
    beforeState: {
      dailyProduction: 6200,
      predictedYield: 4850,
      shortfallRisk: 'High (84.2%)',
      fleetAvailability: '62.0%',
      waterIngressRate: '38.6 m³/h',
      averageGrade: '44.2% Mn',
      aiTrustScore: '94.8%',
      unmitigatedLossPct: '-21.8%',
      unmitigatedLossTonnes: 1350
    },

    detection: {
      headline: 'Extreme Sump Inundation & Haul Road Slurry Risk Detected',
      timeToShortfall: '18 Hours',
      threatVector: 'Sub-surface deep sump flooding restricting skip cage hoisting at -185m combined with slippery haul ramps.',
      confidence: '94.8%'
    },

    profiles: {
      LOW: { lossTonnes: 420, lossPct: '6.8%', riskPct: '42.0%', conf: '89.4%', rain: '32 mm', inflow: '18 m³/h' },
      MEDIUM: { lossTonnes: 850, lossPct: '13.7%', riskPct: '68.5%', conf: '92.1%', rain: '58 mm', inflow: '26 m³/h' },
      HIGH: { lossTonnes: 1350, lossPct: '21.8%', riskPct: '84.2%', conf: '94.8%', rain: '88 mm', inflow: '38 m³/h' },
      CRITICAL: { lossTonnes: 1850, lossPct: '29.8%', riskPct: '93.5%', conf: '96.2%', rain: '114 mm', inflow: '46 m³/h' }
    },

    // Step 1: Signals Detected
    signals: [
      { name: 'Surface Telemetry Pluviometer', value: '88.4 mm / 24h', normal: '<15 mm / 24h', magnitude: '+489% Influx', severity: 'CRITICAL', freshness: '0.8s ago', timestamp: '22:58:12 IST' },
      { name: 'Deep Sump Piezometer (-185m Level)', value: '38.6 m³/h Inflow', normal: '<12 m³/h', magnitude: '+221% Ingress', severity: 'CRITICAL', freshness: '1.2s ago', timestamp: '22:58:11 IST' },
      { name: 'Bench 3 South Ramp Extensometer', value: '1.4 mm Displacement', normal: '<0.5 mm', magnitude: '+180% Shear', severity: 'WARNING', freshness: '2.0s ago', timestamp: '22:58:09 IST' },
      { name: 'Skip Winder Hoist Motor Load', value: '92% Peak Current', normal: '<75%', magnitude: '+22% Overload', severity: 'WARNING', freshness: '1.5s ago', timestamp: '22:58:10 IST' }
    ],

    // Step 2: Prediction Metrics
    prediction: {
      productionAtRisk: 1350,
      productionAtRiskFormatted: '1,350 T',
      shortfallProbability: '84.2%',
      horizon: '24 HOURS',
      expectedImpact: '-21.8% Daily Yield Deficit',
      modelConfidence: '94.8%',
      unmitigatedYield: 4850,
      targetQuota: 6200
    },

    // Step 3: Evidence / Ranked Contributing Factors
    evidenceFactors: [
      { rank: '01', factor: 'Localized 24h Rainfall Surge (>85mm)', feature: 'Localized 24h Rainfall Surge (>85mm)', impactPct: 41.2, direction: 'risk_elevating', category: 'Environmental', detail: 'Pluviometer recorded 88.4mm rainfall, saturating surface catchment runoff.' },
      { rank: '02', factor: 'Holmes Sump Inflow Velocity (38.6 m³/h)', feature: 'Holmes Sump Inflow Velocity (38.6 m³/h)', impactPct: 26.8, direction: 'risk_elevating', category: 'Hydrogeology', detail: 'Inundation rate exceeds primary pump baseline throughput by 221%.' },
      { rank: '03', factor: 'Bench 3 Haul Road Rolling Resistance', feature: 'Bench 3 Haul Road Rolling Resistance', impactPct: 18.4, direction: 'risk_elevating', category: 'Haulage', detail: 'Slurry formation on clayey dolomite overburden increases truck transit times by 42%.' },
      { rank: '04', factor: 'High-Grade Surface Stockpile Balance', feature: 'High-Grade Surface Stockpile Balance', impactPct: 12.5, direction: 'risk_mitigating', category: 'Operational Buffer', detail: '420T high-grade (44.2% Mn) surface stockpile is available to buffer deficit.' },
      { rank: '05', factor: 'Auxiliary Submersible Pump Standby', feature: 'Auxiliary Submersible Pump Standby', impactPct: 8.1, direction: 'risk_mitigating', category: 'Infrastructure', detail: '150 HP auxiliary submersible pump AP-04 is on standby at -185m sump.' }
    ],

    // Step 4: AI Recommendation
    recommendation: {
      actionId: 'PROTO-AP-04',
      title: 'Monsoon Sump Dewatering & Haulage Redirection Protocol',
      whatToDo: '1. Engage auxiliary submersible pump AP-04 (150 HP) to boost drainage capacity by +35 m³/h.\n2. Reroute 4 dumpers from Bench 3 South ramp to Western high-ground hauling corridor.\n3. Accelerate Bharveli surface incline skip hoisting to 155 TPH.\n4. Draw 180T from high-grade 44% Mn stockpile buffer.',
      why: 'Simultaneous sub-surface pump boost and ramp bypass restores 85% of lost haulage velocity while preventing sump overflow.',
      expectedImpact: '+1,150 T/day Protected Production (Recovers 85.2% of Loss)',
      protectedYield: '+1,150 T/day',
      confidence: '94.8%',
      timeToIntervene: '< 45 Minutes (Shift A Handover)',
      status: 'AWAITING HUMAN APPROVAL'
    },

    // Step 5: Optimization Options
    optimizationOptions: [
      {
        id: 'OPT-A',
        title: 'OPTION A: No Intervention (Status Quo)',
        description: 'Maintain normal single pump and default haulage route.',
        expectedLossPct: '-21.8%',
        expectedLossTonnes: 1350,
        protectedTonnes: 0,
        expectedDowntime: '14.2 Hours',
        operationalImpact: 'Severe pit flooding, skip cage hoisting halts at -185m.',
        confidence: '96.0%',
        costEstimate: '₹0 Initial (₹8.5L Loss)',
        roi: '0.0x',
        isAiRecommended: false
      },
      {
        id: 'OPT-B',
        title: 'OPTION B: Isolated Haulage Re-route',
        description: 'Divert dumpers to Western ramp without engaging auxiliary pump.',
        expectedLossPct: '-14.2%',
        expectedLossTonnes: 880,
        protectedTonnes: 470,
        expectedDowntime: '8.5 Hours',
        operationalImpact: 'Prevents dumper slippage but sump overflow persists.',
        confidence: '91.4%',
        costEstimate: '₹14,000 / shift',
        roi: '4.8x',
        isAiRecommended: false
      },
      {
        id: 'OPT-C',
        title: 'OPTION C: Integrated Dewatering + Dual-Corridor Haulage',
        description: 'Engage auxiliary pump AP-04 + divert 4 dumpers to Western corridor + accelerate incline hoisting to 155 TPH.',
        expectedLossPct: '-3.2%',
        expectedLossTonnes: 200,
        protectedTonnes: 1150,
        expectedDowntime: '0.8 Hours',
        operationalImpact: 'Drains sump at 42 m³/h, protects haulage velocity, meets 96.8% of daily quota.',
        confidence: '94.8%',
        costEstimate: '₹42,000 / shift',
        roi: '9.4x (₹8.2L Value Protected)',
        isAiRecommended: true
      }
    ],

    // Step 6: What-If Simulation Data
    whatIfSimulation: {
      withoutIntervention: {
        production: 4850,
        shortfall: 1350,
        riskScore: '84.2% (CRITICAL)',
        fleetAvailability: '62.0%',
        downtimeHours: 14.2,
        netLossINR: '₹8,45,000'
      },
      withAiRecommendation: {
        production: 6000,
        shortfall: 200,
        riskScore: '12.4% (NOMINAL)',
        fleetAvailability: '91.5%',
        downtimeHours: 0.8,
        netLossINR: '₹1,25,000'
      },
      delta: {
        riskReducedPct: '71.8%',
        productionProtectedTonnes: 1150,
        downtimeSavedHours: 13.4,
        valueProtectedINR: '₹7,20,000'
      }
    }
  },

  {
    id: 'CRUSHER',
    title: 'Primary Jaw Crusher Bearing Harmonic Anomaly',
    code: 'SCENARIO-02 // EQUIPMENT HARMONICS',
    category: 'Equipment',
    icon: 'Cpu',
    defaultMine: 'dongri-buzurg',
    timeHorizon: '6 HOURS',

    beforeState: {
      dailyProduction: 4800,
      predictedYield: 3600,
      shortfallRisk: 'High (82.4%)',
      fleetAvailability: '88.0%',
      waterIngressRate: '8.2 m³/h',
      averageGrade: '48.5% MnO₂',
      aiTrustScore: '96.2%',
      unmitigatedLossPct: '-25.0%',
      unmitigatedLossTonnes: 1200
    },

    detection: {
      headline: 'Catastrophic Bearing Seizure Projected within 14 Hours',
      timeToShortfall: '14 Hours (Pre-Failure)',
      threatVector: 'Unmitigated operation will cause complete mechanical seizure of CR-01, resulting in 48 hours of total pit standstill.',
      confidence: '96.2%'
    },

    profiles: {
      LOW: { lossTonnes: 300, lossPct: '6.2%', riskPct: '38.0%', conf: '91.0%', vib: '3.1 mm/s', temp: '72°C' },
      MEDIUM: { lossTonnes: 650, lossPct: '13.5%', riskPct: '62.4%', conf: '93.5%', vib: '3.9 mm/s', temp: '82°C' },
      HIGH: { lossTonnes: 1200, lossPct: '25.0%', riskPct: '82.4%', conf: '96.2%', vib: '4.8 mm/s', temp: '94°C' },
      CRITICAL: { lossTonnes: 1600, lossPct: '33.3%', riskPct: '95.0%', conf: '97.8%', vib: '5.6 mm/s', temp: '108°C' }
    },

    signals: [
      { name: 'CR-01 Drive Bearing Vibration Sensor', value: '4.82 mm/s (42 Hz FFT Peak)', normal: '<2.2 mm/s', magnitude: '+119% Harmonic Spike', severity: 'CRITICAL', freshness: '0.5s ago', timestamp: '22:58:14 IST' },
      { name: 'CR-01 Main Bearing Thermal RTD', value: '94.6 °C', normal: '<65 °C', magnitude: '+29.6 °C Drift', severity: 'CRITICAL', freshness: '1.0s ago', timestamp: '22:58:13 IST' },
      { name: 'Primary Screen Feed Velocity', value: '185 TPH', normal: '260 TPH', magnitude: '-28% Choke', severity: 'WARNING', freshness: '1.8s ago', timestamp: '22:58:10 IST' },
      { name: 'Crusher Lubrication Pressure', value: '1.8 Bar', normal: '3.5 Bar', magnitude: '-48% Lube Loss', severity: 'WARNING', freshness: '2.1s ago', timestamp: '22:58:08 IST' }
    ],

    prediction: {
      productionAtRisk: 1200,
      productionAtRiskFormatted: '1,200 T',
      shortfallProbability: '82.4%',
      horizon: '6 HOURS',
      expectedImpact: '-25.0% Daily Output Deficit',
      modelConfidence: '96.2%',
      unmitigatedYield: 3600,
      targetQuota: 4800
    },

    evidenceFactors: [
      { rank: '01', factor: '42 Hz FFT Bearing Harmonic Resonance', feature: '42 Hz FFT Bearing Harmonic Resonance', impactPct: 48.5, direction: 'risk_elevating', category: 'IoT Diagnostics', detail: 'Harmonic peak amplitude at 42 Hz indicates outer race spalling defect.' },
      { rank: '02', factor: 'Main Drive Bearing Temperature Drift (94.6°C)', feature: 'Main Drive Bearing Temperature Drift (94.6°C)', impactPct: 32.1, direction: 'risk_elevating', category: 'Thermal Dynamics', detail: 'Temperature rising at 2.4°C/hour due to lubrication film breakdown.' },
      { rank: '03', factor: 'Run-of-Mine Feed Hardness Anomaly', feature: 'Run-of-Mine Feed Hardness Anomaly', impactPct: 14.2, direction: 'risk_elevating', category: 'Geological', detail: 'High silica quartz boulders from Bench 2 increasing crushing torque.' },
      { rank: '04', factor: 'Mobile Screening Plant Standby (MS-02)', feature: 'Mobile Screening Plant Standby (MS-02)', impactPct: 18.6, direction: 'risk_mitigating', category: 'Auxiliary Capacity', detail: '70 TPH mobile screening plant MS-02 is operable to bypass fines.' }
    ],

    recommendation: {
      actionId: 'PROTO-AP-02',
      title: 'Crusher Feed Balancing & Parallel Screening Bypass Protocol',
      whatToDo: '1. Throttle CR-01 feed rate from 300 TPH to 210 TPH to suppress bearing harmonic vibration.\n2. Engage mobile vibrating screen MS-02 to bypass 70 TPH fines directly to secondary cone crusher.\n3. Dispatch mechanical crew for 45-min bearing lubrication cycle at 14:00 shift handover.',
      why: 'Throttling suppresses destructive harmonic resonance while mobile bypass preserves 97.9% of target throughput.',
      expectedImpact: '+1,100 T/day Protected Output (Prevents Total Breakdown)',
      protectedYield: '+1,100 T/day',
      confidence: '96.2%',
      timeToIntervene: '< 30 Minutes',
      status: 'AWAITING HUMAN APPROVAL'
    },

    optimizationOptions: [
      {
        id: 'OPT-A',
        title: 'OPTION A: Run to Complete Failure',
        description: 'Keep CR-01 running at 300 TPH until catastrophic breakdown.',
        expectedLossPct: '-25.0%',
        expectedLossTonnes: 1200,
        protectedTonnes: 0,
        expectedDowntime: '48.0 Hours (Shaft Seizure)',
        operationalImpact: 'Total pit standstill for 2 days, ₹6.8L replacement cost.',
        confidence: '98.0%',
        costEstimate: '₹6,80,000',
        roi: '0.0x',
        isAiRecommended: false
      },
      {
        id: 'OPT-B',
        title: 'OPTION B: Immediate Total Shutdown',
        description: 'Halt all crushing immediately for emergency 8h overhaul.',
        expectedLossPct: '-16.5%',
        expectedLossTonnes: 790,
        protectedTonnes: 410,
        expectedDowntime: '8.0 Hours',
        operationalImpact: 'Protects bearing but creates immediate 790T production deficit.',
        confidence: '94.0%',
        costEstimate: '₹35,000 / shift',
        roi: '3.4x',
        isAiRecommended: false
      },
      {
        id: 'OPT-C',
        title: 'OPTION C: Throttle Feed + Parallel Mobile Screen Bypass',
        description: 'Throttle CR-01 to 210 TPH + engage mobile screen (70 TPH) + schedule planned 45m lube at shift changeover.',
        expectedLossPct: '-2.1%',
        expectedLossTonnes: 100,
        protectedTonnes: 1100,
        expectedDowntime: '0.75 Hours',
        operationalImpact: 'Drops vibration to 2.2 mm/s, maintains 97.9% throughput, avoids downtime.',
        confidence: '96.2%',
        costEstimate: '₹18,500 / shift',
        roi: '14.2x (₹7.4L Value Protected)',
        isAiRecommended: true
      }
    ],

    whatIfSimulation: {
      withoutIntervention: {
        production: 3600,
        shortfall: 1200,
        riskScore: '82.4% (HIGH)',
        fleetAvailability: '88.0%',
        downtimeHours: 48.0,
        netLossINR: '₹7,50,000'
      },
      withAiRecommendation: {
        production: 4700,
        shortfall: 100,
        riskScore: '8.5% (NOMINAL)',
        fleetAvailability: '95.0%',
        downtimeHours: 0.75,
        netLossINR: '₹62,000'
      },
      delta: {
        riskReducedPct: '73.9%',
        productionProtectedTonnes: 1100,
        downtimeSavedHours: 47.25,
        valueProtectedINR: '₹6,88,000'
      }
    }
  },

  {
    id: 'FLEET',
    title: 'Haul Truck Fleet Failure & Shovel Starvation',
    code: 'SCENARIO-03 // FLEET & LOGISTICS',
    category: 'Logistics',
    icon: 'Truck',
    defaultMine: 'tirodi',
    timeHorizon: '24 HOURS',

    beforeState: {
      dailyProduction: 3200,
      predictedYield: 2450,
      shortfallRisk: 'High (71.0%)',
      fleetAvailability: '68.0%',
      waterIngressRate: '4.5 m³/h',
      averageGrade: '36.2% Mn',
      aiTrustScore: '93.5%',
      unmitigatedLossPct: '-23.4%',
      unmitigatedLossTonnes: 750
    },

    detection: {
      headline: 'Haulage Starvation at Primary Crusher Hopper',
      timeToShortfall: '6 Hours',
      threatVector: 'Shovel idle time on Bench 2 North is starving the primary crusher hopper, causing downstream plant throttling.',
      confidence: '93.5%'
    },

    profiles: {
      LOW: { lossTonnes: 220, lossPct: '6.8%', riskPct: '32.0%', conf: '88.0%', downTrucks: 1 },
      MEDIUM: { lossTonnes: 480, lossPct: '15.0%', riskPct: '58.0%', conf: '91.2%', downTrucks: 2 },
      HIGH: { lossTonnes: 750, lossPct: '23.4%', riskPct: '71.0%', conf: '93.5%', downTrucks: 3 },
      CRITICAL: { lossTonnes: 1100, lossPct: '34.4%', riskPct: '88.0%', conf: '95.4%', downTrucks: 4 }
    },

    signals: [
      { name: 'Active HEMM Dumper Availability', value: '9 / 12 Units Online (3 Down)', normal: '12 / 12 Units', magnitude: '-25% Fleet Capacity', severity: 'WARNING', freshness: '0.4s ago', timestamp: '22:58:15 IST' },
      { name: 'Bench 2 Shovel Waiting Queue Time', value: '14.2 mins / cycle', normal: '<4.0 mins', magnitude: '+255% Shovel Idle', severity: 'WARNING', freshness: '1.2s ago', timestamp: '22:58:12 IST' },
      { name: 'Primary Crusher Hopper Level', value: '28% Capacity (Starvation)', normal: '>65%', magnitude: '-57% Buffer', severity: 'CRITICAL', freshness: '1.5s ago', timestamp: '22:58:11 IST' }
    ],

    prediction: {
      productionAtRisk: 750,
      productionAtRiskFormatted: '750 T',
      shortfallProbability: '71.0%',
      horizon: '24 HOURS',
      expectedImpact: '-23.4% Haulage Deficit',
      modelConfidence: '93.5%',
      unmitigatedYield: 2450,
      targetQuota: 3200
    },

    evidenceFactors: [
      { rank: '01', factor: 'Simultaneous Hydraulic Hose Failure on 3 Dumpers', feature: 'Simultaneous Hydraulic Hose Failure on 3 Dumpers', impactPct: 52.4, direction: 'risk_elevating', category: 'Fleet Health', detail: '3 units sidelined in workshop for unscheduled hydraulic manifold repairs.' },
      { rank: '02', factor: 'Long Haul Cycle to South Dumping Point (4.2km)', feature: 'Long Haul Cycle to South Dumping Point (4.2km)', impactPct: 24.1, direction: 'risk_elevating', category: 'Haul Route', detail: 'Current haul cycle requires 28 mins per trip due to single long-haul corridor.' },
      { rank: '03', factor: 'Intermediate Stockpile Staging Point (1.4km)', feature: 'Intermediate Stockpile Staging Point (1.4km)', impactPct: 18.5, direction: 'risk_mitigating', category: 'Short-Haul Buffer', detail: 'Unutilized transfer yard available 1.4km from face.' }
    ],

    recommendation: {
      actionId: 'PROTO-AP-07',
      title: 'Dynamic Short-Haul Buffer & Excavator Balancing Protocol',
      whatToDo: '1. Re-route 9 active dumpers to Intermediate Stockpile 1 (1.4km cycle, reduces turnaround from 28m to 11m).\n2. Reposition Excavator EX-04 for dual-sided dumper loading.\n3. Buffer 400T at hopper before secondary transfer.',
      why: 'Cutting haul cycle distance by 66% offsets the missing 3 dumpers with zero capital expenditure.',
      expectedImpact: '+650 T/day Protected Haulage Yield',
      protectedYield: '+650 T/day',
      confidence: '93.5%',
      timeToIntervene: '< 1 Hour',
      status: 'AWAITING HUMAN APPROVAL'
    },

    optimizationOptions: [
      {
        id: 'OPT-A',
        title: 'OPTION A: No Change (Wait for Overhaul)',
        description: 'Allow remaining 9 dumpers to continue long 4.2km cycle.',
        expectedLossPct: '-23.4%',
        expectedLossTonnes: 750,
        protectedTonnes: 0,
        expectedDowntime: '6.2 Hours (Shovel Starvation)',
        operationalImpact: 'Crusher starves, daily target missed by 750 T.',
        confidence: '95.0%',
        costEstimate: '₹0',
        roi: '0.0x',
        isAiRecommended: false
      },
      {
        id: 'OPT-B',
        title: 'OPTION B: Rent Commercial Contractor Tippers',
        description: 'Hire 4 third-party tippers from local regional transport contractor.',
        expectedLossPct: '-8.5%',
        expectedLossTonnes: 270,
        protectedTonnes: 480,
        expectedDowntime: '2.4 Hours',
        operationalImpact: 'Recovers volume but high rental cost and safety compliance risk.',
        confidence: '89.0%',
        costEstimate: '₹85,000 / shift',
        roi: '2.8x',
        isAiRecommended: false
      },
      {
        id: 'OPT-C',
        title: 'OPTION C: Dynamic Short-Haul Staging + Dual Excavator Spotting',
        description: 'Divert remaining 9 dumpers to Intermediate Yard (1.4km cycle) + reallocate Excavator EX-04 for double-spotting.',
        expectedLossPct: '-3.1%',
        expectedLossTonnes: 100,
        protectedTonnes: 650,
        expectedDowntime: '0.4 Hours',
        operationalImpact: 'Triples cycle frequency, protects 650 T, 100% MOIL fleet safety.',
        confidence: '93.5%',
        costEstimate: '₹12,000 / shift',
        roi: '11.8x (₹4.8L Value Protected)',
        isAiRecommended: true
      }
    ],

    whatIfSimulation: {
      withoutIntervention: {
        production: 2450,
        shortfall: 750,
        riskScore: '71.0% (HIGH)',
        fleetAvailability: '68.0%',
        downtimeHours: 6.2,
        netLossINR: '₹4,70,000'
      },
      withAiRecommendation: {
        production: 3100,
        shortfall: 100,
        riskScore: '9.2% (NOMINAL)',
        fleetAvailability: '92.0%',
        downtimeHours: 0.4,
        netLossINR: '₹62,000'
      },
      delta: {
        riskReducedPct: '61.8%',
        productionProtectedTonnes: 650,
        downtimeSavedHours: 5.8,
        valueProtectedINR: '₹4,08,000'
      }
    }
  },

  {
    id: 'GRADE',
    title: 'Ore Grade Variation & Penalty Shock',
    code: 'SCENARIO-04 // METALLURGICAL BLEND',
    category: 'Metallurgical',
    icon: 'Layers',
    defaultMine: 'gumgaon',
    timeHorizon: '24 HOURS',

    beforeState: {
      dailyProduction: 2800,
      predictedYield: 2300,
      shortfallRisk: 'High (78.5%)',
      fleetAvailability: '91.0%',
      waterIngressRate: '6.4 m³/h',
      averageGrade: '34.8% Mn (Non-Compliant)',
      aiTrustScore: '95.1%',
      unmitigatedLossPct: '-18.0%',
      unmitigatedLossTonnes: 500
    },

    detection: {
      headline: 'Metallurgical Specification Non-Compliance Detected',
      timeToShortfall: 'Immediate (Next Rake Loading)',
      threatVector: 'Direct shipment of 34.8% Mn ore will trigger severe penalty deductions (₹1,400/T penalty) or outright rejection by SAIL / Tata Steel customers.',
      confidence: '95.1%'
    },

    profiles: {
      LOW: { lossTonnes: 150, lossPct: '5.4%', riskPct: '35.0%', conf: '91.0%', mn: '39.2% Mn' },
      MEDIUM: { lossTonnes: 320, lossPct: '11.4%', riskPct: '58.0%', conf: '93.2%', mn: '36.8% Mn' },
      HIGH: { lossTonnes: 500, lossPct: '18.0%', riskPct: '78.5%', conf: '95.1%', mn: '34.8% Mn' },
      CRITICAL: { lossTonnes: 720, lossPct: '25.7%', riskPct: '91.0%', conf: '96.8%', mn: '31.5% Mn' }
    },

    signals: [
      { name: 'Online XRF Core Assay Stream', value: '34.8% Mn (Non-Compliant)', normal: '>41.5% Mn', magnitude: '-16% Grade Drop', severity: 'CRITICAL', freshness: '0.6s ago', timestamp: '22:58:14 IST' },
      { name: 'Silica Impurity Concentration (SiO₂)', value: '18.4%', normal: '<10.5%', magnitude: '+75% Silica Intrusion', severity: 'WARNING', freshness: '1.4s ago', timestamp: '22:58:11 IST' },
      { name: 'Phosphorus Content (P)', value: '0.14%', normal: '<0.11%', magnitude: '+27% P Penalty', severity: 'WARNING', freshness: '2.0s ago', timestamp: '22:58:09 IST' }
    ],

    prediction: {
      productionAtRisk: 500,
      productionAtRiskFormatted: '500 T',
      shortfallProbability: '78.5%',
      horizon: '24 HOURS',
      expectedImpact: '₹7.0L Contract Penalty Deduction',
      modelConfidence: '95.1%',
      unmitigatedYield: 2300,
      targetQuota: 2800
    },

    evidenceFactors: [
      { rank: '01', factor: 'Silica Quartzite Intrusion at Incline Level 4', feature: 'Silica Quartzite Intrusion at Incline Level 4', impactPct: 58.2, direction: 'risk_elevating', category: 'Lithology', detail: 'Sudden hydrothermal quartzite lens intersecting active face.' },
      { rank: '02', factor: 'Balaghat High-Grade (44.2% Mn) Stockpile Balance', feature: 'Balaghat High-Grade (44.2% Mn) Stockpile Balance', impactPct: 28.4, direction: 'risk_mitigating', category: 'Stockpile Blending', detail: '850T Balaghat high-grade ore available for blending ratio.' }
    ],

    recommendation: {
      actionId: 'PROTO-AP-09',
      title: 'Non-Linear Stockpile Blending & Beneficiation Protocol',
      whatToDo: '1. Configure blending hopper to 55:45 ratio (ROM ore : Balaghat 44.2% Mn stockpile).\n2. Route blended stream through fine vibrating screen to drop SiO₂ by 4.2%.\n3. Issue automated QA Certificate of Analysis (41.2% Mn certified).',
      why: 'Mathematical blending eliminates contract penalties while liquidating 100% of the mined siliceous ore.',
      expectedImpact: '+486 T Certified Grade (₹6.8L Penalty Avoided)',
      protectedYield: '+486 T Certified',
      confidence: '95.1%',
      timeToIntervene: '< 2 Hours (Before Rake Loading)',
      status: 'AWAITING HUMAN APPROVAL'
    },

    optimizationOptions: [
      {
        id: 'OPT-A',
        title: 'OPTION A: Ship Raw Ore with Penalty',
        description: 'Ship 34.8% Mn ore directly and absorb ₹1,400/T customer penalty deduction.',
        expectedLossPct: '-18.0%',
        expectedLossTonnes: 500,
        protectedTonnes: 0,
        expectedDowntime: '0 Hours',
        operationalImpact: 'Direct financial penalty deduction on steel mill invoice.',
        confidence: '97.0%',
        costEstimate: '₹7,00,000 Penalty',
        roi: '0.0x',
        isAiRecommended: false
      },
      {
        id: 'OPT-B',
        title: 'OPTION B: Halt Incline Mining & Re-drift',
        description: 'Halt mining on Level 4 until new crosscut bypasses quartzite.',
        expectedLossPct: '-45.0%',
        expectedLossTonnes: 1260,
        protectedTonnes: 0,
        expectedDowntime: '72 Hours',
        operationalImpact: 'High downtime loss, disrupts production schedules.',
        confidence: '92.0%',
        costEstimate: '₹12,00,000 Downtime',
        roi: '0.0x',
        isAiRecommended: false
      },
      {
        id: 'OPT-C',
        title: 'OPTION C: Non-Linear Stockpile Blending Optimization',
        description: 'Blend 55% ROM (34.8% Mn) with 45% Balaghat (44.2% Mn) + screening of silica fines to yield 41.2% Mn certified blend.',
        expectedLossPct: '-0.5%',
        expectedLossTonnes: 14,
        protectedTonnes: 486,
        expectedDowntime: '0 Hours',
        operationalImpact: '100% ore liquidated with premium grade certification and zero penalty.',
        confidence: '95.1%',
        costEstimate: '₹22,000 / batch',
        roi: '18.6x (₹6.8L Penalty Avoided)',
        isAiRecommended: true
      }
    ],

    whatIfSimulation: {
      withoutIntervention: {
        production: 2300,
        shortfall: 500,
        riskScore: '78.5% (HIGH)',
        fleetAvailability: '91.0%',
        downtimeHours: 0.0,
        netLossINR: '₹7,00,000'
      },
      withAiRecommendation: {
        production: 2786,
        shortfall: 14,
        riskScore: '4.2% (NOMINAL)',
        fleetAvailability: '94.0%',
        downtimeHours: 0.0,
        netLossINR: '₹22,000'
      },
      delta: {
        riskReducedPct: '74.3%',
        productionProtectedTonnes: 486,
        downtimeSavedHours: 0.0,
        valueProtectedINR: '₹6,78,000'
      }
    }
  },

  {
    id: 'DISCOVERY',
    title: 'High-Grade Geological Exploration Signal',
    code: 'SCENARIO-05 // GEOSPATIAL RESERVE',
    category: 'Exploration',
    icon: 'Sparkles',
    defaultMine: 'balaghat',
    timeHorizon: '7 DAYS',

    beforeState: {
      dailyProduction: 6200,
      predictedYield: 6400,
      shortfallRisk: 'Low (Expansion Mode)',
      fleetAvailability: '92.0%',
      waterIngressRate: '12.0 m³/h',
      averageGrade: '44.2% Mn',
      aiTrustScore: '96.8%',
      unmitigatedLossPct: '0.0%',
      unmitigatedLossTonnes: 0
    },

    detection: {
      headline: 'Major Undelineated Manganese Reef Discovered',
      timeToShortfall: 'Opportunity Horizon: 7 Days',
      threatVector: 'New ore body adds an estimated +2.4 Million Tonnes of high-grade metallurgical manganese reserve to MOIL lease boundary.',
      confidence: '96.8%'
    },

    profiles: {
      LOW: { lossTonnes: 0, lossPct: '+10.0%', riskPct: '15.0%', conf: '92.0%', addedReserves: '0.8M T' },
      MEDIUM: { lossTonnes: 0, lossPct: '+20.0%', riskPct: '10.0%', conf: '94.5%', addedReserves: '1.6M T' },
      HIGH: { lossTonnes: 0, lossPct: '+35.0%', riskPct: '5.0%', conf: '96.8%', addedReserves: '2.4M T' },
      CRITICAL: { lossTonnes: 0, lossPct: '+50.0%', riskPct: '2.0%', conf: '98.0%', addedReserves: '3.8M T' }
    },

    signals: [
      { name: 'Sentinel-2 SWIR Manganese Oxide Reflectance', value: '0.842 Index (Band 11/12)', normal: '0.310 Index', magnitude: '+171% Spectral Anomaly', severity: 'PROSPECT', freshness: '1.1s ago', timestamp: '22:58:13 IST' },
      { name: 'Borehole Core Assay Probe (BH-42 @ -220m)', value: '46.4% Mn (8.4m Vein)', normal: '42.0% Mn', magnitude: '+10.5% Grade Premium', severity: 'PROSPECT', freshness: '2.5s ago', timestamp: '22:58:07 IST' },
      { name: 'Ground Magnetic Susceptibility Anomaly', value: '184 nT', normal: '<40 nT', magnitude: '+360% Magnetic Ridge', severity: 'PROSPECT', freshness: '3.0s ago', timestamp: '22:58:05 IST' }
    ],

    prediction: {
      productionAtRisk: 0,
      productionAtRiskFormatted: '+2.4M Tonnes Expansion',
      shortfallProbability: '5.0% (Opportunity Mode)',
      horizon: '7 DAYS',
      expectedImpact: '+2.4 Million Tonnes Indicated Reserve Growth',
      modelConfidence: '96.8%',
      unmitigatedYield: 6200,
      targetQuota: 6200
    },

    evidenceFactors: [
      { rank: '01', factor: 'SWIR Spectral Absorption Ridge (3.4km Extension)', feature: 'SWIR Spectral Absorption Ridge (3.4km Extension)', impactPct: 64.2, direction: 'risk_mitigating', category: 'Remote Sensing', detail: 'Coincides with unmapped Mansar schist strike extension.' },
      { rank: '02', factor: 'Diamond Core Assay Intersection (46.4% Mn)', feature: 'Diamond Core Assay Intersection (46.4% Mn)', impactPct: 22.4, direction: 'risk_mitigating', category: 'Assay Lab', detail: '8.4m true thickness with premium low-phosphorus (<0.08% P).' }
    ],

    recommendation: {
      actionId: 'PROTO-AP-12',
      title: 'Fast-Track Deep Vein Delineation & Mine Plan Revision Protocol',
      whatToDo: '1. Deploy diamond drill rig to AI coordinate 21.8092°N, 80.1914°E (Strike angle 55°).\n2. Update 3D Leapfrog geological block model with new 46.4% Mn reef boundary.\n3. Submit revised Mine Development Plan to IBM / Ministry of Steel.',
      why: 'AI-guided drilling cuts exploration borehole requirements from 24 to 4, accelerating UNFC reserve certification by 9 months.',
      expectedImpact: '+2.4M Tonnes Proved Reserve Certification (₹85Cr Valuation Increment)',
      protectedYield: '+2.4M T Reserve',
      confidence: '96.8%',
      timeToIntervene: '< 72 Hours',
      status: 'AWAITING HUMAN APPROVAL'
    },

    optimizationOptions: [
      {
        id: 'OPT-A',
        title: 'OPTION A: Postpone Exploration',
        description: 'Retain current 5-year mining plan without updating block model.',
        expectedLossPct: '0.0%',
        expectedLossTonnes: 0,
        protectedTonnes: 0,
        expectedDowntime: '0 Hours',
        operationalImpact: 'Opportunity delayed by 12 months.',
        confidence: '99.0%',
        costEstimate: '₹0',
        roi: '0.0x',
        isAiRecommended: false
      },
      {
        id: 'OPT-B',
        title: 'OPTION B: Standard 24-Borehole Grid Drilling',
        description: 'Commission traditional 12-month GSI grid drilling campaign.',
        expectedLossPct: '+5.0% Growth',
        expectedLossTonnes: 0,
        protectedTonnes: 400000,
        expectedDowntime: '0 Hours',
        operationalImpact: 'High exploration cost and slow 12-month turnaround.',
        confidence: '91.0%',
        costEstimate: '₹1.8 Crore',
        roi: '4.2x',
        isAiRecommended: false
      },
      {
        id: 'OPT-C',
        title: 'OPTION C: AI-Targeted 4-Point Micro-Drilling',
        description: 'Execute 4 precision angle boreholes at AI inflection coordinates + fast-track incline drift from -185m.',
        expectedLossPct: '+28.0% Reserve Growth',
        expectedLossTonnes: 0,
        protectedTonnes: 2400000,
        expectedDowntime: '0 Hours',
        operationalImpact: 'Cuts drilling cost by 65%, adds +2.4M Tonnes to proved reserve asset.',
        confidence: '96.8%',
        costEstimate: '₹48 Lakhs',
        roi: '24.0x (₹85Cr Valuation Increment)',
        isAiRecommended: true
      }
    ],

    whatIfSimulation: {
      withoutIntervention: {
        production: 6200,
        shortfall: 0,
        riskScore: '5.0% (NOMINAL)',
        fleetAvailability: '92.0%',
        downtimeHours: 0.0,
        netLossINR: '₹0'
      },
      withAiRecommendation: {
        production: 6400,
        shortfall: 0,
        riskScore: '1.2% (EXPANSION)',
        fleetAvailability: '96.0%',
        downtimeHours: 0.0,
        netLossINR: '₹85,00,00,000 (Asset Value Created)'
      },
      delta: {
        riskReducedPct: '0.0%',
        productionProtectedTonnes: 2400000,
        downtimeSavedHours: 0.0,
        valueProtectedINR: '₹85,00,00,000'
      }
    }
  },

  {
    id: 'MULTI_RISK',
    title: 'Multi-Risk Compound Crisis (Monsoon Influx + Crusher Seizure)',
    code: 'SCENARIO-06 // COMPOUND STRESS',
    category: 'Compound',
    icon: 'AlertTriangle',
    defaultMine: 'balaghat',
    timeHorizon: '24 HOURS',

    beforeState: {
      dailyProduction: 6200,
      predictedYield: 3800,
      shortfallRisk: 'Extreme (94.0%)',
      fleetAvailability: '62.5%',
      waterIngressRate: '42.0 m³/h',
      averageGrade: '44.2% Mn',
      aiTrustScore: '95.8%',
      unmitigatedLossPct: '-38.7%',
      unmitigatedLossTonnes: 2400
    },

    detection: {
      headline: 'Compound Dual-Vector Crisis: Pit Flooding & Crushing Bottleneck',
      timeToShortfall: '12 Hours',
      threatVector: 'Multi-point collapse across both underground extraction and surface processing infrastructure.',
      confidence: '95.8%'
    },

    profiles: {
      LOW: { lossTonnes: 600, lossPct: '9.7%', riskPct: '52.0%', conf: '91.0%' },
      MEDIUM: { lossTonnes: 1400, lossPct: '22.5%', riskPct: '76.0%', conf: '93.8%' },
      HIGH: { lossTonnes: 2400, lossPct: '38.7%', riskPct: '94.0%', conf: '95.8%' },
      CRITICAL: { lossTonnes: 3200, lossPct: '51.6%', riskPct: '98.5%', conf: '97.2%' }
    },

    signals: [
      { name: 'Monsoon Cloudburst Influx', value: '92.0 mm / 24h', normal: '<15 mm', magnitude: '+513% Influx', severity: 'CRITICAL', freshness: '0.4s ago', timestamp: '22:58:15 IST' },
      { name: 'CR-01 Drive Bearing Vibration', value: '5.10 mm/s (42 Hz FFT)', normal: '<2.2 mm/s', magnitude: '+131% Spike', severity: 'CRITICAL', freshness: '0.9s ago', timestamp: '22:58:13 IST' },
      { name: 'Holmes Sump Inflow Rate (-185m)', value: '42.0 m³/h', normal: '<12 m³/h', magnitude: '+250% Flood', severity: 'CRITICAL', freshness: '1.4s ago', timestamp: '22:58:11 IST' },
      { name: 'Haul Fleet Average Velocity', value: '11.4 km/h', normal: '24.0 km/h', magnitude: '-52% Slurry Drag', severity: 'WARNING', freshness: '1.8s ago', timestamp: '22:58:10 IST' }
    ],

    prediction: {
      productionAtRisk: 2400,
      productionAtRiskFormatted: '2,400 T',
      shortfallProbability: '94.0%',
      horizon: '24 HOURS',
      expectedImpact: '-38.7% Compound Output Collapse',
      modelConfidence: '95.8%',
      unmitigatedYield: 3800,
      targetQuota: 6200
    },

    evidenceFactors: [
      { rank: '01', factor: 'Compound Dual-Vector Stress (Pit Flood + Crusher Failure)', feature: 'Compound Dual-Vector Stress (Pit Flood + Crusher Failure)', impactPct: 38.6, direction: 'risk_elevating', category: 'Compound Threat', detail: 'Simultaneous failure across extraction and surface processing.' },
      { rank: '02', factor: 'CR-01 Primary Crusher Harmonic Vibration (5.1 mm/s)', feature: 'CR-01 Primary Crusher Harmonic Vibration (5.1 mm/s)', impactPct: 32.4, direction: 'risk_elevating', category: 'Equipment', detail: 'Bearing temperature approaching 98°C critical threshold.' },
      { rank: '03', factor: 'Bench 3 Haul Road Slurry Resistance', feature: 'Bench 3 Haul Road Slurry Resistance', impactPct: 18.2, direction: 'risk_elevating', category: 'Haulage', detail: 'Truck cycle times elevated by 52%.' },
      { rank: '04', factor: 'High-Grade Surface Stockpile Reserves', feature: 'High-Grade Surface Stockpile Reserves', impactPct: 10.8, direction: 'risk_mitigating', category: 'Buffer', detail: 'Stockpile available for direct dispatch.' }
    ],

    recommendation: {
      actionId: 'PROTO-AP-99',
      title: 'Coordinated Compound Crisis Countermeasure Protocol',
      whatToDo: '1. Auto-engage auxiliary pump AP-04 at -185m sump.\n2. Throttle CR-01 to 210 TPH and activate mobile screen MS-02.\n3. Reroute haul dumpers to Western high-ground corridor.\n4. Draw 220T from high-grade 44% Mn surface stockpile buffer.',
      why: 'Cross-functional optimization balances water extraction, crushing throughput, and haulage speed simultaneously.',
      expectedImpact: '+2,100 T/day Protected Yield (Recovers 87.5% of Loss)',
      protectedYield: '+2,100 T/day',
      confidence: '95.8%',
      timeToIntervene: '< 20 Minutes (Immediate Dispatch)',
      status: 'AWAITING HUMAN APPROVAL'
    },

    optimizationOptions: [
      {
        id: 'OPT-A',
        title: 'OPTION A: Uncoordinated Departmental Response',
        description: 'Departments act independently without AI cross-system optimization.',
        expectedLossPct: '-38.7%',
        expectedLossTonnes: 2400,
        protectedTonnes: 0,
        expectedDowntime: '22.0 Hours',
        operationalImpact: 'Dual-vector collapse, severe target failure.',
        confidence: '97.0%',
        costEstimate: '₹14,50,000 Loss',
        roi: '0.0x',
        isAiRecommended: false
      },
      {
        id: 'OPT-B',
        title: 'OPTION B: Partial Dewatering Focus Only',
        description: 'Engage pumps but ignore crusher vibration issues.',
        expectedLossPct: '-22.5%',
        expectedLossTonnes: 1395,
        protectedTonnes: 1005,
        expectedDowntime: '12.0 Hours',
        operationalImpact: 'Pumps manage water but crusher suffers catastrophic seizure.',
        confidence: '92.0%',
        costEstimate: '₹6,80,000 + ₹42,000',
        roi: '4.2x',
        isAiRecommended: false
      },
      {
        id: 'OPT-C',
        title: 'OPTION C: Coordinated Multi-Vector Countermeasures',
        description: 'Simultaneously engage AP-04 pump + throttle CR-01 & mobile screen bypass + reroute haul fleet to Western ramp + draw 220T stockpile.',
        expectedLossPct: '-4.8%',
        expectedLossTonnes: 300,
        protectedTonnes: 2100,
        expectedDowntime: '1.2 Hours',
        operationalImpact: 'Recovers 87.5% of lost production, protects equipment, prevents flood.',
        confidence: '95.8%',
        costEstimate: '₹58,000 / shift',
        roi: '14.8x (₹14.2L Value Protected)',
        isAiRecommended: true
      }
    ],

    whatIfSimulation: {
      withoutIntervention: {
        production: 3800,
        shortfall: 2400,
        riskScore: '94.0% (EXTREME)',
        fleetAvailability: '62.5%',
        downtimeHours: 22.0,
        netLossINR: '₹14,50,000'
      },
      withAiRecommendation: {
        production: 5900,
        shortfall: 300,
        riskScore: '14.0% (NOMINAL)',
        fleetAvailability: '89.0%',
        downtimeHours: 1.2,
        netLossINR: '₹1,85,000'
      },
      delta: {
        riskReducedPct: '80.0%',
        productionProtectedTonnes: 2100,
        downtimeSavedHours: 20.8,
        valueProtectedINR: '₹12,65,000'
      }
    }
  }
];

// Add backwards compatibility getters to all scenarios
MOCK_SCENARIOS.forEach(scen => {
  if (!scen.prescribedAction) scen.prescribedAction = scen.recommendation;
  if (!scen.shapDrivers) scen.shapDrivers = scen.evidenceFactors;
});

export const INITIAL_AUDIT_LOGS = [
  {
    id: 'LOG-8842',
    timestamp: '2026-08-26 11:42:18 IST',
    mine: 'Balaghat Deep Shaft',
    scenario: 'Heavy Monsoon Cloudburst',
    detectedSignal: 'Sump Water Inflow (+38.6 m³/h @ -185m)',
    prediction: 'Shortfall Deficit: -1,350 T in 24h (84.2% Prob)',
    confidence: '94.8%',
    recommendation: 'Protocol PROTO-AP-04 (Pump AP-04 + Western Ramp Divert)',
    selectedOption: 'Option C: Integrated Dewatering + Dual-Corridor',
    simulationResult: '+1,150 T Protected (Risk Reduced: 71.8%)',
    operatorDecision: 'APPROVED',
    operatorName: 'R. Sharma (Senior Shift Supervisor)',
    operatorNote: 'Auxiliary pump AP-04 engaged; water table stabilized at -185m within 45 mins. Haul trucks rerouted.',
    expectedImpact: '+1,150 T Protected',
    realizedOutcome: '+1,180 T Actual Protected Yield (100% Target Met)'
  },
  {
    id: 'LOG-8839',
    timestamp: '2026-08-26 08:15:02 IST',
    mine: 'Dongri Buzurg Opencast',
    scenario: 'Crusher Bearing Harmonic Anomaly',
    detectedSignal: 'CR-01 Vibration: 4.82 mm/s (42 Hz FFT Peak)',
    prediction: 'Imminent Seizure within 6h (-1,200 T Loss)',
    confidence: '96.2%',
    recommendation: 'Protocol PROTO-AP-02 (Throttle 210 TPH + Mobile Screen Bypass)',
    selectedOption: 'Option C: Throttle Feed + Parallel Bypass',
    simulationResult: '+1,100 T Protected (Risk Reduced: 73.9%)',
    operatorDecision: 'APPROVED',
    operatorName: 'A. K. Verma (Chief Mechanical Engineer)',
    operatorNote: 'Vibration dropped to 2.2 mm/s immediately; scheduled lube completed at shift change.',
    expectedImpact: '+1,100 T Protected',
    realizedOutcome: '+1,140 T Actual Protected Yield (0h Unplanned Downtime)'
  },
  {
    id: 'LOG-8831',
    timestamp: '2026-08-25 16:30:45 IST',
    mine: 'Gumgaon Incline Mine',
    scenario: 'Ore Grade Variation & Penalty',
    detectedSignal: 'Online XRF Assay: 34.8% Mn (Silica: 18.4%)',
    prediction: 'Contract Rejection (₹7.0L Penalty Risk)',
    confidence: '95.1%',
    recommendation: 'Protocol PROTO-AP-09 (55:45 Non-Linear Stockpile Blend)',
    selectedOption: 'Option C: Stockpile Blending Optimization',
    simulationResult: '+486 T Certified Grade (Risk Reduced: 74.3%)',
    operatorDecision: 'MODIFIED',
    operatorName: 'Dr. S. Mukherjee (Head of Metallurgy)',
    operatorNote: 'Modified blend ratio to 50:50 to ensure >42.0% Mn for premium Tata Steel rake delivery.',
    expectedImpact: '100% Quality Pass',
    realizedOutcome: '42.4% Mn Delivered (₹0 Penalty on Invoice)'
  }
];
