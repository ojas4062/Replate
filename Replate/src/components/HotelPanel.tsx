import React, { useState } from 'react';
import type { User, SurplusListing, Claim } from '../types';
import { VerificationBadge } from './VerificationBadge';
import { Sparkles, Users, CheckCircle2, DollarSign, Utensils } from 'lucide-react';

interface HotelPanelProps {
  user: User;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  listings: SurplusListing[];
  claims: Claim[];
  onAddListing: (listing: Omit<SurplusListing, 'id' | 'providerId' | 'postedAt' | 'status'>) => void;
  onMarkPickedUp: (claimId: string) => void;
  onApproveVerification: (claimId: string) => void;
}

export const HotelPanel: React.FC<HotelPanelProps> = ({
  user,
  activeTab,
  setActiveTab,
  listings,
  claims,
  onAddListing,
  onMarkPickedUp,
  onApproveVerification
}) => {
  const [dayOfWeek, setDayOfWeek] = useState('Friday');
  const [expectedBookings, setExpectedBookings] = useState<number>(350);
  const [weatherCondition, setWeatherCondition] = useState('Clear');
  const [isHoliday, setIsHoliday] = useState(false);
  const [specialEvent, setSpecialEvent] = useState(true);

  const [predictedDiners, setPredictedDiners] = useState<number | null>(null);
  const [prepBuffer, setPrepBuffer] = useState<number>(0);
  const [recommendedPortions, setRecommendedPortions] = useState<number>(0);
  const [wasteKg, setWasteKg] = useState<number>(0);
  const [predicting, setPredicting] = useState(false);
  const [predError, setPredError] = useState<string | null>(null);

  const [menuItem, setMenuItem] = useState('');
  const [quantity, setQuantity] = useState<number>(15);
  const [readyByTime, setReadyByTime] = useState('15:30');
  const [pickupWindow, setPickupWindow] = useState('15:30 - 17:30');

  const handlePredict = async (e: React.FormEvent) => {
    e.preventDefault();
    setPredicting(true);
    setPredError(null);
    try {
      const res = await fetch('/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dayOfWeek:        dayOfWeek,
          mealType:         'Dinner',
          menuCategory:     'Standard',
          expectedBookings: expectedBookings,
          isHoliday:        isHoliday,
          isExam:           false,
          bufferRate:       0.05,
        }),
      });
      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setPredictedDiners(data.predictedDiners);
      setPrepBuffer(data.bufferPortions);
      setRecommendedPortions(data.recommendedPortions);
      setWasteKg(data.estimatedWasteSavedKg);
    } catch {
      setPredError('Could not reach prediction server. Is api.py running?');
    } finally {
      setPredicting(false);
    }
  };

  const handlePostSurplus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!menuItem || quantity <= 0) return;

    onAddListing({
      providerName: user.orgName || user.name,
      menuItem,
      quantity,
      readyByTime,
      pickupWindow,
      distanceKm: 1.5,
      accessible: true
    });

    setMenuItem('');
    setQuantity(15);
    setActiveTab('incoming-claims');
  };

  if (activeTab === 'dashboard') {
    const activeListings = listings.filter(l => l.providerName === (user.orgName || user.name));
    return (
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>
            Hotel Dashboard — <span style={{ color: 'var(--primary)' }}>{user.orgName || user.name}</span>
          </h2>
          <p style={{ color: 'var(--text-muted)' }}>Manage demand predictions, surplus food postings, and claims.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
          
          <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('predict')}>
            <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Sparkles size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Demand Predictor</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Run ML model to forecast dinner diners & optimize prep amounts.</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('post-surplus')}>
            <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Utensils size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Post Surplus</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>List surplus food portions for verified NGO or personal pickup.</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('incoming-claims')}>
            <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Users size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Incoming Claims</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Review claimant KYC status badges & manage handoff approvals.</p>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setActiveTab('earnings')}>
            <div style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#8B5CF6', width: '42px', height: '42px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <DollarSign size={22} />
            </div>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.4rem' }}>Earnings & Tax Log</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>View tax deduction credits & simulated earnings figures.</p>
          </div>

        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Active Surplus Listings</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--primary)' }}>{activeListings.length} Active</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Pending Claimant Requests</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#F59E0B' }}>{claims.length} Claims</div>
          </div>

          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>This Period Earnings</div>
            <div style={{ fontSize: '2rem', fontWeight: 700, color: '#34D399' }}>
              ₹4,250 <span className="prototype-tag">Simulated</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'predict') {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', gap: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ color: 'var(--primary)', fontWeight: 700 }}>01 PREDICT</div>
            <div style={{ color: 'var(--text-dim)' }}>→</div>
            <div style={{ color: predictedDiners ? 'var(--primary)' : 'var(--text-dim)', fontWeight: 700 }}>02 PREPARE</div>
            <div style={{ color: 'var(--text-dim)' }}>→</div>
            <div style={{ color: 'var(--text-dim)', fontWeight: 700 }}>03 MEASURE</div>
          </div>

          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.5rem' }}>Demand Prediction Engine</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Input event & weather factors to calculate exact diner turnout and avoid kitchen over-preparation.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
          
          <form className="glass-card" style={{ padding: '1.75rem' }} onSubmit={handlePredict}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.25rem' }}>Event Inputs</h3>

            <div className="form-group">
              <label className="form-label">Day of Week</label>
              <select className="form-select" value={dayOfWeek} onChange={(e) => setDayOfWeek(e.target.value)}>
                <option value="Monday">Monday</option>
                <option value="Wednesday">Wednesday</option>
                <option value="Friday">Friday</option>
                <option value="Saturday">Saturday</option>
                <option value="Sunday">Sunday</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Expected Bookings / RSVPs</label>
              <input 
                type="number" 
                className="form-input" 
                value={expectedBookings} 
                onChange={(e) => setExpectedBookings(Number(e.target.value))} 
                min={10} 
                max={2000} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Weather Forecast</label>
              <select className="form-select" value={weatherCondition} onChange={(e) => setWeatherCondition(e.target.value)}>
                <option value="Clear">Clear / Fair</option>
                <option value="Rain">Rain / Downpour</option>
                <option value="Hot">Extreme Heat</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '1.5rem', margin: '1.25rem 0' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={isHoliday} onChange={(e) => setIsHoliday(e.target.checked)} />
                Public Holiday
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                <input type="checkbox" checked={specialEvent} onChange={(e) => setSpecialEvent(e.target.checked)} />
                Special Event / Banquet
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={predicting}>
              <Sparkles size={16} /> {predicting ? 'Running Model…' : 'Run Prediction Model'}
            </button>
          </form>

          <div>
            {predError && (
              <div className="status-banner warning" style={{ marginBottom: '1rem' }}>
                <span>{predError}</span>
              </div>
            )}
            {predictedDiners !== null ? (
              <div className="glass-card" style={{ padding: '1.75rem', border: '1px solid var(--primary-glow)', background: 'radial-gradient(circle at top right, rgba(16,185,129,0.1) 0%, var(--bg-card) 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.2rem', color: '#34D399' }}>Prediction Output</h3>
                  <span className="prototype-tag">ML Model</span>
                </div>

                <div style={{ marginBottom: '1.5rem', textAlign: 'center', padding: '1.5rem', background: 'rgba(16,185,129,0.05)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--primary-light)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>Forecasted Diner Turnout</div>
                  <div style={{ fontSize: '3rem', fontWeight: 800, color: '#34D399' }}>{predictedDiners} <span style={{ fontSize: '1rem', fontWeight: 400 }}>diners</span></div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Recommended Prep Meals:</span>
                    <strong style={{ color: 'white' }}>{recommendedPortions} portions</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Safety Buffer (+5%):</span>
                    <strong style={{ color: 'white' }}>+{prepBuffer} portions</strong>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Est. Food Waste Prevented:</span>
                    <strong style={{ color: '#34D399' }}>~{wasteKg} kg</strong>
                  </div>
                </div>

                <div className="status-banner success" style={{ marginTop: '1.5rem', marginBottom: 0 }}>
                  <CheckCircle2 size={18} />
                  <span>Recommendation applied. Kitchen schedule calibrated.</span>
                </div>
              </div>
            ) : (
              <div className="glass-card" style={{ padding: '3rem 2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                <Sparkles size={40} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                <p>Fill in event parameters and click "Run Prediction Model" to compute turnout analytics.</p>
              </div>
            )}
          </div>

        </div>
      </div>
    );
  }

  if (activeTab === 'post-surplus') {
    return (
      <div style={{ maxWidth: '680px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Post Food Surplus Listing</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            List excess prepared dishes for nearby NGOs and verified individuals to claim.
          </p>
        </div>

        <form className="glass-card" style={{ padding: '2rem' }} onSubmit={handlePostSurplus}>
          <div className="form-group">
            <label className="form-label">Menu Item & Description</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. Paneer Butter Masala & Steamed Rice" 
              value={menuItem} 
              onChange={(e) => setMenuItem(e.target.value)} 
              required 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Quantity Available (Portions)</label>
              <input 
                type="number" 
                className="form-input" 
                value={quantity} 
                onChange={(e) => setQuantity(Number(e.target.value))} 
                min={1} 
                required 
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ready-by Time</label>
              <input 
                type="time" 
                className="form-input" 
                value={readyByTime} 
                onChange={(e) => setReadyByTime(e.target.value)} 
                required 
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label">Pickup Window</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="e.g. 15:30 - 17:30" 
              value={pickupWindow} 
              onChange={(e) => setPickupWindow(e.target.value)} 
              required 
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem' }}>
            Post Listing to Marketplace
          </button>
        </form>
      </div>
    );
  }

  if (activeTab === 'incoming-claims') {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 1rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Incoming Claims</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Review claimant verification status & confirm food handoff.
          </p>
        </div>

        {claims.length === 0 ? (
          <div className="glass-card" style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            No incoming claims yet. Post a surplus listing to receive claim requests.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {claims.map((claim) => (
              <div key={claim.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Claimant: {claim.claimantName}</span>
                    <VerificationBadge status={claim.verificationStatus} />
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Listing: {claim.listingTitle} ({claim.quantity} portions) • Contact: {claim.verificationStatus === 'verified' ? claim.providerPhone : '[Masked until verified]'}
                  </div>
                </div>

                {claim.pickupWindow === 'Completed ✓' ? (
                  <span style={{ fontSize: '0.82rem', color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <CheckCircle2 size={16} /> Picked Up ✓
                  </span>
                ) : claim.verificationStatus === 'verified' ? (
                  <button className="btn btn-primary btn-sm" onClick={() => onMarkPickedUp(claim.id)}>
                    Mark Picked Up
                  </button>
                ) : (
                  <button className="btn btn-secondary btn-sm" onClick={() => onApproveVerification(claim.id)}>
                    Approve &amp; Verify
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '0 1rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem 2rem', marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', marginBottom: '0.4rem' }}>Payments & Earnings Log</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          Overview of provider tax offsets and food donation value allocations.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>This Period Earned / Credited</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#34D399', marginBottom: '0.5rem' }}>₹4,250</div>
          <span className="prototype-tag">Simulated Payment Data</span>
        </div>

        <div className="glass-card" style={{ padding: '1.75rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>Allocated to NGOs / Orgs</div>
          <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#60A5FA', marginBottom: '0.5rem' }}>₹12,800</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Across 14 confirmed claims</div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>Allocation History</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-dim)' }}>
              <th style={{ padding: '0.75rem 0' }}>Date</th>
              <th>Recipient</th>
              <th>Meals</th>
              <th>Value Credit</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '0.75rem 0' }}>Sep 19, 2026</td>
              <td>Hope Foundation Shelter</td>
              <td>30 portions</td>
              <td style={{ color: '#34D399', fontWeight: 600 }}>₹1,500 (Simulated)</td>
            </tr>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <td style={{ padding: '0.75rem 0' }}>Sep 18, 2026</td>
              <td>City Food Bank</td>
              <td>50 portions</td>
              <td style={{ color: '#34D399', fontWeight: 600 }}>₹2,750 (Simulated)</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
