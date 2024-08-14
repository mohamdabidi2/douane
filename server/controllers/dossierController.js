const Dossier = require('../models/Dossier');
const fs = require('fs');
const path = require('path');

// Create a new Dossier with file uploads
const createDossier = async (req, res) => {
  const { nom, prenom, numphone, entreprise, typeDossier } = req.body;

  try {
    let dossier = new Dossier({
      user: req.user.id,
      nom,
      prenom,
      numphone,
      entreprise,
      typeDossier,
      fichiers: []
    });

    await dossier.save();

    const uploadPath = path.join('uploads', req.user.id.toString(), dossier._id.toString());
    fs.mkdirSync(uploadPath, { recursive: true });

    req.files.forEach(file => {
      const filePath = path.join(uploadPath, file.originalname);
      fs.renameSync(file.path, filePath);
      dossier.fichiers.push({ url: filePath });
    });

    await dossier.save();

    res.status(201).json(dossier);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all Dossiers for a user
const getUserDossiers = async (req, res) => {
  try {
    const dossiers = await Dossier.find({ user: req.user.id });
    res.json(dossiers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get all Dossiers (regardless of user)
const getAllDossiers = async (req, res) => {
  try {
    const dossiers = await Dossier.find({});
    res.json(dossiers);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Upload files to a Dossier
const uploadFiles = async (req, res) => {
  const { idDossier } = req.params;

  try {
    const dossier = await Dossier.findById(idDossier);
    if (!dossier) {
      return res.status(404).json({ error: 'Dossier not found' });
    }

    const uploadPath = path.join('uploads', req.user.id.toString(), dossier._id.toString());
    fs.mkdirSync(uploadPath, { recursive: true });

    req.files.forEach(file => {
      const filePath = path.join(uploadPath, file.originalname);
      fs.renameSync(file.path, filePath);
      dossier.fichiers.push({ url: filePath });
    });

    await dossier.save();
    res.json(dossier);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

const editDossier = async (req, res) => {
  const { idDossier } = req.params;
  const { nom, prenom, numphone, entreprise, typeDossier ,informations,etat,dateLimite} = req.body;
  let deletedFiles = req.body.deletedFiles;

  try {
    // Find the dossier
    let dossier = await Dossier.findById(idDossier);
    if (!dossier) {
      return res.status(404).json({ error: 'Dossier not found' });
    }

    // Update dossier fields
    dossier.nom = nom || dossier.nom;
    dossier.prenom = prenom || dossier.prenom;
    dossier.numphone = numphone || dossier.numphone;
    dossier.entreprise = entreprise || dossier.entreprise;
    dossier.typeDossier = typeDossier || dossier.typeDossier;
    dossier.informations=informations || dossier.informations;
    dossier.etat=etat || dossier.etat;
    dossier.dateLimite= dateLimite||dossier.dateLimite

    // Ensure upload path exists
    const uploadPath = path.join('uploads', req.user.id.toString(), dossier._id.toString());
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    // Handle file uploads
    if (req.files && req.files.length) {
      req.files.forEach(file => {
        const filePath = path.join(uploadPath, file.originalname);
        fs.renameSync(file.path, filePath);
        dossier.fichiers.push({ url: filePath, mimetype: file.mimetype });
      });
    }

    // Handle deleted files
    if (deletedFiles) {
      try {
        deletedFiles = JSON.parse(deletedFiles);
        deletedFiles.forEach(url => {
          const fileIndex = dossier.fichiers.findIndex(file => file.url === url);
          if (fileIndex !== -1) {
            dossier.fichiers.splice(fileIndex, 1);
            if (fs.existsSync(url)) {
              fs.unlinkSync(url);
            }
          }
        });
      } catch (parseError) {
        console.error('Error parsing deletedFiles:', parseError.message);
      }
    }

    // Verify existing files and remove non-existent ones
    dossier.fichiers = dossier.fichiers.filter(file => fs.existsSync(file.url));

    // Save updated dossier
    await dossier.save();

    // Create response object
    const response = {
      dossier,
      files: dossier.fichiers.map(file => ({
        url: file.url,
        name: path.basename(file.url),
        type: file.mimetype,
      })),
    };

    // Send response
    res.json(response);
  } catch (err) {
    console.error('Error updating dossier:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a Dossier and its associated files
const deleteDossier = async (req, res) => {
  const { idDossier } = req.params;

  try {
    // Find the dossier to delete
    const dossier = await Dossier.findById(idDossier);
    if (!dossier) {
      return res.status(404).json({ error: 'Dossier not found' });
    }

    // Delete files from the filesystem
    const uploadPath = path.join('uploads', req.user.id.toString(), dossier._id.toString());

    // Delete individual files
    dossier.fichiers.forEach(file => {
      try {
        const filePath = path.join(uploadPath, file.url);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath); // Delete the file
        }
      } catch (err) {
        console.error(`Failed to delete file ${file.url}: ${err.message}`);
      }
    });

    // Delete the folder itself
    try {
      if (fs.existsSync(uploadPath)) {
        fs.rmdirSync(uploadPath, { recursive: true }); // Remove directory and its contents
      }
    } catch (err) {
      console.error(`Failed to delete folder ${uploadPath}: ${err.message}`);
    }

    // Remove the dossier document from the database
    await Dossier.deleteOne({ _id: idDossier });

    res.status(200).json({ message: 'Dossier deleted successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = { createDossier, getUserDossiers, getAllDossiers, uploadFiles, editDossier, deleteDossier };
