import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Layers,
  Compass,
  X,
  Activity,
  Droplet,
  Cpu,
  Zap,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  Truck,
  RotateCcw
} from 'lucide-react';

export const MineSpatialRenderer = () => {
  const { activeMine, activeScenario, setSelectedMineId, selectedMineId } = useApp();
  const [activeTab, setActiveTab] = useState('SPATIAL'); // 'SPATIAL', 'LOCAL_CHAIN', 'TIME_SERIES'
  const [dimensionMode, setDimensionMode] = useState('3D'); // '3D', '2D'
  const [activeCard, setActiveCard] = useState(null);
  const canvasRef = useRef(null);

  const currentMine = activeMine || {
    id: 'balaghat',
    name: 'Balaghat Mine',
    shortName: 'Balaghat',
    mineType: 'Underground Deep Shaft',
    oreGrade: '44.2% Mn',
    coordinatesDMS: '21°50\'59.8"N 80°13\'36.2"E',
    elevation: '+312m MSL',
    fleetCount: 32
  };

  const isUnderground = currentMine.mineType?.toLowerCase().includes('underground') ||
                        ['balaghat', 'gumgaon', 'chikla', 'ukwa', 'munsar', 'kandri'].includes(currentMine.id);

  const isScenario = Boolean(activeScenario);

  // Dynamic HUD Cards placed on the spatial terrain matching reference image
  const hudCards = useMemo(() => {
    return [
      {
        id: 'pit1',
        title: 'Pit 1',
        headerVariant: isScenario && activeScenario?.scenarioId === 'MONSOON' ? 'critical' : 'critical', // Red header like screenshot
        val1: isScenario ? '28%' : '12%',
        val1Label: 'Shortfall Risk',
        gaugePct: isScenario ? 78 : 52,
        x: 48, // % from left
        y: 28, // % from top
        details: {
          name: `${currentMine.shortName} Pit 01 Extraction Bench`,
          elevation: '+210m RL',
          grade: `${currentMine.oreGrade}`,
          fleet: '6 Active Haul Units',
          waterInflow: isScenario ? '2,450 m³/h (Elevated)' : '820 m³/h (Normal)',
          status: isScenario ? 'CRITICAL INGRESS' : 'NOMINAL'
        }
      },
      {
        id: 'bench',
        title: 'Bench',
        headerVariant: 'slate', // Dark slate header like screenshot
        val1: '72%',
        val1Label: 'Bench Util.',
        gaugePct: 57,
        x: 74,
        y: 30,
        details: {
          name: 'North Highwall Terraced Bench 04',
          elevation: '+285m RL',
          grade: '43.8% Mn High-Grade',
          fleet: '2 Excavators + 4 Dumpers',
          slopeStability: 'FoS 1.94 (DGMS Compliant)',
          status: 'OPERATIONAL'
        }
      },
      {
        id: 'process',
        title: 'Process',
        headerVariant: 'slate',
        gaugePct: isScenario && activeScenario?.scenarioId === 'CRUSHER' ? 32 : 53,
        x: 64,
        y: 48,
        details: {
          name: 'Primary In-Pit Jaw Crusher & Sizing Plant',
          throughput: isScenario && activeScenario?.scenarioId === 'CRUSHER' ? '180 T/h (Throttled)' : '580 T/h (Target 620 T/h)',
          vibration: isScenario && activeScenario?.scenarioId === 'CRUSHER' ? '8.4 mm/s (Bearing Fault)' : '2.2 mm/s',
          bearingTemp: isScenario && activeScenario?.scenarioId === 'CRUSHER' ? '86.4°C' : '62.1°C',
          status: isScenario && activeScenario?.scenarioId === 'CRUSHER' ? 'BEARING ALERT' : 'OPTIMAL'
        }
      },
      {
        id: 'mhs',
        title: 'MHS',
        headerVariant: 'critical', // Red header like screenshot
        ledBp: isScenario ? 98 : 98,
        ledEp: isScenario ? 42 : 20,
        gaugePct: isScenario ? 68 : 41,
        x: 52,
        y: 58,
        details: {
          name: 'Material Handling System (MHS) Main Loadout',
          beltSpeed: '2.8 m/s',
          capacity: '850 TPH',
          conveyorLoad: isScenario ? '98% Overload' : '78% Nominal',
          status: isScenario ? 'QUEUE CONGESTION' : 'NOMINAL'
        }
      },
      {
        id: 'cos',
        title: 'COS',
        headerVariant: 'compact',
        valText: '0%',
        progressPct: 0,
        x: 65,
        y: 65,
        details: {
          name: 'Crushed Ore Stockpile (COS) Overflow Level',
          capacity: '14,000 Tonnes',
          currentBuffer: '8,450 Tonnes (60%)',
          status: 'CLEAR'
        }
      }
    ];
  }, [currentMine, isScenario, activeScenario]);

  // Photorealistic / High-Density Procedural 3D Terrain Canvas Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.52;
      const cy = h * 0.52;
      tick += 1;

      // 1. Dark Atmospheric Background
      const bgGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, w * 0.65);
      bgGrad.addColorStop(0, '#0c121c');
      bgGrad.addColorStop(0.7, '#070a0f');
      bgGrad.addColorStop(1, '#05070a');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, w, h);

      // 2. Subtle Precision Grid
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.02)';
      ctx.lineWidth = 1;
      const gStep = 32;
      for (let x = 0; x < w; x += gStep) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y < h; y += gStep) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 3. PHOTOREALISTIC TERRAIN SHADING & BENCH TOPOGRAPHY
      // Outer mountain ridges & textured rock faces (3D isometric perspective)
      const terrainGrad = ctx.createLinearGradient(cx - w * 0.4, cy - h * 0.4, cx + w * 0.4, cy + h * 0.4);
      terrainGrad.addColorStop(0, '#524e47');
      terrainGrad.addColorStop(0.3, '#78716c');
      terrainGrad.addColorStop(0.6, '#44403c');
      terrainGrad.addColorStop(1, '#292524');

      // Topography polygon contour
      ctx.fillStyle = terrainGrad;
      ctx.beginPath();
      ctx.moveTo(cx - w * 0.38, cy - h * 0.08);
      ctx.lineTo(cx - w * 0.22, cy - h * 0.28);
      ctx.lineTo(cx - w * 0.05, cy - h * 0.38);
      ctx.lineTo(cx + w * 0.18, cy - h * 0.32);
      ctx.lineTo(cx + w * 0.38, cy - h * 0.18);
      ctx.lineTo(cx + w * 0.44, cy + h * 0.04);
      ctx.lineTo(cx + w * 0.36, cy + h * 0.22);
      ctx.lineTo(cx + w * 0.14, cy + h * 0.36);
      ctx.lineTo(cx - w * 0.16, cy + h * 0.32);
      ctx.lineTo(cx - w * 0.34, cy + h * 0.14);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Stepped Benches (Concentric Contours with realistic rock textures)
      const benches = [
        { rx: w * 0.34, ry: h * 0.25, yOff: -h * 0.04, fill: '#6c655d', stroke: '#8c827a' },
        { rx: w * 0.28, ry: h * 0.20, yOff: -h * 0.02, fill: '#575048', stroke: '#756c63' },
        { rx: w * 0.22, ry: h * 0.16, yOff: 0, fill: '#453f38', stroke: '#61584f' },
        { rx: w * 0.17, ry: h * 0.12, yOff: h * 0.02, fill: '#36302a', stroke: '#4f473f' },
        { rx: w * 0.12, ry: h * 0.09, yOff: h * 0.04, fill: '#27221d', stroke: '#3d3730' }
      ];

      benches.forEach((b, idx) => {
        ctx.beginPath();
        ctx.ellipse(cx - w * 0.08, cy + b.yOff, b.rx, b.ry, -0.08, 0, Math.PI * 2);
        ctx.fillStyle = b.fill;
        ctx.fill();
        ctx.strokeStyle = b.stroke;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      });

      // Pit Lake / Sump Water Reservoir at pit bottom (Deep Turquoise)
      const waterGrad = ctx.createRadialGradient(cx - w * 0.08, cy + h * 0.06, 5, cx - w * 0.08, cy + h * 0.06, w * 0.12);
      waterGrad.addColorStop(0, '#0d9488');
      waterGrad.addColorStop(0.5, '#115e59');
      waterGrad.addColorStop(1, '#042f2e');

      ctx.beginPath();
      ctx.ellipse(cx - w * 0.08, cy + h * 0.06, w * 0.11, h * 0.07, -0.08, 0, Math.PI * 2);
      ctx.fillStyle = waterGrad;
      ctx.fill();
      ctx.strokeStyle = '#2dd4bf';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Spiral Haul Road Path
      ctx.strokeStyle = 'rgba(214, 211, 209, 0.4)';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(cx + w * 0.24, cy - h * 0.12);
      ctx.quadraticCurveTo(cx - w * 0.28, cy - h * 0.02, cx - w * 0.04, cy + h * 0.08);
      ctx.quadraticCurveTo(cx + w * 0.12, cy + h * 0.16, cx - w * 0.08, cy + h * 0.06);
      ctx.stroke();

      // Moving Haul Trucks on the Haul Road
      const truckT = (tick * 0.003) % 1;
      const tx = cx + (Math.cos(truckT * Math.PI * 2) * (w * 0.16 * (1 - truckT * 0.4))) - w * 0.06;
      const ty = cy + (Math.sin(truckT * Math.PI * 2) * (h * 0.11 * (1 - truckT * 0.4)));
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(tx - 4, ty - 3, 8, 6);

      // Surface Infrastructure: Crusher Plant, Conveyors & Stockpiles on Right
      ctx.fillStyle = '#1c1917';
      ctx.strokeStyle = '#44403c';
      ctx.lineWidth = 1.5;
      ctx.fillRect(cx + w * 0.16, cy + h * 0.08, w * 0.14, h * 0.12);
      ctx.strokeRect(cx + w * 0.16, cy + h * 0.08, w * 0.14, h * 0.12);

      // Tailings Ponds (Cyan/Green Water Basin)
      ctx.fillStyle = 'rgba(20, 184, 166, 0.4)';
      ctx.beginPath();
      ctx.ellipse(cx + w * 0.19, cy + h * 0.18, 16, 10, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(cx + w * 0.24, cy + h * 0.19, 14, 9, 0, 0, Math.PI * 2);
      ctx.fill();

      // Underground Headframe / Vertical Shaft (if Underground mode)
      if (isUnderground) {
        ctx.strokeStyle = 'rgba(245, 158, 11, 0.8)';
        ctx.fillStyle = 'rgba(245, 158, 11, 0.2)';
        const shX = cx - w * 0.28;
        const shY = cy - h * 0.12;
        ctx.beginPath();
        ctx.moveTo(shX - 16, shY);
        ctx.lineTo(shX - 8, shY - 48);
        ctx.lineTo(shX + 8, shY - 48);
        ctx.lineTo(shX + 16, shY);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(shX, shY - 40, 6, 0, Math.PI * 2);
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationId);
    };
  }, [isUnderground]);

  return (
    <div className="relative w-full rounded-2xl bg-[#080b10] border border-[#161f2e] overflow-hidden shadow-2xl flex flex-col font-sans select-none">

      {/* 1. TOP VIEWPORT CONTROLS BAR */}
      <div className="px-4 py-2.5 bg-[#0a0e14]/90 border-b border-[#141c2b] flex items-center justify-between z-20">

        {/* Left Tabs: Spatial View, Local Chain, Time Series */}
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[#0e141f] border border-[#1a2538]">
          {[
            { id: 'SPATIAL', label: 'Spatial View' },
            { id: 'LOCAL_CHAIN', label: 'Local Chain' },
            { id: 'TIME_SERIES', label: 'Time Series' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1 rounded-md text-xs font-semibold font-mono transition-all ${
                activeTab === tab.id
                  ? 'bg-[#182338] text-white shadow-sm border border-[#273752]'
                  : 'text-[#5F625C] hover:text-[#272A27]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Right Controls: 3D/2D Mode & North Orientation Needle */}
        <div className="flex items-center gap-3">

          {/* 3D / 2D Toggle */}
          <div className="flex items-center p-0.5 rounded-lg bg-[#0e141f] border border-[#1a2538] font-mono text-[11px]">
            {['3D', '2D'].map((d) => (
              <button
                key={d}
                onClick={() => setDimensionMode(d)}
                className={`px-2.5 py-0.5 rounded font-bold transition-all ${
                  dimensionMode === d
                    ? 'bg-[#1e2c45] text-white'
                    : 'text-[#85877E] hover:text-[#272A27]'
                }`}
              >
                {d}
              </button>
            ))}
          </div>

          {/* North Compass Indicator (Matching Reference Image) */}
          <div className="relative w-8 h-8 rounded-full bg-[#0e141f] border border-[#1f2c42] flex items-center justify-center shadow-inner">
            <span className="absolute -top-1 font-mono text-[8px] font-bold text-[#5F625C]">N</span>
            <svg className="w-5 h-5 -rotate-12" viewBox="0 0 24 24">
              <polygon points="12,2 16,12 12,9" fill="#ef4444" />
              <polygon points="12,2 8,12 12,9" fill="#f87171" />
              <polygon points="12,22 16,12 12,15" fill="#94a3b8" />
              <polygon points="12,22 8,12 12,15" fill="#cbd5e1" />
            </svg>
          </div>

        </div>
      </div>

      {/* 2. MAIN DIGITAL TWIN SPATIAL VIEWPORT */}
      <div className="relative w-full h-[460px] sm:h-[500px] lg:h-[540px] bg-[#070a0f] overflow-hidden">

        {/* Canvas Render Element */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* 3D XYZ Axis Gizmo (Bottom-Left) */}
        <div className="absolute bottom-3 left-4 flex flex-col items-start gap-0.5 font-mono text-[9px] text-[#85877E] pointer-events-none z-10">
          <div className="flex items-center gap-1.5">
            <span className="text-blue-400 font-bold">Z</span>
            <span className="w-4 h-0.5 bg-blue-500" />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-green-400 font-bold">Y</span>
            <span className="w-3 h-0.5 bg-green-500 transform -rotate-45" />
            <span className="text-rose-400 font-bold ml-1">X</span>
            <span className="w-4 h-0.5 bg-rose-500" />
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LIVE HUD SPATIAL OVERLAY CARDS (Exactly matching the Reference Image)    */}
        {/* ========================================================================= */}

        {/* 1. PIT 1 CARD (Red Header + 12% + 52% Semi-Circular Gauge) */}
        <div
          onClick={() => setActiveCard(hudCards[0])}
          style={{ left: `${hudCards[0].x}%`, top: `${hudCards[0].y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#0a0e16]/95 border border-[#1e293b] shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer hover:scale-105 transition-all z-20 w-36"
        >
          <div className="px-2.5 py-1 bg-rose-700/90 text-white font-mono text-[10px] font-extrabold uppercase tracking-wide">
            Pit 1
          </div>
          <div className="p-2.5 flex items-center justify-between gap-2">
            <div className="font-mono text-base font-extrabold text-white">
              {hudCards[0].val1}
            </div>
            {/* Small Semi-Circular Gauge */}
            <div className="relative w-12 h-7 flex items-end justify-center overflow-hidden">
              <svg className="w-12 h-12 -rotate-90 origin-center" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1c2636" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="119.3" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset={238.7 - (hudCards[0].gaugePct / 100) * 119.3} strokeLinecap="round" />
              </svg>
              <span className="absolute bottom-0 text-[10px] font-extrabold text-white font-mono">{hudCards[0].gaugePct}%</span>
            </div>
          </div>
        </div>

        {/* 2. BENCH CARD (Dark Slate Header + 72% + 57% Semi-Circular Gauge) */}
        <div
          onClick={() => setActiveCard(hudCards[1])}
          style={{ left: `${hudCards[1].x}%`, top: `${hudCards[1].y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#0c121d]/95 border border-[#1e293b] shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer hover:scale-105 transition-all z-20 w-36"
        >
          <div className="px-2.5 py-1 bg-[#162133] text-[#272A27] font-mono text-[10px] font-extrabold uppercase tracking-wide">
            Bench
          </div>
          <div className="p-2.5 flex items-center justify-between gap-2">
            <div className="font-mono text-base font-extrabold text-white">
              {hudCards[1].val1}
            </div>
            <div className="relative w-12 h-7 flex items-end justify-center overflow-hidden">
              <svg className="w-12 h-12 -rotate-90 origin-center" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1c2636" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="119.3" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#ef4444" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset={238.7 - (hudCards[1].gaugePct / 100) * 119.3} strokeLinecap="round" />
              </svg>
              <span className="absolute bottom-0 text-[10px] font-extrabold text-white font-mono">{hudCards[1].gaugePct}%</span>
            </div>
          </div>
        </div>

        {/* 3. PROCESS CARD (Dark Slate Header + 53% Semi-Circular Gauge) */}
        <div
          onClick={() => setActiveCard(hudCards[2])}
          style={{ left: `${hudCards[2].x}%`, top: `${hudCards[2].y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#0c121d]/95 border border-[#1e293b] shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer hover:scale-105 transition-all z-20 w-28"
        >
          <div className="px-2.5 py-1 bg-[#162133] text-[#272A27] font-mono text-[10px] font-extrabold uppercase tracking-wide">
            Process
          </div>
          <div className="p-2.5 flex items-center justify-center">
            <div className="relative w-14 h-8 flex items-end justify-center overflow-hidden">
              <svg className="w-14 h-14 -rotate-90 origin-center" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1c2636" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="119.3" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset={238.7 - (hudCards[2].gaugePct / 100) * 119.3} strokeLinecap="round" />
              </svg>
              <span className="absolute bottom-0 text-xs font-extrabold text-white font-mono">{hudCards[2].gaugePct}%</span>
            </div>
          </div>
        </div>

        {/* 4. MHS CARD (Red Header + LED Meter Bars [BP:98 | EP:20] + 41% Gauge) */}
        <div
          onClick={() => setActiveCard(hudCards[3])}
          style={{ left: `${hudCards[3].x}%`, top: `${hudCards[3].y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-xl bg-[#0a0e16]/95 border border-[#1e293b] shadow-[0_10px_30px_rgba(0,0,0,0.8)] overflow-hidden cursor-pointer hover:scale-105 transition-all z-20 w-40"
        >
          <div className="px-2.5 py-1 bg-rose-700/90 text-white font-mono text-[10px] font-extrabold uppercase tracking-wide">
            MHS
          </div>
          <div className="p-2.5 flex items-center justify-between gap-2">
            {/* LED Vertical Equalizer Bars */}
            <div className="space-y-0.5">
              <div className="text-[8px] font-mono text-[#5F625C]">BP: 98 | EP: 20</div>
              <div className="flex gap-1">
                <div className="w-3 h-6 bg-rose-950 rounded-sm overflow-hidden flex flex-col justify-end p-0.5">
                  <div className="w-full h-5 bg-rose-500 rounded-sm" />
                </div>
                <div className="w-3 h-6 bg-amber-950 rounded-sm overflow-hidden flex flex-col justify-end p-0.5">
                  <div className="w-full h-3 bg-amber-500 rounded-sm" />
                </div>
              </div>
            </div>

            {/* Gauge */}
            <div className="relative w-14 h-8 flex items-end justify-center overflow-hidden">
              <svg className="w-14 h-14 -rotate-90 origin-center" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#1c2636" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset="119.3" />
                <circle cx="50" cy="50" r="38" fill="transparent" stroke="#06b6d4" strokeWidth="12" strokeDasharray="238.7" strokeDashoffset={238.7 - (hudCards[3].gaugePct / 100) * 119.3} strokeLinecap="round" />
              </svg>
              <span className="absolute bottom-0 text-xs font-extrabold text-white font-mono">{hudCards[3].gaugePct}%</span>
            </div>
          </div>
        </div>

        {/* 5. COS CARD (0% with Green Progress Indicator) */}
        <div
          onClick={() => setActiveCard(hudCards[4])}
          style={{ left: `${hudCards[4].x}%`, top: `${hudCards[4].y}%` }}
          className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg bg-[#0c121d]/95 border border-[#1e293b] shadow-xl p-2 cursor-pointer hover:scale-105 transition-all z-20 w-24"
        >
          <div className="text-[9px] font-mono text-[#5F625C] font-bold uppercase">COS</div>
          <div className="flex items-center justify-between gap-1.5 mt-0.5">
            <span className="font-mono text-xs font-extrabold text-white">0%</span>
            <div className="w-8 h-1.5 bg-[#141b27] rounded-full overflow-hidden">
              <div className="w-1 h-full bg-teal-400 rounded-full" />
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE ASSET DETAIL FLYOUT (When user clicks any HUD card)           */}
        {/* ========================================================================= */}
        {activeCard && (
          <div className="absolute top-4 right-4 w-80 p-4 rounded-xl bg-[#0c121d]/95 border border-[#1f2c42] shadow-2xl backdrop-blur-xl z-30 font-sans text-xs animate-scale-up">
            <div className="flex items-center justify-between pb-2 border-b border-[#182338]">
              <span className="font-bold text-white uppercase text-xs">{activeCard.details.name}</span>
              <button onClick={() => setActiveCard(null)} className="w-5 h-5 rounded hover:bg-[#182338] text-[#5F625C] hover:text-white flex items-center justify-center">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-2 space-y-2 text-[11px] font-mono">
              {Object.entries(activeCard.details).map(([k, v]) => {
                if (k === 'name') return null;
                return (
                  <div key={k} className="flex justify-between py-0.5 border-b border-[#141c2b]">
                    <span className="text-[#85877E] uppercase">{k}:</span>
                    <strong className="text-[#272A27]">{v}</strong>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

    </div>
  );
};
