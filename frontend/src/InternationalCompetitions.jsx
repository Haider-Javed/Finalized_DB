import { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Aperture, ArrowLeft, Globe2, Calendar, Clock, Timer,
  ExternalLink, RefreshCw, WifiOff, Zap, Filter, ChevronDown,
  ListOrdered, Search, X
} from 'lucide-react';
import WelcomeBackground from './WelcomeBackground';

// API URL for competitions backend
const COMPETITIONS_API_URL = import.meta.env.VITE_COMPETITIONS_API_URL || 'http://localhost:5000';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtDate(iso) {
  if (!iso) return '—';
  try {
    const d = new Date(iso);
    return d.toLocaleString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
      timeZone: 'UTC',
    }) + ' UTC';
  } catch { return iso; }
}

function fmtDuration(secs) {
  if (!secs && secs !== 0) return '—';
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
}

function getStatusObject(start, end) {
  const now = Date.now();
  const s   = new Date(start).getTime();
  const e   = new Date(end).getTime();
  if (now < s) return { label: 'Upcoming', color: '#60b4ff', bg: 'rgba(96,180,255,.12)', glow: 'rgba(96,180,255,.3)' };
  if (now < e) return { label: 'Ongoing',  color: '#6dffb0', bg: 'rgba(109,255,176,.12)', glow: 'rgba(109,255,176,.3)' };
  return           { label: 'Finished', color: '#888',    bg: 'rgba(128,128,128,.10)', glow: 'transparent' };
}

