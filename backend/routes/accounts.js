const express = require('express');
const router = express.Router();
const db = require('../config/db');

// GET all accounts
router.get('/', async (req, res) => {
  try {
    const result = await db.execute(`
      SELECT a.Account_no, a.Account_type, a.Balance_available, a.Opening_date, a.Branch_ID, c.Cust_ID, c.Name as Customer_Name
      FROM Account a
      LEFT JOIN Customer_Account ca ON a.Account_no = ca.Account_no
      LEFT JOIN Customer c ON ca.Cust_ID = c.Cust_ID
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST a new account
router.post('/', async (req, res) => {
  const { Account_no, Account_type, Balance_available, Opening_date, Branch_ID, Cust_ID } = req.body;
  
  let connection;
  try {
    connection = await db.getConnection();
    
    // We will do a simple transaction for creating Account and Customer_Account link
    await connection.execute(
      `INSERT INTO Account (Account_no, Account_type, Balance_available, Opening_date, Branch_ID) 
       VALUES (:1, :2, :3, TO_DATE(:4, 'YYYY-MM-DD'), :5)`,
      [Account_no, Account_type, Balance_available, Opening_date, Branch_ID]
    );

    // Link account to customer (assuming single owner for simplicity now, but supports joint later)
    if (Cust_ID) {
      await connection.execute(
        `INSERT INTO Customer_Account (Cust_ID, Account_no) VALUES (:1, :2)`,
        [Cust_ID, Account_no]
      );
    }
    
    await connection.commit();
    res.status(201).json({ message: 'Account created successfully!' });
  } catch (err) {
    if (connection) {
       try { await connection.rollback(); } catch(e) {}
    }
    if (err.errorNum === 1) { // Unique constraint
       res.status(400).json({ error: 'Account number already exists.' });
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
