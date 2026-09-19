import React from 'react';
import type { SurplusListing } from '../types';
import { MapPin, AlertTriangle } from 'lucide-react';

interface SurplusMapProps {
  listings: SurplusListing[];
  onClaim: (listing: SurplusListing) => void;
  userRole: 'personal' | 'ngo';
}

export const SurplusMap: React.FC<SurplusMapProps> = ({ listings, onClaim, userRole }) => {
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'accessible' | 'nearby'>('all');
  const [selectedListing, setSelectedListing] = React.useState<SurplusListing | null>(null);

  const filteredListings = listings.filter((item) => {
    if (selectedFilter === 'accessible') return item.accessible;
    if (selectedFilter === 'nearby') return item.distanceKm <= 3.0;
    return true;
  });

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', height: 'calc(100vh - 160px)', minHeight: '500px' }}>
      
      <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(15, 23, 42, 0.8)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <MapPin size={16} color="#10B981" /> Interactive Surplus Map View
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button 
              className={`btn btn-sm ${selectedFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setSelectedFilter('all')}
            >
              All ({listings.length})
            </button>
            <button 
              className={`btn btn-sm ${selectedFilter === 'accessible' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setSelectedFilter('accessible')}
            >
              Accessible
            </button>
            <button 
              className={`btn btn-sm ${selectedFilter === 'nearby' ? 'btn-primary' : 'btn-secondary'}`} 
              onClick={() => setSelectedFilter('nearby')}
            >
              &lt; 3 km
            </button>
          </div>
        </div>

        <div style={{ flex: 1, background: '#090D16', position: 'relative', overflow: 'hidden', backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 0)', backgroundSize: '24px 24px' }}>
          
          <svg style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.15 }}>
            <line x1="0" y1="30%" x2="100%" y2="40%" stroke="#10B981" strokeWidth="4" />
            <line x1="40%" y1="0" x2="60%" y2="100%" stroke="#3B82F6" strokeWidth="4" />
            <circle cx="50%" cy="50%" r="180" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="6,6" fill="none" />
          </svg>

          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', zIndex: 5 }}>
            <div style={{ width: '18px', height: '18px', background: '#3B82F6', borderRadius: '50%', border: '3px solid white', boxShadow: '0 0 15px #3B82F6', margin: '0 auto' }}></div>
            <span style={{ fontSize: '0.7rem', color: '#93C5FD', fontWeight: 600, background: 'rgba(15,23,42,0.85)', padding: '2px 6px', borderRadius: '4px', marginTop: '4px', display: 'inline-block' }}>
              Your Location
            </span>
          </div>

          {filteredListings.map((item, index) => {
            const offsets = [
              { top: '35%', left: '42%' },
              { top: '65%', left: '58%' },
              { top: '28%', left: '68%' },
              { top: '80%', left: '20%' },
            ];
            const pos = offsets[index % offsets.length];
            const isSelected = selectedListing?.id === item.id;

            return (
              <div 
                key={item.id} 
                style={{ position: 'absolute', top: pos.top, left: pos.left, cursor: 'pointer', zIndex: isSelected ? 20 : 10, transform: isSelected ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.2s ease' }}
                onClick={() => setSelectedListing(item)}
              >
                <div style={{ 
                  background: item.accessible ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                  color: 'white',
                  padding: '0.4rem 0.75rem',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  boxShadow: isSelected ? '0 0 20px #10B981' : '0 4px 10px rgba(0,0,0,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}>
                  <MapPin size={14} />
                  {item.distanceKm} km
                </div>
              </div>
            );
          })}

        </div>

      </div>

      <div style={{ overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        
        {userRole === 'personal' && (
          <div className="status-banner info" style={{ margin: 0 }}>
            <span>Note: Individual claims are capped at 5 portions max.</span>
          </div>
        )}

        {filteredListings.map((item) => {
          const isSelected = selectedListing?.id === item.id;
          return (
            <div 
              key={item.id} 
              className="glass-card" 
              style={{ 
                padding: '1.25rem', 
                borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                background: isSelected ? 'rgba(16,185,129,0.05)' : 'var(--bg-card)'
              }}
              onClick={() => setSelectedListing(item)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>{item.menuItem}</h3>
                <span className={`status-badge ${item.accessible ? 'verified' : 'unverified'}`}>
                  {item.accessible ? 'Accessible' : 'Far / Restricted'}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Provider: <strong style={{ color: 'var(--text-main)' }}>{item.providerName}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.65rem', borderRadius: '6px' }}>
                <div>Quantity: <strong style={{ color: '#34D399' }}>{item.quantity} portions</strong></div>
                <div>Distance: <strong style={{ color: 'white' }}>{item.distanceKm} km</strong></div>
                <div>Pickup: <strong style={{ color: 'white' }}>{item.pickupWindow}</strong></div>
                <div>Ready by: <strong style={{ color: 'white' }}>{item.readyByTime}</strong></div>
              </div>

              {!item.accessible && (
                <div style={{ fontSize: '0.785rem', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <AlertTriangle size={14} /> Warning: Outside standard 10 km pickup radius.
                </div>
              )}

              <button 
                className="btn btn-primary btn-sm" 
                style={{ width: '100%' }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClaim(item);
                }}
              >
                Claim This Surplus
              </button>
            </div>
          );
        })}

      </div>

    </div>
  );
};
