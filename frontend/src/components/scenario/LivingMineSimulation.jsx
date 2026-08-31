import React, { useRef, useEffect, useState, useMemo } from 'react';
import {
  Camera,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Droplet,
  Wrench,
  Truck,
  Layers,
  ShieldCheck,
  AlertTriangle,
  Maximize2,
  Minimize2,
  Compass,
  Activity,
  ArrowRight,
  CloudRain,
  Sun,
  Globe2,
  TrendingUp,
  TrendingDown,
  Clock,
  ChevronRight,
  Sparkle,
  Radio,
  Sliders,
  CheckCircle2,
  FileText,
  Download,
  Share2,
  Cpu,
  BarChart3,
  X,
  Info,
  History,
  Calendar,
  Gauge
} from 'lucide-react';
import { useApp } from '../../context/AppContext.jsx';

export const LivingMineSimulation = ({
  currentMine,
  selectedScenType,
  activeParameters,
  simulationResults,
  isUnderground,
  cameraMode = 'COMMAND',
  layers = {
    terrain: true,
    haulRoutes: true,
    fleet: true,
    geology: false,
    sumpWater: true,
    riskHeatmap: false,
    telemetry: true,
    satellite: true
  },
  onApplyIntervention,
  activeIntervention
}) => {
  const { t, currentLanguage, lang } = useApp();
  const canvasRef = useRef(null);

  // Inspector Dialog State
  const [activeInspector, setActiveInspector] = useState(null);

  // Historical Time-Machine Year (2018 to 2026)
  const [historicalYear, setHistoricalYear] = useState(2026);
  const [isTimeMachineOpen, setIsTimeMachineOpen] = useState(false);

  // -------------------------------------------------------------------------
  // HIGH-RESOLUTION INDUSTRIAL DIGITAL TWIN ENGINE (60 FPS ROCK-SOLID)
  // -------------------------------------------------------------------------
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let tick = 0;

    // Simulation Entities Pre-allocated for zero garbage collection overhead
    const rainParticles = [];
    for (let i = 0; i < 220; i++) {
      rainParticles.push({
        x: Math.random() * 1600,
        y: Math.random() * 900,
        speed: 14 + Math.random() * 10,
        len: 12 + Math.random() * 16
      });
    }

    // Active Fleet Instances with Authentic Specifications
    const fleet = [
      { id: 'DT-210', model: 'Komatsu HD785-8', type: 'TRUCK', speed: 28, payload: '92.2T (96%)', progress: 0.18, color: '#eab308', status: 'CLIMBING RAMP' },
      { id: 'DT-184', model: 'Komatsu HD785-8', type: 'TRUCK', speed: 32, payload: '88.5T (91%)', progress: 0.44, color: '#eab308', status: 'HAULING TO CRUSHER' },
      { id: 'DT-095', model: 'Komatsu HD785-8', type: 'TRUCK', speed: 36, payload: '0.0T (EMPTY)', progress: 0.72, color: '#eab308', status: 'RETURNING TO BENCH' },
      { id: 'DT-042', model: 'Komatsu HD785-8', type: 'TRUCK', speed: 30, payload: '90.1T (94%)', progress: 0.92, color: '#eab308', status: 'DUMPING IN HOPPER' },
      { id: 'GR-03',  model: 'Komatsu GD825A',  type: 'GRADER', speed: 12, payload: 'BLADING', progress: 0.35, color: '#f59e0b', status: 'ROAD MAINTENANCE' },
      { id: 'WT-02',  model: 'Komatsu HD465 WT',type: 'WATER_TRUCK', speed: 20, payload: '35,000L', progress: 0.60, color: '#0ea5e9', status: 'DUST SUPPRESSION' }
    ];

    const resize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = Math.max(540, canvas.parentElement.clientHeight || 540);
      }
    };
    resize();
    window.addEventListener('resize', resize);

    // 1. Realistic Komatsu HD785-8 Haul Truck Blueprint Renderer
    const drawKomatsuTruck = (x, y, heading, isLoaded, speedKmh, id) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(heading);

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(0, 2, 28, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Heavy 6-Wheel Tires with Rims (2 front, 4 rear duals)
      ctx.fillStyle = '#111827';
      ctx.fillRect(-22, -16, 12, 7);
      ctx.fillRect(-22, 9, 12, 7);
      ctx.fillRect(8, -17, 16, 8);
      ctx.fillRect(8, 9, 16, 8);

      // Yellow Chassis Frame
      ctx.fillStyle = '#ca8a04';
      ctx.fillRect(-18, -10, 42, 20);

      // Ribbed Steel Dump Bed Body
      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.roundRect(-4, -12, 34, 24, 3);
      ctx.fill();
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Ore Load inside Dump Bed
      if (isLoaded) {
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.ellipse(12, 0, 12, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#a855f7';
        ctx.fillRect(8, -3, 3, 3);
        ctx.fillRect(14, 2, 3, 3);
        ctx.fillRect(11, -1, 4, 3);
      }

      // Operator Cab with Blue Glass Windshield
      ctx.fillStyle = '#facc15';
      ctx.fillRect(-24, -11, 15, 12);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(-23, -10, 6, 10);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 1;
      ctx.strokeRect(-24, -11, 15, 12);

      // Engine Bonnet & Radiator Grille
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-26, 1, 16, 9);
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-28, 2, 3, 7);

      // Dual Halogen Headlights & Forward Beam
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(-28, -8, 2, 3);
      ctx.fillRect(-28, 6, 2, 3);

      const beamGrad = ctx.createRadialGradient(-28, 0, 2, -90, 0, 75);
      beamGrad.addColorStop(0, 'rgba(254, 240, 138, 0.7)');
      beamGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(-28, -8);
      ctx.lineTo(-90, -32);
      ctx.lineTo(-90, 32);
      ctx.lineTo(-28, 8);
      ctx.closePath();
      ctx.fill();

      // Exhaust Pipe
      ctx.fillStyle = '#334155';
      ctx.fillRect(-10, -14, 3, 4);

      // Red LED Tail Lights
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(30, -10, 2, 4);
      ctx.fillRect(30, 6, 2, 4);

      ctx.restore();
    };

    // 2. Realistic Komatsu PC2000-8 Hydraulic Excavator Renderer
    const drawKomatsuExcavator = (x, y, armCycle) => {
      ctx.save();
      ctx.translate(x, y);

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(0, 4, 38, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // Heavy Track Assemblies (Crawler Undercarriage)
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-28, -22, 56, 10);
      ctx.fillRect(-28, 12, 56, 10);
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(-28, -22, 56, 10);
      ctx.strokeRect(-28, 12, 56, 10);

      // Upper Rotating Deck
      const swingAngle = Math.sin(armCycle * Math.PI * 2) * 0.45;
      ctx.rotate(swingAngle);

      ctx.fillStyle = '#eab308';
      ctx.beginPath();
      ctx.roundRect(-22, -14, 44, 28, 4);
      ctx.fill();
      ctx.strokeStyle = '#a16207';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Rear Heavy Counterweight Block
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(-24, -13, 10, 26);

      // Operator Cab
      ctx.fillStyle = '#facc15';
      ctx.fillRect(4, -14, 16, 12);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(8, -13, 10, 10);
      ctx.strokeStyle = '#0f172a';
      ctx.strokeRect(4, -14, 16, 12);

      // Articulated Boom & Stick
      const boomExt = Math.sin(armCycle * Math.PI * 2) * 12;
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(44 + boomExt, -8);
      ctx.lineTo(68 + boomExt * 1.4, 6);
      ctx.stroke();

      // Heavy Manganese Rock Bucket with Teeth
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.arc(68 + boomExt * 1.4, 6, 8, 0, Math.PI * 1.5);
      ctx.closePath();
      ctx.fill();

      // Hydraulic Cylinders
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(22, -4);
      ctx.lineTo(38 + boomExt * 0.8, -12);
      ctx.stroke();

      ctx.restore();
    };

    // 3. Primary Jaw Crusher Station & Moving Conveyor
    const drawCrusherStation = (x, y, isSeized) => {
      ctx.save();
      ctx.translate(x, y);

      // Concrete Foundation
      ctx.fillStyle = '#334155';
      ctx.fillRect(-45, -35, 90, 70);

      // Steel Housing Structure
      ctx.fillStyle = isSeized ? '#450a0a' : '#1e293b';
      ctx.fillRect(-35, -28, 70, 56);
      ctx.strokeStyle = isSeized ? '#ef4444' : '#f59e0b';
      ctx.lineWidth = 2;
      ctx.strokeRect(-35, -28, 70, 56);

      // Feed Hopper Funnel
      ctx.fillStyle = isSeized ? '#ef4444' : '#f59e0b';
      ctx.beginPath();
      ctx.moveTo(-28, -28);
      ctx.lineTo(28, -28);
      ctx.lineTo(12, -8);
      ctx.lineTo(-12, -8);
      ctx.closePath();
      ctx.fill();

      // Moving Rubber Conveyor Belt
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 14;
      ctx.beginPath();
      ctx.moveTo(35, 10);
      ctx.lineTo(110, -25);
      ctx.stroke();

      // Conveyor Chevrons & Ore Chunks
      if (!isSeized) {
        const beltShift = (tick * 2.5) % 16;
        ctx.fillStyle = '#64748b';
        for (let i = 0; i < 5; i++) {
          const cx = 42 + i * 15 + (beltShift * 0.8);
          const cy = 6 - i * 7;
          ctx.beginPath();
          ctx.arc(cx, cy, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ROM Surge Stockpile
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.moveTo(95, 15);
      ctx.lineTo(145, 15);
      ctx.lineTo(120, -30);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
    };

    // =========================================================================
    // MAIN RENDERING LOOP (60 FPS SMOOTH ANIMATION)
    // =========================================================================
    const render = () => {
      const w = canvas.width;
      const h = canvas.height;
      const cx = w * 0.5;
      const cy = h * 0.5;
      tick += 1.0;

      ctx.clearRect(0, 0, w, h);

      // Camera Matrix Transformations (10 Working Perspectives)
      ctx.save();
      let scale = 1.0;
      let offsetX = 0;
      let offsetY = 0;

      if (cameraMode === 'TRUCK') {
        scale = 1.65;
        const lead = fleet[0];
        const tx = w * 0.12 + lead.progress * (w * 0.76);
        const ty = h * 0.84 - Math.sin(lead.progress * Math.PI) * (h * 0.22);
        offsetX = cx - tx * scale;
        offsetY = cy - ty * scale;
      } else if (cameraMode === 'CRUSHER') {
        scale = 1.8;
        offsetX = cx - (w * 0.80) * scale;
        offsetY = cy - (h * 0.54) * scale;
      } else if (cameraMode === 'EXCAVATOR') {
        scale = 1.9;
        offsetX = cx - (w * 0.28) * scale;
        offsetY = cy - (h * 0.52) * scale;
      } else if (cameraMode === 'SHAFT' || (isUnderground && cameraMode === 'UNDERGROUND')) {
        scale = 1.45;
        offsetX = cx - (w * 0.5) * scale;
        offsetY = cy - (h * 0.5) * scale;
      } else if (cameraMode === 'DRONE') {
        scale = 1.25;
        offsetX = Math.sin(tick * 0.005) * 35;
        offsetY = Math.cos(tick * 0.005) * 20;
      } else if (cameraMode === 'SATELLITE') {
        scale = 0.82;
        offsetX = cx - (w * 0.5) * scale;
        offsetY = cy - (h * 0.5) * scale;
      } else if (cameraMode === 'INCIDENT') {
        scale = 1.7;
        const tx = selectedScenType === 'CRUSHER_SEIZURE' ? w * 0.80 : w * 0.58;
        const ty = selectedScenType === 'CRUSHER_SEIZURE' ? h * 0.54 : h * 0.38;
        offsetX = cx - tx * scale;
        offsetY = cy - ty * scale;
      } else if (cameraMode === 'FREE_CAMERA') {
        scale = 1.35;
        offsetX = cx - (w * 0.45) * scale;
        offsetY = cy - (h * 0.55) * scale;
      }

      ctx.translate(offsetX, offsetY);
      ctx.scale(scale, scale);

      // 1. SKY & DISTANT TOPOGRAPHIC RIDGE
      const isRainy = activeParameters.rainfall > 35;
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.5);
      if (isRainy) {
        skyGrad.addColorStop(0, '#0a101d');
        skyGrad.addColorStop(0.5, '#121c2c');
        skyGrad.addColorStop(1, '#0b121e');
      } else {
        skyGrad.addColorStop(0, '#0e1828');
        skyGrad.addColorStop(0.5, '#17273f');
        skyGrad.addColorStop(1, '#0f1c2e');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(-w * 0.5, -h * 0.5, w * 2, h * 2);

      // Far Mountain Ridge Silhouettes
      ctx.fillStyle = isRainy ? '#111b2b' : '#192a42';
      ctx.beginPath();
      ctx.moveTo(-w * 0.2, h * 0.42);
      ctx.lineTo(w * 0.15, h * 0.24);
      ctx.lineTo(w * 0.38, h * 0.32);
      ctx.lineTo(w * 0.65, h * 0.18);
      ctx.lineTo(w * 0.95, h * 0.30);
      ctx.lineTo(w * 1.3, h * 0.42);
      ctx.lineTo(w * 1.3, h * 1.2);
      ctx.lineTo(-w * 0.2, h * 1.2);
      ctx.fill();

      // =========================================================================
      // DUAL SCENE GENERATOR: UNDERGROUND SHAFT vs OPENCAST QUARRY
      // =========================================================================
      if (isUnderground) {
        // -----------------------------------------------------------------------
        // UNDERGROUND SHAFT MINE (Balaghat, Ukwa, Munsar, Gumgaon, Chikla)
        // -----------------------------------------------------------------------
        const shaftX = w * 0.5;
        const shaftY = h * 0.32;

        // Surface Collar Infrastructure
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(-w * 0.2, shaftY, w * 1.4, h * 0.08);

        // 42m Steel Lattice Headframe Winder Tower
        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(shaftX - 40, shaftY);
        ctx.lineTo(shaftX - 14, shaftY - 110);
        ctx.lineTo(shaftX + 14, shaftY - 110);
        ctx.lineTo(shaftX + 40, shaftY);
        ctx.stroke();

        // Lattice Cross-Bracing
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shaftX - 30, shaftY - 35);
        ctx.lineTo(shaftX + 30, shaftY - 80);
        ctx.moveTo(shaftX + 30, shaftY - 35);
        ctx.lineTo(shaftX - 30, shaftY - 80);
        ctx.stroke();

        // Rotating Twin Sheave Wheels with Spokes
        const sheaveAngle = tick * 0.07;
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(shaftX - 12, shaftY - 110, 14, 0, Math.PI * 2);
        ctx.arc(shaftX + 12, shaftY - 110, 14, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(shaftX - 12, shaftY - 110);
        ctx.lineTo(shaftX - 12 + Math.cos(sheaveAngle) * 14, shaftY - 110 + Math.sin(sheaveAngle) * 14);
        ctx.moveTo(shaftX + 12, shaftY - 110);
        ctx.lineTo(shaftX + 12 + Math.cos(-sheaveAngle) * 14, shaftY - 110 + Math.sin(-sheaveAngle) * 14);
        ctx.stroke();

        // Vertical Shaft Barrel Cutaway
        ctx.fillStyle = '#080c14';
        ctx.fillRect(shaftX - 22, shaftY, 44, h * 0.64);
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 2;
        ctx.strokeRect(shaftX - 22, shaftY, 44, h * 0.64);

        // Guide Rails
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shaftX - 16, shaftY);
        ctx.lineTo(shaftX - 16, shaftY + h * 0.64);
        ctx.moveTo(shaftX + 16, shaftY);
        ctx.lineTo(shaftX + 16, shaftY + h * 0.64);
        ctx.stroke();

        // Extraction Drift Levels (-140m, -180m, -240m, -385m)
        const levels = [
          { depth: '-140m Extraction Drift', y: shaftY + h * 0.16 },
          { depth: '-180m Active Production Stope', y: shaftY + h * 0.32, active: true },
          { depth: '-240m Haulage Crosscut', y: shaftY + h * 0.48 },
          { depth: '-385m Deep Sump Station', y: shaftY + h * 0.60 }
        ];

        levels.forEach(lvl => {
          ctx.fillStyle = lvl.active ? '#1e293b' : '#0f172a';
          ctx.fillRect(-w * 0.1, lvl.y - 14, w * 1.2, 28);
          ctx.strokeStyle = lvl.active ? '#38bdf8' : '#334155';
          ctx.lineWidth = 1;
          ctx.strokeRect(-w * 0.1, lvl.y - 14, w * 1.2, 28);

          ctx.fillStyle = lvl.active ? '#38bdf8' : '#94a3b8';
          ctx.font = 'bold 9.5px monospace';
          ctx.fillText(lvl.depth, shaftX + 32, lvl.y + 4);
        });

        // Moving Hoist Cage
        const cageCycle = (tick * 0.006) % 1.0;
        const cageY = shaftY + 25 + Math.sin(cageCycle * Math.PI) * (h * 0.46);
        ctx.fillStyle = '#eab308';
        ctx.fillRect(shaftX - 16, cageY - 16, 32, 32);
        ctx.strokeStyle = '#0f172a';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(shaftX - 16, cageY - 16, 32, 32);

        // Hoist Rope
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(shaftX, shaftY - 110);
        ctx.lineTo(shaftX, cageY - 16);
        ctx.stroke();

        // Hoist Cage HUD Tag
        if (layers.telemetry) {
          ctx.fillStyle = 'rgba(11, 18, 32, 0.9)';
          ctx.fillRect(shaftX - 65, cageY - 52, 130, 32);
          ctx.strokeStyle = '#f59e0b';
          ctx.lineWidth = 1;
          ctx.strokeRect(shaftX - 65, cageY - 52, 130, 32);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9.5px monospace';
          ctx.fillText('HOIST SKIP #1', shaftX - 56, cageY - 38);
          ctx.fillStyle = '#38bdf8';
          ctx.font = '8.5px monospace';
          ctx.fillText(`Depth: -${Math.round(140 + cageCycle * 180)}m  12.5 m/s`, shaftX - 56, cageY - 25);
        }

        // Dipping Sausar Braunite Orebody Cutaway
        ctx.fillStyle = 'rgba(168, 85, 247, 0.28)';
        ctx.beginPath();
        ctx.moveTo(shaftX - 240, shaftY + h * 0.12);
        ctx.lineTo(shaftX - 80, shaftY + h * 0.60);
        ctx.lineTo(shaftX - 25, shaftY + h * 0.60);
        ctx.lineTo(shaftX - 180, shaftY + h * 0.12);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#a855f7';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = '#e9d5ff';
        ctx.font = 'bold 10px monospace';
        ctx.fillText('Sausar Braunite Orebody (44.2% Mn)', shaftX - 225, shaftY + h * 0.22);

      } else {
        // -----------------------------------------------------------------------
        // OPENCAST QUARRY AMPHITHEATRE (Tirodi, Dongri Buzurg, Kandri, Ramtek, etc.)
        // -----------------------------------------------------------------------

        // Multi-Tier Terraced Benches (+345m down to +240m pit floor)
        if (layers.terrain) {
          const benchColors = isRainy
            ? ['#182232', '#131b28', '#0e1520', '#080d16']
            : ['#202d42', '#182436', '#121d2c', '#0c1420'];

          [0.44, 0.54, 0.66, 0.80].forEach((ratio, idx) => {
            ctx.fillStyle = benchColors[idx];
            ctx.beginPath();
            ctx.moveTo(-w * 0.2, h * ratio);
            ctx.bezierCurveTo(w * 0.35, h * (ratio - 0.05), w * 0.65, h * (ratio + 0.05), w * 1.3, h * ratio);
            ctx.lineTo(w * 1.3, h * 1.3);
            ctx.lineTo(-w * 0.2, h * 1.3);
            ctx.fill();

            ctx.strokeStyle = isRainy ? 'rgba(56, 189, 248, 0.15)' : 'rgba(245, 158, 11, 0.25)';
            ctx.lineWidth = 1.5;
            ctx.stroke();
          });
        }

        // Wet Haul Road Corridor & Ramps
        if (layers.haulRoutes) {
          const roadColor = isRainy ? '#0a101a' : '#1a2638';
          ctx.strokeStyle = roadColor;
          ctx.lineWidth = 44;
          ctx.lineCap = 'round';
          ctx.lineJoin = 'round';

          ctx.beginPath();
          ctx.moveTo(w * 0.12, h * 0.84);
          ctx.bezierCurveTo(w * 0.38, h * 0.78, w * 0.62, h * 0.72, w * 0.88, h * 0.60);
          ctx.stroke();

          // Wet Specular Reflection Stripe
          ctx.strokeStyle = isRainy ? 'rgba(56, 189, 248, 0.4)' : 'rgba(245, 158, 11, 0.75)';
          ctx.lineWidth = 2.5;
          ctx.setLineDash([16, 10]);
          ctx.beginPath();
          ctx.moveTo(w * 0.12, h * 0.84);
          ctx.bezierCurveTo(w * 0.38, h * 0.78, w * 0.62, h * 0.72, w * 0.88, h * 0.60);
          ctx.stroke();
          ctx.setLineDash([]);
        }

        // Pit Sump & Turquoise Water Basin (SUMP-1)
        if (layers.sumpWater) {
          const sumpX = w * 0.58;
          const sumpY = h * 0.38;
          const sumpRadius = 80;
          const waterHeight = Math.min(60, 26 + (activeParameters.rainfall / 7));

          const waterGrad = ctx.createRadialGradient(sumpX, sumpY, 5, sumpX, sumpY, sumpRadius);
          waterGrad.addColorStop(0, 'rgba(6, 182, 212, 0.8)');
          waterGrad.addColorStop(0.7, 'rgba(2, 132, 199, 0.5)');
          waterGrad.addColorStop(1, 'rgba(15, 23, 42, 0.1)');
          ctx.fillStyle = waterGrad;

          ctx.beginPath();
          ctx.ellipse(sumpX, sumpY, sumpRadius, waterHeight, -0.15, 0, Math.PI * 2);
          ctx.fill();

          if (layers.telemetry) {
            ctx.fillStyle = 'rgba(11, 18, 32, 0.9)';
            ctx.fillRect(sumpX - 58, sumpY - 48, 116, 40);
            ctx.strokeStyle = '#06b6d4';
            ctx.lineWidth = 1;
            ctx.strokeRect(sumpX - 58, sumpY - 48, 116, 40);

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 9.5px monospace';
            ctx.fillText('SUMP-1 (DEWATERING)', sumpX - 50, sumpY - 34);
            ctx.fillStyle = '#94a3b8';
            ctx.font = '8.5px monospace';
            ctx.fillText('Water Level', sumpX - 50, sumpY - 22);
            ctx.fillStyle = '#38bdf8';
            ctx.font = 'bold 9px monospace';
            ctx.fillText(`+1.6m  ${simulationResults.sumpWaterLevel || 3.2}m (72%) ▲`, sumpX - 50, sumpY - 11);
          }
        }

        // Primary Jaw Crusher Complex (CRUSHER-01)
        const crusherX = w * 0.80;
        const crusherY = h * 0.54;
        const isCrusherSeized = activeParameters.crusher < 40;
        drawCrusherStation(crusherX, crusherY, isCrusherSeized);

        if (layers.telemetry) {
          ctx.fillStyle = 'rgba(11, 18, 32, 0.9)';
          ctx.fillRect(crusherX - 58, crusherY - 78, 120, 40);
          ctx.strokeStyle = isCrusherSeized ? '#ef4444' : '#f59e0b';
          ctx.lineWidth = 1;
          ctx.strokeRect(crusherX - 58, crusherY - 78, 120, 40);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9.5px monospace';
          ctx.fillText('CRUSHER-01', crusherX - 50, crusherY - 64);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '8.5px monospace';
          ctx.fillText('Throughput', crusherX - 50, crusherY - 52);
          ctx.fillStyle = isCrusherSeized ? '#f87171' : '#34d399';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(isCrusherSeized ? 'SEIZED  0 TPH' : `${simulationResults.crusherThroughput || 278} TPH  Util: 86%`, crusherX - 50, crusherY - 40);
        }

        // Komatsu PC2000-8 Excavator Face (EX-17)
        const exX = w * 0.28;
        const exY = h * 0.52;
        const armCycle = (tick * 0.012) % 1.0;
        drawKomatsuExcavator(exX, exY, armCycle);

        if (layers.telemetry) {
          ctx.fillStyle = 'rgba(11, 18, 32, 0.9)';
          ctx.fillRect(exX - 54, exY - 58, 110, 40);
          ctx.strokeStyle = '#38bdf8';
          ctx.lineWidth = 1;
          ctx.strokeRect(exX - 54, exY - 58, 110, 40);

          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 9.5px monospace';
          ctx.fillText('EX-17 (PC2000)', exX - 46, exY - 44);
          ctx.fillStyle = '#94a3b8';
          ctx.font = '8.5px monospace';
          ctx.fillText('Shovel Cycle', exX - 46, exY - 32);
          ctx.fillStyle = '#34d399';
          ctx.font = 'bold 9px monospace';
          ctx.fillText('Loading  23s Cycle', exX - 46, exY - 20);
        }

        // Komatsu HD785 Haul Fleet along Haul Ramp Curve
        if (layers.fleet) {
          const speedMult = (activeParameters.haul / 100);
          fleet.forEach((trk, idx) => {
            trk.progress = (trk.progress + 0.0018 * speedMult) % 1.0;
            const tx = w * 0.12 + trk.progress * (w * 0.76);
            const ty = h * 0.84 - Math.sin(trk.progress * Math.PI) * (h * 0.22);
            const heading = -Math.cos(trk.progress * Math.PI) * 0.35;

            drawKomatsuTruck(tx, ty, heading, idx !== 2, Math.round(trk.speed * speedMult), trk.id);

            // Haul Truck HUD Callout Tag
            if (layers.telemetry && (idx === 0 || idx === 1)) {
              const tagY = ty - 54;
              ctx.fillStyle = 'rgba(11, 18, 32, 0.9)';
              ctx.fillRect(tx - 54, tagY, 112, 40);
              ctx.strokeStyle = '#eab308';
              ctx.lineWidth = 1;
              ctx.strokeRect(tx - 54, tagY, 112, 40);

              ctx.fillStyle = '#ffffff';
              ctx.font = 'bold 9.5px monospace';
              ctx.fillText(trk.id, tx - 46, tagY + 14);
              ctx.fillStyle = '#94a3b8';
              ctx.font = '8.5px monospace';
              ctx.fillText(trk.model, tx - 46, tagY + 25);
              ctx.fillStyle = '#34d399';
              ctx.font = 'bold 9px monospace';
              ctx.fillText(`${Math.round(trk.speed * speedMult)} km/h  ${trk.payload}`, tx - 46, tagY + 36);
            }
          });
        }
      }

      // 3D Precipitation Rain Particles
      if (isRainy) {
        ctx.strokeStyle = 'rgba(186, 230, 253, 0.6)';
        ctx.lineWidth = 1.3;
        rainParticles.forEach(p => {
          p.y += p.speed;
          p.x -= 3.0;
          if (p.y > h) {
            p.y = -15;
            p.x = Math.random() * w;
          }
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - 5, p.y + p.len);
          ctx.stroke();
        });
      }

      // Animated Real-Time Radar Compass Overlay (Bottom-Right)
      const compassX = w - 65;
      const compassY = h - 65;
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(compassX, compassY, 28, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = 'rgba(11, 18, 32, 0.85)';
      ctx.fill();

      const sweepAngle = tick * 0.035;
      ctx.strokeStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(compassX, compassY);
      ctx.lineTo(compassX + Math.cos(sweepAngle) * 28, compassY + Math.sin(sweepAngle) * 28);
      ctx.stroke();

      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 8.5px monospace';
      ctx.fillText('N', compassX - 2.5, compassY - 18);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', resize);
      if (animId) cancelAnimationFrame(animId);
    };
  }, [currentMine, activeParameters, isUnderground, layers, cameraMode, selectedScenType, simulationResults]);

  return (
    <div className="space-y-4">
      {/* 1. Main Viewport Container */}
      <div className="relative w-full rounded-3xl overflow-hidden border border-[#22334e] shadow-2xl bg-[#060a12] select-none font-mono text-xs text-zinc-100">

        {/* Canvas Viewport */}
        <canvas
          ref={canvasRef}
          className="w-full h-[540px] block cursor-crosshair"
        />

        {/* Top-Left Active Scene Tag */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 p-2.5 rounded-2xl bg-[#0b1220]/90 border border-[#1e2f4a] backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <strong className="text-white text-xs font-bold tracking-wide">
            {currentMine.name.toUpperCase()} // {isUnderground ? 'UNDERGROUND SHAFT & DRIFT TWIN' : 'OPEN-CAST QUARRY DIGITAL TWIN'}
          </strong>
        </div>

        {/* Top-Right Historical Time-Machine Toggle */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 p-1.5 rounded-2xl bg-[#0b1220]/90 border border-[#1e2f4a] backdrop-blur-md select-none">
          <button
            onClick={() => setIsTimeMachineOpen(!isTimeMachineOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10.5px] font-bold hover:bg-amber-500/30 transition"
          >
            <History className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'hi' ? 'टाइम मशीन:' : lang === 'mr' ? 'टाइम मशीन:' : 'TIME MACHINE:'} {historicalYear}</span>
          </button>
        </div>

        {/* Time Machine Slider Drawer */}
        {isTimeMachineOpen && (
          <div className="absolute top-16 right-4 z-30 w-72 p-4 rounded-2xl bg-[#0b1220]/95 border border-[#1e2f4a] shadow-2xl backdrop-blur-md space-y-2 select-none">
            <div className="flex justify-between items-center text-[10px] text-[#5F625C] font-bold">
              <span>{lang === 'hi' ? 'उपग्रह विकास (2018-2026)' : lang === 'mr' ? 'उपग्रह उत्क्रांती (2018-2026)' : 'SATELLITE EVOLUTION (2018-2026)'}</span>
              <span className="text-amber-400">{historicalYear}</span>
            </div>
            <input
              type="range"
              min="2018"
              max="2026"
              step="1"
              value={historicalYear}
              onChange={(e) => setHistoricalYear(parseInt(e.target.value))}
              className="w-full h-1.5 bg-[#F0EBE2] rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <div className="flex justify-between text-[8.5px] text-[#85877E]">
              <span>2018</span>
              <span>2020</span>
              <span>2022</span>
              <span>2024</span>
              <span>2026</span>
            </div>
            <div className="p-2 rounded-xl bg-[#F5F1E9] border border-[#C8BFAF] text-[9.5px] text-[#272A27] space-y-0.5">
              <div>{lang === 'hi' ? 'पदचिह्न:' : lang === 'mr' ? 'क्षेत्रफळ:' : 'Footprint:'} <strong className="text-white">{Math.round(140.8 + (historicalYear - 2018) * 4.8)} Ha</strong></div>
              <div>{lang === 'hi' ? 'पुनर्प्राप्त:' : lang === 'mr' ? 'पुनर्प्राप्त:' : 'Reclaimed:'} <strong className="text-emerald-400">+{Math.round(1.9 * (historicalYear - 2018))} Ha</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* 2. Interactive Fleet & SCADA Telemetry Badge Strip */}
      <div className="p-3.5 rounded-2xl bg-[#0b1220] border border-[#1e2f4a] shadow-xl flex flex-wrap items-center justify-between gap-2 font-mono text-xs select-none">
        <div className="flex items-center gap-2 text-[#5F625C] text-[10.5px]">
          <Gauge className="w-3.5 h-3.5 text-amber-400" />
          <span className="font-bold uppercase tracking-wider">
            {lang === 'hi' ? 'उपकरण स्काडा जांचने के लिए क्लिक करें:' : lang === 'mr' ? 'उपकरण स्काडा तपासण्यासाठी क्लिक करा:' : 'CLICK TO INSPECT EQUIPMENT SCADA:'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[10px]">
          {[
            { id: 'DT-210', name: 'Komatsu HD785-8', speed: '28 km/h', payload: '92.2T (96%)', engineTemp: '84°C', vibration: '1.8 mm/s', rulHours: 1420, health: 94 },
            { id: 'DT-184', name: 'Komatsu HD785-8', speed: '32 km/h', payload: '88.5T (91%)', engineTemp: '88°C', vibration: '2.1 mm/s', rulHours: 1180, health: 89 },
            { id: 'EX-17',  name: 'Komatsu PC2000', speed: '0 km/h (DIGGING)', payload: '14.0 m³ Bucket', engineTemp: '79°C', vibration: '1.4 mm/s', rulHours: 2150, health: 96 },
            { id: 'GR-03',  name: 'Komatsu GD825A', speed: '12 km/h', payload: 'BLADING ROAD', engineTemp: '76°C', vibration: '1.2 mm/s', rulHours: 1890, health: 95 },
            { id: 'WT-02',  name: 'Komatsu HD465 WT', speed: '20 km/h', payload: '35,000L TANK', engineTemp: '78°C', vibration: '1.3 mm/s', rulHours: 2400, health: 97 },
            { id: 'CRUSHER-01', name: 'Primary Jaw Crusher', speed: `${simulationResults.crusherThroughput || 278} TPH`, payload: 'ROM Feed 450 TPH', engineTemp: '92°C', vibration: activeParameters.crusher < 40 ? '5.4 mm/s (HIGH)' : '2.1 mm/s', rulHours: 850, health: activeParameters.crusher },
            { id: 'SUMP-1', name: 'Pit Sump Submersible', speed: '450 kW', payload: `${simulationResults.sumpWaterLevel || 3.2}m (72%)`, engineTemp: '62°C', vibration: '0.9 mm/s', rulHours: 3100, health: 92 }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setActiveInspector(item)}
              className="px-2.5 py-1 rounded-xl bg-[#121c2c] border border-[#1e2f4a] text-[#272A27] hover:text-white hover:border-amber-400 hover:bg-[#1a283e] transition flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <strong className="text-amber-400 font-bold">{item.id}</strong>
              <span className="text-[#85877E]">|</span>
              <span>{item.speed}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 3. Interactive Machine Inspector Modal */}
      {activeInspector && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 select-none">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#0b1220] border border-[#1e2f4a] shadow-2xl space-y-4 font-mono text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-[#1e2f4a]">
              <div className="flex items-center gap-2 text-amber-400">
                <Truck className="w-5 h-5" />
                <strong className="text-white text-sm">{activeInspector.id} // {activeInspector.name}</strong>
              </div>
              <button
                onClick={() => setActiveInspector(null)}
                className="p-1 rounded-lg text-[#5F625C] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-2.5 rounded-xl bg-[#121c2c] border border-[#1e2f4a]">
                <span className="text-[#5F625C] text-[10px] block">{lang === 'hi' ? 'परिचालन गति / क्षमता' : lang === 'mr' ? 'ऑपरेटिंग वेग / क्षमता' : 'Operating Speed / Capacity'}</span>
                <strong className="text-white">{activeInspector.speed}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-[#121c2c] border border-[#1e2f4a]">
                <span className="text-[#5F625C] text-[10px] block">{lang === 'hi' ? 'लाइव पेलोड भरण' : lang === 'mr' ? 'थेट पेलोड भरणा' : 'Live Payload Fill'}</span>
                <strong className="text-emerald-400">{activeInspector.payload}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-[#121c2c] border border-[#1e2f4a]">
                <span className="text-[#5F625C] text-[10px] block">{lang === 'hi' ? 'इंजन / कोर तापमान' : lang === 'mr' ? 'इंजिन / कोर तापमान' : 'Engine / Core Temp'}</span>
                <strong className="text-amber-400">{activeInspector.engineTemp}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-[#121c2c] border border-[#1e2f4a]">
                <span className="text-[#5F625C] text-[10px] block">{lang === 'hi' ? 'स्पेक्ट्रल कंपन' : lang === 'mr' ? 'स्पेक्ट्रल कंपन' : 'Spectral Vibration'}</span>
                <strong className="text-white">{activeInspector.vibration}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-[#121c2c] border border-[#1e2f4a]">
                <span className="text-[#5F625C] text-[10px] block">{lang === 'hi' ? 'अनुमानित आरयूएल' : lang === 'mr' ? 'अंदाजित आरयूएल' : 'Predictive RUL'}</span>
                <strong className="text-sky-400">{activeInspector.rulHours} {lang === 'hi' ? 'परिचालन घंटे' : lang === 'mr' ? 'ऑपरेटिंग तास' : 'Operating Hours'}</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-[#121c2c] border border-[#1e2f4a]">
                <span className="text-[#5F625C] text-[10px] block">{lang === 'hi' ? 'उपप्रणाली स्वास्थ्य' : lang === 'mr' ? 'उपप्रणाली आरोग्य' : 'Subsystem Health'}</span>
                <strong className="text-emerald-400">{activeInspector.health}% {lang === 'hi' ? 'सामान्य' : lang === 'mr' ? 'सामान्य' : 'Nominal'}</strong>
              </div>
            </div>

            <button
              onClick={() => setActiveInspector(null)}
              className="w-full py-2.5 rounded-xl bg-amber-500 text-obsidian-950 font-bold text-xs hover:bg-amber-400 transition"
            >
              {lang === 'hi' ? 'डायग्नोस्टिक शीट बंद करें' : lang === 'mr' ? 'निदान पत्रक बंद करा' : 'CLOSE DIAGNOSTIC SHEET'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
