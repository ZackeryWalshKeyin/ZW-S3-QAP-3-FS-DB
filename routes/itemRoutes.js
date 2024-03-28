// routes/itemsRoutes.js

// Route handler to get all items
const getAllItems = (req, res) => {
  res.json(items);
};

// Export the route handler
module.exports = {
  getAllItems
};