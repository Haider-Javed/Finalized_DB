import { useState, useMemo, useEffect, useRef } from 'react';
import {
  ArrowLeft, Search, Code2, ShieldAlert,
  ChevronDown, X, Globe2, Tag, Zap, Award, ExternalLink,
  Flame, Cpu, BarChart3, Filter
} from 'lucide-react';
import WelcomeBackground from './WelcomeBackground';

// API URL for competitions backend
const COMPETITIONS_API_URL = import.meta.env.VITE_COMPETITIONS_API_URL || 'http://localhost:5000';

// ─── Data helpers ─────────────────────────────────────────────────────────────

const PLATFORM = {
  leetcode:   { label: 'LeetCode',   color: '#ffa116', glow: '#ffa11633', emoji: '🟡' },
  codeforces: { label: 'Codeforces', color: '#ff4444', glow: '#ff444433', emoji: '🔴' },
};
const getPlt = k => PLATFORM[k?.toLowerCase()] ?? { label: k, color: '#7eaaff', glow: '#7eaaff33', emoji: '💠' };

const DIFF = {
  easy:   { label: 'Easy',   color: '#22d3a0', glow: '0 0 14px rgba(34,211,160,0.45)',   bg: 'rgba(34,211,160,.12)',  border: 'rgba(34,211,160,.3)'  },
  medium: { label: 'Medium', color: '#ffb800', glow: '0 0 14px rgba(255,184,0,0.45)',    bg: 'rgba(255,184,0,.12)',   border: 'rgba(255,184,0,.3)'   },
  hard:   { label: 'Hard',   color: '#f43f5e', glow: '0 0 14px rgba(244,63,94,0.45)',    bg: 'rgba(244,63,94,.12)',   border: 'rgba(244,63,94,.3)'   },
};
const getDiff = k => DIFF[k?.toLowerCase()] ?? { label: k || '?', color: '#8899bb', glow: 'none', bg: 'rgba(255,255,255,.05)', border: 'rgba(255,255,255,.1)' };

// ─── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, duration = 800 }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (!to) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setVal(Math.round(p * to));
      if (p < 1) ref.current = requestAnimationFrame(step);
    };
    ref.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(ref.current);
  }, [to, duration]);
  return val.toLocaleString();
}

