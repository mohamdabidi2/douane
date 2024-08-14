const express = require('express');
const router = express.Router();
const { getDossierStatistics,getDossierStatsByState ,getDossierStatsByCountry,getWeeklyDossierCount,getDossierStats } = require('../controllers/statController');

router.get('/get/:timeScale', getDossierStatistics);
router.get('/dossiers', getDossierStatsByState);
router.get('/countries', getDossierStatsByCountry);
router.get('/weekly', getWeeklyDossierCount);
router.get('/dossier', getDossierStats);

module.exports = router;
