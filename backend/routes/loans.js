const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all loans
router.get('/', async (req, res) => {
  try {
    const result = await db.execute(`SELECT Loan_ID, Loan_type, TO_CHAR(loan_date, 'YYYY-MM-DD') as loan_date, Amount, Duration, Installment_pms, Cust_ID, Branch_ID FROM Loan`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new loan
router.post('/', async (req, res) => {
  const { Loan_ID, Loan_type, loan_date, Amount, Duration, Installment_pms, Cust_ID, Branch_ID } = req.body;
  
  try {
    await db.execute(
      `INSERT INTO Loan (Loan_ID, Loan_type, loan_date, Amount, Duration, Installment_pms, Cust_ID, Branch_ID) 
       VALUES (:1, :2, TO_DATE(:3, 'YYYY-MM-DD'), :4, :5, :6, :7, :8)`,
      [Loan_ID, Loan_type, loan_date, Amount, Duration, Installment_pms, Cust_ID, Branch_ID]
    );
    res.status(201).json({ message: 'Loan added successfully!' });
  } catch (err) {
    if (err.errorNum === 1) { // Unique constraint
       res.status(400).json({ error: 'Loan ID already exists.' });
    } else {
       res.status(500).json({ error: err.message });
    }
  }
});

module.exports = router;
