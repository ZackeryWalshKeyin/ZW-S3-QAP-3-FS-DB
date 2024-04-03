const express = require('express');
const bodyParser = require('body-parser')
const { Pool } = require('pg');
const path = require('path');
const router = express.Router();

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true}));
app.use(bodyParser.json());

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

// Function to retrieve a record by its ID from the database
const getRecordById = function(req, res) {
  const id = parseInt(req.params.id);
  const sql = 'SELECT id, username, password FROM users WHERE id = $1';
  dal.query(sql, [id], (error, result) => {
      if (error) {
          throw error;
      } else {
        resolve(result.rows[0]);
  }
 });
};

const updateUser = (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  const sql = 'UPDATE users SET name = $1, email = $2 WHERE id = $3';
  const values = [name, email, id];

  pool.query(sql, values, (error, results) => {
    if (error) {
      console.error('Error updating user:', error);
      res.status(500).send('Error updating user');
      return;
    }
    res.status(200).send(`User modified with ID: ${id}`);
  });
};

app.get('/id', (req, res) => {
  res.render('id.ejs');
});

// Route handler for the /create endpoint
app.get('/create', (req, res) => {
  // Render the create.ejs page
  res.render('create');
});

// Route handler for handling form submission and creating a new record
app.post('/create', async (req, res) => {
  const { name, age, email } = req.body;
  try {
    // Call the createRecord function to insert the new record into the database
    await createRecord(name, age, email);
    // Redirect to the home page or any other appropriate page after successful creation
    res.redirect('/');
  } catch (error) {
    console.error('Error creating record:', error);
    res.status(500).send('Error creating record');
  }
});

// Route handler to fetch records from the database and render the read.ejs template
app.get('/read', async (req, res) => {
  try {
    // Fetch records from the database
    const records = await getAllRecords();

    // Render the read.ejs template with the fetched records
    res.render('read', { records });
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).send('Error fetching records');
  }
});

router.get('/:id', async (req, res) => {
    try{
      let Record = await loginDal.getRecordById(req.params.id)
      if (Record.lenght === 0)
        res.render('norecord')
      else
        res.render('id.ejs', {Record});
    } catch {
      res.render('error')
    };
  });

router.get('/:id/update', async (req, res) => {
  if(debug) console.log('login.Update : ' + req.params.id);
  res.render('update.ejs', {username: req.query.username, theId: req.params.id});
})

router.get('/:id/delete', async (req, res) => {
  if(debug) console.log('login.Update : ' + req.params.id);
  res.render('delete.ejs', {username: req.query.username, theId: req.params.id});
})

// Route handler for rendering the update page with the record data
app.get('/:id/update', async (req, res) => {
  const { id } = req.params;
  try {
    // Retrieve the record by its ID
    const record = await getRecordById(id);
    // Render the update.ejs view and pass the record data to it
    res.render('update', { record });
  } catch (error) {
    console.error('Error fetching record:', error);
    res.status(500).send('Error fetching record');
  }
});

// Route handler for updating a user
app.put('/:id/update', (req, res) => {
  const id = parseInt(req.params.id);
  const { name, email } = req.body;

  pool.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [name, email, id],
    (error, results) => {
      if (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Error updating user');
        return;
      }
      res.status(200).send('User modified with ID: ${id}');
    }
  );
});

// Route handler for rendering the update page
app.get('/update', (req, res) => {
  // Render the update.ejs page
  res.render('update');
});


// Route handler for deleting a record
app.delete('/:id/delete', async (req, res) => {
  const { id } = req.params;
  try {
    // Delete the record by its ID
    await deleteRecordById(id);
    res.send(`Record with ID ${id} deleted successfully`);
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).send('Error deleting record');
  }
});

// Route handler for the /delete endpoint
app.get('/delete', (req, res) => {
  // Render the delete.ejs page
  res.render('delete');
});

// Read (Retrieve) Function
async function getAllRecords() {
  try {
    const result = await pool.query('SELECT * FROM users');
    return result.rows;
  } catch (error) {
    console.Error('Error retrieving records:', error);
    return [];
  }
}

// Create Function
async function createRecord(name, age, email) {
  try {
    const result = await pool.query('INSERT INTO users (name, age, email) VALUES ($1, $2, $3) RETURNING *', [name, age, email]);
    return result.rows[0];
  } catch (error) {
    throw new Error('Error creating record:', error);
  }
}

// Function to delete a record by its ID from the database
async function deleteRecordById(id) {
  try {
    // Query the database to delete the record with the specified ID
    const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [id]);
    // Check if a record was deleted
    if (result.rows.length === 0) {
      throw new Error('Record not found');
    }
    // Return the deleted record
    return result.rows[0];
  } catch (error) {
    throw new Error('Error deleting record by ID:', error);
  }
}

// Route handler to fetch records from the database
app.get('/', async (req, res) => {
  try {
    const records = await getAllRecords();
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

module.exports = {
  getAllRecords,
  getRecordById,
  updateUser,
  deleteRecordById,
  createRecord,
}