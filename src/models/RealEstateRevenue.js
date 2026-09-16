const mongoose = require('mongoose');

const realEstateRevenueSchema = new mongoose.Schema({
  // ============================================================
  // TRANSACTIONS
  // ============================================================
  transactions: [{
    id: { type: String },
    type: {
      type: String,
      enum: ['sale_commission', 'rent_commission'],
      required: true,
    },
    propertyId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    propertyTitle: { type: String, default: '' },
    propertyType: { type: String, default: '' },
    amount: { type: Number, required: true },
    date: { type: String },
    remarks: { type: String, default: '' },
    createdBy: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    createdByName: { type: String, default: '' },
  }],

  // ============================================================
  // CACHED TOTALS
  // ============================================================
  totalRevenue: {
    type: Number,
    default: 0,
  },
  saleCommissionTotal: {
    type: Number,
    default: 0,
  },
  rentCommissionTotal: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('RealEstateRevenue', realEstateRevenueSchema);