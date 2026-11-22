// Seed data for Smart Business Marketplace (ShipLink + LocalTrade + ProcureFlow)

export const initialSuppliers = [
  {
    id: "SUP-101",
    name: "Apex Industrial Steels & Alloys",
    rating: 4.8,
    reviewsCount: 142,
    location: "Chicago, IL",
    category: "Raw Materials",
    verified: true,
    reliabilityScore: 98,
    contact: "sales@apexsteels.com"
  },
  {
    id: "SUP-102",
    name: "Vanguard Polymer & Plastics Ltd",
    rating: 4.6,
    reviewsCount: 89,
    location: "Akron, OH",
    category: "Chemicals & Plastics",
    verified: true,
    reliabilityScore: 94,
    contact: "rfq@vanguardpolymers.com"
  },
  {
    id: "SUP-103",
    name: "Precision Micro-Sensors Corp",
    rating: 4.9,
    reviewsCount: 215,
    location: "San Jose, CA",
    category: "Electronics & Hardware",
    verified: true,
    reliabilityScore: 99,
    contact: "orders@precisionmicro.com"
  },
  {
    id: "SUP-104",
    name: "Midwest Packaging & Container Co",
    rating: 4.5,
    reviewsCount: 64,
    location: "Indianapolis, IN",
    category: "Packaging Materials",
    verified: true,
    reliabilityScore: 91,
    contact: "quotes@midwestpkg.com"
  }
];

export const initialProducts = [
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
  },
  {
    id: "PRD-204",
    sku: "BOX-CORR-PALLET",
    name: "Heavy-Duty Double-Wall Corrugated Pallet Boxes",
    category: "Packaging Materials",
    supplierId: "SUP-104",
    supplierName: "Midwest Packaging",
    unitPrice: 14.20,
    unit: "box",
    minOrderQty: 250,
    availableStock: 2800
  }
];

export const initialRFQs = [
  {
    id: "RFQ-501",
    title: "Q4 Bulk Structural Steel Procurement",
    buyerCompany: "OmniBuild Infrastructure Corp",
    productId: "PRD-201",
    productName: "Structural Heavy H-Beam Grade 50",
    quantity: 50,
    unit: "ton",
    status: "QUOTES_RECEIVED",
    targetDeliveryDate: "2026-12-15",
    deliveryLocation: "Detroit Assembly Plant, MI",
    bids: [
      {
        id: "BID-1",
        supplierId: "SUP-101",
        supplierName: "Apex Industrial Steels",
        unitPrice: 395.00,
        totalPrice: 19750.00,
        estimatedLeadTimeDays: 7,
        paymentTerms: "Net 30",
        score: 95
      },
      {
        id: "BID-2",
        supplierId: "SUP-102",
        supplierName: "Global Metals Consortium",
        unitPrice: 415.00,
        totalPrice: 20750.00,
        estimatedLeadTimeDays: 14,
        paymentTerms: "Net 15",
        score: 82
      }
    ]
  },
  {
    id: "RFQ-502",
    title: "Industrial Sensor Restock Batch A",
    buyerCompany: "Nexus Robotics Automation",
    productId: "PRD-203",
    productName: "Industrial Optical Proximity Sensor IC",
    quantity: 500,
    unit: "unit",
    status: "APPROVED_FOR_PO",
    targetDeliveryDate: "2026-11-30",
    deliveryLocation: "Austin Tech Campus, TX",
    bids: [
      {
        id: "BID-3",
        supplierId: "SUP-103",
        supplierName: "Precision Micro-Sensors",
        unitPrice: 25.00,
        totalPrice: 12500.00,
        estimatedLeadTimeDays: 3,
        paymentTerms: "Net 45",
        score: 98
      }
    ]
  }
];

export const initialTransporters = [
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
  },
  {
    id: "TRN-803",
    name: "CrossCountry Interstate Haulers",
    fleetType: "Intermodal Container",
    rating: 4.6,
    ratePerTonKm: 0.12,
    availableTrucks: 42,
    baseHub: "Dallas, TX",
    transitTimeEstHours: 24
  }
];

export const initialOrdersAndShipments = [
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
  },
  {
    id: "PO-9002",
    rfqId: "RFQ-501",
    buyer: "OmniBuild Infrastructure Corp",
    supplier: "Apex Industrial Steels",
    transporter: "SwiftHaul Heavy Logistics",
    items: "50x Structural Heavy H-Beam Grade 50",
    totalAmount: 19750.00,
    freightCost: 1450.00,
    status: "DISPATCHED",
    currentLocation: { lat: 41.8781, lng: -87.6298, name: "Chicago Depot, IL" },
    origin: { lat: 41.8781, lng: -87.6298, name: "Chicago, IL" },
    destination: { lat: 42.3314, lng: -83.0458, name: "Detroit Assembly Plant, MI" },
    trackingNumber: "SLK-88319022-US",
    eta: "Tomorrow, 10:00"
  }
];
