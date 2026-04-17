const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all customers
router.get('/', async (req, res) => {
  try {
    const result = await db.execute(`SELECT Cust_ID, Name, Address, Contact_no FROM Customer`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new customer
router.post('/', async (req, res) => {
  const { Cust_ID, Name, Address, Contact_no } = req.body;
  try {
    await db.execute(
      `INSERT INTO Customer (Cust_ID, Name, Address, Contact_no) VALUES (:1, :2, :3, :4)`,
      [Cust_ID, Name, Address, Contact_no]
    );
    res.status(201).json({ message: 'Customer added successfully!' });
  } catch (err) {
    if (err.errorNum === 1) { // ORA-00001: unique constraint violated
       res.status(400).json({ error: 'Customer ID already exists.' });
    } else {
       res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;
