import React from 'react';
import { LogOut, User as UserIcon, Utensils, HeartHandshake } from 'lucide-react';
import type { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

type NavLink = { id: string; label: string };

const HOTEL_LINKS: NavLink[]    = [
  { id: 'dashboard',       label: 'Dashboard'       },
  { id: 'predict',         label: 'Predict & Prepare'},
  { id: 'post-surplus',    label: 'Post Surplus'     },
  { id: 'incoming-claims', label: 'Incoming Claims'  },
  { id: 'earnings',        label: 'Earnings'         },
];
const NGO_LINKS: NavLink[]      = [
  { id: 'dashboard', label: 'Dashboard'        },
  { id: 'map',       label: 'Browse Map'       },
  { id: 'my-claims', label: 'My Claims'        },
  { id: 'impact',    label: 'Impact'           },
];
const PERSONAL_LINKS: NavLink[] = [
  { id: 'dashboard', label: 'Dashboard'  },
  { id: 'map',       label: 'Browse Map' },
  { id: 'my-claims', label: 'My Claims'  },
];

function getRoleLinks(role: UserRole): NavLink[] {
  if (role === 'hotel')    return HOTEL_LINKS;
  if (role === 'ngo')      return NGO_LINKS;
  return PERSONAL_LINKS;
}

function getRoleMeta(role: UserRole) {
  if (role === 'hotel')   return { label: 'Hotel / Mess Provider', Icon: Utensils,       color: 'var(--acid)'  };
  if (role === 'ngo')     return { label: 'NGO / Organization',    Icon: HeartHandshake,  color: '#60A5FA'      };
  return                         { label: 'Personal Claimant',     Icon: UserIcon,        color: 'var(--amber)' };
}

export const Navbar: React.FC<NavbarProps> = ({ user, activeTab, setActiveTab, onLogout }) => {
  if (!user) return null;

  const links    = getRoleLinks(user.role);
  const roleMeta = getRoleMeta(user.role);
  const { Icon, color, label } = roleMeta;

  return (
    <header style={s.header}>
      {/* thin acid top-rule */}
      <div style={s.topRule} />

      <div style={s.inner}>

        {/* ── Wordmark ── */}
        <button style={s.wordmarkBtn} onClick={() => setActiveTab('dashboard')} aria-label="Go to dashboard">
          <span style={s.logoMark}>R</span>
          <span style={s.wordmark}>
            Re<span style={{ color: 'var(--acid)', fontStyle: 'italic' }}>plate</span>
          </span>
        </button>

        {/* ── Nav links ── */}
        <nav style={s.nav} aria-label="Main navigation">
          {links.map(link => {
            const isActive = activeTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => setActiveTab(link.id)}
                style={{
                  ...s.navBtn,
                  ...(isActive ? s.navBtnActive : {}),
                }}
              >
                {link.label}
                {/* animated acid underline */}
                <span style={{
                  ...s.underline,
                  ...(isActive ? s.underlineActive : {}),
                }} />
              </button>
            );
          })}
        </nav>

        {/* ── Right: user chip + logout ── */}
        <div style={s.right}>
          <button
            style={s.userChip}
            onClick={() => setActiveTab('profile')}
            aria-label="View profile"
          >
            <span style={{ ...s.roleIconBox, background: color + '22', color }}>
              <Icon size={14} />
            </span>
            <span style={s.userMeta}>
              <span style={s.userName}>{user.orgName || user.name}</span>
              <span style={s.userRole}>{label}</span>
            </span>
          </button>

          <button
            className="btn btn-secondary btn-sm"
            onClick={onLogout}
            title="Log out"
            aria-label="Log out"
            style={s.logoutBtn}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </header>
  );
};

