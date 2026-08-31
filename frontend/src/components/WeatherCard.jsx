import React from 'react';
import { Award, Droplets, Wind, Gauge, Eye } from 'lucide-react';

const WeatherCard = ({ city }) => {
    // Rank badge styles
    const getRankBadge = (rank) => {
        if (rank === 1) return { class: 'gold', label: 'Rank #1' };
        if (rank === 2) return { class: 'silver', label: 'Rank #2' };
        if (rank === 3) return { class: 'bronze', label: 'Rank #3' };
        return { class: 'standard', label: `Rank #${rank}` };
    };

    const badge = getRankBadge(city.rank);

    // Safe data access (handles both direct properties and nested weather objects)
    const temp = city.temperature ?? city.weather?.temperature ?? 0;
    const desc = city.description ?? city.weather?.description ?? 'N/A';
    const humidity = city.humidity ?? city.weather?.humidity ?? 0;
    const windSpeed = city.windSpeed ?? city.weather?.windSpeed ?? 0;
    const pressure = city.pressure ?? city.weather?.pressure ?? 0;
    const visibility = city.visibility ?? city.weather?.visibility;
    const icon = city.icon ?? city.weather?.icon ?? '01d';
    const score = city.comfortScore ?? city.score ?? 0;

    return (
        <div className={`weather-card ${city.rank <= 3 ? 'top-performer' : ''}`}>
            <div className="card-header">
                <div className="city-info">
                    <h2>{city.cityName || city.name}</h2>
                    <span className="country-tag">{city.country || 'Global'}</span>
                </div>
                <div className={`rank-badge ${badge.class}`}>
                    <Award size={14} />
                    <span>{badge.label}</span>
                </div>
            </div>

            <div className="weather-main">
                <img
                    src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
                    alt={desc}
                    className="weather-icon-img"
                />
                <div>
                    <div className="temp-val">{temp}°C</div>
                    <div className="weather-desc">{desc}</div>
                </div>
            </div>

            <div className="weather-details">
                <div className="detail-item">
                    <Droplets size={16} />
                    <span>Humidity: <strong>{humidity}%</strong></span>
                </div>
                <div className="detail-item">
                    <Wind size={16} />
                    <span>Wind: <strong>{windSpeed} m/s</strong></span>
                </div>
                <div className="detail-item">
                    <Gauge size={16} />
                    <span>Pressure: <strong>{pressure} hPa</strong></span>
                </div>
                {visibility !== undefined && (
                    <div className="detail-item">
                        <Eye size={16} />
                        <span>Visibility: <strong>{(visibility / 1000).toFixed(1)} km</strong></span>
                    </div>
                )}
            </div>

            <div className="comfort-meter">
                <div className="comfort-header">
                    <span>Comfort Index</span>
                    <span className="comfort-value">{score}/100</span>
                </div>
                <div className="progress-bar-bg">
                    <div
                        className="progress-bar-fill"
                        style={{ width: `${score}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default WeatherCard;