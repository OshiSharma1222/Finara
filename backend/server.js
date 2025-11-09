const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api', require('./routes/bank'));
app.use('/api', require('./routes/customers'));
app.use('/api', require('./routes/tokens'));
app.use('/api', require('./routes/lending'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Finara Backend API'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Finara API - Blockchain-based Tokenization and Lending Platform',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      deployBank: 'POST /api/deployBank',
      uploadCustomers: 'POST /api/uploadCustomers',
      mintToken: 'POST /api/mintToken',
      lend: 'POST /api/lend',
      banks: 'GET /api/banks',
      customers: 'GET /api/customers/:bankAddress',
      loans: 'GET /api/loans/:bankAddress'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Finara Backend Server running on port ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/health`);
  console.log(`📚 API docs: http://localhost:${PORT}/`);
});

module.exports = app;