function countdown(targetIso) {
  const diff = new Date(targetIso).getTime() - Date.now();
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3_600_000);
  const m = Math.floor((diff % 3_600_000) / 60_000);
  const s = Math.floor((diff % 60_000) / 1_000);
  if (h > 48) return `In ${Math.ceil(h / 24)} days`;
  return `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}

const PLATFORM_COLOR = {
  'codeforces.com':  '#ff4444',
  'leetcode.com':    '#ffa116',
  'atcoder.jp':      '#9d6fff',
  'codechef.com':    '#8e6e4b',
  'topcoder.com':    '#ef9208',
  'hackerrank.com':  '#32c766',
  'hackerearth.com': '#38b6ff',
  'kaggle.com':      '#20beff',
  default:           '#7eaaff',
};

function platformColor(host) {
  if (!host) return PLATFORM_COLOR.default;
  const key = Object.keys(PLATFORM_COLOR).find(k => host.includes(k));
  return PLATFORM_COLOR[key] ?? PLATFORM_COLOR.default;
}

// ─── Sub-Components ───────────────────────────────────────────────────────────

function FilterPill({ label, value, options, onChange, icon: Icon }) {
  const [open, setOpen] = useState(false);
  const active = value !== 'All';
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(p => !p); }}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: active ? 'rgba(99,140,255,.15)' : 'rgba(255,255,255,.04)',
          border: `1px solid ${active ? 'rgba(99,140,255,.4)' : 'rgba(255,255,255,.08)'}`,
          color: active ? '#7eaaff' : '#a0b4cc',
          borderRadius: 10, padding: '8px 14px',
          fontSize: 13, fontWeight: 600, cursor: 'pointer',
          transition: 'all .2s',
        }}
      >
        <Icon size={13} />
        {active ? value : label}
        <ChevronDown size={12} style={{ opacity: 0.6, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
      </button>
      {open && (
        <ul
          onClick={e => e.stopPropagation()}
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 300,
            background: '#0b1220', border: '1px solid rgba(255,255,255,.1)',
            borderRadius: 12, padding: '6px', minWidth: 180,
            boxShadow: '0 20px 50px rgba(0,0,0,.8)',
            listStyle: 'none', margin: 0,
          }}
        >
          {options.map(opt => (
            <li
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                padding: '9px 13px', fontSize: 13, borderRadius: 8,
                color: value === opt ? '#fff' : '#8899bb',
                fontWeight: value === opt ? 700 : 400,
                background: value === opt ? 'rgba(99,140,255,.15)' : 'transparent',
                cursor: 'pointer', transition: 'background .12s',
              }}
            >
              {opt === 'All' ? `All ${label}s` : opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ContestCard({ contest, idx }) {
  const status  = contest.statusObj;
  const clr     = platformColor(contest.host);
  const platform = contest.processed_platform;
  const iconUrl  = contest.resource?.icon ? `https://clist.by${contest.resource.icon}` : null;
  const cd       = status.label === 'Upcoming' ? countdown(contest.start) : null;
  const isOngoing = status.label === 'Ongoing';

  return (
    <div
      style={{
        position: 'relative',
        background: 'rgba(10, 14, 28, 0.6)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${isOngoing ? 'rgba(109,255,176,.2)' : 'rgba(255,255,255,.06)'}`,
        borderRadius: 16,
        padding: '0',
        overflow: 'hidden',
        transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: isOngoing
          ? '0 8px 32px rgba(109,255,176,0.08)'
          : '0 4px 24px rgba(0,0,0,0.4)',
        animation: `fadeInUp 0.4s ease both`,
        animationDelay: `${Math.min(idx * 40, 400)}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-5px) scale(1.01)';
        e.currentTarget.style.boxShadow = `0 24px 70px rgba(0,0,0,.8), 0 0 0 1px ${clr}55, 0 0 60px ${clr}28`;
        e.currentTarget.style.borderColor = `${clr}55`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0) scale(1)';
        e.currentTarget.style.boxShadow = isOngoing
          ? '0 8px 32px rgba(109,255,176,0.08)'
          : '0 4px 24px rgba(0,0,0,0.4)';
        e.currentTarget.style.borderColor = isOngoing ? 'rgba(109,255,176,.2)' : 'rgba(255,255,255,.06)';
      }}
    >
      {/* Left color accent bar */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
        background: `linear-gradient(to bottom, ${clr}, ${clr}44)`,
        borderRadius: '16px 0 0 16px',
      }} />

      <div style={{ padding: '18px 20px 18px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14 }}>

          {/* Platform Icon */}
          <div style={{
            width: 42, height: 42, borderRadius: 12, flexShrink: 0,
            background: `${clr}15`,
            border: `1px solid ${clr}30`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {iconUrl ? (
              <img src={iconUrl} alt={platform} width={22} height={22}
                style={{ borderRadius: 4, objectFit: 'contain' }}
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
            ) : null}
            <Zap size={18} color={clr} style={{ display: iconUrl ? 'none' : 'block' }} />
          </div>

          {/* Main Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: clr, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {platform}
              </span>
              {/* Status badge */}
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                fontSize: 10, fontWeight: 700,
                color: status.color, background: status.bg,
                border: `1px solid ${status.color}44`,
                borderRadius: 20, padding: '2px 8px',
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                {isOngoing && (
                  <span style={{
                    width: 5, height: 5, borderRadius: '50%',
                    background: status.color, display: 'inline-block',
                    animation: 'pulse 1.5s ease-in-out infinite',
                  }} />
                )}
                {status.label}
              </span>
              {/* Live countdown for upcoming */}
              {cd && (
                <span style={{
                  fontSize: 11, fontWeight: 700, color: '#6dffb0',
                  fontFamily: 'monospace', background: 'rgba(109,255,176,.08)',
                  border: '1px solid rgba(109,255,176,.2)',
                  borderRadius: 6, padding: '1px 7px',
                }}>
                  ⏱ {cd}
                </span>
              )}
            </div>

            <p style={{
              margin: '0 0 12px', fontSize: 14, fontWeight: 600,
              color: '#e2eaff', lineHeight: 1.4,
              overflow: 'hidden', display: '-webkit-box',
              WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
            }}>
              {contest.event}
            </p>

            {/* Meta row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 18, flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6b7fa0' }}>
                <Calendar size={11} color="#7eaaff" />
                {fmtDate(contest.start)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6b7fa0' }}>
                <Clock size={11} color="#f87171" />
                Ends {fmtDate(contest.end)}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#6b7fa0' }}>
                <Timer size={11} color="#eab308" />
                {fmtDuration(contest.duration)}
              </span>
            </div>
          </div>

          {/* Action button */}
          <div style={{ flexShrink: 0, alignSelf: 'center' }}>
            {status.label === 'Finished' ? (
              <a
                href={contest.href} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  fontSize: 11, fontWeight: 600, color: '#7eaaff',
                  background: 'rgba(99,140,255,.08)',
                  border: '1px solid rgba(99,140,255,.2)',
                  borderRadius: 9, padding: '8px 14px',
                  textDecoration: 'none', transition: 'all .2s',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(99,140,255,.18)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(99,140,255,.08)'; }}
              >
                Details <ExternalLink size={10} />
              </a>
            ) : (
              <a
                href={contest.href} target="_blank" rel="noopener noreferrer"
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  fontSize: 12, fontWeight: 700,
                  color: '#050c1a',
                  background: `linear-gradient(135deg, ${clr} 0%, ${clr}bb 100%)`,
                  borderRadius: 9, padding: '9px 16px',
                  textDecoration: 'none', transition: 'all .2s',
                  boxShadow: `0 4px 16px ${clr}33`,
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = `0 8px 24px ${clr}55`; }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = `0 4px 16px ${clr}33`; }}
              >
                Join Now <ExternalLink size={11} />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function InternationalCompetitions({ onBack }) {
  const [contests, setContests]       = useState([]);
  const [loading, setLoading]         = useState(true);
  const [error, setError]             = useState(null);
  const [tick, setTick]               = useState(0);
  const [refreshing, setRefreshing]   = useState(false);
  const [search, setSearch]           = useState('');
  const [platformFilter, setPlatformFilter] = useState('All');
  const [statusFilter, setStatusFilter]     = useState('All');
  const [sortBy, setSortBy]           = useState('start');
  const [openSort, setOpenSort]       = useState(false);

  const processData = (rawData) => rawData.map(c => ({
    ...c,
    processed_status: getStatusObject(c.start, c.end).label,
    processed_platform: c.resource?.name ?? c.host ?? 'Unknown',
    statusObj: getStatusObject(c.start, c.end),
  }));

  const fetchContests = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);
    setError(null);
    try {
      const res = await fetch(`${COMPETITIONS_API_URL}/api/international-competitions`);
      if (!res.ok) throw new Error(`Server returned ${res.status}`);
      const data = await res.json();
      setContests(processData(data));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchContests(); }, [fetchContests]);
  useEffect(() => {
    const id = setInterval(() => setTick(t => t + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const uniquePlatforms = ['All', ...new Set(contests.map(c => c.processed_platform).filter(Boolean))];
  const uniqueStatuses  = ['All', 'Upcoming', 'Ongoing', 'Finished'];

  const sortOptions = [
    { key: 'start',    label: 'Start Time' },
    { key: 'end',      label: 'End Time' },
    { key: 'duration', label: 'Duration' },
    { key: 'platform', label: 'Platform' },
  ];

  const result = useMemo(() => {
    let data = [...contests];
    if (search.trim()) data = data.filter(c => c.event?.toLowerCase().includes(search.toLowerCase()) || c.processed_platform?.toLowerCase().includes(search.toLowerCase()));
    if (platformFilter !== 'All') data = data.filter(r => r.processed_platform === platformFilter);
    if (statusFilter   !== 'All') data = data.filter(r => r.processed_status   === statusFilter);
    data.sort((a, b) => {
      if (sortBy === 'start')    return new Date(a.start) - new Date(b.start);
      if (sortBy === 'end')      return new Date(a.end)   - new Date(b.end);
      if (sortBy === 'duration') return (a.duration || 0) - (b.duration || 0);
      return String(a.processed_platform).localeCompare(String(b.processed_platform));
    });
    return data;
  }, [contests, search, platformFilter, statusFilter, sortBy, tick]);

  const ongoingCount  = contests.filter(c => c.processed_status === 'Ongoing').length;
  const upcomingCount = contests.filter(c => c.processed_status === 'Upcoming').length;

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="app-container dashboard-bg intl-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
      <WelcomeBackground />
      <div style={{ width: 48, height: 48, border: '3px solid rgba(109,255,176,.15)', borderTop: '3px solid #6dffb0', borderRadius: '50%', animation: 'spin 1s linear infinite', zIndex: 10 }} />
      <span style={{ color: '#6dffb0', fontSize: 15, fontWeight: 600, letterSpacing: '0.05em', zIndex: 10 }}>SYNCING LIVE CONTESTS</span>
      <span style={{ color: '#4455aa', fontSize: 12, zIndex: 10 }}>Connecting to clist.by…</span>
    </div>
  );

  if (error) return (
    <div className="app-container dashboard-bg intl-bg" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <WelcomeBackground />
      <WifiOff size={36} color="#ff6b6b" style={{ zIndex: 10 }} />
      <span style={{ color: '#ff6b6b', fontSize: 16, fontWeight: 600, zIndex: 10 }}>Failed to load contests</span>
      <span style={{ color: '#8899bb', fontSize: 13, zIndex: 10 }}>{error}</span>
      <button onClick={() => fetchContests()} style={{ marginTop: 8, zIndex: 10, background: 'rgba(99,140,255,.15)', border: '1px solid rgba(99,140,255,.3)', color: '#7eaaff', borderRadius: 10, padding: '10px 20px', cursor: 'pointer', fontWeight: 600 }}>
        Try Again
      </button>
    </div>
  );

  // ── Main UI ───────────────────────────────────────────────────────────────
  return (
    <div className="app-container dashboard-bg intl-bg" onClick={() => setOpenSort(false)} style={{ minHeight: '100vh' }}>
      <WelcomeBackground />
      <div className="bg-glow" />

      {/* ── Header ── */}
      <header className="intl-header">
        <button className="back-btn" onClick={onBack}><ArrowLeft size={14} style={{ marginRight: 4 }} />Back</button>
        <div className="logo center-logo">
          <Aperture className="logo-icon glow-icon" color="#e0e0e0" />
          <span className="logo-text">CONTEST <span className="logo-accent">HUB</span></span>
        </div>
        <div className="header-placeholder" />
      </header>

      <main className="intl-main" onClick={e => e.stopPropagation()} style={{ maxWidth: 1100, margin: '0 auto', width: '100%' }}>

        {/* ── Page Title + Stats ── */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <h1 style={{ fontSize: '2.4rem', fontWeight: 700, color: '#fff', margin: '0 0 10px', letterSpacing: '-0.5px' }}>
              🌐 International Competitions
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#6dffb0', boxShadow: '0 0 8px #6dffb0', display: 'inline-block', animation: 'pulse 1.5s ease-in-out infinite' }} />
                <span style={{ fontSize: 12, color: '#6dffb0', fontWeight: 700 }}>LIVE · clist.by</span>
              </div>
              <div style={{ display: 'flex', gap: 10 }}>
                <span style={{ fontSize: 12, background: 'rgba(109,255,176,.1)', border: '1px solid rgba(109,255,176,.2)', color: '#6dffb0', borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>
                  {ongoingCount} Ongoing
                </span>
                <span style={{ fontSize: 12, background: 'rgba(96,180,255,.1)', border: '1px solid rgba(96,180,255,.2)', color: '#60b4ff', borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>
                  {upcomingCount} Upcoming
                </span>
                <span style={{ fontSize: 12, background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.08)', color: '#8899bb', borderRadius: 20, padding: '2px 10px', fontWeight: 600 }}>
                  {contests.length} Total
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => fetchContests(true)}
            disabled={refreshing}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 7,
              background: 'rgba(99,140,255,.1)', border: '1px solid rgba(99,140,255,.25)',
              color: '#7eaaff', borderRadius: 10, padding: '9px 18px',
              cursor: 'pointer', fontWeight: 600, fontSize: 13,
              opacity: refreshing ? 0.6 : 1, transition: 'all .2s',
            }}
          >
            <RefreshCw size={13} style={{ animation: refreshing ? 'spin 1s linear infinite' : 'none' }} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>

        {/* ── Toolbar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap',
          marginBottom: 20, padding: '12px 16px',
          background: 'rgba(255,255,255,.025)', border: '1px solid rgba(255,255,255,.06)',
          borderRadius: 14,
        }}>
          {/* Search */}
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#667799', pointerEvents: 'none' }} />
            <input
              type="text"
              placeholder="Search contests or platforms…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                width: '100%', padding: '8px 12px 8px 34px', boxSizing: 'border-box',
                background: 'rgba(0,0,0,.3)', border: '1px solid rgba(255,255,255,.07)',
                borderRadius: 10, color: '#e0eaff', fontSize: 13, outline: 'none',
                fontFamily: 'inherit',
              }}
            />
            {search && (
              <button onClick={() => setSearch('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#667799', cursor: 'pointer', padding: 0 }}>
                <X size={13} />
              </button>
            )}
          </div>

          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,.07)' }} />

          {/* Platform Filter */}
          <FilterPill
            label="Platform" value={platformFilter}
            options={uniquePlatforms} onChange={setPlatformFilter}
            icon={Globe2}
          />

          {/* Status Filter */}
          <FilterPill
            label="Status" value={statusFilter}
            options={uniqueStatuses} onChange={setStatusFilter}
            icon={Zap}
          />

          <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,.07)' }} />

          {/* Sort */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={e => { e.stopPropagation(); setOpenSort(p => !p); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)',
                color: '#a0b4cc', borderRadius: 10, padding: '8px 14px',
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
              }}
            >
              <ListOrdered size={13} />
              Sort: {sortOptions.find(o => o.key === sortBy)?.label}
              <ChevronDown size={12} style={{ opacity: 0.6, transform: openSort ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
            </button>
            {openSort && (
              <ul onClick={e => e.stopPropagation()} style={{
                position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 300,
                background: '#0b1220', border: '1px solid rgba(255,255,255,.1)',
                borderRadius: 12, padding: '6px', minWidth: 160,
                boxShadow: '0 20px 50px rgba(0,0,0,.8)', listStyle: 'none', margin: 0,
              }}>
                {sortOptions.map(opt => (
                  <li key={opt.key} onClick={() => { setSortBy(opt.key); setOpenSort(false); }}
                    style={{
                      padding: '9px 13px', fontSize: 13, borderRadius: 8,
                      color: sortBy === opt.key ? '#fff' : '#8899bb',
                      fontWeight: sortBy === opt.key ? 700 : 400,
                      background: sortBy === opt.key ? 'rgba(99,140,255,.15)' : 'transparent',
                      cursor: 'pointer',
                    }}>
                    {opt.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Active filter chips */}
          {(platformFilter !== 'All' || statusFilter !== 'All' || search) && (
            <button
              onClick={() => { setPlatformFilter('All'); setStatusFilter('All'); setSearch(''); }}
              style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(255,107,107,.08)', border: '1px solid rgba(255,107,107,.2)', color: '#ff6b6b', borderRadius: 10, padding: '8px 12px', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}
            >
              <X size={11} /> Clear Filters
            </button>
          )}
        </div>

        {/* ── Results count ── */}
        <div style={{ marginBottom: 16, fontSize: 12, color: '#44557a', fontWeight: 600, letterSpacing: '0.04em' }}>
          SHOWING {result.length} OF {contests.length} CONTESTS
        </div>

        {/* ── Contest Cards ── */}
        {result.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 20px', gap: 16 }}>
            <Globe2 size={48} color="#1a2a4a" />
            <p style={{ color: '#4455aa', fontSize: 15, fontWeight: 600 }}>No contests match your filters.</p>
            <button onClick={() => { setPlatformFilter('All'); setStatusFilter('All'); setSearch(''); }} style={{ background: 'rgba(99,140,255,.1)', border: '1px solid rgba(99,140,255,.25)', color: '#7eaaff', borderRadius: 10, padding: '9px 18px', cursor: 'pointer', fontWeight: 600, fontSize: 13 }}>
              Clear All Filters
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {result.map((contest, idx) => (
              <ContestCard key={contest.id ?? idx} contest={contest} idx={idx} />
            ))}
          </div>
        )}

        <p style={{ textAlign: 'center', marginTop: 32, fontSize: 11, color: '#1e2e44' }}>
          Data sourced from{' '}
          <a href="https://clist.by" target="_blank" rel="noopener noreferrer" style={{ color: '#7eaaff' }}>clist.by</a>
          {' '}· Live synchronization via ContestHUB
        </p>
      </main>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:.4} 50%{opacity:1} }
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .intl-main input::placeholder { color: #445577; }
        .intl-main input:focus { border-color: rgba(99,140,255,.4) !important; box-shadow: 0 0 0 3px rgba(99,140,255,.1); }
      `}</style>
    </div>
  );
}
