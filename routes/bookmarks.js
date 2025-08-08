const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const {
  createBookmark,
  getBookmarks,
  deleteBookmark,
  updatePositions,
} = require('../controllers/bookmarkController');

// Create
router.post('/', auth, createBookmark);

// List all for current user
router.get('/', auth, getBookmarks);

// Delete by id
router.delete('/:id', auth, deleteBookmark);

// Bulk reorder: [{ _id, position }]
router.put('/reorder', auth, updatePositions);

module.exports = router;
