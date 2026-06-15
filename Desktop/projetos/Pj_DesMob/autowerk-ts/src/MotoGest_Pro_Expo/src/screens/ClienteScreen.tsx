import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Linking
} from 'react-native';
import { LogIn, UserPlus, Phone, MessageCircle } from 'lucide-react-native';
import { useStorage } from '../contexts/StorageContext';
import { User } from '../types';

interface ClienteScreenProps {
  onLoginSuccess: (user: User) => void;
}

const ClienteScreen: React.FC<ClienteScreenProps> = ({ onLoginSuccess }) => {
  const storage = useStorage();
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'client'>('client');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [oficina, setOficina] = useState('');
  
  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Erro', 'Preencha todos os campos.');
      return;
    }
    
    const users = await storage.getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (user) {
      await storage.login(user);
      onLoginSuccess(user);
    } else {
      Alert.alert('Erro', 'Usuário ou senha inválidos.');
    }
  };

  const handleRegister = async () => {
    if (!username || !password || !oficina) {
      Alert.alert('Erro', 'Preencha todos os campos obrigatórios.');
      return;
    }
    
    const users = await storage.getUsers();
    if (users.find(u => u.username === username)) {
      Alert.alert('Erro', 'Nome de usuário já existe.');
      return;
    }
    
    const newUser: User = {
      id: Date.now().toString(),
      username,
      password,
      oficina,
    };
    
    await storage.saveUser(newUser);
    await storage.login(newUser);
    onLoginSuccess(newUser);
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>MotoGest <Text style={{color: '#f97316'}}>Pro</Text></Text>
          <Text style={styles.heroSubtitle}>Gestão profissional para sua oficina de motos.</Text>
        </View>

        <View style={styles.authCard}>
          <View style={styles.tabs}>
            <TouchableOpacity 
              onPress={() => setActiveTab('client')}
              style={[styles.tab, activeTab === 'client' && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === 'client' && styles.activeTabText]}>Área Cliente</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setActiveTab('login')}
              style={[styles.tab, activeTab === 'login' && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === 'login' && styles.activeTabText]}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setActiveTab('register')}
              style={[styles.tab, activeTab === 'register' && styles.activeTab]}
            >
              <Text style={[styles.tabText, activeTab === 'register' && styles.activeTabText]}>Cadastro</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            {activeTab === 'client' ? (
              <View style={styles.clientArea}>
                <Text style={styles.clientText}>Precisa de ajuda ou agendar um serviço? Entre em contato conosco:</Text>
                
                <TouchableOpacity 
                  style={styles.whatsappBtn}
                  onPress={() => Linking.openURL('whatsapp://send?phone=5511999999999')}
                >
                  <MessageCircle color="#fff" size={24} />
                  <Text style={styles.actionBtnText}>Falar no WhatsApp</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                  style={styles.phoneBtn}
                  onPress={() => Linking.openURL('tel:1140028922')}
                >
                  <Phone color="#fff" size={24} />
                  <Text style={styles.actionBtnText}>Ligar para a Oficina</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {activeTab === 'register' && (
                  <View style={styles.inputGroup}>
                    <Text style={styles.label}>Nome da Oficina</Text>
                    <TextInput 
                      style={styles.input}
                      placeholder="Ex: Oficina do João"
                      placeholderTextColor="#64748b"
                      value={oficina}
                      onChangeText={setOficina}
                    />
                  </View>
                )}
                
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Usuário</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="Seu usuário"
                    placeholderTextColor="#64748b"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Senha</Text>
                  <TextInput 
                    style={styles.input}
                    placeholder="Sua senha"
                    placeholderTextColor="#64748b"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                  />
                </View>

                <TouchableOpacity 
                  style={styles.submitBtn}
                  onPress={activeTab === 'login' ? handleLogin : handleRegister}
                >
                  <Text style={styles.submitBtnText}>
                    {activeTab === 'login' ? 'Entrar no Sistema' : 'Criar Minha Conta'}
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>

        <View style={styles.contacts}>
          <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL('whatsapp://send?phone=5511999999999')}>
            <MessageCircle color="#25D366" size={20} />
            <Text style={styles.contactText}>(11) 99999-9999</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.contactItem} onPress={() => Linking.openURL('tel:1140028922')}>
            <Phone color="#f97316" size={20} />
            <Text style={styles.contactText}>(11) 4002-8922</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    padding: 20,
    paddingTop: 60,
    alignItems: 'center',
  },
  hero: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroTitle: {
    fontSize: 42,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 10,
  },
  heroSubtitle: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
  },
  authCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 32,
    width: '100%',
    maxWidth: 400,
    padding: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  tabs: {
    flexDirection: 'row',
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderBottomColor: '#f97316',
  },
  tabText: {
    color: '#94a3b8',
    fontWeight: '600',
  },
  activeTabText: {
    color: '#f97316',
  },
  form: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  input: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: 12,
    padding: 12,
    color: '#fff',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  submitBtn: {
    backgroundColor: '#f97316',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  clientArea: {
    gap: 16,
    alignItems: 'center',
    paddingVertical: 10,
  },
  clientText: {
    color: '#cbd5e1',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 8,
    lineHeight: 24,
  },
  whatsappBtn: {
    backgroundColor: '#25D366',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  phoneBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  contacts: {
    flexDirection: 'row',
    marginTop: 40,
    gap: 20,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  contactText: {
    color: '#94a3b8',
    fontSize: 14,
  },
});

export default ClienteScreen;
