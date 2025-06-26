
import React from 'react';
import logo from '../assets/logo.png';
import './Header.css';

const Header = () => {
    return (
        <header className="app-header">
            <div className="container p-0">
                <div className="header-content">
                    <img src={logo} alt="Logo" className="header-logo" />
                    <h1 className="header-title">Sistema de Inspeção</h1>
                </div>
            </div>
        </header>
    );
};

export default Header;