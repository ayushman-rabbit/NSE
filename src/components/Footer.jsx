import React from 'react';
import rabbitLogo from '../assets/download.png';

export default function Footer() {
  return (
    <footer className="footer-sticky">
      <div className="rabbit-logo-container">
        <span className="powered-text">
          POWERED BY <br/> RABBIT INVEST
        </span>
        <div className="rabbit-logo-wrapper">
          <img 
            src={rabbitLogo} 
            alt="Rabbit Invest" 
          />
        </div>
      </div>
    </footer>
  );
}
