const weatherService = require('../services/weatherService');
const weatherCache = require('../config/cache');

/**
 * Main Weather Controller
 */
const getWeatherAnalytics = async (req, res) => {
    try {
        // Call the weather service to process cities and compute Comfort Scores
        const result = await weatherService.getAllCitiesWeatherAnalytics();

        return res.status(200).json({
            success: true,
            meta: result.meta,
            data: result.data
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || 'Internal Server Error while fetching weather analytics'
        });
    }
};

/**
 * Debug Cache Controller
 */
const getCacheStatus = (req, res) => {
    try {
        const keys = weatherCache.keys();
        const stats = weatherCache.getStats();

        return res.status(200).json({
            success: true,
            cacheDetails: {
                totalCachedItems: keys.length,
                cachedKeys: keys,
                hits: stats.hits,
                misses: stats.misses
            }
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Failed to retrieve cache status'
        });
    }
};

module.exports = {
    getWeatherAnalytics,
    getCacheStatus
};