import React from 'react';
import { useApp } from '../../context/AppContext.jsx';
import {
  Activity,
  Server,
  Wifi,
  WifiOff,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  Layers,
  Radio
} from 'lucide-react';

export const SystemStatusBar = () => {
  const {
    apiConnected,
    apiLastError,
    activeMine,
    activeScenario,
    lang
  } = useApp();

  return (
    <footer className="w-full bg-[#0E131A] border-t border-[#222D3A] px-4 sm:px-6 lg:px-8 py-2 text-[11px] font-mono text-slate-300 select-none flex flex-wrap items-center justify-between gap-3 shadow-inner">
      <div className="flex flex-wrap items-center gap-4">
        {/* API Gateway Status */}
        <div className="flex items-center gap-1.5">
          {apiConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-200">GATEWAY: <strong className="text-emerald-400">FASTAPI REST LIVE (PORT 8000)</strong></span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="text-slate-200">GATEWAY: <strong className="text-amber-400">CLIENT RUNTIME MODE</strong></span>
            </>
          )}
        </div>

        <div className="w-[1px] h-3.5 bg-[#222D3A] hidden sm:block" />

        {/* Physics & ML Inference Engine */}
        <div className="hidden md:flex items-center gap-1.5">
          <Cpu className="w-3.5 h-3.5 text-violet-400" />
          <span>INFERENCE: <strong className="text-violet-300">MULTI-PHYSICS + XGBOOST + TREESHAP</strong></span>
        </div>

        <div className="w-[1px] h-3.5 bg-[#222D3A] hidden lg:block" />

        {/* Active Mine Asset */}
        <div className="hidden lg:flex items-center gap-1.5">
          <Radio className="w-3.5 h-3.5 text-amber-400" />
          <span>SECTOR: <strong className="text-amber-300">{activeMine?.name} ({activeMine?.district})</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-3 text-slate-400">
        <span className="hidden sm:inline">AETHER v3.4 ENTERPRISE</span>
        <span>•</span>
        <span className="text-emerald-400 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          <span>SIH COMPLIANT</span>
        </span>
      </div>
    </footer>
  );
};
