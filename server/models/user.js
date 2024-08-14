const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  nom: { type: String, required: true },
  status: { type: Boolean, required: true ,default:false},
  numphone: { type: String, required: true, unique: true },
  entreprise: { type: String, required: true },
  pays: { type: String, required: true },
  langue: { type: [String], required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  profile: { type: String, enum: ['Transitaire', 'Douane', 'Admin'], required: true },
});

// Hash password before saving


module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
