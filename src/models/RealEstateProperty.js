
const mongoose = require('mongoose');

const realEstatePropertySchema = new mongoose.Schema({
  // ============================================================
  // CORE
  // ============================================================
  listingType: {
    type: String,
    enum: ['for_sale', 'for_rent'],
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'sold_elsewhere', 'paused', 'invalid', 'closed_via_us'],
    default: 'active',
  },

  // ============================================================
  // OWNER INFO
  // ============================================================
  ownerName: {
    type: String,
    required: true,
    trim: true,
  },
  ownerPhone: {
    type: String,
    required: true,
    trim: true,
  },

  // ============================================================
  // LOCATION
  // ============================================================
  society: {
    type: String,
    required: true,
    trim: true,
  },
  region: {
    type: String,
    required: true,
    trim: true,
  },
  city: {
    type: String,
    required: true,
    trim: true,
  },
  province: {
    type: String,
    default: '',
    trim: true,
  },

  // ============================================================
  // PROPERTY DETAILS
  // ============================================================
  propertyType: {
    type: String,
    enum: [
      'residential_plot',
      'commercial_plot',
      'house',
      'apartment',
      'room',
      'office',
      'shop',
      'warehouse',
      'other',
    ],
    required: true,
  },
  area: {
    type: Number,
    required: true,
  },
  areaUnit: {
    type: String,
    enum: ['marla', 'kanal', 'sqft', 'sqyd', 'sqm', 'acre'],
    required: true,
  },

  // ============================================================
  // PRICING
  // ============================================================
  askingPrice: {
    type: Number,
    default: 0,
  },
  monthlyRent: {
    type: Number,
    default: 0,
  },
  securityDeposit: {
    type: Number,
    default: 0,
  },

  // ============================================================
  // DETAILS
  // ============================================================
  remarks: {
    type: String,
    default: '',
  },
  photos: {
    type: [String],
    default: [],
  },

  // ============================================================
  // METADATA
  // ============================================================
  createdBy: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  createdByName: {
    type: String,
    default: '',
  },
  updatedBy: {
    type: mongoose.Schema.Types.Mixed,
    default: null,
  },
  updatedByName: {
    type: String,
    default: '',
  },

  // ============================================================
  // CLOSE INFO (when status changes from active)
  // ============================================================
  closedAt: {
    type: String,
    default: null,
  },
  closedReason: {
    type: String,
    default: '',
  },
  commission: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('RealEstateProperty', realEstatePropertySchema);