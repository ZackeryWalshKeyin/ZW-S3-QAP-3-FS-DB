// routes/userRoutes.js

// Mock data array for users
let users = [
  { id: 1, username: 'user1', email: 'user1@example.com' },
  { id: 2, username: 'user2', email: 'user2@example.com' },
  { id: 3, username: 'user3', email: 'user3@example.com' }
];

// Route handler to get all users
const getAllUsers = (req, res) => {
  res.json(users);
};

// Route handler to get a single user by ID
const getUserById = (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find(user => user.id === userId);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
};

// Route handler to create a new user
const createUser = (req, res) => {
  const { username, email } = req.body;
  const newUser = { id: users.length + 1, username, email };
  users.push(newUser);
  res.status(201).json(newUser);
};

// Export the route handlers
module.exports = {
  getAllUsers,
  getUserById,
  createUser
};