// src/main.ts

import './style.css';
import ProjectAPI from './api/ProjectAPI';
import UserAPI, { User } from './api/UserAPI';
import ActiveProjectAPI from './api/ActiveProjectAPI';
import StoryAPI from './api/StoryAPI';
import TaskAPI from './api/TaskAPI';

const projectAPI = new ProjectAPI();
const userAPI = new UserAPI();
const activeProjectAPI = new ActiveProjectAPI();
const storyAPI = new StoryAPI();
const taskAPI = new TaskAPI();

const projectList = document.getElementById('project-list') as HTMLUListElement;
const projectNameInput = document.getElementById('project-name') as HTMLInputElement;
const projectDescriptionInput = document.getElementById('project-description') as HTMLTextAreaElement;
const addProjectButton = document.getElementById('add-project') as HTMLButtonElement;
const storyList = document.getElementById('story-list') as HTMLUListElement;
const storyNameInput = document.getElementById('story-name') as HTMLInputElement;
const storyDescriptionInput = document.getElementById('story-description') as HTMLTextAreaElement;
const storyPrioritySelect = document.getElementById('story-priority') as HTMLSelectElement;
const addStoryButton = document.getElementById('add-story') as HTMLButtonElement;
const taskList = document.getElementById('task-list') as HTMLUListElement;
const taskNameInput = document.getElementById('task-name') as HTMLInputElement;
const taskDescriptionInput = document.getElementById('task-description') as HTMLTextAreaElement;
const taskPrioritySelect = document.getElementById('task-priority') as HTMLSelectElement;
const taskEstimatedTimeInput = document.getElementById('task-estimated-time') as HTMLInputElement;
const addTaskButton = document.getElementById('add-task') as HTMLButtonElement;

const loggedInUser = userAPI.getCurrentUser(); // Pobierz zalogowanego użytkownika

const renderProjects = () => {
  projectList.innerHTML = '';
  const projects = projectAPI.getAllProjects();
  projects.forEach(project => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h2>${project.nazwa}</h2>
      <p>${project.opis}</p>
      <button class="select" data-id="${project.id}">Select</button>
      <button class="delete" data-id="${project.id}">Delete</button>
    `;
    projectList.appendChild(li);
  });

  document.querySelectorAll('.select').forEach(button => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      activeProjectAPI.setActiveProject(id);
      renderStories();
    });
  });

  document.querySelectorAll('.delete').forEach(button => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      projectAPI.deleteProject(id);
      renderProjects();
    });
  });
};

const renderStories = () => {
  storyList.innerHTML = '';
  const activeProjectId = activeProjectAPI.getActiveProject();
  if (!activeProjectId) return;

  const stories = storyAPI.getStoriesByProject(activeProjectId);
  stories.forEach(story => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h2>${story.nazwa}</h2>
      <p>${story.opis}</p>
      <p>Priorytet: ${story.priorytet}</p>
      <p>Stan: ${story.stan}</p>
      <button class="view-tasks" data-id="${story.StoryId}">View Tasks</button>
      <button class="delete" data-id="${story.StoryId}">Delete</button>
    `;
    storyList.appendChild(li);
  });

  document.querySelectorAll('.view-tasks').forEach(button => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      renderTasks(id);
    });
  });

  document.querySelectorAll('.delete').forEach(button => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      storyAPI.deleteStory(id);
      renderStories();
    });
  });
};

const renderTasks = (storyId: string) => {
  taskList.innerHTML = '';
  const tasks = taskAPI.getTasksByStory(storyId);
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h2>${task.nazwa}</h2>
      <p>${task.opis}</p>
      <p>Priorytet: ${task.priorytet}</p>
      <p>Stan: ${task.stan}</p>
      <button class="assign" data-id="${task.TaskId}">Assign</button>
      <button class="complete" data-id="${task.TaskId}">Complete</button>
      <button class="delete" data-id="${task.TaskId}">Delete</button>
    `;
    taskList.appendChild(li);
  });

  document.querySelectorAll('.assign').forEach(button => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      assignTask(id);
    });
  });

  document.querySelectorAll('.complete').forEach(button => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      completeTask(id);
    });
  });

  document.querySelectorAll('.delete').forEach(button => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      taskAPI.deleteTask(id);
      renderTasks(storyId);
    });
  });
};

const assignTask = (taskId: string) => {
  const task = taskAPI.getTaskById(taskId);
  if (task) {
    task.uzytkownikId = loggedInUser.id;
    task.stan = 'doing';
    task.dataStartu = new Date();
    taskAPI.updateTask(task);
    renderTasks(task.TaskId);
  }
};

const completeTask = (taskId: string) => {
  const task = taskAPI.getTaskById(taskId);
  if (task) {
    task.stan = 'done';
    task.dataZakonczenia = new Date();
    taskAPI.updateTask(task);
    renderTasks(task.TaskId);
  }
};

addProjectButton.addEventListener('click', () => {
  const id = Date.now().toString();
  const nazwa = projectNameInput.value;
  const opis = projectDescriptionInput.value;
  projectAPI.addProject({ id, nazwa, opis });
  renderProjects();
});

addStoryButton.addEventListener('click', () => {
  const id = Date.now().toString();
  const nazwa = storyNameInput.value;
  const opis = storyDescriptionInput.value;
  const priorytet = storyPrioritySelect.value as 'niski' | 'średni' | 'wysoki';
  const projektId = activeProjectAPI.getActiveProject()!;
  storyAPI.addStory({ StoryId: id, nazwa, opis, priorytet, projektId, dataUtworzenia: new Date(), stan: 'todo', wlasciciel: loggedInUser.id });
  renderStories();
});

addTaskButton.addEventListener('click', () => {
  const id = Date.now().toString();
  const nazwa = taskNameInput.value;
  const opis = taskDescriptionInput.value;
  const priorytet = taskPrioritySelect.value as 'niski' | 'średni' | 'wysoki';
  const storyId = (storyList.querySelector('li.selected') as HTMLElement)?.dataset.id;
  if (!storyId) return;
  const przewidywanyCzas = parseInt(taskEstimatedTimeInput.value); 

  taskAPI.addTask({
    TaskId: id,
    nazwa,
    opis,
    priorytet,
    historyjkaId: storyId,  
    przewidywanyCzas,       
    dataDodania: new Date(),
    stan: 'todo',
    uzytkownikId: ''        
  });
  renderTasks(storyId);
});


renderProjects();
renderStories();
