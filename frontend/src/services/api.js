// Smart Business Marketplace API Client

const API_BASE = '/api/v1';

async function request(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json', ...options.headers },
      ...options,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (e) {
    console.warn(`API call ${endpoint} fallback:`, e.message);
    return getFallbackData(endpoint);
  }
}

export const api = {
  getProducts: () => request('/products'),
  getSuppliers: () => request('/suppliers'),
  getRFQs: () => request('/rfqs'),
  createRFQ: (rfqData) => request('/rfqs', { method: 'POST', body: JSON.stringify(rfqData) }),
  getTransporters: () => request('/transporters'),
  getShipments: () => request('/shipments'),
  unifiedProcureAndShip: (payload) => request('/marketplace/unified-procure-and-ship', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
};

function getFallbackData(endpoint) {
  if (endpoint.includes('/products')) {
    return [
      {
        id: "PRD-201",
        sku: "STL-BEAM-H300",
        name: "Structural Heavy H-Beam Grade 50",
        category: "Raw Materials",
        supplierId: "SUP-101",
        supplierName: "Apex Industrial Steels",
        unitPrice: 420.00,
        unit: "ton",
        minOrderQty: 10,
        availableStock: 350
      },
      {
        id: "PRD-202",
        sku: "POLY-RES-HDPE",
        name: "High-Density Polyethylene Resin Pellets",
        category: "Chemicals & Plastics",
        supplierId: "SUP-102",
        supplierName: "Vanguard Polymer & Plastics",
        unitPrice: 1150.00,
        unit: "metric ton",
        minOrderQty: 5,
        availableStock: 120
      },
      {
        id: "PRD-203",
        sku: "SENS-OPT-500",
        name: "Industrial Optical Proximity Sensor IC",
        category: "Electronics & Hardware",
        supplierId: "SUP-103",
        supplierName: "Precision Micro-Sensors",
        unitPrice: 28.50,
        unit: "unit",
        minOrderQty: 100,
        availableStock: 4500
      }
    ];
  }
  if (endpoint.includes('/transporters')) {
    return [
      {
        id: "TRN-801",
        name: "SwiftHaul Heavy Logistics",
        fleetType: "Flatbed & Heavy Haul",
        rating: 4.8,
        ratePerTonKm: 0.14,
        availableTrucks: 18,
        baseHub: "Chicago, IL",
        transitTimeEstHours: 12
      },
      {
        id: "TRN-802",
        name: "Eagle Eye Express Freight",
        fleetType: "Refrigerated & Dry Van",
        rating: 4.7,
        ratePerTonKm: 0.18,
        availableTrucks: 24,
        baseHub: "Columbus, OH",
        transitTimeEstHours: 10
      }
    ];
  }
  if (endpoint.includes('/shipments')) {
    return [
      {
        id: "PO-9001",
        rfqId: "RFQ-502",
        buyer: "Nexus Robotics Automation",
        supplier: "Precision Micro-Sensors",
        transporter: "SwiftHaul Heavy Logistics",
        items: "500x Industrial Optical Proximity Sensor IC",
        totalAmount: 12500.00,
        freightCost: 650.00,
        status: "IN_TRANSIT",
        currentLocation: { lat: 31.5493, lng: -97.1467, name: "Waco Hub, TX" },
        origin: { lat: 37.3382, lng: -121.8863, name: "San Jose, CA" },
        destination: { lat: 30.2672, lng: -97.7431, name: "Austin Tech Campus, TX" },
        trackingNumber: "SLK-77492019-US",
        eta: "Today, 18:30"
      }
    ];
  }
  return [];
}
