
import './style.css';
import ProjectAPI, { Project } from './api/ProjectAPI';

const projectAPI = new ProjectAPI();

const projectList = document.getElementById('project-list') as HTMLUListElement;
const projectNameInput = document.getElementById('project-name') as HTMLInputElement;
const projectDescriptionInput = document.getElementById('project-description') as HTMLTextAreaElement;
const addProjectButton = document.getElementById('add-project') as HTMLButtonElement;

const renderProjects = () => {
  projectList.innerHTML = '';
  const projects = projectAPI.getAllProjects();
  projects.forEach(project => {
    const li = document.createElement('li');
    li.innerHTML = `
      <h2>${project.nazwa}</h2>
      <p>${project.opis}</p>
      <button class="delete" data-id="${project.id}">Delete</button>
    `;
    projectList.appendChild(li);
  });

  document.querySelectorAll('.delete').forEach(button => {
    button.addEventListener('click', () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      projectAPI.deleteProject(id);
      renderProjects();
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

renderProjects();
