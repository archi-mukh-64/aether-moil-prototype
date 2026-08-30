import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useApp } from '../../context/AppContext.jsx';
import { MINE_SPATIAL_REGISTRY } from './mapConfig.js';
import { EquipmentIcon } from './EquipmentIcons.jsx';
import { 
  Globe2, 
  MapPin, 
  Layers, 
  Radio, 
  Truck, 
  Compass, 
  Sparkles, 
  Droplet,
  Zap,
  Building
} from 'lucide-react';

// Programmatic map center & zoom updater
function MapCenterController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.2 });
    }
  }, [center, zoom, map]);
  return null;
}

export const RealEarthMap = ({ 
  mineId = 'balaghat', 
  activeLayers = {}, 
  activeScenario, 
  onSelectAsset,
  onSelectSensor,
  onSelectLocation
}) => {
  const { t, lang } = useApp();
  const mineConfig = MINE_SPATIAL_REGISTRY[mineId] || MINE_SPATIAL_REGISTRY.balaghat;
  const isUnderground = mineConfig.mineType.toLowerCase().includes('underground');
  const scenarioType = activeScenario?.scenarioId || '';

  // Geographic center of the mine
  const centerLat = mineConfig.coordinates[0];
  const centerLng = mineConfig.coordinates[1];

  // Dynamic GeoJSON polygon boundary derived from mine lease area
  const leaseBoundaryPolygon = useMemo(() => {
    const lat = centerLat;
    const lng = centerLng;
    const offsetLat = 0.008;
    const offsetLng = 0.012;
    return [
      [lat + offsetLat * 0.9, lng - offsetLng * 0.7],
      [lat + offsetLat * 1.1, lng + offsetLng * 0.8],
      [lat - offsetLat * 0.4, lng + offsetLng * 1.2],
      [lat - offsetLat * 1.2, lng + offsetLng * 0.4],
      [lat - offsetLat * 0.9, lng - offsetLng * 1.1],
      [lat + offsetLat * 0.3, lng - offsetLng * 1.0]
    ];
  }, [centerLat, centerLng]);

  // Dynamic Fleet Assets for Real Earth View
  const fleetMarkers = useMemo(() => {
    const pfx = mineId.slice(0, 3).toUpperCase();
    if (isUnderground) {
      return [
        { id: `LHD-01`, code: `${pfx}-16`, name: 'Sandvik LH517i Loader', type: 'LHD', lat: centerLat + 0.0015, lng: centerLng - 0.002, health: 94, temp: '74°C', vib: '1.8 mm/s', status: 'OPTIMAL' },
        { id: `WND-01`, code: `WND-${pfx}`, name: 'Siemens 3.2MW Production Hoist', type: 'SHAFT', lat: centerLat - 0.001, lng: centerLng + 0.001, health: 98, temp: '54°C', vib: '0.8 mm/s', status: 'OPTIMAL' },
        { id: `CR-01`, code: `CR-${pfx}`, name: 'Gyratory Sizing Crusher Station', type: 'CRUSHER', lat: centerLat - 0.0025, lng: centerLng + 0.003, health: scenarioType === 'CRUSHER' ? 42 : 89, temp: scenarioType === 'CRUSHER' ? '98°C' : '62°C', vib: scenarioType === 'CRUSHER' ? '6.8 mm/s' : '2.1 mm/s', status: scenarioType === 'CRUSHER' ? 'CRITICAL' : 'OPTIMAL' }
      ];
    } else {
      return [
        { id: `EX-01`, code: `${pfx}-16`, name: 'P&H 2300XPC Heavy Shovel', type: 'EXCAVATOR', lat: centerLat + 0.002, lng: centerLng - 0.003, health: 95, temp: '69°C', vib: '1.4 mm/s', status: 'OPTIMAL' },
        { id: `TR-01`, code: `${pfx}-06`, name: 'CAT 777D Haul Truck', type: 'TRUCK', lat: centerLat - 0.001, lng: centerLng - 0.001, health: 92, temp: '76°C', vib: '2.2 mm/s', status: 'OPTIMAL' },
        { id: `CR-01`, code: `CR-${pfx}`, name: 'In-Pit Primary Jaw Crusher', type: 'CRUSHER', lat: centerLat - 0.003, lng: centerLng + 0.004, health: scenarioType === 'CRUSHER' ? 44 : 88, temp: scenarioType === 'CRUSHER' ? '96°C' : '64°C', vib: scenarioType === 'CRUSHER' ? '7.2 mm/s' : '2.0 mm/s', status: scenarioType === 'CRUSHER' ? 'CRITICAL' : 'OPTIMAL' }
      ];
    }
  }, [mineId, isUnderground, centerLat, centerLng, scenarioType]);

  // Telemetry Sensor Markers
  const telemetrySensors = useMemo(() => {
    return (mineConfig.telemetryNodes || []).map(s => ({
      ...s,
      lat: centerLat + (s.rx - 0.5) * 0.014,
      lng: centerLng + (s.ry - 0.5) * 0.018
    }));
  }, [mineConfig, centerLat, centerLng]);

  const [tileError, setTileError] = useState(false);

  return (
    <div className="relative w-full h-full bg-[#06090e] select-none">
      <MapContainer
        center={[centerLat, centerLng]}
        zoom={14.8}
        zoomControl={false}
        attributionControl={false}
        className="w-full h-full z-0"
      >
        <MapCenterController center={[centerLat, centerLng]} zoom={14.8} />

        {/* 1. Real Satellite Orthoimage Layer (Esri World Imagery) with OpenStreetMap zero-key fallback */}
        {activeLayers.satellite !== false && !tileError ? (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            maxZoom={19}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            eventHandlers={{
              tileerror: () => setTileError(true)
            }}
          />
        ) : (
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            maxZoom={19}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )}

        {/* 2. Mine Lease Boundary Overlay */}
        {activeLayers.boundary !== false && (
          <Polygon
            positions={leaseBoundaryPolygon}
            pathOptions={{
              color: '#f59e0b',
              weight: 2.5,
              dashArray: '8, 6',
              fillColor: '#f59e0b',
              fillOpacity: 0.12
            }}
          >
            <Tooltip permanent direction="center" className="bg-transparent border-0 text-amber-300 font-mono text-[10px] font-bold shadow-none">
              {mineConfig.name.toUpperCase()} {lang === 'hi' ? 'पट्टा' : lang === 'mr' ? 'पट्टा' : 'LEASE'} ({mineConfig.leaseAreaHa} Ha)
            </Tooltip>
          </Polygon>
        )}

        {/* 3. Live Fleet Machinery Markers */}
        {activeLayers.equipment !== false && fleetMarkers.map(asset => {
          const icon = L.divIcon({
            className: 'custom-fleet-icon',
            html: `
              <div style="background:#090e17; border:2px solid ${asset.status === 'CRITICAL' ? '#ef4444' : '#10b981'}; border-radius:10px; padding:3px 6px; display:flex; align-items:center; gap:4px; box-shadow:0 4px 12px rgba(0,0,0,0.8); cursor:pointer;">
                <span style="width:6px; height:6px; border-radius:50%; background:${asset.status === 'CRITICAL' ? '#ef4444' : '#10b981'};"></span>
                <span style="font-family:monospace; font-size:10px; font-weight:bold; color:#fff;">${asset.code}</span>
              </div>
            `,
            iconSize: [60, 24],
            iconAnchor: [30, 12]
          });

          return (
            <Marker
              key={asset.id}
              position={[asset.lat, asset.lng]}
              icon={icon}
              eventHandlers={{
                click: () => onSelectAsset && onSelectAsset(asset)
              }}
            >
              <Popup className="custom-leaflet-popup">
                <div className="p-2 font-mono text-xs text-zinc-200">
                  <div className="font-bold text-white">{asset.name}</div>
                  <div className="text-[10px] text-emerald-400">{t?.common?.health || 'Health'}: {asset.health}% • {t?.common?.temp || 'Temp'}: {asset.temp}</div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* 4. IoT Telemetry Sensor Markers */}
        {activeLayers.telemetry !== false && telemetrySensors.map(sensor => {
          const sIcon = L.divIcon({
            className: 'custom-sensor-icon',
            html: `
              <div style="background:#0c1422; border:1.5px solid #38bdf8; border-radius:50%; width:16px; height:16px; display:flex; align-items:center; justify-content:center; box-shadow:0 0 8px rgba(56,189,248,0.6); cursor:pointer;">
                <span style="width:6px; height:6px; border-radius:50%; background:#38bdf8;"></span>
              </div>
            `,
            iconSize: [16, 16],
            iconAnchor: [8, 8]
          });

          return (
            <Marker
              key={sensor.id}
              position={[sensor.lat, sensor.lng]}
              icon={sIcon}
              eventHandlers={{
                click: () => onSelectSensor && onSelectSensor(sensor)
              }}
            >
              <Tooltip direction="top" className="font-mono text-[9px]">
                {sensor.id}: {sensor.value}
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>

      {/* Real Earth Compass & Scale Bar */}
      <div className="absolute top-3 left-3 z-10 p-2 rounded-xl bg-[#090f19]/90 border border-[#18263c] backdrop-blur-md font-mono text-[10px] text-zinc-300 space-y-1">
        <div className="flex items-center gap-1 text-sky-400 font-bold">
          <Globe2 className="w-3.5 h-3.5" />
          <span>{lang === 'hi' ? 'वास्तविक उपग्रह बेसमैप' : lang === 'mr' ? 'वास्तविक उपग्रह बेस-मॅप' : 'REAL SATELLITE BASMAP'}</span>
        </div>
        <div className="text-[9px] text-zinc-400">{lang === 'hi' ? 'ईएसआरआई / सेंटिनल-2 ऑर्थोफोटो' : lang === 'mr' ? 'ईएसआरआय / सेंटिनेल-2 ऑर्थोफोटो' : 'ESRI / SENTINEL-2 ORTHOPHOTO'}</div>
      </div>
    </div>
  );
};
