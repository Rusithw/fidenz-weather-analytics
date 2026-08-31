import React from 'react';
import { Award, Droplets, Wind, Gauge, Eye } from 'lucide-react';

const WeatherCard = ({ city }) => {
    const getRankBadge = (rank) => {
        if (rank === 1) return { class: 'gold', label: 'Rank #1' };
        if (rank === 2) return { class: 'silver', label: 'Rank #2' };
        if (rank === 3) return { class: 'bronze', label: 'Rank #3' };
        return { class: 'standard', label: `Rank #${rank}` };
    };

    const badge = getRankBadge(city.rank);
    const iconCode = city.weatherIcon || '01d';
    const description = city.weatherDescription || 'Clear Sky';

    return (
        <div className={`weather-card ${city.rank <= 3 ? 'top-performer' : ''}`}>
            <div className="card-header">
                <div className="city-info">
                    <h2>{city.cityName}</h2>
                    <span className="country-tag">{city.country}</span>
                </div>
                <div className={`rank-badge ${badge.class}`}>
                    <Award size={14} />
                    <span>{badge.label}</span>
                </div>
            </div>

            <div className="weather-main">
                <img
                    src={`https://openweathermap.org/img/wn/${iconCode}@2x.png`}
                    alt={description}
                    className="weather-icon-img"
                    style={{ width: '56px', height: '56px' }}
                />
                <div>
                    <div className="temp-val">{city.temperature}°C</div>
                    <div className="weather-desc">{description}</div>
                </div>
            </div>

            <div className="weather-details">
                <div className="detail-item">
                    <Droplets size={16} />
                    <span>Humidity: <strong>{city.humidity}%</strong></span>
                </div>
                <div className="detail-item">
                    <Wind size={16} />
                    <span>Wind: <strong>{city.windSpeed} m/s</strong></span>
                </div>
                <div className="detail-item">
                    <Gauge size={16} />
                    <span>Pressure: <strong>{city.pressure} hPa</strong></span>
                </div>
                {city.visibility !== undefined && (
                    <div className="detail-item">
                        <Eye size={16} />
                        <span>Visibility: <strong>{(city.visibility / 1000).toFixed(1)} km</strong></span>
                    </div>
                )}
            </div>

            <div className="comfort-meter">
                <div className="comfort-header">
                    <span>Comfort Index</span>
                    <span className="comfort-value">{city.comfortScore}/100</span>
                </div>
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${city.comfortScore}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;