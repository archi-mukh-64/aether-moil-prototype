import React from 'react';
import { Clock } from 'lucide-react';

export const Timeline = ({ items = [], className = '' }) => {
  return (
    <div className={`space-y-3.5 ${className}`}>
      {items.map((item, idx) => (
        <div key={item.id || idx} className="flex items-start gap-3 relative group">
          {/* Vertical Track Line */}
          {idx < items.length - 1 && (
            <div className="absolute left-[15px] top-[26px] bottom-[-14px] w-[1px] bg-[#222D3A] group-hover:bg-[#2D3A4B] transition-colors" />
          )}

          {/* Icon / Bullet */}
          <div className="w-8 h-8 rounded-xl bg-[#1A232E] border border-[#2D3A4B] flex items-center justify-center flex-shrink-0 z-10 group-hover:border-amber-500/50 transition-colors shadow">
            {item.icon ? (
              <item.icon className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-400" />
            ) : (
              <div className="w-2 h-2 rounded-full bg-amber-400" />
            )}
          </div>

          {/* Content Card */}
          <div className="flex-1 p-3.5 rounded-xl bg-[#151B23] border border-[#222D3A] hover:border-[#2D3A4B] transition-all font-mono">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-bold text-white tracking-tight">
                {item.title}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-slate-500" />
                {item.timestamp}
              </span>
            </div>
            {item.description && (
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {item.description}
              </p>
            )}
            {item.badge && (
              <div className="mt-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  {item.badge}
                </span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
