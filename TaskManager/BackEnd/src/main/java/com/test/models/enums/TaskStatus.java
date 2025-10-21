package com.test.models.enums;

public enum TaskStatus {
    TO_DO,
    IN_PROGRESS,
    DONE,
    PENDING,
    CANCELED;

    public static TaskStatus fromString(String status) {
        if (status == null) return null;
        try {
            return TaskStatus.valueOf(status.toUpperCase().replace(" ", "_"));
        } catch (IllegalArgumentException e) {
            return null;
        }
    }
}
