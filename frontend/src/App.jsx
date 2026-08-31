import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import WeatherCard from './components/WeatherCard';
import { fetchWeatherAnalytics } from './services/api';
import { Database, AlertCircle, Loader2 } from 'lucide-react';
import './App.css';

function App() {
  const [cities, setCities] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchWeatherAnalytics();
      if (res.success) {
        setCities(res.data);
        setMeta(res.meta);
      }
    } catch (err) {
      console.error(err);
      setError('Backend server එකට සම්බන්ධ වීමට නොහැක. (Make sure backend is running on port 5000)');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="app-container">
      <Navbar onRefresh={loadData} loading={loading} />

      <main className="dashboard-content">
        {meta && (
          <div className="meta-banner">
            <div className="meta-item">
              <Database size={18} />
              <span>Processed Cities: <strong>{meta.totalCities}</strong></span>
            </div>
            <div className="meta-item cache-stats">
              <span>Cache Status: </span>
              <span className="badge hit">HITS: {meta.cacheHits}</span>
              <span className="badge miss">MISSES: {meta.cacheMisses}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        {/* Loading Spinner */}
        {loading && cities.length === 0 ? (
          <div className="loading-state">
            <Loader2 size={40} className="spin" />
            <p>Loading weather analytics...</p>
          </div>
        ) : (
          <div className="weather-grid">
            {cities.map((city) => (
              <WeatherCard key={city.cityId} city={city} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;