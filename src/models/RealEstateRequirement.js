const mongoose = require('mongoose');

const realEstateRequirementSchema = new mongoose.Schema({
  // ============================================================
  // TYPE
  // ============================================================
  requirementType: {
    type: String,
    enum: ['buyer', 'tenant'],
    required: true,
  },

  // ============================================================
  // CONTACT
  // ============================================================
  name: {
    type: String,
    required: true,
    trim: true,
  },
  phone: {
    type: String,
    required: true,
    trim: true,
  },

  // ============================================================
  // LOCATION PREFERENCE
  // ============================================================
  preferredArea: {
    type: String,
    default: '',
    trim: true,
  },
  region: {
    type: String,
    default: '',
    trim: true,
  },
  city: {
    type: String,
    default: '',
    trim: true,
  },

  // ============================================================
  // PROPERTY PREFERENCE
  // ============================================================
  lookingFor: {
    type: [String],
    default: [],
  },
  desiredArea: {
    type: Number,
    default: 0,
  },
  areaUnit: {
    type: String,
    enum: ['marla', 'kanal', 'sqft', 'sqyd', 'sqm', 'acre', ''],
    default: '',
  },

  // ============================================================
  // BUDGET
  // ============================================================
  budget: {
    type: Number,
    default: 0,
  },

  // ============================================================
  // NOTES
  // ============================================================
  notes: {
    type: String,
    default: '',
  },

  // ============================================================
  // STATUS
  // ============================================================
  status: {
    type: String,
    enum: ['active', 'fulfilled', 'cancelled'],
    default: 'active',
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
}, {
  timestamps: true,
});

module.exports = mongoose.model('RealEstateRequirement', realEstateRequirementSchema);