import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  Zap, 
  ShoppingBag, 
  Scale, 
  FileCheck2, 
  Truck, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles,
  Compass,
  DollarSign,
  Clock
} from 'lucide-react';

export default function UnifiedProcureHub({ onNavigateToShipments }) {
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [transporters, setTransporters] = useState([]);
  
  // Selection state
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [quantity, setQuantity] = useState(25);
  const [selectedSupplierId, setSelectedSupplierId] = useState(null);
  const [selectedTransporterId, setSelectedTransporterId] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState('Central Automotive Assembly Plant, Detroit MI');
  const [bookingSuccess, setBookingSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function init() {
      const [prods, supps, trans] = await Promise.all([
        api.getProducts(),
        api.getSuppliers(),
        api.getTransporters()
      ]);
      setProducts(prods || []);
      setSuppliers(supps || []);
      setTransporters(trans || []);

      if (prods?.length > 0) setSelectedProductId(prods[0].id);
      if (supps?.length > 0) setSelectedSupplierId(supps[0].id);
      if (trans?.length > 0) setSelectedTransporterId(trans[0].id);
    }
    init();
  }, []);

  const selectedProduct = products.find(p => p.id === selectedProductId);
  const selectedSupplier = suppliers.find(s => s.id === selectedSupplierId);
  const selectedTransporter = transporters.find(t => t.id === selectedTransporterId);

  // Calculations
  const unitPrice = selectedProduct ? selectedProduct.unitPrice : 0;
  const subtotal = unitPrice * quantity;
  const freightRate = selectedTransporter ? selectedTransporter.ratePerTonKm : 0.15;
  const freightCost = Math.round(freightRate * 500 * (quantity > 20 ? 1.8 : 1)) + 300;
  const grandTotal = subtotal + freightCost;

  const handleExecuteUnifiedOrder = async () => {
    if (!selectedProductId || !selectedSupplierId || !selectedTransporterId) return;
    setIsSubmitting(true);
    try {
      const payload = {
        productId: selectedProductId,
        quantity,
        buyerCompany: 'OmniBuild Global Corp',
        chosenSupplierId: selectedSupplierId,
        chosenTransporterId: selectedTransporterId,
        deliveryLocation
      };
      const res = await api.unifiedProcureAndShip(payload);
      setBookingSuccess(res.order);
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/30 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-full bg-indigo-500/10 blur-3xl pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
              <Zap className="h-3 w-3" /> Standout Flagship Feature
            </span>
            <span className="text-xs text-slate-400">All-in-One B2B Sourcing, Requisition & Dispatch</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            Unified Sourcing, Price Comparison, PO Approval & Freight Booking
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1">
            Source commercial goods, evaluate supplier quotes side-by-side, approve the purchase requisition, and automatically schedule road freight transportation without leaving the platform.
          </p>
        </div>
      </div>

      {/* Success Notification Banner */}
      {bookingSuccess && (
        <div className="p-5 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
              <CheckCircle2 className="h-5 w-5" />
              <span>Purchase Order & Freight Transportation Confirmed!</span>
            </div>
            <span className="font-mono text-xs px-2.5 py-1 rounded bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">
              Tracking: {bookingSuccess.trackingNumber}
            </span>
          </div>
          <p className="text-xs text-slate-300">
            Order <strong>{bookingSuccess.id}</strong> has been generated, budget approved, and carrier <strong>{bookingSuccess.transporter}</strong> dispatched for pickup.
          </p>
          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={() => onNavigateToShipments && onNavigateToShipments()}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Compass className="h-4 w-4" /> View in Live GPS Tracker
            </button>
            <button
              onClick={() => setBookingSuccess(null)}
              className="text-xs text-slate-400 hover:text-slate-200"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* 4-Step Interactive Cockpit */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Step 1: Product Selection */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <ShoppingBag className="h-4 w-4" /> 1. Sourcing SKU
              </span>
              <span className="text-[10px] text-slate-500">LocalTrade</span>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400">Select Catalog Item</label>
              <select
                value={selectedProductId || ''}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60"
              >
                {products.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.name} (${p.unitPrice}/{p.unit})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400">Order Quantity ({selectedProduct?.unit || 'units'})</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60 font-mono"
              />
            </div>
          </div>
          <div className="p-2.5 rounded-lg bg-slate-950 text-xs space-y-1 border border-slate-800/80">
            <div className="text-slate-400 flex justify-between">
              <span>Est. Base Subtotal:</span>
              <span className="font-mono text-white font-semibold">${subtotal.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Step 2: Compare Supplier Quotes */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Scale className="h-4 w-4" /> 2. Supplier Quotes
              </span>
              <span className="text-[10px] text-slate-500">ProcureFlow</span>
            </div>
            <div className="space-y-2">
              {suppliers.map(s => {
                const isSelected = selectedSupplierId === s.id;
                const isPrimary = selectedProduct?.supplierId === s.id;
                const discount = isPrimary ? 0.94 : 1.0;
                const bidTotal = Math.round(unitPrice * discount * quantity);
                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedSupplierId(s.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/60 shadow-sm'
                        : 'bg-slate-950 border-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span>{s.name.split(' ')[0]}...</span>
                      <span className="font-mono text-indigo-300">${bidTotal.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>★ {s.rating} ({s.reviewsCount} reviews)</span>
                      <span className="text-emerald-400">{s.reliabilityScore}% Reliability</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center">
            Selected: <strong className="text-slate-200">{selectedSupplier?.name || 'None'}</strong>
          </div>
        </div>

        {/* Step 3: PO Approval Details */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck2 className="h-4 w-4" /> 3. PO Approval
              </span>
              <span className="text-[10px] text-slate-500">Budget Sign-off</span>
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-400">Destination Hub</label>
              <input
                type="text"
                value={deliveryLocation}
                onChange={(e) => setDeliveryLocation(e.target.value)}
                className="w-full mt-1 bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500/60"
              />
            </div>
            <div className="p-2.5 rounded-lg bg-slate-950 text-xs space-y-1.5 border border-slate-800/80">
              <div className="flex justify-between text-slate-400">
                <span>Product Items:</span>
                <span className="font-mono text-slate-200">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Freight Logistics:</span>
                <span className="font-mono text-slate-200">${freightCost.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-white pt-1 border-t border-slate-800">
                <span>Total Requisition:</span>
                <span className="font-mono text-emerald-400">${grandTotal.toLocaleString()}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-emerald-400 justify-center">
            <ShieldCheck className="h-3.5 w-3.5" /> Corporate Credit Approved
          </div>
        </div>

        {/* Step 4: Freight Carrier Selection */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                <Truck className="h-4 w-4" /> 4. Freight Carrier
              </span>
              <span className="text-[10px] text-slate-500">ShipLink</span>
            </div>
            <div className="space-y-2">
              {transporters.map(t => {
                const isSelected = selectedTransporterId === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTransporterId(t.id)}
                    className={`p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500/60 shadow-sm'
                        : 'bg-slate-950 border-slate-800/70 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-semibold text-white">
                      <span>{t.name.split(' ')[0]}...</span>
                      <span className="font-mono text-indigo-300">${t.ratePerTonKm}/t-km</span>
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                      <span>{t.fleetType}</span>
                      <span>{t.availableTrucks} trucks avail</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 text-center">
            Carrier: <strong className="text-slate-200">{selectedTransporter?.name}</strong>
          </div>
        </div>
      </div>

      {/* Execution Callout Bar */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Consolidated B2B Transaction Summary
          </div>
          <div className="text-lg font-bold text-white mt-0.5">
            Procuring {quantity}x {selectedProduct?.name} from {selectedSupplier?.name} via {selectedTransporter?.name}
          </div>
          <div className="text-xs text-indigo-400 font-medium mt-0.5">
            Total Purchase Commitment: ${grandTotal.toLocaleString()} (Includes Product, Tax, & Dedicated Freight)
          </div>
        </div>

        <button
          onClick={handleExecuteUnifiedOrder}
          disabled={isSubmitting}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-amber-600 hover:from-indigo-500 hover:to-amber-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all disabled:opacity-50 shrink-0"
        >
          <Sparkles className="h-4 w-4" />
          {isSubmitting ? 'Authorizing & Dispatching...' : 'Approve PO & Book Freight (1-Click)'}
        </button>
      </div>
    </div>
  );
}
