import React from 'react';
import { Trophy, Wind, Droplets, Thermometer } from 'lucide-react';

const WeatherCard = ({ city }) => {
    const getScoreBadgeClass = (score) => {
        if (score >= 75) return 'score-badge high';
        if (score >= 50) return 'score-badge medium';
        return 'score-badge low';
    };

    return (
        <div className="weather-card">
            <div className="card-header">
                <div className="rank-badge">
                    <Trophy size={16} />
                    <span>Rank #{city.rank}</span>
                </div>
                <span className={getScoreBadgeClass(city.comfortScore)}>
                    Comfort: {city.comfortScore}/100
                </span>
            </div>

            <div className="card-body">
                <div className="city-info">
                    <h3>{city.cityName}</h3>
                    <span className="country-code">{city.country}</span>
                </div>

                <div className="weather-status">
                    <img
                        src={`https://openweathermap.org/img/wn/${city.weatherIcon}@2x.png`}
                        alt={city.weatherDescription}
                        className="weather-icon"
                    />
                    <p className="weather-desc">{city.weatherDescription}</p>
                </div>

                <div className="temp-display">
                    <Thermometer size={28} className="temp-icon" />
                    <span className="temp-value">{Math.round(city.temperature)}°C</span>
                </div>

                <div className="weather-metrics">
                    <div className="metric">
                        <Droplets size={16} />
                        <span>Humidity: {city.humidity}%</span>
                    </div>
                    <div className="metric">
                        <Wind size={16} />
                        <span>Wind: {city.windSpeed} m/s</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;