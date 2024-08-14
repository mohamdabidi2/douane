const express = require('express');
const dotenv = require('dotenv');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const authRoute = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const dossierRoutes = require('./routes/dossierRoutes');
const statRoutes = require('./routes/statRoutes');
const authMiddleware = require('./middleware/authMiddleware');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers

// Configure helmet to allow frames and images from specific origins
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'http://localhost:5000'], // Allow images from your server
      frameAncestors: ["'self'", 'http://localhost:3000'],
      connectSrc: ["'self'", 'http://localhost:3000'], // Allow connections from your client
    },
  })
);

// Enable CORS to allow requests from 'http://localhost:3000'
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
}));

app.use(express.json()); // Parse JSON bodies

// Serve static files from the 'uploads' directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/user', userRoutes);
app.use('/api/dossier', dossierRoutes);
app.use('/api/stat', statRoutes);

app.get('/api/protected', authMiddleware, (req, res) => {
  res.send('This is a protected route');
});

app.get('/', (req, res) => {
  res.send('Hello, secure world!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
