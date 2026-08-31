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

    const fileData = fs.readFileSync(citiesFilePath, 'utf-8');
    const citiesList = JSON.parse(fileData).List;

    const weatherList = [];
    let hitsCount = 0;
    let missesCount = 0;

    for (const city of citiesList) {
        const cacheKey = `weather_${city.CityCode}`;
        let cityWeatherData = weatherCache.get(cacheKey);

        if (cityWeatherData) {
            hitsCount++;
        } else {
            missesCount++;
            const url = `https://api.openweathermap.org/data/2.5/weather?id=${city.CityCode}&appid=${apiKey}&units=metric`;
            const response = await axios.get(url);
            cityWeatherData = response.data;

            weatherCache.set(cacheKey, cityWeatherData, 300);
        }

        const temp = cityWeatherData.main.temp;
        const humidity = cityWeatherData.main.humidity;
        const windSpeed = cityWeatherData.wind.speed;
        const pressure = cityWeatherData.main.pressure;
        const visibility = cityWeatherData.visibility;
        const comfortScore = calculateComfortScore(temp, humidity, windSpeed);

        weatherList.push({
            cityId: cityWeatherData.id,
            cityName: cityWeatherData.name,
            country: cityWeatherData.sys.country,
            weatherDescription: cityWeatherData.weather[0]?.description || 'Clear Sky',
            weatherIcon: cityWeatherData.weather[0]?.icon || '01d',
            temperature: temp,
            humidity: humidity,
            windSpeed: windSpeed,
            pressure: pressure,
            visibility: visibility,
            comfortScore: comfortScore
        });
    }

    weatherList.sort((a, b) => b.comfortScore - a.comfortScore);

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