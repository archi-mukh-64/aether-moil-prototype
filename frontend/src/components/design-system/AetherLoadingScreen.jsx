import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AetherLogo } from './AetherLogo.jsx';
import { CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';

/**
 * AETHER Industrial System Initialization Screen
 * Short, high-tech initialization sequence for executive presentations & boot sequence.
 */
export const AetherLoadingScreen = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const steps = [
    { label: 'Mine Spatial Registry (10 Assets)', sub: 'Balaghat, Tirodi, Ukwa, Munsar, Kandri...' },
    { label: 'ML Intelligence Engine (GBM & RF)', sub: 'Shortfall Predictor & TreeSHAP Explainer' },
    { label: 'Geospatial Radar & Sentinel-2', sub: 'Sausar Group Manganese Geological Corridor' },
    { label: 'Risk Center & Threat Matrix', sub: 'Real-time DGMS Operational Stress Scanner' },
    { label: 'Predictive Analytics & SCADA Hub', sub: 'Bayesian Telemetry & Haulage Solver' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev < steps.length) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setIsReady(true);
          return prev;
        }
      });
    }, 280);

    return () => clearInterval(timer);
  }, [steps.length]);

  const handleEnter = () => {
    if (onComplete) onComplete();
  };

  return (
    <div className="fixed inset-0 z-[99999] bg-[#0F172A] flex items-center justify-center p-4 select-none">

      {/* Background Subtle Geological Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative max-w-lg w-full bg-[#1E293B] border border-[#334155] rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6 text-slate-100"
      >
        {/* Logo & Platform Name */}
        <div className="flex flex-col items-center text-center space-y-2 pb-4 border-b border-[#334155]">
          <AetherLogo size="lg" showText={false} />
          <h1 className="text-2xl font-black tracking-wider text-white font-display">
            AETHER
          </h1>
          <p className="text-xs font-mono font-bold tracking-widest text-amber-400 uppercase">
            MOIL NATIONAL MINING INTELLIGENCE PLATFORM
          </p>
          <span className="text-[10px] font-mono text-slate-400">
            Govt. of India Enterprise • Ministry of Steel
          </span>
        </div>

        {/* Diagnostic Boot Steps */}
        <div className="space-y-2.5 font-mono text-xs">
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 pb-1">
            <span>INITIALIZING INTELLIGENCE ENGINES...</span>
            <span className="text-cyan-400">{Math.min(100, Math.round((currentStep / steps.length) * 100))}%</span>
          </div>

          <div className="space-y-2 bg-[#0F172A] p-4 rounded-xl border border-[#334155]/60">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;

              return (
                <div key={idx} className="flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : isCurrent ? (
                      <div className="w-3.5 h-3.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin shrink-0" />
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border border-slate-600 shrink-0" />
                    )}
                    <span className={`truncate ${isCompleted ? 'text-slate-200 font-bold' : isCurrent ? 'text-amber-300 font-bold' : 'text-slate-500'}`}>
                      {step.label}
                    </span>
                  </div>

                  <span className="text-[10px] font-bold text-right shrink-0">
                    {isCompleted ? (
                      <span className="text-emerald-400">ONLINE ✓</span>
                    ) : isCurrent ? (
                      <span className="text-amber-400 animate-pulse">LOADING</span>
                    ) : (
                      <span className="text-slate-600">QUEUED</span>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enter Platform Button */}
        <div className="pt-2 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
            <span>DGMS & PSU Audit Ready</span>
          </div>

          <button
            onClick={handleEnter}
            className={`px-5 py-2.5 rounded-xl font-bold font-mono text-xs uppercase tracking-wider transition-all duration-200 inline-flex items-center gap-2 ${
              isReady
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 cursor-pointer animate-pulse'
                : 'bg-slate-700 hover:bg-slate-600 text-slate-300 cursor-pointer'
            }`}
          >
            <span>{isReady ? 'LAUNCH DASHBOARD' : 'SKIP INTRO'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </motion.div>

    </div>
  );
};
