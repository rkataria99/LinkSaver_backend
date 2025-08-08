const express = require('express');
const router = express.Router();

const auth = require('../middleware/authMiddleware'); // existing Bearer token check
const { register, login, me } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/me
router.get('/me', auth, me);

module.exports = router;
