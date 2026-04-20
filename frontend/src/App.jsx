import { useState, useRef } from 'react';
import {
  Sparkles, Aperture, ArrowUpRight, Loader2,
  Globe2, Flag, Users, UserCircle,
  Calendar, Clock, Timer, ChevronDown,
  Filter, Trophy, Code2, MonitorPlay, Terminal, Database, Upload,
  Mail, Lock, User
} from 'lucide-react';
import { FaTwitter, FaInstagram, FaFacebook } from 'react-icons/fa';
import WelcomeBackground from './WelcomeBackground';
import NationalCompetitions from './NationalCompetitions';
import InternationalCompetitions from './InternationalCompetitions';
import Leaderboard from './Leaderboard';
import Problems from './Problems';
import CPBackground from './CPBackground';
import ContactUs from './ContactUs';
import Resources from './Resources';
import './Hub.css';
import './App.css';

function App() {
  const [currentView, setCurrentView] = useState('signup'); // 'signup', 'login', 'welcome', ...
  const [user, setUser] = useState(null); // { userId, username, email, profilePic }
  const [errorMsg, setErrorMsg] = useState('');
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  
  const fileInputRef = useRef(null);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const username = e.target.username.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const confirm = e.target.confirmPassword.value;

    if (password !== confirm) return setErrorMsg("Passwords do not match");

    try {
      const res = await fetch('http://localhost:3000/signup', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setUser({ userId: data.user._id, username: data.user.username, email: data.user.email, profilePic: data.user.profilePic });
      setCurrentView('welcome');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch('http://localhost:3000/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUser({ userId: data.user._id, username: data.user.username, email: data.user.email, profilePic: data.user.profilePic });
      setCurrentView('welcome');
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  const handleProfileClick = () => {
    if (fileInputRef.current) fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    setShowProfileDropdown(false);
    if (!file || !user) return;
    
    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result;
      setUser({ ...user, profilePic: base64String }); // Optimistic update
      
      try {
        await fetch('http://localhost:3000/update-profile', {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.userId, profilePic: base64String })
        });
      } catch (err) {
        console.error("Failed to update profile pic:", err);
      }
    };
    reader.readAsDataURL(file);
  };

  const renderProfileCircle = () => {
    if (!user) return <UserCircle className="profile-icon" />;
    return (
      <>
        <label htmlFor="profile-upload" className="profile-wrapper" title="Change Profile Picture" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', margin: 0 }}>
          <span className="profile-username">{user.username}</span>
          {user.profilePic ? (
            <img src={user.profilePic} alt="profile" className="profile-circle-img" style={{ transition: 'transform 0.2s', border: '2px solid rgba(255,255,255,0.1)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = `rgba(255,255,255,0.3)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = `rgba(255,255,255,0.1)`; }} />
          ) : (
            <div className="profile-circle-text" style={{ transition: 'transform 0.2s', border: '2px solid rgba(255,255,255,0.1)' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.borderColor = `rgba(255,255,255,0.3)`; }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.borderColor = `rgba(255,255,255,0.1)`; }}>
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </label>

        {/* Always in DOM so the file dialog can open reliably */}
        <input
          id="profile-upload"
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
      </>
    );
  };

  // ── National Competitions ─────────────────────────────────────────────────
  if (currentView === 'natl-competitions') {
    return <NationalCompetitions onBack={() => setCurrentView('competitions')} />;
  }

  // ── Leaderboard ───────────────────────────────────────────────────────────
  if (currentView === 'leaderboard') {
    return <Leaderboard onBack={() => setCurrentView('competitions')} />;
  }

  // ── International Competitions ────────────────────────────────────────────
  if (currentView === 'intl-competitions') {
    return <InternationalCompetitions onBack={() => setCurrentView('competitions')} />;
  }

  // ── Welcome ───────────────────────────────────────────────────────────────
  if (currentView === 'welcome') {
    return (
      <div className="app-container dashboard-bg">
        <WelcomeBackground />
        
        <main className="welcome-main premium-hero">
          <div className="hero-glass-card">
            <div className="status-pill premium-status-pill">
              <div className="pulse-dot"></div>
              <span>SYSTEM ONLINE • SECURE CONNECTION</span>
            </div>
            
            <h1 className="welcome-title main-title">
              <span className="title-pretext">Welcome to</span><br />
              <span className="aesthetic-gradient">Contest Hub</span>
            </h1>
            
            <p className="welcome-subtitle premium-subtitle">
              The centralized dashboard for competitive programmers.<br/>
              Track, filter, and master global algorithmic challenges.
            </p>
            
            <div className="hero-actions">
              <button className="premium-btn" onClick={() => setCurrentView('competitions')}>
                <span className="btn-text">Initialize Dashboard</span>
                <span className="btn-icon-wrapper">
                  <ArrowUpRight className="arrow-icon" size={18} />
                </span>
                <div className="btn-glow"></div>
              </button>
            </div>
            
            <div className="hero-socials">
              <a href="#" className="social-icon-wrapper"><FaTwitter size={20} /></a>
              <a href="#" className="social-icon-wrapper"><FaInstagram size={20} /></a>
              <a href="#" className="social-icon-wrapper"><FaFacebook size={20} /></a>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Competitions Hub ──────────────────────────────────────────────────────
  if (currentView === 'competitions') {
    return (
      <div className="app-container dashboard-bg">
        <WelcomeBackground />
        
        <header className="competitions-header">
          <div className="logo">
            <Aperture className="logo-icon glow-icon" color="#e0e0e0" />
            <span className="logo-text">CONTEST <span className="logo-accent">HUB</span></span>
          </div>
          <nav className="comps-nav premium-nav">
            <a href="#" className="active" onClick={(e) => { e.preventDefault(); setCurrentView('competitions'); }}>Home</a>
            <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer">Calendar</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('resources'); }}>Resources</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setCurrentView('contact'); }}>Contact Us</a>
            <div className="profile-link">
              {renderProfileCircle()}
            </div>
          </nav>
        </header>

        <main className="hub-main">
          <div className="hub-hero" style={{ marginTop: '3rem' }}>
            <h1 className="main-title" style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
              <span className="aesthetic-gradient">ContestHUB</span>
            </h1>
            <p className="premium-subtitle" style={{ margin: '0 auto' }}>
              Select a module to begin your competitive programming journey.
            </p>
          </div>
          
          <div className="hub-grid">
            
            {/* International */}
            <div className="hub-card intl-card" onClick={() => setCurrentView('intl-competitions')}>
              <div className="hub-card-content">
                <div className="hub-card-header">
                  <div className="hub-icon-wrapper">
                    <Globe2 size={28} />
                  </div>
                  <h3>International<br/>Competitions</h3>
                </div>
                <p>Compete on a global scale. Participate in prestigious algorithmic contests against the best worldwide.</p>
                <div className="hub-card-footer">
                  <span className="hub-action-text">Join Contests</span>
                  <div className="hub-arrow"><ArrowUpRight size={16} color="#60a5fa" /></div>
                </div>
              </div>
            </div>
            
            {/* National */}
            <div className="hub-card natl-card" onClick={() => setCurrentView('natl-competitions')}>
              <div className="hub-card-content">
                <div className="hub-card-header">
                  <div className="hub-icon-wrapper">
                    <Flag size={28} />
                  </div>
                  <h3>National<br/>Competitions</h3>
                </div>
                <p>Dominate your local region. Climb the national leaderboards and showcase your localized talent.</p>
                <div className="hub-card-footer">
                  <span className="hub-action-text">Join Contests</span>
                  <div className="hub-arrow"><ArrowUpRight size={16} color="#f472b6" /></div>
                </div>
              </div>
            </div>
            
            {/* Problems Section */}
            <div className="hub-card prob-card" onClick={() => setCurrentView('problems')}>
              <div className="hub-card-content">
                <div className="hub-card-header">
                  <div className="hub-icon-wrapper">
                    <Code2 size={28} />
                  </div>
                  <h3>Algorithmic<br/>Problems</h3>
                </div>
                <p>Sharpen your logic. Solve varying difficulty problems and master specialized data structures.</p>
                <div className="hub-card-footer">
                  <span className="hub-action-text">Solve Now</span>
                  <div className="hub-arrow"><ArrowUpRight size={16} color="#10b981" /></div>
                </div>
              </div>
            </div>
            
            {/* Leaderboard */}
            <div className="hub-card rank-card" onClick={() => setCurrentView('leaderboard')}>
              <div className="hub-card-content">
                <div className="hub-card-header">
                  <div className="hub-icon-wrapper">
                    <Trophy size={28} />
                  </div>
                  <h3>Global<br/>Leaderboard</h3>
                </div>
                <p>See where you stand. Track the rankings of top tier programmers and compare your accounts.</p>
                <div className="hub-card-footer">
                  <span className="hub-action-text">View Rankings</span>
                  <div className="hub-arrow"><ArrowUpRight size={16} color="#f59e0b" /></div>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    );
  }

  // ── Problems ──────────────────────────────────────────────────────────────
  if (currentView === 'problems') {
    return <Problems onBack={() => setCurrentView('competitions')} user={user} />;
  }

  // ── Contact Us ────────────────────────────────────────────────────────────
  if (currentView === 'contact') {
    return <ContactUs onBack={() => setCurrentView('competitions')} />;
  }

  // ── Resources ─────────────────────────────────────────────────────────────
  if (currentView === 'resources') {
    return <Resources onBack={() => setCurrentView('competitions')} />;
  }

  // ── Login Component Block ──────────────────────────────────────────────────
  if (currentView === 'login') {
    return (
      <div className="auth-container">
        <CPBackground />
        <div className="bg-glow"></div>
        
        <header className="auth-header">
          <div className="logo">
            <Aperture className="logo-icon glow-icon" color="#e0e0e0" />
            <span className="logo-text">CONTEST <span className="logo-accent">HUB</span></span>
          </div>
        </header>

        <main className="auth-main">
          <div className="auth-hero">
            <h1 className="hero-title">Welcome <span className="italic">Back</span></h1>
            <p className="hero-subtitle">Login to access your high-performance dashboard</p>
          </div>

          <div className="form-container glass-panel">
            {errorMsg && <div className="error-alert">{errorMsg}</div>}
            <form onSubmit={handleLogin} className="auth-form">
              
              <div className="input-group has-icon">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <Mail className="input-icon" size={18} />
                  <input type="email" id="email" required placeholder="name@example.com" />
                </div>
              </div>
              
              <div className="input-group has-icon">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input type="password" id="password" required placeholder="Enter your password" />
                </div>
              </div>
              
              <button type="submit" className="submit-btn glowing-btn">
                <span>Secure Login</span>
                <ArrowUpRight size={16} />
              </button>
            </form>
            
            <div className="auth-footer">
              <span className="text-muted">Need an account?</span>
              <button type="button" className="text-link" onClick={() => setCurrentView('signup')}>
                Sign up instead
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // ── Sign-up (default) ─────────────────────────────────────────────────────
  return (
    <div className="auth-container">
      <CPBackground />
      <div className="bg-glow"></div>
      
      <header className="auth-header">
        <div className="logo">
          <Aperture className="logo-icon glow-icon" color="#e0e0e0" />
          <span className="logo-text">CONTEST <span className="logo-accent">HUB</span></span>
        </div>
      </header>

      <main className="auth-main">
        <div className="auth-hero">
          <h1 className="hero-title">Join the <span className="italic">Elite</span></h1>
          <p className="hero-subtitle">Create an account to track your global algorithmic journey</p>
        </div>

        <div className="form-container glass-panel">
          {errorMsg && <div className="error-alert">{errorMsg}</div>}
          <form onSubmit={handleSignUp} className="auth-form">
            
            <div className="input-group has-icon">
              <label htmlFor="username">Username</label>
              <div className="input-wrapper">
                <User className="input-icon" size={18} />
                <input type="text" id="username" required placeholder="coder_ninja" />
              </div>
            </div>
            
            <div className="input-group has-icon">
              <label htmlFor="email">Email Address</label>
              <div className="input-wrapper">
                <Mail className="input-icon" size={18} />
                <input type="email" id="email" required placeholder="name@example.com" />
              </div>
            </div>
            
            <div className="form-row">
              <div className="input-group has-icon">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input type="password" id="password" required placeholder="••••••••" />
                </div>
              </div>
              <div className="input-group has-icon">
                <label htmlFor="confirmPassword">Confirm</label>
                <div className="input-wrapper">
                  <Lock className="input-icon" size={18} />
                  <input type="password" id="confirmPassword" required placeholder="••••••••" />
                </div>
              </div>
            </div>

            <button type="submit" className="submit-btn glowing-btn">
              <span>Create Account</span>
              <ArrowUpRight size={16} />
            </button>
          </form>

          <div className="auth-footer">
            <span className="text-muted">Already have a pass?</span>
            <button type="button" className="text-link" onClick={() => setCurrentView('login')}>
              Login here
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;