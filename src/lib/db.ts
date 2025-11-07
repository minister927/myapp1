// src/lib/db.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'haoyoumes',   // 数据库名加引号
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;