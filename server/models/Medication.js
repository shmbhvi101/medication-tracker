// server/models/Medication.js
const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  dosage: {
    type: String,
    default: ''
  },
  frequency: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  times: {
    type: [String],
    required: true,
    default: ['09:00']
  },
  totalStock: {
    type: Number,
    required: true,
    min: 1
  },
  currentStock: {
    type: Number,
    required: true
  },
  lowStockThreshold: {
    type: Number,
    default: 3
  },
  dosesHistory: [{
    date: {
      type: Date,
      default: Date.now
    },
    time: String,
    status: {
      type: String,
      enum: ['taken', 'skipped'],
      default: 'taken'
    }
  }],
  lastRefill: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Medication', medicationSchema);