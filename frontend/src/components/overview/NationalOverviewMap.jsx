import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext.jsx';
import { 
  Layers, 
  Map as MapIcon, 
  Compass, 
  RotateCcw, 
  Search, 
  ZoomIn, 
  ZoomOut, 
  ChevronRight, 
  ShieldAlert, 
  Activity,
  Maximize2
} from 'lucide-react';

// Custom Map Controller for programmatic zoom and pan
function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export const NationalOverviewMap = ({ onSelectMine }) => {
  const { activeMine, selectedMineId, setSelectedMineId, t, lang } = useApp();
  const [baseLayer, setBaseLayer] = useState('TERRAIN'); // 'TERRAIN', 'SATELLITE', 'STREET'
  const [showProspectivity, setShowProspectivity] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapZoom, setMapZoom] = useState(5.4);
  const [mapCenter, setMapCenter] = useState([22.2, 79.8]);

  // Canonical 10 MOIL Mines with precise WGS84 coordinates
  const moilMines = useMemo(() => [
    {
      id: 'balaghat',
      name: 'Balaghat Mine',
      state: 'Madhya Pradesh',
      district: 'Balaghat',
      lat: 21.8499,
      lng: 80.2267,
      status: 'CRITICAL',
      production: '4,818 T',
      target: '6,200 T',
      gap: '-1,382 MT',
      grade: '44.2% Mn',
      risk: 'HIGH RISK',
      type: 'Underground Deep Shaft',
      pass: '26 Aug 2026'
    },
    {
      id: 'tirodi',
      name: 'Tirodi Mine',
      state: 'Madhya Pradesh',
      district: 'Balaghat',
      lat: 21.6881,
      lng: 79.7153,
      status: 'CRITICAL',
      production: '2,344 T',
      target: '3,100 T',
      gap: '-756 MT',
      grade: '39.4% Mn',
      risk: 'ELEVATED',
      type: 'Opencast Benches',
      pass: '26 Aug 2026'
    },
    {
      id: 'ukwa',
      name: 'Ukwa Mine',
      state: 'Madhya Pradesh',
      district: 'Balaghat',
      lat: 21.9681,
      lng: 80.4681,
      status: 'CRITICAL',
      production: '1,484 T',
      target: '1,850 T',
      gap: '-366 MT',
      grade: '41.8% Mn',
      risk: 'MODERATE',
      type: 'Underground Adit',
      pass: '26 Aug 2026'
    },
    {
      id: 'munsar',
      name: 'Munsar Mine',
      state: 'Maharashtra',
      district: 'Nagpur',
      lat: 21.4012,
      lng: 79.2905,
      status: 'WATCH',
      production: '1,887 T',
      target: '2,400 T',
      gap: '-513 MT',
      grade: '38.6% Mn',
      risk: 'WATCH',
      type: 'Underground Deep Shaft',
      pass: '25 Aug 2026'
    },
    {
      id: 'kandri',
      name: 'Kandri Mine',
      state: 'Maharashtra',
      district: 'Nagpur',
      lat: 21.4178,
      lng: 79.2689,
      status: 'WATCH',
      production: '2,210 T',
      target: '2,800 T',
      gap: '-590 MT',
      grade: '42.5% Mn',
      risk: 'WATCH',
      type: 'Underground Deep Shaft',
      pass: '25 Aug 2026'
    },
    {
      id: 'gumgaon',
      name: 'Gumgaon Mine',
      state: 'Maharashtra',
      district: 'Nagpur',
      lat: 21.3917,
      lng: 78.9861,
      status: 'OPTIMAL',
      production: '2,605 T',
      target: '3,400 T',
      gap: '-795 MT',
      grade: '43.8% Mn',
      risk: 'NOMINAL',
      type: 'Underground Deep Shaft',
      pass: '25 Aug 2026'
    },
    {
      id: 'chikla',
      name: 'Chikla Mine',
      state: 'Maharashtra',
      district: 'Bhandara',
      lat: 21.5458,
      lng: 79.7522,
      status: 'OPTIMAL',
      production: '3,194 T',
      target: '4,100 T',
      gap: '-906 MT',
      grade: '40.5% Mn',
      risk: 'NOMINAL',
      type: 'Underground Deep Shaft',
      pass: '26 Aug 2026'
    },
    {
      id: 'dongri-buzurg',
      name: 'Dongri Buzurg Mine',
      state: 'Maharashtra',
      district: 'Bhandara',
      lat: 21.5542,
      lng: 79.6917,
      status: 'OPTIMAL',
      production: '4,018 T',
      target: '5,400 T',
      gap: '-1,382 MT',
      grade: '42.0% Mn',
      risk: 'NOMINAL',
      type: 'Opencast Benches',
      pass: '26 Aug 2026'
    },
    {
      id: 'ramtek',
      name: 'Ramtek Operations',
      state: 'Maharashtra',
      district: 'Nagpur',
      lat: 21.3981,
      lng: 79.3289,
      status: 'OPTIMAL',
      production: '1,236 T',
      target: '1,600 T',
      gap: '-364 MT',
      grade: '37.8% Mn',
      risk: 'NOMINAL',
      type: 'Opencast Terraces',
      pass: '25 Aug 2026'
    },
    {
      id: 'bhandara',
      name: 'Bhandara Operations',
      state: 'Maharashtra',
      district: 'Bhandara',
      lat: 21.4681,
      lng: 79.5881,
      status: 'OPTIMAL',
      production: '1,525 T',
      target: '1,950 T',
      gap: '-425 MT',
      grade: '39.2% Mn',
      risk: 'NOMINAL',
      type: 'Opencast Benches',
      pass: '26 Aug 2026'
    }
  ], []);

  // Central Sausar Manganese Belt Geological Prospectivity Zone
  const sausarBeltPolygon = [
    [22.20, 80.60],
    [22.05, 80.70],
    [21.65, 80.35],
    [21.30, 79.90],
    [21.20, 79.40],
    [21.25, 78.80],
    [21.55, 78.90],
    [21.75, 79.50],
    [21.95, 80.10],
    [22.20, 80.60]
  ];

  // Tile Layer Providers
  const tileUrls = {
    TERRAIN: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    SATELLITE: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    STREET: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
  };

  // Custom Leaflet DivIcon Generator matching Reference Image 1
  const createCustomPin = (mine, isSelected) => {
    const isCrit = mine.status === 'CRITICAL';
    const isWatch = mine.status === 'WATCH';
    const color = isSelected ? '#0284c7' : isCrit ? '#dc2626' : isWatch ? '#d97706' : '#16a34a';

    return L.divIcon({
      className: 'custom-mine-pin',
      html: `
        <div style="position: relative; display: flex; align-items: center; justify-content: center; width: 32px; height: 32px;">
          ${isSelected ? `<div style="position: absolute; width: 30px; height: 30px; border-radius: 50%; border: 2px solid #0284c7; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; opacity: 0.75;"></div>` : ''}
          <div style="width: ${isSelected ? '16px' : '12px'}; height: ${isSelected ? '16px' : '12px'}; border-radius: 50%; background-color: ${color}; border: 2px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.4);"></div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 16]
    });
  };

  const handleSelect = (mine) => {
    setSelectedMineId(mine.id);
    setMapCenter([mine.lat, mine.lng]);
    setMapZoom(8.5);
    if (onSelectMine) onSelectMine(mine);
  };

  const handleResetView = () => {
    setMapCenter([22.2, 79.8]);
    setMapZoom(5.4);
  };

  return (
    <div className="relative w-full h-[540px] sm:h-[600px] lg:h-[660px] rounded-2xl bg-[#f4f7f6] dark:bg-[#070c14] border border-[#d2e0e8] dark:border-[#162338] overflow-hidden shadow-xl select-none font-sans">
      
      {/* Top Map Toolbar (Matching Reference Image 1) */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-[500] pointer-events-none">
        
        {/* Search Mine Bar */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center px-3 py-1.5 rounded-xl bg-white/95 dark:bg-[#0c1422]/95 border border-[#cbdce6] dark:border-[#1e2f4a] backdrop-blur-md shadow-md text-xs text-zinc-800 dark:text-zinc-200">
            <Search className="w-3.5 h-3.5 text-zinc-400 mr-2" />
            <input
              type="text"
              placeholder="Search mine / location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-36 sm:w-48 text-zinc-900 dark:text-white placeholder-zinc-400"
            />
          </div>
        </div>

        {/* Layer & Basemap Toggles (Matching Reference Image 1) */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <div className="flex items-center p-0.5 rounded-xl bg-white/95 dark:bg-[#0c1422]/95 border border-[#cbdce6] dark:border-[#1e2f4a] backdrop-blur-md shadow-md text-[11px] font-medium text-zinc-700 dark:text-zinc-300">
            <button
              onClick={() => setBaseLayer('TERRAIN')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                baseLayer === 'TERRAIN' ? 'bg-[#0f3a33] text-white font-bold' : 'hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Terrain / Topo
            </button>
            <button
              onClick={() => setBaseLayer('SATELLITE')}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                baseLayer === 'SATELLITE' ? 'bg-[#0f3a33] text-white font-bold' : 'hover:text-zinc-900 dark:hover:text-white'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setShowProspectivity(prev => !prev)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                showProspectivity ? 'bg-amber-600/20 text-amber-800 dark:text-amber-300 font-bold' : 'text-zinc-500'
              }`}
            >
              Mineral Belt
            </button>
          </div>
        </div>

      </div>

      {/* Main Geographic Leaflet Map */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
        attributionControl={false}
      >
        <MapController center={mapCenter} zoom={mapZoom} />

        <TileLayer
          url={tileUrls[baseLayer] || tileUrls.TERRAIN}
          maxZoom={18}
        />

        {/* Sausar Manganese Geological Prospectivity Corridor */}
        {showProspectivity && (
          <Polygon
            positions={sausarBeltPolygon}
            pathOptions={{
              color: '#ea580c',
              fillColor: '#f59e0b',
              fillOpacity: 0.22,
              weight: 1.5,
              dashArray: '4 4'
            }}
          >
            <Tooltip sticky>
              <div className="font-mono text-xs p-1">
                <strong className="text-amber-800">{lang === 'hi' ? 'सौसर मैंगनीज अयस्क पट्टी' : lang === 'mr' ? 'सौसर मॅंगनीज पट्टा' : 'Sausar Manganese Ore Belt'}</strong>
                <div className="text-[10px] text-zinc-600">{lang === 'hi' ? 'मध्य प्रदेश-महाराष्ट्र प्रीकैम्ब्रियन रूपांतरित संस्तर' : lang === 'mr' ? 'मध्य प्रदेश-महाराष्ट्र प्रीकॅम्ब्रियन रूपांतरित स्तर' : 'Central MP-MH Precambrian Metamorphic Horizon'}</div>
              </div>
            </Tooltip>
          </Polygon>
        )}

        {/* 10 Canonical MOIL Mine Markers */}
        {moilMines.map((m) => {
          const isSelected = m.id === selectedMineId;

          return (
            <Marker
              key={m.id}
              position={[m.lat, m.lng]}
              icon={createCustomPin(m, isSelected)}
              eventHandlers={{
                click: () => handleSelect(m)
              }}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={0.95}>
                <div className="font-sans text-xs p-1 space-y-1">
                  <div className="font-bold text-zinc-900 flex items-center justify-between gap-3">
                    <span>{m.name}</span>
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono font-bold ${
                      m.status === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-zinc-500 font-mono">
                    {m.district}, {m.state} • {m.type}
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-zinc-700 pt-1 border-t border-zinc-200">
                    <span>{t?.common?.target || 'Target'}: {m.target}</span>
                    <span className="text-emerald-700">{t?.common?.grade || 'Grade'}: {m.grade}</span>
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Map Recenter & Zoom Controls */}
      <div className="absolute bottom-4 right-4 flex flex-col gap-1.5 z-[500]">
        <button
          onClick={() => setMapZoom(prev => Math.min(12, prev + 1))}
          className="w-8 h-8 rounded-xl bg-white/95 dark:bg-[#0e1624]/95 border border-zinc-300 dark:border-[#1e2f4a] text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#162338] flex items-center justify-center shadow-lg backdrop-blur-md transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => setMapZoom(prev => Math.max(4, prev - 1))}
          className="w-8 h-8 rounded-xl bg-white/95 dark:bg-[#0e1624]/95 border border-zinc-300 dark:border-[#1e2f4a] text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#162338] flex items-center justify-center shadow-lg backdrop-blur-md transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetView}
          className="w-8 h-8 rounded-xl bg-white/95 dark:bg-[#0e1624]/95 border border-zinc-300 dark:border-[#1e2f4a] text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-[#162338] flex items-center justify-center shadow-lg backdrop-blur-md transition-colors"
          title="Reset National View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 p-3 rounded-2xl bg-white/95 dark:bg-[#0b121e]/95 border border-[#cadbe6] dark:border-[#18263c] shadow-xl backdrop-blur-md z-[500] text-[11px] font-sans text-zinc-700 dark:text-zinc-300 space-y-1.5 select-none">
        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 pb-1 border-b border-zinc-200 dark:border-zinc-800">
          {lang === 'hi' ? 'मानचित्र संकेत एवं स्थिति' : lang === 'mr' ? 'नकाशा सूची व स्थिती' : 'MAP LEGEND & STATUS'}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-sm" />
          <span>{lang === 'hi' ? 'लक्ष्य पर (>85% दैनिक उत्पादन)' : lang === 'mr' ? 'उद्दिष्टावर (>85% दैनिक उत्पादन)' : 'On Target (>85% Daily Yield)'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
          <span>{lang === 'hi' ? 'जोखिम में (65% - 85% उत्पादन)' : lang === 'mr' ? 'जोखमीत (65% - 85% उत्पादन)' : 'At Risk (65% - 85% Yield)'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-sm" />
          <span>{lang === 'hi' ? 'गंभीर अंतर अलर्ट' : lang === 'mr' ? 'गंभीर तूट इशारा' : 'Critical Shortfall Alert'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-500 shadow-sm animate-pulse" />
          <span>{lang === 'hi' ? 'सक्रिय चयनित खदान' : lang === 'mr' ? 'सक्रिय निवडलेली खाण' : 'Active Selected Mine'}</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-zinc-100 dark:border-zinc-800 text-[10px] text-amber-600 dark:text-amber-400">
          <span className="w-4 h-1.5 rounded bg-amber-500/40 border border-amber-500" />
          <span>{lang === 'hi' ? 'सौसर खनिज संभावना पट्टी' : lang === 'mr' ? 'सौसर खनिज संभाव्यता पट्टा' : 'Sausar Mineral Prospectivity Belt'}</span>
        </div>
      </div>

    </div>
  );
};
