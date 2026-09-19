import React, { useState } from 'react';
import type { User } from '../types';
import { ShieldCheck, Save } from 'lucide-react';

interface ProfilePageProps {
  user: User;
  onUpdateUser: (updated: User) => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onUpdateUser }) => {
  const [name, setName] = useState(user.name);
  const [phone, setPhone] = useState(user.phone);
  const [email, setEmail] = useState(user.email);
  const [address, setAddress] = useState(user.address);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      ...user,
      name,
      phone,
      email,
      address
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Account Profile & Settings</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Contact details and role configuration. Shared across portals.
        </p>
      </div>

      <form className="glass-card" style={{ padding: '2rem' }} onSubmit={handleSave}>
        
        {savedSuccess && (
          <div className="status-banner success" style={{ marginTop: 0, marginBottom: '1.5rem' }}>
            <ShieldCheck size={18} />
            <span>Profile details updated successfully!</span>
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Account Role (Read-only)</label>
          <input 
            type="text" 
            className="form-input" 
            value={user.role.toUpperCase() + ' PORTAL'} 
            disabled 
            style={{ opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)' }} 
          />
        </div>

        {user.orgName && (
          <div className="form-group">
            <label className="form-label">Organization / Hotel Name</label>
            <input 
              type="text" 
              className="form-input" 
              value={user.orgName} 
              disabled 
              style={{ opacity: 0.7, cursor: 'not-allowed', background: 'rgba(255,255,255,0.05)' }} 
            />
          </div>
        )}

        <div className="form-group">
          <label className="form-label">Primary Contact Person</label>
          <input 
            type="text" 
            className="form-input" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input 
            type="email" 
            className="form-input" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label className="form-label">Phone Number</label>
          <input 
            type="text" 
            className="form-input" 
            value={phone} 
            onChange={(e) => setPhone(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group" style={{ marginBottom: '1.75rem' }}>
          <label className="form-label">Physical Location Address</label>
          <textarea 
            className="form-textarea" 
            rows={3} 
            value={address} 
            onChange={(e) => setAddress(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
          <Save size={16} /> Save Profile Changes
        </button>
      </form>
    </div>
  );
};
