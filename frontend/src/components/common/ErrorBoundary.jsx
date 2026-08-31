import React from 'react';
import { ShieldAlert, RotateCcw, Terminal, ArrowRight, Activity } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null, isRetrying: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.group('%c[AETHER RUNTIME TELEMETRY]', 'background: #b91c1c; color: #ffffff; font-weight: bold; padding: 4px 8px; border-radius: 4px;');
    console.error('Route:', window?.location?.pathname);
    console.error('Module:', this.props.title || 'Core Component');
    console.error('Error:', error?.message || error);
    console.error('Stack:', error?.stack);
    console.groupEnd();
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ isRetrying: true });
    setTimeout(() => {
      this.setState({ hasError: false, error: null, errorInfo: null, isRetrying: false });
      if (this.props.onReset) {
        this.props.onReset();
      }
    }, 150);
  };

  render() {
    if (this.state.hasError) {
      const isDev = typeof process !== 'undefined' && process.env && process.env.NODE_ENV !== 'production';

      return (
        <div className="p-6 sm:p-8 border border-obsidian-750 bg-gradient-to-b from-obsidian-950 via-obsidian-900 to-obsidian-950 font-mono text-xs text-left space-y-4 shadow-2xl my-6 rounded-2xl">
          <div className="flex items-center justify-between gap-4 pb-3 border-b border-obsidian-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
                <ShieldAlert className="w-5 h-5 text-amber-400 animate-pulse" />
              </div>
              <div>
                <div className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">
                  AETHER RESILIENCE PROTOCOL // स्व-पुनर्प्राप्ती प्रणाली
                </div>
                <h3 className="font-display text-lg font-bold text-[#272A27]">
                  {this.props.title || 'Autonomous Subsystem Recovery'}
                </h3>
              </div>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-lg bg-obsidian-850 border border-obsidian-750 text-zinc-400 font-mono">
              CONTINUITY SHIELD ACTIVE
            </span>
          </div>

          <p className="text-zinc-400 font-sans text-xs leading-relaxed">
            The platform intercepted an unexpected rendering state in this subsystem to protect command-center telemetry and workflow continuity.
          </p>

          {/* Development / Diagnostics Stack Trace */}
          {isDev && this.state.error && (
            <div className="p-4 rounded-xl bg-obsidian-950 border border-obsidian-800 space-y-2 text-zinc-300">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-[11px]">
                <Terminal className="w-3.5 h-3.5" />
                <span>DIAGNOSTIC TRACE:</span>
              </div>
              <div className="text-amber-300 font-mono text-xs break-words">
                {this.state.error.toString()}
              </div>
              {this.state.error.stack && (
                <pre className="text-[10px] text-zinc-500 overflow-x-auto p-2 rounded bg-obsidian-900 border border-obsidian-800 leading-tight max-h-32">
                  {this.state.error.stack}
                </pre>
              )}
            </div>
          )}

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={this.handleReset}
              disabled={this.state.isRetrying}
              className="px-5 py-2.5 rounded-xl bg-manganese-500 hover:bg-manganese-400 text-obsidian-950 font-bold text-xs uppercase tracking-wider transition-all inline-flex items-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
            >
              <RotateCcw className={`w-3.5 h-3.5 ${this.state.isRetrying ? 'animate-spin' : ''}`} />
              <span>{this.state.isRetrying ? 'RE-INITIALIZING...' : 'RE-INITIALIZE SUBSYSTEM'}</span>
            </button>

            <button
              onClick={() => { window.location.href = '/'; }}
              className="px-4 py-2.5 rounded-xl bg-obsidian-800 hover:bg-obsidian-750 text-zinc-300 font-bold text-xs uppercase transition-colors"
            >
              Overview / होम
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