/* ── Styles ── */
const s: Record<string, React.CSSProperties> = {
  header: {
    position:        'sticky',
    top:             0,
    zIndex:          100,
    marginBottom:    '1.5rem',
    /* Frosted glass with a subtle inner-top border */
    background:      'rgba(14, 28, 20, 0.88)',
    backdropFilter:  'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    borderBottom:    '1px solid rgba(240,234,214,0.08)',
  },

  /* 2px acid-line at very top of header */
  topRule: {
    height:     '2px',
    background: 'linear-gradient(90deg, transparent 0%, var(--acid) 40%, transparent 100%)',
    opacity:    0.55,
  },

  inner: {
    maxWidth:      '1280px',
    margin:        '0 auto',
    padding:       '0 1.5rem',
    height:        '58px',
    display:       'flex',
    alignItems:    'center',
    justifyContent:'space-between',
    gap:           '1.5rem',
  },

  /* Wordmark */
  wordmarkBtn: {
    display:        'flex',
    alignItems:     'center',
    gap:            '0.6rem',
    background:     'none',
    border:         'none',
    cursor:         'pointer',
    padding:        0,
    flexShrink:     0,
  },
  logoMark: {
    width:          '32px',
    height:         '32px',
    background:     'var(--acid)',
    color:          'var(--ink)',
    borderRadius:   '8px',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    fontFamily:     'var(--font-display)',
    fontStyle:      'italic',
    fontSize:       '1.2rem',
    flexShrink:     0,
    boxShadow:      '0 2px 12px rgba(202,255,77,0.25)',
  },
  wordmark: {
    fontFamily:   'var(--font-display)',
    fontSize:     '1.35rem',
    color:        'var(--linen)',
    letterSpacing:'-0.02em',
    lineHeight:   1,
  },

  /* Nav */
  nav: {
    display:    'flex',
    alignItems: 'center',
    gap:        '0.15rem',
    flex:       1,
    flexWrap:   'wrap',
  },
  navBtn: {
    position:       'relative',
    background:     'none',
    border:         'none',
    cursor:         'pointer',
    color:          'var(--mist)',
    fontFamily:     'var(--font-ui)',
    fontWeight:     600,
    fontSize:       '0.835rem',
    padding:        '0.45rem 0.75rem',
    borderRadius:   'var(--r-sm)',
    transition:     'color 0.18s ease, background 0.18s ease',
    letterSpacing:  '0.01em',
    lineHeight:     1,
    display:        'flex',
    flexDirection:  'column',
    alignItems:     'center',
    gap:            '3px',
  },
  navBtnActive: {
    color:      'var(--linen)',
    background: 'rgba(202,255,77,0.07)',
  },

  /* Animated underline — CSS transform driven by active state */
  underline: {
    display:         'block',
    height:          '2px',
    width:           '100%',
    borderRadius:    '2px',
    background:      'var(--acid)',
    transform:       'scaleX(0)',
    transformOrigin: 'left center',
    transition:      'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
  },
  underlineActive: {
    transform: 'scaleX(1)',
  },

  /* Right side */
  right: {
    display:    'flex',
    alignItems: 'center',
    gap:        '0.6rem',
    flexShrink: 0,
  },
  userChip: {
    display:        'flex',
    alignItems:     'center',
    gap:            '0.6rem',
    background:     'rgba(240,234,214,0.04)',
    border:         '1px solid rgba(240,234,214,0.1)',
    borderRadius:   'var(--r-sm)',
    padding:        '0.38rem 0.7rem',
    cursor:         'pointer',
    transition:     'background 0.18s ease, border-color 0.18s ease',
  },
  roleIconBox: {
    width:          '26px',
    height:         '26px',
    borderRadius:   '6px',
    display:        'flex',
    alignItems:     'center',
    justifyContent: 'center',
    flexShrink:     0,
  },
  userMeta: {
    display:       'flex',
    flexDirection: 'column',
    gap:           '1px',
    textAlign:     'left',
  },
  userName: {
    fontSize:   '0.8rem',
    fontWeight: 700,
    color:      'var(--linen)',
    fontFamily: 'var(--font-ui)',
    whiteSpace: 'nowrap',
    maxWidth:   '160px',
    overflow:   'hidden',
    textOverflow:'ellipsis',
  },
  userRole: {
    fontSize:   '0.66rem',
    color:      'var(--mist)',
    fontFamily: 'var(--font-mono)',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    padding: '0.42rem 0.65rem',
  },
};
