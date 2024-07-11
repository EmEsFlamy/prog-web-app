import "./style.css";
import ProjectAPI, { Project } from "./api/ProjectAPI";
import ActiveProjectAPI from "./api/ActiveProjectAPI";
import StoryAPI, { Story } from "./api/StoryAPI";
import TaskAPI from "./api/TaskAPI";

const projectAPI = new ProjectAPI();
const activeProjectAPI = new ActiveProjectAPI();
const storyAPI = new StoryAPI();
const taskAPI = new TaskAPI();

const projectList = document.getElementById("project-list") as HTMLUListElement;
const projectNameInput = document.getElementById(
  "project-name"
) as HTMLInputElement;
const projectDescriptionInput = document.getElementById(
  "project-description"
) as HTMLTextAreaElement;
const addProjectButton = document.getElementById(
  "add-project"
) as HTMLButtonElement;
const storyNameInput = document.getElementById(
  "story-name"
) as HTMLInputElement;
const storyDescriptionInput = document.getElementById(
  "story-description"
) as HTMLTextAreaElement;
const storyPrioritySelect = document.getElementById(
  "story-priority"
) as HTMLSelectElement;
const addStoryButton = document.getElementById(
  "add-story"
) as HTMLButtonElement;
const taskNameInput = document.getElementById("task-name") as HTMLInputElement;
const taskDescriptionInput = document.getElementById(
  "task-description"
) as HTMLTextAreaElement;
const taskPrioritySelect = document.getElementById(
  "task-priority"
) as HTMLSelectElement;
const taskEstimatedTimeInput = document.getElementById(
  "task-estimated-time"
) as HTMLInputElement;
const addTaskButton = document.getElementById("add-task") as HTMLButtonElement;
const loginUsernameInput = document.getElementById(
  "login-username"
) as HTMLInputElement;
const loginPasswordInput = document.getElementById(
  "login-password"
) as HTMLInputElement;
const loginButton = document.getElementById(
  "login-button"
) as HTMLButtonElement;
const logoutButton = document.getElementById(
  "logout-button"
) as HTMLButtonElement;
const mainContent = document.getElementById("main-content") as HTMLDivElement;
const loginContent = document.getElementById("login-content") as HTMLDivElement;

let loggedInUser: any | null = null;

