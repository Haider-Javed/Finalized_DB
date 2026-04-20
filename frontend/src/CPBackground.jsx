import React from 'react';
import './CPBackground.css';

const floatingItems = [
  { text: '{ }', size: '2rem', left: '10%', animDuration: '15s', delay: '0s', opacity: 0.2 },
  { text: '</>', size: '1.8rem', left: '30%', animDuration: '18s', delay: '2s', opacity: 0.15 },
  { text: 'O(N log N)', size: '1.2rem', left: '75%', animDuration: '22s', delay: '1s', opacity: 0.25 },
  { text: '0101', size: '1.5rem', left: '45%', animDuration: '20s', delay: '5s', opacity: 0.1 },
  { text: '[ ]', size: '2.2rem', left: '85%', animDuration: '14s', delay: '3s', opacity: 0.2 },
  { text: '++', size: '1.5rem', left: '20%', animDuration: '12s', delay: '7s', opacity: 0.3 },
  { text: 'console.log()', size: '1rem', left: '55%', animDuration: '26s', delay: '4s', opacity: 0.2 },
  { text: 'return 0;', size: '1.1rem', left: '15%', animDuration: '28s', delay: '8s', opacity: 0.15 },
  { text: 'DP', size: '2rem', left: '80%', animDuration: '17s', delay: '6s', opacity: 0.1 },
  { text: 'Graph', size: '1.4rem', left: '38%', animDuration: '19s', delay: '9s', opacity: 0.15 },
  { text: 'if (x)', size: '1.1rem', left: '65%', animDuration: '23s', delay: '11s', opacity: 0.2 },
  { text: ';', size: '3.5rem', left: '92%', animDuration: '25s', delay: '0.5s', opacity: 0.1 },
  { text: 'DFS', size: '1.6rem', left: '25%', animDuration: '21s', delay: '4s', opacity: 0.2 },
  { text: 'mod 10^9+7', size: '1.2rem', left: '60%', animDuration: '27s', delay: '2s', opacity: 0.25 }
];

export default function CPBackground() {
  return (
    <div className="cp-bg-container">
      {/* Perspective Grid */}
      <div className="cp-grid-wrapper">
        <div className="cp-grid"></div>
      </div>
      
      {/* Floating Syntax Elements */}
      <div className="cp-particles">
        {floatingItems.map((item, i) => (
          <div
            key={i}
            className="cp-particle"
            style={{
              left: item.left,
              fontSize: item.size,
              animationDuration: item.animDuration,
              animationDelay: item.delay,
              opacity: item.opacity
            }}
          >
            {item.text}
          </div>
        ))}
      </div>
      
      {/* Keep the beautiful vivid glowing orbs underneath */}
      <div className="live-bg"></div>
    </div>
  );
}
