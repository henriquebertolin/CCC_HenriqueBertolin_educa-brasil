import { Pool } from 'pg';
import dotenv from 'dotenv';
import fs  from 'fs'
import path from 'path';
dotenv.config();
const caBundle = fs.readFileSync(
  path.resolve(__dirname, 'certs/global-bundle.pem')
).toString();
 
export class Database {
    private pool: Pool;

    constructor(){
        this.pool = new Pool({
            connectionString: process.env.CON_STRING,
            ssl: {
                rejectUnauthorized: true,
                ca: caBundle
            }
          //  ssl: { rejectUnauthorized: false }
          //  user: process.env.DB_USER,
          //  password: process.env.DB_PASSWORD
        })
        console.log('a connectiong string: ' +  process.env.CON_STRING)
    }
    async query(text: string, params?: any[]){
        const client = await this.pool.connect();
        try{
            const  result = await client.query(text, params);
            return result;
        } finally {
            client.release();
        }
    }
    async safeQuery(query: string, values: any[] = []): Promise<any> {
    try {
        const result = await db.query(query, values);
        return { success: true, data: result };
    } catch (error: any) {
        return { success: false, error: error.message };
    }
    }

    async close(){
        await this.pool.end();
    }
}

export const db = new Database();