/**
 * Multi-Party Escrow State Machine & Fund Release Engine
 * Manages trusted intermediary fund holding, milestone triggers, fee splits, and dispute arbitrations.
 */

export const ESCROW_STATES = {
  INITIALIZED: 'INITIALIZED',
  FUNDED: 'FUNDED',
  IN_FULFILLMENT: 'IN_FULFILLMENT',
  INSPECTION_PERIOD: 'INSPECTION_PERIOD',
  RELEASED: 'RELEASED',
  DISPUTED: 'DISPUTED',
  REFUNDED: 'REFUNDED'
};

export class EscrowEngine {
  /**
   * @param {Object} [options]
   * @param {number} [options.platformTakeRatePct=10.0] - Marketplace fee percentage
   * @param {number} [options.inspectionWindowHours=72] - Inspection window before auto-release
   */
  constructor(options = {}) {
    this.platformTakeRatePct = options.platformTakeRatePct || 10.0;
    this.inspectionWindowHours = options.inspectionWindowHours || 72;
    this.escrows = new Map();
  }

  /**
   * Create an escrow agreement for a commercial order
   * @param {Object} params
   * @param {string} params.orderId - Unique order/contract identifier
   * @param {string} params.buyerId - Buyer identity
   * @param {string} params.sellerId - Seller identity
   * @param {number} params.amount - Total transaction value in currency units
   * @returns {Object} Initialized escrow agreement
   */
  createEscrow(params) {
    const { orderId, buyerId, sellerId, amount } = params;

    if (!orderId || !buyerId || !sellerId || amount <= 0) {
      throw new Error('Valid orderId, buyerId, sellerId, and positive amount are required');
    }

    const platformFee = Number(((amount * this.platformTakeRatePct) / 100).toFixed(2));
    const sellerProceeds = Number((amount - platformFee).toFixed(2));

    const record = {
      orderId,
      buyerId,
      sellerId,
      totalAmount: amount,
      platformFee,
      sellerProceeds,
      state: ESCROW_STATES.INITIALIZED,
      fundedAt: null,
      deliveredAt: null,
      releasedAt: null,
      disputeReason: null,
      auditLog: [
        {
          state: ESCROW_STATES.INITIALIZED,
          timestamp: new Date().toISOString(),
          actor: 'system',
          note: 'Escrow contract initialized'
        }
      ]
    };

    this.escrows.set(orderId, record);
    return record;
  }

  /**
   * Deposit buyer funds into escrow lock
   */
  fundEscrow(orderId, paymentReference) {
    const record = this._getRecord(orderId);
    if (record.state !== ESCROW_STATES.INITIALIZED) {
      throw new Error(`Cannot fund escrow in state: ${record.state}`);
    }

    record.state = ESCROW_STATES.FUNDED;
    record.fundedAt = new Date().toISOString();
    record.paymentRef = paymentReference;
    this._appendAudit(record, ESCROW_STATES.FUNDED, record.buyerId, `Funds captured (Ref: ${paymentReference})`);

    return record;
  }

  /**
   * Seller signals order dispatch or milestone delivery
   */
  signalFulfillment(orderId, trackingNumber) {
    const record = this._getRecord(orderId);
    if (record.state !== ESCROW_STATES.FUNDED) {
      throw new Error(`Cannot signal fulfillment in state: ${record.state}`);
    }

    record.state = ESCROW_STATES.INSPECTION_PERIOD;
    record.deliveredAt = new Date().toISOString();
    record.trackingNumber = trackingNumber;
    this._appendAudit(record, ESCROW_STATES.INSPECTION_PERIOD, record.sellerId, `Dispatched (Tracking: ${trackingNumber})`);

    return record;
  }

  /**
   * Confirm delivery satisfaction and disburse funds to seller and platform
   */
  releaseFunds(orderId, actorId) {
    const record = this._getRecord(orderId);
    if (record.state !== ESCROW_STATES.INSPECTION_PERIOD && record.state !== ESCROW_STATES.FUNDED) {
      throw new Error(`Cannot release funds in state: ${record.state}`);
    }

    record.state = ESCROW_STATES.RELEASED;
    record.releasedAt = new Date().toISOString();
    this._appendAudit(record, ESCROW_STATES.RELEASED, actorId, `Funds disbursed: Seller ${record.sellerProceeds}, Platform Fee ${record.platformFee}`);

    return {
      orderId,
      state: record.state,
      disbursed: {
        sellerId: record.sellerId,
        sellerPayout: record.sellerProceeds,
        platformFee: record.platformFee,
        total: record.totalAmount
      },
      auditCount: record.auditLog.length
    };
  }

  /**
   * Trigger dispute mediation
   */
  openDispute(orderId, buyerId, reason) {
    const record = this._getRecord(orderId);
    record.state = ESCROW_STATES.DISPUTED;
    record.disputeReason = reason;
    this._appendAudit(record, ESCROW_STATES.DISPUTED, buyerId, `Dispute opened: ${reason}`);
    return record;
  }

  _getRecord(orderId) {
    const r = this.escrows.get(orderId);
    if (!r) throw new Error(`Escrow agreement not found for orderId: ${orderId}`);
    return r;
  }

  _appendAudit(record, state, actor, note) {
    record.auditLog.push({
      state,
      timestamp: new Date().toISOString(),
      actor,
      note
    });
  }
}

export default EscrowEngine;
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EscrowEngine;
  module.exports.EscrowEngine = EscrowEngine;
  module.exports.ESCROW_STATES = ESCROW_STATES;
}
