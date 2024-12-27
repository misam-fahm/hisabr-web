import mysql, { Pool, RowDataPacket } from 'mysql2';

let pool: Pool | undefined;
interface StoredProcedureParams {
  procedureName: string;
  jsonData: Record<string, any>; // Can be any object, as it's a JSON payload
}

const createPool = (): void => {
  pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,  // Maximum number of connections in the pool
    queueLimit: 0,
  });
};

export const getPool = (): Pool => {
  if (!pool) {
    createPool();
  }
  return pool!;
};

// Common function to call any stored procedure with JSON stringified input
export const callStoredProcedure = ({ procedureName, jsonData }: StoredProcedureParams
): Promise<RowDataPacket[]> => {
  const pool = getPool();
  return new Promise((resolve, reject) => {
    // Store the procedure call as a SQL query
    const sql: string = `CALL ${procedureName}(?)`;  // Assuming only one JSON parameter

    // Convert JSON object to a string (to pass as a single parameter)    
    const jsonString: string = JSON.stringify(jsonData);
    pool.query(sql, [jsonString], (err: Error | null, results: RowDataPacket[]) => {
      if (err) {
        console.log(err);
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};