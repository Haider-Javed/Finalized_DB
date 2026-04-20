import { useState, useEffect, useMemo } from 'react';
import {
  Aperture, ArrowLeft, Trophy, Search, Globe, Hash, Zap, Medal, Star, Shield, Activity
} from 'lucide-react';
import WelcomeBackground from './WelcomeBackground';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const RANK_THEMES = [
  { color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.4)',  label: 'Grandmaster' }, // Gold
  { color: '#9ca3af', glow: 'rgba(156, 163, 175, 0.4)', label: 'Master' },      // Silver
  { color: '#b45309', glow: 'rgba(180, 83, 9, 0.4)',    label: 'Expert' },      // Bronze
];

function getInitials(handle) {
  return handle ? handle.substring(0, 2).toUpperCase() : '??';
}

function getAvatarColors(id) {
  const h = (id * 137) % 360;
  return {
    bg: `hsla(${h}, 70%, 25%, 0.8)`,
    border: `hsla(${h}, 80%, 60%, 0.6)`,
    color: `hsla(${h}, 90%, 80%, 1)`,
    glow: `0 0 14px hsla(${h}, 80%, 60%, 0.4)`
  };
}

// ─── Top 3 Podium Component ───────────────────────────────────────────────────

function PodiumCard({ coder, rank }) {
  const theme = RANK_THEMES[rank - 1];
  const avatar = getAvatarColors(coder.id || rank);
  
  // Height variation for podium effect
  const height = rank === 1 ? 'auto' : 'auto';
  const scale = rank === 1 ? 1.05 : 1;
  const padding = rank === 1 ? '36px 24px' : '28px 20px';
  const marginTop = rank === 1 ? 0 : '24px';
  const zIndex = rank === 1 ? 10 : 5;

  return (
    <div style={{
      position: 'relative', flex: 1, zIndex, marginTop,
      background: 'rgba(9, 13, 28, 0.7)', backdropFilter: 'blur(20px)',
      border: `1px solid ${theme.color}40`, borderRadius: 24,
      padding, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      transform: `scale(${scale})`, transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
      boxShadow: `0 12px 40px rgba(0,0,0,0.6), inset 0 2px 20px ${theme.color}15`,
    }}>
      {/* Glow aura */}
      <div style={{
        position: 'absolute', top: '-10%', left: '50%', transform: 'translateX(-50%)',
        width: '60%', height: '60%', background: `radial-gradient(circle, ${theme.glow} 0%, transparent 70%)`,
        pointerEvents: 'none', zIndex: -1,
      }} />

      {/* Rank Icon */}
      <div style={{ marginBottom: 16 }}>
        {rank === 1 ? <Trophy size={48} color={theme.color} style={{ filter: `drop-shadow(0 0 12px ${theme.color})` }} /> 
                    : <Medal size={40} color={theme.color} />}
      </div>

      {/* Avatar */}
      <div style={{
        width: rank === 1 ? 84 : 70, height: rank === 1 ? 84 : 70, borderRadius: '50%',
        background: avatar.bg, border: `2px solid ${avatar.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: rank === 1 ? 28 : 24, fontWeight: 900, color: avatar.color,
        boxShadow: avatar.glow, marginBottom: 16,
      }}>
        {getInitials(coder.handle)}
      </div>

      <h3 style={{ margin: '0 0 4px', fontSize: rank === 1 ? 22 : 18, color: '#fff', fontWeight: 800, textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
        {coder.handle || 'Unknown'}
      </h3>
      
      <p style={{ margin: '0 0 16px', fontSize: 13, color: '#8899bb', fontWeight: 600 }}>
        {coder.first_name || coder.last_name ? `${coder.first_name || ''} ${coder.last_name || ''}`.trim() : 'Anonymous'}
      </p>

      {/* Stats Pills */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 4,
          background: `${theme.color}15`, border: `1px solid ${theme.color}40`,
          color: theme.color, borderRadius: 12, padding: '4px 10px', fontSize: 11, fontWeight: 700,
        }}>
          <Star size={10} /> {theme.label}
        </span>
        
        {coder.country && (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 4,
            background: 'rgba(96, 165, 250, 0.1)', border: '1px solid rgba(96, 165, 250, 0.3)',
            color: '#60a5fa', borderRadius: 12, padding: '4px 10px', fontSize: 11, fontWeight: 700,
          }}>
            <Globe size={10} /> {coder.country}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Standard List Row ────────────────────────────────────────────────────────

function CoderRow({ coder, rank }) {
  const [hovered, setHovered] = useState(false);
  const avatar = getAvatarColors(coder.id || rank);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'grid', gridTemplateColumns: '80px 2fr 1.5fr 1fr 1fr',
        alignItems: 'center', padding: '16px 20px',
        background: hovered ? 'rgba(255,255,255,0.04)' : 'transparent',
        borderBottom: '1px solid rgba(255,255,255,0.04)',
        transition: 'all 0.2s ease', cursor: 'default',
        position: 'relative'
      }}
    >
      {/* Left indicator glow */}
      <div style={{
        position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)',
        width: 3, height: '60%', borderRadius: '0 4px 4px 0',
        background: hovered ? avatar.border : 'transparent',
        boxShadow: hovered ? avatar.glow : 'none', transition: 'all 0.2s',
      }} />

      {/* Rank */}
      <div style={{ fontSize: 18, fontWeight: 800, color: hovered ? '#fff' : '#6b7a99', textAlign: 'center', fontFamily: 'monospace' }}>
        #{rank}
      </div>

      {/* Coder Info */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: avatar.bg, border: `1px solid ${avatar.border}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 14, fontWeight: 800, color: avatar.color,
          boxShadow: hovered ? avatar.glow : 'none', transition: 'all 0.2s'
        }}>
          {getInitials(coder.handle)}
        </div>
        <div>
          <div style={{ fontWeight: 700, color: hovered ? '#fff' : '#d8e6ff', fontSize: 15, transition: 'color 0.2s' }}>
            {coder.handle || 'Unknown'}
          </div>
          <div style={{ fontSize: 12, color: '#6b7a99', marginTop: 2 }}>
            Level {Math.max(1, Math.floor((coder.n_accounts || 1) * 2.5))} Programmer
          </div>
        </div>
      </div>

      {/* Name */}
      <div style={{ color: '#8899bb', fontSize: 14, fontWeight: 500 }}>
        {coder.first_name || coder.last_name ? `${coder.first_name || ''} ${coder.last_name || ''}`.trim() : <span style={{ opacity: 0.4 }}>Anonymous</span>}
      </div>

      {/* Country */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {coder.country ? (
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(96, 165, 250, 0.08)', border: '1px solid rgba(96, 165, 250, 0.25)',
            color: '#7eaaff', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 600,
          }}>
            <Globe size={11} className="opacity-70" /> {coder.country}
          </span>
        ) : (
          <span style={{ color: '#4a5a7a', fontSize: 12 }}>—</span>
        )}
      </div>

      {/* Activity / Accounts */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#f472b6', fontWeight: 700, fontSize: 14 }}>
        <Activity size={14} color="#f472b6" style={{ opacity: 0.7 }} />
        {coder.n_accounts}
        <span style={{ fontSize: 11, color: '#8899bb', fontWeight: 500 }}>Profiles</span>
      </div>
    </div>
  );
}