// ─── Pill filter ─────────────────────────────────────────────────────────────
function Pill({ label, icon: Icon, value, options, onChange, accentColor = '#7eaaff', formatValue = v => v }) {
  const [open, setOpen] = useState(false);
  const active = value !== 'All';
  const wrapRef = useRef();
  useEffect(() => {
    const handler = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div ref={wrapRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: active ? `${accentColor}18` : 'rgba(255,255,255,.04)',
          border: `1px solid ${active ? accentColor + '55' : 'rgba(255,255,255,.1)'}`,
          color: active ? accentColor : '#8899bb',
          borderRadius: 12, padding: '9px 16px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          transition: 'all 0.2s', whiteSpace: 'nowrap',
          boxShadow: active ? `0 0 16px ${accentColor}25` : 'none',
        }}
      >
        {Icon && <Icon size={13} />}
        {active ? formatValue(value) : label}
        <ChevronDown size={12} style={{ opacity: 0.5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
      </button>

      {open && (
        <ul style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 500,
          background: 'rgba(9,13,28,0.98)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,.1)', borderRadius: 14,
          padding: '8px', minWidth: 210, maxHeight: 300, overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0,0,0,.9)', listStyle: 'none', margin: 0,
        }}>
          {options.map(opt => (
            <li key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: '10px 14px', fontSize: 13, borderRadius: 8,
                color: value === opt ? '#fff' : '#7788aa',
                fontWeight: value === opt ? 700 : 400,
                background: value === opt ? `${accentColor}20` : 'transparent',
                cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = 'rgba(255,255,255,.04)'; }}
              onMouseLeave={e => { if (value !== opt) e.currentTarget.style.background = 'transparent'; }}
            >
              {value === opt && <span style={{ color: accentColor, fontSize: 10 }}>●</span>}
              {opt === 'All' ? `All ${label}s` : formatValue(opt)}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Problem Card ─────────────────────────────────────────────────────────────
function ProblemCard({ problem, idx }) {
  const plt  = getPlt(problem.platform);
  const diff = getDiff(problem.difficulty);
  const tags = problem.tags || [];
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: 'relative', overflow: 'hidden',
        background: hovered ? 'rgba(14,20,40,0.95)' : 'rgba(10,14,28,0.7)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${hovered ? plt.color + '50' : 'rgba(255,255,255,.07)'}`,
        borderRadius: 18,
        padding: '22px 22px 18px',
        transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)',
        boxShadow: hovered
          ? `0 20px 60px rgba(0,0,0,.7), 0 0 40px ${plt.glow}, 0 0 0 1px ${plt.color}30`
          : '0 4px 20px rgba(0,0,0,.4)',
        transform: hovered ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)',
        animation: `pCardIn 0.4s ease both`,
        animationDelay: `${Math.min(idx * 30, 500)}ms`,
        cursor: 'default',
      }}
    >
      {/* Top gradient shimmer bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 3,
        background: `linear-gradient(90deg, ${plt.color}, ${plt.color}66, transparent)`,
        opacity: hovered ? 1 : 0.4,
        transition: 'opacity 0.3s',
      }} />

      {/* Background number watermark */}
      <div style={{
        position: 'absolute', right: 16, top: 10,
        fontSize: 64, fontWeight: 900, color: plt.color,
        opacity: hovered ? 0.07 : 0.04, lineHeight: 1,
        fontFamily: 'monospace', letterSpacing: '-4px',
        pointerEvents: 'none', userSelect: 'none', transition: 'opacity 0.3s',
      }}>
        {String(idx + 1).padStart(3, '0')}
      </div>

      {/* Platform + Difficulty row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          fontSize: 11, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em',
          color: plt.color, background: `${plt.color}15`,
          border: `1px solid ${plt.color}40`, borderRadius: 8, padding: '4px 11px',
        }}>
          {plt.emoji} {plt.label}
        </span>

        <span style={{
          display: 'inline-flex', alignItems: 'center',
          fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em',
          color: diff.color, background: diff.bg,
          border: `1px solid ${diff.border}`, borderRadius: 8, padding: '4px 11px',
          boxShadow: hovered ? diff.glow : 'none', transition: 'box-shadow 0.3s',
        }}>
          {diff.label}
        </span>

        {problem.rating && (
          <span style={{ marginLeft: 'auto', fontSize: 11, color: '#6b7fa0', fontFamily: 'monospace', fontWeight: 700 }}>
            ⚡ {problem.rating}
          </span>
        )}
      </div>

      {/* Title */}
      <a href={problem.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
        <h3 style={{
          margin: '0 0 8px', fontSize: 16, fontWeight: 700, lineHeight: 1.35,
          color: hovered ? '#fff' : '#d8e6ff',
          transition: 'color 0.2s',
          overflow: 'hidden', display: '-webkit-box',
          WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
        }}>
          {problem.title}
        </h3>
      </a>

      <div style={{ fontSize: 11, color: '#4a5a7a', marginBottom: 14, fontFamily: 'monospace' }}>
        #{problem.problemId}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 18 }}>
          {tags.slice(0, 4).map(tag => (
            <span key={tag} style={{
              fontSize: 10, color: hovered ? '#8899cc' : '#6b7a99',
              background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
              borderRadius: 6, padding: '3px 9px', fontWeight: 500,
              transition: 'all 0.2s',
            }}>
              {tag}
            </span>
          ))}
          {tags.length > 4 && (
            <span style={{ fontSize: 10, color: '#4a5a7a', padding: '3px 6px' }}>+{tags.length - 4}</span>
          )}
        </div>
      )}

      {/* Solve button */}
      <a
        href={problem.url} target="_blank" rel="noopener noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 7,
          fontSize: 13, fontWeight: 700, color: hovered ? '#fff' : plt.color,
          background: hovered ? `linear-gradient(135deg, ${plt.color}, ${plt.color}cc)` : `${plt.color}12`,
          border: `1px solid ${plt.color}${hovered ? '00' : '40'}`,
          borderRadius: 10, padding: '9px 18px',
          textDecoration: 'none', transition: 'all 0.25s',
          boxShadow: hovered ? `0 6px 20px ${plt.color}44` : 'none',
        }}
      >
        Solve Challenge <ExternalLink size={12} />
      </a>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ count, label, color, glow, total }) {
  const pct = total ? Math.round((count / total) * 100) : 0;
  return (
    <div style={{
      flex: 1, minWidth: 120,
      background: 'rgba(10,14,28,0.6)', backdropFilter: 'blur(16px)',
      border: `1px solid ${color}30`, borderRadius: 16, padding: '18px 20px',
      boxShadow: `0 4px 20px rgba(0,0,0,0.4), inset 0 1px 0 ${color}15`,
    }}>
      <div style={{ fontSize: 28, fontWeight: 800, color, marginBottom: 4, lineHeight: 1 }}>
        <Counter to={count} />
      </div>
      <div style={{ fontSize: 12, color: '#6b7a99', fontWeight: 600, marginBottom: 10 }}>{label}</div>
      <div style={{ height: 4, background: 'rgba(255,255,255,.06)', borderRadius: 4 }}>
        <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 4, boxShadow: glow, transition: 'width 0.8s ease' }} />
      </div>
      <div style={{ fontSize: 10, color: '#4a5a7a', marginTop: 5, fontFamily: 'monospace' }}>{pct}%</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function Problems({ onBack, user }) {
  const [problems, setProblems]   = useState([]);
  const [loading, setLoading]     = useState(true);
  const [errorMsg, setErrorMsg]   = useState(null);
  const [search, setSearch]       = useState('');
  const [platformF, setPlatformF] = useState('All');
  const [diffF, setDiffF]         = useState('All');
  const [topicF, setTopicF]       = useState('All');
  const [page, setPage]           = useState(1);
  const PER_PAGE = 24;

  useEffect(() => {
    fetch(`${COMPETITIONS_API_URL}/api/problems`)
      .then(r => { if (!r.ok) throw new Error('API Error'); return r.json(); })
      .then(d => { setProblems(d || []); setLoading(false); })
      .catch(e => { setErrorMsg('Failed to connect to problem vault.'); setLoading(false); });
  }, []);

  const platforms    = ['All', ...new Set(problems.map(p => p.platform).filter(Boolean))];
  const difficulties = ['All', 'Easy', 'Medium', 'Hard', 'Unknown'];
  const topics = useMemo(() => {
    const s = new Set();
    problems.forEach(p => (p.tags || []).forEach(t => s.add(t.toLowerCase())));
    return ['All', ...Array.from(s).sort()];
  }, [problems]);

  const filtered = useMemo(() => {
    let d = [...problems];
    const q = search.trim().toLowerCase();
    if (q) d = d.filter(p => p.title?.toLowerCase().includes(q) || p.problemId?.toLowerCase().includes(q));
    if (platformF !== 'All') d = d.filter(p => p.platform === platformF);
    if (diffF    !== 'All') d = d.filter(p => p.difficulty?.toLowerCase() === diffF.toLowerCase());
    if (topicF   !== 'All') d = d.filter(p => (p.tags || []).some(t => t.toLowerCase() === topicF));
    return d;
  }, [problems, search, platformF, diffF, topicF]);

  useEffect(() => setPage(1), [search, platformF, diffF, topicF]);

  const displayed = filtered.slice(0, page * PER_PAGE);
  const hasMore   = displayed.length < filtered.length;

  const easyCount   = filtered.filter(p => p.difficulty?.toLowerCase() === 'easy').length;
  const mediumCount = filtered.filter(p => p.difficulty?.toLowerCase() === 'medium').length;
  const hardCount   = filtered.filter(p => p.difficulty?.toLowerCase() === 'hard').length;

  if (loading) return (
    <div className="app-container dashboard-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 24 }}>
      <WelcomeBackground />
      <div style={{ position: 'relative', zIndex: 10 }}>
        <div style={{ width: 64, height: 64, border: '3px solid rgba(99,140,255,.2)', borderTop: '3px solid #7eaaff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <Code2 size={24} color="#7eaaff" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)' }} />
      </div>
      <div style={{ zIndex: 10, textAlign: 'center' }}>
        <div style={{ color: '#7eaaff', fontSize: 16, fontWeight: 700, letterSpacing: '0.1em', marginBottom: 6 }}>LOADING PROBLEM VAULT</div>
        <div style={{ color: '#3d4f6d', fontSize: 12 }}>Syncing thousands of challenges…</div>
      </div>
    </div>
  );

  if (errorMsg) return (
    <div className="app-container dashboard-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <WelcomeBackground />
      <ShieldAlert size={48} color="#f43f5e" style={{ zIndex: 10 }} />
      <div style={{ zIndex: 10, textAlign: 'center' }}>
        <div style={{ color: '#f43f5e', fontSize: 18, fontWeight: 700 }}>Connection Error</div>
        <div style={{ color: '#6b7a99', fontSize: 13, marginTop: 6 }}>{errorMsg}</div>
      </div>
      <button onClick={() => window.location.reload()} style={{ zIndex: 10, background: 'rgba(99,140,255,.15)', border: '1px solid rgba(99,140,255,.4)', color: '#7eaaff', borderRadius: 12, padding: '11px 24px', cursor: 'pointer', fontWeight: 700, fontSize: 14 }}>
        Retry
      </button>
    </div>
  );

  return (
    <div className="app-container dashboard-bg" style={{ minHeight: '100vh' }}>
      <WelcomeBackground />

      {/* Header */}
      <header className="intl-header" style={{ zIndex: 50 }}>
        <button className="back-btn" onClick={onBack}><ArrowLeft size={14} style={{ marginRight: 4 }} />Back</button>
        <div className="logo center-logo">
          <Code2 className="logo-icon glow-icon" color="#e0e0e0" />
          <span className="logo-text">PROBLEM <span className="logo-accent">VAULT</span></span>
        </div>
        <div className="header-placeholder">
          {user && (
            <div className="profile-wrapper">
              <span className="profile-username">{user.username}</span>
              {user.profilePic
                ? <img src={user.profilePic} alt="profile" className="profile-circle-img" />
                : <div className="profile-circle-text">{user.username.charAt(0).toUpperCase()}</div>
              }
            </div>
          )}
        </div>
      </header>

      <main style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '0 24px 60px', width: '100%', boxSizing: 'border-box' }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', padding: '40px 0 36px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(99,140,255,.1)', border: '1px solid rgba(99,140,255,.25)', borderRadius: 20, padding: '5px 14px', marginBottom: 20 }}>
            <Zap size={12} color="#7eaaff" />
            <span style={{ fontSize: 11, color: '#7eaaff', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Live Problem Database</span>
          </div>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', margin: '0 0 10px', letterSpacing: '-1px', lineHeight: 1.1 }}>
            🧠 Algorithm{' '}
            <span style={{ background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', filter: 'drop-shadow(0 0 20px rgba(167,139,250,0.4))' }}>
              Challenges
            </span>
          </h1>
          <p style={{ color: '#6b7a99', fontSize: 14, maxWidth: 480, margin: '0 auto 32px' }}>
            Battle-tested problems from LeetCode & Codeforces. Filter by topic, difficulty, or platform.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', maxWidth: 600, margin: '0 auto' }}>
            <StatCard count={filtered.length} label="Filtered Problems" color="#7eaaff" glow="0 0 8px #7eaaff66" total={filtered.length} />
            <StatCard count={easyCount}   label="Easy"   color="#22d3a0" glow="0 0 8px #22d3a066" total={filtered.length} />
            <StatCard count={mediumCount} label="Medium" color="#ffb800" glow="0 0 8px #ffb80066" total={filtered.length} />
            <StatCard count={hardCount}   label="Hard"   color="#f43f5e" glow="0 0 8px #f43f5e66" total={filtered.length} />
          </div>
        </div>

        {/* ── Filters ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          marginBottom: 28, padding: '14px 18px',
          background: 'rgba(6,10,22,0.7)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,.07)', borderRadius: 16,
          position: 'relative', zIndex: 150, overflow: 'visible',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#4a5a7a', fontSize: 12, fontWeight: 700, letterSpacing: '0.06em', marginRight: 4 }}>
            <Filter size={12} /> FILTERS
          </div>

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
            <Search size={13} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#4a5a7a', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Search problems or IDs…"
              value={search} onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '9px 34px 9px 36px', boxSizing: 'border-box',
                background: 'rgba(0,0,0,.4)', border: '1px solid rgba(255,255,255,.07)',
                borderRadius: 11, color: '#e0eaff', fontSize: 13, outline: 'none', fontFamily: 'inherit',
              }}
            />
            {search && <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 11, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#4a5a7a', cursor: 'pointer', padding: 0, display: 'flex' }}><X size={13} /></button>}
          </div>

          <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,.07)' }} />

          <div style={{ width: 1, height: 26, background: 'rgba(255,255,255,.07)' }} />

          <Pill label="Platform"   value={platformF} options={platforms}    onChange={setPlatformF} icon={Globe2} accentColor="#ffa116" formatValue={v => v === 'leetcode' ? 'LeetCode' : (v === 'codeforces' ? 'Codeforces' : v)} />
          <Pill label="Difficulty" value={diffF}      options={difficulties} onChange={setDiffF}      icon={Flame} accentColor="#f43f5e" />
          <Pill label="Topic"      value={topicF}     options={topics}       onChange={setTopicF}     icon={Tag}   accentColor="#a78bfa" formatValue={v => v === 'All' ? 'All' : v.charAt(0).toUpperCase() + v.slice(1)} />

          {(platformF !== 'All' || diffF !== 'All' || topicF !== 'All' || search) && (
            <button
              onClick={() => { setPlatformF('All'); setDiffF('All'); setTopicF('All'); setSearch(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(244,63,94,.08)', border: '1px solid rgba(244,63,94,.25)', color: '#f43f5e', borderRadius: 10, padding: '9px 13px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
            >
              <X size={11} /> Clear
            </button>
          )}

          <div style={{ marginLeft: 'auto', fontSize: 12, color: '#3d4f6d', fontWeight: 700, letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>
            {filtered.length.toLocaleString()} results
          </div>
        </div>

        {/* ── Cards Grid ── */}
        {filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Code2 size={64} color="#1a2a4a" style={{ marginBottom: 20 }} />
            <p style={{ color: '#4455aa', fontSize: 16, fontWeight: 600, marginBottom: 20 }}>No problems match your filters.</p>
            <button onClick={() => { setPlatformF('All'); setDiffF('All'); setTopicF('All'); setSearch(''); }}
              style={{ background: 'rgba(99,140,255,.12)', border: '1px solid rgba(99,140,255,.3)', color: '#7eaaff', borderRadius: 12, padding: '11px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {displayed.map((p, i) => <ProblemCard key={p._id || i} problem={p} idx={i} />)}
            </div>

            {hasMore && (
              <div style={{ textAlign: 'center', marginTop: 32 }}>
                <button
                  onClick={() => setPage(page + 1)}
                  style={{
                    background: 'rgba(99,140,255,.1)', border: '1px solid rgba(99,140,255,.25)',
                    color: '#7eaaff', borderRadius: 14, padding: '13px 36px',
                    cursor: 'pointer', fontWeight: 700, fontSize: 14, transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,140,255,.2)'; e.currentTarget.style.boxShadow = '0 0 24px rgba(99,140,255,.25)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,140,255,.1)'; e.currentTarget.style.boxShadow = 'none'; }}
                >
                  Load More · {filtered.length - displayed.length} remaining
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pCardIn { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: #2e3e5a !important; }
        input:focus { border-color: rgba(99,140,255,.4) !important; box-shadow: 0 0 0 3px rgba(99,140,255,.08) !important; }
        ul::-webkit-scrollbar { width: 5px; }
        ul::-webkit-scrollbar-track { background: rgba(0,0,0,.15); }
        ul::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 4px; }
      `}</style>
    </div>
  );
}
