import sql from "mssql";

const config = {
  user: 'sa',
  password: 'Piolin3113',
  server: 'localhost', 
  database: 'mi_app',
  options: {
    encrypt: false, 
    trustServerCertificate: true, 
  },
  port: 1433
};

let cachedPool = global.mssqlPool;

export async function getPool() {
  try {
    if (cachedPool) {
      return cachedPool;
    }

    const pool = await new sql.ConnectionPool(config).connect();
    
    if (process.env.NODE_ENV === "development") {
      global.mssqlPool = pool;
    }
    
    cachedPool = pool;
    return pool;
  } catch (err) {
    console.error("Database connection failed: ", err);
    throw err;
  }
}

export { sql };