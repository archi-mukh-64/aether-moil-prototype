import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext.jsx';
import { 
  Radio, 
  ShieldCheck, 
  MapPin, 
  Compass, 
  Layers, 
  Activity, 
  ExternalLink,
  Lock,
  Cpu
} from 'lucide-react';

export const Footer = () => {
  const { t, activeMine, lang } = useApp();

  return (
    <footer className="w-full bg-obsidian-950 border-t border-obsidian-800/90 pt-16 pb-12 text-zinc-400 font-mono text-xs">
      <div className="command-container">
        
        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-obsidian-800/80">
          
          {/* Brand & PSU Credentials (2 cols) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-obsidian-900 border border-manganese-500/40 flex items-center justify-center font-bold text-manganese-400 font-mono text-xs shadow-[0_0_15px_rgba(245,158,11,0.15)]">
                Mn
              </div>
              <div>
                <span className="font-display text-base font-bold text-white tracking-tight">{t?.brand || 'MOIL LIMITED'}</span>
                <span className="block text-[10px] text-manganese-400 font-mono">{t?.brandSub || 'MINISTRY OF STEEL • GOVT. OF INDIA'}</span>
              </div>
            </div>

            <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-sm">
              {lang === 'hi' 
                ? 'भारत का प्रमुख मैंगनीज अयस्क उत्पादक। पृथ्वी अवलोकन और भूमिगत आईओटी टेलीमेट्री का स्वायत्त एआई कमान केंद्र।' 
                : lang === 'mr'
                ? 'भारतातील अग्रगण्य मॅंगनीज उत्पादक. उपग्रह पृथ्वी निरीक्षण आणि भूमिगत आयओटी टेलीमेट्रीची स्वायत्त एआय प्रणाली.'
                : "India's premier manganese ore producer. Autonomous AI command suite fusing Earth Observation with sub-surface IoT telemetry for predictive risk mitigation."}
            </p>

            <div className="flex items-center gap-4 text-[11px] text-zinc-400 pt-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-telemetry-400" />
                <span>{lang === 'hi' ? 'डीजीएमएस सुरक्षा प्रमाणित' : lang === 'mr' ? 'डीजीएमएस सुरक्षा प्रमाणित' : 'DGMS Safety Certified'}</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-manganese-400" />
                <span>{lang === 'hi' ? 'एनआईसी-टियर IV क्लाउड तैयार' : lang === 'mr' ? 'एनआयसी-टियर IV क्लाउड सज्ज' : 'NIC-Tier IV Cloud Ready'}</span>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider">
              {lang === 'hi' ? 'मुख्य इंजन' : lang === 'mr' ? 'मुख्य इंजिन' : 'Core Engines'}
            </div>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/command-center" className="hover:text-manganese-400 transition-colors">
                  01 // {t?.nav?.commandCenter || 'Command Center'}
                </Link>
              </li>
              <li>
                <Link to="/reserve-radar" className="hover:text-manganese-400 transition-colors">
                  02 // {t?.nav?.reserveRadar || 'Reserve Radar'}
                </Link>
              </li>
              <li>
                <Link to="/alert-engine" className="hover:text-manganese-400 transition-colors">
                  03 // {t?.nav?.alertEngine || 'Shortfall Alert'}
                </Link>
              </li>
              <li>
                <Link to="/protocol" className="hover:text-manganese-400 transition-colors">
                  04 // {t?.nav?.protocol || 'Protocols'}
                </Link>
              </li>
              <li>
                <Link to="/equipment" className="hover:text-manganese-400 transition-colors">
                  05 // {t?.nav?.equipment || 'Fleet Health'}
                </Link>
              </li>
              <li>
                <Link to="/analytics" className="hover:text-manganese-400 transition-colors">
                  06 // {t?.nav?.analytics || 'Analytics'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Operational Leases */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider">
              Key Manganese Leases
            </div>
            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-center justify-between">
                <span>Balaghat Deep Shaft</span>
                <span className="text-manganese-400">MP (44.2% Mn)</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Dongri Buzurg Opencast</span>
                <span className="text-manganese-400">MH (48.5% MnO₂)</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Gumgaon Incline</span>
                <span className="text-zinc-400">MH (38.6% Mn)</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Tirodi Lease</span>
                <span className="text-zinc-400">MP (36.2% Mn)</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Ukwa Low-Phosphorus</span>
                <span className="text-zinc-400">MP (42.0% Mn)</span>
              </li>
            </ul>
          </div>

          {/* Telemetry & Datum */}
          <div className="space-y-3">
            <div className="text-[11px] font-bold text-white uppercase tracking-wider">
              Geodetic Datum
            </div>
            <div className="p-3.5 rounded-xl bg-obsidian-900 border border-obsidian-800 space-y-1.5 text-[11px]">
              <div>
                <span className="text-zinc-400">Mine Datum:</span>
                <strong className="text-zinc-200 block">WGS84 UTM Zone 44N</strong>
              </div>
              <div>
                <span className="text-zinc-400">Sensor Sync:</span>
                <strong className="text-telemetry-400 block">&lt; 1.2s Latency</strong>
              </div>
              <div>
                <span className="text-zinc-400">Telemetry Stream:</span>
                <strong className="text-white block">284 Active Channels</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Strip */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-zinc-400">
          <div>
            &copy; {new Date().getFullYear()} MOIL Limited (Manganese Ore India Limited). Smart India Hackathon Prototype.
          </div>
          <div className="flex items-center gap-6">
            <span>Security Classification: PSU RESTRICTED</span>
            <span>Version: v2.4-SIH-PROD</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
