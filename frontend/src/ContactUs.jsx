import { Aperture, ArrowLeft, Phone, Mail, ExternalLink, Users } from 'lucide-react';
import { FaLinkedin, FaGithub, FaPhone, FaEnvelope } from 'react-icons/fa';
import WelcomeBackground from './WelcomeBackground';

const TEAM = [
  {
    name: 'Haider Javed',
    role: 'Full-Stack Developer',
    initials: 'HJ',
    accent: '#60a5fa',
    glow: 'rgba(96,165,250,0.35)',
    phone: '+92 324 2806089',
    email: 'hjaved.bscs25seecs@seecs.edu.pk',
    linkedin: 'https://www.linkedin.com/in/haider-javed-724223384/',
    github: null,
  },
  {
    name: 'Muhammad Azeem Ud Din Babar',
    role: 'Backend Developer',
    initials: 'AB',
    accent: '#a78bfa',
    glow: 'rgba(167,139,250,0.35)',
    phone: '+92 314 6155834',
    email: 'mbabar1555@gmail.com',
    linkedin: 'https://www.linkedin.com/in/muhammad-azeem-ud-din-babar-9833b0380/',
    github: null,
  },
  {
    name: 'Hamza Mukhtar',
    role: 'Frontend Developer',
    initials: 'HM',
    accent: '#f472b6',
    glow: 'rgba(244,114,182,0.35)',
    phone: '+92 311 3978255',
    email: '06hmkango@gmail.com',
    linkedin: 'https://www.linkedin.com/in/hamza-mukhtar-a3a35525b/',
    github: null,
  },
];

function ContactLink({ href, icon: Icon, label, color }) {
  if (!href && href !== 0) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      title={label}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '9px 16px', borderRadius: 10,
        background: `${color}12`,
        border: `1px solid ${color}30`,
        color: color, fontSize: 13, fontWeight: 600,
        textDecoration: 'none', transition: 'all 0.25s',
        whiteSpace: 'nowrap', flex: '1 1 auto',
        justifyContent: 'center',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = `${color}25`;
        e.currentTarget.style.borderColor = `${color}70`;
        e.currentTarget.style.boxShadow = `0 4px 16px ${color}30`;
        e.currentTarget.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = `${color}12`;
        e.currentTarget.style.borderColor = `${color}30`;
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <Icon size={14} />
      {label}
    </a>
  );
}

