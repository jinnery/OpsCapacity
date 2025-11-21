const mysql = require('mysql2/promise');

// Database configuration
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'capacity_monitoring',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log('Database connected successfully');
    connection.release();
  } catch (error) {
    console.error('Database connection failed:', error);
  }
};

// Example query function for future use
const queryMetrics = async (conditions = {}) => {
  try {
    let query = 'SELECT * FROM metrics_daily WHERE 1=1';
    const params = [];

    if (conditions.componentType) {
      query += ' AND component_type = ?';
      params.push(conditions.componentType);
    }

    if (conditions.isSaturated !== undefined) {
      query += ' AND is_saturated = ?';
      params.push(conditions.isSaturated);
    }

    if (conditions.minDaysToSaturation) {
      query += ' AND days_to_saturation <= ?';
      params.push(conditions.minDaysToSaturation);
    }

    query += ' ORDER BY days_to_saturation ASC';

    const [rows] = await pool.execute(query, params);
    return rows;
  } catch (error) {
    console.error('Error querying metrics:', error);
    throw error;
  }
};

module.exports = {
  pool,
  testConnection,
  queryMetrics
};