import pkg from 'pg';
import 'dotenv/config'
// const { Pool } = pkg;

// const pool = new Pool({   // connection setuo no explicit .connect()
//     user: process.env.PGUSER,
//     host: process.env.PGHOST,
//     database: process.env.PGDATABASE,
//     password: process.env.PGPASSWORD,
//     port: process.env.PGPORT ? Number(process.env.PGPORT) : 5432,
// });


const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});
pool.on("connect", () => {
  console.log("DB connected");
});



export default pool;

//Pool creates multiple simultaneous connections so app can handle multiple queries at once.