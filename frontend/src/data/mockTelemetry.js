export const MOCK_TELEMETRY = {
  kpis: {
    dailyTarget: { value: '6,420', unit: 'Tonnes', change: '+2.4%', label: 'Daily Target Production' },
    predictedOutput: { value: '6,140', unit: 'Tonnes', change: '-4.3%', label: 'AI Predicted Yield' },
    shortfallRisk: { value: '38.4%', unit: 'Probability', change: '+6.1%', label: 'Shortfall Deficit Risk', level: 'elevated' },
    fleetAvailability: { value: '88.6%', unit: '127/143 HEMM', change: '-2.1%', label: 'Fleet Operational Uptime' },
    reservePotential: { value: '14.8M', unit: 'Metric Tonnes', change: '+1.2M', label: 'Indicated Mn Reserve' },
    aiTrustScore: { value: '94.2%', unit: 'Confidence Index', change: '+0.8%', label: 'AI Governance Trust' },
  },

  forecastSeries: [
    { day: 'Day 1', actual: 6380, target: 6420, predicted: 6390, lowerBound: 6250, upperBound: 6510, rainfall: 12 },
    { day: 'Day 2', actual: 6410, target: 6420, predicted: 6400, lowerBound: 6280, upperBound: 6520, rainfall: 18 },
    { day: 'Day 3', actual: 6350, target: 6420, predicted: 6360, lowerBound: 6210, upperBound: 6490, rainfall: 24 },
    { day: 'Day 4', actual: 6490, target: 6420, predicted: 6440, lowerBound: 6310, upperBound: 6580, rainfall: 5 },
    { day: 'Day 5', actual: 6420, target: 6420, predicted: 6410, lowerBound: 6290, upperBound: 6540, rainfall: 8 },
    { day: 'Day 6', actual: 6280, target: 6420, predicted: 6310, lowerBound: 6180, upperBound: 6440, rainfall: 42 },
    { day: 'Day 7 (Today)', actual: 6140, target: 6420, predicted: 6150, lowerBound: 6020, upperBound: 6280, rainfall: 68 },
    { day: 'Day 8 (Proj)', actual: null, target: 6420, predicted: 5920, lowerBound: 5740, upperBound: 6100, rainfall: 85 },
    { day: 'Day 9 (Proj)', actual: null, target: 6420, predicted: 5880, lowerBound: 5690, upperBound: 6070, rainfall: 74 },
    { day: 'Day 10 (Proj)', actual: null, target: 6420, predicted: 6050, lowerBound: 5860, upperBound: 6240, rainfall: 35 },
    { day: 'Day 11 (Proj)', actual: null, target: 6420, predicted: 6220, lowerBound: 6050, upperBound: 6390, rainfall: 15 },
    { day: 'Day 12 (Proj)', actual: null, target: 6420, predicted: 6340, lowerBound: 6190, upperBound: 6490, rainfall: 8 },
    { day: 'Day 13 (Proj)', actual: null, target: 6420, predicted: 6390, lowerBound: 6250, upperBound: 6530, rainfall: 4 },
    { day: 'Day 14 (Proj)', actual: null, target: 6420, predicted: 6410, lowerBound: 6270, upperBound: 6550, rainfall: 2 }
  ],

  riskMatrix: [
    {
      id: 'RSK-092',
      mine: 'Balaghat Mine',
      level: 'Critical',
      category: 'Inundation / Water Influx',
      probability: '84%',
      expectedImpact: '-380 T/day Deficit',
      confidence: '96.2%',
      primaryDriver: 'Monsoon influx exceeding sump pump capacity at -185m level (Holmes Shaft)',
      recommendedAction: 'Deploy auxiliary submersible pump AP-04 & redirect haulage to Bharveli incline',
      timestamp: '12 min ago'
    },
    {
      id: 'RSK-088',
      mine: 'Dongri Buzurg',
      level: 'High',
      category: 'Haulage Bottleneck',
      probability: '68%',
      expectedImpact: '-220 T/day Deficit',
      confidence: '91.8%',
      primaryDriver: 'Bench 3 South ramp gradient degradation following heavy precipitation',
      recommendedAction: 'Dispatch motor grader MG-02 for aggregate gravel grading on western ramp',
      timestamp: '28 min ago'
    },
    {
      id: 'RSK-079',
      mine: 'Tirodi Mine',
      level: 'Medium',
      category: 'Equipment Wear',
      probability: '42%',
      expectedImpact: '-95 T/day Deficit',
      confidence: '93.5%',
      primaryDriver: 'Primary Jaw Crusher bearing vibration harmonic at 4.8 mm/s',
      recommendedAction: 'Schedule 45-min planned lubricating purge during shift changeover at 16:00',
      timestamp: '1 hr ago'
    },
    {
      id: 'RSK-074',
      mine: 'Gumgaon Mine',
      level: 'Low',
      category: 'Grade Dilution',
      probability: '18%',
      expectedImpact: '-30 T/day Deficit',
      confidence: '89.0%',
      primaryDriver: 'Silica-rich wall rock contamination in stope 4B blasting sequence',
      recommendedAction: 'Adjust blending ratio at surface screening plant with 42% high-grade stockpile',
      timestamp: '2 hrs ago'
    }
  ],

  trustPillars: [
    {
      name: 'Overall Governance Trust',
      score: 94.2,
      description: 'Composite Bayesian calibration across all model streams and sensor data nodes.',
      grade: 'Exceptional (Tier 1)',
      trend: '+0.8%'
    },
    {
      name: 'Input Data Quality',
      score: 96.5,
      description: 'IoT sensor completeness, zero packet loss rate, and satellite reflectance clarity.',
      grade: 'High Fidelity',
      trend: '+1.1%'
    },
    {
      name: 'Model Certainty',
      score: 92.8,
      description: 'Prediction variance margin and ensemble stability under adverse rainfall shocks.',
      grade: 'Robust',
      trend: '-0.3%'
    },
    {
      name: 'Signal Stability',
      score: 95.1,
      description: 'Zero drift in real-time telemetry from underground shaft vibration & pit piezometers.',
      grade: 'Calibrated',
      trend: '+0.4%'
    },
    {
      name: 'Historical Verification',
      score: 93.4,
      description: 'Backtested production accuracy against MOIL audited shift reports over 180 days.',
      grade: 'Audited',
      trend: '+1.5%'
    }
  ],

  fleetAssets: [
    { id: 'EX-01', type: 'Hydraulic Excavator (2.5 m³)', mine: 'Dongri Buzurg', health: 94, vibration: '1.2 mm/s', temp: '68°C', rulHours: 420, status: 'Optimal' },
    { id: 'DP-104', type: 'Heavy Dumper (35 Tonne)', mine: 'Dongri Buzurg', health: 88, vibration: '2.4 mm/s', temp: '82°C', rulHours: 280, status: 'Operational' },
    { id: 'CR-01', type: 'Primary Jaw Crusher (300 TPH)', mine: 'Balaghat Mine', health: 71, vibration: '4.8 mm/s', temp: '94°C', rulHours: 64, status: 'Warning' },
    { id: 'WD-02', type: 'Underground Winder Hoist (12T)', mine: 'Balaghat Mine', health: 96, vibration: '0.8 mm/s', temp: '54°C', rulHours: 680, status: 'Optimal' },
    { id: 'PU-08', type: 'Centrifugal Sump Pump (150 HP)', mine: 'Gumgaon Mine', health: 82, vibration: '3.1 mm/s', temp: '76°C', rulHours: 190, status: 'Operational' }
  ]
};
