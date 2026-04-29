const fs = require('fs');
const mysql = require('mysql2/promise');

const TIDB_CONFIG = {
  host: 'gateway01.ap-southeast-1.prod.alicloud.tidbcloud.com',
  port: 4000,
  user: '3QYyvYyuzFtwb5t.root',
  password: 'p2U91ppblJPwqGLZ',
  database: 'laptop',
  ssl: {
    rejectUnauthorized: false
  }
};

async function importSQL() {
  try {
    console.log('Connecting to TiDB Cloud...');
    const connection = await mysql.createConnection(TIDB_CONFIG);
    console.log('Connected successfully!');

    // Read database_simple.sql
    console.log('Reading database_simple.sql...');
    const sql1 = fs.readFileSync('database_simple.sql', 'utf8');
    console.log('Executing database_simple.sql...');
    await connection.query(sql1);
    console.log('database_simple.sql executed successfully!');

    // Read products_200.sql
    console.log('Reading products_200.sql...');
    const sql2 = fs.readFileSync('products_200.sql', 'utf8');
    console.log('Executing products_200.sql...');
    await connection.query(sql2);
    console.log('products_200.sql executed successfully!');

    // Read thuoc_tinh_data.sql
    console.log('Reading thuoc_tinh_data.sql...');
    const sql3 = fs.readFileSync('thuoc_tinh_data.sql', 'utf8');
    console.log('Executing thuoc_tinh_data.sql...');
    await connection.query(sql3);
    console.log('thuoc_tinh_data.sql executed successfully!');

    await connection.end();
    console.log('\n✅ All SQL files imported successfully!');
    console.log('Database is now ready to use.');
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

importSQL();
