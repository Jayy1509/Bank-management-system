const oracledb = require('oracledb');
const path = require('path');

// Initialize Oracle Thick Client (required for Native Network Encryption)
try {
  oracledb.initOracleClient({ libDir: path.join(__dirname, '..', 'instantclient_23_4') });
  console.log('Oracle Thick Client initialized successfully.');
} catch (err) {
  console.error('Failed to initialize Oracle Thick Client:', err.message);
}

// Configure Oracle DB options
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
oracledb.autoCommit = true;

const dbConfig = {
  user: process.env.DB_USER || "JAYRANA15092005_SCHEMA_04R81",
  password: process.env.DB_PASSWORD || "QP05fSTLRKXUKVWG!8QBSIZTNBE7EY",
  connectString: process.env.DB_CONNECT_STRING || "db.freesql.com:1521/23ai_34ui2"
};

let pool = null;

// Initialize connection pool with retry
async function initialize() {
  const MAX_RETRIES = 3;
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      pool = await oracledb.createPool({
        ...dbConfig,
        poolMin: 0,
        poolMax: 5,
        poolIncrement: 1,
        poolTimeout: 120,
        queueTimeout: 120000,
        transportConnectTimeout: 60
      });
      console.log('Oracle DB Connection Pool Started successfully!');
      return;
    } catch (err) {
      console.error(`Pool creation attempt ${attempt}/${MAX_RETRIES} failed:`, err.message);
      if (attempt < MAX_RETRIES) {
        console.log('Retrying in 5 seconds...');
        await new Promise(r => setTimeout(r, 5000));
      }
    }
  }
  console.error('All pool creation attempts failed. Will use standalone connections.');
}

// Close pool on shutdown
async function close() {
  if (pool) {
    try {
      await pool.close(10);
      console.log('Oracle DB Connection Pool Closed');
    } catch (err) {
      console.error('Error closing pool:', err.message);
    }
  }
}

// Get a connection - from pool if available, otherwise standalone
async function getConnection() {
  if (pool) {
    try {
      return await pool.getConnection();
    } catch (err) {
      console.log('Pool connection failed, trying standalone:', err.message);
    }
  }
  // Fallback: standalone connection
  return await oracledb.getConnection(dbConfig);
}

// Run a query
async function execute(sql, binds = [], options = {}) {
  let connection;
  try {
    connection = await getConnection();
    const result = await connection.execute(sql, binds, options);
    return result;
  } catch (err) {
    console.error('Database Error:', err.message);
    throw err;
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error closing connection:', err.message);
      }
    }
  }
}

module.exports = {
  initialize,
  close,
  execute,
  getConnection,
  oracledb
};
