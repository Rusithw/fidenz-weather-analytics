import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Navbar from './components/Navbar';
import WeatherCard from './components/WeatherCard';
import { fetchWeatherAnalytics } from './services/api';
import { Database, AlertCircle, Loader2, ShieldCheck, LogIn } from 'lucide-react';
import './App.css';

function App() {
  const { isAuthenticated, isLoading: authLoading, loginWithRedirect } = useAuth0();
  const [cities, setCities] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
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
      setError('Failed to load weather analytics. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  // Auth0 Loading State
  if (authLoading) {
    return (
      <div className="loading-state full-screen">
        <Loader2 size={48} className="spin text-primary" />
        <p>Authenticating session...</p>
      </div>
    );
  }

  // Not Logged In View (Document Requirement: Only authenticated users can access)
  if (!isAuthenticated) {
    return (
      <div className="login-screen">
        <div className="login-card">
          <ShieldCheck size={56} className="text-primary" />
          <h2>Weather Analytics Dashboard</h2>
          <p>Please log in using your authorized company credentials to view the Weather Comfort Index analytics.</p>
          <button onClick={() => loginWithRedirect()} className="btn-login">
            <LogIn size={20} />
            <span>Log In with Auth0</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar onRefresh={loadData} loading={loading} />

      <main className="dashboard-content">
        {/* Meta & Cache Banner */}
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

        {/* Error View */}
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