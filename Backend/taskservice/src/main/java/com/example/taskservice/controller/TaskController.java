package com.example.taskservice.controller;

import com.example.taskservice.model.Task;
import com.example.taskservice.repository.TaskRepository;
import com.example.taskservice.security.JwtUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskRepository taskRepository;
    private final JwtUtil jwtUtil;
    private final RestTemplate restTemplate;

    public TaskController(TaskRepository taskRepository, JwtUtil jwtUtil, RestTemplate restTemplate) {
        this.taskRepository = taskRepository;
        this.jwtUtil = jwtUtil;
        this.restTemplate = restTemplate;
    }


    @PostMapping
    public ResponseEntity<String> createTask(@RequestHeader("Authorization") String token, @RequestBody Task task) {
        String username = jwtUtil.extractUsername(token.substring(7));
        Long userId = getUserIdByUsername(username);

        if (userId == null) {
            return ResponseEntity.status(404).body("User not found!");
        }

        task.setUserId(userId);

        taskRepository.save(task);
        return ResponseEntity.ok("Task created successfully!");
    }

    @GetMapping
    public ResponseEntity<List<Task>> getUserTasks(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));
        Long userId = getUserIdByUsername(username);

        if (userId == null) {
            return ResponseEntity.status(404).body(null);
        }

        return ResponseEntity.ok(taskRepository.findByUserId(userId));
    }

    @GetMapping("/{taskId}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long taskId, @RequestHeader("Authorization") String token) {
        String username = jwtUtil.extractUsername(token.substring(7));
        Long userId = getUserIdByUsername(username);

        Optional<Task> task = taskRepository.findById(taskId);
        if (task.isPresent() && task.get().getUserId().equals(userId)) {
            return ResponseEntity.ok(task.get());
        } else {
            return ResponseEntity.status(403).body(null);
        }
    }


    @PutMapping("/{taskId}")
    public ResponseEntity<String> updateTask(@RequestHeader("Authorization") String token,
                                             @PathVariable Long taskId,
                                             @RequestBody Task updatedTask) {
        String username = jwtUtil.extractUsername(token.substring(7));
        Long userId = getUserIdByUsername(username);

        if (userId == null) {
            return ResponseEntity.status(404).body("User not found!");
        }

        Optional<Task> existingTask = taskRepository.findById(taskId);

        if (existingTask.isPresent() && existingTask.get().getUserId().equals(userId)) {
            Task task = existingTask.get();

            task.setDescription(updatedTask.getDescription());
            task.setDueDate(updatedTask.getDueDate());
            task.setPriority(updatedTask.getPriority());
            task.setStatus(updatedTask.getStatus());

            taskRepository.save(task);
            return ResponseEntity.ok("Task updated successfully!");
        } else {
            return ResponseEntity.status(403).body("You are not authorized to update this task!");
        }
    }


    @DeleteMapping("/{taskId}")
    public ResponseEntity<String> deleteTask(@RequestHeader("Authorization") String token,
                                             @PathVariable Long taskId) {
        String username = jwtUtil.extractUsername(token.substring(7));
        Long userId = getUserIdByUsername(username);

        if (userId == null) {
            return ResponseEntity.status(404).body("User not found!");
        }

        Optional<Task> existingTask = taskRepository.findById(taskId);

        if (existingTask.isPresent() && existingTask.get().getUserId().equals(userId)) {
            taskRepository.delete(existingTask.get());
            return ResponseEntity.ok("Task deleted successfully!");
        } else {
            return ResponseEntity.status(403).body("You are not authorized to delete this task!");
        }
    }


    private Long getUserIdByUsername(String username) {
        String authServiceUrl = "http://localhost:8081/auth/userid?username=" + username;
        try {
            return restTemplate.getForObject(authServiceUrl, Long.class);
        } catch (Exception e) {
            return null; 
        }
    }
}
