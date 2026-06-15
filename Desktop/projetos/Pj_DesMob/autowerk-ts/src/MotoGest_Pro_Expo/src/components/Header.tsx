import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, Platform } from 'react-native';
import { LogOut, Wrench, User as UserIcon } from 'lucide-react-native';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogout }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Wrench color="#f97316" size={24} />
          <Text style={styles.logoText}>
            MotoGest <Text style={styles.logoHighlight}>Pro</Text>
          </Text>
        </View>
        
        {user && (
          <View style={styles.actions}>
            <View style={styles.userInfo}>
              <UserIcon color="#94a3b8" size={18} />
              <Text style={styles.userName}>{user.username}</Text>
            </View>
            <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
              <LogOut color="#f97316" size={18} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#0f172a',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  logoHighlight: {
    color: '#f97316',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  userName: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: '600',
    display: Platform.OS === 'web' ? 'flex' : 'none',
  },
  logoutBtn: {
    padding: 5,
  },
});

export default Header;
