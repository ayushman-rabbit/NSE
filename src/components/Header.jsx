import React from 'react';
import logo from '../assets/NSE_reverse_4x-100-removebg-preview.png';

export default function Header() {
  return (
    <header className="header">
      <div className="logo-section">
        <img src={logo} alt="NSE Logo" style={{ height: '40px', objectFit: 'contain' }} />
      </div>
      
    </header>
  );
}
