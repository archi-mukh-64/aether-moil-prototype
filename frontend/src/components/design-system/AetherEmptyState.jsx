import React from 'react';
import { Database, Search, Filter } from 'lucide-react';

/**
 * AETHER Empty State Primitive
 * Clean industrial empty state for tables, search results, and filters.
 */
export const AetherEmptyState = ({
  icon: Icon = Database,
  title = 'No Data Records Found',
  description = 'No operational signals match your current query or filter criteria.',
  actionLabel,
  onAction,
  className = ''
}) => {
  return (
    <div className={`p-8 sm:p-12 text-center rounded-xl bg-[#F8FAFC] border border-dashed border-[#CBD5E1] flex flex-col items-center justify-center space-y-3 ${className}`}>
      <div className="p-3 rounded-full bg-white border border-[#E2E8F0] text-[#64748B] shadow-xs">
        <Icon className="w-6 h-6 text-[#94A3B8]" />
      </div>
      <div className="space-y-1 max-w-sm">
        <h4 className="font-bold text-sm text-[#172033] font-display">
          {title}
        </h4>
        <p className="text-xs text-[#64748B]">
          {description}
        </p>
      </div>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-3.5 py-1.5 rounded-lg bg-white border border-[#CBD5E1] hover:bg-slate-50 text-xs font-semibold text-[#334155] shadow-xs transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
