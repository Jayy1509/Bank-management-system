# Rana Bank Management System

This is a complete Bank Management System designed as a web application with an Oracle Free SQL Database backend. 
It meets all the requirements of a College DBMS project, features a modern and premium Vanilla JS UI, an Express server, and Docker deployment capability.

## Features
- **Customers**: Add and View
- **Accounts**: Create new bank accounts linked to branches and owners.
- **Transactions**: Process and view deposits and withdrawals with real-time balance updates.
- **Loans**: Submit and review loan applications.

## Technology Stack
- **Frontend**: Vanilla JS, HTML, CSS (Modern dark mode with Glassmorphism)
- **Backend**: Node.js + Express
- **Database**: Oracle DB (Free SQL Backend)
- **Deployment**: Dockerized for Render

## Local Setup

### 1. Database Initialization
Ensure you have access to your Oracle database. Run the SQL schema from `database.sql` to setup your tables.
The `db.js` is pre-configured with the credentials you provided (JAYRANA15092005_SCHEMA_04R81 on db.freesql.com).

> Note: To initialize the database structure, you can either run the contents of `database.sql` directly using an SQL client (like SQL Developer or SQLcl) and insert dummy records as prompted.

### 2. Run Locally
Prerequisites: Node.js 18+

1. Open terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```
4. Access the web app in your browser at `http://localhost:3000`

## Deployment on Render

This project is fully docker-ready.

1. Push this entire repository (including `frontend`, `backend`, and `Dockerfile`) to a GitHub repository.
2. In your Render Dashboard, click **New** -> **Web Service**.
3. Connect your GitHub repository.
4. Render will automatically detect the `Dockerfile`.
5. Deploy and ensure your database connection string and password continue to work. The node script is completely stateless, therefore relying entirely on your Oracle Database to save records!

Enjoy your DBMS Project!