const renderProjects = () => {
  projectList.innerHTML = "";
  const projects = projectAPI.getAllProjects();
  projects.forEach((project) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${project.nazwa}</h2>
      <p>${project.opis}</p>
      <button class="select" data-id="${project.id}">Select</button>
      <button class="delete" data-id="${project.id}">Delete</button>
    `;
    projectList.appendChild(li);
  });

  document.querySelectorAll(".select").forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      activeProjectAPI.setActiveProject(id);
      renderStories();
    });
  });

  document.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      const xx = storyAPI.getStoriesByProject(id);
      xx.forEach((x) => {
        const tasks = taskAPI.getTasksByStory(x.StoryId);
        tasks.forEach((t) => {
          taskAPI.deleteTask(t.TaskId);
        });
        storyAPI.deleteStory(x.StoryId);
      });
      projectAPI.deleteProject(id);
      activeProjectAPI.clearActiveProject();
      renderProjects();
      renderStories();
    });
  });
};

const renderStories = () => {
  const activeProjectId = activeProjectAPI.getActiveProject();
  const todoListElement = document.getElementById("todo-list");
  const doingListElement = document.getElementById("doing-list");
  const doneListElement = document.getElementById("done-list");
  const todoListTask = document.getElementById("todo-list-task");
  const doingListTask = document.getElementById("doing-list-task");
  const doneListTask = document.getElementById("done-list-task");
  if (!activeProjectId) {
    if (todoListElement) {
      todoListElement.innerHTML = "";
    }
    if (doingListElement) {
      doingListElement.innerHTML = "";
    }
    if (doneListElement) {
      doneListElement.innerHTML = "";
    }
    if (todoListTask) {
      todoListTask.innerHTML = "";
    }
    if (doingListTask) {
      doingListTask.innerHTML = "";
    }
    if (doneListTask) {
      doneListTask.innerHTML = "";
    }
    return;
  }

  const stories = storyAPI.getStoriesByProject(activeProjectId);
  if (todoListElement) {
    todoListElement.innerHTML = "";
  }
  if (doingListElement) {
    doingListElement.innerHTML = "";
  }
  if (doneListElement) {
    doneListElement.innerHTML = "";
  }
  stories.forEach((story) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${story.nazwa}</h2>
      <p>${story.opis}</p>
      <p>Priorytet: ${story.priorytet}</p>
      <p>Stan: ${story.stan}</p>
      <button class="delete" data-id="${story.StoryId}">Delete</button>
      <button class="todo" data-id="${story.StoryId}">Todo</button>
      <button class="doing" data-id="${story.StoryId}">Doing</button> 
      <button class="done" data-id="${story.StoryId}">Done</button>
      <button class="selectStory" data-id="${story.StoryId}">Select</button>
    `;

    li.setAttribute("data-id", story.StoryId);
    switch (story.stan) {
      case "todo":
        todoListElement?.appendChild(li);
        break;
      case "doing":
        doingListElement?.appendChild(li);
        break;
      case "done":
        doneListElement?.appendChild(li);
        break;
    }
  });

  document.querySelectorAll(".selectStory").forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      storyAPI.setActiveStory(id);
      renderStories();
    });
  });

  document.querySelectorAll(".delete").forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      const tasks = taskAPI.getTasksByStory(id);
      tasks.forEach((t) => {
        taskAPI.deleteTask(t.TaskId);
      });
      renderTasks(id);
      storyAPI.deleteStory(id);
      storyAPI.clearActiveStory();
      renderStories();
    });
  });

  document.querySelectorAll(".todo").forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      const ss = storyAPI.getStoryById(id);
      if (ss != null) {
        ss.stan = "todo";
        storyAPI.updateStory(ss);
      }
      renderStories();
    });
  });

  document.querySelectorAll(".doing").forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      const ss = storyAPI.getStoryById(id);
      if (ss != null) {
        ss.stan = "doing";
        storyAPI.updateStory(ss);
      }
      renderStories();
    });
  });

  document.querySelectorAll(".done").forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      const ss = storyAPI.getStoryById(id);
      if (ss != null) {
        ss.stan = "done";
        storyAPI.updateStory(ss);
      }
      renderStories();
    });
  });
};

