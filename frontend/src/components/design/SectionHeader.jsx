import React from 'react';

export const SectionHeader = ({
  category,
  categoryColor = '#FFB000', // Default Amber
  title,
  subtitle,
  badge,
  badgeColor = '#21D4C5',
  actions,
  className = ''
}) => {
  return (
    <div className={`flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#222D3A] ${className}`}>
      <div>
        {category && (
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest uppercase mb-1">
            <span style={{ color: categoryColor }}>{category}</span>
            {badge && (
              <>
                <span className="text-slate-500">•</span>
                <span
                  className="px-2 py-0.2 rounded text-[9px] border font-bold"
                  style={{
                    backgroundColor: `${badgeColor}15`,
                    borderColor: `${badgeColor}35`,
                    color: badgeColor
                  }}
                >
                  {badge}
                </span>
              </>
            )}
          </div>
        )}
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#272A27] tracking-tight font-sans">
          {title}
        </h1>
        {subtitle && (
          <p className="text-xs font-mono text-slate-300 mt-1 max-w-3xl leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex flex-wrap items-center gap-2.5 font-mono">
          {actions}
        </div>
      )}
    </div>
  );
};
