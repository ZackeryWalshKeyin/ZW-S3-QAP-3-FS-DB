const express = require('express');
const { Pool } = require('pg');
const path = require('path');

const app = express();
const port = 3000;

// Database connection configuration
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'FS-DB-QAP-3',
  password: 'Keyin2021',
  port: 5433,
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Read (Retrieve) Function
async function getAllRecords() {
  try {
    const result = await pool.query('SELECT * FROM your_table_name');
    return result.rows;
  } catch (error) {
    throw new Error('Error retrieving records:', error);
  }
}

// Create Function
async function createRecord(name, age, email) {
  try {
    const result = await pool.query('INSERT INTO your_table_name (name, age, email) VALUES ($1, $2, $3) RETURNING ', [name, age, email]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Error creating record:', error);
  }
}

// Update Function
async function updateRecord(id, name, age, email) {
  try {
    const result = await pool.query('UPDATE your_table_name SET name = $2, age = $3, email = $4 WHERE id = $1 RETURNING', [id, name, age, email]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Error updating record:', error);
  }
}

// Delete Function
async function deleteRecord(id) {
  try {
    const result = await pool.query('DELETE FROM your_table_name WHERE id = $1 RETURNING *', [id]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Error deleting record:', error);
  }
}

// Route handler to fetch records from the database
app.get('/', async (req, res) => {
  try {
    const result = await getAllRecords('SELECT * FROM users');
    const records = result.rows;
    res.render('index', { records });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});