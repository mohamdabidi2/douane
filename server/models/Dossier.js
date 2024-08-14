const mongoose = require('mongoose');

const DossierSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  nom: { type: String, required: true },
  prenom: { type: String, required: true },
  numphone: { type: String, required: true },
  entreprise: { type: String, required: true },
  typeDossier: { type: String, required: true },
  fichiers: [{ url: String }],
  dateDeSoumission: { type: Date, default: Date.now },
  dateLimite: { type: Date },
  etat: { type: String, default: 'En attente', required: true },
  informations: [{ type: String }]
});

DossierSchema.pre('save', function(next) {
  if (!this.dateLimite) {
    this.dateLimite = new Date(this.dateDeSoumission.getTime() + 2 * 24 * 60 * 60 * 1000);
  }
  next();
});
module.exports = mongoose.models.Dossier || mongoose.model('Dossier', DossierSchema);
