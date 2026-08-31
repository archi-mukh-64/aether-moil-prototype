import React, { useRef, useEffect, useState, useMemo } from 'react';
import { MINE_SPATIAL_REGISTRY } from './mapConfig.js';
import { EquipmentIcon } from './EquipmentIcons.jsx';
import {
  Truck,
  Layers,
  Droplet,
  Radio,
  Sparkles,
  MapPin,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass
} from 'lucide-react';

export const DigitalTwin2D = ({
  mineId = 'balaghat',
  activeScenario,
  twinMode = 'OPERATIONAL',
  undergroundPerspective = 'UNDERGROUND', // 'SURFACE', 'UNDERGROUND', 'SECTION'
  activeLayers = {},
  onSelectAsset
}) => {
  const canvasRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1.0);
  const [hoveredNode, setHoveredNode] = useState(null);

  const mineConfig = MINE_SPATIAL_REGISTRY[mineId] || MINE_SPATIAL_REGISTRY.balaghat;
  const isUnderground = mineConfig.mineType.toLowerCase().includes('underground');
  const isScenario = Boolean(activeScenario);
  const scenarioType = activeScenario?.scenarioId || '';

  // 100% Mine-Specific Fleet Nodes
  const fleetNodes = React.useMemo(() => {
    const pfx = mineId.slice(0, 3).toUpperCase();
    if (isUnderground) {
      return [
        { id: `LHD-${pfx}-01`, name: 'Sandvik LH517i Underground LHD', code: `${pfx}-16`, type: 'LHD', rx: 0.38, ry: 0.44, status: scenarioType === 'MONSOON' ? 'ALERT' : 'OPTIMAL', health: scenarioType === 'MONSOON' ? 64 : 94, speed: '14 km/h', temp: '74°C', vib: '1.8 mm/s', level: `${mineConfig.deepestHorizon} Stope` },
        { id: `LHD-${pfx}-02`, name: 'Cat R1700G Underground Loader', code: `${pfx}-15`, type: 'LHD', rx: 0.46, ry: 0.38, status: 'OPTIMAL', health: 91, speed: '16 km/h', temp: '71°C', vib: '1.5 mm/s', level: 'Crosscut' },
        { id: `HOIST-${pfx}-01`, name: 'Siemens 3.2MW Production Hoist', code: `WND-${pfx}`, type: 'SHAFT', rx: 0.52, ry: 0.22, status: 'OPTIMAL', health: 98, speed: '12 m/s', temp: '54°C', vib: '0.8 mm/s', level: `${mineConfig.elevation} Surface` },
        { id: `CRUSH-${pfx}-01`, name: 'Gyratory Sizing Crusher Station', code: `CR-${pfx}`, type: 'CRUSHER', rx: 0.64, ry: 0.32, status: scenarioType === 'CRUSHER' ? 'CRITICAL' : 'OPTIMAL', health: scenarioType === 'CRUSHER' ? 42 : 89, throughput: '220 TPH', temp: scenarioType === 'CRUSHER' ? '98°C' : '62°C', vib: scenarioType === 'CRUSHER' ? '6.8 mm/s' : '2.1 mm/s', level: 'Surface' },
        { id: `PUMP-${pfx}-01`, name: 'Kirloskar 450kW Sump Battery', code: `PM-${pfx}`, type: 'PUMP', rx: 0.48, ry: 0.74, status: scenarioType === 'MONSOON' ? 'ALERT' : 'OPTIMAL', health: scenarioType === 'MONSOON' ? 58 : 96, discharge: scenarioType === 'MONSOON' ? '410 m³/h' : '180 m³/h', temp: '68°C', vib: '2.4 mm/s', level: `${mineConfig.waterTableDepth} Sump` }
      ];
    } else {
      return [
        { id: `EX-${pfx}-01`, name: 'P&H 2300XPC Heavy Shovel', code: `${pfx}-16`, type: 'EXCAVATOR', rx: 0.44, ry: 0.36, status: 'OPTIMAL', health: 95, payload: '38T Bucket', temp: '69°C', vib: '1.4 mm/s', level: 'Bench 04 (+280m)' },
        { id: `TRUCK-${pfx}-01`, name: 'CAT 777D Haul Truck', code: `${pfx}-06`, type: 'TRUCK', rx: 0.49, ry: 0.45, status: scenarioType === 'MONSOON' ? 'ALERT' : 'OPTIMAL', health: scenarioType === 'MONSOON' ? 71 : 92, speed: scenarioType === 'MONSOON' ? '12 km/h' : '28 km/h', load: '85T ROM', temp: '76°C', vib: '2.2 mm/s', level: 'Haul Ramp 02' },
        { id: `TRUCK-${pfx}-02`, name: 'Komatsu HD785 Dumper', code: `${pfx}-11`, type: 'TRUCK', rx: 0.72, ry: 0.22, status: 'OPTIMAL', health: 88, speed: '34 km/h', load: '60T High-Grade', temp: '72°C', vib: '1.7 mm/s', level: 'Main Haul Corridor' },
        { id: `DRILL-${pfx}-01`, name: 'Sandvik DR412i Blast Hole Drill', code: `${pfx}-13`, type: 'DRILL', rx: 0.34, ry: 0.28, status: 'OPTIMAL', health: 93, penetration: '1.2 m/min', temp: '66°C', vib: '1.9 mm/s', level: 'Bench 06 (+320m)' },
        { id: `CRUSH-${pfx}-01`, name: 'In-Pit Jaw Crusher Hopper', code: `CR-${pfx}`, type: 'CRUSHER', rx: 0.62, ry: 0.62, status: scenarioType === 'CRUSHER' ? 'CRITICAL' : 'OPTIMAL', health: scenarioType === 'CRUSHER' ? 44 : 88, throughput: '240 TPH', temp: scenarioType === 'CRUSHER' ? '96°C' : '64°C', vib: scenarioType === 'CRUSHER' ? '7.2 mm/s' : '2.0 mm/s', level: 'Crusher Pad' },
        { id: `PUMP-${pfx}-01`, name: 'Heavy Pit Floor Sump Pump', code: `PM-${pfx}`, type: 'PUMP', rx: 0.42, ry: 0.68, status: scenarioType === 'MONSOON' ? 'ALERT' : 'OPTIMAL', health: scenarioType === 'MONSOON' ? 62 : 95, discharge: scenarioType === 'MONSOON' ? '380 m³/h' : '140 m³/h', temp: '67°C', vib: '2.1 mm/s', level: 'Pit Sump Floor' }
      ];
    }
  }, [mineId, isUnderground, scenarioType, mineConfig]);

  // 2D High-Resolution Vector & Spatial Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let tick = 0;

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);

    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      tick += 0.8;

      ctx.clearRect(0, 0, w, h);

      // Base Background
      ctx.fillStyle = '#06090e';
      ctx.fillRect(0, 0, w, h);

      // =========================================================================
      // PERSPECTIVE 1: GEOLOGICAL CROSS SECTION (SECTION MODE)
      // =========================================================================
      if (twinMode === 'GEOLOGICAL' && undergroundPerspective === 'SECTION') {
        // Draw Geological Cross Section Elevation Profile

        // 1. Grid & Elevation Markers
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
        ctx.lineWidth = 1;
        const elevLevels = [
          { y: 0.18, label: `${mineConfig.elevation} Surface Profile` },
          { y: 0.32, label: '-140m Horizon' },
          { y: 0.46, label: '-180m Intermediate Level' },
          { y: 0.60, label: '-240m Production Level' },
          { y: 0.74, label: '-385m Deep Drainage Sump' }
        ];

        elevLevels.forEach(lev => {
          const ly = h * lev.y;
          ctx.beginPath();
          ctx.moveTo(w * 0.08, ly);
          ctx.lineTo(w * 0.92, ly);
          ctx.stroke();

          ctx.fillStyle = '#94a3b8';
          ctx.font = '9.5px JetBrains Mono';
          ctx.fillText(lev.label, 12, ly + 3);
        });

        // 2. Hanging Wall (Schist / Quartzite) Strata
        ctx.fillStyle = 'rgba(51, 65, 85, 0.25)';
        ctx.beginPath();
        ctx.moveTo(w * 0.08, h * 0.18);
        ctx.lineTo(w * 0.92, h * 0.20);
        ctx.lineTo(w * 0.92, h * 0.85);
        ctx.lineTo(w * 0.08, h * 0.85);
        ctx.closePath();
        ctx.fill();

        // 3. Dipping Braunite Manganese Ore Vein Reef (Irregular Geology dipping South)
        ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + 80, h * 0.18);
        ctx.lineTo(cx + 140, h * 0.18);
        ctx.lineTo(cx - 20, h * 0.82);
        ctx.lineTo(cx - 70, h * 0.82);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Ore Reef Annotation
        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillText(`BRAUNITE ORE REEF (${mineConfig.oreGrade}) • DIP: ${mineConfig.dipAngle || '70° S'}`, cx - 30, h * 0.42);

        // 4. Vertical Production Shaft Column
        ctx.fillStyle = 'rgba(15, 23, 42, 0.95)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        const shaftX = cx - 140;
        ctx.beginPath();
        ctx.rect(shaftX - 12, h * 0.12, 24, h * 0.65);
        ctx.fill();
        ctx.stroke();

        // Headframe Winder Tower at Surface
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(shaftX - 18, h * 0.18);
        ctx.lineTo(shaftX, h * 0.10);
        ctx.lineTo(shaftX + 18, h * 0.18);
        ctx.stroke();
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 9px JetBrains Mono';
        ctx.fillText('HEADFRAME SHAFT', shaftX - 45, h * 0.09);

        // 5. Horizontal Mining Crosscuts Intersecting Ore Vein
        [0.32, 0.46, 0.60, 0.74].forEach((levY, idx) => {
          const ly = h * levY;
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(shaftX, ly);
          ctx.lineTo(cx + 60 - idx * 25, ly);
          ctx.stroke();

          // Stope Stope Fill Indicator
          ctx.fillStyle = 'rgba(16, 185, 129, 0.3)';
          ctx.fillRect(cx + 10 - idx * 25, ly - 8, 45, 16);
          ctx.strokeStyle = '#10b981';
          ctx.lineWidth = 1;
          ctx.strokeRect(cx + 10 - idx * 25, ly - 8, 45, 16);
        });

        // 6. Diamond Drill Hole Exploration Traces (DDH)
        ctx.strokeStyle = '#ec4899';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        ctx.moveTo(cx + 180, h * 0.18);
        ctx.lineTo(cx + 30, h * 0.78);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#ec4899';
        ctx.font = '8.5px JetBrains Mono';
        ctx.fillText('DDH-MOIL-04 (45.8% Mn)', cx + 120, h * 0.35);

        // 7. Water Table Line
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.8;
        ctx.setLineDash([8, 4]);
        ctx.beginPath();
        ctx.moveTo(w * 0.08, h * 0.48);
        ctx.lineTo(w * 0.92, h * 0.48);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = '#06b6d4';
        ctx.fillText(`WATER TABLE HORIZON (${mineConfig.waterTableDepth})`, w * 0.65, h * 0.47);

        // Section Title Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText(`GEOLOGICAL CROSS-SECTION A-A' // ${mineConfig.name.toUpperCase()}`, 14, 22);

      } else if (twinMode === 'GEOLOGICAL' && undergroundPerspective === 'UNDERGROUND') {
        // =========================================================================
        // PERSPECTIVE 2: UNDERGROUND MINE LEVEL & STOPE PLAN (UNDERGROUND MODE)
        // =========================================================================

        // 1. Grid
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
        ctx.lineWidth = 1;
        const gridStep = 40 * zoomLevel;
        for (let x = 0; x < w; x += gridStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += gridStep) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // 2. Central Extraction Level Horizon Footprint
        ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.rect(cx - (w * 0.38 * zoomLevel), cy - (h * 0.34 * zoomLevel), w * 0.76 * zoomLevel, h * 0.68 * zoomLevel);
        ctx.fill();
        ctx.stroke();

        // 3. Main Haulage Drifts & Crosscut Network
        const drifts = [
          { x1: -0.32, y1: -0.15, x2: 0.32, y2: -0.15, label: 'MAIN EAST-WEST HAULAGE DRIFT (-180m)' },
          { x1: -0.32, y1: 0.15, x2: 0.32, y2: 0.15, label: 'FOOTWALL EXTRACTION DRIFT (-180m)' },
          { x1: -0.20, y1: -0.28, x2: -0.20, y2: 0.28, label: 'CROSSCUT 01' },
          { x1: 0.0, y1: -0.28, x2: 0.0, y2: 0.28, label: 'CENTRAL ORE PASS CROSSCUT' },
          { x1: 0.20, y1: -0.28, x2: 0.20, y2: 0.28, label: 'CROSSCUT 02' }
        ];

        drifts.forEach(d => {
          const dx1 = cx + d.x1 * w * zoomLevel;
          const dy1 = cy + d.y1 * h * zoomLevel;
          const dx2 = cx + d.x2 * w * zoomLevel;
          const dy2 = cy + d.y2 * h * zoomLevel;

          ctx.strokeStyle = '#e2e8f0';
          ctx.lineWidth = 4 * zoomLevel;
          ctx.beginPath();
          ctx.moveTo(dx1, dy1);
          ctx.lineTo(dx2, dy2);
          ctx.stroke();

          // Airflow Vectors on ventilation drifts
          const flowOffset = (tick * 1.5) % 20;
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 16]);
          ctx.lineDashOffset = -flowOffset;
          ctx.stroke();
          ctx.setLineDash([]);
        });

        // 4. Production Stopes (Active Mining Blocks)
        const stopes = [
          { rx: -0.10, ry: -0.15, w: 0.08, h: 0.12, name: 'STOPE 04 (ACTIVE)', grade: '44.5% Mn', status: 'EXTRACTION' },
          { rx: 0.10, ry: -0.15, w: 0.08, h: 0.12, name: 'STOPE 05 (DRILLED)', grade: '43.8% Mn', status: 'BLAST READY' },
          { rx: -0.10, ry: 0.15, w: 0.08, h: 0.12, name: 'STOPE 06 (BACKFILLED)', grade: '42.0% Mn', status: 'FILL COMPLETED' }
        ];

        stopes.forEach(st => {
          const sx = cx + (st.rx - st.w * 0.5) * w * zoomLevel;
          const sy = cy + (st.ry - st.h * 0.5) * h * zoomLevel;
          const sw = st.w * w * zoomLevel;
          const sh = st.h * h * zoomLevel;

          ctx.fillStyle = st.status === 'EXTRACTION' ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.25)';
          ctx.fillRect(sx, sy, sw, sh);
          ctx.strokeStyle = st.status === 'EXTRACTION' ? '#f59e0b' : '#10b981';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(sx, sy, sw, sh);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8.5px JetBrains Mono';
          ctx.fillText(st.name, sx + 4, sy + 12);
          ctx.fillStyle = '#f59e0b';
          ctx.fillText(st.grade, sx + 4, sy + 24);
        });

        // 5. Vertical Shaft Collar Station
        const sX = cx - (w * 0.28 * zoomLevel);
        const sY = cy - (h * 0.15 * zoomLevel);
        ctx.beginPath();
        ctx.arc(sX, sY, 14 * zoomLevel, 0, Math.PI * 2);
        ctx.fillStyle = '#0284c7';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px JetBrains Mono';
        ctx.fillText('MAIN SHAFT', sX - 22, sY - 18);

        // 6. Underground Dewatering Sump Pump Station
        const pumpX = cx + (w * 0.24 * zoomLevel);
        const pumpY = cy + (h * 0.15 * zoomLevel);
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.arc(pumpX, pumpY, 12 * zoomLevel, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 8px JetBrains Mono';
        ctx.fillText('SUMP STATION', pumpX - 25, pumpY + 22);

        // 7. Title Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText(`UNDERGROUND MINE DEVELOPMENT PLAN // HORIZON: ${mineConfig.deepestHorizon}`, 14, 22);

      } else {
        // =========================================================================
        // PERSPECTIVE 3: SURFACE OPERATIONAL / SURFACE GEOLOGICAL TWIN
        // =========================================================================

        // 1. Coordinate Grid (100m grid intervals)
        ctx.strokeStyle = 'rgba(30, 41, 59, 0.4)';
        ctx.lineWidth = 1;
        const gridStep = 40 * zoomLevel;
        for (let x = 0; x < w; x += gridStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.lineTo(x, h);
          ctx.stroke();
        }
        for (let y = 0; y < h; y += gridStep) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(w, y);
          ctx.stroke();
        }

        // 2. Mine Lease Boundary Polygon
        if (activeLayers.boundary !== false) {
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 2;
          ctx.setLineDash([6, 4]);
          ctx.beginPath();
          ctx.rect(cx - (w * 0.4 * zoomLevel), cy - (h * 0.38 * zoomLevel), w * 0.8 * zoomLevel, h * 0.76 * zoomLevel);
          ctx.stroke();
          ctx.setLineDash([]);

          ctx.fillStyle = '#f59e0b';
          ctx.font = '9px JetBrains Mono';
          ctx.fillText(`LEASE BOUNDARY (${mineConfig.leaseAreaHa} Ha)`, cx - (w * 0.39 * zoomLevel), cy - (h * 0.35 * zoomLevel));
        }

        // 3. Haulage Road Network with Speed Flow Heatmaps
        if (activeLayers.haulRoads !== false) {
          const routes = mineConfig.haulRoutes || [];
          routes.forEach((route, rIdx) => {
            const isMonsoonAlert = scenarioType === 'MONSOON';
            const roadColor = isMonsoonAlert ? (rIdx === 0 ? '#f59e0b' : '#ef4444') : (rIdx === 0 ? '#22c55e' : '#eab308');

            ctx.strokeStyle = roadColor;
            ctx.lineWidth = 4.5 * zoomLevel;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            route.points.forEach((p, pIdx) => {
              const px = cx + (p[0] - 0.5) * w * zoomLevel;
              const py = cy + (p[1] - 0.5) * h * zoomLevel;
              if (pIdx === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            });
            ctx.stroke();

            const offset = (tick * 1.5) % 25;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([5, 20]);
            ctx.lineDashOffset = -offset;
            ctx.stroke();
            ctx.setLineDash([]);
          });
        }

        // 4. Ore Strike Horizon (Manganese Braunite Lode)
        if (activeLayers.oreZones !== false || twinMode === 'GEOLOGICAL') {
          ctx.strokeStyle = 'rgba(251, 191, 36, 0.8)';
          ctx.fillStyle = 'rgba(251, 191, 36, 0.18)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.ellipse(cx + (w * 0.08 * zoomLevel), cy - (h * 0.05 * zoomLevel), w * 0.28 * zoomLevel, h * 0.12 * zoomLevel, 0.3, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f59e0b';
          ctx.font = 'bold 9px JetBrains Mono';
          ctx.fillText(`BRAUNITE ORE ZONE (${mineConfig.oreGrade || '44% Mn'})`, cx - 30, cy - (h * 0.05 * zoomLevel));
        }

        // 5. Live IoT Telemetry Sensor Nodes
        if (activeLayers.telemetry !== false) {
          const sensors = mineConfig.telemetryNodes || [];
          sensors.forEach((s) => {
            const sx = cx + (s.rx - 0.5) * w * zoomLevel;
            const sy = cy + (s.ry - 0.5) * h * zoomLevel;

            ctx.beginPath();
            ctx.arc(sx, sy, 7 * zoomLevel, 0, Math.PI * 2);
            ctx.fillStyle = '#0f172a';
            ctx.fill();
            ctx.strokeStyle = s.status === 'CRITICAL' ? '#ef4444' : s.status === 'ALERT' ? '#f59e0b' : '#38bdf8';
            ctx.lineWidth = 1.5;
            ctx.stroke();

            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 8px JetBrains Mono';
            ctx.fillText(`${s.id}: ${s.value}`, sx + 10, sy + 3);
          });
        }

        // 6. Title Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText(`SURFACE ENGINEERING PLAN // ${mineConfig.name.toUpperCase()}`, 14, 22);
      }

      // 7. Fleet Badges (Common Overlay across Operational views)
      if (activeLayers.equipment !== false && (twinMode === 'OPERATIONAL' || undergroundPerspective !== 'SECTION')) {
        fleetNodes.forEach((node) => {
          const nx = cx + (node.rx - 0.5) * w * zoomLevel;
          const ny = cy + (node.ry - 0.5) * h * zoomLevel;
          const isHovered = hoveredNode?.id === node.id;
          const ringColor = node.status === 'CRITICAL' ? '#ef4444' : node.status === 'ALERT' ? '#f59e0b' : '#10b981';

          ctx.beginPath();
          ctx.arc(nx, ny, (isHovered ? 14 : 11) * zoomLevel, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = (isHovered ? 3 : 2);
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9px JetBrains Mono';
          ctx.fillText(node.code, nx - 10, ny - 14);

          ctx.beginPath();
          ctx.arc(nx, ny, 3.5 * zoomLevel, 0, Math.PI * 2);
          ctx.fillStyle = ringColor;
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [mineId, activeScenario, twinMode, undergroundPerspective, activeLayers, zoomLevel, hoveredNode, isUnderground, mineConfig, fleetNodes]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;
    const cx = w * 0.5;
    const cy = h * 0.5;

    // Check Fleet Nodes
    const found = fleetNodes.find((node) => {
      const nx = cx + (node.rx - 0.5) * w * zoomLevel;
      const ny = cy + (node.ry - 0.5) * h * zoomLevel;
      const dist = Math.hypot(clickX - nx, clickY - ny);
      return dist <= 20;
    });

    if (found && onSelectAsset) {
      onSelectAsset(found);
      return;
    }

    // Check Underground Stopes & Shafts when in Underground Mode
    if (twinMode === 'GEOLOGICAL' && undergroundPerspective === 'UNDERGROUND') {
      const shaftX = cx - (w * 0.28 * zoomLevel);
      const shaftY = cy - (h * 0.15 * zoomLevel);
      if (Math.hypot(clickX - shaftX, clickY - shaftY) <= 25) {
        if (onSelectAsset) {
          onSelectAsset({
            name: `${mineConfig.name} Main Production Shaft`,
            code: 'SHAFT-01',
            type: 'SHAFT',
            health: 98,
            engineTemp: '54°C',
            vib: '0.8 mm/s',
            fuel: '100%',
            rul: '12,500 hrs',
            level: `${mineConfig.deepestHorizon} Deep Level`
          });
        }
        return;
      }
    }
  };

  return (
    <div className="relative w-full h-full bg-[#06090e] overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair block"
      />

      {/* Zoom Controls */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-1 p-1 rounded-xl bg-[#0c1422]/90 border border-[#1c2c46] backdrop-blur-md">
        <button
          onClick={() => setZoomLevel(prev => Math.min(2.0, prev + 0.2))}
          className="p-1.5 rounded-lg text-[#5F625C] hover:text-[#272A27] hover:bg-zinc-800"
          title="Zoom In"
        >
          <ZoomIn className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoomLevel(prev => Math.max(0.6, prev - 0.2))}
          className="p-1.5 rounded-lg text-[#5F625C] hover:text-[#272A27] hover:bg-zinc-800"
          title="Zoom Out"
        >
          <ZoomOut className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => setZoomLevel(1.0)}
          className="p-1.5 rounded-lg text-[#5F625C] hover:text-[#272A27] hover:bg-zinc-800"
          title="Reset Zoom"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
