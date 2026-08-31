const fs = require('fs');
const path = require('path');
const axios = require('axios');
const weatherCache = require('../config/cache');
const { calculateComfortScore } = require('./comfortIndexService');

const citiesFilePath = path.join(__dirname, '../../data/cities.json');

const getAllCitiesWeatherAnalytics = async () => {
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
        throw new Error('OPENWEATHER_API_KEY is missing in .env');
    }

    // 1. Read cities.json file
    const fileData = fs.readFileSync(citiesFilePath, 'utf-8');
    const citiesList = JSON.parse(fileData).List;

    const weatherList = [];
    let hitsCount = 0;
    let missesCount = 0;

    // 2. Loop through each city
    for (const city of citiesList) {
        const cacheKey = `weather_${city.CityCode}`;
        let cityWeatherData = weatherCache.get(cacheKey);

        // Check cache first
        if (cityWeatherData) {
            hitsCount++;
        } else {
            // If not in cache, fetch from OpenWeatherMap API
            missesCount++;
            const url = `https://api.openweathermap.org/data/2.5/weather?id=${city.CityCode}&appid=${apiKey}&units=metric`;
            const response = await axios.get(url);
            cityWeatherData = response.data;

            // Save to cache for 5 minutes (300 seconds)
            weatherCache.set(cacheKey, cityWeatherData, 300);
        }

        // 3. Calculate Comfort Score (0 - 100)
        const temp = cityWeatherData.main.temp;
        const humidity = cityWeatherData.main.humidity;
        const windSpeed = cityWeatherData.wind.speed;
        const comfortScore = calculateComfortScore(temp, humidity, windSpeed);

        // 4. Push formatted object to array
        weatherList.push({
            cityId: cityWeatherData.id,
            cityName: cityWeatherData.name,
            country: cityWeatherData.sys.country,
            weatherDescription: cityWeatherData.weather[0]?.description || 'N/A',
            weatherIcon: cityWeatherData.weather[0]?.icon || '',
            temperature: temp,
            humidity: humidity,
            windSpeed: windSpeed,
            comfortScore: comfortScore
        });
    }

    // 5. Sort cities by Comfort Score (High to Low)
    weatherList.sort((a, b) => b.comfortScore - a.comfortScore);

    // 6. Assign Rank Position (1, 2, 3...)
    const rankedCities = weatherList.map((item, index) => ({
        rank: index + 1,
        ...item
    }));

    return {
        meta: {
            totalCities: rankedCities.length,
            cacheHits: hitsCount,
            cacheMisses: missesCount
        },
        data: rankedCities
    };
};

module.exports = {
    getAllCitiesWeatherAnalytics
};