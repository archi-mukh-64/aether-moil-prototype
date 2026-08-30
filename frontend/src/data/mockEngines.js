export const INTELLIGENCE_ENGINES = [
  {
    id: 'shortfall-alert',
    name: 'Shortfall Alert Engine',
    code: 'ENGINE // 01',
    category: 'Predictive Yield',
    tagline: 'Pre-emptive deficit forecasting before operational impact.',
    description: 'Combines multi-day precipitation forecasts, HEMM cycle delays, and blasting sequence logs using gradient-boosted ensembles to forecast production shortfalls up to 14 days in advance.',
    metrics: [
      { label: 'Forecast Horizon', value: '14 Days' },
      { label: 'Shortfall Detection Lead Time', value: '72 Hours' },
      { label: 'Historical Precision', value: '94.8%' }
    ],
    status: 'ACTIVE MONITORING',
    statusColor: 'hazard',
    icon: 'AlertTriangle',
    route: '/alert-engine'
  },
  {
    id: 'exploration-radar',
    name: 'Exploration Radar',
    code: 'ENGINE // 02',
    category: 'Geological AI & GIS',
    tagline: 'High-precision reserve discovery & lithology targeting.',
    description: 'Fuses multispectral satellite Earth Observation (NDVI, NDWI, SWIR alteration indices) with structural fault geometries and borehole data to delineate high-grade manganese prospective corridors.',
    metrics: [
      { label: 'Prospectivity Index', value: '88.4%' },
      { label: 'Unmapped Vein Target', value: '3.2 km Strike' },
      { label: 'Estimated Mn Grade', value: '42.8%' }
    ],
    status: 'SURVEY SCANNING',
    statusColor: 'radar',
    icon: 'Radar',
    route: '/reserve-radar'
  },
  {
    id: 'auto-protocol',
    name: 'Auto-Response Protocol',
    code: 'ENGINE // 03',
    category: 'Prescriptive Dispatch',
    tagline: 'Real-time multi-criteria operational mitigation solver.',
    description: 'When production threats or equipment bottlenecks emerge, the prescriptive engine runs linear constrained optimization to recommend the highest ROI operational countermeasure across fleet and pumps.',
    metrics: [
      { label: 'Optimization Solver', value: 'Simplex / MILP' },
      { label: 'Avg Tonnage Saved', value: '280 T/incident' },
      { label: 'Execution Latency', value: '< 1.4s' }
    ],
    status: 'OPTIMIZER READY',
    statusColor: 'telemetry',
    icon: 'Zap',
    route: '/protocol'
  },
  {
    id: 'equipment-health',
    name: 'Equipment Health & RUL',
    code: 'ENGINE // 04',
    category: 'Predictive Maintenance',
    tagline: 'IoT spectral diagnostics & failure horizon prediction.',
    description: 'Monitors real-time telemetry from Heavy Earth Moving Machinery (excavators, dumpers, crushers, winder hoists), computing Remaining Useful Life (RUL) and identifying early bearing vibration harmonics.',
    metrics: [
      { label: 'Monitored Fleet', value: '143 Assets' },
      { label: 'Critical Assets Flagged', value: '1 Unit (CR-01)' },
      { label: 'Unplanned Down Reduction', value: '-34%' }
    ],
    status: 'TELEMETRY STREAMING',
    statusColor: 'manganese',
    icon: 'Cpu',
    route: '/equipment'
  },
  {
    id: 'trust-score',
    name: 'AI Trust & Governance',
    code: 'ENGINE // 05',
    category: 'Model Governance',
    tagline: 'Transparent uncertainty quantification & sensor audit.',
    description: 'Provides a real-time composite trust score evaluating input data freshness, sensor coverage, prediction variance, and model calibration drift, ensuring complete transparency for mine leadership.',
    metrics: [
      { label: 'Overall System Trust', value: '94.2%' },
      { label: 'Data Freshness SLA', value: '< 15s Latency' },
      { label: 'Calibration Grade', value: 'Tier 1 Certified' }
    ],
    status: 'CALIBRATED',
    statusColor: 'telemetry',
    icon: 'ShieldCheck',
    route: '/analytics'
  },
  {
    id: 'anomaly-detector',
    name: 'Multi-Variate Anomaly Engine',
    code: 'ENGINE // 06',
    category: 'Unsupervised Detection',
    tagline: 'Sub-surface sensor drift & operational outlier detection.',
    description: 'Runs isolation forest and autoencoder algorithms across hundreds of simultaneous data channels (pit water depth, mine ventilation CFM, blast vibration, dumper fuel burn) to detect silent anomalies.',
    metrics: [
      { label: 'Anomaly Threshold', value: '99.2% Quantile' },
      { label: 'Channels Monitored', value: '284 Sensors' },
      { label: 'Active Anomalies', value: '2 Outliers' }
    ],
    status: 'ANOMALY SCAN',
    statusColor: 'radar',
    icon: 'Activity',
    route: '/alert-engine'
  }
];