function MemberCard({ member, idx }) {
  const { name, role, initials, accent, glow, phone, email, linkedin, github } = member;
  return (
    <div
      style={{
        position: 'relative', overflow: 'hidden',
        background: 'rgba(10, 14, 28, 0.7)',
        backdropFilter: 'blur(24px)',
        border: `1px solid ${accent}25`,
        borderRadius: 24,
        padding: '36px 30px 30px',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        boxShadow: `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 ${accent}15`,
        animation: `cardIn 0.5s ease both`,
        animationDelay: `${idx * 100}ms`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = `0 24px 64px rgba(0,0,0,0.7), 0 0 0 1px ${accent}45, 0 0 60px ${glow}`;
        e.currentTarget.style.borderColor = `${accent}55`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 ${accent}15`;
        e.currentTarget.style.borderColor = `${accent}25`;
      }}
    >
      {/* Top shimmer gradient */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 4,
        background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        borderRadius: '24px 24px 0 0',
      }} />

      {/* Background watermark initial */}
      <div style={{
        position: 'absolute', right: 20, bottom: 10,
        fontSize: 110, fontWeight: 900, color: accent,
        opacity: 0.04, lineHeight: 1,
        fontFamily: 'monospace', pointerEvents: 'none', userSelect: 'none',
      }}>
        {initials}
      </div>

      {/* Avatar */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
        <div style={{
          width: 90, height: 90, borderRadius: '50%',
          background: `radial-gradient(circle at 30% 30%, ${accent}55, ${accent}15)`,
          border: `2px solid ${accent}50`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, fontWeight: 800, color: accent, letterSpacing: -1,
          boxShadow: `0 0 30px ${glow}, 0 0 60px ${glow.replace('0.35', '0.15')}`,
          marginBottom: 16, position: 'relative',
        }}>
          {initials}
          {/* Orbit ring */}
          <div style={{
            position: 'absolute', inset: -8,
            borderRadius: '50%', border: `1px dashed ${accent}30`,
            animation: 'spin 12s linear infinite',
          }} />
        </div>

        <h3 style={{
          margin: '0 0 6px', fontSize: 18, fontWeight: 800,
          color: '#f0f4ff', textAlign: 'center', lineHeight: 1.2,
        }}>
          {name}
        </h3>
        <span style={{
          display: 'inline-block', fontSize: 11, fontWeight: 700,
          color: accent, background: `${accent}12`, border: `1px solid ${accent}30`,
          borderRadius: 20, padding: '3px 12px', letterSpacing: '0.08em', textTransform: 'uppercase',
        }}>
          {role}
        </span>
      </div>

      {/* Contact details */}
      <div style={{ marginBottom: 22 }}>
        {/* Phone */}
        <a
          href={`tel:${phone.replace(/\s/g, '')}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 14px', borderRadius: 10, marginBottom: 8,
            background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)',
            textDecoration: 'none', color: '#c8d4ee', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${accent}0f`; e.currentTarget.style.borderColor = `${accent}30`; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)'; }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}15`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FaPhone size={13} color={accent} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: 10, color: '#4a5a7a', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Phone</p>
            <p style={{ margin: 0, fontSize: 13, color: '#c8d4ee', fontWeight: 600, fontFamily: 'monospace' }}>{phone}</p>
          </div>
        </a>

        {/* Email */}
        <a
          href={`mailto:${email}`}
          style={{
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '11px 14px', borderRadius: 10,
            background: 'rgba(255,255,255,.03)', border: '1px solid rgba(255,255,255,.06)',
            textDecoration: 'none', color: '#c8d4ee', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = `${accent}0f`; e.currentTarget.style.borderColor = `${accent}30`; }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,.06)'; }}
        >
          <div style={{ width: 32, height: 32, borderRadius: 8, background: `${accent}15`, border: `1px solid ${accent}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <FaEnvelope size={13} color={accent} />
          </div>
          <div style={{ minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: 10, color: '#4a5a7a', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>Email</p>
            <p style={{ margin: 0, fontSize: 12, color: '#c8d4ee', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</p>
          </div>
        </a>
      </div>

      {/* Social links */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {linkedin && (
          <ContactLink href={linkedin} icon={FaLinkedin} label="LinkedIn" color="#0e76a8" />
        )}
        {github && (
          <ContactLink href={github} icon={FaGithub} label="GitHub" color="#c8d4ee" />
        )}
      </div>
    </div>
  );
}

export default function ContactUs({ onBack }) {
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
        <div style={{ textAlign: 'center', padding: '48px 0 52px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(167,139,250,.1)', border: '1px solid rgba(167,139,250,.25)', borderRadius: 20, padding: '5px 16px', marginBottom: 22 }}>
            <Users size={12} color="#a78bfa" />
            <span style={{ fontSize: 11, color: '#a78bfa', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>Meet the Team</span>
          </div>

          <h1 style={{ fontSize: '3.2rem', fontWeight: 800, color: '#fff', margin: '0 0 14px', letterSpacing: '-1.5px', lineHeight: 1.1 }}>
            Contact{' '}
            <span style={{
              background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              filter: 'drop-shadow(0 0 24px rgba(167,139,250,0.5))',
            }}>
              Our Team
            </span>
          </h1>
          <p style={{ color: '#6b7a99', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            ContestHUB is built with ❤️ by three passionate developers from NUST SEECS.
            Reach out to us for collaborations, feedback, or any questions.
          </p>
        </div>

        {/* Team Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {TEAM.map((member, idx) => (
            <MemberCard key={member.name} member={member} idx={idx} />
          ))}
        </div>

        {/* Footer note */}
        <div style={{ textAlign: 'center', marginTop: 56, padding: '28px 32px', background: 'rgba(10,14,28,.6)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,.05)', borderRadius: 20 }}>
          <p style={{ margin: '0 0 8px', fontSize: 14, color: '#8899bb', lineHeight: 1.7 }}>
            🎓 <strong style={{ color: '#c8d4ee' }}>CS-220 Database Systems Project</strong>
          </p>
          <p style={{ margin: 0, fontSize: 12, color: '#4a5a7a' }}>
            Department of Computing · National University of Sciences and Technology (NUST) · SEECS
          </p>
        </div>
      </main>

      <style>{`
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
      `}</style>
    </div>
  );
}
