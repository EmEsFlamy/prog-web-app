class ActiveProjectAPI {
    private storageKey: string;
  
    constructor() {
      this.storageKey = 'activeProject';
    }
  
    setActiveProject(projectId: string): void {
      localStorage.setItem(this.storageKey, projectId);
    }
  
    getActiveProject(): string | null {
      return localStorage.getItem(this.storageKey);
    }

    clearActiveProject() {
      this.setActiveProject("");
    }
  }
  
  export default ActiveProjectAPI;
  