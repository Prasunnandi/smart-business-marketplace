import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Truck, Star, MapPin, Clock, ShieldCheck } from 'lucide-react';

export default function TransportersView() {
  const [transporters, setTransporters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api.getTransporters();
      setTransporters(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Truck className="h-5 w-5 text-indigo-400" /> ShipLink Logistics & Freight Network
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Registered commercial motor carriers, intermodal haulers, and specialized freight fleets.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {transporters.map((t) => (
          <div key={t.id} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono font-bold text-indigo-400 px-1.5 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                  {t.id}
                </span>
                <h3 className="text-base font-bold text-white mt-1.5">{t.name}</h3>
                <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                  <MapPin className="h-3 w-3 text-slate-500" />
                  <span>Base Hub: {t.baseHub}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-amber-400 font-bold bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <Star className="h-3 w-3 fill-amber-400" />
                <span>{t.rating}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-slate-800">
              <div>
                <div className="text-[10px] text-slate-500">Fleet Type</div>
                <div className="font-semibold text-slate-200 truncate">{t.fleetType}</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Freight Rate</div>
                <div className="font-semibold text-emerald-400">${t.ratePerTonKm} / ton-km</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Available Trucks</div>
                <div className="font-semibold text-slate-200">{t.availableTrucks} Ready</div>
              </div>
              <div>
                <div className="text-[10px] text-slate-500">Avg Transit Est.</div>
                <div className="font-semibold text-slate-200">{t.transitTimeEstHours} Hours</div>
              </div>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <ShieldCheck className="h-4 w-4" /> DOT & FMCSR Compliance Verified
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
