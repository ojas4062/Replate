import React, { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { SurplusListing } from '../types';
import { AlertTriangle, MapPin } from 'lucide-react';

// Fix Leaflet default icon broken by Vite asset pipeline
delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// User location — centre of the demo city (Pune)
const USER_LAT = 18.5204;
const USER_LNG = 73.8567;

const nearbyIcon = new L.DivIcon({
  className: '',
  html: `<div style="background:linear-gradient(135deg,#10B981,#059669);color:white;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;box-shadow:0 4px 12px rgba(16,185,129,0.5);white-space:nowrap;display:flex;align-items:center;gap:4px;">
    <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'><path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z'/><circle cx='12' cy='10' r='3'/></svg>
    DIST_KMkm</div>`,
  iconAnchor: [40, 16],
  popupAnchor: [0, -20],
});

const farIcon = new L.DivIcon({
  className: '',
  html: `<div style="background:linear-gradient(135deg,#EF4444,#B91C1C);color:white;padding:4px 10px;border-radius:20px;font-size:12px;font-weight:700;box-shadow:0 4px 12px rgba(239,68,68,0.5);white-space:nowrap;display:flex;align-items:center;gap:4px;">
    <svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.5'><path d='M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z'/><circle cx='12' cy='10' r='3'/></svg>
    DIST_KMkm</div>`,
  iconAnchor: [40, 16],
  popupAnchor: [0, -20],
});

const userIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:18px;height:18px;background:#3B82F6;border-radius:50%;border:3px solid white;box-shadow:0 0 0 4px rgba(59,130,246,0.3),0 0 20px #3B82F6;"></div>`,
  iconAnchor: [9, 9],
});

function makeIcon(distanceKm: number) {
  const base = distanceKm <= 10 ? nearbyIcon : farIcon;
  return new L.DivIcon({
    ...base.options,
    html: (base.options.html as string).replace('DIST_KM', String(distanceKm)),
  });
}

// Pans map to selected listing
function FlyTo({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.flyTo([lat, lng], 14, { duration: 0.8 }); }, [lat, lng, map]);
  return null;
}

interface SurplusMapProps {
  listings: SurplusListing[];
  onClaim: (listing: SurplusListing) => void;
  userRole: 'personal' | 'ngo';
}

