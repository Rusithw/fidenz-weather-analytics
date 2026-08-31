import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { CloudSun, RefreshCw, LogOut, User } from 'lucide-react';

const Navbar = ({ onRefresh, loading }) => {
    const { user, isAuthenticated, logout } = useAuth0();

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
                {isAuthenticated && (
                    <>
                        <button
                            onClick={onRefresh}
                            className="btn-refresh"
                            disabled={loading}
                        >
                            <RefreshCw size={16} className={loading ? 'spin' : ''} />
                            <span>{loading ? 'Refreshing...' : 'Refresh'}</span>
                        </button>

                        <div className="user-profile">
                            <User size={16} />
                            <span className="user-email">{user?.email}</span>
                        </div>

                        <button
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                            className="btn-logout"
                        >
                            <LogOut size={16} />
                            <span>Log Out</span>
                        </button>
                    </>
                )}
            </div>
        </header>
    );
};

export default Navbar;