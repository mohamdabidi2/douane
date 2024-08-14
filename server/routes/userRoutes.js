const express = require('express');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { getUser, updateUser, deleteUser,getAllUsers,updateUserStatus } = require('../controllers/userController');

const router = express.Router();

// Get user details
router.get('/', authMiddleware, getUser);
router.get('/all', authMiddleware, getAllUsers);

// Update user details
router.put('/', [
  authMiddleware,
  check('nom', 'Nom is required').not().isEmpty(),
  check('numphone', 'Numphone is required').not().isEmpty(),
  check('entreprise', 'Entreprise is required').not().isEmpty(),
  check('pays', 'Pays is required').not().isEmpty(),
  check('langue', 'Langue is required').isArray(),
  check('email', 'Please include a valid email').isEmail(),

], updateUser);
router.put('/:id', authMiddleware, updateUserStatus);
// Delete user
router.delete('/', authMiddleware, deleteUser);

module.exports = router;
