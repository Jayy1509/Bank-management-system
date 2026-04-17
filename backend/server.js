const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

// Import routes
const customersRouter = require('./routes/customers');
const accountsRouter = require('./routes/accounts');
const transactionsRouter = require('./routes/transactions');
const loansRouter = require('./routes/loans');
const branchesRouter = require('./routes/branches');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// API Routes
app.use('/api/branches', branchesRouter);
app.use('/api/customers', customersRouter);
app.use('/api/accounts', accountsRouter);
app.use('/api/transactions', transactionsRouter);
app.use('/api/loans', loansRouter);

// Database initialization route - creates tables and seed data
app.post('/api/init-db', async (req, res) => {
  try {
    const statements = [
      // Drop tables (ignore errors if they don't exist)
      { sql: `BEGIN EXECUTE IMMEDIATE 'DROP TABLE "Transaction" CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;`, ignore: true },
      { sql: `BEGIN EXECUTE IMMEDIATE 'DROP TABLE Loan CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;`, ignore: true },
      { sql: `BEGIN EXECUTE IMMEDIATE 'DROP TABLE Customer_Account CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;`, ignore: true },
      { sql: `BEGIN EXECUTE IMMEDIATE 'DROP TABLE Account CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;`, ignore: true },
      { sql: `BEGIN EXECUTE IMMEDIATE 'DROP TABLE Customer CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;`, ignore: true },
      { sql: `BEGIN EXECUTE IMMEDIATE 'DROP TABLE Employee CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;`, ignore: true },
      { sql: `BEGIN EXECUTE IMMEDIATE 'DROP TABLE Department CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;`, ignore: true },
      { sql: `BEGIN EXECUTE IMMEDIATE 'DROP TABLE Branch CASCADE CONSTRAINTS'; EXCEPTION WHEN OTHERS THEN NULL; END;`, ignore: true },

      // Create tables
      { sql: `CREATE TABLE Branch (Branch_ID INT PRIMARY KEY, Branch_name VARCHAR2(100), Contact_no VARCHAR2(15), Manager VARCHAR2(100), City VARCHAR2(50), Address VARCHAR2(255))` },
      { sql: `CREATE TABLE Department (Dept_ID INT PRIMARY KEY, Department_names VARCHAR2(100), Contact_no VARCHAR2(15), Branch_ID INT, FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID))` },
      { sql: `CREATE TABLE Employee (Emp_ID INT PRIMARY KEY, Name VARCHAR2(100), Address VARCHAR2(255), Designation VARCHAR2(50), Contact_no VARCHAR2(15), Salary NUMBER(10,2), Dept_ID INT, FOREIGN KEY (Dept_ID) REFERENCES Department(Dept_ID))` },
      { sql: `CREATE TABLE Customer (Cust_ID INT PRIMARY KEY, Name VARCHAR2(100), Address VARCHAR2(255), Contact_no VARCHAR2(15))` },
      { sql: `CREATE TABLE Account (Account_no INT PRIMARY KEY, Account_type VARCHAR2(50), Balance_available NUMBER(15,2), Opening_date DATE, Branch_ID INT, FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID))` },
      { sql: `CREATE TABLE Customer_Account (Cust_ID INT, Account_no INT, PRIMARY KEY (Cust_ID, Account_no), FOREIGN KEY (Cust_ID) REFERENCES Customer(Cust_ID), FOREIGN KEY (Account_no) REFERENCES Account(Account_no))` },
      { sql: `CREATE TABLE Loan (Loan_ID INT PRIMARY KEY, Loan_type VARCHAR2(50), loan_date DATE, Amount NUMBER(15,2), Duration INT, Installment_pms NUMBER(10,2), Cust_ID INT, Branch_ID INT, FOREIGN KEY (Cust_ID) REFERENCES Customer(Cust_ID), FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID))` },
      { sql: `CREATE TABLE "Transaction" (Trans_ID INT PRIMARY KEY, Transaction_type VARCHAR2(50), Amount NUMBER(15,2), trans_date DATE, Account_no INT, FOREIGN KEY (Account_no) REFERENCES Account(Account_no))` },

      // Seed data
      { sql: `INSERT INTO Branch (Branch_ID, Branch_name, Contact_no, Manager, City, Address) VALUES (1, 'Main Branch', '1234567890', 'Alice Smith', 'Mumbai', '123 Main St, Mumbai')` },
      { sql: `INSERT INTO Branch (Branch_ID, Branch_name, Contact_no, Manager, City, Address) VALUES (2, 'North Branch', '0987654321', 'Bob Johnson', 'Delhi', '456 North St, Delhi')` },
    ];

    for (const stmt of statements) {
      try {
        await db.execute(stmt.sql);
      } catch (err) {
        if (!stmt.ignore) {
          console.error('Init DB error:', err.message);
        }
      }
    }
    res.json({ message: 'Database initialized successfully! Tables created and seed data inserted.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server independently of Database connection so localhost always loads
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Open http://localhost:${PORT} in your browser to view the app`);
});

// Attempt Database Initialization
db.initialize().catch((err) => {
  console.error('\n=======================================');
  console.error('DATABASE CONNECTION ERROR:');
  console.error('We started the server, but failed to connect to Oracle DB:');
  console.error(err.message);
  console.error('=======================================\n');
});

// Handle Shutdown Gracefully
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received. Closing db connection pool.');
  await db.close();
  process.exit(0);
});
process.on('SIGINT', async () => {
  console.log('SIGINT signal received. Closing db connection pool.');
  await db.close();
  process.exit(0);
});
