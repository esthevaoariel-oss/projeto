import React, { useState, useEffect } from 'react';
import { View, StyleSheet, StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { User } from './src/types';
import { useStorage } from './src/contexts/StorageContext';
import { StorageProvider } from './src/contexts/StorageContext';
import Header from './src/components/Header';
import ClienteScreen from './src/screens/ClienteScreen';
import AdminScreen from './src/screens/AdminScreen';

const Stack = createNativeStackNavigator();

function AppContent() {
  const storage = useStorage();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function init() {
      // Seed admin and data
      await storage.seedAdmin();
      
      // Check for logged user
      const user = await storage.getCurrentUser();
      if (user) {
        setCurrentUser(user);
      }
      setLoading(false);
    }
    init();
  }, [storage]);

  const handleLogout = async () => {
    await storage.logout();
    setCurrentUser(null);
  };

  if (loading) return null;

  return (
    <NavigationContainer>
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
        <Header user={currentUser} onLogout={handleLogout} />
        <Stack.Navigator 
          screenOptions={{ 
            headerShown: false,
            animation: 'fade'
          }}
        >
          {currentUser ? (
            <Stack.Screen name="Admin">
              {(props) => <AdminScreen {...props} user={currentUser} />}
            </Stack.Screen>
          ) : (
            <Stack.Screen name="Cliente">
              {(props) => <ClienteScreen {...props} onLoginSuccess={setCurrentUser} />}
            </Stack.Screen>
          )}
        </Stack.Navigator>
      </View>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <StorageProvider>
      <AppContent />
    </StorageProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
});

