import React, { useRef, useEffect, useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import { MINE_SPATIAL_REGISTRY } from './mapConfig.js';
import { EquipmentIcon } from './EquipmentIcons.jsx';
import { 
  Compass, 
  Layers, 
  RotateCcw, 
  Sparkles, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Droplet, 
  CloudRain, 
  Sun, 
  Maximize2, 
  Radio, 
  ArrowUp, 
  ArrowDown 
} from 'lucide-react';

export const DigitalTwin3D = ({ 
  mineId = 'balaghat', 
  activeScenario, 
  twinMode = 'OPERATIONAL', // 'TERRAIN', 'OPERATIONAL', 'GEOLOGICAL'
  undergroundPerspective = 'UNDERGROUND', // 'SURFACE', 'UNDERGROUND', 'SECTION'
  timeOfDay = '13:40',
  activeLayers = {},
  onSelectAsset 
}) => {
  const { t, lang } = useApp();
  const canvasRef = useRef(null);
  const [hoveredAsset, setHoveredAsset] = useState(null);
  const [cageInfo, setCageInfo] = useState({ depth: 185, dir: 'DESCENDING', speed: '2.8 m/s', load: '18.5 T', dest: '-240m Stope Level' });

  const mineConfig = MINE_SPATIAL_REGISTRY[mineId] || MINE_SPATIAL_REGISTRY.balaghat;
  const isUnderground = mineConfig.mineType.toLowerCase().includes('underground');
  const isScenario = Boolean(activeScenario);
  const scenarioType = activeScenario?.scenarioId || '';

  // 100% Mine-Specific Fleet Nodes
  const fleetAssets = React.useMemo(() => {
    const pfx = mineId.slice(0, 3).toUpperCase();
    if (isUnderground) {
      return [
        { id: `LHD-${pfx}-01`, name: 'Sandvik LH517i Underground LHD', code: `${pfx}-16`, type: 'LHD', rx: 0.38, ry: 0.44, status: scenarioType === 'MONSOON' ? 'ALERT' : 'OPTIMAL', health: scenarioType === 'MONSOON' ? 64 : 94, speed: '14 km/h', temp: '74°C', vib: '1.8 mm/s', level: `${mineConfig.deepestHorizon} Stope` },
        { id: `LHD-${pfx}-02`, name: 'Cat R1700G Underground Loader', code: `${pfx}-15`, type: 'LHD', rx: 0.46, ry: 0.38, status: 'OPTIMAL', health: 91, speed: '16 km/h', temp: '71°C', vib: '1.5 mm/s', level: 'Intermediate Crosscut' },
        { id: `HOIST-${pfx}-01`, name: 'Siemens 3.2MW Production Hoist', code: `WND-${pfx}`, type: 'SHAFT', rx: 0.52, ry: 0.22, status: 'OPTIMAL', health: 98, speed: '12 m/s', temp: '54°C', vib: '0.8 mm/s', level: `${mineConfig.elevation} Surface Collar` },
        { id: `CRUSH-${pfx}-01`, name: 'Gyratory Sizing Crusher Station', code: `CR-${pfx}`, type: 'CRUSHER', rx: 0.64, ry: 0.32, status: scenarioType === 'CRUSHER' ? 'CRITICAL' : 'OPTIMAL', health: scenarioType === 'CRUSHER' ? 42 : 89, throughput: '220 TPH', temp: scenarioType === 'CRUSHER' ? '98°C' : '62°C', vib: scenarioType === 'CRUSHER' ? '6.8 mm/s' : '2.1 mm/s', level: 'Surface' },
        { id: `PUMP-${pfx}-01`, name: 'Kirloskar 450kW Sump Battery', code: `PM-${pfx}`, type: 'PUMP', rx: 0.48, ry: 0.74, status: scenarioType === 'MONSOON' ? 'ALERT' : 'OPTIMAL', health: scenarioType === 'MONSOON' ? 58 : 96, discharge: scenarioType === 'MONSOON' ? '410 m³/h' : '180 m³/h', temp: '68°C', vib: '2.4 mm/s', level: `${mineConfig.waterTableDepth} Sump` }
      ];
    } else {
      return [
        { id: `EX-${pfx}-01`, name: 'P&H 2300XPC Heavy Mining Shovel', code: `${pfx}-16`, type: 'EXCAVATOR', rx: 0.44, ry: 0.36, status: 'OPTIMAL', health: 95, payload: '38T Bucket', temp: '69°C', vib: '1.4 mm/s', level: 'Bench 04 Face' },
        { id: `TRUCK-${pfx}-01`, name: 'CAT 777D Heavy Haul Truck', code: `${pfx}-06`, type: 'TRUCK', rx: 0.49, ry: 0.45, status: scenarioType === 'MONSOON' ? 'ALERT' : 'OPTIMAL', health: scenarioType === 'MONSOON' ? 71 : 92, speed: scenarioType === 'MONSOON' ? '12 km/h' : '28 km/h', load: '85T ROM', temp: '76°C', vib: '2.2 mm/s', level: 'Main Ramp' },
        { id: `TRUCK-${pfx}-02`, name: 'Komatsu HD785 Dumper', code: `${pfx}-11`, type: 'TRUCK', rx: 0.72, ry: 0.22, status: 'OPTIMAL', health: 88, speed: '34 km/h', load: '60T High-Grade', temp: '72°C', vib: '1.7 mm/s', level: 'Haul Route 01' },
        { id: `DRILL-${pfx}-01`, name: 'Sandvik DR412i Blast Hole Drill', code: `${pfx}-13`, type: 'DRILL', rx: 0.34, ry: 0.28, status: 'OPTIMAL', health: 93, penetration: '1.2 m/min', temp: '66°C', vib: '1.9 mm/s', level: 'Upper Bench Face' },
        { id: `CRUSH-${pfx}-01`, name: 'In-Pit Jaw Crusher Hopper', code: `CR-${pfx}`, type: 'CRUSHER', rx: 0.62, ry: 0.62, status: scenarioType === 'CRUSHER' ? 'CRITICAL' : 'OPTIMAL', health: scenarioType === 'CRUSHER' ? 44 : 88, throughput: '240 TPH', temp: scenarioType === 'CRUSHER' ? '96°C' : '64°C', vib: scenarioType === 'CRUSHER' ? '7.2 mm/s' : '2.0 mm/s', level: 'Crusher Pad' },
        { id: `PUMP-${pfx}-01`, name: 'Heavy Pit Floor Sump Pump', code: `PM-${pfx}`, type: 'PUMP', rx: 0.42, ry: 0.68, status: scenarioType === 'MONSOON' ? 'ALERT' : 'OPTIMAL', health: scenarioType === 'MONSOON' ? 62 : 95, discharge: scenarioType === 'MONSOON' ? '380 m³/h' : '140 m³/h', temp: '67°C', vib: '2.1 mm/s', level: 'Pit Sump Floor' }
      ];
    }
  }, [mineId, isUnderground, scenarioType, mineConfig]);

  // High-Resolution Geospatial Vector & Orthoimage Canvas Engine
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
      const cx = w * 0.50;
      const cy = h * 0.50;
      tick += 0.8;

      // Update animated elevator cage depth
      const rawDepth = 140 + Math.sin(tick * 0.04) * 110;
      const isDesc = Math.cos(tick * 0.04) >= 0;
      const currentDepthVal = Math.round(rawDepth);
      
      ctx.clearRect(0, 0, w, h);

      // =========================================================================
      // PERSPECTIVE 1: GEOLOGICAL CROSS-SECTION BLOCK DIAGRAM (SECTION MODE)
      // =========================================================================
      if (twinMode === 'GEOLOGICAL' && undergroundPerspective === 'SECTION') {
        ctx.fillStyle = '#06090e';
        ctx.fillRect(0, 0, w, h);

        // Elevation Scale Grids
        ctx.strokeStyle = 'rgba(51, 65, 85, 0.4)';
        ctx.lineWidth = 1;
        const elevLevels = [
          { y: 0.18, label: `${mineConfig.elevation} Surface Profile` },
          { y: 0.32, label: '-140m Level' },
          { y: 0.46, label: '-180m Level' },
          { y: 0.60, label: '-240m Level' },
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

        // 3D Extruded Strata Block
        ctx.fillStyle = 'rgba(30, 41, 59, 0.5)';
        ctx.beginPath();
        ctx.moveTo(w * 0.12, h * 0.18);
        ctx.lineTo(w * 0.88, h * 0.22);
        ctx.lineTo(w * 0.88, h * 0.82);
        ctx.lineTo(w * 0.12, h * 0.82);
        ctx.closePath();
        ctx.fill();

        // Dipping Braunite Manganese Lode
        ctx.fillStyle = 'rgba(245, 158, 11, 0.45)';
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(cx + 90, h * 0.18);
        ctx.lineTo(cx + 150, h * 0.18);
        ctx.lineTo(cx - 20, h * 0.82);
        ctx.lineTo(cx - 80, h * 0.82);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#f59e0b';
        ctx.font = 'bold 10px JetBrains Mono';
        ctx.fillText(`BRAUNITE ORE REEF (${mineConfig.oreGrade}) • DIP: ${mineConfig.dipAngle || '70° S'}`, cx - 30, h * 0.42);

        // Vertical Shaft Sinking Column
        const shaftX = cx - 120;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(shaftX, h * 0.12);
        ctx.lineTo(shaftX, h * 0.76);
        ctx.stroke();

        // Animated Shaft Cage in Section View
        const cageNormY = 0.18 + (currentDepthVal / 385) * (0.76 - 0.18);
        const cageY = h * cageNormY;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(shaftX - 8, cageY - 10, 16, 20);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(shaftX - 8, cageY - 10, 16, 20);

        // Cable Tension Line
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(shaftX, h * 0.12);
        ctx.lineTo(shaftX, cageY - 10);
        ctx.stroke();

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 9px JetBrains Mono';
        ctx.fillText('MAIN PRODUCTION SHAFT', cx - 180, h * 0.11);

        // Section Title Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText(`3D GEOLOGICAL SECTION PROFILE // ${mineConfig.name.toUpperCase()}`, 14, 22);

      } else if (twinMode === 'GEOLOGICAL' && undergroundPerspective === 'UNDERGROUND') {
        // =========================================================================
        // PERSPECTIVE 2: 3D ISOMETRIC UNDERGROUND MINE SCHEMATIC (UNDERGROUND MODE)
        // =========================================================================
        ctx.fillStyle = '#06090e';
        ctx.fillRect(0, 0, w, h);

        // Vertical Shaft Column
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(cx, cy - h * 0.35);
        ctx.lineTo(cx, cy + h * 0.38);
        ctx.stroke();

        // Surface Headgear Tower with Rotating Sheave Wheels
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(cx - 18, cy - h * 0.38, 36, 22);
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - 18, cy - h * 0.38, 36, 22);

        // Animated Sheave Wheels
        const sheaveSpin = tick * 0.1;
        ctx.beginPath();
        ctx.arc(cx - 6, cy - h * 0.36, 5, 0, Math.PI * 2);
        ctx.arc(cx + 6, cy - h * 0.36, 5, 0, Math.PI * 2);
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px JetBrains Mono';
        ctx.fillText(`HEADFRAME COLLAR ${mineConfig.elevation}`, cx - 55, cy - h * 0.39);

        // Horizontal Extraction Horizons
        const levels = [
          { depth: `${mineConfig.waterTableDepth} Upper Sump`, y: cy - h * 0.12, width: w * 0.48, grade: '41.2% Mn' },
          { depth: '-180m Main Haulage Drift', y: cy + h * 0.04, width: w * 0.54, grade: '44.8% Mn (High Grade)' },
          { depth: `${mineConfig.deepestHorizon} Active Stope`, y: cy + h * 0.20, width: w * 0.60, grade: mineConfig.oreGrade },
          { depth: 'Deep Dewatering Sump Basin', y: cy + h * 0.36, width: w * 0.42, grade: '38.2% Mn' }
        ];

        levels.forEach((lvl) => {
          ctx.strokeStyle = '#0284c7';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(cx - lvl.width * 0.5, lvl.y);
          ctx.lineTo(cx + lvl.width * 0.5, lvl.y);
          ctx.stroke();

          // High-Grade Braunite Ore Vein Block
          ctx.fillStyle = 'rgba(217, 119, 6, 0.4)';
          ctx.fillRect(cx - lvl.width * 0.45, lvl.y - 6, lvl.width * 0.9, 12);
          ctx.strokeStyle = '#d97706';
          ctx.lineWidth = 1;
          ctx.strokeRect(cx - lvl.width * 0.45, lvl.y - 6, lvl.width * 0.9, 12);

          ctx.fillStyle = '#e2e8f0';
          ctx.font = 'bold 9px JetBrains Mono';
          ctx.fillText(`${lvl.depth} [${lvl.grade}]`, cx - lvl.width * 0.5 + 8, lvl.y - 8);

          // Airflow Direction Arrows on Drifts
          const flowX = cx - lvl.width * 0.3 + ((tick * 1.5) % (lvl.width * 0.6));
          ctx.fillStyle = '#38bdf8';
          ctx.font = '8px JetBrains Mono';
          ctx.fillText('►►', flowX, lvl.y + 4);
        });

        // 9. ANIMATED SHAFT ELEVATOR / CAGE (Requirement 9)
        const shaftTopY = cy - h * 0.35;
        const shaftBottomY = cy + h * 0.38;
        const cagePosY = shaftTopY + (currentDepthVal / 385) * (shaftBottomY - shaftTopY);

        // Hoist Cables
        ctx.strokeStyle = '#94a3b8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(cx, shaftTopY);
        ctx.lineTo(cx, cagePosY - 12);
        ctx.stroke();

        // Cage Body
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(cx - 10, cagePosY - 12, 20, 24);
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(cx - 10, cagePosY - 12, 20, 24);

        // Cage Light
        ctx.beginPath();
        ctx.arc(cx, cagePosY - 2, 3, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();

        // Title Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText(`3D UNDERGROUND EXTRACTION MODEL // HORIZON: ${mineConfig.deepestHorizon}`, 14, 22);

      } else {
        // =========================================================================
        // PERSPECTIVE 3: 3D SURFACE TERRAIN & OPERATIONAL PERSPECTIVE
        // =========================================================================
        const timeHour = parseInt(timeOfDay.split(':')[0], 10) || 13;
        const sunRatio = Math.max(0.4, Math.min(1.0, 1.0 - Math.abs(timeHour - 13) * 0.08));

        // Procedural Topographic Elevation Mesh Shading (Requirement 7)
        const seedHue = (mineConfig.spatialSeed * 17) % 30;
        const orthoGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, w * 0.75);
        orthoGrad.addColorStop(0, `rgb(${Math.round((92 + seedHue) * sunRatio)}, ${Math.round((82 + seedHue * 0.5) * sunRatio)}, ${Math.round(68 * sunRatio)})`);
        orthoGrad.addColorStop(0.35, `rgb(${Math.round((72 + seedHue) * sunRatio)}, ${Math.round(62 * sunRatio)}, ${Math.round(52 * sunRatio)})`);
        orthoGrad.addColorStop(0.70, `rgb(${Math.round(48 * sunRatio)}, ${Math.round(42 * sunRatio)}, ${Math.round(36 * sunRatio)})`);
        orthoGrad.addColorStop(1.0, `rgb(${Math.round(24 * sunRatio)}, ${Math.round(22 * sunRatio)}, ${Math.round(20 * sunRatio)})`);
        ctx.fillStyle = orthoGrad;
        ctx.fillRect(0, 0, w, h);

        // Topographic Contour Texture with Natural Slopes
        ctx.strokeStyle = `rgba(180, 160, 130, ${0.12 * sunRatio})`;
        ctx.lineWidth = 1;
        const contourStep = 32;
        for (let x = -w * 0.2; x < w * 1.3; x += contourStep) {
          ctx.beginPath();
          ctx.moveTo(x, 0);
          ctx.bezierCurveTo(x + w * 0.15, h * 0.35, x - w * 0.10, h * 0.70, x + w * 0.25, h);
          ctx.stroke();
        }

        // Terraced Benches following Terrain
        if (activeLayers.boundary !== false) {
          const benches = mineConfig.benches || [];
          benches.forEach((b, idx) => {
            ctx.beginPath();
            ctx.ellipse(cx - w * 0.04, cy + h * b.yOff, w * b.rx, h * b.ry, -0.06, 0, Math.PI * 2);
            ctx.fillStyle = b.color;
            ctx.fill();
            ctx.strokeStyle = b.stroke;
            ctx.lineWidth = 1.6;
            ctx.stroke();

            if (idx % 2 === 0) {
              ctx.fillStyle = 'rgba(214, 190, 160, 0.7)';
              ctx.font = '8px JetBrains Mono';
              ctx.fillText(b.rl, cx - (w * b.rx * 0.9), cy + h * b.yOff);
            }
          });
        }

        // Haulage Routes with Speed Flow Heatmaps
        if (activeLayers.haulRoads !== false) {
          const routes = mineConfig.haulRoutes || [];
          routes.forEach((route, rIdx) => {
            const isMonsoonAlert = scenarioType === 'MONSOON';
            const roadColor = isMonsoonAlert ? (rIdx === 0 ? '#f59e0b' : '#ef4444') : (rIdx === 0 ? '#22c55e' : '#eab308');

            ctx.strokeStyle = roadColor;
            ctx.lineWidth = 4.5;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';

            ctx.beginPath();
            route.points.forEach((p, pIdx) => {
              const px = w * p[0];
              const py = h * p[1];
              if (pIdx === 0) ctx.moveTo(px, py);
              else ctx.lineTo(px, py);
            });
            ctx.stroke();

            const offset = (tick * 1.5) % 30;
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.8;
            ctx.setLineDash([6, 24]);
            ctx.lineDashOffset = -offset;
            ctx.stroke();
            ctx.setLineDash([]);
          });
        }

        // Title Tag
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 11px JetBrains Mono';
        ctx.fillText(`3D SURFACE TERRAIN MODEL // ${mineConfig.name.toUpperCase()}`, 14, 22);
      }

      // 10. RECOGNIZABLE MACHINE SILHOUETTES / TECHNICAL BADGES (Requirement 10)
      if (activeLayers.equipment !== false && (twinMode === 'OPERATIONAL' || undergroundPerspective !== 'SECTION')) {
        fleetAssets.forEach((asset) => {
          const ax = w * asset.rx;
          const ay = h * asset.ry;
          const isHovered = hoveredAsset?.id === asset.id;
          const ringColor = asset.status === 'CRITICAL' ? '#ef4444' : asset.status === 'ALERT' ? '#f59e0b' : '#10b981';

          ctx.beginPath();
          ctx.arc(ax, ay, isHovered ? 13 : 10, 0, Math.PI * 2);
          ctx.fillStyle = '#0f172a';
          ctx.fill();
          ctx.strokeStyle = ringColor;
          ctx.lineWidth = isHovered ? 2.5 : 1.8;
          ctx.stroke();

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 8.5px JetBrains Mono';
          ctx.fillText(asset.code, ax - 10, ay - 13);
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animId);
    };
  }, [mineId, activeScenario, twinMode, undergroundPerspective, timeOfDay, activeLayers, hoveredAsset, isUnderground, mineConfig, fleetAssets]);

  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    const w = canvas.width;
    const h = canvas.height;

    const found = fleetAssets.find((asset) => {
      const ax = w * asset.rx;
      const ay = h * asset.ry;
      return Math.hypot(clickX - ax, clickY - ay) <= 18;
    });

    if (found && onSelectAsset) {
      onSelectAsset(found);
    }
  };

  return (
    <div className="relative w-full h-full bg-[#06090e] overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        className="w-full h-full cursor-crosshair block"
      />

      {/* 9. SHAFT HOIST STATUS HUD OVERLAY (For Underground Mines) */}
      {isUnderground && (undergroundPerspective === 'UNDERGROUND' || undergroundPerspective === 'SECTION') && (
        <div className="absolute top-4 right-4 z-20 p-3 rounded-2xl bg-obsidian-950/90 border border-sky-500/40 backdrop-blur-md font-mono text-xs space-y-1.5 shadow-xl max-w-xs select-none">
          <div className="flex items-center justify-between pb-1 border-b border-obsidian-800">
            <span className="text-[10px] text-sky-400 font-bold uppercase">
              {lang === 'hi' ? 'शाफ्ट होइस्ट // सीमेंस 3.2MW' : lang === 'mr' ? 'शाफ्ट होइस्ट // सिमेन्स 3.2MW' : 'SHAFT HOIST // SIEMENS 3.2MW'}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800 text-[9px] font-bold">
              {lang === 'hi' ? 'ऑनलाइन' : lang === 'mr' ? 'ऑनलाइन' : 'ONLINE'}
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-400">{lang === 'hi' ? 'वर्तमान गहराई:' : lang === 'mr' ? 'सद्य खोली:' : 'Current Depth:'}</span>
            <strong className="text-white font-bold">-{cageInfo.depth} m</strong>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-400">{lang === 'hi' ? 'स्थिति:' : lang === 'mr' ? 'स्थिती:' : 'Status:'}</span>
            <span className="flex items-center gap-1 text-amber-400 font-bold">
              <ArrowDown className="w-3 h-3 animate-bounce" /> {cageInfo.dir === 'DESCENDING' ? (lang === 'hi' ? 'अवरोही' : lang === 'mr' ? 'खाली उतरत आहे' : 'DESCENDING') : cageInfo.dir} ({cageInfo.speed})
            </span>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-400">{lang === 'hi' ? 'लोड / पेलोड:' : lang === 'mr' ? 'भार / पेलोड:' : 'Load / Payload:'}</span>
            <strong className="text-manganese-400 font-bold">{cageInfo.load}</strong>
          </div>
          <div className="flex justify-between items-center text-[11px]">
            <span className="text-zinc-400">{lang === 'hi' ? 'गंतव्य:' : lang === 'mr' ? 'गंतव्य:' : 'Destination:'}</span>
            <strong className="text-zinc-200">{cageInfo.dest}</strong>
          </div>
        </div>
      )}
    </div>
  );
};
