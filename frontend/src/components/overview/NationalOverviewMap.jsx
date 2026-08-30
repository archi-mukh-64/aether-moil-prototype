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
  const [baseLayer, setBaseLayer] = useState('STREET'); // 'STREET', 'SATELLITE'
  const [showProspectivity, setShowProspectivity] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapZoom, setMapZoom] = useState(5.4);
  const [mapCenter, setMapCenter] = useState([22.2, 79.8]);
  const [tileError, setTileError] = useState(false);

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
      type: 'Opencast / Underground',
      pass: '26 Aug 2026'
    },
    {
      id: 'gumgaon',
      name: 'Gumgaon Mine',
      state: 'Maharashtra',
      district: 'Nagpur',
      lat: 21.4167,
      lng: 78.9833,
      status: 'WATCH',
      production: '1,960 T',
      target: '2,500 T',
      gap: '-540 MT',
      grade: '43.1% Mn',
      risk: 'WATCH',
      type: 'Underground Incline',
      pass: '26 Aug 2026'
    },
    {
      id: 'kandri',
      name: 'Kandri Mine',
      state: 'Maharashtra',
      district: 'Nagpur',
      lat: 21.4283,
      lng: 79.2781,
      status: 'WATCH',
      production: '2,210 T',
      target: '2,800 T',
      gap: '-590 MT',
      grade: '41.0% Mn',
      risk: 'WATCH',
      type: 'Opencast Mechanized',
      pass: '26 Aug 2026'
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

  // Zero-Key Tile Layer Providers (OpenStreetMap Default)
  const tileUrls = {
    STREET: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    SATELLITE: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
  };

  // Custom Leaflet DivIcon Generator
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
    <div className="relative w-full h-[540px] sm:h-[600px] lg:h-[660px] rounded-2xl bg-[#EEF2F6] border border-[#CBD5E1] overflow-hidden shadow-md select-none font-sans">

      {/* Top Map Toolbar */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-[500] pointer-events-none">

        {/* Search Mine Bar */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <div className="flex items-center px-3.5 py-1.5 rounded-xl bg-white border border-[#CBD5E1] shadow-md text-xs text-[#0F172A]">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search mine / location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-xs w-36 sm:w-48 text-[#0F172A] placeholder-slate-400 font-semibold"
            />
          </div>
        </div>

        {/* Layer & Basemap Toggles */}
        <div className="flex items-center gap-1.5 pointer-events-auto">
          <div className="flex items-center p-1 rounded-xl bg-white border border-[#CBD5E1] shadow-md text-xs font-bold text-[#334155]">
            <button
              onClick={() => { setBaseLayer('STREET'); setTileError(false); }}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                baseLayer === 'STREET' ? 'bg-[#0F172A] text-white font-bold' : 'hover:text-[#0F172A] text-[#475569]'
              }`}
            >
              Topo (OSM)
            </button>
            <button
              onClick={() => { setBaseLayer('SATELLITE'); setTileError(false); }}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                baseLayer === 'SATELLITE' ? 'bg-[#0F172A] text-white font-bold' : 'hover:text-[#0F172A] text-[#475569]'
              }`}
            >
              Satellite
            </button>
            <button
              onClick={() => setShowProspectivity(prev => !prev)}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                showProspectivity ? 'bg-amber-100 text-amber-900 border border-amber-300' : 'text-[#64748B]'
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
          url={tileError ? tileUrls.STREET : (tileUrls[baseLayer] || tileUrls.STREET)}
          maxZoom={18}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          eventHandlers={{
            tileerror: () => {
              if (baseLayer !== 'STREET') {
                setTileError(true);
              }
            }
          }}
        />

        {/* Sausar Manganese Geological Prospectivity Corridor */}
        {showProspectivity && (
          <Polygon
            positions={sausarBeltPolygon}
            pathOptions={{
              color: '#ea580c',
              fillColor: '#f59e0b',
              fillOpacity: 0.22,
              weight: 2,
              dashArray: '4 4'
            }}
          >
            <Tooltip sticky>
              <div className="font-mono text-xs p-1">
                <strong className="text-amber-900">{lang === 'hi' ? 'à¤¸à¥Œà¤¸à¤° à¤®à¥ˆà¤‚à¤—à¤¨à¥€à¤œ à¤…à¤¯à¤¸à¥à¤• à¤ªà¤Ÿà¥à¤Ÿà¥€' : lang === 'mr' ? 'à¤¸à¥Œà¤¸à¤° à¤®à¥…à¤‚à¤—à¤¨à¥€à¤œ à¤ªà¤Ÿà¥à¤Ÿà¤¾' : 'Sausar Manganese Ore Belt'}</strong>
                <div className="text-[10px] text-slate-700">{lang === 'hi' ? 'à¤®à¤§à¥à¤¯ à¤ªà¥à¤°à¤¦à¥‡à¤¶-à¤®à¤¹à¤¾à¤°à¤¾à¤·à¥à¤Ÿà¥à¤° à¤ªà¥à¤°à¥€à¤•à¥ˆà¤®à¥à¤¬à¥à¤°à¤¿à¤¯à¤¨ à¤°à¥‚à¤ªà¤¾à¤‚à¤¤à¤°à¤¿à¤¤ à¤¸à¤‚à¤¸à¥à¤¤à¤°' : lang === 'mr' ? 'à¤®à¤§à¥à¤¯ à¤ªà¥à¤°à¤¦à¥‡à¤¶-à¤®à¤¹à¤¾à¤°à¤¾à¤·à¥à¤Ÿà¥à¤° à¤ªà¥à¤°à¥€à¤•à¥…à¤®à¥à¤¬à¥à¤°à¤¿à¤¯à¤¨ à¤°à¥‚à¤ªà¤¾à¤‚à¤¤à¤°à¤¿à¤¤ à¤¸à¥à¤¤à¤°' : 'Central MP-MH Precambrian Metamorphic Horizon'}</div>
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
              <Tooltip direction="top" offset={[0, -10]} opacity={0.98}>
                <div className="font-sans text-xs p-1.5 space-y-1 bg-white rounded-lg shadow-md border border-[#CBD5E1]">
                  <div className="font-bold text-[#0F172A] flex items-center justify-between gap-3">
                    <span className="text-sm font-black">{m.name}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold ${
                      m.status === 'CRITICAL' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      {m.status}
                    </span>
                  </div>
                  <div className="text-[10px] text-[#475569] font-mono">
                    {m.district}, {m.state} â€¢ {m.type}
                  </div>
                  <div className="flex items-center justify-between text-[11px] font-mono font-bold text-[#0F172A] pt-1 border-t border-[#E2E8F0]">
                    <span>Target: {m.target}</span>
                    <span className="text-emerald-800">Grade: {m.grade}</span>
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
          className="w-9 h-9 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-slate-50 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
          title="Zoom In"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => setMapZoom(prev => Math.max(4, prev - 1))}
          className="w-9 h-9 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-slate-50 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
          title="Zoom Out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetView}
          className="w-9 h-9 rounded-xl bg-white border border-[#CBD5E1] text-[#0F172A] hover:bg-slate-50 flex items-center justify-center shadow-lg transition-colors cursor-pointer"
          title="Reset National View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 p-3.5 rounded-2xl bg-white border border-[#CBD5E1] shadow-xl z-[500] text-xs font-sans text-[#0F172A] space-y-1.5 select-none">
        <div className="text-[10px] font-bold uppercase tracking-wider text-[#475569] pb-1 border-b border-[#E2E8F0]">
          {lang === 'hi' ? 'à¤®à¤¾à¤¨à¤šà¤¿à¤¤à¥à¤° à¤¸à¤‚à¤•à¥‡à¤¤ à¤à¤µà¤‚ à¤¸à¥à¤¥à¤¿à¤¤à¤¿' : lang === 'mr' ? 'à¤¨à¤•à¤¾à¤¶à¤¾ à¤¸à¥‚à¤šà¥€ à¤µ à¤¸à¥à¤¥à¤¿à¤¤à¥€' : 'MAP LEGEND & STATUS'}
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shadow-sm" />
          <span className="font-semibold">{lang === 'hi' ? 'à¤²à¤•à¥à¤·à¥à¤¯ à¤ªà¤° (>85% à¤¦à¥ˆà¤¨à¤¿à¤• à¤‰à¤¤à¥à¤ªà¤¾à¤¦à¤¨)' : lang === 'mr' ? 'à¤‰à¤¦à¥à¤¦à¤¿à¤·à¥à¤Ÿà¤¾à¤µà¤° (>85% à¤¦à¥ˆà¤¨à¤¿à¤• à¤‰à¤¤à¥à¤ªà¤¾à¤¦à¤¨)' : 'On Target (>85% Daily Yield)'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-600 shadow-sm" />
          <span className="font-semibold">{lang === 'hi' ? 'à¤œà¥‹à¤–à¤¿à¤® à¤®à¥‡à¤‚ (65% - 85% à¤‰à¤¤à¥à¤ªà¤¾à¤¦à¤¨)' : lang === 'mr' ? 'à¤œà¥‹à¤–à¤®à¥€à¤¤ (65% - 85% à¤‰à¤¤à¥à¤ªà¤¾à¤¦à¤¨)' : 'At Risk (65% - 85% Yield)'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 shadow-sm" />
          <span className="font-semibold">{lang === 'hi' ? 'à¤—à¤‚à¤­à¥€à¤° à¤…à¤‚à¤¤à¤° à¤…à¤²à¤°à¥à¤Ÿ' : lang === 'mr' ? 'à¤—à¤‚à¤­à¥€à¤° à¤¤à¥‚à¤Ÿ à¤‡à¤¶à¤¾à¤°à¤¾' : 'Critical Shortfall Alert'}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-sky-600 shadow-sm animate-pulse" />
          <span className="font-semibold">{lang === 'hi' ? 'à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤šà¤¯à¤¨à¤¿à¤¤ à¤–à¤¦à¤¾à¤¨' : lang === 'mr' ? 'à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤¨à¤¿à¤µà¤¡à¤²à¥‡à¤²à¥€ à¤–à¤¾à¤£' : 'Active Selected Mine'}</span>
        </div>
        <div className="flex items-center gap-2 pt-1 border-t border-[#E2E8F0] text-[11px] text-amber-800 font-bold">
          <span className="w-4 h-2 rounded bg-amber-500/40 border border-amber-600" />
          <span>{lang === 'hi' ? 'à¤¸à¥Œà¤¸à¤° à¤–à¤¨à¤¿à¤œ à¤¸à¤‚à¤­à¤¾à¤µà¤¨à¤¾ à¤ªà¤Ÿà¥à¤Ÿà¥€' : lang === 'mr' ? 'à¤¸à¥Œà¤¸à¤° à¤–à¤¨à¤¿à¤œ à¤¸à¤‚à¤­à¤¾à¤µà¥à¤¯à¤¤à¤¾ à¤ªà¤Ÿà¥à¤Ÿà¤¾' : 'Sausar Mineral Belt'}</span>
        </div>
      </div>

    </div>
  );
};
