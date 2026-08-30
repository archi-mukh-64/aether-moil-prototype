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
  Sparkles
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
      name: lang === 'hi' ? 'बालाघाट खदान' : lang === 'mr' ? 'बालाघाट खाण' : 'Balaghat Mine',
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
      name: lang === 'hi' ? 'डोंगरी बुजुर्ग खदान' : lang === 'mr' ? 'डोंगरी बुजुर्ग खाण' : 'Dongri Buzurg Mine',
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
      name: lang === 'hi' ? 'तिरोड़ी खदान' : lang === 'mr' ? 'तिरोडी खाण' : 'Tirodi Mine',
      district: 'Balaghat',
      state: 'Madhya Pradesh',
      gap: '-756 MT',
      prob: '68%',
      target: '3,100 TPD',
      status: 'CRITICAL',
      threat: 'Opencast Bench Drainage Inflow Exceeding 1,800 m³/h'
    },
    {
      id: 'kandri',
      name: lang === 'hi' ? 'कांद्री खदान' : lang === 'mr' ? 'कांद्री खाण' : 'Kandri Mine',
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
      title: lang === 'hi' ? 'बालाघाट: सहायक जल निकासी पंप सक्रिय' : lang === 'mr' ? 'बालाघाट: सहाय्यक निचरा पंप सुरू' : 'Balaghat: Auxiliary Dewatering Deployed',
      description: 'Dispatched 3 auxiliary submersible pumps (650 m³/h) + diverted 4 heavy dumpers to Western bypass.',
      timestamp: '10:14 IST • SHIFT A',
      badge: '+1,116 T Protected'
    },
    {
      id: 'dec-2',
      title: lang === 'hi' ? 'डोंगरी बुजुर्ग: क्रशर फीड संतुलन' : lang === 'mr' ? 'डोंगरी बुजुर्ग: क्रशर फीड संतुलन' : 'Dongri Buzurg: Crusher Feed Throttled',
      description: 'Throttled primary crusher feed from 280 to 200 TPH to prevent drive bearing seizure.',
      timestamp: '09:42 IST • SHIFT A',
      badge: 'Asset Protected'
    },
    {
      id: 'dec-3',
      title: lang === 'hi' ? 'चिकल: स्टॉकपाइल सम्मिश्रण प्रोटोकॉल' : lang === 'mr' ? 'चिखला: साठा मिश्रण प्रोटोकॉल' : 'Chikla: Non-Linear Grade Blending',
      description: 'Configured blending ratio to 55:45 (ROM : Stockpile) to meet 42.5% Mn specification.',
      timestamp: '08:30 IST • SHIFT A',
      badge: 'Grade Assured'
    }
  ];

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. TOP NATIONAL PLATFORM HEADER */}
      <AetherSectionHeader
        title={ov?.title || 'National Manganese Mining Intelligence Platform'}
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
              <span>{lang === 'hi' ? 'कार्यकारी रिपोर्ट (PDF/PPT)' : lang === 'mr' ? 'कार्यकारी अहवाल (PDF/PPT)' : 'Executive Report'}</span>
            </button>

            <button
              onClick={() => navigate('/command-center')}
              className="btn-command-primary text-xs"
            >
              <Radio className="w-3.5 h-3.5" />
              <span>{lang === 'hi' ? 'सक्रिय खदान कॉकपिट' : lang === 'mr' ? 'सक्रिय खाण कॉकपिट' : 'Mine Command Cockpit'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        }
      />

      {/* 2. NATIONAL EXECUTIVE STATUS KPI GRID */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <AetherKpiCard
          title={lang === 'hi' ? 'निगरानी वाली खदानें' : lang === 'mr' ? 'निरीक्षण केलेल्या खाणी' : 'MINES MONITORED'}
          value="10"
          unit="ASSETS"
          subtitle="Central Belt (MP & MH)"
          status="OPTIMAL"
          icon={Building2}
          accent="navy"
          change="+100% Online"
          changeType="positive"
          sparklineData={[10, 10, 10, 10, 10, 10]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'दैनिक राष्ट्रीय लक्ष्य' : lang === 'mr' ? 'दैनिक राष्ट्रीय उद्दिष्ट' : 'NATIONAL TARGET'}
          value="32,400"
          unit="TPD"
          subtitle="All 10 Operating Leases"
          status="OPTIMAL"
          icon={Activity}
          accent="amber"
          change="Baseline Plan"
          changeType="neutral"
          sparklineData={[28, 30, 31, 32, 32, 32.4]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? '14-दिवसीय अनुमान' : lang === 'mr' ? '14-दिवसीय अंदाज' : '14-DAY FORECAST'}
          value="25,322"
          unit="TPD"
          subtitle="Unmitigated Trajectory"
          status="CRITICAL"
          icon={TrendingDown}
          accent="coral"
          change="-7,078 TPD Gap"
          changeType="negative"
          sparklineData={[32, 30, 28, 27, 26, 25.3]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'लक्ष्य प्राप्ति' : lang === 'mr' ? 'उद्दिष्ट प्राप्ती' : 'TARGET ATTAINMENT'}
          value="78.2%"
          unit="YIELD"
          subtitle="Across Total MOIL Quotas"
          status="WATCH"
          icon={Zap}
          accent="emerald"
          change="-21.8% Deficit"
          changeType="negative"
          sparklineData={[88, 85, 82, 80, 78, 78.2]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'प्राथमिक हस्तक्षेप' : lang === 'mr' ? 'प्राधान्य हस्तक्षेप' : 'PRIORITY SITES'}
          value="4"
          unit="MINES"
          subtitle="Immediate Action Needed"
          status="CRITICAL"
          icon={AlertTriangle}
          accent="amber"
          change="Triage Active"
          changeType="negative"
          sparklineData={[1, 2, 2, 3, 4, 4]}
        />
      </div>

      {/* 3. EARTH OBSERVATION SATELLITE BANNER */}
      <div className="p-4 rounded-xl bg-white border border-[#CBD5E1] shadow-xs flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#172033]">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200 text-[#0891B2]">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-[#172033] font-display">Sentinel-2 MSI Level-2A Remote Sensing</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                ACTIVE CONSTELLATION
              </span>
            </div>
            <p className="text-[11px] text-[#64748B] font-sans">
              10m Optical &amp; 20m SWIR Mineral Alteration Bands • Sausar Group Precambrian Metamorphic Horizon
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#64748B]">
          <div>Scene: <strong className="text-[#172033]">{eoData?.latestImageryDate || '26 AUG 2026'}</strong></div>
          <div>Active Footprint: <strong className="text-[#172033]">{eoData?.totalActiveFootprintHa || '1,411.2'} Ha</strong></div>
        </div>
      </div>

      {/* 4. MAIN GEOGRAPHIC NATIONAL OVERVIEW MAP */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-bold text-sm text-[#172033]">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>MOIL Central Mining Corridor (WGS84 Zero-Key Leaflet)</span>
          </div>
          <span className="text-xs font-mono text-[#64748B]">Click any mine marker to focus operational telemetry</span>
        </div>

        <NationalOverviewMap onSelectMine={(m) => setSelectedMineId(m.id)} />
      </div>

      {/* 5. AETHER INTELLIGENCE & EXPLAINABILITY PANEL */}
      <AetherInsightPanel />

      {/* 6. BOTTOM SECTION: Priority Interventions Table & Statutory Decision Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Cols: Priority Interventions Table */}
        <div className="lg:col-span-7 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-sm text-[#172033] font-display">
                Critical Shortfall Assets (Triage Queue)
              </h3>
              <p className="text-xs text-[#64748B]">
                Immediate prescriptive intervention candidates
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-red-600">
              4 ASSETS AT RISK
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="table-industrial">
              <thead>
                <tr>
                  <th>MINE ASSET</th>
                  <th>TARGET</th>
                  <th>GAP</th>
                  <th>STATUS</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {priorityInterventions.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <div className="font-bold text-[#172033]">{p.name}</div>
                      <div className="text-[11px] text-[#64748B] font-mono">{p.district}, {p.state}</div>
                    </td>
                    <td className="font-mono">{p.target}</td>
                    <td className="font-mono font-bold text-red-600">{p.gap}</td>
                    <td>
                      <AetherStatusBadge status={p.status} size="sm" pulse={false} />
                    </td>
                    <td>
                      <button
                        onClick={() => {
                          setSelectedMineId(p.id);
                          navigate('/protocol');
                        }}
                        className="px-2.5 py-1 rounded bg-[#F1F5F9] hover:bg-slate-200 text-[#1E293B] font-mono text-[11px] font-bold transition-colors inline-flex items-center gap-1"
                      >
                        <span>Dispatch</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: Recent Statutory Decision Log Feed */}
        <div className="lg:col-span-5 bg-white border border-[#E2E8F0] rounded-xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div>
              <h3 className="font-bold text-sm text-[#172033] font-display">
                DGMS Statutory Decision Ledger
              </h3>
              <p className="text-xs text-[#64748B]">
                Recent verified shift supervisor interventions
              </p>
            </div>
            <Link 
              to="/decision-log" 
              className="text-xs font-mono font-bold text-amber-600 hover:text-amber-700 inline-flex items-center gap-1"
            >
              <span>Ledger</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentDecisions.map((dec) => (
              <div 
                key={dec.id} 
                className="p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#172033]">
                    {dec.title}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {dec.badge}
                  </span>
                </div>
                <p className="text-xs text-[#475569]">
                  {dec.description}
                </p>
                <div className="text-[10px] font-mono text-[#94A3B8]">
                  {dec.timestamp}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