const renderTasks = (storyId: string) => {
  const tasks = taskAPI.getTasksByStory(storyId);
  const todoListTask = document.getElementById("todo-list-task");
  const doingListTask = document.getElementById("doing-list-task");
  const doneListTask = document.getElementById("done-list-task");
  if (todoListTask) {
    todoListTask.innerHTML = "";
  }
  if (doingListTask) {
    doingListTask.innerHTML = "";
  }
  if (doneListTask) {
    doneListTask.innerHTML = "";
  }
  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <h2>${task.nazwa}</h2>
      <p>${task.opis}</p>
      <p>Priorytet: ${task.priorytet}</p>
      <p>Stan: ${task.stan}</p>
      <p>Przewidywany czas: ${task.przewidywanyCzas} h</p>
      <p>Użytkownik: ${loggedInUser.role}</p>
      <button class="deleteTask" data-id="${task.TaskId}">Delete</button>
      <button class="todoTask" data-id="${task.TaskId}">Todo</button>
      <button class="doingTask" data-id="${task.TaskId}">Doing</button>
      <button class="doneTask" data-id="${task.TaskId}">Done</button>
    `;
    if (loggedInUser?.role == "admin") {
      li.innerHTML += `
      <select id="user-type-${task.TaskId}"> 
        <option value="choose">Choose</option>
        <option value="devops">Devops</option>
        <option value="developer">Developer</option>
      </select>
      `;
      li.addEventListener("change", () => {
        const s = document.getElementById(
          `user-type-${task.TaskId}`
        ) as HTMLSelectElement;
        const t = taskAPI.getTaskById(task.TaskId);
        if (s != null && t != null) {
          t.uzytkownikId = s.value;
        }
        renderTasks(storyAPI.getActiveStory()!);
      });
    }
    li.setAttribute("data-id", task.TaskId);
    switch (task.stan) {
      case "todo":
        todoListTask?.appendChild(li);
        break;
      case "doing":
        doingListTask?.appendChild(li);
        break;
      case "done":
        doneListTask?.appendChild(li);
        break;
    }
  });

  document.querySelectorAll(".deleteTask").forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      taskAPI.deleteTask(id);
      renderTasks(storyId);
    });
  });

  document.querySelectorAll(".todoTask").forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      const st = taskAPI.getTaskById(id);
      if (st != null) {
        st.stan = "todo";
        taskAPI.updateTask(st);
      }
      renderTasks(storyId);
    });
  });

  document.querySelectorAll(".doingTask").forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      const st = taskAPI.getTaskById(id);
      if (st != null) {
        st.stan = "doing";
        taskAPI.updateTask(st);
      }
      renderTasks(storyId);
    });
  });

  document.querySelectorAll(".doneTask").forEach((button) => {
    button.addEventListener("click", () => {
      const id = (button as HTMLButtonElement).dataset.id!;
      const st = taskAPI.getTaskById(id);
      if (st != null) {
        st.stan = "done";
        taskAPI.updateTask(st);
        taskAPI.setTaskCompletionTime(id);
      }
      renderTasks(storyId);
    });
  });
};

addProjectButton.addEventListener("click", () => {
  const nazwa = projectNameInput.value;
  const opis = projectDescriptionInput.value;
  const id = Date.now().toString();
  const dataDodania = new Date();

  projectNameInput.value = "";
  projectDescriptionInput.value = "";

  const newProject: Project = {
    id,
    nazwa,
    opis,
    dataDodania,
  };

  projectAPI.addProject(newProject);
  renderProjects();
});

addStoryButton.addEventListener("click", () => {
  if (activeProjectAPI.getActiveProject() == "") {
    return;
  }
  const nazwa = storyNameInput.value;
  const opis = storyDescriptionInput.value;
  const priorytet = storyPrioritySelect.value as "niski" | "średni" | "wysoki";
  const stan = "todo";
  const StoryId = Date.now().toString();
  const projektId = activeProjectAPI.getActiveProject()!;
  const wlasciciel = loggedInUser ? loggedInUser.id : "unknown";

  storyNameInput.value = "";
  storyDescriptionInput.value = "";

  const newStory: Story = {
    StoryId,
    nazwa,
    opis,
    priorytet,
    stan,
    dataUtworzenia: new Date(),
    projektId,
    wlasciciel,
  };

  storyAPI.addStory(newStory);
  renderStories();
});

addTaskButton.addEventListener("click", () => {
  if (
    storyAPI.getActiveStory() == "" ||
    activeProjectAPI.getActiveProject() == ""
  ) {
    return;
  }
  const nazwa = taskNameInput.value;
  const opis = taskDescriptionInput.value;
  const priorytet = taskPrioritySelect.value as "niski" | "średni" | "wysoki";
  const przewidywanyCzas = parseInt(taskEstimatedTimeInput.value);
  const stan = "todo";
  const TaskId = Date.now().toString();
  const historyjkaId = storyAPI.getActiveStory()!;
  const uzytkownikId = loggedInUser ? loggedInUser.id : "unknown";
  taskNameInput.value = "";
  taskDescriptionInput.value = "";

  taskAPI.addTask({
    TaskId,
    nazwa,
    opis,
    priorytet,
    przewidywanyCzas,
    stan,
    dataDodania: new Date(),
    historyjkaId,
    uzytkownikId,
  });
  renderTasks(historyjkaId);
});

loginButton.addEventListener("click", async () => {
  const login = loginUsernameInput.value;
  const password = loginPasswordInput.value;

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ login, password }),
    });
    if (response.ok) {
      const { token, user } = await response.json();
      loggedInUser = user;
      console.log(loggedInUser);
      loginUsernameInput.value = "";
      loginPasswordInput.value = "";
      mainContent.style.display = "block";
      loginContent.style.display = "none";
      localStorage.setItem("token", JSON.stringify(token));
      alert("Login successful!");
    } else {
      const errorData = await response.json();
      alert(errorData.message);
    }
  } catch (error) {
    alert("Invalid data");
  }
});

logoutButton.addEventListener("click", () => {
  taskAPI.clearTasks();
  projectAPI.clearProjects();
  storyAPI.clearStories();
  activeProjectAPI.clearActiveProject();
  storyAPI.clearActiveStory();
  loginContent.style.display = "block";
  mainContent.style.display = "none";
  localStorage.removeItem("token");
});

const init = () => {
  renderProjects();
};

init();
