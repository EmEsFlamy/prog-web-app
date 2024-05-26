export interface User {
    id: string;
    imie: string;
    nazwisko: string;
  }
  
  class UserAPI {
    private currentUser: User | null;
  
    constructor() {
      this.currentUser = {
        id: '1',
        imie: 'Jan',
        nazwisko: 'Kowalski'
      };
    }
  
    getCurrentUser(): User {
      return this.currentUser!;
    }
  }
  
  export default UserAPI;
  