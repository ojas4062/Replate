import React from 'react';
import { LogOut, User as UserIcon, Utensils, HeartHandshake } from 'lucide-react';
import type { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ user, activeTab, setActiveTab, onLogout }) => {
  if (!user) return null;

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'hotel':
        return { label: 'Hotel / Mess Provider', icon: Utensils, color: '#10B981' };
      case 'ngo':
        return { label: 'NGO / Organization', icon: HeartHandshake, color: '#3B82F6' };
      case 'personal':
      default:
        return { label: 'Personal Claimant', icon: UserIcon, color: '#8B5CF6' };
    }
  };

  const roleInfo = getRoleBadge(user.role);
  const RoleIcon = roleInfo.icon;

  const renderNavLinks = () => {
    if (user.role === 'hotel') {
      return (
        <>
          <button 
            className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'predict' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('predict')}
          >
            Predict & Prepare
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'post-surplus' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('post-surplus')}
          >
            Post Surplus
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'incoming-claims' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('incoming-claims')}
          >
            Incoming Claims
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'earnings' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('earnings')}
          >
            Earnings
          </button>
        </>
      );
    }

    if (user.role === 'ngo') {
      return (
        <>
          <button 
            className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'map' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('map')}
          >
            Browse Map
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'my-claims' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('my-claims')}
          >
            My Claims
          </button>
          <button 
            className={`btn btn-sm ${activeTab === 'impact' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('impact')}
          >
            Impact / Allocation
          </button>
        </>
      );
    }

    return (
      <>
        <button 
          className={`btn btn-sm ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`btn btn-sm ${activeTab === 'map' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('map')}
        >
          Browse Map
        </button>
        <button 
          className={`btn btn-sm ${activeTab === 'my-claims' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => setActiveTab('my-claims')}
        >
          My Claims
        </button>
      </>
    );
  };

  return (
    <header className="glass-panel" style={{ borderRadius: 0, borderTop: 0, borderLeft: 0, borderRight: 0, padding: '0.85rem 1.5rem', marginBottom: '1.5rem' }}>
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', width: '36px', height: '36px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem', color: 'white' }}>
            Z
          </div>
          <div>
            <h2 style={{ fontSize: '1.15rem', margin: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              ZERO<span style={{ color: '#10B981' }}>PLATE</span>
            </h2>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Predict better. Prepare smarter. Waste less.</span>
          </div>
        </div>

        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {renderNavLinks()}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={() => setActiveTab('profile')}
            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.4rem 0.8rem', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', textAlign: 'left' }}
          >
            <div style={{ background: roleInfo.color + '22', color: roleInfo.color, padding: '0.35rem', borderRadius: '6px' }}>
              <RoleIcon size={16} />
            </div>
            <div>
              <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-main)' }}>{user.orgName || user.name}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{roleInfo.label}</div>
            </div>
          </button>

          <button 
            className="btn btn-secondary btn-sm"
            onClick={onLogout}
            title="Log Out"
          >
            <LogOut size={15} />
          </button>
        </div>

      </div>
    </header>
  );
};
