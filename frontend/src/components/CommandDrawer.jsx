import React from 'react';
import { useApp } from '../context/AppContext.jsx';
import { ScenarioSelector } from './scenario/ScenarioSelector.jsx';
import { X, SlidersHorizontal } from 'lucide-react';

export const CommandDrawer = () => {
  const { isCommandDrawerOpen, setIsCommandDrawerOpen } = useApp();

  if (!isCommandDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-obsidian-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-2xl bg-obsidian-900 border-l border-obsidian-750 h-full overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl no-scrollbar font-mono text-xs">

        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-obsidian-800 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-manganese-500/20 border border-manganese-500/30 flex items-center justify-center">
                <SlidersHorizontal className="w-5 h-5 text-manganese-400" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-[#272A27]">
                  Operational Scenario Lab
                </h2>
                <p className="text-[11px] text-zinc-400">
                  Deterministic Shock &amp; Countermeasure Simulator
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsCommandDrawerOpen(false)}
              className="p-2 rounded-lg bg-obsidian-800 text-zinc-400 hover:text-[#272A27] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Embedded Scenario Selector */}
          <ScenarioSelector />
        </div>

      </div>
    </div>
  );
};
