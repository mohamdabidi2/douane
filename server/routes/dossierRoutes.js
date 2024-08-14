const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../config/multer');
const {deleteDossier, createDossier, getUserDossiers, uploadFiles, editDossier,getAllDossiers } = require('../controllers/dossierController');

const router = express.Router();

router.post('/', authMiddleware, upload.array('files', 10), createDossier);
router.get('/', authMiddleware, getUserDossiers);
router.get('/all', authMiddleware, getAllDossiers);
router.post('/upload/:idDossier', authMiddleware, upload.array('files', 10), uploadFiles);
router.put('/:idDossier', authMiddleware, upload.array('files', 10), editDossier);
router.delete('/:idDossier', authMiddleware, deleteDossier);

module.exports = router;
