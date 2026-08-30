import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { NationalOverviewMap } from '../components/overview/NationalOverviewMap.jsx';
import {
  AetherSectionHeader,
  AetherKpiCard,
  AetherStatusBadge,
  AetherInsightPanel
} from '../components/design-system/index.js';
import { ErrorBoundary } from '../components/common/ErrorBoundary.jsx';
import { earthObservationApi } from '../services/api/earthObservationApi.js';
import {
  Building2,
  TrendingDown,
  AlertTriangle,
  ShieldCheck,
  ChevronRight,
  Activity,
  Zap,
  FileText,
  Globe2,
  Radio,
  Layers,
  Cpu,
  Compass,
  ArrowUpRight,
  Sparkles,
  Truck,
  Database,
  BarChart3,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const Home = () => {
  return (
    <ErrorBoundary title="NATIONAL COMMAND OVERVIEW RECOVERY">
      <HomeContent />
    </ErrorBoundary>
  );
};

const HomeContent = () => {
  const navigate = useNavigate();
  const {
    setSelectedMineId,
    apiConnected,
    setIsReportModalOpen,
    t,
    lang
  } = useApp();

  const [eoData, setEoData] = useState(null);
  const ov = t?.overview || {};

  useEffect(() => {
    let isMounted = true;
    earthObservationApi.getNationalSummary().then(data => {
      if (isMounted && data) {
        setEoData(data);
      }
    }).catch(() => {
      if (isMounted) {
        setEoData({
          totalMinesMonitored: 10,
          lowCloudCoverMines: 8,
          changeDetectedMines: 3,
          highPriorityMines: 2,
          totalActiveFootprintHa: 1411.2,
          latestImageryDate: '26 AUG 2026',
          satellitesActive: ['Sentinel-2A', 'Sentinel-2B', 'Landsat-8', 'Landsat-9']
        });
      }
    });
    return () => { isMounted = false; };
  }, []);

  const priorityInterventions = [
    {
      id: 'balaghat',
      name: lang === 'hi' ? 'à¤¬à¤¾à¤²à¤¾à¤˜à¤¾à¤Ÿ à¤–à¤¦à¤¾à¤¨' : lang === 'mr' ? 'à¤¬à¤¾à¤²à¤¾à¤˜à¤¾à¤Ÿ à¤–à¤¾à¤£' : 'Balaghat Mine',
      district: 'Balaghat',
      state: 'Madhya Pradesh',
      gap: '-1,382 MT',
      prob: '84%',
      target: '6,200 TPD',
      status: 'CRITICAL',
      threat: 'Deep Sump Flooding + Western Haul Road Traction Slurry'
    },
    {
      id: 'dongri-buzurg',
      name: lang === 'hi' ? 'à¤¡à¥‹à¤‚à¤—à¤°à¥€ à¤¬à¥à¤œà¥à¤°à¥à¤— à¤–à¤¦à¤¾à¤¨' : lang === 'mr' ? 'à¤¡à¥‹à¤‚à¤—à¤°à¥€ à¤¬à¥à¤œà¥à¤°à¥à¤— à¤–à¤¾à¤£' : 'Dongri Buzurg Mine',
      district: 'Bhandara',
      state: 'Maharashtra',
      gap: '-1,382 MT',
      prob: '76%',
      target: '5,800 TPD',
      status: 'CRITICAL',
      threat: 'Primary Jaw Crusher Drive Bearing Harmonic Drift (42 Hz Peak)'
    },
    {
      id: 'tirodi',
      name: lang === 'hi' ? 'à¤¤à¤¿à¤°à¥‹à¤¡à¤¼à¥€ à¤–à¤¦à¤¾à¤¨' : lang === 'mr' ? 'à¤¤à¤¿à¤°à¥‹à¤¡à¥€ à¤–à¤¾à¤£' : 'Tirodi Mine',
      district: 'Balaghat',
      state: 'Madhya Pradesh',
      gap: '-756 MT',
      prob: '68%',
      target: '3,100 TPD',
      status: 'CRITICAL',
      threat: 'Opencast Bench Drainage Inflow Exceeding 1,800 mÂ³/h'
    },
    {
      id: 'kandri',
      name: lang === 'hi' ? 'à¤•à¤¾à¤‚à¤¦à¥à¤°à¥€ à¤–à¤¦à¤¾à¤¨' : lang === 'mr' ? 'à¤•à¤¾à¤‚à¤¦à¥à¤°à¥€ à¤–à¤¾à¤£' : 'Kandri Mine',
      district: 'Nagpur',
      state: 'Maharashtra',
      gap: '-590 MT',
      prob: '52%',
      target: '2,800 TPD',
      status: 'WATCH',
      threat: 'Underground Ore Hoisting Cycle Speed Throttled'
    }
  ];

  const recentDecisions = [
    {
      id: 'dec-1',
      title: lang === 'hi' ? 'à¤¬à¤¾à¤²à¤¾à¤˜à¤¾à¤Ÿ: à¤¸à¤¹à¤¾à¤¯à¤• à¤œà¤² à¤¨à¤¿à¤•à¤¾à¤¸à¥€ à¤ªà¤‚à¤ª à¤¸à¤•à¥à¤°à¤¿à¤¯' : lang === 'mr' ? 'à¤¬à¤¾à¤²à¤¾à¤˜à¤¾à¤Ÿ: à¤¸à¤¹à¤¾à¤¯à¥à¤¯à¤• à¤¨à¤¿à¤šà¤°à¤¾ à¤ªà¤‚à¤ª à¤¸à¥à¤°à¥‚' : 'Balaghat: Auxiliary Dewatering Deployed',
      description: 'Dispatched 3 auxiliary submersible pumps (650 mÂ³/h) + diverted 4 heavy dumpers to Western bypass.',
      timestamp: '10:14 IST â€¢ SHIFT A',
      badge: '+1,116 T Protected'
    },
    {
      id: 'dec-2',
      title: lang === 'hi' ? 'à¤¡à¥‹à¤‚à¤—à¤°à¥€ à¤¬à¥à¤œà¥à¤°à¥à¤—: à¤•à¥à¤°à¤¶à¤° à¤«à¥€à¤¡ à¤¸à¤‚à¤¤à¥à¤²à¤¨' : lang === 'mr' ? 'à¤¡à¥‹à¤‚à¤—à¤°à¥€ à¤¬à¥à¤œà¥à¤°à¥à¤—: à¤•à¥à¤°à¤¶à¤° à¤«à¥€à¤¡ à¤¸à¤‚à¤¤à¥à¤²à¤¨' : 'Dongri Buzurg: Crusher Feed Throttled',
      description: 'Throttled primary crusher feed from 280 to 200 TPH to prevent drive bearing seizure.',
      timestamp: '09:42 IST â€¢ SHIFT A',
      badge: 'Asset Protected'
    },
    {
      id: 'dec-3',
      title: lang === 'hi' ? 'à¤šà¤¿à¤•à¤²: à¤¸à¥à¤Ÿà¥‰à¤•à¤ªà¤¾à¤‡à¤² à¤¸à¤®à¥à¤®à¤¿à¤¶à¥à¤°à¤£ à¤ªà¥à¤°à¥‹à¤Ÿà¥‹à¤•à¥‰à¤²' : lang === 'mr' ? 'à¤šà¤¿à¤–à¤²à¤¾: à¤¸à¤¾à¤ à¤¾ à¤®à¤¿à¤¶à¥à¤°à¤£ à¤ªà¥à¤°à¥‹à¤Ÿà¥‹à¤•à¥‰à¤²' : 'Chikla: Non-Linear Grade Blending',
      description: 'Configured blending ratio to 55:45 (ROM : Stockpile) to meet 42.5% Mn specification.',
      timestamp: '08:30 IST â€¢ SHIFT A',
      badge: 'Grade Assured'
    }
  ];

  return (
    <div className="space-y-6 font-sans">

      {/* 1. TOP NATIONAL PLATFORM HEADER */}
      <AetherSectionHeader
        title={ov?.title || 'National Mining Intelligence Platform'}
        subtitle="Real-time multi-mine operational command, predictive shortfall mitigation, and multi-spectral Earth Observation satellite intelligence across all 10 canonical MOIL mining sectors."
        badge={apiConnected ? 'FASTAPI REST LIVE' : 'DEMO MODE'}
        accent="#F59E0B"
        icon={Layers}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="btn-command-secondary text-xs"
            >
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              <span>{lang === 'hi' ? 'à¤•à¤¾à¤°à¥à¤¯à¤•à¤¾à¤°à¥€ à¤°à¤¿à¤ªà¥‹à¤°à¥à¤Ÿ (PDF/PPT)' : lang === 'mr' ? 'à¤•à¤¾à¤°à¥à¤¯à¤•à¤¾à¤°à¥€ à¤…à¤¹à¤µà¤¾à¤² (PDF/PPT)' : 'Executive Report'}</span>
            </button>

            <button
              onClick={() => navigate('/command-center')}
              className="btn-command-primary text-xs"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤–à¤¦à¤¾à¤¨ à¤•à¥‰à¤•à¤ªà¤¿à¤Ÿ' : lang === 'mr' ? 'à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤–à¤¾à¤£ à¤•à¥‰à¤•à¤ªà¤¿à¤Ÿ' : 'Mine Command Cockpit'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      />

      {/* 2. PHASE 9: 6 KPI METRIC CARDS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <AetherKpiCard
          title={lang === 'hi' ? 'à¤¨à¤¿à¤—à¤°à¤¾à¤¨à¥€ à¤µà¤¾à¤²à¥€ à¤–à¤¦à¤¾à¤¨à¥‡à¤‚' : lang === 'mr' ? 'à¤¨à¤¿à¤°à¥€à¤•à¥à¤·à¤£ à¤•à¥‡à¤²à¥‡à¤²à¥à¤¯à¤¾ à¤–à¤¾à¤£à¥€' : 'MINES MONITORED'}
          value="10"
          unit="ASSETS"
          subtitle="MP & MH Belt"
          status="OPTIMAL"
          icon={Building2}
          accent="navy"
          change="100% Online"
          changeType="positive"
          sparklineData={[10, 10, 10, 10, 10, 10]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'à¤‰à¤¤à¥à¤ªà¤¾à¤¦à¤¨ à¤¸à¥à¤¥à¤¿à¤¤à¤¿' : lang === 'mr' ? 'à¤‰à¤¤à¥à¤ªà¤¾à¤¦à¤¨ à¤¸à¥à¤¥à¤¿à¤¤à¥€' : 'PRODUCTION STATUS'}
          value="25,322"
          unit="TPD"
          subtitle="vs 32,400 Target"
          status="CRITICAL"
          icon={TrendingDown}
          accent="coral"
          change="-7,078 TPD"
          changeType="negative"
          sparklineData={[32, 30, 28, 27, 26, 25.3]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤—à¤‚à¤­à¥€à¤° à¤…à¤²à¤°à¥à¤Ÿ' : lang === 'mr' ? 'à¤¸à¤•à¥à¤°à¤¿à¤¯ à¤—à¤‚à¤­à¥€à¤° à¤‡à¤¶à¤¾à¤°à¥‡' : 'CRITICAL ALERTS'}
          value="4"
          unit="ACTIVE"
          subtitle="High Triage Sites"
          status="CRITICAL"
          icon={AlertTriangle}
          accent="amber"
          change="Triage Active"
          changeType="negative"
          sparklineData={[1, 2, 2, 3, 4, 4]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'à¤¬à¥‡à¤¡à¤¼à¥‡ à¤•à¥€ à¤‰à¤ªà¤²à¤¬à¥à¤§à¤¤à¤¾' : lang === 'mr' ? 'à¤¤à¤¾à¤«à¥à¤¯à¤¾à¤šà¥€ à¤‰à¤ªà¤²à¤¬à¥à¤§à¤¤à¤¾' : 'FLEET AVAILABILITY'}
          value="89.4%"
          unit="UPTIME"
          subtitle="108 SCADA Assets"
          status="OPTIMAL"
          icon={Cpu}
          accent="emerald"
          change="+2.1% MoM"
          changeType="positive"
          sparklineData={[84, 85, 87, 88, 89, 89.4]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'à¤­à¤‚à¤¡à¤¾à¤° à¤‡à¤‚à¤Ÿà¥‡à¤²à¤¿à¤œà¥‡à¤‚à¤¸' : lang === 'mr' ? 'à¤¸à¤¾à¤ à¤¾ à¤‡à¤‚à¤Ÿà¥‡à¤²à¤¿à¤œà¥‡à¤‚à¤¸' : 'RESERVE RADAR'}
          value="73.8M"
          unit="TONNES"
          subtitle="UNFC 111 Proved"
          status="OPTIMAL"
          icon={Compass}
          accent="cyan"
          change="+1.8M Vein"
          changeType="positive"
          sparklineData={[71, 72, 72.5, 73, 73.5, 73.8]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'à¤à¤†à¤ˆ à¤µà¤¿à¤¶à¥à¤µà¤¾à¤¸ à¤¸à¥à¤•à¥‹à¤°' : lang === 'mr' ? 'à¤à¤†à¤¯ à¤µà¤¿à¤¶à¥à¤µà¤¾à¤¸ à¤¸à¥à¤•à¥‹à¤°' : 'PREDICTION CONFIDENCE'}
          value="94.2%"
          unit="TRUST"
          subtitle="Bayesian AI Model"
          status="OPTIMAL"
          icon={ShieldCheck}
          accent="indigo"
          change="High Trust"
          changeType="positive"
          sparklineData={[91, 92, 93, 93.8, 94, 94.2]}
        />
      </div>

      {/* 3. EARTH OBSERVATION SATELLITE BANNER */}
      <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-sm flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#0F172A]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-300 text-[#0891B2]">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#0F172A] font-display">Sentinel-2 MSI Level-2A Remote Sensing</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                ACTIVE CONSTELLATION
              </span>
            </div>
            <p className="text-[11px] text-[#475569] font-sans">
              10m Optical &amp; 20m SWIR Mineral Alteration Bands â€¢ Sausar Group Precambrian Metamorphic Horizon
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#475569]">
          <div>Scene Date: <strong className="text-[#0F172A]">{eoData?.latestImageryDate || '26 AUG 2026'}</strong></div>
          <span className="text-[#CBD5E1]">â€¢</span>
          <div>Active Lease Footprint: <strong className="text-[#0F172A]">{eoData?.totalActiveFootprintHa || '1,411.2'} Ha</strong></div>
        </div>
      </div>

      {/* 4. MAIN GEOGRAPHIC NATIONAL OVERVIEW MAP */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-black text-sm text-[#0F172A]">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>NATIONAL MINE NETWORK MAP (WGS84 Zero-Key Leaflet)</span>
          </div>
          <span className="text-xs font-mono text-[#64748B]">Click any mine marker to focus operational telemetry</span>
        </div>

        <NationalOverviewMap onSelectMine={(m) => setSelectedMineId(m.id)} />
      </div>

      {/* 5. 4-PILLAR OPERATIONAL INTELLIGENCE CARDS (Phase 9) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Operational Risk */}
        <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-sm space-y-2 border-t-4 border-t-red-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#334155] uppercase font-mono">OPERATIONAL RISK</span>
            <AetherStatusBadge status="CRITICAL" size="sm" pulse={false} />
          </div>
          <div className="text-xl font-black text-[#0F172A] font-display">4 Priority Sites</div>
          <p className="text-[11px] text-[#475569]">Flooding, bearing harmonic drift &amp; slope stability alarms active.</p>
          <button
            onClick={() => navigate('/alert-engine')}
            className="text-xs font-bold text-red-700 hover:text-red-900 inline-flex items-center gap-1 font-mono pt-1"
          >
            Threat Matrix <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Production Intelligence */}
        <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-sm space-y-2 border-t-4 border-t-amber-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#334155] uppercase font-mono">PRODUCTION INTELLIGENCE</span>
            <AetherStatusBadge status="WATCH" size="sm" pulse={false} />
          </div>
          <div className="text-xl font-black text-[#0F172A] font-display">78.2% Yield</div>
          <p className="text-[11px] text-[#475569]">-7,078 TPD shortfall against 32,400 TPD aggregate national plan.</p>
          <button
            onClick={() => navigate('/analytics')}
            className="text-xs font-bold text-amber-700 hover:text-amber-900 inline-flex items-center gap-1 font-mono pt-1"
          >
            Analytics Hub <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fleet Health */}
        <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-sm space-y-2 border-t-4 border-t-emerald-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#334155] uppercase font-mono">FLEET HEALTH</span>
            <AetherStatusBadge status="OPTIMAL" size="sm" pulse={false} />
          </div>
          <div className="text-xl font-black text-[#0F172A] font-display">89.4% Availability</div>
          <p className="text-[11px] text-[#475569]">96 of 108 Heavy LHD &amp; Dumper assets operating within thermal limits.</p>
          <button
            onClick={() => navigate('/equipment')}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-900 inline-flex items-center gap-1 font-mono pt-1"
          >
            Fleet SCADA <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reserve Intelligence */}
        <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-sm space-y-2 border-t-4 border-t-cyan-500">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#334155] uppercase font-mono">RESERVE INTELLIGENCE</span>
            <AetherStatusBadge status="OPTIMAL" size="sm" pulse={false} />
          </div>
          <div className="text-xl font-black text-[#0F172A] font-display">73.8M Tonnes</div>
          <p className="text-[11px] text-[#475569]">Sausar Group syncline 3D block model validated with UNFC 2009 standards.</p>
          <button
            onClick={() => navigate('/reserve-radar')}
            className="text-xs font-bold text-cyan-700 hover:text-cyan-900 inline-flex items-center gap-1 font-mono pt-1"
          >
            Reserve Radar <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 6. AETHER INTELLIGENCE & EXPLAINABILITY PANEL */}
      <AetherInsightPanel />

      {/* 7. BOTTOM SECTION: Priority Interventions Table & Statutory Decision Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left 7 Cols: Priority Interventions Table */}
        <div className="lg:col-span-7 bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A] font-display">
                Critical Shortfall Assets (Triage Queue)
              </h3>
              <p className="text-xs text-[#475569]">
                Immediate prescriptive intervention candidates
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-red-700">
              4 ASSETS REQUIRING ACTION
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table-industrial">
              <thead>
                <tr>
                  <th>MINE ASSET</th>
                  <th>DAILY GAP</th>
                  <th>SHORTFALL PROB</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {priorityInterventions.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="font-bold text-[#0F172A]">{p.name}</div>
                      <div className="text-[10px] text-[#64748B] font-sans">{p.district}, {p.state}</div>
                    </td>
                    <td className="font-bold text-red-700">
                      {p.gap}
                    </td>
                    <td className="font-bold text-[#0F172A]">
                      {p.prob}
                    </td>
                    <td>
                      <AetherStatusBadge status={p.status} size="sm" pulse={false} />
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedMineId(p.id);
                          navigate('/command-center');
                        }}
                        className="px-2.5 py-1 rounded bg-[#0F172A] hover:bg-[#1E293B] text-white font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1 shadow-xs"
                      >
                        Focus <ArrowUpRight className="w-3 h-3 text-amber-400" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: Recent Statutory Decisions Feed */}
        <div className="lg:col-span-5 bg-white border border-[#CBD5E1] rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1]">
            <div>
              <h3 className="font-bold text-sm text-[#0F172A] font-display">
                Recent Statutory Decisions
              </h3>
              <p className="text-xs text-[#475569]">
                DGMS Shift mitigation ledger
              </p>
            </div>
            <button
              onClick={() => navigate('/decision-log')}
              className="text-xs font-mono font-bold text-indigo-700 hover:text-indigo-900 flex items-center gap-1"
            >
              Full Ledger <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentDecisions.map((dec) => (
              <div
                key={dec.id}
                className="p-3 rounded-lg bg-[#F8FAFC] border border-[#CBD5E1] space-y-1 hover:border-slate-400 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#0F172A] font-display">{dec.title}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    {dec.badge}
                  </span>
                </div>
                <p className="text-xs text-[#334155] font-sans">
                  {dec.description}
                </p>
                <div className="text-[10px] font-mono text-[#64748B] flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{dec.timestamp}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
