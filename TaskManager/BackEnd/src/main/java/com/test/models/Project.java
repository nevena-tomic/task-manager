package com.test.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
@Document(collection = "projects")
public class Project {
    @Id
    private String id;
    private String name;
    private String description;
    private String userId;

    public Project() {}

    public Project(String name, String description, String userId) {
        this.name = name;
        this.description = description;
        this.userId = userId;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }
}