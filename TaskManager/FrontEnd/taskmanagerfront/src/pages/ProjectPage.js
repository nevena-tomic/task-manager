import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchTasksForProject, updateTask, createTask, deleteTask, fetchProjectById } from '../services/api';
import TaskCard from '../components/TaskCard';
import TaskForm from '../components/TaskForm';
import '../styles/ProjectPage.css';

function ProjectPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [project, setProject] = useState(null);
  const [viewingTask, setViewingTask] = useState(null); 

  useEffect(() => {
    loadProjectAndTasks();
  }, [id]);

  const loadProjectAndTasks = async () => {
    try {
      const [projectResponse, tasksResponse] = await Promise.all([
        fetchProjectById(id),
        fetchTasksForProject(id)
      ]);
      
      setProject(projectResponse.data);
      setTasks(tasksResponse.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  };

  const tasksByStatus = {
    TO_DO: tasks.filter(task => task.status === 'TO_DO'),
    IN_PROGRESS: tasks.filter(task => task.status === 'IN_PROGRESS'),
    DONE: tasks.filter(task => task.status === 'DONE')
  };

  const handleUpdateTask = async (taskId, updatedData) => {
    try {
      const response = await updateTask(taskId, updatedData);
      const updatedTasks = tasks.map(task => 
        task.id === taskId ? response.data : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task:', error);
      throw error;
    }
  };

  const handleCreateTask = async (projectId, taskData) => {
    const response = await createTask(projectId, taskData);
    setTasks(prev => [...prev, response.data]);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setViewingTask(null);
    setShowTaskForm(true);
  };

  const handleViewTask = (task) => {
    setViewingTask(task);
    setEditingTask(null); 
    setShowTaskForm(true);
  };

  const handleSaveTask = async (projectId, taskData, taskId) => {
    if (taskId) {
      await handleUpdateTask(taskId, taskData);
    } else {
      await handleCreateTask(projectId, taskData);
    }
    loadProjectAndTasks();
  };

  const handleCloseForm = () => {
    setShowTaskForm(false);
    setEditingTask(null);
    setViewingTask(null); 
  };

  const handleDeleteTask = async (taskId) => {
      try {
        await deleteTask(taskId);
        setTasks(prev => prev.filter(task => task.id !== taskId));
        if ((editingTask && editingTask.id === taskId) || (viewingTask && viewingTask.id === taskId)) {
          handleCloseForm();
        }
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task');
      }
  };

  return (
    <div className="project-page">
      <div className="project-header">
        <div className="header-left">
          <button 
            className="back-btn"
            onClick={() => navigate('/')}
          >
            ← Back to Projects
          </button>
          <h2>Tasks for {project ? project.name : 'Project'}</h2>
        </div>
        <button 
          className="btn-primary"
          onClick={() => {
            setEditingTask(null);
            setViewingTask(null);
            setShowTaskForm(true);
          }}
        >
          + Add New Task
        </button>
      </div>

      <div className="tasks-columns-container">
        <div className="task-column">
          <div className="column-header">
            <h3>To Do</h3>
            <span className="task-count">{tasksByStatus.TO_DO.length}</span>
          </div>
          <div className="task-cards-container">
            {tasksByStatus.TO_DO.map(task => (
              <div key={task.id} className="task-card-wrapper">
                <TaskCard 
                  task={task} 
                  onClick={handleViewTask} 
                />
                <div className="task-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {tasksByStatus.TO_DO.length === 0 && (
              <div className="empty-column-message">No tasks in To Do</div>
            )}
          </div>
        </div>

        <div className="task-column">
          <div className="column-header">
            <h3>In Progress</h3>
            <span className="task-count">{tasksByStatus.IN_PROGRESS.length}</span>
          </div>
          <div className="task-cards-container">
            {tasksByStatus.IN_PROGRESS.map(task => (
              <div key={task.id} className="task-card-wrapper">
                <TaskCard 
                  task={task} 
                  onClick={handleViewTask} 
                />
                <div className="task-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {tasksByStatus.IN_PROGRESS.length === 0 && (
              <div className="empty-column-message">No tasks in Progress</div>
            )}
          </div>
        </div>

        <div className="task-column">
          <div className="column-header">
            <h3>Done</h3>
            <span className="task-count">{tasksByStatus.DONE.length}</span>
          </div>
          <div className="task-cards-container">
            {tasksByStatus.DONE.map(task => (
              <div key={task.id} className="task-card-wrapper">
                <TaskCard 
                  task={task} 
                  onClick={handleViewTask} 
                />
                <div className="task-actions">
                  <button 
                    className="btn-edit"
                    onClick={() => handleEditTask(task)}
                  >
                    Edit
                  </button>
                  <button 
                    className="btn-delete"
                    onClick={() => handleDeleteTask(task.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
            {tasksByStatus.DONE.length === 0 && (
              <div className="empty-column-message">No tasks in Done</div>
            )}
          </div>
        </div>
      </div>

      {showTaskForm && (
        <TaskForm
          projectId={id}
          task={editingTask || viewingTask} 
          onClose={handleCloseForm}
          onSave={handleSaveTask}
          isEditing={!!editingTask} 
          isViewOnly={!!viewingTask}
        />
      )}
    </div>
  );
}

export default ProjectPage;