export const SurplusMap: React.FC<SurplusMapProps> = ({ listings, onClaim, userRole }) => {
  const [selectedFilter, setSelectedFilter] = React.useState<'all' | 'accessible' | 'nearby'>('all');
  const [selectedListing, setSelectedListing] = React.useState<SurplusListing | null>(null);
  const listingRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const availableListings = listings.filter(l => l.status === 'available');

  const filteredListings = availableListings.filter((item) => {
    if (selectedFilter === 'accessible') return item.accessible;
    if (selectedFilter === 'nearby') return item.distanceKm <= 3.0;
    return true;
  });

  const handleMarkerClick = (item: SurplusListing) => {
    setSelectedListing(item);
    // Scroll the right-panel card into view
    setTimeout(() => {
      listingRefs.current[item.id]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem', height: 'calc(100vh - 160px)', minHeight: '520px' }}>

      {/* ── LEFT: real Leaflet map ── */}
      <div className="glass-card" style={{ position: 'relative', overflow: 'hidden', padding: 0, display: 'flex', flexDirection: 'column' }}>

        {/* header bar */}
        <div style={{ padding: '0.85rem 1.25rem', background: 'rgba(15,23,42,0.9)', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', zIndex: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, fontSize: '0.9rem' }}>
            <MapPin size={16} color="#10B981" /> Interactive Surplus Map
          </div>
          <div style={{ display: 'flex', gap: '0.4rem' }}>
            {(['all', 'accessible', 'nearby'] as const).map((f) => (
              <button key={f} className={`btn btn-sm ${selectedFilter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setSelectedFilter(f)}>
                {f === 'all' ? `All (${availableListings.length})` : f === 'accessible' ? 'Accessible' : '< 3 km'}
              </button>
            ))}
          </div>
        </div>

        {/* map */}
        <div style={{ flex: 1 }}>
          <MapContainer
            center={[USER_LAT, USER_LNG]}
            zoom={13}
            style={{ width: '100%', height: '100%' }}
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* 3 km radius circle */}
            <Circle
              center={[USER_LAT, USER_LNG]}
              radius={3000}
              pathOptions={{ color: '#10B981', fillColor: '#10B981', fillOpacity: 0.04, dashArray: '8,6', weight: 1.5 }}
            />
            {/* 10 km radius circle */}
            <Circle
              center={[USER_LAT, USER_LNG]}
              radius={10000}
              pathOptions={{ color: '#8B5CF6', fillColor: '#8B5CF6', fillOpacity: 0.02, dashArray: '4,8', weight: 1 }}
            />

            {/* User marker */}
            <Marker position={[USER_LAT, USER_LNG]} icon={userIcon}>
              <Popup>
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>📍 Your Location</div>
                <div style={{ fontSize: '0.75rem', color: '#555' }}>Dashed circle = 3 km radius</div>
              </Popup>
            </Marker>

            {/* Surplus markers */}
            {filteredListings.map((item) => {
              if (!item.lat || !item.lng) return null;
              return (
                <Marker
                  key={item.id}
                  position={[item.lat, item.lng]}
                  icon={makeIcon(item.distanceKm)}
                  eventHandlers={{ click: () => handleMarkerClick(item) }}
                >
                  <Popup maxWidth={260}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '4px' }}>{item.menuItem}</div>
                    <div style={{ fontSize: '0.78rem', color: '#444', marginBottom: '6px' }}>🏨 {item.providerName}</div>
                    <div style={{ fontSize: '0.78rem', color: '#333', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3px' }}>
                      <span>🍱 {item.quantity} portions</span>
                      <span>📍 {item.distanceKm} km</span>
                      <span>⏰ {item.pickupWindow}</span>
                      <span>✅ Ready {item.readyByTime}</span>
                    </div>
                    <button
                      onClick={() => onClaim(item)}
                      style={{ marginTop: '8px', width: '100%', background: '#10B981', color: 'white', border: 'none', borderRadius: '6px', padding: '6px', fontWeight: 700, cursor: 'pointer', fontSize: '0.8rem' }}
                    >
                      Claim This Surplus
                    </button>
                  </Popup>
                </Marker>
              );
            })}

            {selectedListing?.lat && selectedListing?.lng && (
              <FlyTo lat={selectedListing.lat} lng={selectedListing.lng} />
            )}
          </MapContainer>
        </div>

      </div>

      {/* ── RIGHT: listing cards ── */}
      <div style={{ overflowY: 'auto', paddingRight: '0.25rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>

        {userRole === 'personal' && (
          <div className="status-banner info" style={{ margin: 0 }}>
            <span>Individual claims capped at 5 portions for equitable distribution.</span>
          </div>
        )}

        {filteredListings.length === 0 && (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            No listings match this filter.
          </div>
        )}

        {filteredListings.map((item) => {
          const isSelected = selectedListing?.id === item.id;
          return (
            <div
              key={item.id}
              ref={(el) => { listingRefs.current[item.id] = el; }}
              className="glass-card"
              style={{
                padding: '1.25rem',
                borderColor: isSelected ? 'var(--primary)' : 'var(--border)',
                background: isSelected ? 'rgba(16,185,129,0.06)' : 'var(--bg-card)',
                cursor: 'pointer',
                transition: 'border-color 0.2s ease',
              }}
              onClick={() => setSelectedListing(item)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <h3 style={{ fontSize: '1.05rem', margin: 0 }}>{item.menuItem}</h3>
                <span className={`status-badge ${item.accessible ? 'verified' : 'unverified'}`}>
                  {item.accessible ? 'Accessible' : 'Far / Restricted'}
                </span>
              </div>

              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Provider: <strong style={{ color: 'var(--text-main)' }}>{item.providerName}</strong>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.65rem', borderRadius: '6px' }}>
                <div>Quantity: <strong style={{ color: '#34D399' }}>{item.quantity} portions</strong></div>
                <div>Distance: <strong style={{ color: 'white' }}>{item.distanceKm} km</strong></div>
                <div>Pickup: <strong style={{ color: 'white' }}>{item.pickupWindow}</strong></div>
                <div>Ready by: <strong style={{ color: 'white' }}>{item.readyByTime}</strong></div>
              </div>

              {!item.accessible && (
                <div style={{ fontSize: '0.78rem', color: '#FBBF24', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.75rem' }}>
                  <AlertTriangle size={13} /> Outside standard 10 km pickup radius.
                </div>
              )}

              <button
                className="btn btn-primary btn-sm"
                style={{ width: '100%' }}
                onClick={(e) => { e.stopPropagation(); onClaim(item); }}
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
