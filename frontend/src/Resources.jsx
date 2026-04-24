import { useState, useEffect } from 'react';
import {
  Aperture, ArrowLeft, BookOpen, ExternalLink,
  Code2, Map, Loader2
} from 'lucide-react';
import { FaYoutube } from 'react-icons/fa';
import WelcomeBackground from './WelcomeBackground';

const ICON_MAP = {
  BookOpen,
  FaYoutube,
  Code2,
  Map,
};

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
        boxShadow: hovered
          ? `0 16px 40px rgba(0,0,0,.6), 0 0 0 1px ${accent}30, 0 0 40px ${accent}20`
          : '0 4px 20px rgba(0,0,0,.4)',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        animation: 'cardIn 0.4s ease both',
        animationDelay: `${Math.min(idx * 50, 400)}ms`,
      }}
    >
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0,
        height: 3,
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
        <ExternalLink
          size={16}
          color={hovered ? accent : '#4a5a7a'}
          style={{ transition: 'color 0.2s', flexShrink: 0 }}
        />
      </div>

      <p style={{ margin: 0, fontSize: 13, color: '#8899bb', lineHeight: 1.5 }}>
        {item.desc}
      </p>
    </a>
  );
}

export default function Resources({ onBack }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

  useEffect(() => {
    fetch(`${API_URL}/api/resources`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch resources');
        return res.json();
      })
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="app-container dashboard-bg" style={{ minHeight: '100vh' }}>
      <WelcomeBackground />

      <header className="intl-header" style={{ zIndex: 50 }}>
        <button className="back-btn" onClick={onBack}>
          <ArrowLeft size={14} style={{ marginRight: 4 }} />
          Back
        </button>

        <div className="logo center-logo">
          <Aperture className="logo-icon glow-icon" color="#e0e0e0" />
          <span className="logo-text">
            CONTEST <span className="logo-accent">HUB</span>
          </span>
        </div>

        <div className="header-placeholder" />
      </header>

      <main style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: 1100,
        margin: '0 auto',
        padding: '0 24px 80px',
        width: '100%',
        boxSizing: 'border-box',
      }}>
        <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'rgba(96,165,250,.1)',
            border: '1px solid rgba(96,165,250,.25)',
            borderRadius: 20,
            padding: '5px 16px',
            marginBottom: 22,
          }}>
            <Map size={12} color="#60a5fa" />
            <span style={{
              fontSize: 11,
              color: '#60a5fa',
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase'
            }}>
              Learning Hub
            </span>
          </div>

          <h1 style={{
            fontSize: '3.2rem',
            fontWeight: 800,
            color: '#fff',
            margin: '0 0 14px',
            letterSpacing: '-1.5px',
            lineHeight: 1.1
          }}>
            CP{' '}
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa, #10b981, #f43f5e)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 24px rgba(96,165,250,0.5))',
            }}>
              Resources
            </span>
          </h1>

          <p style={{
            color: '#6b7a99',
            fontSize: 15,
            maxWidth: 520,
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            Master algorithms and data structures with our hand-picked collection
            of tutorials, documentation, and channels.
          </p>
        </div>

        {loading && (
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 200,
            gap: 12,
            color: '#6b7a99'
          }}>
            <Loader2 size={22} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Loading resources…</span>
          </div>
        )}

        {error && (
          <div style={{
            textAlign: 'center',
            padding: 40,
            color: '#f43f5e',
            background: 'rgba(244,63,94,0.08)',
            borderRadius: 16,
            border: '1px solid rgba(244,63,94,0.2)'
          }}>
            ⚠️ {error}
          </div>
        )}

        {!loading && !error && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
            {categories.map((category) => {
              const IconComponent = ICON_MAP[category.icon];
              return (
                <section key={category.id}>
                  <h2 style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    fontSize: 20,
                    fontWeight: 800,
                    color: '#f0f4ff',
                    margin: '0 0 20px',
                    paddingBottom: 10,
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                  }}>
                    {IconComponent && <IconComponent size={22} color={category.accent} />}
                    {category.title}
                  </h2>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: 20
                  }}>
                    {category.items.map((item, i) => (
                      <ResourceCard
                        key={item.name}
                        item={item}
                        accent={category.accent}
                        idx={i}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </main>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}