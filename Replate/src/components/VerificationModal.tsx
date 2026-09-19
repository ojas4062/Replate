import React, { useState } from 'react';
import type { SurplusListing, Claim, User } from '../types';
import { CheckCircle2, AlertCircle, FileText, Camera } from 'lucide-react';

interface VerificationModalProps {
  listing: SurplusListing;
  user: User;
  onConfirmClaim: (claim: Claim) => void;
  onClose: () => void;
}

export const VerificationModal: React.FC<VerificationModalProps> = ({
  listing,
  user,
  onConfirmClaim,
  onClose
}) => {
  const [step, setStep] = useState<'upload_kyc' | 'submitted'>('upload_kyc');
  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [computedStatus, setComputedStatus] = useState<'verified' | 'unverified'>('verified');

  const maxPortions = user.role === 'personal' ? Math.min(5, listing.quantity) : listing.quantity;
  const [claimQty, setClaimQty] = useState<number>(maxPortions);

  const handleSubmitVerification = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSimulating(true);

    setTimeout(() => {
      const simulatedPass = Math.random() > 0.2;
      const status = simulatedPass ? 'verified' : 'unverified';

      setComputedStatus(status);
      setIsSimulating(false);
      setStep('submitted');

      const newClaim: Claim = {
        id: 'claim-' + Date.now(),
        listingId: listing.id,
        listingTitle: listing.menuItem,
        providerName: listing.providerName,
        providerPhone: '+91 98765 43210',
        claimantId: user.id,
        claimantName: user.orgName || user.name,
        claimantRole: user.role,
        quantity: claimQty,
        pickupWindow: listing.pickupWindow,
        claimedAt: new Date().toISOString(),
        verificationStatus: status,
        idDocUploaded: true,
        selfieUploaded: true,
        proofOfPickupUploaded: false
      };

      onConfirmClaim(newClaim);
    }, 1200);
  };

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
      <div className="glass-card" style={{ width: '100%', maxWidth: '520px', padding: '2rem', border: '1px solid var(--border-active)' }}>
        
        {step === 'upload_kyc' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Claim & Verification Upload</h2>
              <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.25rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
              Claiming: <strong style={{ color: 'white' }}>{listing.menuItem}</strong> ({listing.providerName})
            </div>

            <form onSubmit={handleSubmitVerification}>
              
              <div className="form-group">
                <label className="form-label">Requested Quantity (Portions)</label>
                <input 
                  type="number" 
                  className="form-input" 
                  value={claimQty} 
                  onChange={(e) => setClaimQty(Math.min(maxPortions, Number(e.target.value)))} 
                  min={1} 
                  max={maxPortions} 
                  required 
                />
                {user.role === 'personal' && (
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                    *Personal accounts capped at 5 max portions per claim
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Upload Identity Document (Aadhaar / PAN)</label>
                <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.2)' }}>
                  <FileText size={24} style={{ margin: '0 auto 0.4rem', color: 'var(--primary)' }} />
                  <div style={{ fontSize: '0.85rem' }}>
                    {idFile ? idFile.name : 'Click or drop Government ID scan'}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*,.pdf" 
                    style={{ display: 'none' }} 
                    id="id-upload" 
                    onChange={(e) => e.target.files && setIdFile(e.target.files[0])} 
                    required 
                  />
                  <label htmlFor="id-upload" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem', cursor: 'pointer' }}>
                    Select Document
                  </label>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '1.25rem' }}>
                <label className="form-label">Upload Selfie Photo (Face Matching)</label>
                <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem', textAlign: 'center', cursor: 'pointer', background: 'rgba(0,0,0,0.2)' }}>
                  <Camera size={24} style={{ margin: '0 auto 0.4rem', color: '#3B82F6' }} />
                  <div style={{ fontSize: '0.85rem' }}>
                    {selfieFile ? selfieFile.name : 'Take or upload selfie photo'}
                  </div>
                  <input 
                    type="file" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    id="selfie-upload" 
                    onChange={(e) => e.target.files && setSelfieFile(e.target.files[0])} 
                    required 
                  />
                  <label htmlFor="selfie-upload" className="btn btn-secondary btn-sm" style={{ marginTop: '0.5rem', cursor: 'pointer' }}>
                    Select Photo
                  </label>
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '1.25rem', fontStyle: 'italic' }}>
                <span className="prototype-tag" style={{ marginRight: '0.4rem' }}>Privacy Note</span>
                Identity verification is simulated for prototype safety. No government ID numbers or biometric images are transmitted or stored on any server.
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%', padding: '0.85rem' }}
                disabled={isSimulating}
              >
                {isSimulating ? 'Simulating Verification Match...' : 'Submit for Verification'}
              </button>

            </form>
          </div>
        )}

        {step === 'submitted' && (
          <div style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.3rem', marginBottom: '1rem' }}>Claim Status Updated</h2>

            {computedStatus === 'verified' ? (
              <div className="status-banner success" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <CheckCircle2 size={24} />
                <div>
                  <div style={{ fontWeight: 700 }}>Claim confirmed — Verified ✓</div>
                  <div style={{ fontSize: '0.825rem' }}>Face match passed. Provider contact & pickup details unlocked.</div>
                </div>
              </div>
            ) : (
              <div className="status-banner warning" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <AlertCircle size={24} />
                <div>
                  <div style={{ fontWeight: 700 }}>Claim submitted — Verification pending</div>
                  <div style={{ fontSize: '0.825rem' }}>Provider notified. Awaiting manual review for contact unlock.</div>
                </div>
              </div>
            )}

            <div className="glass-card" style={{ padding: '1rem', textAlign: 'left', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
              <div>Provider: <strong style={{ color: 'white' }}>{listing.providerName}</strong></div>
              <div>Pickup Window: <strong style={{ color: 'white' }}>{listing.pickupWindow}</strong></div>
              <div>Provider Contact: <strong style={{ color: '#34D399' }}>{computedStatus === 'verified' ? '+91 98765 43210' : '[Masked until verified]'}</strong></div>
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }} onClick={onClose}>
              Done & Return to Claims
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
