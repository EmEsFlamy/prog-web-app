export type Role = 'admin' | 'devops' | 'developer';

export interface User {
  id: string;
  imie: string;
  nazwisko: string;
  rola: Role;
}

class UserAPI {
  private currentUser: User | null;
  private users: User[];

  constructor() {
    this.users = [
      { id: '1', imie: 'Jan', nazwisko: 'Kowalski', rola: 'admin' },
      { id: '2', imie: 'Anna', nazwisko: 'Nowak', rola: 'developer' },
      { id: '3', imie: 'Piotr', nazwisko: 'Wiśniewski', rola: 'devops' },
    ];
    this.currentUser = this.users.find(user => user.rola === 'admin') || null;
  }

  getCurrentUser(): User {
    return this.currentUser!;
  }

  getAllUsers(): User[] {
    return this.users;
  }

  getUserById(id: string): User | undefined {
    return this.users.find(user => user.id === id);
  }
}

export default UserAPI;
