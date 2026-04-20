import { useState } from 'react';
import {
  Aperture, ArrowLeft, BookOpen, Video, ExternalLink, Code2, Map, FileCode2
} from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import WelcomeBackground from './WelcomeBackground';

const RESOURCE_CATEGORIES = [
  {
    id: 'docs',
    title: 'Documentation & Guides',
    icon: BookOpen,
    accent: '#60a5fa',
    items: [
      { name: 'C++ Reference', desc: 'The definitive C++ documentation.', url: 'https://en.cppreference.com/w/' },
      { name: 'CP-Algorithms', desc: 'Algorithms and Data Structures detailed guides.', url: 'https://cp-algorithms.com/' },
      { name: 'CSES Problem Set', desc: 'A collection of standard algorithm problems.', url: 'https://cses.fi/problemset/' },
      { name: 'USACO Guide', desc: 'A free collection of curated, high-quality competitive programming resources.', url: 'https://usaco.guide/' }
    ]
  },
  {
    id: 'youtube',
    title: 'YouTube Channels',
    icon: FaYoutube,
    accent: '#f43f5e',
    items: [
      { name: 'WilliamFiset', desc: 'High-quality data structures and algorithms videos.', url: 'https://www.youtube.com/user/purpongie' },
      { name: 'Errichto', desc: 'Competitive programming tutorials and livestreams.', url: 'https://www.youtube.com/c/Errichto' },
      { name: 'Colin Galen', desc: 'Tutorials and guides on competitive programming.', url: 'https://www.youtube.com/c/ColinGalen' },
      { name: 'Gaurav Sen', desc: 'System design and algorithmic explanations.', url: 'https://www.youtube.com/c/GauravSensei' }
    ]
  },
  {
    id: 'platforms',
    title: 'Practice Platforms',
    icon: Code2,
    accent: '#10b981',
    items: [
      { name: 'LeetCode', desc: 'Best for interview preparation.', url: 'https://leetcode.com/' },
      { name: 'Codeforces', desc: 'The most popular competitive programming platform.', url: 'https://codeforces.com/' },
      { name: 'AtCoder', desc: 'High-quality Japanese programming contests.', url: 'https://atcoder.jp/' },
      { name: 'CodeChef', desc: 'A global programming community.', url: 'https://www.codechef.com/' }
    ]
  }
];

function ResourceCard({ item, accent, idx }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        background: hovered ? 'rgba(14,20,40,0.95)' : 'rgba(10,14,28,0.7)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? accent + '50' : 'rgba(255,255,255,.07)'}`,
        borderRadius: 16,
        padding: '20px',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered ? `0 16px 40px rgba(0,0,0,.6), 0 0 0 1px ${accent}30, 0 0 40px ${accent}20` : '0 4px 20px rgba(0,0,0,.4)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        animation: `cardIn 0.4s ease both`,
        animationDelay: `${Math.min(idx * 50, 400)}ms`,
      }}
    >
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${accent}, ${accent}66, transparent)`,
        opacity: hovered ? 1 : 0.2,
        transition: 'opacity 0.3s',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h3 style={{
          margin: '0 0 8px', fontSize: 16, fontWeight: 700,
          color: hovered ? '#fff' : '#d8e6ff',
          transition: 'color 0.2s',
        }}>
          {item.name}
        </h3>
        <ExternalLink size={16} color={hovered ? accent : '#4a5a7a'} style={{ transition: 'color 0.2s' }} />
      </div>

      <p style={{ margin: 0, fontSize: 13, color: '#8899bb', lineHeight: 1.5 }}>
        {item.desc}
      </p>
    </a>
  );
}

export default function Resources({ onBack }) {
  return (
    <div className="app-container dashboard-bg" style={{ minHeight: '100vh' }}>
      <WelcomeBackground />

      {/* Header */}
      <header className="intl-header" style={{ zIndex: 50 }}>
        <button className="back-btn" onClick={onBack}><ArrowLeft size={14} style={{ marginRight: 4 }} />Back</button>
        <div className="logo center-logo">
          <Aperture className="logo-icon glow-icon" color="#e0e0e0" />
          <span className="logo-text">CONTEST <span className="logo-accent">HUB</span></span>
        </div>
        <div className="header-placeholder" />
      </header>

      <main style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* Hero */}
        <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(96,165,250,.1)', border: '1px solid rgba(96,165,250,.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 22 }}>
            <Map size={12} color="#60a5fa" />
            <span style={{ fontSize: 11, color: '#60a5fa', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Learning Hub</span>
          </div>

          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, color: '#fff', margin: '0 0 14px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            CP{' '}
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa, #10b981, #f43f5e)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 24px rgba(96,165,250,0.5))',
            }}>
              Resources
            </span>
          </h1>
          <p style={{ color: '#6b7a99', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Master algorithms and data structures with our hand-picked collection of tutorials, documentation, and channels.
          </p>
        </div>

        {/* Categories */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
          {RESOURCE_CATEGORIES.map(category => (
             <section key={category.id}>
               <h2 style={{
                 display: 'flex', alignItems: 'center', gap: 10,
                 fontSize: 20, fontWeight: 800, color: '#f0f4ff',
                 margin: '0 0 20px', paddingBottom: 10,
                 borderBottom: `1px solid rgba(255,255,255,0.06)`
               }}>
                 <category.icon size={22} color={category.accent} />
                 {category.title}
               </h2>

               <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 20 }}>
                 {category.items.map((item, i) => (
                   <ResourceCard key={item.name} item={item} accent={category.accent} idx={i} />
                 ))}
               </div>
             </section>
          ))}
        </div>

      </main>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
