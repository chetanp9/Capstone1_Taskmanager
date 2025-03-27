package com.example.taskservice.services;

import com.example.taskservice.model.Task;
import com.example.taskservice.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import com.example.taskservice.services.RestTemplateConfig;
import java.util.List;

@Service
public class TaskService {
    private final TaskRepository taskRepository;
    private final RestTemplate restTemplate;

    public TaskService(TaskRepository taskRepository, RestTemplate restTemplate) {
        this.taskRepository = taskRepository;
        this.restTemplate = restTemplate;
    }

    public void createTask(String username, Task task) {
        Long userId = getUserIdByUsername(username); // ✅ Get userId from auth-service
        task.setUserId(userId);
        taskRepository.save(task);
    }

    public List<Task> getTasksForUser(Long userId) {
        return taskRepository.findByUserId(userId);
    }


    private Long getUserIdByUsername(String username) {
        String authServiceUrl = "http://localhost:8081/auth/userid?username=" + username;
        return restTemplate.getForObject(authServiceUrl, Long.class);
    }
}
