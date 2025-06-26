const express = require('express');
const path = require('path');
const cors = require('cors')
require('dotenv').config();
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express')
const yaml = require('yamljs')
const swaggerDocs = yaml.load('swagger.yaml')
const app = express()

// LOGS DE DEBUG
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
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

db.sequelize.sync().then(() => console.log('db is ready'));

// Route de test AVANT les autres routes
app.get('/', (req, res) => {
  console.log('Route / appelée');
  res.json({
    message: 'API Sophie Bluel is running!',
    port: process.env.PORT,
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req, res) => {
  console.log('Route /health appelée');
  res.status(200).json({ status: 'OK' });
});

app.use('/api/users', userRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/works', worksRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))

const port = process.env.PORT || 8080;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening on 0.0.0.0:${port}`);
  console.log(`Environment PORT: ${process.env.PORT}`);
});

// Log des erreurs du serveur
server.on('error', (error) => {
  console.error('Server error:', error);
});

module.exports = app;