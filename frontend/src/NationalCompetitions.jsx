import { useState, useMemo, useEffect } from 'react';
import {
  Aperture, Calendar, Award, Building2, Monitor,
  ChevronDown, ArrowLeft, CheckCircle2, XCircle,
  MapPin, Code2, DollarSign, Search, X, WifiOff,
  Filter, ChevronRight, Wifi, Trophy
} from 'lucide-react';
import WelcomeBackground from './WelcomeBackground';

// API URL for competitions backend
const COMPETITIONS_API_URL = import.meta.env.VITE_COMPETITIONS_API_URL || 'http://localhost:5000';

// ─── Constants ─────────────────────────────────────────────────────────────────

const MONTHS = [
  'All','January','Jan / Feb','February','March','March / April',
  'April','April / May','May','June','July','August',
  'September','October','November','December','Dec / Jan',
];

const LANG_COLORS = {
  'C++':    { bg: 'rgba(96,180,255,.2)',  text: '#60b4ff', border: 'rgba(96,180,255,.4)'  },
  'Java':   { bg: 'rgba(255,127,127,.2)', text: '#ff8a8a', border: 'rgba(255,127,127,.4)' },
  'Python': { bg: 'rgba(109,255,176,.2)', text: '#6dffb0', border: 'rgba(109,255,176,.4)' },
  'C':      { bg: 'rgba(255,224,109,.2)', text: '#ffe06d', border: 'rgba(255,224,109,.4)' },
  'C#':     { bg: 'rgba(201,127,255,.2)', text: '#c97fff', border: 'rgba(201,127,255,.4)' },
  'Kotlin': { bg: 'rgba(255,143,232,.2)', text: '#ff8fe8', border: 'rgba(255,143,232,.4)' },
};

// Cycling accent colors for universities
const ACCENTS = [
  '#60a5fa','#a78bfa','#f472b6','#34d399','#fbbf24',
  '#f87171','#38bdf8','#fb923c','#4ade80','#e879f9',
];
const uniAccent = (name, list) => ACCENTS[list.indexOf(name) % ACCENTS.length] ?? '#7eaaff';

// ─── Dropdown pill ─────────────────────────────────────────────────────────────

