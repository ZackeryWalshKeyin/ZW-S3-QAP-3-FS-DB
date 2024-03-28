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

// Route handler to fetch records from the database
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM users');
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