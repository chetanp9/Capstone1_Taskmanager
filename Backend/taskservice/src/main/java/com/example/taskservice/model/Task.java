package com.example.taskservice.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "tasks")
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDate dueDate;

    @Enumerated(EnumType.STRING) // Stores as a String in DB
    @Column(nullable = false)
    private Priority priority;

    @Enumerated(EnumType.STRING) // Stores as a String in DB
    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private Long userId;

    public Task() {}

    public Task(String description, LocalDate dueDate, Priority priority, Status status, Long userId) {
        this.description = description;
        this.dueDate = dueDate;
        this.priority = priority;
        this.status = status;
        this.userId = userId;
    }

    public Long getId() { return id; }
    public String getDescription() { return description; }
    public LocalDate getDueDate() { return dueDate; }
    public Priority getPriority() { return priority; }
    public Status getStatus() { return status; }
    public Long getUserId() { return userId; }

    public void setDescription(String description) { this.description = description; }
    public void setDueDate(LocalDate dueDate) { this.dueDate = dueDate; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public void setStatus(Status status) { this.status = status; }
    public void setUserId(Long userId) { this.userId = userId; }
}
