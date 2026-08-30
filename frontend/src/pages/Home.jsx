import { useState, useEffect } from 'react';
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
  FileText,
  Globe2,
  Radio,
  Layers,
  Cpu,
  Compass,
  ArrowUpRight,
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

      {/* 1. TOP NATIONAL PLATFORM HEADER (Earth + Copper Theme) */}
      <AetherSectionHeader
        title={ov?.title || 'National Mining Intelligence Platform'}
        subtitle="Real-time multi-mine operational command, predictive shortfall mitigation, and multi-spectral Earth Observation satellite intelligence across all 10 canonical MOIL mining sectors."
        badge={apiConnected ? 'FASTAPI REST LIVE' : 'DEMO MODE'}
        accent="#C46A32"
        icon={Layers}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="btn-command-secondary text-xs"
            >
              <FileText className="w-3.5 h-3.5 text-[#C46A32]" />
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

      {/* 2. PHASE 11: 6 SEMANTIC KPI CARDS ROW */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <AetherKpiCard
          title={lang === 'hi' ? 'निगरानी वाली खदानें' : lang === 'mr' ? 'निरीक्षण केलेल्या खाणी' : 'MINES MONITORED'}
          value="10"
          unit="ASSETS"
          subtitle="MP & MH Belt"
          status="OPTIMAL"
          icon={Building2}
          accent="teal"
          change="100% Online"
          changeType="positive"
          sparklineData={[10, 10, 10, 10, 10, 10]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'उत्पादन स्थिति' : lang === 'mr' ? 'उत्पादन स्थिती' : 'PRODUCTION STATUS'}
          value="25,322"
          unit="TPD"
          subtitle="vs 32,400 Target"
          status="CRITICAL"
          icon={TrendingDown}
          accent="copper"
          change="-7,078 TPD"
          changeType="negative"
          sparklineData={[32, 30, 28, 27, 26, 25.3]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'सक्रिय गंभीर अलर्ट' : lang === 'mr' ? 'सक्रिय गंभीर इशारे' : 'CRITICAL ALERTS'}
          value="4"
          unit="ACTIVE"
          subtitle="High Triage Sites"
          status="CRITICAL"
          icon={AlertTriangle}
          accent="vermilion"
          change="Triage Active"
          changeType="negative"
          sparklineData={[1, 2, 2, 3, 4, 4]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'बेड़े की उपलब्धता' : lang === 'mr' ? 'ताफ्याची उपलब्धता' : 'FLEET AVAILABILITY'}
          value="89.4%"
          unit="UPTIME"
          subtitle="108 SCADA Assets"
          status="OPTIMAL"
          icon={Cpu}
          accent="sage"
          change="+2.1% MoM"
          changeType="positive"
          sparklineData={[84, 85, 87, 88, 89, 89.4]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'भंडार इंटेलिजेंस' : lang === 'mr' ? 'साठा इंटेलिजेंस' : 'RESERVE RADAR'}
          value="73.8M"
          unit="TONNES"
          subtitle="UNFC 111 Proved"
          status="OPTIMAL"
          icon={Compass}
          accent="ochre"
          change="+1.8M Vein"
          changeType="positive"
          sparklineData={[71, 72, 72.5, 73, 73.5, 73.8]}
        />

        <AetherKpiCard
          title={lang === 'hi' ? 'एआई विश्वास स्कोर' : lang === 'mr' ? 'एआय विश्वास स्कोर' : 'PREDICTION CONFIDENCE'}
          value="94.2%"
          unit="TRUST"
          subtitle="Bayesian AI Model"
          status="OPTIMAL"
          icon={ShieldCheck}
          accent="violet"
          change="High Trust"
          changeType="positive"
          sparklineData={[91, 92, 93, 93.8, 94, 94.2]}
        />
      </div>

      {/* 3. EARTH OBSERVATION SATELLITE BANNER */}
      <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-[#272A27]">
        <div className="flex items-center gap-3 min-w-0">
          <div className="p-2 rounded-lg bg-[#3D8C8A]/10 border border-[#3D8C8A]/30 text-[#3D8C8A] shrink-0">
            <Globe2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-[#272A27] font-display">Sentinel-2 MSI Level-2A Remote Sensing</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#71856B]/20 text-[#4A5845] border border-[#71856B]/40">
                ACTIVE CONSTELLATION
              </span>
            </div>
            <p className="text-[11px] text-[#5F625C] font-sans truncate">
              10m Optical &amp; 20m SWIR Mineral Alteration Bands • Sausar Group Precambrian Metamorphic Horizon
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-[11px] text-[#5F625C] shrink-0">
          <div>Scene Date: <strong className="text-[#272A27]">{eoData?.latestImageryDate || '26 AUG 2026'}</strong></div>
          <span className="text-[#C8BFAF]">•</span>
          <div>Active Lease Footprint: <strong className="text-[#272A27]">{eoData?.totalActiveFootprintHa || '1,411.2'} Ha</strong></div>
        </div>
      </div>

      {/* 4. MAIN GEOGRAPHIC NATIONAL OVERVIEW MAP */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-display font-black text-sm text-[#272A27]">
            <Compass className="w-4 h-4 text-[#C46A32]" />
            <span>NATIONAL MINE NETWORK MAP (WGS84 Zero-Key Leaflet)</span>
          </div>
          <span className="text-xs font-mono text-[#85877E]">Click any mine marker to focus operational telemetry</span>
        </div>

        <NationalOverviewMap onSelectMine={(m) => setSelectedMineId(m.id)} />
      </div>

      {/* 5. 4-PILLAR OPERATIONAL INTELLIGENCE CARDS (Phase 5) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Operational Risk */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-2 border-t-4 border-t-[#C84B3F]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5F625C] uppercase font-mono">OPERATIONAL RISK</span>
            <AetherStatusBadge status="CRITICAL" size="sm" pulse={false} />
          </div>
          <div className="text-xl font-black text-[#272A27] font-display">4 Priority Sites</div>
          <p className="text-[11px] text-[#5F625C]">Flooding, bearing harmonic drift &amp; slope stability alarms active.</p>
          <button
            onClick={() => navigate('/alert-engine')}
            className="text-xs font-bold text-[#872C23] hover:text-[#C84B3F] inline-flex items-center gap-1 font-mono pt-1 cursor-pointer"
          >
            Threat Matrix <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Production Intelligence */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-2 border-t-4 border-t-[#C46A32]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5F625C] uppercase font-mono">PRODUCTION INTELLIGENCE</span>
            <AetherStatusBadge status="WATCH" size="sm" pulse={false} />
          </div>
          <div className="text-xl font-black text-[#272A27] font-display">78.2% Yield</div>
          <p className="text-[11px] text-[#5F625C]">-7,078 TPD shortfall against 32,400 TPD aggregate national plan.</p>
          <button
            onClick={() => navigate('/analytics')}
            className="text-xs font-bold text-[#8E441B] hover:text-[#C46A32] inline-flex items-center gap-1 font-mono pt-1 cursor-pointer"
          >
            Analytics Hub <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Fleet Health */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-2 border-t-4 border-t-[#71856B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5F625C] uppercase font-mono">FLEET HEALTH</span>
            <AetherStatusBadge status="OPTIMAL" size="sm" pulse={false} />
          </div>
          <div className="text-xl font-black text-[#272A27] font-display">89.4% Availability</div>
          <p className="text-[11px] text-[#5F625C]">96 of 108 Heavy LHD &amp; Dumper assets operating within thermal limits.</p>
          <button
            onClick={() => navigate('/equipment')}
            className="text-xs font-bold text-[#4A5845] hover:text-[#71856B] inline-flex items-center gap-1 font-mono pt-1 cursor-pointer"
          >
            Fleet SCADA <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Reserve Intelligence */}
        <div className="p-4 rounded-xl bg-[#F0EBE2] border border-[#C8BFAF] shadow-mineral-sm space-y-2 border-t-4 border-t-[#B88A3B]">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-[#5F625C] uppercase font-mono">RESERVE INTELLIGENCE</span>
            <AetherStatusBadge status="OPTIMAL" size="sm" pulse={false} />
          </div>
          <div className="text-xl font-black text-[#272A27] font-display">73.8M Tonnes</div>
          <p className="text-[11px] text-[#5F625C]">Sausar Group syncline 3D block model validated with UNFC 2009 standards.</p>
          <button
            onClick={() => navigate('/reserve-radar')}
            className="text-xs font-bold text-[#7C571F] hover:text-[#B88A3B] inline-flex items-center gap-1 font-mono pt-1 cursor-pointer"
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
        <div className="lg:col-span-7 bg-[#F0EBE2] border border-[#C8BFAF] rounded-xl p-5 shadow-mineral-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#C8BFAF]">
            <div>
              <h3 className="font-bold text-sm text-[#272A27] font-display">
                Critical Shortfall Assets (Triage Queue)
              </h3>
              <p className="text-xs text-[#5F625C]">
                Immediate prescriptive intervention candidates
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#872C23]">
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
                      <div className="font-bold text-[#272A27]">{p.name}</div>
                      <div className="text-[10px] text-[#85877E] font-sans">{p.district}, {p.state}</div>
                    </td>
                    <td className="font-bold text-[#872C23]">
                      {p.gap}
                    </td>
                    <td className="font-bold text-[#272A27]">
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
                        className="px-2.5 py-1 rounded bg-[#292E2A] hover:bg-[#202522] text-[#F0EBE2] font-bold text-[10px] uppercase tracking-wider inline-flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        Focus <ArrowUpRight className="w-3 h-3 text-[#C46A32]" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right 5 Cols: Recent Statutory Decisions Feed */}
        <div className="lg:col-span-5 bg-[#F0EBE2] border border-[#C8BFAF] rounded-xl p-5 shadow-mineral-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#C8BFAF]">
            <div>
              <h3 className="font-bold text-sm text-[#272A27] font-display">
                Recent Statutory Decisions
              </h3>
              <p className="text-xs text-[#5F625C]">
                DGMS Shift mitigation ledger
              </p>
            </div>
            <button
              onClick={() => navigate('/decision-log')}
              className="text-xs font-mono font-bold text-[#7D4545] hover:text-[#512828] flex items-center gap-1 cursor-pointer"
            >
              Full Ledger <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentDecisions.map((dec) => (
              <div
                key={dec.id}
                className="p-3 rounded-lg bg-[#F5F1E9] border border-[#C8BFAF] space-y-1 hover:border-[#85877E] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-[#272A27] font-display">{dec.title}</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#71856B]/20 text-[#4A5845] border border-[#71856B]/40">
                    {dec.badge}
                  </span>
                </div>
                <p className="text-xs text-[#272A27] font-sans">
                  {dec.description}
                </p>
                <div className="text-[10px] font-mono text-[#85877E] flex items-center gap-1 pt-1">
                  <Clock className="w-3 h-3 text-[#85877E]" />
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
