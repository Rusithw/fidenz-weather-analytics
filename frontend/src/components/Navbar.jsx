import React from 'react';
import { CloudSun, RefreshCw } from 'lucide-react';

const Navbar = ({ onRefresh, loading }) => {
    return (
        <header className="navbar">
            <div className="navbar-brand">
                <CloudSun size={32} className="brand-icon" />
                <div>
                    <h1>Weather Analytics</h1>
                    <p className="subtitle">Comfort Index Dashboard</p>
                </div>
            </div>

            <div className="navbar-actions">
                <button
                    onClick={onRefresh}
                    className="btn-refresh"
                    disabled={loading}
                >
                    <RefreshCw size={16} className={loading ? 'spin' : ''} />
                    <span>{loading ? 'Refreshing...' : 'Refresh Data'}</span>
                </button>
            </div>
        </header>
    );
};

export default Navbar;