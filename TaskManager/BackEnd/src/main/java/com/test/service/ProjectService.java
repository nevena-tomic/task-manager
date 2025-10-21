package com.test.service;

import com.test.models.Project;
import com.test.models.ProjectDocument;
import com.test.repository.ProjectRepository;
import com.test.repository.ProjectSearchRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final ProjectSearchRepository projectSearchRepository;

    public ProjectService(ProjectRepository projectRepository, ProjectSearchRepository projectSearchRepository) {
        this.projectRepository = projectRepository;
        this.projectSearchRepository = projectSearchRepository;
    }

    public List<Project> getAllProjects() {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return projectRepository.findByUserId(username);
    }

    public Project getProjectById(String id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        return projectRepository.findByIdAndUserId(id, username).orElse(null);
    }

    public Project createProject(Project project) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        project.setUserId(username);
        Project savedProject = projectRepository.save(project);

        saveToElasticSearch(savedProject);

        return savedProject;
    }

    public Project updateProject(String id, Project project) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Project existingProject = projectRepository.findByIdAndUserId(id, username).orElse(null);

        if (existingProject != null) {
            project.setId(id);
            project.setUserId(username);
            Project updatedProject = projectRepository.save(project);

            saveToElasticSearch(updatedProject);

            return updatedProject;
        }
        return null;
    }

    public void deleteProject(String id) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();
        Project project = projectRepository.findByIdAndUserId(id, username).orElse(null);
        if (project != null) {
            projectRepository.deleteById(id);

            projectSearchRepository.deleteById(id);
        }
    }

    public List<ProjectDocument> searchProjects(String searchTerm) {
        String username = SecurityContextHolder.getContext().getAuthentication().getName();

        try {
            List<ProjectDocument> userProjects = projectSearchRepository.findByUserId(username);

            List<ProjectDocument> results = userProjects.stream()
                    .filter(project ->
                            project.getName().toLowerCase().contains(searchTerm.toLowerCase()) ||
                                    (project.getDescription() != null &&
                                            project.getDescription().toLowerCase().contains(searchTerm.toLowerCase()))
                    )
                    .collect(Collectors.toList());

            return results;

        } catch (Exception e) {
            System.err.println("ElasticSearch search error: " + e.getMessage());
            e.printStackTrace();
            return new ArrayList<>();
        }
    }

    private void saveToElasticSearch(Project project) {
        ProjectDocument projectDocument = new ProjectDocument(
                project.getId(),
                project.getName(),
                project.getDescription(),
                project.getUserId()
        );
        projectSearchRepository.save(projectDocument);
    }
}