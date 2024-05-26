
import './style.css';
import ProjectAPI, { Project } from './api/ProjectAPI';
import UserAPI, { User } from './api/UserAPI';
import ActiveProjectAPI from './api/ActiveProjectAPI';
import StoryAPI, { Story } from './api/StoryAPI';

const projectAPI = new ProjectAPI();
const userAPI = new UserAPI();
const activeProjectAPI = new ActiveProjectAPI();
const storyAPI = new StoryAPI();

const projectList = document.getElementById('project-list') as HTMLUListElement;
const projectNameInput = document.getElementById('project-name') as HTMLInputElement;
const projectDescriptionInput = document.getElementById('project-description') as HTMLTextAreaElement;
const addProjectButton = document.getElementById('add-project') as HTMLButtonElement;
const storyList = document.getElementById('story-list') as HTMLUListElement;
const storyNameInput = document.getElementById('story-name') as HTMLInputElement;
const storyDescriptionInput = document.getElementById('story-description') as HTMLTextAreaElement;
const storyPrioritySelect = document.getElementById('story-priority') as HTMLSelectElement;
const addStoryButton = document.getElementById('add-story') as HTMLButtonElement;

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
      <button class="delete" data-id="${story.id}">Delete</button>
    `;
    storyList.appendChild(li);
  });

  document.querySelectorAll('.delete').forEach(button => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      storyAPI.deleteStory(id);
      renderStories();
    });
  });
};

addProjectButton.addEventListener('click', () => {
  const newProject: Project = {
    id: Date.now().toString(),
    nazwa: projectNameInput.value,
    opis: projectDescriptionInput.value
  };
  projectAPI.addProject(newProject);
  projectNameInput.value = '';
  projectDescriptionInput.value = '';
  renderProjects();
});

addStoryButton.addEventListener('click', () => {
  const activeProjectId = activeProjectAPI.getActiveProject();
  if (!activeProjectId) return;

  const currentUser = userAPI.getCurrentUser();
  const newStory: Story = {
    id: Date.now().toString(),
    nazwa: storyNameInput.value,
    opis: storyDescriptionInput.value,
    priorytet: storyPrioritySelect.value as 'niski' | 'średni' | 'wysoki',
    projekt: activeProjectId,
    dataUtworzenia: new Date(),
    stan: 'todo',
    wlasciciel: currentUser.id
  };
  storyAPI.addStory(newStory);
  storyNameInput.value = '';
  storyDescriptionInput.value = '';
  renderStories();
});

renderProjects();
renderStories();
