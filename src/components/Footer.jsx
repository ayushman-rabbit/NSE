import React from 'react';
import rabbitLogo from '../assets/download.png';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="rabbit-logo-container" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <img 
          src={rabbitLogo} 
          alt="Rabbit Invest Logo" 
          style={{ height: '32px', width: 'auto', objectFit: 'contain' }} 
        />
        <span style={{ fontSize: '0.85rem', fontWeight: '700', letterSpacing: '0.05em', color: '#475569' }}>
          POWERED BY RABBIT INVEST
        </span>
      </div>
    </footer>
  );
}
