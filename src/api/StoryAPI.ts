export interface Story {
    StoryId: string;
    nazwa: string;
    opis: string;
    priorytet: 'niski' | 'średni' | 'wysoki';
    projektId: string;
    dataUtworzenia: Date;
    stan: 'todo' | 'doing' | 'done';
    wlasciciel: string;
  }
  
  class StoryAPI {
    private storageKey: string;
    private stories: Story[];
  
    constructor() {
      this.storageKey = 'stories';
      this.stories = JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    }
  
    getStoriesByProject(projectId: string): Story[] {
      return this.stories.filter(story => story.projektId === projectId);
    }
  
    addStory(story: Story): void {
      this.stories.push(story);
      this.saveToLocalStorage();
    }
  
    updateStory(updatedStory: Story): void {
      const index = this.stories.findIndex(story => story.StoryId === updatedStory.StoryId);
      if (index !== -1) {
        this.stories[index] = updatedStory;
        this.saveToLocalStorage();
      }
    }
  
    deleteStory(id: string): void {
      this.stories = this.stories.filter(story => story.StoryId !== id);
      this.saveToLocalStorage();
    }
  
    private saveToLocalStorage(): void {
      localStorage.setItem(this.storageKey, JSON.stringify(this.stories));
    }
  }
  
  export default StoryAPI;
  