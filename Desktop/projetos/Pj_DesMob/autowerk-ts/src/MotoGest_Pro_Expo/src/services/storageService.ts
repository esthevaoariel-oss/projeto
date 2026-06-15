import AsyncStorage from '@react-native-async-storage/async-storage';
import type { User, UserData, ServiceRecord } from '../types';

export interface IStorageService {
  getUsers(): Promise<User[]>;
  saveUser(user: User): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  login(user: User): Promise<void>;
  logout(): Promise<void>;
  getUserData(): Promise<UserData>;
  saveUserData(data: UserData): Promise<void>;
  seedAdmin(): Promise<void>;
  // Histórico e Relatórios
  addServiceRecord(record: ServiceRecord): Promise<void>;
  getServiceRecordsByDay(date: string): Promise<ServiceRecord[]>;
  getServiceRecordsByWeek(date: string): Promise<ServiceRecord[]>;
  getServiceRecordsByMonth(year: number, month: number): Promise<ServiceRecord[]>;
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
    if (!currentUser) return { motos: [], funcionarios: [], appointments: [], serviceRecords: [] };

    const data = await AsyncStorage.getItem(`${DATA_PREFIX}${currentUser.id}`);
    if (data) {
      const parsed = JSON.parse(data);
      return {
        ...parsed,
        serviceRecords: parsed.serviceRecords || []
      };
    }

    return { motos: [], funcionarios: [], appointments: [], serviceRecords: [] };
  }
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
        ],
        serviceRecords: [
          {
            id: 'sr1',
            motoId: 'm1',
            placa: 'ABC-1234',
            modelo: 'CB 500F',
            marca: 'Honda',
            proprietario: 'João Silva',
            servicos: ['Troca de Óleo'],
            dataInicio: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dataConclusao: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'concluido',
            custo: 150
          },
          {
            id: 'sr2',
            motoId: 'm2',
            placa: 'XYZ-9876',
            modelo: 'MT-07',
            marca: 'Yamaha',
            proprietario: 'Maria Souza',
            servicos: ['Revisão Geral', 'Troca de Pneu'],
            dataInicio: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            dataConclusao: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'concluido',
            custo: 450
          }
        ]
      };

      await AsyncStorage.setItem(`${DATA_PREFIX}${admin.id}`, JSON.stringify(seedData));
    }
  }

  // Histórico e Relatórios
  async addServiceRecord(record: ServiceRecord): Promise<void> {
    const data = await this.getUserData();
    data.serviceRecords.push(record);
    await this.saveUserData(data);
  }

  async getServiceRecordsByDay(date: string): Promise<ServiceRecord[]> {
    const data = await this.getUserData();
    return data.serviceRecords.filter(record => record.dataConclusao.startsWith(date));
  }

  async getServiceRecordsByWeek(date: string): Promise<ServiceRecord[]> {
    const targetDate = new Date(date);
    const weekStart = new Date(targetDate);
    weekStart.setDate(targetDate.getDate() - targetDate.getDay());
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);

    const data = await this.getUserData();
    return data.serviceRecords.filter(record => {
      const recordDate = new Date(record.dataConclusao);
      return recordDate >= weekStart && recordDate <= weekEnd;
    });
  }

  async getServiceRecordsByMonth(year: number, month: number): Promise<ServiceRecord[]> {
    const data = await this.getUserData();
    return data.serviceRecords.filter(record => {
      const recordDate = new Date(record.dataConclusao);
      return recordDate.getFullYear() === year && recordDate.getMonth() === month - 1;
    });
  }
}