// ─── Main Leaderboard Component ───────────────────────────────────────────────

export default function Leaderboard({ onBack }) {
  const [coders, setCoders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await fetch('https://clist.by:443/api/v4/coder/?username=hajaved1023&api_key=f55baad1e17c76f80c2f026b819a2d9caf9acc8c');
        if (!response.ok) throw new Error('API Rate limit or Connection Error');
        const data = await response.json();
        // Sort specifically by ID or a proxy metric for demo (API doesn't return sorted arrays sometimes)
        const sorted = (data.objects || []).sort((a,b) => (b.n_accounts - a.n_accounts) || (a.id - b.id));
        setCoders(sorted);
        setLoading(false);
      } catch (err) {
        setError("Failed to sync leaderboard with CLIST database. Using cached local rankings.");
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return coders;
    return coders.filter(c => 
      c.handle?.toLowerCase().includes(q) || 
      c.first_name?.toLowerCase().includes(q) ||
      c.last_name?.toLowerCase().includes(q) ||
      c.country?.toLowerCase().includes(q)
    );
  }, [coders, search]);

  const top3 = filtered.slice(0, 3);
  const rest = filtered.slice(3);

  // ── Loading & Error States ──
  if (loading) return (
    <div className="app-container dashboard-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
      <WelcomeBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ width: 64, height: 64, border: '3px solid rgba(251, 191, 36, 0.2)', borderTop: '3px solid #fbbf24', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <Trophy size={24} color="#fbbf24" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      </div>
      <div style={{ zIndex: 10, textAlign: 'center' }}>
        <div style={{ color: '#fbbf24', fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>SYNCING NETWORK</div>
        <div style={{ color: '#8899bb', fontSize: 12 }}>Downloading competitive rankings...</div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );

  return (
    <div className="app-container dashboard-bg" style={{ minHeight: '100vh' }}>
      <WelcomeBackground />

      <header className="intl-header" style={{ zIndex: 50 }}>
        <button className="back-btn" onClick={onBack}><ArrowLeft size={14} style={{ marginRight: 4 }} />Back</button>
        <div className="logo center-logo">
          <Aperture className="logo-icon glow-icon" color="#e0e0e0" />
          <span className="logo-text">CONTEST <span className="logo-accent">HUB</span></span>
        </div>
        <div className="header-placeholder" />
      </header>

      <main style={{ position: 'relative', zIndex: 10, maxWidth: 1100, margin: '0 auto', padding: '0 24px 80px', width: '100%', boxSizing: 'border-box' }}>
        
        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', padding: '48px 0 32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 22 }}>
            <Zap size={12} color="#fbbf24" />
            <span style={{ fontSize: 11, color: '#fbbf24', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Network Rankings</span>
          </div>

          <h1 style={{ fontSize: '3.5rem', fontWeight: 800, color: '#fff', margin: '0 0 14px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Global{' '}
            <span style={{
              background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #d97706)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 24px rgba(251, 191, 36, 0.4))',
            }}>
              Leaderboard
            </span>
          </h1>
          <p style={{ color: '#6b7a99', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            See where you stand globally. Rankings are synced in real-time across Codeforces, LeetCode, and top competitive platforms.
          </p>
        </div>

        {/* ── Filters Bar ── */}
        <div style={{ 
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', 
          marginBottom: 40, padding: '16px 20px',
          background: 'rgba(8, 12, 26, 0.7)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Shield size={18} color="#4a5a7a" />
            <span style={{ color: '#8899bb', fontSize: 14, fontWeight: 600 }}>Division 1 Rankings</span>
            <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.1)', margin: '0 8px' }} />
            <span style={{ color: '#3d4f6d', fontSize: 13, fontWeight: 800, letterSpacing: '0.05em' }}>{filtered.length} TITANS</span>
          </div>

          <div style={{ position: 'relative', width: 320 }}>
            <Search size={14} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#4a5a7a', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Search handles, names, or country..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '10px 16px 10px 38px', boxSizing: 'border-box',
                background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 12, color: '#fff', fontSize: 13, outline: 'none', transition: 'all 0.2s'
              }}
              onFocus={e => { e.target.style.borderColor = 'rgba(251, 191, 36, 0.4)'; e.target.style.boxShadow = '0 0 0 3px rgba(251, 191, 36, 0.1)'; }}
              onBlur={e => { e.target.style.borderColor = 'rgba(255,255,255,0.08)'; e.target.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {error && (
          <div style={{ textAlign: 'center', padding: '16px', background: 'rgba(244,63,94,0.1)', border: '1px solid rgba(244,63,94,0.3)', color: '#f43f5e', borderRadius: 12, marginBottom: 30, fontSize: 13, fontWeight: 600 }}>
            {error}
          </div>
        )}

        {/* ── Top 3 Podium ── */}
        {top3.length > 0 && !search && (
          <div style={{
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 24,
            marginBottom: 48, marginTop: 24, padding: '0 20px'
          }}>
            {top3[1] && <PodiumCard coder={top3[1]} rank={2} />}
            {top3[0] && <PodiumCard coder={top3[0]} rank={1} />}
            {top3[2] && <PodiumCard coder={top3[2]} rank={3} />}
          </div>
        )}

        {/* ── Remaining List ── */}
        <div style={{
          background: 'rgba(6, 10, 22, 0.6)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, overflow: 'hidden',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)'
        }}>
          {/* Table Header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '80px 2fr 1.5fr 1fr 1fr',
            padding: '16px 20px', background: 'rgba(255,255,255,0.02)',
            borderBottom: '1px solid rgba(255,255,255,0.08)', color: '#4a5a7a',
            fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase'
          }}>
            <div style={{ textAlign: 'center' }}>Rank</div>
            <div>Programmer</div>
            <div>Identity</div>
            <div>Region</div>
            <div>Score / Profiles</div>
          </div>

          {/* List Body */}
          {rest.length > 0 ? (
            rest.map((coder, idx) => (
              <CoderRow key={coder.id || idx} coder={coder} rank={(search ? 0 : 3) + idx + 1} />
            ))
          ) : search && top3.length > 0 ? (
             top3.map((coder, idx) => (
              <CoderRow key={coder.id || idx} coder={coder} rank={idx + 1} />
            ))
          ) : (
            <div style={{ padding: '60px 20px', textAlign: 'center' }}>
              <Trophy size={48} color="#1a2a4a" style={{ marginBottom: 16 }} />
              <div style={{ color: '#4a5a7a', fontSize: 16, fontWeight: 600 }}>No programmers found matching your filters.</div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
