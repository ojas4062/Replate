import React, { useState } from 'react';
import type { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

const ROLES: { id: UserRole; label: string; sub: string; icon: string }[] = [
  { id: 'hotel',    label: 'Hotel / Mess',  sub: 'Provider',  icon: '🍽' },
  { id: 'ngo',      label: 'NGO / Org',     sub: 'Claimant',  icon: '🤝' },
  { id: 'personal', label: 'Personal',      sub: 'Individual',icon: '👤' },
];

export const AuthModal: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp]   = useState(false);
  const [role, setRole]           = useState<UserRole>('ngo');
  const [email, setEmail]         = useState('contact@hopefoundation.org');
  const [password, setPassword]   = useState('password123');
  const [name, setName]           = useState('Hope Shelter Admin');
  const [orgName, setOrgName]     = useState('Hope Foundation Shelter');
  const [phone, setPhone]         = useState('+91 98765 12345');
  const [address, setAddress]     = useState('12 Gandhi Road, Sector 4');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let u: User = {
      id: 'user-' + Date.now(),
      name: name || 'Demo User',
      email: email || 'demo@replate.org',
      phone: phone || '+91 98765 00000',
      address: address || 'Community Center, City',
      role,
      orgName: role !== 'personal' ? (orgName || 'Demo Organization') : undefined,
    };
    if (!isSignUp) {
      if (role === 'hotel') u = { id:'h-1', name:'Manager Rajesh Kumar', email:'chef@grandhorizon.com', phone:'+91 98765 43210', address:'77 Grand Avenue, Downtown', role:'hotel', orgName:'Grand Horizon Hotel & Buffet' };
      else if (role === 'ngo') u = { id:'ngo-1', name:'Priya Sharma (Coordinator)', email:'contact@hopefoundation.org', phone:'+91 98765 12345', address:'12 Gandhi Road, Sector 4', role:'ngo', orgName:'Hope Foundation Shelter' };
      else u = { id:'p-1', name:'Aarav Sharma', email:'aarav.s@gmail.com', phone:'+91 98765 88990', address:'45 Lakeview Apartments, Sector 12', role:'personal' };
    }
    onLogin(u);
  };

  return (
    <div style={styles.page}>
      {/* Background accent blobs */}
      <div style={styles.blob1} />
      <div style={styles.blob2} />

      <div style={styles.card} className="stagger">

        {/* ── Wordmark ── */}
        <div style={styles.wordmarkRow}>
          <div style={styles.logoMark}>R</div>
          <div>
            <div style={styles.wordmark}>
              Re<span style={{ color: 'var(--acid)', fontStyle: 'italic' }}>plate</span>
            </div>
            <div style={styles.tagline}>Predict better. Prepare smarter. Waste less.</div>
          </div>
        </div>

        {/* ── Role picker ── */}
        <div style={styles.section}>
          <div style={styles.sectionLabel}>Select portal</div>
          <div style={styles.roleGrid}>
            {ROLES.map(r => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRole(r.id)}
                style={{
                  ...styles.roleBtn,
                  ...(role === r.id ? styles.roleBtnActive : {}),
                }}
              >
                <span style={styles.roleIcon}>{r.icon}</span>
                <span style={styles.roleName}>{r.label}</span>
                <span style={styles.roleSub}>{r.sub}</span>
                {role === r.id && <span style={styles.roleCheck}>✓</span>}
              </button>
            ))}
          </div>
        </div>

        {/* ── Form ── */}
        <form onSubmit={handleSubmit} style={styles.form}>
          {isSignUp && (
            <>
              <Field label="Full Name"       value={name}    onChange={setName}    placeholder="Your full name" />
              {role !== 'personal' && (
                <Field label="Organisation"  value={orgName} onChange={setOrgName} placeholder="Hotel or NGO name" />
              )}
              <Field label="Phone"           value={phone}   onChange={setPhone}   placeholder="+91 98765 00000" />
              <Field label="Address"         value={address} onChange={setAddress} placeholder="Street & area" />
            </>
          )}
          <Field label="Email / Phone" value={email}    onChange={setEmail}    placeholder="you@org.com" />
          <Field label="Password"      value={password} onChange={setPassword} placeholder="••••••••" type="password" />

          <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', marginTop: '0.5rem' }}>
            {isSignUp ? 'Create account' : `Enter ${role} portal →`}
          </button>
        </form>

        {/* ── Toggle ── */}
        <div style={styles.toggle}>
          <span style={{ color: 'var(--mist)', fontSize: '0.83rem' }}>
            {isSignUp ? 'Already registered?' : 'New to Replate?'}
          </span>
          {' '}
          <button
            type="button"
            onClick={() => setIsSignUp(v => !v)}
            style={styles.toggleBtn}
          >
            {isSignUp ? 'Log in' : 'Sign up'}
          </button>
        </div>

      </div>
    </div>
  );
};

