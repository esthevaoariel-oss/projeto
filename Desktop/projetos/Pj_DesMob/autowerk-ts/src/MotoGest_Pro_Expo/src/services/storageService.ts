import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserData } from '../types';

export interface IStorageService {
  getUsers(): Promise<User[]>;
  saveUser(user: User): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  login(user: User): Promise<void>;
  logout(): Promise<void>;
  getUserData(): Promise<UserData>;
  saveUserData(data: UserData): Promise<void>;
  seedAdmin(): Promise<void>;
}

const USERS_KEY = '@MotoGest:users';
const CURRENT_USER_KEY = '@MotoGest:currentUser';
const DATA_PREFIX = '@MotoGest:data:';

export class AsyncStorageService implements IStorageService {
  async getUsers(): Promise<User[]> {
    const users = await AsyncStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  async saveUser(user: User): Promise<void> {
    const users = await this.getUsers();
    users.push(user);
    await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  async getCurrentUser(): Promise<User | null> {
    const user = await AsyncStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  async login(user: User): Promise<void> {
    await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  async logout(): Promise<void> {
    await AsyncStorage.removeItem(CURRENT_USER_KEY);
  }

  async getUserData(): Promise<UserData> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return { motos: [], funcionarios: [], appointments: [] };

    const data = await AsyncStorage.getItem(`${DATA_PREFIX}${currentUser.id}`);
    if (data) {
      return JSON.parse(data);
    }

    return { motos: [], funcionarios: [], appointments: [] };
  }

  async saveUserData(data: UserData): Promise<void> {
    const currentUser = await this.getCurrentUser();
    if (!currentUser) return;

    await AsyncStorage.setItem(`${DATA_PREFIX}${currentUser.id}`, JSON.stringify(data));
  }

  async seedAdmin(): Promise<void> {
    const users = await this.getUsers();
    if (!users.find(u => u.username === 'admin')) {
      const admin: User = {
        id: 'admin_123',
        username: 'admin',
        password: '123',
        oficina: 'MotoGest Pro Oficina',
        phone: '11999999999',
        whatsapp: '11999999999'
      };
      await this.saveUser(admin);

      const seedData: UserData = {
        motos: [
          {
            id: 'm1',
            placa: 'ABC-1234',
            modelo: 'CB 500F',
            marca: 'Honda',
            ano: 2021,
            proprietario: 'João Silva',
            servicos: ['Troca de Óleo', 'Revisão Geral']
          },
          {
            id: 'm2',
            placa: 'XYZ-9876',
            modelo: 'MT-07',
            marca: 'Yamaha',
            ano: 2023,
            proprietario: 'Maria Souza',
            servicos: []
          }
        ],
        funcionarios: [
          {
            id: 'f1',
            nome: 'Carlos Mecânico',
            cargo: 'Mecânico Chefe',
            telefone: '11988888888',
            especialidades: ['Motor', 'Elétrica']
          }
        ],
        appointments: [
          {
            id: 'a1',
            date: new Date().toISOString().split('T')[0],
            motoId: 'm1',
            servicos: ['Troca de Óleo'],
            descricao: 'Cliente pediu urgência',
            status: 'pendente'
          }
        ]
      };

      await AsyncStorage.setItem(`${DATA_PREFIX}${admin.id}`, JSON.stringify(seedData));
    }
  }
}
