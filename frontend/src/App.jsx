import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import UnifiedProcureHub from './pages/UnifiedProcureHub';
import CatalogView from './pages/CatalogView';
import RfqQuotesView from './pages/RfqQuotesView';
import TransportersView from './pages/TransportersView';
import ShipmentTrackerView from './pages/ShipmentTrackerView';

export default function App() {
  const [activeTab, setActiveTab] = useState('unified');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar onRefresh={handleRefresh} isRefreshing={isRefreshing} />
        
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'unified' && <UnifiedProcureHub onNavigateToShipments={() => setActiveTab('shipments')} />}
          {activeTab === 'catalog' && <CatalogView onSelectProductForUnified={() => setActiveTab('unified')} />}
          {activeTab === 'rfq' && <RfqQuotesView />}
          {activeTab === 'transporters' && <TransportersView />}
          {activeTab === 'shipments' && <ShipmentTrackerView />}
        </main>
      </div>
    </div>
  );
}
