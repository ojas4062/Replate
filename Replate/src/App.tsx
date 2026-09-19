import type { User, SurplusListing, Claim } from './types';
import { INITIAL_LISTINGS, INITIAL_CLAIMS } from './mockData';
import { AuthModal } from './components/AuthModal';
import { Navbar } from './components/Navbar';
import { HotelPanel } from './components/HotelPanel';
import { NgoPanel } from './components/NgoPanel';
import { PersonalPanel } from './components/PersonalPanel';
import { ProfilePage } from './components/ProfilePage';
import { useState } from 'react';

export function App() {
  const [user, setUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [listings, setListings] = useState<SurplusListing[]>(INITIAL_LISTINGS);
  const [claims, setClaims] = useState<Claim[]>(INITIAL_CLAIMS);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
    setActiveTab('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleAddListing = (newListingData: Omit<SurplusListing, 'id' | 'providerId' | 'postedAt' | 'status'>) => {
    const listing: SurplusListing = {
      ...newListingData,
      id: 'list-' + Date.now(),
      providerId: user?.id || 'provider-demo',
      postedAt: new Date().toISOString(),
      status: 'available'
    };
    setListings(prev => [listing, ...prev]);
  };

  const handleAddClaim = (newClaim: Claim) => {
    setClaims(prev => [newClaim, ...prev]);
    setListings(prev => prev.map(l => l.id === newClaim.listingId ? { ...l, status: 'claimed' } : l));
  };

  if (!user) {
    return <AuthModal onLogin={handleLogin} />;
  }

  const renderActivePanel = () => {
    if (activeTab === 'profile') {
      return <ProfilePage user={user} onUpdateUser={(updated) => setUser(updated)} />;
    }

    switch (user.role) {
      case 'hotel':
        return (
          <HotelPanel 
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            listings={listings}
            claims={claims}
            onAddListing={handleAddListing}
          />
        );
      case 'ngo':
        return (
          <NgoPanel 
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            listings={listings}
            claims={claims}
            onAddClaim={handleAddClaim}
          />
        );
      case 'personal':
      default:
        return (
          <PersonalPanel 
            user={user}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            listings={listings}
            claims={claims}
            onAddClaim={handleAddClaim}
          />
        );
    }
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '3rem' }}>
      <Navbar 
        user={user}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={handleLogout}
      />
      <main key={activeTab} className="animate-fade-in" style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 1.5rem' }}>
        {renderActivePanel()}
      </main>
    </div>
  );
}

export default App;
