const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function sign(userId) {
  const secret = process.env.JWT_SECRET || 'dev-insecure';
  return jwt.sign({ id: userId }, secret, { expiresIn: '2d' });
}

const register = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter email and password' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ msg: 'User already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashed });

    const token = sign(user._id);
    return res.status(201).json({ token });
  } catch (err) {
    console.error('Register error:', err.message);
    return res.status(500).json({ msg: 'Something went wrong. Please try again.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ msg: 'Please enter email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // 👇 Specific message for missing user
      return res.status(404).json({ msg: 'User does not exist. Please register.' });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      // 👇 Specific message for wrong password
      return res.status(401).json({ msg: 'Invalid password.' });
    }

    const token = sign(user._id);
    return res.json({ token });
  } catch (err) {
    console.error('Login error:', err.message);
    return res.status(500).json({ msg: 'Unable to login right now. Please try again.' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findById(req.user).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    return res.json(user);
  } catch (err) {
    console.error('Me error:', err.message);
    return res.status(500).json({ msg: 'Failed to load profile' });
  }
};

module.exports = { register, login, me };
