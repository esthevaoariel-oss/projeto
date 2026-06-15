import { User, UserData } from '../types';

export interface IStorageService {
  getUsers(): User[];
  saveUser(user: User): void;
  getCurrentUser(): User | null;
  login(user: User): void;
  logout(): void;
  getUserData(): UserData;
  saveUserData(data: UserData): void;
  seedAdmin(): void;
}

const USERS_KEY = '@MotoGest:users';
const CURRENT_USER_KEY = '@MotoGest:currentUser';
const DATA_PREFIX = '@MotoGest:data:';

export class LocalStorageService implements IStorageService {
  getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  saveUser(user: User): void {
    const users = this.getUsers();
    users.push(user);
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  login(user: User): void {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }

  logout(): void {
    localStorage.removeItem(CURRENT_USER_KEY);
  }

  getUserData(): UserData {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return { motos: [], funcionarios: [], appointments: [] };

    const data = localStorage.getItem(`${DATA_PREFIX}${currentUser.id}`);
    if (data) {
      return JSON.parse(data);
    }

    return { motos: [], funcionarios: [], appointments: [] };
  }

  saveUserData(data: UserData): void {
    const currentUser = this.getCurrentUser();
    if (!currentUser) return;

    localStorage.setItem(`${DATA_PREFIX}${currentUser.id}`, JSON.stringify(data));
  }

  seedAdmin(): void {
    const users = this.getUsers();
    if (!users.find(u => u.username === 'admin')) {
      const admin: User = {
        id: 'admin_123',
        username: 'admin',
        password: '123',
        oficina: 'MotoGest Pro Oficina',
        phone: '11999999999',
        whatsapp: '11999999999'
      };
      this.saveUser(admin);

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

      localStorage.setItem(`${DATA_PREFIX}${admin.id}`, JSON.stringify(seedData));
    }
  }
}
