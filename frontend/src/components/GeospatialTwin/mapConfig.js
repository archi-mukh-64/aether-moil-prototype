/**
 * MOIL Canonical Geospatial Mine Coordinates & Spatial Configuration
 * WGS84 Geographic Datums & Mine Specifications from Official MOIL Annual Report 2024-25
 * 10 Core Canonical Mines with 100% Distinct Geographic & Operational Spatial Topographies
 */

export const MINE_SPATIAL_REGISTRY = {
  'balaghat': {
    id: 'balaghat',
    name: 'Balaghat Mine',
    state: 'Madhya Pradesh',
    district: 'Balaghat',
    mineType: 'Underground Deep Shaft',
    coordinates: [21.8499, 80.2267], // [Lat, Lng]
    coordinatesDMS: '21°50\'59.8"N 80°13\'36.2"E',
    elevation: '+312m MSL',
    deepestHorizon: '-385m Level',
    datum: 'WGS84 / EPSG:4326',
    leaseAreaHa: 180.5,
    spatialSeed: 101,
    oreGrade: '44.2% Mn (High-Grade Braunite)',
    waterTableDepth: '-140m Horizon',

    // Unique Topographic Benches & Spatial Contours
    benches: [
      { rx: 0.44, ry: 0.35, yOff: -0.06, rl: '+340m RL', color: '#685c4e', stroke: '#857564' },
      { rx: 0.36, ry: 0.28, yOff: -0.02, rl: '+310m RL', color: '#594e42', stroke: '#736454' },
      { rx: 0.28, ry: 0.22, yOff: 0.03, rl: '+280m RL', color: '#4a4136', stroke: '#615446' },
      { rx: 0.18, ry: 0.14, yOff: 0.08, rl: '+240m Pit Floor', color: '#3c342b', stroke: '#504538' }
    ],

    // Unique Haulage Network Routes
    haulRoutes: [
      {
        id: 'HR-01',
        name: 'Main Surface Conveyor to Rail Siding',
        points: [[0.22, 0.18], [0.38, 0.14], [0.58, 0.16], [0.78, 0.22], [0.88, 0.34]],
        nominalSpeed: '32 km/h'
      },
      {
        id: 'HR-02',
        name: 'Deep Incline Drift Route to Stope 04',
        points: [[0.88, 0.34], [0.74, 0.46], [0.52, 0.44], [0.36, 0.54], [0.46, 0.68]],
        nominalSpeed: '16 km/h'
      }
    ],

    // Unique Live IoT Telemetry Nodes
    telemetryNodes: [
      { id: 'PZ-BG-01', type: 'PIEZOMETER', name: 'Deep Aquifer Piezometer', rx: 0.28, ry: 0.32, value: '14.2m WTL', status: 'OPTIMAL', threshold: '18.0m' },
      { id: 'VB-BG-02', type: 'VIBRATION', name: 'Shaft 01 Triaxial Geophone', rx: 0.52, ry: 0.22, value: '1.4 mm/s', status: 'OPTIMAL', threshold: '3.5 mm/s' },
      { id: 'SM-BG-03', type: 'SUMP_RADAR', name: 'Shaft Bottom Sump Level', rx: 0.48, ry: 0.74, value: '62% Cap (180 m³/h)', status: 'OPTIMAL', threshold: '85%' },
      { id: 'VN-BG-04', type: 'VENTILATION', name: 'Upcast Shaft Airflow Anemometer', rx: 0.65, ry: 0.28, value: '14.8 m/s', status: 'OPTIMAL', threshold: '12.0 m/s' }
    ],

    // Unique Infrastructure
    infrastructure: [
      { id: 'INF-01', name: 'Main Production Hoist Tower', type: 'SHAFT', rx: 0.52, ry: 0.22, status: 'OPTIMAL' },
      { id: 'INF-02', name: 'Primary Gyratory Sizing Crusher', type: 'CRUSHER', rx: 0.64, ry: 0.32, status: 'OPTIMAL' },
      { id: 'INF-03', name: 'High-Grade ROM Stockyard 01', type: 'STOCKPILE', rx: 0.78, ry: 0.24, status: 'OPTIMAL' },
      { id: 'INF-04', name: 'Shaft Bottom Dewatering Sump (-185m)', type: 'SUMP', rx: 0.48, ry: 0.74, status: 'OPTIMAL' }
    ]
  },

  'tirodi': {
    id: 'tirodi',
    name: 'Tirodi Mine',
    state: 'Madhya Pradesh',
    district: 'Balaghat',
    mineType: 'Opencast Terraced Benches',
    coordinates: [21.6881, 79.7153],
    coordinatesDMS: '21°41\'17.2"N 79°42\'55.1"E',
    elevation: '+345m MSL',
    deepestHorizon: '+220m Lowest Bench',
    datum: 'WGS84 / EPSG:4326',
    leaseAreaHa: 214.0,
    spatialSeed: 102,
    oreGrade: '39.5% Mn (Siliceous Lode)',
    waterTableDepth: '+260m Pit Sump',

    benches: [
      { rx: 0.48, ry: 0.38, yOff: -0.04, rl: '+360m Highwall', color: '#6e5a46', stroke: '#8c735a' },
      { rx: 0.40, ry: 0.31, yOff: 0.01, rl: '+330m Bench 05', color: '#5f4d3c', stroke: '#7b634d' },
      { rx: 0.31, ry: 0.24, yOff: 0.06, rl: '+290m Bench 03', color: '#4f4032', stroke: '#685341' },
      { rx: 0.22, ry: 0.16, yOff: 0.11, rl: '+250m Bench 01', color: '#403328', stroke: '#564435' },
      { rx: 0.14, ry: 0.09, yOff: 0.15, rl: '+220m Floor', color: '#31271e', stroke: '#443529' }
    ],

    haulRoutes: [
      {
        id: 'HR-01',
        name: 'Spiral In-Pit Ramp Corridor',
        points: [[0.18, 0.24], [0.34, 0.36], [0.58, 0.42], [0.76, 0.52], [0.62, 0.68]],
        nominalSpeed: '22 km/h'
      },
      {
        id: 'HR-02',
        name: 'Overburden Waste Dump Haul Route',
        points: [[0.18, 0.24], [0.12, 0.45], [0.24, 0.68], [0.38, 0.82]],
        nominalSpeed: '28 km/h'
      }
    ],

    telemetryNodes: [
      { id: 'SL-TR-01', type: 'SLOPE_RADAR', name: 'North Highwall Slope Inclinometer', rx: 0.44, ry: 0.22, value: '0.4 mm/week', status: 'OPTIMAL', threshold: '2.0 mm/week' },
      { id: 'RF-TR-02', type: 'RAIN_GAUGE', name: 'Quarry Automatic Weather Station', rx: 0.82, ry: 0.18, value: '0.0 mm/h', status: 'OPTIMAL', threshold: '25.0 mm/h' },
      { id: 'SM-TR-03', type: 'SUMP_RADAR', name: 'Central Sump Basin Depth', rx: 0.42, ry: 0.68, value: '38% Level (140 m³/h)', status: 'OPTIMAL', threshold: '80%' },
      { id: 'DS-TR-04', type: 'DUST_SENSOR', name: 'Haul Road PM10 Sensor', rx: 0.58, ry: 0.42, value: '42 µg/m³', status: 'OPTIMAL', threshold: '100 µg/m³' }
    ],

    infrastructure: [
      { id: 'INF-01', name: 'North Highwall Extraction Bench 06', type: 'BENCH', rx: 0.44, ry: 0.36, status: 'OPTIMAL' },
      { id: 'INF-02', name: 'In-Pit Jaw Crusher Station', type: 'CRUSHER', rx: 0.62, ry: 0.62, status: 'OPTIMAL' },
      { id: 'INF-03', name: 'West Overburden Waste Dump', type: 'WASTE', rx: 0.24, ry: 0.68, status: 'OPTIMAL' },
      { id: 'INF-04', name: 'Central Pit Floor Sump Basin', type: 'SUMP', rx: 0.42, ry: 0.68, status: 'OPTIMAL' }
    ]
  },

  'ukwa': {
    id: 'ukwa',
    name: 'Ukwa Mine',
    state: 'Madhya Pradesh',
    district: 'Balaghat',
    mineType: 'Underground Adit & Incline',
    coordinates: [21.9681, 80.4681],
    coordinatesDMS: '21°58\'05.2"N 80°28\'05.2"E',
    elevation: '+620m MSL', // High Altitude Ridge
    deepestHorizon: '+440m Adit Level',
    datum: 'WGS84 / EPSG:4326',
    leaseAreaHa: 198.0,
    spatialSeed: 103,
    oreGrade: '42.1% Mn (Low Phosphorus)',
    waterTableDepth: '+480m Mountain Adit',

    benches: [
      { rx: 0.42, ry: 0.32, yOff: -0.08, rl: '+620m Mountain Crest', color: '#4a5948', stroke: '#61755f' },
      { rx: 0.34, ry: 0.25, yOff: -0.02, rl: '+560m Portal Level', color: '#3d4a3b', stroke: '#51634f' },
      { rx: 0.26, ry: 0.18, yOff: 0.04, rl: '+500m Adit Crosscut', color: '#303b2e', stroke: '#41513f' },
      { rx: 0.16, ry: 0.10, yOff: 0.10, rl: '+440m Deepest Stope', color: '#242c22', stroke: '#323f2b' }
    ],

    haulRoutes: [
      {
        id: 'HR-01',
        name: 'Adit Portal Narrow-Gauge Rail Track',
        points: [[0.28, 0.22], [0.42, 0.26], [0.62, 0.32], [0.82, 0.45]],
        nominalSpeed: '18 km/h'
      }
    ],

    telemetryNodes: [
      { id: 'AD-UK-01', type: 'FLOW_SENSOR', name: 'Main Adit Gravity Discharge Flume', rx: 0.36, ry: 0.42, value: '85 m³/h', status: 'OPTIMAL', threshold: '220 m³/h' },
      { id: 'GS-UK-02', type: 'GAS_SENSOR', name: 'Underground Stope CH4 & CO Sensor', rx: 0.54, ry: 0.38, value: '0.00% CH4', status: 'OPTIMAL', threshold: '0.50%' },
      { id: 'TP-UK-03', type: 'TEMP_SENSOR', name: 'Deep Adit Incline Ambient Temp', rx: 0.68, ry: 0.34, value: '26.4°C', status: 'OPTIMAL', threshold: '34.0°C' }
    ],

    infrastructure: [
      { id: 'INF-01', name: 'Main Adit Portal & Rail Haulage', type: 'ADIT', rx: 0.42, ry: 0.26, status: 'OPTIMAL' },
      { id: 'INF-02', name: 'Low-Phosphorus Beneficiation Plant', type: 'PLANT', rx: 0.72, ry: 0.36, status: 'OPTIMAL' },
      { id: 'INF-03', name: 'Adit Drainage Discharge Channel', type: 'SUMP', rx: 0.36, ry: 0.42, status: 'OPTIMAL' }
    ]
  },

  'munsar': {
    id: 'munsar',
    name: 'Munsar Mine',
    state: 'Maharashtra',
    district: 'Nagpur',
    mineType: 'Underground Deep Shaft',
    coordinates: [21.4012, 79.2905],
    coordinatesDMS: '21°24\'04.3"N 79°17\'25.8"E',
    elevation: '+328m MSL',
    deepestHorizon: '-160m Level',
    datum: 'WGS84 / EPSG:4326',
    leaseAreaHa: 142.0,
    spatialSeed: 104,
    oreGrade: '38.6% Mn (Pyrolusite Horizon)',
    waterTableDepth: '-110m Horizon',

    benches: [
      { rx: 0.43, ry: 0.34, yOff: -0.05, rl: '+330m Surface', color: '#6b5443', stroke: '#8a6e57' },
      { rx: 0.34, ry: 0.26, yOff: 0.01, rl: '-80m Level', color: '#594435', stroke: '#755945' },
      { rx: 0.24, ry: 0.18, yOff: 0.07, rl: '-160m Shaft Bottom', color: '#453326', stroke: '#5d4432' }
    ],

    haulRoutes: [
      {
        id: 'HR-01',
        name: 'Munsar North-South Haulage Corridor',
        points: [[0.24, 0.28], [0.46, 0.32], [0.68, 0.44], [0.82, 0.58]],
        nominalSpeed: '26 km/h'
      }
    ],

    telemetryNodes: [
      { id: 'PZ-MN-01', type: 'PIEZOMETER', name: 'Shaft Aquifer Hydro-Sensor', rx: 0.32, ry: 0.38, value: '11.8m WTL', status: 'OPTIMAL', threshold: '16.5m' },
      { id: 'VB-MN-02', type: 'VIBRATION', name: 'Main Winder Rope Dynamic Load', rx: 0.52, ry: 0.26, value: '1.2 mm/s', status: 'OPTIMAL', threshold: '3.0 mm/s' },
      { id: 'SM-MN-03', type: 'SUMP_RADAR', name: 'Sump Basin Water Elevation', rx: 0.46, ry: 0.68, value: '44% Level', status: 'OPTIMAL', threshold: '80%' }
    ],

    infrastructure: [
      { id: 'INF-01', name: 'Munsar Vertical Production Shaft', type: 'SHAFT', rx: 0.52, ry: 0.26, status: 'OPTIMAL' },
      { id: 'INF-02', name: 'Surface Manganese Screening Plant', type: 'CRUSHER', rx: 0.68, ry: 0.44, status: 'OPTIMAL' },
      { id: 'INF-03', name: 'Underground Horizon Sump Station', type: 'SUMP', rx: 0.46, ry: 0.68, status: 'OPTIMAL' }
    ]
  },

  'kandri': {
    id: 'kandri',
    name: 'Kandri Mine',
    state: 'Maharashtra',
    district: 'Nagpur',
    mineType: 'Underground Deep Shaft',
    coordinates: [21.4178, 79.2689],
    coordinatesDMS: '21°25\'04.1"N 79°16\'08.0"E',
    elevation: '+335m MSL',
    deepestHorizon: '-180m Level',
    datum: 'WGS84 / EPSG:4326',
    leaseAreaHa: 165.0,
    spatialSeed: 105,
    oreGrade: '40.4% Mn (Compact Gondite)',
    waterTableDepth: '-120m Horizon',

    benches: [
      { rx: 0.45, ry: 0.35, yOff: -0.04, rl: '+335m Surface Collar', color: '#685e49', stroke: '#85795f' },
      { rx: 0.35, ry: 0.27, yOff: 0.02, rl: '-90m Extraction Level', color: '#564d3a', stroke: '#71654c' },
      { rx: 0.23, ry: 0.17, yOff: 0.08, rl: '-180m Deepest Sump', color: '#423b2b', stroke: '#5a4f38' }
    ],

    haulRoutes: [
      {
        id: 'HR-01',
        name: 'Kandri Surface ROM Dispatch Route',
        points: [[0.19, 0.22], [0.42, 0.34], [0.65, 0.48], [0.85, 0.62]],
        nominalSpeed: '28 km/h'
      }
    ],

    telemetryNodes: [
      { id: 'PZ-KD-01', type: 'PIEZOMETER', name: 'Kandri Piezometer Well 02', rx: 0.34, ry: 0.32, value: '13.4m WTL', status: 'OPTIMAL', threshold: '17.0m' },
      { id: 'SM-KD-02', type: 'SUMP_RADAR', name: 'Deep Dewatering Sump Battery', rx: 0.44, ry: 0.72, value: '51% Level', status: 'OPTIMAL', threshold: '82%' }
    ],

    infrastructure: [
      { id: 'INF-01', name: 'Kandri Deep Shaft Headgear', type: 'SHAFT', rx: 0.50, ry: 0.28, status: 'OPTIMAL' },
      { id: 'INF-02', name: 'Primary Crushing & Loading Hoppers', type: 'CRUSHER', rx: 0.65, ry: 0.48, status: 'OPTIMAL' },
      { id: 'INF-03', name: 'Submersible Sump Battery', type: 'SUMP', rx: 0.44, ry: 0.72, status: 'OPTIMAL' }
    ]
  },

  'gumgaon': {
    id: 'gumgaon',
    name: 'Gumgaon Mine',
    state: 'Maharashtra',
    district: 'Nagpur',
    mineType: 'Underground Deep Shaft',
    coordinates: [21.3917, 78.9861],
    coordinatesDMS: '21°23\'30.1"N 78°59\'10.0"E',
    elevation: '+315m MSL',
    deepestHorizon: '-240m Level',
    datum: 'WGS84 / EPSG:4326',
    leaseAreaHa: 130.0,
    spatialSeed: 106,
    oreGrade: '43.5% Mn (Braunite Horizon)',
    waterTableDepth: '-150m Horizon',

    benches: [
      { rx: 0.44, ry: 0.34, yOff: -0.05, rl: '+315m Surface', color: '#52605c', stroke: '#6d7f7a' },
      { rx: 0.33, ry: 0.25, yOff: 0.01, rl: '-120m Intermediate Level', color: '#414d4a', stroke: '#586763' },
      { rx: 0.21, ry: 0.15, yOff: 0.08, rl: '-240m Sump Horizon', color: '#303936', stroke: '#424e4b' }
    ],

    haulRoutes: [
      {
        id: 'HR-01',
        name: 'Jigging Plant Conveyor Feeder Loop',
        points: [[0.22, 0.32], [0.48, 0.36], [0.72, 0.45], [0.86, 0.56]],
        nominalSpeed: '24 km/h'
      }
    ],

    telemetryNodes: [
      { id: 'PZ-GG-01', type: 'PIEZOMETER', name: 'Gumgaon Water Table Monitor', rx: 0.38, ry: 0.34, value: '12.1m WTL', status: 'OPTIMAL', threshold: '16.0m' },
      { id: 'SM-GG-02', type: 'SUMP_RADAR', name: 'Deep Dewatering Basin Flow', rx: 0.45, ry: 0.70, value: '48% Cap', status: 'OPTIMAL', threshold: '80%' }
    ],

    infrastructure: [
      { id: 'INF-01', name: 'Gumgaon Main Skip Shaft', type: 'SHAFT', rx: 0.50, ry: 0.26, status: 'OPTIMAL' },
      { id: 'INF-02', name: 'Ore Beneficiation Jigging Plant', type: 'PLANT', rx: 0.72, ry: 0.45, status: 'OPTIMAL' },
      { id: 'INF-03', name: 'Deep Horizon Dewatering Basin', type: 'SUMP', rx: 0.45, ry: 0.70, status: 'OPTIMAL' }
    ]
  },

  'chikla': {
    id: 'chikla',
    name: 'Chikla Mine',
    state: 'Maharashtra',
    district: 'Bhandara',
    mineType: 'Underground Deep Shaft',
    coordinates: [21.5458, 79.7522],
    coordinatesDMS: '21°32\'44.9"N 79°45\'07.9"E',
    elevation: '+342m MSL',
    deepestHorizon: '-210m Level',
    datum: 'WGS84 / EPSG:4326',
    leaseAreaHa: 172.0,
    spatialSeed: 107,
    oreGrade: '41.2% Mn (Lump Ore Zone)',
    waterTableDepth: '-135m Horizon',

    benches: [
      { rx: 0.45, ry: 0.35, yOff: -0.05, rl: '+342m Surface', color: '#684d4b', stroke: '#876461' },
      { rx: 0.35, ry: 0.27, yOff: 0.01, rl: '-100m Level', color: '#573f3d', stroke: '#735250' },
      { rx: 0.22, ry: 0.16, yOff: 0.08, rl: '-210m Deep Stope', color: '#44302f', stroke: '#5c4140' }
    ],

    haulRoutes: [
      {
        id: 'HR-01',
        name: 'Chikla North Sizing Loop',
        points: [[0.24, 0.24], [0.48, 0.32], [0.74, 0.46], [0.86, 0.62]],
        nominalSpeed: '25 km/h'
      }
    ],

    telemetryNodes: [
      { id: 'PZ-CK-01', type: 'PIEZOMETER', name: 'Chikla North Piezometer', rx: 0.36, ry: 0.36, value: '15.2m WTL', status: 'OPTIMAL', threshold: '19.0m' },
      { id: 'SM-CK-02', type: 'SUMP_RADAR', name: 'Sub-surface Infiltration Sump', rx: 0.46, ry: 0.72, value: '55% Level', status: 'OPTIMAL', threshold: '84%' }
    ],

    infrastructure: [
      { id: 'INF-01', name: 'Chikla North Shaft Winder Tower', type: 'SHAFT', rx: 0.50, ry: 0.24, status: 'OPTIMAL' },
      { id: 'INF-02', name: 'Gondite Manganese Sizing Unit', type: 'CRUSHER', rx: 0.74, ry: 0.46, status: 'OPTIMAL' },
      { id: 'INF-03', name: 'Sub-surface Infiltration Sump', type: 'SUMP', rx: 0.46, ry: 0.72, status: 'OPTIMAL' }
    ]
  },

  'dongri-buzurg': {
    id: 'dongri-buzurg',
    name: 'Dongri Buzurg Mine',
    state: 'Maharashtra',
    district: 'Bhandara',
    mineType: 'Opencast Terraced Benches',
    coordinates: [21.5542, 79.6917],
    coordinatesDMS: '21°33\'15.1"N 79°41\'30.1"E',
    elevation: '+330m MSL',
    deepestHorizon: '+205m Pit Bottom',
    datum: 'WGS84 / EPSG:4326',
    leaseAreaHa: 220.0,
    spatialSeed: 108,
    oreGrade: '46.0% Mn (Ultra High-Grade Dioxide)',
    waterTableDepth: '+240m Pit Floor',

    benches: [
      { rx: 0.49, ry: 0.39, yOff: -0.04, rl: '+330m Surface Highwall', color: '#6e5d48', stroke: '#8c775d' },
      { rx: 0.42, ry: 0.32, yOff: 0.00, rl: '+300m Bench 06', color: '#5f4f3d', stroke: '#7b674f' },
      { rx: 0.34, ry: 0.25, yOff: 0.05, rl: '+270m Bench 04', color: '#4f4031', stroke: '#695541' },
      { rx: 0.25, ry: 0.18, yOff: 0.10, rl: '+240m Bench 02', color: '#3f3226', stroke: '#564433' },
      { rx: 0.15, ry: 0.10, yOff: 0.15, rl: '+205m Deepest Pit Floor', color: '#30251c', stroke: '#423326' }
    ],

    haulRoutes: [
      {
        id: 'HR-01',
        name: 'South Highwall Primary Haul Ramp',
        points: [[0.16, 0.22], [0.38, 0.34], [0.62, 0.44], [0.82, 0.54], [0.65, 0.72]],
        nominalSpeed: '28 km/h'
      },
      {
        id: 'HR-02',
        name: 'EMD Chemical Plant Feed Corridor',
        points: [[0.82, 0.54], [0.88, 0.38], [0.78, 0.22]],
        nominalSpeed: '30 km/h'
      }
    ],

    telemetryNodes: [
      { id: 'SL-DB-01', type: 'SLOPE_RADAR', name: 'South Highwall Real-time Radar', rx: 0.48, ry: 0.24, value: '0.2 mm/week', status: 'OPTIMAL', threshold: '1.8 mm/week' },
      { id: 'SM-DB-02', type: 'SUMP_RADAR', name: 'Central Dewatering Sump Pond', rx: 0.45, ry: 0.70, value: '35% Cap (210 m³/h)', status: 'OPTIMAL', threshold: '80%' },
      { id: 'PL-DB-03', type: 'EMD_SENSOR', name: 'EMD Chemical Plant Output Sensor', rx: 0.78, ry: 0.22, value: '98.4% Purity', status: 'OPTIMAL', threshold: '95.0%' }
    ],

    infrastructure: [
      { id: 'INF-01', name: 'South Highwall Pit Extraction Face', type: 'BENCH', rx: 0.48, ry: 0.36, status: 'OPTIMAL' },
      { id: 'INF-02', name: 'Electrolytic Dioxide Manganese (EMD) Plant', type: 'PLANT', rx: 0.78, ry: 0.22, status: 'OPTIMAL' },
      { id: 'INF-03', name: 'Central Dewatering Sump Pond', type: 'SUMP', rx: 0.45, ry: 0.70, status: 'OPTIMAL' }
    ]
  },

  'ramtek': {
    id: 'ramtek',
    name: 'Ramtek Operations',
    state: 'Maharashtra',
    district: 'Nagpur',
    mineType: 'Opencast Mining & Beneficiation',
    coordinates: [21.3981, 79.3289],
    coordinatesDMS: '21°23\'53.2"N 79°19\'44.0"E',
    elevation: '+325m MSL',
    deepestHorizon: '+260m Pit Floor',
    datum: 'WGS84 / EPSG:4326',
    leaseAreaHa: 110.0,
    spatialSeed: 109,
    oreGrade: '37.0% Mn (Medium Grade)',
    waterTableDepth: '+280m Pit Floor',

    benches: [
      { rx: 0.44, ry: 0.34, yOff: -0.04, rl: '+325m Surface', color: '#655e4e', stroke: '#827964' },
      { rx: 0.34, ry: 0.26, yOff: 0.02, rl: '+290m Bench 02', color: '#544e40', stroke: '#6e6653' },
      { rx: 0.22, ry: 0.16, yOff: 0.09, rl: '+260m Quarry Floor', color: '#423d31', stroke: '#585141' }
    ],

    haulRoutes: [
      {
        id: 'HR-01',
        name: 'Ramtek Quarry Access Haul Route',
        points: [[0.22, 0.26], [0.46, 0.38], [0.72, 0.52]],
        nominalSpeed: '25 km/h'
      }
    ],

    telemetryNodes: [
      { id: 'SM-RK-01', type: 'SUMP_RADAR', name: 'Quarry Retention Basin Level', rx: 0.46, ry: 0.68, value: '42% Cap', status: 'OPTIMAL', threshold: '80%' }
    ],

    infrastructure: [
      { id: 'INF-01', name: 'Ramtek Terraced Quarry Face 03', type: 'BENCH', rx: 0.46, ry: 0.38, status: 'OPTIMAL' },
      { id: 'INF-02', name: 'Mobile Tracked Crusher Unit', type: 'CRUSHER', rx: 0.72, ry: 0.52, status: 'OPTIMAL' },
      { id: 'INF-03', name: 'Quarry Dewatering Retention Sump', type: 'SUMP', rx: 0.46, ry: 0.68, status: 'OPTIMAL' }
    ]
  },

  'bhandara': {
    id: 'bhandara',
    name: 'Bhandara Operations',
    state: 'Maharashtra',
    district: 'Bhandara',
    mineType: 'Opencast Mining & Exploration',
    coordinates: [21.4681, 79.5881],
    coordinatesDMS: '21°28\'05.2"N 79°35\'17.2"E',
    elevation: '+318m MSL',
    deepestHorizon: '+270m Pit Floor',
    datum: 'WGS84 / EPSG:4326',
    leaseAreaHa: 105.0,
    spatialSeed: 110,
    oreGrade: '38.2% Mn (Exploration Horizon)',
    waterTableDepth: '+285m Pit Floor',

    benches: [
      { rx: 0.43, ry: 0.33, yOff: -0.04, rl: '+318m Surface', color: '#635d56', stroke: '#80776e' },
      { rx: 0.33, ry: 0.25, yOff: 0.02, rl: '+295m Bench 01', color: '#514c46', stroke: '#6c655d' },
      { rx: 0.21, ry: 0.15, yOff: 0.08, rl: '+270m Exploration Floor', color: '#3f3b36', stroke: '#56504a' }
    ],

    haulRoutes: [
      {
        id: 'HR-01',
        name: 'Bhandara Outer Logistics Road',
        points: [[0.26, 0.28], [0.52, 0.36], [0.78, 0.54]],
        nominalSpeed: '28 km/h'
      }
    ],

    telemetryNodes: [
      { id: 'SM-BH-01', type: 'SUMP_RADAR', name: 'Beldongri Pit Sump Radar', rx: 0.48, ry: 0.68, value: '36% Cap', status: 'OPTIMAL', threshold: '80%' }
    ],

    infrastructure: [
      { id: 'INF-01', name: 'Beldongri-Bhandara Open Pit Bench', type: 'BENCH', rx: 0.52, ry: 0.36, status: 'OPTIMAL' },
      { id: 'INF-02', name: 'ROM Secondary Sizing Hopper', type: 'CRUSHER', rx: 0.78, ry: 0.54, status: 'OPTIMAL' },
      { id: 'INF-03', name: 'Pit Sump Dewatering Station', type: 'SUMP', rx: 0.48, ry: 0.68, status: 'OPTIMAL' }
    ]
  }
};
