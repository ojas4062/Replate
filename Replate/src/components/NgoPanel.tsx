import React, { useState } from 'react';
import type { User, Claim, SurplusListing } from '../types';
import { SurplusMap } from './SurplusMap';
import { VerificationModal } from './VerificationModal';
import { VerificationBadge } from './VerificationBadge';
import { MapPin, CheckCircle2, DollarSign, Camera, Clock } from 'lucide-react';

interface NgoPanelProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  listings: SurplusListing[];
  claims: Claim[];
  onAddClaim: (claim: Claim) => void;
}

export const NgoPanel: React.FC<NgoPanelProps> = ({
  user,
  activeTab,
  setActiveTab,
  listings,
  claims,
  onAddClaim
}) => {
  const [selectedListingForClaim, setSelectedListingForClaim] = useState<SurplusListing | null>(null);
  const [proofFile, setProofFile] = useState<{ [claimId: string]: string }>({});

  const handleProofUpload = (claimId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setProofFile(prev => ({ ...prev, [claimId]: url }));
    }
  };

  const userClaims = claims.filter(c => c.claimantId === user.id || user.role === 'ngo');

  if (activeTab === 'dashboard') {
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            NGO Portal — <span style={{ color: '#60A5FA' }}>{user.orgName || user.name}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Browse food surplus map, manage claims & review funding allocations.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('map')}>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <MapPin size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Browse Surplus Map</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Locate nearby hotel & mess surplus meals within travel radius.</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('my-claims')}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <CheckCircle2 size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>My Claims & KYC</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Track claim confirmation status and upload proof of pickup.</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('impact')}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <DollarSign size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Impact & Allocation</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>View period funding allocated & meals redistributed.</p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Active Claims</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#3B82F6' }}>{userClaims.length} Claims</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Meals Received This Period</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#34D399' }}>180 Portions</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Simulated Funding Allocation</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#8B5CF6' }}>
              ₹9,000 <span className="prototype-tag">Simulated</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'map') {
    return (
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1rem' }}>
        <SurplusMap 
          listings={listings} 
          userRole="ngo"
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

  if (activeTab === 'my-claims') {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>My Claims & Status</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Verification states, unlocked provider contacts, and post-pickup proof photo uploads.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {userClaims.map((claim) => {
            const hasUploadedProof = claim.proofOfPickupUploaded || Boolean(proofFile[claim.id]);
            return (
              <div key={claim.id} className="glass-card" style={{ padding: '1.5rem' }}>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.3rem' }}>{claim.listingTitle}</h3>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Provider: <strong style={{ color: 'white' }}>{claim.providerName}</strong> • Requested: {claim.quantity} portions
                    </div>
                  </div>

                  <VerificationBadge status={claim.verificationStatus} />
                </div>

                {claim.verificationStatus === 'verified' ? (
                  <div className="status-banner success" style={{ margin: '0 0 1rem' }}>
                    <CheckCircle2 size={18} />
                    <span>Verified ✓ — Pickup details sent. Provider contact unlocked: <strong>{claim.providerPhone}</strong></span>
                  </div>
                ) : (
                  <div className="status-banner warning" style={{ margin: '0 0 1rem' }}>
                    <Clock size={18} />
                    <span>Unverified — Provider notified. Contact is limited until manual review.</span>
                  </div>
                )}

                <div style={{ paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Pickup Window: <strong style={{ color: 'white' }}>{claim.pickupWindow}</strong>
                  </div>

                  <div>
                    {hasUploadedProof ? (
                      <span style={{ fontSize: '0.825rem', color: '#34D399', display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600 }}>
                        <CheckCircle2 size={16} /> Proof Photo Uploaded ✓
                      </span>
                    ) : (
                      <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>
                        <Camera size={14} /> Upload Proof-of-Pickup Photo
                        <input 
                          type="file" 
                          accept="image/*" 
                          style={{ display: 'none' }} 
                          onChange={(e) => handleProofUpload(claim.id, e)} 
                        />
                      </label>
                    )}
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Impact & Allocation Summary</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Transparent view of funds and meals received by this organization.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Total Funding Received</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#8B5CF6', marginBottom: '0.5rem' }}>₹9,000</div>
          <span className="prototype-tag">Simulated Allocation Data</span>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Total Meals Distributed</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#34D399', marginBottom: '0.5rem' }}>180 Meals</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Across 6 provider partnerships</div>
        </div>
      </div>
    </div>
  );
};
