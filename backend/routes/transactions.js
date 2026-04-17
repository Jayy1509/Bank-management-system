const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const result = await db.execute(`SELECT Trans_ID, Transaction_type, Amount, trans_date, Account_no FROM Transaction ORDER BY trans_date DESC`);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new transaction (Deposit or Withdraw)
router.post('/', async (req, res) => {
  const { Trans_ID, Transaction_type, Amount, trans_date, Account_no } = req.body;
  
  let connection;
  try {
    connection = await db.getConnection();
    
    // Validate Account exists and check balance if withdraw
    const accResult = await connection.execute(
      `SELECT Balance_available FROM Account WHERE Account_no = :1`,
      [Account_no]
    );

    if (accResult.rows.length === 0) {
      return res.status(404).json({ error: 'Account not found.' });
    }

    let currentBalance = parseFloat(accResult.rows[0].BALANCE_AVAILABLE || accResult.rows[0].Balance_available || 0);
    const transAmount = parseFloat(Amount);

    if (Transaction_type === 'Withdraw') {
      if (currentBalance < transAmount) {
        return res.status(400).json({ error: 'Insufficient balance.' });
      }
      currentBalance -= transAmount;
    } else if (Transaction_type === 'Deposit') {
      currentBalance += transAmount;
    } else {
      return res.status(400).json({ error: 'Invalid transaction type.' });
    }

    // Insert Transaction
    await connection.execute(
      `INSERT INTO Transaction (Trans_ID, Transaction_type, Amount, trans_date, Account_no) 
       VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'), :5)`,
      [Trans_ID, Transaction_type, transAmount, trans_date, Account_no]
    );

    // Update Account Balance
    await connection.execute(
      `UPDATE Account SET Balance_available = :1 WHERE Account_no = :2`,
      [currentBalance, Account_no]
    );
    
    await connection.commit();
    res.status(201).json({ message: 'Transaction successful!', newBalance: currentBalance });
  } catch (err) {
    if (connection) {
       try { await connection.rollback(); } catch(e) {}
    }
    if (err.errorNum === 1) { // Unique constraint Trans_ID
       res.status(400).json({ error: 'Transaction ID already exists.' });
    } else {
       res.status(500).json({ error: err.message });
    }
  } finally {
    if (connection) {
      try { await connection.close(); } catch(e) {}
    }
  }
});

module.exports = router;
