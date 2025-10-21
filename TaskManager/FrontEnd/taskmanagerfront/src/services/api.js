import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// AUTH
export const registerUser = (userData) => API.post('/users/register', userData);

// PROJECTS
export const fetchProjects = () => API.get('/projects');
export const fetchProjectById = (id) => API.get(`/projects/${id}`);
export const createProject = (data) => API.post('/projects', data);
export const updateProject = (id, data) => API.put(`/projects/${id}`, data);
export const deleteProject = (id) => API.delete(`/projects/${id}`);
export const searchProjects = (query) => API.get(`/projects/search?q=${encodeURIComponent(query)}`); 
// TASKS
export const fetchTasks = () => API.get('/tasks');
export const fetchTasksForProject = (projectId) => API.get(`/tasks/project/${projectId}`);
export const fetchTaskById = (id) => API.get(`/tasks/${id}`);
export const createTask = (projectId, taskData) => API.post(`/tasks/project/${projectId}`, taskData);
export const updateTask = (taskId, taskData) => API.put(`/tasks/${taskId}`, taskData);
export const updateTaskStatus = (taskId, status) => API.patch(`/tasks/${taskId}/status?status=${status}`);
export const deleteTask = (id) => API.delete(`/tasks/${id}`);

// USERS
export const fetchUsers = () => API.get('/users');
export const fetchUserById = (id) => API.get(`/users/${id}`);
export const createUser = (userData) => API.post('/users', userData);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const loginUser = (credentials) => {
  return API.post('/users/login', credentials);
};