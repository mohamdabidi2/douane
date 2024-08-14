const Dossier = require('../models/Dossier');
const User = require('../models/User');
const countries = require('i18n-iso-countries');

// Initialize the country data for the desired language
countries.registerLocale(require('i18n-iso-countries/langs/fr.json')); // French language

const getDossierStatsByCountry = async (req, res) => {
  try {
    const stats = await Dossier.aggregate([
      {
        $lookup: {
          from: 'users', // The collection name for User model
          localField: 'user', // Field in Dossier schema
          foreignField: '_id', // Field in User schema
          as: 'userDetails' // Alias for the joined data
        }
      },
      {
        $unwind: '$userDetails' // Flatten the array from $lookup
      },
      {
        $group: {
          _id: '$userDetails.pays', // Group by country field in User schema
          count: { $sum: 1 } // Count the number of dossiers per country
        }
      },
      {
        $match: { count: { $gt: 0 } } // Filter out countries with a count of 0
      },
      {
        $sort: { count: -1 } // Sort by count in descending order
      },
      {
        $limit: 4 // Limit the result to the first 4 countries
      },
      {
        $project: {
          _id: 0,
          countryCode: '$_id', // Include country code in the output
          count: 1 // Include count in the output
        }
      }
    ]);

    const statsWithCountryNames = stats.map(stat => ({
      country: countries.getName(stat.countryCode, 'fr') || stat.countryCode,
      dossier: stat.count
    }));

    res.status(200).json(statsWithCountryNames);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching dossier statistics by country' });
  }
};

// Function to get dossier statistics
const getDossierStatistics = async (req, res) => {
  try {
    const timeScale = req.params.timeScale;

    let query;
    const now = new Date();

    if (timeScale === 'jour') {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      query = { dateDeSoumission: { $gte: startOfDay } };
    } else if (timeScale === 'semaine') {
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      query = { dateDeSoumission: { $gte: startOfWeek } };
    } else if (timeScale === 'mois') {
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      query = { dateDeSoumission: { $gte: startOfMonth } };
    } else if (timeScale === 'annee') {
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      query = { dateDeSoumission: { $gte: startOfYear } };
    }

    const dossiers = await Dossier.find(query);
    
    const groupedData = dossiers.reduce((acc, dossier) => {
      const date = new Date(dossier.dateDeSoumission);
      let key;

      if (timeScale === 'jour') {
        key = `${date.getHours()}:00`;
      } else if (timeScale === 'semaine') {
        key = date.toLocaleString('fr-FR', { weekday: 'long' });
      } else if (timeScale === 'mois') {
        key = `Semaine ${Math.ceil((date.getDate() + 1) / 7)}`;
      } else if (timeScale === 'annee') {
        key = date.toLocaleString('fr-FR', { month: 'short' });
      }

      if (acc[key]) {
        acc[key].Dossier += 1;
      } else {
        acc[key] = { name: key, Dossier: 1 };
      }

      return acc;
    }, {});

    const result = Object.values(groupedData);

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching dossier statistics' });
  }
};


const getDossierStatsByState = async (req, res) => {
  try {

    // Count documents by state
    const refuseCount = await Dossier.countDocuments({ etat: 'Refusé' });
    const enCoursCount = await Dossier.countDocuments({ etat: 'En attente' });
    const accepteCount = await Dossier.countDocuments({ etat: 'Accepté' });

    // Construct the result object
    const result = {
      'Refusé': refuseCount,
      'En attente': enCoursCount,
      'Accepté': accepteCount
    };

    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching dossier statistics by state' });
  }
};
const getWeeklyDossierCount = async (req, res) => {
  try {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    const count = await Dossier.countDocuments({
      dateDeSoumission: { $gte: startOfWeek }
    });

    res.status(200).json({ count });
  } catch (error) {
    console.error('Error fetching weekly dossier count:', error);
    res.status(500).json({ message: 'Error fetching weekly dossier count' });
  }
};
const getDossierStats = async (req, res) => {
  try {
    // Compter le nombre de dossiers dans chaque état
    const [accepted, refused, waiting] = await Promise.all([
      Dossier.countDocuments({ etat: 'Accepté' }),
      Dossier.countDocuments({ etat: 'Refusé' }),
      Dossier.countDocuments({ etat: 'En attente' }),
    ]);

    // Compter le nombre total de dossiers
    const total = await Dossier.countDocuments();

    // Envoyer les statistiques
    res.json({
      accepted,
      refused,
      waiting,
      total
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des statistiques' });
  }
};
module.exports = {
  getDossierStatistics,
  getDossierStatsByState,
  getDossierStatsByCountry,
  getDossierStats,
  getWeeklyDossierCount
};