function FilterPill({ label, value, options, onChange, icon: Icon, accent = '#7eaaff' }) {
  const [open, setOpen] = useState(false);
  const active = value !== 'All';
  return (
    <div style={{ position: 'relative' }} onBlur={() => setTimeout(() => setOpen(false), 150)}>
      <button
        onClick={() => setOpen(p => !p)}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: active ? `${accent}18` : 'rgba(255,255,255,.04)',
          border: `1px solid ${active ? accent + '55' : 'rgba(255,255,255,.1)'}`,
          color: active ? accent : '#8899bb', borderRadius: 12, padding: '9px 16px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer', transition: 'all .2s',
          boxShadow: active ? `0 0 14px ${accent}22` : 'none',
        }}
      >
        <Icon size={13} />
        {active ? (value.length > 22 ? value.slice(0, 22) + '…' : value) : label}
        <ChevronDown size={12} style={{ opacity: .5, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
      </button>
      {open && (
        <ul onClick={e => e.stopPropagation()} style={{
          position: 'absolute', top: 'calc(100% + 8px)', left: 0, zIndex: 500,
          background: 'rgba(8,12,26,.98)', backdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,.1)', borderRadius: 14,
          padding: '6px', minWidth: 240, maxHeight: 280, overflowY: 'auto',
          boxShadow: '0 24px 60px rgba(0,0,0,.9)', listStyle: 'none', margin: 0,
        }}>
          {options.map(opt => (
            <li key={opt} onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: '9px 13px', fontSize: 13, borderRadius: 8,
                color: value === opt ? '#fff' : '#7788aa',
                fontWeight: value === opt ? 700 : 400,
                background: value === opt ? `${accent}22` : 'transparent',
                cursor: 'pointer', transition: 'background .12s',
              }}
              onMouseEnter={e => { if (value !== opt) e.currentTarget.style.background = 'rgba(255,255,255,.05)'; }}
              onMouseLeave={e => { if (value !== opt) e.currentTarget.style.background = 'transparent'; }}
            >
              {opt === 'All' ? `All ${label}s` : opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// ─── Competition Card ──────────────────────────────────────────────────────────

function CompCard({ row, idx, allUnis }) {
  const [expanded, setExpanded] = useState(false);
  const accent   = uniAccent(row.host_university, allUnis);
  const langs    = row.programming_languages || [];
  const hasCert  = row.participation_certificate;
  const isPhysical = row.is_physical;

  return (
    <div
      style={{
        background: 'rgba(9,13,28,.75)', backdropFilter: 'blur(20px)',
        border: `1px solid rgba(255,255,255,.06)`,
        borderRadius: 20, overflow: 'hidden',
        transition: 'all .35s cubic-bezier(.16,1,.3,1)',
        boxShadow: '0 4px 24px rgba(0,0,0,.4)',
        animation: `fadeUp .4s ease both`,
        animationDelay: `${Math.min(idx * 40, 500)}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = `0 20px 56px rgba(0,0,0,.6), 0 0 0 1px ${accent}44, 0 0 48px ${accent}18`;
        e.currentTarget.style.borderColor = `${accent}44`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,.4)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)';
      }}
    >
      {/* Gradient header strip */}
      <div style={{
        background: `linear-gradient(135deg, ${accent}28 0%, ${accent}08 60%, transparent 100%)`,
        borderBottom: `1px solid ${accent}22`,
        padding: '20px 22px 18px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Decorative blob */}
        <div style={{
          position: 'absolute', right: -30, top: -30,
          width: 120, height: 120, borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}18 0%, transparent 70%)`,
          pointerEvents: 'none',
        }} />

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, position: 'relative' }}>
          {/* Index badge */}
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: `${accent}18`, border: `1px solid ${accent}44`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 900, color: accent, fontFamily: 'monospace',
          }}>
            {String(idx + 1).padStart(2, '0')}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <h3 style={{
              margin: '0 0 8px', fontSize: 16, fontWeight: 800, color: '#f0f4ff',
              lineHeight: 1.3,
            }}>
              {row.competition_name}
            </h3>
            {/* Quick badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em',
                color: isPhysical ? '#f472b6' : '#38b6ff',
                background: isPhysical ? 'rgba(244,114,182,.12)' : 'rgba(56,182,255,.12)',
                border: `1px solid ${isPhysical ? 'rgba(244,114,182,.3)' : 'rgba(56,182,255,.3)'}`,
                borderRadius: 20, padding: '3px 9px',
              }}>
                {isPhysical ? <MapPin size={8} /> : <Monitor size={8} />}
                {isPhysical ? 'Physical' : 'Online'}
              </span>

              {hasCert !== undefined && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '.05em',
                  color: hasCert ? '#6dffb0' : '#ff6b6b',
                  background: hasCert ? 'rgba(109,255,176,.1)' : 'rgba(255,107,107,.1)',
                  border: `1px solid ${hasCert ? 'rgba(109,255,176,.25)' : 'rgba(255,107,107,.2)'}`,
                  borderRadius: 20, padding: '3px 9px',
                }}>
                  {hasCert ? <CheckCircle2 size={8} /> : <XCircle size={8} />}
                  {hasCert ? 'Certificate' : 'No Cert'}
                </span>
              )}

              {row.recurring_month && (
                <span style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: 10, fontWeight: 700,
                  color: '#a78bfa', background: 'rgba(167,139,250,.1)',
                  border: '1px solid rgba(167,139,250,.25)',
                  borderRadius: 20, padding: '3px 9px',
                }}>
                  <Calendar size={8} /> {row.recurring_month}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ padding: '16px 22px' }}>
        {/* University */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 8, height: 8, borderRadius: '50%',
            background: accent, boxShadow: `0 0 8px ${accent}`,
            flexShrink: 0,
          }} />
          <span style={{ fontSize: 13, fontWeight: 700, color: accent }}>{row.host_university}</span>
        </div>

        {/* Info grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 12px', marginBottom: 14 }}>
          {row.typical_venue && (
            <div style={{ gridColumn: '1 / -1' }}>
              <p style={{ margin: '0 0 2px', fontSize: 10, color: '#3d4f6d', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Venue</p>
              <p style={{ margin: 0, fontSize: 12, color: '#8899bb', lineHeight: 1.5 }}><MapPin size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4, color: '#f472b6' }} />{row.typical_venue}</p>
            </div>
          )}
          {(row.fee_label || row.registration_fee) && (
            <div>
              <p style={{ margin: '0 0 2px', fontSize: 10, color: '#3d4f6d', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Fee</p>
              <p style={{ margin: 0, fontSize: 12, color: '#a0b4cc', fontWeight: 600 }}><DollarSign size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 3, color: '#fbbf24' }} />{row.fee_label || row.registration_fee}</p>
            </div>
          )}
        </div>

        {/* Languages */}
        {langs.length > 0 && (
          <div style={{ marginBottom: 14 }}>
            <p style={{ margin: '0 0 6px', fontSize: 10, color: '#3d4f6d', textTransform: 'uppercase', letterSpacing: '.06em', fontWeight: 600 }}>Languages</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
              {langs.map(l => {
                const c = LANG_COLORS[l] ?? { bg: 'rgba(255,255,255,.06)', text: '#9aa8c0', border: 'rgba(255,255,255,.12)' };
                return (
                  <span key={l} style={{
                    display: 'inline-flex', alignItems: 'center', gap: 4,
                    background: c.bg, border: `1px solid ${c.border}`,
                    color: c.text, borderRadius: 7, padding: '3px 9px',
                    fontSize: 11, fontWeight: 700,
                  }}>
                    <Code2 size={9} /> {l}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Expand for format */}
        {row.format && (
          <>
            <button
              onClick={() => setExpanded(p => !p)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.07)',
                borderRadius: 8, padding: '8px 12px', cursor: 'pointer', color: '#6b7a99',
                fontSize: 12, fontWeight: 600, transition: 'all .2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = `${accent}0d`; e.currentTarget.style.color = accent; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.03)'; e.currentTarget.style.color = '#6b7a99'; }}
            >
              <ChevronRight size={13} style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform .2s' }} />
              {expanded ? 'Hide' : 'View'} Format Details
            </button>

            {expanded && (
              <div style={{
                marginTop: 10, padding: '12px 14px',
                background: `${accent}08`, border: `1px solid ${accent}20`,
                borderRadius: 10, fontSize: 12, color: '#8899bb', lineHeight: 1.7,
                animation: 'fadeUp .2s ease',
              }}>
                {row.format}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Stat Bubble ───────────────────────────────────────────────────────────────

function Stat({ value, label, color, icon: Icon }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 10,
      background: 'rgba(10,14,28,.6)', backdropFilter: 'blur(16px)',
      border: `1px solid ${color}25`, borderRadius: 14, padding: '14px 18px',
      boxShadow: `inset 0 1px 0 ${color}15`,
    }}>
      <div style={{ width: 36, height: 36, borderRadius: 10, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={17} color={color} />
      </div>
      <div>
        <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 11, color: '#4a5a7a', fontWeight: 600, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function NationalCompetitions({ onBack }) {
  const [competitions, setCompetitions] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [fetchError, setFetchError]     = useState(null);
  const [search, setSearch]             = useState('');
  const [uniFilter, setUniFilter]       = useState('All');
  const [monthFilter, setMonthFilter]   = useState('All');
  const [modeFilter, setModeFilter]     = useState('All');

  useEffect(() => {
    fetch(`${COMPETITIONS_API_URL}/api/competitions`)
      .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
      .then(d  => { setCompetitions(d); setLoading(false); })
      .catch(e => { setFetchError(e.message); setLoading(false); });
  }, []);

  const allUnis  = [...new Set(competitions.map(c => c.host_university).filter(Boolean))];
  const unis     = ['All', ...allUnis];
  const modes    = ['All', 'Physical', 'Online'];

  const result = useMemo(() => {
    let d = [...competitions];
    const q = search.trim().toLowerCase();
    if (q) d = d.filter(r =>
      r.competition_name?.toLowerCase().includes(q) ||
      r.host_university?.toLowerCase().includes(q) ||
      r.typical_venue?.toLowerCase().includes(q)
    );
    if (uniFilter   !== 'All') d = d.filter(r => r.host_university  === uniFilter);
    if (monthFilter !== 'All') d = d.filter(r => r.recurring_month  === monthFilter);
    if (modeFilter  !== 'All') d = d.filter(r => (modeFilter === 'Physical') === !!r.is_physical);
    return d;
  }, [competitions, search, uniFilter, monthFilter, modeFilter]);

  const physCount = competitions.filter(c => c.is_physical).length;
  const certCount = competitions.filter(c => c.participation_certificate).length;

  // ── Loading ─────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="app-container dashboard-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 22 }}>
      <WelcomeBackground />
      <div style={{ width: 56, height: 56, border: '3px solid rgba(244,114,182,.15)', borderTop: '3px solid #f472b6', borderRadius: '50%', animation: 'spin 1s linear infinite', zIndex: 10 }} />
      <span style={{ color: '#f472b6', fontSize: 15, fontWeight: 700, letterSpacing: '.08em', zIndex: 10 }}>LOADING COMPETITIONS</span>
    </div>
  );

  if (fetchError) return (
    <div className="app-container dashboard-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <WelcomeBackground />
      <WifiOff size={48} color="#ff6b6b" style={{ zIndex: 10 }} />
      <span style={{ color: '#ff6b6b', fontSize: 16, fontWeight: 700, zIndex: 10 }}>Failed to load</span>
      <span style={{ color: '#6b7a99', fontSize: 13, zIndex: 10 }}>{fetchError}</span>
    </div>
  );

  // ── Main Render ──────────────────────────────────────────────────────────────
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

      <main style={{ position: 'relative', zIndex: 10, maxWidth: 1200, margin: '0 auto', padding: '0 24px 80px', width: '100%', boxSizing: 'border-box' }}>

        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', padding: '44px 0 40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(244,114,182,.1)', border: '1px solid rgba(244,114,182,.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 20 }}>
            <Trophy size={11} color="#f472b6" />
            <span style={{ fontSize: 11, color: '#f472b6', fontWeight: 700, letterSpacing: '.1em', textTransform: 'uppercase' }}>Pakistan Regional Competitions</span>
          </div>

          <h1 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', margin: '0 0 12px', letterSpacing: '-1px', lineHeight: 1.1 }}>
            🇵🇰 National{' '}
            <span style={{
              background: 'linear-gradient(135deg, #f472b6, #a78bfa, #60a5fa)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 20px rgba(244,114,182,.4))',
            }}>Competitions</span>
          </h1>
          <p style={{ color: '#6b7a99', fontSize: 14, margin: '0 auto 32px', maxWidth: 480, lineHeight: 1.7 }}>
            Browse all registered national algorithm competitions across Pakistan's top universities.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Stat value={competitions.length} label="Total Competitions" color="#a78bfa" icon={Trophy} />
            <Stat value={physCount}           label="Physical Events"   color="#f472b6" icon={MapPin}  />
            <Stat value={competitions.length - physCount} label="Online Events" color="#38b6ff" icon={Wifi} />
            <Stat value={certCount}           label="With Certificate"  color="#6dffb0" icon={Award}   />
          </div>
        </div>

        {/* ── Filters ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          marginBottom: 28, padding: '14px 18px',
          background: 'rgba(6,10,22,.7)', backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,.07)', borderRadius: 16,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#3d4f6d', fontSize: 12, fontWeight: 700, letterSpacing: '.06em' }}>
            <Filter size={12} /> FILTERS
          </div>

          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={13} style={{ position: 'absolute', left: 13, top: '50%', transform: 'translateY(-50%)', color: '#3d4f6d', pointerEvents: 'none' }} />
            <input
              type="text" placeholder="Search competitions, universities…"
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

          <FilterPill label="University" value={uniFilter}   options={unis}   onChange={setUniFilter}   icon={Building2} accent="#60a5fa" />
          <FilterPill label="Month"      value={monthFilter} options={MONTHS} onChange={setMonthFilter} icon={Calendar}  accent="#a78bfa" />
          <FilterPill label="Mode"       value={modeFilter}  options={modes}  onChange={setModeFilter}  icon={Monitor}   accent="#f472b6" />

          {(uniFilter !== 'All' || monthFilter !== 'All' || modeFilter !== 'All' || search) && (
            <button
              onClick={() => { setUniFilter('All'); setMonthFilter('All'); setModeFilter('All'); setSearch(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.2)', color: '#ff6b6b', borderRadius: 10, padding: '9px 13px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
            >
              <X size={11} /> Clear
            </button>
          )}

          <div style={{ marginLeft: 'auto', fontSize: 12, color: '#3d4f6d', fontWeight: 700, letterSpacing: '.05em', whiteSpace: 'nowrap' }}>
            {result.length} results
          </div>
        </div>

        {/* ── Cards Grid ── */}
        {result.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 20px' }}>
            <Trophy size={56} color="#1a2a4a" style={{ marginBottom: 20 }} />
            <p style={{ color: '#4455aa', fontSize: 15, fontWeight: 600, marginBottom: 20 }}>No competitions match your filters.</p>
            <button onClick={() => { setUniFilter('All'); setMonthFilter('All'); setModeFilter('All'); setSearch(''); }}
              style={{ background: 'rgba(244,114,182,.1)', border: '1px solid rgba(244,114,182,.3)', color: '#f472b6', borderRadius: 12, padding: '11px 24px', cursor: 'pointer', fontWeight: 600, fontSize: 14 }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
            {result.map((row, idx) => (
              <CompCard key={row._id || idx} row={row} idx={idx} allUnis={allUnis} />
            ))}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: 40, fontSize: 11, color: '#1e2e44', paddingBottom: 20 }}>
          Data sourced from <strong style={{ color: '#2a3a5a' }}>Pakistan Competition Database</strong> · ContestHUB
        </p>
      </main>

      <style>{`
        @keyframes spin    { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeUp  { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        input::placeholder { color: #2e3e5a !important; }
        input:focus { border-color: rgba(244,114,182,.4) !important; box-shadow: 0 0 0 3px rgba(244,114,182,.08) !important; }
        ul::-webkit-scrollbar { width: 5px; }
        ul::-webkit-scrollbar-track { background: rgba(0,0,0,.15); }
        ul::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 4px; }
      `}</style>
    </div>
  );
}