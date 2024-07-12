export type Priority = 'low' | 'medium' | 'high';
export type TaskState = 'todo' | 'doing' | 'done';

export interface Task {
  TaskId: string;
  nazwa: string;
  opis: string;
  priorytet: Priority;
  historyjkaId: string;
  przewidywanyCzas: number;
  stan: TaskState;
  dataDodania: Date;
  dataStartu?: Date;
  dataZakonczenia?: Date;
  uzytkownikId?: string;
  uzytkownikRole?: string;
}

class TaskAPI {
  private tasks: Task[] = [];

  constructor() {
    this.loadFromLocalStorage();
  }

  addTask(task: Task) {
    this.tasks.push(task);
    this.saveToLocalStorage();
  }

  getAllTasks() {
    return this.tasks;
  }

  getTasksByStory(storyId: string) {
    return this.tasks.filter(task => task.historyjkaId === storyId);
  }

  updateTask(updatedTask: Task) {
    const index = this.tasks.findIndex(task => task.TaskId === updatedTask.TaskId);
    if (index !== -1) {
      this.tasks[index] = updatedTask;
      this.saveToLocalStorage();
    }
  }

  deleteTask(taskId: string) {
    this.tasks = this.tasks.filter(task => task.TaskId !== taskId);
    this.saveToLocalStorage();
  }

  getTaskById(taskId: string): Task | undefined {
    return this.tasks.find(task => task.TaskId === taskId);
  }

  clearTasks(){
    this.tasks = []
    this.saveToLocalStorage()
  }

  setTaskCompletionTime(taskId: string) {
    const task = this.getTaskById(taskId);
    if (task) {
      task.dataZakonczenia = new Date();
      this.updateTask(task);
    }
  }

  getTaskByprojectId() {
    const project = localStorage.getItem("activeProject");
    return project;
  }
  

  private saveToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  private loadFromLocalStorage() {
    const tasks = localStorage.getItem('tasks');
    if (tasks) {
      this.tasks = JSON.parse(tasks);
    }
  }
}

export default TaskAPI;
