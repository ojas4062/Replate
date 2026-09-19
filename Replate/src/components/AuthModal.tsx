import React, { useState } from 'react';
import type { User, UserRole } from '../types';

interface AuthProps {
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [role, setRole] = useState<UserRole>('ngo');
  const [email, setEmail] = useState('contact@hopefoundation.org');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Hope Shelter Admin');
  const [orgName, setOrgName] = useState('Hope Foundation Shelter');
  const [phone, setPhone] = useState('+91 98765 12345');
  const [address, setAddress] = useState('12 Gandhi Road, Sector 4');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let defaultUser: User = {
      id: 'user-' + Date.now(),
      name: name || 'Demo User',
      email: email || 'demo@zeroplate.org',
      phone: phone || '+91 98765 00000',
      address: address || 'Community Center, City',
      role: role,
      orgName: role !== 'personal' ? (orgName || 'Demo Organization') : undefined
    };

    if (!isSignUp) {
      if (role === 'hotel') {
        defaultUser = {
          id: 'h-1',
          name: 'Manager Rajesh Kumar',
          email: 'chef@grandhorizon.com',
          phone: '+91 98765 43210',
          address: '77 Grand Avenue, Downtown',
          role: 'hotel',
          orgName: 'Grand Horizon Hotel & Buffet'
        };
      } else if (role === 'ngo') {
        defaultUser = {
          id: 'ngo-1',
          name: 'Priya Sharma (Coordinator)',
          email: 'contact@hopefoundation.org',
          phone: '+91 98765 12345',
          address: '12 Gandhi Road, Sector 4',
          role: 'ngo',
          orgName: 'Hope Foundation Shelter'
        };
      } else {
        defaultUser = {
          id: 'p-1',
          name: 'Aarav Sharma',
          email: 'aarav.s@gmail.com',
          phone: '+91 98765 88990',
          address: '45 Lakeview Apartments, Sector 12',
          role: 'personal'
        };
      }
    }

    onLogin(defaultUser);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', background: 'radial-gradient(circle at top, #131B2E 0%, #0B0F17 100%)' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '480px', padding: '2rem 2.5rem', border: '1px solid var(--border-active)' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '54px', height: '54px', background: 'linear-gradient(135deg, #10B981 0%, #059669 100%)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.8rem', fontWeight: 800, color: 'white', boxShadow: 'var(--shadow-glow)' }}>
            Z
          </div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, margin: '0 0 0.25rem' }}>ZERO PLATE</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Predict better. Prepare smarter. Waste less.</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" style={{ marginBottom: '0.6rem', display: 'block' }}>Select Portal Account Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
              <button
                type="button"
                className={`btn btn-sm ${role === 'hotel' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flexDirection: 'column', padding: '0.75rem 0.25rem', gap: '0.3rem', fontSize: '0.75rem' }}
                onClick={() => setRole('hotel')}
              >
                Hotel / Mess
              </button>

              <button
                type="button"
                className={`btn btn-sm ${role === 'ngo' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flexDirection: 'column', padding: '0.75rem 0.25rem', gap: '0.3rem', fontSize: '0.75rem' }}
                onClick={() => setRole('ngo')}
              >
                NGO / Org
              </button>

              <button
                type="button"
                className={`btn btn-sm ${role === 'personal' ? 'btn-primary' : 'btn-secondary'}`}
                style={{ flexDirection: 'column', padding: '0.75rem 0.25rem', gap: '0.3rem', fontSize: '0.75rem' }}
                onClick={() => setRole('personal')}
              >
                Personal
              </button>
            </div>
          </div>

          {isSignUp && (
            <>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Enter your name" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  required 
                />
              </div>

              {role !== 'personal' && (
                <div className="form-group">
                  <label className="form-label">Organization / Hotel Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    placeholder="e.g. City Food Bank / Sunrise Hotel" 
                    value={orgName} 
                    onChange={(e) => setOrgName(e.target.value)} 
                    required 
                  />
                </div>
              )}

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="+91 98765 00000" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  required 
                />
              </div>

              <div className="form-group">
                <label className="form-label">Address</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Street address & area" 
                  value={address} 
                  onChange={(e) => setAddress(e.target.value)} 
                  required 
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Email / Phone</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="user@organization.org" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-input" 
              placeholder="••••••••" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            {isSignUp ? 'Create Account & Access Portal' : `Log In to ${role.toUpperCase()} Portal`}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {isSignUp ? 'Already registered?' : 'New to ZeroPlate?'}
          </span>{' '}
          <button 
            type="button" 
            onClick={() => setIsSignUp(!isSignUp)}
            style={{ background: 'none', border: 'none', color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem' }}
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>

      </div>
    </div>
  );
};
