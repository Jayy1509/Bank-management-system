const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all branches
router.get('/', async (req, res) => {
  try {
    const result = await db.execute(`SELECT Branch_ID, Branch_name, Contact_no, Manager, City, Address FROM Branch`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new branch
router.post('/', async (req, res) => {
  const { Branch_ID, Branch_name, Contact_no, Manager, City, Address } = req.body;
  try {
    await db.execute(
      `INSERT INTO Branch (Branch_ID, Branch_name, Contact_no, Manager, City, Address) VALUES (:1, :2, :3, :4, :5, :6)`,
      [Branch_ID, Branch_name, Contact_no, Manager, City, Address]
    );
    res.status(201).json({ message: 'Branch added successfully!' });
  } catch (err) {
    if (err.errorNum === 1) {
       res.status(400).json({ error: 'Branch ID already exists.' });
    } else {
       res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;
