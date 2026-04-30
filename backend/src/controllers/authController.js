import pool from "../config/db.js"; //default
import {
  register as registerQuery,
  login as loginQuery,
} from "../db/queries.js"; //named
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const verify = (req, res) => {
  res.json({ id: req.user.userId });
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const salt = 10;
    const hash = await bcrypt.hash(password, salt);
    const result = await pool.query(registerQuery, [username, email, hash]);

    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === "23505") {
      // unique contraint violation  => 23505
      res.status(400).json({ error: "Email already exists" });
      return;
    }

    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    const result = await pool.query(loginQuery, [email]);
    const user = result.rows[0];
    /*
        {
            command: 'SELECT',       // the SQL command executed
            rowCount: 1,             // number of rows returned
            oid: null,               // object id for inserts (usually null for SELECT)
            rows: [ {...}, ... ],    // **array of result rows** <----- we need
            fields: [ ... ],         // metadata about columns
            _parsers: [ ... ],
            _types: ...,
            RowCtor: ...,
            rowAsArray: false
            }
        */

    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // compare hashed password
    const isMatch = await bcrypt.compare(password, user.hashed_pwd);
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
};
