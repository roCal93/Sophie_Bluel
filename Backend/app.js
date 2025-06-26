const express = require('express');
const path = require('path');
const cors = require('cors')
require('dotenv').config();
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('swagger.yaml')
const app = express()

// DEBUG ENVIRONNEMENT
console.log('=== STARTING APPLICATION ===');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT from env:', process.env.PORT);
console.log('PORT type:', typeof process.env.PORT);
console.log('===========================');

// LOGS DE DEBUG
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Middleware de timeout
app.use((req, res, next) => {
  res.setTimeout(120000); // 2 minutes
  next();
});

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use('/images', express.static(path.join(__dirname, 'images')))

const db = require("./models");
const userRoutes = require('./routes/user.routes');
const categoriesRoutes = require('./routes/categories.routes');
const worksRoutes = require('./routes/works.routes');

// Route de test AVANT les autres routes
app.get('/', (req, res) => {
  console.log('Route / appelée');
  res.json({
    message: 'API Sophie Bluel is running!',
    port: process.env.PORT || 8080,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  console.log('Route /health appelée');
  res.status(200).json({
    status: 'OK',
    port: process.env.PORT || 8080,
    pid: process.pid
  });
});

app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

// Middleware de gestion d'erreur
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

// IMPORTANT: Utiliser parseInt pour s'assurer que le port est un nombre
const port = parseInt(process.env.PORT) || 8080;

// Attendre que la DB soit prête AVANT de démarrer le serveur
db.sequelize.sync()
  .then(() => {
    console.log('✅ Database is ready');

    // Démarrer le serveur sans spécifier l'host pour Railway
    const server = app.listen(port, () => {
      console.log('✅ Server is running!');
      console.log(`✅ Listening on port: ${port}`);
      console.log(`✅ Process PID: ${process.pid}`);

      // Log périodique pour vérifier que le serveur est toujours actif
      setInterval(() => {
        console.log(`[${new Date().toISOString()}] Health check - Server running on port ${port}`);
      }, 60000); // Toutes les minutes
    });

    // Gestionnaire d'erreur du serveur
    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use`);
      }
      process.exit(1);
    });

    // Gestionnaire de fermeture gracieuse
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, closing server...');
      server.close(() => {
        console.log('Server closed');
        db.sequelize.close();
        process.exit(0);
      });
    });
  })
  .catch(err => {
    console.error('❌ Database sync error:', err);
    process.exit(1);
  });

// Gestion des erreurs non capturées
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

module.exports = app;