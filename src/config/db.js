/**
 * Configuración de la conexión a la base de datos MySQL.
 * @module config/db
 */
import mysql from "mysql2/promise";
import dotenv from "dotenv";
import process from "node:process";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "1234",
  database: process.env.DB_NAME || "pp4",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default pool;
