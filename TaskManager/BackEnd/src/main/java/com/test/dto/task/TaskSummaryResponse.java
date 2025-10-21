package com.test.dto.task;

import com.test.models.enums.TaskStatus;

import java.time.LocalDate;

public class TaskSummaryResponse {
    private String id;
    private String title;
    private TaskStatus status;
    private LocalDate dueDate;


    public TaskSummaryResponse() {}

    public TaskSummaryResponse(String id, String title, TaskStatus status, LocalDate dueDate) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.dueDate = dueDate;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public String getId() {
        return id;
    }
    public void setId(String id) {
        this.id = id;
    }
    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }
    public TaskStatus getStatus() {
        return status;
    }
    public void setStatus(TaskStatus status) {
        this.status = status;
    }
}
