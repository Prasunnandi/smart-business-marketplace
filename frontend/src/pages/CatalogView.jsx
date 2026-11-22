import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { ShoppingBag, Star, ShieldCheck, Plus, Layers, ArrowUpRight } from 'lucide-react';

export default function CatalogView({ onSelectProductForUnified }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await api.getProducts();
      setProducts(data || []);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-indigo-400" /> B2B Product & Material Catalogue
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Browse verified commercial supplier inventory with wholesale volume tiers.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {products.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                  {item.category}
                </span>
                <span className="text-xs font-mono text-slate-400">{item.sku}</span>
              </div>
              <h3 className="text-base font-bold text-white mt-2">{item.name}</h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1">
                <span>By {item.supplierName}</span>
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              </div>
            </div>

            <div className="space-y-3 pt-3 border-t border-slate-800/80">
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xl font-extrabold text-white">${item.unitPrice.toFixed(2)}</span>
                  <span className="text-xs text-slate-400 font-normal"> / {item.unit}</span>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div>Min Order: <strong className="text-slate-200">{item.minOrderQty} {item.unit}</strong></div>
                  <div>Available: <strong className="text-emerald-400">{item.availableStock}</strong></div>
                </div>
              </div>

              <button
                onClick={() => onSelectProductForUnified && onSelectProductForUnified(item.id)}
                className="w-full py-2 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                Procure & Dispatch Freight <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
