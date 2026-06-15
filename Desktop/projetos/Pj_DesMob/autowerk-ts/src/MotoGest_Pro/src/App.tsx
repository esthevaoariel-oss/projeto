import React, { useState, useEffect } from 'react';
import { User } from './types';
import { useStorage } from './contexts/StorageContext';
import Header from './components/Header';
import ClienteScreen from './components/ClienteScreen';
import AdminScreen from './components/AdminScreen';

const AppContent: React.FC = () => {
  const storage = useStorage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Seed admin user and data if doesn't exist
    storage.seedAdmin();
    
    // Check if user is logged in
    const user = storage.getCurrentUser();
    if (user) {
      setCurrentUser(user);
    }
    setLoading(false);
  }, [storage]);

  const handleLogout = () => {
    storage.logout();
    setCurrentUser(null);
  };

  if (loading) return null;

  return (
    <>
      <Header user={currentUser} onLogout={handleLogout} />
      <main>
        {currentUser ? (
          <AdminScreen user={currentUser} />
        ) : (
          <ClienteScreen onLoginSuccess={setCurrentUser} />
        )}
      </main>
    </>
  );
};

export default AppContent;
