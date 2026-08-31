import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

/**
 * Fetch all ranked cities with weather analytics and comfort scores
 */
export const fetchWeatherAnalytics = async () => {
    const response = await axios.get(`${API_BASE_URL}/weather`);
    return response.data;
};

/**
 * Fetch cache status for debugging
 */
export const fetchCacheStatus = async () => {
    const response = await axios.get(`${API_BASE_URL}/weather/cache-status`);
    return response.data;
};