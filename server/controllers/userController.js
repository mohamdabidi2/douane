const User = require('../models/User');
const bcrypt = require('bcryptjs');
// Get user details
const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update user details
const updateUser = async (req, res) => {
  const { nom, numphone, entreprise, pays, langue, email, profile, currentPassword, newPassword } = req.body;

  const updatedFields = { nom, numphone, entreprise, pays, langue, email, profile };

  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if current password is provided and matches the user's existing password
    if (currentPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }

      // If new password is provided, hash it and add to updatedFields
      if (newPassword) {
        const salt = await bcrypt.genSalt(10);
        updatedFields.password = await bcrypt.hash(newPassword, salt);
      }
    }

    const updatedUser = await User.findByIdAndUpdate(req.user.id, { $set: updatedFields }, { new: true }).select('-password');
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete user
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user.id);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
const getAllUsers = async (req, res) => {
  try {
    // Check if the requesting user is an Admin
    const requestingUser = await User.findById(req.user.id);
    
    if (requestingUser.profile !== 'Admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Fetch all users except the requesting user
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
const updateUserStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(status)

 
  try {
    // Ensure the requesting user has the proper authorization
    const requestingUser = await User.findById(req.user.id);
    if (requestingUser.profile !== 'Admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    // Find and update the user's status
    const user = await User.findByIdAndUpdate(id, { $set: { status } }, { new: true }).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
module.exports = { getUser, updateUser, deleteUser ,getAllUsers,updateUserStatus};
