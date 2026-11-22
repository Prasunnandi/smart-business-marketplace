import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { FileCheck2, Scale, Clock, Award, ShieldAlert, ArrowRight } from 'lucide-react';

export default function RfqQuotesView() {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api.getRFQs();
      setRfqs(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
          <FileCheck2 className="h-5 w-5 text-indigo-400" /> Buyer RFQs & Supplier Bid Comparison
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Review competitive supplier bids with transparent price breakdown, delivery timelines, and vendor scores.
        </p>
      </div>

      <div className="space-y-4">
        {rfqs.map((rfq) => (
          <div key={rfq.id} className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-indigo-400">{rfq.id}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {rfq.status}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{rfq.title}</h3>
                <div className="text-xs text-slate-400 mt-0.5">
                  Buyer: <span className="text-slate-200">{rfq.buyerCompany}</span> • Qty: <strong className="text-white">{rfq.quantity} {rfq.unit}</strong> • Target: {rfq.deliveryLocation}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-slate-400">Target Delivery</div>
                <div className="text-sm font-semibold text-slate-200">{rfq.targetDeliveryDate}</div>
              </div>
            </div>

            {/* Bids comparison */}
            <div>
              <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Scale className="h-4 w-4 text-indigo-400" /> Supplier Quotations ({rfq.bids?.length || 0} Submitted)
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {rfq.bids?.map((bid) => (
                  <div key={bid.id} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-slate-200">{bid.supplierName}</span>
                      <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300">
                        Score: {bid.score}/100
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs py-1 border-y border-slate-800/80">
                      <div>
                        <div className="text-[10px] text-slate-500">Unit Price</div>
                        <div className="font-semibold text-slate-200">${bid.unitPrice}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Total Bid</div>
                        <div className="font-bold text-emerald-400">${bid.totalPrice?.toLocaleString()}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-slate-500">Lead Time</div>
                        <div className="font-semibold text-slate-200">{bid.estimatedLeadTimeDays} days</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                      <span>Terms: <strong>{bid.paymentTerms}</strong></span>
                      <button className="text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1">
                        Select Bid <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
