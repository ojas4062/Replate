import React, { useState } from 'react';
import type { User, Claim, SurplusListing } from '../types';
import { SurplusMap } from './SurplusMap';
import { VerificationModal } from './VerificationModal';
import { VerificationBadge } from './VerificationBadge';
import { MapPin, CheckCircle2, Clock } from 'lucide-react';

interface PersonalPanelProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  listings: SurplusListing[];
  claims: Claim[];
  onAddClaim: (claim: Claim) => void;
}

export const PersonalPanel: React.FC<PersonalPanelProps> = ({
  user,
  activeTab,
  setActiveTab,
  listings,
  claims,
  onAddClaim
}) => {
  const [selectedListingForClaim, setSelectedListingForClaim] = useState<SurplusListing | null>(null);
  const userClaims = claims.filter(c => c.claimantId === user.id);

  if (activeTab === 'dashboard') {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            Personal Portal — <span style={{ color: '#A7F3D0' }}>{user.name}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Claim individual surplus portions near you for immediate consumption.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('map')}>
            <MapPin size={28} color="#10B981" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Browse Surplus Map</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Find available surplus meals nearby within walking/travel distance.</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('my-claims')}>
            <CheckCircle2 size={28} color="#3B82F6" style={{ marginBottom: '0.75rem' }} />
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>My Claims & Status</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>View verification status and provider pickup contact info.</p>
          </div>
        </div>

        <div className="status-banner info">
          <span>Note: Personal accounts are capped at a maximum of 5 portions per claim to ensure equitable distribution.</span>
        </div>
      </div>
    );
  }

  if (activeTab === 'map') {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <SurplusMap 
          listings={listings} 
          userRole="personal"
          onClaim={(listing) => setSelectedListingForClaim(listing)} 
        />

        {selectedListingForClaim && (
          <VerificationModal 
            listing={selectedListingForClaim}
            user={user}
            onConfirmClaim={(claim) => {
              onAddClaim(claim);
              setSelectedListingForClaim(null);
              setActiveTab('my-claims');
            }}
            onClose={() => setSelectedListingForClaim(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>My Active Claims</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Track your requested portion claims and access pickup contacts.</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {userClaims.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            You have no active claims. Visit the Surplus Map to browse available meals.
          </div>
        ) : (
          userClaims.map((claim) => (
            <div key={claim.id} className="glass-card" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div>
                  <h3 style={{ fontSize: '1.15rem' }}>{claim.listingTitle}</h3>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Provider: <strong style={{ color: 'white' }}>{claim.providerName}</strong> • Claimed: {claim.quantity} portions
                  </div>
                </div>
                <VerificationBadge status={claim.verificationStatus} />
              </div>

              {claim.verificationStatus === 'verified' ? (
                <div className="status-banner success">
                  <CheckCircle2 size={16} />
                  <span>Verified ✓ — Contact provider: <strong>{claim.providerPhone}</strong></span>
                </div>
              ) : (
                <div className="status-banner warning">
                  <Clock size={16} />
                  <span>Unverified — Provider notified. Awaiting review.</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
