import React from 'react';
import './WelcomeBackground.css';

export default function WelcomeBackground() {
  return (
    <div className="wb-container">
      {/* Dense Starfield */}
      <div className="wb-stars"></div>
      
      {/* Animated Aurora Gradients */}
      <div className="wb-aurora wb-aurora-1"></div>
      <div className="wb-aurora wb-aurora-2"></div>
      <div className="wb-aurora wb-aurora-3"></div>

      {/* Futuristic Rings */}
      <div className="wb-rings">
        <div className="wb-ring wb-ring-inner"></div>
        <div className="wb-ring wb-ring-middle"></div>
        <div className="wb-ring wb-ring-outer"></div>
      </div>
    </div>
  );
}
