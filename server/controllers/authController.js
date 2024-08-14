const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { nom, numphone, entreprise, pays, langue, email, password, profile } = req.body;

  try {
    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'L\'email existe déjà' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Mot de passe haché : ${hashedPassword}`); // Débogage

    // Créer un nouvel utilisateur
    const user = new User({ nom, numphone, entreprise, pays, langue, email, password: hashedPassword, profile });
    await user.save();

    console.log(`Utilisateur enregistré : ${user.email}`); // Débogage

    res.status(201).json({ message: 'Utilisateur enregistré avec succès' });
  } catch (err) {
    console.error(err); // Journaliser l'erreur pour le débogage
    res.status(500).json({ error: 'Erreur lors de l\'enregistrement de l\'utilisateur' });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Trouver l'utilisateur par email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('Utilisateur non trouvé'); // Débogage
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    // Vérifier si le statut de l'utilisateur est vrai
    if (!user.status) {
      console.log('Le statut de l\'utilisateur n\'est pas actif'); // Débogage
      return res.status(403).json({ error: 'Le compte utilisateur n\'est pas actif' });
    }

    console.log(`Utilisateur trouvé : ${user.email}`); // Débogage
    console.log(`Mot de passe haché stocké : ${user.password}`); // Débogage

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Mot de passe invalide'); // Débogage
      return res.status(400).json({ error: 'Identifiants invalides' });
    }

    console.log('Mot de passe correspondant'); // Débogage

    // Générer un jeton JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7h' });

    // Envoyer le jeton dans la réponse
    res.json({ token });
  } catch (err) {
    console.error(err); // Journaliser l'erreur pour le débogage
    res.status(500).json({ error: 'Erreur serveur' });
  }
};

module.exports = { register, login };
