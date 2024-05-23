

export interface Project {
    id: string;
    nazwa: string;
    opis: string;
  }
  
  class ProjectAPI {
    private storageKey: string;
    private projects: Project[];
  
    constructor() {
      this.storageKey = 'projects';
      this.projects = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }
  
    getAllProjects(): Project[] {
      return this.projects;
    }
  
    getProjectById(id: string): Project | undefined {
      return this.projects.find(project => project.id === id);
    }
  
    addProject(project: Project): void {
      this.projects.push(project);
      this.saveToLocalStorage();
    }
  
    updateProject(updatedProject: Project): void {
      const index = this.projects.findIndex(project => project.id === updatedProject.id);
      if (index !== -1) {
        this.projects[index] = updatedProject;
        this.saveToLocalStorage();
      }
    }
  
    deleteProject(id: string): void {
      this.projects = this.projects.filter(project => project.id !== id);
      this.saveToLocalStorage();
    }
  
    private saveToLocalStorage(): void {
      localStorage.setItem(this.storageKey, JSON.stringify(this.projects));
    }
  }
  
  export default ProjectAPI;
  