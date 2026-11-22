import React from 'react';
import { Search, Globe2, RefreshCw, ShoppingCart, UserCheck } from 'lucide-react';

export default function Navbar({ onRefresh, isRefreshing }) {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search B2B products, suppliers, carrier rates..."
            className="pl-9 pr-4 py-1.5 text-xs rounded-lg bg-slate-950 border border-slate-800 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 w-72 transition-colors"
          />
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs text-slate-400 bg-slate-800/40 px-3 py-1.5 rounded-lg border border-slate-700/40">
          <Globe2 className="h-4 w-4 text-indigo-400" />
          <span>Active B2B Network: <strong className="text-slate-200">12 Hubs Connected</strong></span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onRefresh}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Refresh marketplace feeds"
        >
          <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-indigo-400' : ''}`} />
        </button>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2.5 pl-1">
          <div className="h-8 w-8 rounded-full bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center font-bold text-xs text-indigo-300">
            PO
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-slate-200">Procurement Officer</div>
            <div className="text-[10px] text-slate-400">Enterprise Verified</div>
          </div>
        </div>
      </div>
    </header>
  );
}