/* ── Inline field component — avoids repeating form-group markup ── */
const Field: React.FC<{
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; type?: string;
}> = ({ label, value, onChange, placeholder = '', type = 'text' }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    <input
      type={type}
      className="form-input"
      value={value}
      placeholder={placeholder}
      onChange={e => onChange(e.target.value)}
      required
      style={{ width: '100%' }}
    />
  </div>
);

/* ── Styles object keeps JSX clean ── */
const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem 1rem',
    position: 'relative',
    overflow: 'hidden',
    // Same palette as body — no purple break
    background: 'var(--ink)',
  },

  /* Atmospheric depth blobs — match earthy palette */
  blob1: {
    position: 'absolute',
    top: '-15%', left: '-10%',
    width: '55vw', height: '55vw',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(42,84,56,0.35) 0%, transparent 70%)',
    pointerEvents: 'none',
    zIndex: 0,
  },
  blob2: {
    position: 'absolute',
    bottom: '-20%', right: '-8%',
    width: '45vw', height: '45vw',
    borderRadius: '50%',
    background: 'radial-gradient(circle, rgba(212,98,58,0.09) 0%, transparent 65%)',
    pointerEvents: 'none',
    zIndex: 0,
  },

  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '460px',
    background: 'rgba(20, 43, 31, 0.92)',
    backdropFilter: 'blur(28px)',
    WebkitBackdropFilter: 'blur(28px)',
    border: '1px solid rgba(240,234,214,0.1)',
    borderRadius: '18px',
    padding: '2.4rem 2.6rem',
    boxShadow: '0 24px 64px -16px rgba(0,0,0,0.7), 0 0 0 1px rgba(202,255,77,0.06)',
  },

  wordmarkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.9rem',
    marginBottom: '2rem',
  },
  logoMark: {
    width: '48px', height: '48px',
    background: 'var(--acid)',
    color: 'var(--ink)',
    borderRadius: '12px',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '1.6rem',
    fontFamily: 'var(--font-display)',
    fontStyle: 'italic',
    fontWeight: 400,
    flexShrink: 0,
    boxShadow: '0 4px 20px rgba(202,255,77,0.3)',
  },
  wordmark: {
    fontFamily: 'var(--font-display)',
    fontSize: '1.85rem',
    lineHeight: 1,
    color: 'var(--linen)',
    letterSpacing: '-0.02em',
  },
  tagline: {
    fontSize: '0.76rem',
    color: 'var(--mist)',
    fontFamily: 'var(--font-mono)',
    marginTop: '3px',
    letterSpacing: '0.01em',
  },

  section: { marginBottom: '1.6rem' },
  sectionLabel: {
    fontFamily: 'var(--font-mono)',
    fontSize: '0.72rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'var(--mist)',
    marginBottom: '0.65rem',
  },

  roleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '0.55rem',
  },
  roleBtn: {
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.2rem',
    padding: '0.75rem 0.4rem',
    background: 'rgba(12,26,20,0.6)',
    border: '1px solid rgba(240,234,214,0.1)',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.18s ease',
    color: 'var(--chalk)',
  },
  roleBtnActive: {
    background: 'rgba(202,255,77,0.1)',
    border: '1px solid rgba(202,255,77,0.4)',
    color: 'var(--linen)',
    boxShadow: '0 0 16px rgba(202,255,77,0.12)',
  },
  roleIcon:  { fontSize: '1.4rem', lineHeight: 1 },
  roleName:  { fontSize: '0.78rem', fontWeight: 700, fontFamily: 'var(--font-ui)' },
  roleSub:   { fontSize: '0.66rem', color: 'var(--sage)', fontFamily: 'var(--font-mono)' },
  roleCheck: {
    position: 'absolute',
    top: '5px', right: '7px',
    fontSize: '0.65rem',
    color: 'var(--acid)',
    fontWeight: 800,
  },

  form: { display: 'flex', flexDirection: 'column' },

  toggle: {
    textAlign: 'center',
    marginTop: '1.4rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(240,234,214,0.08)',
  },
  toggleBtn: {
    background: 'none',
    border: 'none',
    color: 'var(--acid)',
    fontWeight: 700,
    cursor: 'pointer',
    fontSize: '0.83rem',
    fontFamily: 'var(--font-ui)',
    textDecoration: 'underline',
    textUnderlineOffset: '3px',
  },
};
