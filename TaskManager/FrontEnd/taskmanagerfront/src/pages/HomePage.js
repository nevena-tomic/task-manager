import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/Auth';
import { fetchProjects, createProject, updateProject, deleteProject, searchProjects } from '../services/api';
import ProjectCard from '../components/ProjectCard';
import ProjectPopup from '../components/ProjectPopup';
import '../styles/HomePage.css';

function HomePage() {
  const [projects, setProjects] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // NEW
  const [isSearching, setIsSearching] = useState(false); // NEW
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      const response = await fetchProjects();
      setProjects(response.data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      loadProjects();
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await searchProjects(query);
      setProjects(response.data);
    } catch (error) {
      console.error('Error searching projects:', error);
      loadProjects();
    }
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setIsSearching(false);
    loadProjects();
  };

  const handleCreateProject = async (projectData) => {
    await createProject(projectData);
    loadProjects();
    setSearchQuery('');
  };

  const handleUpdateProject = async (projectId, projectData) => {
    await updateProject(projectId, projectData);
    loadProjects();
  };

  const handleDeleteProject = async (projectId) => {
      try {
        await deleteProject(projectId);
        setProjects(prev => prev.filter(project => project.id !== projectId));
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
  };

  const handleSaveProject = async (projectData) => {
    if (editingProject) {
      await handleUpdateProject(editingProject.id, projectData);
    } else {
      await handleCreateProject(projectData);
    }
  };

  const handleLogout = () => {
      logout();
      navigate('/login');
  };

  return (
    <div className="home-page">
      <div className="main-header">
        <div className="header-content">
          <h1>Project Manager</h1>
          <div className="user-section">
            <span className="welcome-message">Zdravo, {user?.username}!</span>
            <button 
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="projects-section">
        <div className="projects-header">
          <h2>My Projects</h2>
          <button 
            className="btn-primary"
            onClick={() => {
              setEditingProject(null);
              setShowProjectForm(true);
            }}
          >
            + New Project
          </button>
        </div>

        <div className="search-container">
          <input
            type="text"
            placeholder="Search projects by name or description..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
          {searchQuery && (
            <button 
              onClick={handleClearSearch}
              className="clear-search-btn"
            >
              Clear
            </button>
          )}
          {isSearching && <span className="searching-indicator">Searching...</span>}
        </div>

        <div className="projects-grid">
          {projects.map(project => (
            <div key={project.id} className="project-card-wrapper">
              <ProjectCard 
                project={project} 
                onClick={(projectId) => navigate(`/project/${projectId}`)} 
              />
              <div className="project-actions">
                <button 
                  className="btn-edit"
                  onClick={() => {
                    setEditingProject(project);
                    setShowProjectForm(true);
                  }}
                >
                  Edit
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDeleteProject(project.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && (
          <div className="empty-projects">
            <p>
              {searchQuery 
                ? `No projects found for "${searchQuery}"` 
                : 'No projects yet. Create your first project to get started!'
              }
            </p>
          </div>
        )}
      </div>

      {showProjectForm && (
        <ProjectPopup
          project={editingProject}
          onClose={() => {
            setShowProjectForm(false);
            setEditingProject(null);
          }}
          onSave={handleSaveProject}
          isEditing={!!editingProject}
        />
      )}
    </div>
  );
}

export default HomePage;