const express = require('express');
const { check } = require('express-validator');
const { register, login } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register
router.post('/register', [
  check('nom', 'Nom is required').not().isEmpty(),
  check('numphone', 'Numphone is required').not().isEmpty(),
  check('entreprise', 'Entreprise is required').not().isEmpty(),
  check('pays', 'Pays is required').not().isEmpty(),
  check('langue', 'Langue is required').isArray(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
  check('profile', 'Profile is required and must be one of [Transitaire, Douane]').isIn(['Transitaire', 'Douane', 'Admin']),
], register);

// Login
router.post('/login', login);
router.get('/validate-token', authMiddleware, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;
