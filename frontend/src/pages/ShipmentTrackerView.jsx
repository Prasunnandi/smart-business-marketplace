import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Compass, Truck, MapPin, CheckCircle2, Clock, Navigation } from 'lucide-react';

export default function ShipmentTrackerView() {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api.getShipments();
      setShipments(data || []);
      if (data?.length > 0) setSelectedShipment(data[0]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <Compass className="h-5 w-5 text-indigo-400" /> Active Freight Shipments & GPS Waypoint Tracker
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Monitor real-time interstate linehaul movement and scheduled delivery windows.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Shipment List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            In-Transit Consignments ({shipments.length})
          </div>
          {shipments.map((s) => {
            const isSelected = selectedShipment?.id === s.id;
            return (
              <div
                key={s.id}
                onClick={() => setSelectedShipment(s)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-white">{s.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {s.status}
                  </span>
                </div>
                <div className="text-xs font-bold text-slate-200 mt-1.5">{s.items}</div>
                <div className="text-[11px] text-slate-400 mt-1">
                  Transporter: <span className="text-slate-300">{s.transporter}</span>
                </div>
                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-2 border-t border-slate-800/80">
                  <span className="font-mono text-indigo-300">{s.trackingNumber}</span>
                  <span>ETA: {s.eta}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Selected Shipment Live Waypoint Map Simulator */}
        <div className="lg:col-span-2 space-y-4">
          {selectedShipment ? (
            <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
                <div>
                  <div className="text-xs text-slate-400">Consignment Waybill</div>
                  <h3 className="text-lg font-bold text-white font-mono">{selectedShipment.trackingNumber}</h3>
                  <div className="text-xs text-slate-400 mt-0.5">
                    Buyer: {selectedShipment.buyer} • Supplier: {selectedShipment.supplier}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-400">Total Purchase Commitment</div>
                  <div className="text-lg font-bold text-emerald-400">${selectedShipment.totalAmount?.toLocaleString()}</div>
                </div>
              </div>

              {/* Graphical Route Waypoint Timeline */}
              <div className="space-y-4">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-indigo-400" /> Transit Route Status
                </div>

                <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 space-y-6">
                  {/* Visual Tracker Line */}
                  <div className="relative flex items-center justify-between">
                    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-800 z-0" />
                    <div className="absolute left-0 w-2/3 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-emerald-500 to-indigo-500 z-0" />

                    {/* Origin */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 bg-slate-950">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-bold text-white mt-2">Origin Dock</span>
                      <span className="text-[10px] text-slate-400">{selectedShipment.origin?.name}</span>
                    </div>

                    {/* Current Checkpoint */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="h-10 w-10 rounded-full bg-indigo-500/30 border-2 border-indigo-400 flex items-center justify-center text-indigo-300 animate-pulse bg-slate-950">
                        <Truck className="h-5 w-5" />
                      </div>
                      <span className="text-[11px] font-bold text-indigo-300 mt-2">Current GPS Fix</span>
                      <span className="text-[10px] text-indigo-400 font-mono">
                        {selectedShipment.currentLocation?.name}
                      </span>
                    </div>

                    {/* Destination */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-slate-800 border-2 border-slate-700 flex items-center justify-center text-slate-500 bg-slate-950">
                        <MapPin className="h-4 w-4" />
                      </div>
                      <span className="text-[11px] font-bold text-slate-300 mt-2">Destination</span>
                      <span className="text-[10px] text-slate-400">{selectedShipment.destination?.name}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-800 text-xs">
                    <div>
                      <div className="text-[10px] text-slate-500">Carrier</div>
                      <div className="font-semibold text-slate-200">{selectedShipment.transporter}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Freight Subtotal</div>
                      <div className="font-semibold text-slate-200">${selectedShipment.freightCost?.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Telemetry Status</div>
                      <div className="font-semibold text-emerald-400">Live GPS Ping OK</div>
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-500">Scheduled Arrival</div>
                      <div className="font-semibold text-slate-200">{selectedShipment.eta}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
              Select a shipment to inspect transit telemetry.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
