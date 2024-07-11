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

    setActiveStory(StoryId: string): void {
      localStorage.setItem("SelectedStory", StoryId);
    }

    getActiveStory(): string | null {
      return localStorage.getItem("SelectedStory");
    }

    clearActiveStory() {
      this.setActiveStory("");
    }
  
    getStoriesByProject(projectId: string): Story[] {
      return this.stories.filter(story => story.projektId === projectId);
    }

    getStoryById(storyId: string): Story | undefined {
      return this.stories.find(story => story.StoryId === storyId)

    }
  
    addStory(story: Story): void {
      this.stories.push(story);
      this.saveToLocalStorage();
    }
  
    updateStory(updatedStory: Story): void {
      const index = this.stories.findIndex(story => story.StoryId === updatedStory.StoryId);
      if (index !== -1) {
        console.log(index);
        this.stories[index] = updatedStory;
        this.saveToLocalStorage();
      }
    }
  
    deleteStory(id: string): void {
      this.stories = this.stories.filter(story => story.StoryId !== id);
      this.saveToLocalStorage();
    }

    clearStories(){
      this.stories = []
      this.saveToLocalStorage()
    }
  
    private saveToLocalStorage(): void {
      localStorage.setItem(this.storageKey, JSON.stringify(this.stories));
    }
  }
  
  export default StoryAPI;
  