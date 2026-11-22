import React from 'react';
import { 
  ShoppingBag, 
  Truck, 
  FileCheck2, 
  Compass, 
  PackageSearch, 
  Layers, 
  Zap, 
  ShieldCheck 
} from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab }) {
  const menuItems = [
    { id: 'unified', label: 'Unified Sourcing-to-Shipment', icon: Zap, badge: 'Standout' },
    { id: 'catalog', label: 'B2B Product Sourcing', icon: ShoppingBag },
    { id: 'rfq', label: 'RFQs & Supplier Bidding', icon: FileCheck2 },
    { id: 'transporters', label: 'Freight Carriers & Fleet', icon: Truck },
    { id: 'shipments', label: 'Live Order & GPS Tracking', icon: Compass }
  ];

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col shrink-0 h-screen sticky top-0">
      <div className="p-5 border-b border-slate-800 flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-amber-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
          <PackageSearch className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-extrabold text-base tracking-tight text-white flex items-center gap-1.5">
            SHIP<span className="text-xs font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">TRADE</span>
          </h1>
          <p className="text-[11px] text-slate-400 font-medium">B2B Commerce & Logistics</p>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <div className="px-3 pt-2 pb-1 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
          Marketplace Operations
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-medium text-xs transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4 w-4 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3.5 m-3 rounded-xl bg-slate-950 border border-slate-800/80">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-1">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>ProcureFlow + ShipLink</span>
        </div>
        <p className="text-[10px] text-slate-500 leading-relaxed">
          Unified B2B procurement with automated freight dispatch & multi-carrier booking.
        </p>
      </div>
    </aside>
  );
}
