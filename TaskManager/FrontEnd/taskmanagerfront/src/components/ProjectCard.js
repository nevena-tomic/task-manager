import React from 'react';
import '../styles/ProjectCard.css'; 

function ProjectCard({ project, onClick }) {
  return (
    <div className="project-card" onClick={() => onClick(project.id)}>
      <h3>{project.name}</h3>
      <p>{project.description || 'No description available.'}</p>
    </div>
  );
}

export default ProjectCard;
