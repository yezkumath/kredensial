import sql from "mssql";

const config = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_WORKSHOP_DATABASE as string,
  // password: process.env.DB_PASSWORD_LOCAL as string,
  // server: process.env.DB_SERVER_LOCAL as string,
  // database: process.env.DB_DATABASE_LOCAL as string,
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true, // Change to true for local dev / self-signed certs
  },
};

const configServer = {
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  server: process.env.DB_SERVER as string,
  database: process.env.DB_DATABASE as string,
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true, // Change to true for local dev / self-signed certs
  },
};

export async function getDbConnection() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}

export async function getDbConnectionServer() {
  try {
    const pool = await sql.connect(configServer);
    return pool;
  } catch (err) {
    console.error("Database connection failed:", err);
    throw err;
  }
}
