-- database.sql
-- Suitable for Oracle Free SQL (Autonomous DB)

-- Drop existing tables sequentially to avoid ref constraints
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE Transaction CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Loan CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Customer_Account CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Account CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Customer CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Employee CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Department CASCADE CONSTRAINTS';
   EXECUTE IMMEDIATE 'DROP TABLE Branch CASCADE CONSTRAINTS';
EXCEPTION
   WHEN OTHERS THEN
      IF SQLCODE != -942 THEN
         RAISE;
      END IF;
END;
/

-- 1. Create Branch Table
CREATE TABLE Branch (
    Branch_ID INT PRIMARY KEY,
    Branch_name VARCHAR2(100),
    Contact_no VARCHAR2(15),
    Manager VARCHAR2(100),
    City VARCHAR2(50),
    Address VARCHAR2(255)
);

-- 2. Create Department Table
CREATE TABLE Department (
    Dept_ID INT PRIMARY KEY,
    Department_names VARCHAR2(100),
    Contact_no VARCHAR2(15),
    Branch_ID INT,
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
);

-- 3. Create Employee Table
CREATE TABLE Employee (
    Emp_ID INT PRIMARY KEY,
    Name VARCHAR2(100),
    Address VARCHAR2(255),
    Designation VARCHAR2(50),
    Contact_no VARCHAR2(15),
    Salary NUMBER(10, 2),
    Dept_ID INT,
    FOREIGN KEY (Dept_ID) REFERENCES Department(Dept_ID)
);

-- 4. Create Customer Table
CREATE TABLE Customer (
    Cust_ID INT PRIMARY KEY,
    Name VARCHAR2(100),
    Address VARCHAR2(255),
    Contact_no VARCHAR2(15)
);

-- 5. Create Account Table
CREATE TABLE Account (
    Account_no INT PRIMARY KEY,
    Account_type VARCHAR2(50),
    Balance_available NUMBER(15, 2),
    Opening_date DATE,
    Branch_ID INT,
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
);

-- 6. Create Customer_Account Mapping Table (For Joint Accounts)
CREATE TABLE Customer_Account (
    Cust_ID INT,
    Account_no INT,
    PRIMARY KEY (Cust_ID, Account_no),
    FOREIGN KEY (Cust_ID) REFERENCES Customer(Cust_ID),
    FOREIGN KEY (Account_no) REFERENCES Account(Account_no)
);

-- 7. Create Loan Table
CREATE TABLE Loan (
    Loan_ID INT PRIMARY KEY,
    Loan_type VARCHAR2(50),
    loan_date DATE,
    Amount NUMBER(15, 2),
    Duration INT, -- In months
    Installment_pms NUMBER(10, 2),
    Cust_ID INT,
    Branch_ID INT,
    FOREIGN KEY (Cust_ID) REFERENCES Customer(Cust_ID),
    FOREIGN KEY (Branch_ID) REFERENCES Branch(Branch_ID)
);

-- 8. Create Transaction Table
CREATE TABLE Transaction (
    Trans_ID INT PRIMARY KEY,
    Transaction_type VARCHAR2(50),
    Amount NUMBER(15, 2),
    trans_date DATE,
    Account_no INT,
    FOREIGN KEY (Account_no) REFERENCES Account(Account_no)
);

-- Insert dummy data into Branch for testing since Account creation needs it
INSERT INTO Branch (Branch_ID, Branch_name, Contact_no, Manager, City, Address) VALUES (1, 'Main Branch', '1234567890', 'Alice Smith', 'Mumbai', '123 Main St, Mumbai');
INSERT INTO Branch (Branch_ID, Branch_name, Contact_no, Manager, City, Address) VALUES (2, 'North Branch', '0987654321', 'Bob Johnson', 'Delhi', '456 North St, Delhi');

COMMIT;
