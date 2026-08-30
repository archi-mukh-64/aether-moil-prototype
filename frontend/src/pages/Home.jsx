import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { NationalOverviewMap } from '../components/overview/NationalOverviewMap.jsx';
import { MetricTile } from '../components/design/MetricTile.jsx';
import { IntelligencePanel } from '../components/design/IntelligencePanel.jsx';
import { OperationalPanel } from '../components/design/OperationalPanel.jsx';
import { Timeline } from '../components/design/Timeline.jsx';
import { SectionHeader } from '../components/design/SectionHeader.jsx';
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
  Sparkles, 
  Radio, 
  Layers, 
  Cpu, 
  Compass,
  ArrowUpRight
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
      status: lang === 'hi' ? 'गंभीर कमी' : lang === 'mr' ? 'गंभीर तूट' : 'CRITICAL SHORTFALL',
      severity: 'critical',
      accentColor: '#F0445E',
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
      status: lang === 'hi' ? 'गंभीर कमी' : lang === 'mr' ? 'गंभीर तूट' : 'CRITICAL SHORTFALL',
      severity: 'critical',
      accentColor: '#F0445E',
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
      status: lang === 'hi' ? 'गंभीर कमी' : lang === 'mr' ? 'गंभीर तूट' : 'CRITICAL SHORTFALL',
      severity: 'critical',
      accentColor: '#F0445E',
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
      status: lang === 'hi' ? 'जोखिम में' : lang === 'mr' ? 'धोक्यात' : 'ELEVATED RISK',
      severity: 'warning',
      accentColor: '#FFB020',
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
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-[1920px] mx-auto space-y-6 font-sans">
      
      {/* 1. TOP NATIONAL PLATFORM HEADER */}
      <SectionHeader
        category="MINISTRY OF STEEL • GOVT. OF INDIA // MOIL LIMITED"
        categoryColor="#FFB000"
        badge={apiConnected ? (lang === 'hi' ? 'फास्टएपीआई लाइव' : lang === 'mr' ? 'फास्टएपीआय थेट' : 'FASTAPI REST LIVE') : 'OFFLINE CACHED'}
        badgeColor="#22C55E"
        title={ov?.title || 'National Manganese Mining Intelligence Platform'}
        subtitle="Real-time multi-mine operational command, predictive shortfall mitigation, and multi-spectral Earth Observation satellite intelligence across all 10 canonical MOIL mining sectors."
        actions={
          <>
            <button
              onClick={() => setIsReportModalOpen(true)}
              className="btn-command-secondary text-xs"
            >
              <FileText className="w-3.5 h-3.5 text-amber-400" />
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
          </>
        }
      />

      {/* 2. NATIONAL EXECUTIVE STATUS KPI GRID (Multi-Color Semantic Palette) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* Metric 1: Cyan (Intelligence / Monitored Sites) */}
        <MetricTile
          label={lang === 'hi' ? 'निगरानी वाली खदानें' : lang === 'mr' ? 'निरीक्षण केलेल्या खाणी' : 'MINES MONITORED'}
          value="10"
          unit={lang === 'hi' ? 'केंद्रीय पट्टा' : lang === 'mr' ? 'मध्य पट्टा' : 'CENTRAL BELT'}
          status={lang === 'hi' ? '100% लाइव' : lang === 'mr' ? '100% थेट' : '100% LIVE'}
          icon={Building2}
          accentColor="#21D4C5"
          subtitle="MP & Maharashtra Sectors"
        />

        {/* Metric 2: Amber (Command / Target Quota) */}
        <MetricTile
          label={lang === 'hi' ? 'दैनिक राष्ट्रीय लक्ष्य' : lang === 'mr' ? 'दैनिक राष्ट्रीय उद्दिष्ट' : 'NATIONAL TARGET'}
          value="32,400"
          unit="TPD"
          trend="Baseline Plan"
          trendPositive={true}
          icon={Activity}
          accentColor="#FFB000"
          subtitle="All 10 Operating Assets"
        />

        {/* Metric 3: Coral Red (Critical / 14-Day Forecast Gap) */}
        <MetricTile
          label={lang === 'hi' ? '14-दिवसीय अनुमान' : lang === 'mr' ? '14-दिवसीय अंदाज' : '14-DAY FORECAST'}
          value="25,322"
          unit="TPD"
          trend="-7,078 TPD Gap"
          trendPositive={false}
          icon={TrendingDown}
          accentColor="#F0445E"
          subtitle="Predicted Without Mitigation"
        />

        {/* Metric 4: Emerald Green (Attainment / Yield Health) */}
        <MetricTile
          label={lang === 'hi' ? 'लक्ष्य प्राप्ति' : lang === 'mr' ? 'उद्दिष्ट प्राप्ती' : 'TARGET ATTAINMENT'}
          value="78.2%"
          unit="Yield Rate"
          status={lang === 'hi' ? 'मध्यम कमी' : lang === 'mr' ? 'मध्यम तूट' : 'MODERATE GAP'}
          icon={Zap}
          accentColor="#22C55E"
          subtitle="Across Total MOIL Quotas"
        />

        {/* Metric 5: Orange / Coral (Priority Sites Triage) */}
        <MetricTile
          label={lang === 'hi' ? 'प्राथमिक हस्तक्षेप' : lang === 'mr' ? 'प्राधान्य हस्तक्षेप' : 'PRIORITY INTERVENTIONS'}
          value="4"
          unit="Active Sites"
          status="CRITICAL"
          icon={AlertTriangle}
          accentColor="#FFB020"
          subtitle="Immediate Action Required"
        />
      </div>

      {/* 3. EARTH OBSERVATION SATELLITE BANNER (Electric Cyan Accent) */}
      <div className="p-4 rounded-2xl bg-[#151B23] border border-cyan-500/30 shadow-card-subtle flex flex-wrap items-center justify-between gap-4 font-mono text-xs text-slate-200 relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-cyan-400 via-amber-400 to-cyan-400 opacity-80" />

        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-cyan-400">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider">
                COPERNICUS SENTINEL-2 &amp; LANDSAT REMOTE SENSING
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#1A232E] border border-[#222D3A] text-emerald-400 text-[9px] font-bold">
                {eoData?.latestImageryDate || '26 AUG 2026'}
              </span>
            </div>
            <div className="text-sm font-bold text-white mt-0.5">
              {lang === 'hi' ? 'राष्ट्रीय उपग्रह विश्लेषण एवं बहु-स्पेक्ट्रल भूमि नमी निगरानी' : lang === 'mr' ? 'राष्ट्रीय उपग्रह विश्लेषण व बहु-स्पेक्ट्रल जमीन आर्द्रता निरीक्षण' : 'National Satellite Analysis & Multi-Spectral Ground Moisture Monitoring'}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px]">
          <div className="px-3 py-1.5 rounded-xl bg-[#1A232E] border border-[#222D3A]">
            <span className="text-slate-400">CLOUD COVER: </span>
            <strong className="text-emerald-400">{eoData?.lowCloudCoverMines || 8} OPTIMAL</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#1A232E] border border-[#222D3A]">
            <span className="text-slate-400">SURFACE CHANGES: </span>
            <strong className="text-amber-400">{eoData?.changeDetectedMines || 3} DETECTED</strong>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-[#1A232E] border border-[#222D3A]">
            <span className="text-slate-400">TOTAL FOOTPRINT: </span>
            <strong className="text-cyan-400">{eoData?.totalActiveFootprintHa || 1411.2} Ha</strong>
          </div>

          <button
            onClick={() => navigate('/reserve-radar')}
            className="btn-command-intelligence text-[11px] py-1.5 px-3"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>INSPECT EO LAYERS</span>
          </button>
        </div>
      </div>

      {/* 4. DOMINANT NATIONAL OPERATIONS MAP & PRIORITY TRIAGE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT / CENTER: Dominant Interactive National Map (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-[#151B23] border border-[#222D3A] shadow-card-elevated space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between pb-3 border-b border-[#222D3A]">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-amber-400" />
                <h3 className="text-base font-bold text-white tracking-tight font-sans">
                  {lang === 'hi' ? 'राष्ट्रीय खनन प्रचालन मानचित्र' : lang === 'mr' ? 'राष्ट्रीय खाणकाम ऑपरेशन्स नकाशा' : 'National Operations Geographic Intelligence'}
                </h3>
              </div>
              <span className="text-xs font-mono text-cyan-400">
                10 Active MOIL Assets • WGS84 GIS
              </span>
            </div>

            {/* Dominant GIS Map Container */}
            <div className="w-full h-[520px] rounded-xl overflow-hidden border border-[#222D3A] relative shadow-inner">
              <NationalOverviewMap onSelectMine={(mId) => setSelectedMineId(mId)} />
            </div>

            {/* Map Legend Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-[11px] font-mono text-slate-400">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">Optimal (&gt;90%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                  <span className="text-slate-300">Elevated Risk (75-90%)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-coral-500" />
                  <span className="text-slate-300">Critical Shortfall (&lt;75%)</span>
                </span>
              </div>
              <span className="text-slate-400">
                Click any mine marker to switch active cockpit
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Priority Risks & Interventions Queue (4 Cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-[#151B23] border border-coral-500/30 shadow-card-elevated space-y-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-coral-500" />

            <div className="flex items-center justify-between pb-3 border-b border-[#222D3A]">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-coral-400" />
                <h3 className="text-base font-bold text-white tracking-tight">
                  {lang === 'hi' ? 'प्राथमिक जोखिम कतार' : lang === 'mr' ? 'प्राधान्य जोखीम रांग' : 'Priority Risk Triage'}
                </h3>
              </div>
              <span className="px-2 py-0.5 rounded-full bg-coral-500/15 text-coral-400 border border-coral-500/30 text-[10px] font-mono font-bold">
                4 CRITICAL SITES
              </span>
            </div>

            <div className="space-y-3 font-mono">
              {priorityInterventions.map((site) => (
                <div
                  key={site.id}
                  onClick={() => {
                    setSelectedMineId(site.id);
                    navigate('/alert-engine');
                  }}
                  className="p-3.5 rounded-xl bg-[#1A232E] border border-[#222D3A] hover:border-amber-500/50 hover:bg-[#202B38] transition-all cursor-pointer group shadow-sm"
                  style={{ borderLeft: `3px solid ${site.accentColor}` }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors">
                      {site.name}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${
                      site.severity === 'critical' 
                        ? 'bg-coral-500/15 text-coral-400 border-coral-500/30' 
                        : 'bg-orange-500/15 text-orange-400 border-orange-500/30'
                    }`}>
                      {site.status}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-300 mt-1 leading-snug font-sans">
                    {site.threat}
                  </p>

                  <div className="mt-2.5 pt-2 border-t border-[#222D3A] flex items-center justify-between text-[11px]">
                    <span className="text-coral-400 font-bold">
                      {site.gap} ({site.prob} Prob)
                    </span>
                    <span className="text-slate-400 group-hover:text-white flex items-center gap-0.5 text-[10px] transition-colors">
                      <span>Mitigate</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* 5. FLEET, SCADA & DECISION AUDIT SUMMARY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Fleet & SCADA Status Overview (6 Cols — Green/Cyan Telemetry) */}
        <div className="lg:col-span-6">
          <OperationalPanel
            category="NATIONAL ASSET TELEMETRY"
            title="Fleet & Equipment Availability Summary"
            status="91.4% OPERATIONAL"
            statusType="optimal"
            icon={Cpu}
            actions={
              <button 
                onClick={() => navigate('/equipment')}
                className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Full Telemetry</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center">
              <div className="p-3 rounded-xl bg-[#1A232E] border border-[#222D3A]">
                <span className="text-[10px] text-slate-400 block uppercase">PRIMARY CRUSHERS</span>
                <strong className="text-lg font-bold text-white block mt-1">10 / 10</strong>
                <span className="text-[10px] text-emerald-400">100% Online</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1A232E] border border-[#222D3A]">
                <span className="text-[10px] text-slate-400 block uppercase">HAUL DUMPERS</span>
                <strong className="text-lg font-bold text-white block mt-1">42 / 46</strong>
                <span className="text-[10px] text-emerald-400">91.3% Active</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1A232E] border border-[#222D3A]">
                <span className="text-[10px] text-slate-400 block uppercase">FACE SHOVELS</span>
                <strong className="text-lg font-bold text-white block mt-1">18 / 20</strong>
                <span className="text-[10px] text-emerald-400">90.0% Active</span>
              </div>
              <div className="p-3 rounded-xl bg-[#1A232E] border border-[#222D3A]">
                <span className="text-[10px] text-slate-400 block uppercase">SUMP PUMPS</span>
                <strong className="text-lg font-bold text-white block mt-1">36 / 38</strong>
                <span className="text-[10px] text-emerald-400">94.7% Online</span>
              </div>
            </div>
          </OperationalPanel>
        </div>

        {/* Recent AI Decisions & Mitigation Log (6 Cols — Violet AI Reasoning) */}
        <div className="lg:col-span-6">
          <IntelligencePanel
            title="Recent AI Recommendations & Mitigation Dispatches"
            badgeText="DECISION TRAIL"
            confidence="96.2%"
            actions={
              <button 
                onClick={() => navigate('/decision-log')}
                className="text-xs font-mono text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
              >
                <span>Audit Ledger</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            }
          >
            <Timeline items={recentDecisions} />
          </IntelligencePanel>
        </div>

      </div>

    </div>
  );
};
