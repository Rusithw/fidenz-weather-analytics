require('dotenv').config();
const express = require('express');
const cors = require('cors');
const weatherRoutes = require('./routes/weatherRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/weather', weatherRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', timestamp: new Date() });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: err.message || 'Something broke on the server!'
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`========================================`);
    console.log(` Server is running on: http://localhost:${PORT}`);
    console.log(` Health Check: http://localhost:${PORT}/health`);
    console.log(` Weather API: http://localhost:${PORT}/api/weather`);
    console.log(` Cache Debug: http://localhost:${PORT}/api/weather/cache-status`);
    console.log(`========================================`);
});