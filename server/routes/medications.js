// server/routes/medications.js
const express = require('express');
const Medication = require('../models/Medication');
const router = express.Router();

// Get all medications
router.get('/', async (req, res) => {
  try {
    const medications = await Medication.find().sort({ createdAt: -1 });
    res.json(medications);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single medication
router.get('/:id', async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) return res.status(404).json({ message: 'Medication not found' });
    res.json(medication);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create medication
router.post('/', async (req, res) => {
  const { name, dosage, frequency, times, totalStock } = req.body;

  if (!name || !totalStock || !times || times.length === 0) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  const medication = new Medication({
    name,
    dosage: dosage || '',
    frequency: frequency || times.length,
    times: Array.isArray(times) ? times : [times],
    totalStock,
    currentStock: totalStock
  });

  try {
    const newMedication = await medication.save();
    res.status(201).json(newMedication);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update medication
router.put('/:id', async (req, res) => {
  try {
    const medication = await Medication.findById(req.params.id);
    if (!medication) return res.status(404).json({ message: 'Medication not found' });

    if (req.body.name) medication.name = req.body.name;
    if (req.body.dosage !== undefined) medication.dosage = req.body.dosage;
    if (req.body.frequency) medication.frequency = req.body.frequency;
    if (req.body.times) medication.times = Array.isArray(req.body.times) ? req.body.times : [req.body.times];
    if (req.body.totalStock) medication.totalStock = req.body.totalStock;

    const updated = await medication.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete medication
router.delete('/:id', async (req, res) => {
  try {
    const medication = await Medication.findByIdAndDelete(req.params.id);
    if (!medication) return res.status(404).json({ message: 'Medication not found' });
    res.json({ message: 'Medication deleted', medication });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mark dose taken or skipped
router.post('/:id/dose', async (req, res) => {
  try {
    const { status, time } = req.body;
    const medication = await Medication.findById(req.params.id);
    
    if (!medication) return res.status(404).json({ message: 'Medication not found' });
    if (!['taken', 'skipped'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    medication.dosesHistory.push({
      date: new Date(),
      time: time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      status
    });

    if (status === 'taken' && medication.currentStock > 0) {
      medication.currentStock -= 1;
    }

    const updated = await medication.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Refill medication
router.post('/:id/refill', async (req, res) => {
  try {
    const { quantity } = req.body;
    const medication = await Medication.findById(req.params.id);
    
    if (!medication) return res.status(404).json({ message: 'Medication not found' });

    medication.currentStock = quantity || medication.totalStock;
    medication.lastRefill = new Date();

    const updated = await medication.save();
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get today's schedule
router.get('/schedule/today', async (req, res) => {
  try {
    const medications = await Medication.find();
    const today = new Date().toDateString();

    const schedule = medications.map(med => ({
      _id: med._id,
      name: med.name,
      dosage: med.dosage,
      times: med.times,
      currentStock: med.currentStock,
      lowStock: med.currentStock <= med.lowStockThreshold
    }));

    res.json(schedule);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
