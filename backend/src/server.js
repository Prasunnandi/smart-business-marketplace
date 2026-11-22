import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { 
  initialSuppliers, 
  initialProducts, 
  initialRFQs, 
  initialTransporters, 
  initialOrdersAndShipments 
} from './data.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// State store
let suppliers = [...initialSuppliers];
let products = [...initialProducts];
let rfqs = [...initialRFQs];
let transporters = [...initialTransporters];
let ordersAndShipments = [...initialOrdersAndShipments];

// 1. Health & Meta
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'UP', service: 'Smart Business Marketplace API', version: '1.0.0' });
});

// 2. Suppliers
app.get('/api/v1/suppliers', (req, res) => {
  res.json(suppliers);
});

// 3. Products / Catalog (LocalTrade)
app.get('/api/v1/products', (req, res) => {
  res.json(products);
});

// 4. RFQ & Quotation Comparison (ProcureFlow)
app.get('/api/v1/rfqs', (req, res) => {
  res.json(rfqs);
});

app.post('/api/v1/rfqs', (req, res) => {
  const { title, buyerCompany, productId, quantity, deliveryLocation, targetDeliveryDate } = req.body;
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(400).json({ error: 'Product not found' });
  }

  // Generate competitive supplier bids automatically
  const supplier1 = suppliers.find(s => s.id === product.supplierId) || suppliers[0];
  const supplier2 = suppliers.find(s => s.id !== product.supplierId) || suppliers[1];

  const baseTotal = product.unitPrice * quantity;
  const bid1Price = Math.round(product.unitPrice * 0.95);
  const bid2Price = Math.round(product.unitPrice * 1.02);

  const newRFQ = {
    id: `RFQ-${Math.floor(100 + Math.random() * 900)}`,
    title: title || `Procurement of ${product.name}`,
    buyerCompany: buyerCompany || 'Global Manufacturing Partner',
    productId: product.id,
    productName: product.name,
    quantity: Number(quantity) || 10,
    unit: product.unit,
    status: 'QUOTES_RECEIVED',
    targetDeliveryDate: targetDeliveryDate || '2026-12-20',
    deliveryLocation: deliveryLocation || 'Main Logistics Warehouse',
    bids: [
      {
        id: `BID-${Date.now()}-1`,
        supplierId: supplier1.id,
        supplierName: supplier1.name,
        unitPrice: bid1Price,
        totalPrice: bid1Price * quantity,
        estimatedLeadTimeDays: 5,
        paymentTerms: 'Net 30',
        score: 96
      },
      {
        id: `BID-${Date.now()}-2`,
        supplierId: supplier2.id,
        supplierName: supplier2.name,
        unitPrice: bid2Price,
        totalPrice: bid2Price * quantity,
        estimatedLeadTimeDays: 10,
        paymentTerms: 'Net 15',
        score: 84
      }
    ]
  };

  rfqs.unshift(newRFQ);
  res.status(201).json(newRFQ);
});

// 5. Transporters & Freight Fleet (ShipLink)
app.get('/api/v1/transporters', (req, res) => {
  res.json(transporters);
});

// 6. Orders & Shipments Tracker
app.get('/api/v1/shipments', (req, res) => {
  res.json(ordersAndShipments);
});

// 7. Standout Feature: Unified Sourcing-to-Shipment Flow
// "A business can source products, compare supplier prices, approve a purchase and arrange transportation from one platform."
app.post('/api/v1/marketplace/unified-procure-and-ship', (req, res) => {
  const { productId, quantity, buyerCompany, chosenSupplierId, chosenTransporterId, deliveryLocation } = req.body;
  
  const product = products.find(p => p.id === productId);
  if (!product) {
    return res.status(404).json({ error: 'Selected product not found' });
  }

  const supplier = suppliers.find(s => s.id === (chosenSupplierId || product.supplierId)) || suppliers[0];
  const transporter = transporters.find(t => t.id === chosenTransporterId) || transporters[0];

  const qty = Number(quantity) || product.minOrderQty;
  const negotiatedUnitPrice = Math.round(product.unitPrice * 0.94); // Marketplace preferred buyer discount
  const subtotal = negotiatedUnitPrice * qty;
  const freightCost = Math.round(transporter.ratePerTonKm * 500 * (qty > 50 ? 2 : 1)) + 350;
  const totalAmount = subtotal + freightCost;

  const orderId = `PO-${Math.floor(1000 + Math.random() * 9000)}`;
  const trackingNumber = `SLK-${Math.floor(10000000 + Math.random() * 90000000)}-US`;

  const newOrder = {
    id: orderId,
    rfqId: `RFQ-DIRECT-${orderId}`,
    buyer: buyerCompany || 'Apex Global Enterprises',
    supplier: supplier.name,
    transporter: transporter.name,
    items: `${qty}x ${product.name} (${product.sku})`,
    totalAmount,
    subtotal,
    freightCost,
    status: 'DISPATCHED_IN_TRANSIT',
    currentLocation: { lat: 41.8781, lng: -87.6298, name: `${supplier.location} Distribution Dock` },
    origin: { lat: 41.8781, lng: -87.6298, name: supplier.location },
    destination: { lat: 42.3314, lng: -83.0458, name: deliveryLocation || 'Central Assembly Facility' },
    trackingNumber,
    eta: 'Within 48 Hours',
    timestamp: new Date().toISOString()
  };

  ordersAndShipments.unshift(newOrder);

  res.status(201).json({
    message: 'Unified sourcing, quotation selection, purchase approval, and freight logistics successfully booked!',
    order: newOrder
  });
});

app.listen(PORT, () => {
  console.log(`Smart Business Marketplace API listening on port ${PORT}`);
});
