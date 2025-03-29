    document.addEventListener("DOMContentLoaded", function () {
        fetchTasks();
        document.getElementById("taskForm").addEventListener("submit", createOrUpdateTask);
        document.getElementById("filterTasks").addEventListener("change", (e) => filterTasks(e.target.value));
        const username=localStorage.getItem("username");
        document.getElementById("userGreeting").textContent=username;
    });
    const PRIORITY_ENUM = ["LOW", "MEDIUM", "HIGH"];
    const STATUS_ENUM = ["TO_DO", "IN_PROGRESS", "DONE", "BLOCKED"];


    async function fetchTasks() {
        const token = localStorage.getItem("jwt");
        if (!token) {
            alert("Not authenticated! Please log in.");
            window.location.href = "index.html";
            return;
        }
    
        try {
            const response = await fetch("http://localhost:8082/tasks", {
                headers: { "Authorization": "Bearer " + token }
            });
    
            if (response.ok) {
                const tasks = await response.json();
                displayTasks(tasks);
                filterTasks(document.getElementById("filterTasks").value); 
            } else {
                alert("Failed to fetch tasks!");
            }
        } catch (error) {
            console.error("Error fetching tasks:", error);
        }
    }

function displayTasks(tasks) {
    const taskList = document.getElementById("taskList");
    taskList.innerHTML = "";

    let totalTasks = tasks.length;
    let pendingTasks = tasks.filter(task => task.status !== "DONE" && task.status !== "BLOCKED").length;
    let completedTasks = tasks.filter(task => task.status === "DONE").length;
    let overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== "DONE").length;
    let blockedTasks = tasks.filter(task => task.status === "BLOCKED").length; 

   
    document.getElementById("totalTasksCount").textContent = totalTasks;
    document.getElementById("pendingTasksCount").textContent = pendingTasks;
    document.getElementById("completedTasksCount").textContent = completedTasks;
    document.getElementById("overdueTasksCount").textContent = overdueTasks;
    document.getElementById("blockerTasksCount").textContent = blockedTasks; 

    tasks.forEach(task => {
        const li = document.createElement("li");
        li.classList.add("task-item");

        const dueDate = new Date(task.dueDate);
        const today = new Date();

        if (task.status === "DONE") {
            li.classList.add("task-done");
        } else if (dueDate < today) {
            li.classList.add("task-overdue"); 
        } else if (task.status === "IN_PROGRESS") {
            li.classList.add("task-in-progress"); 
        } else if (task.status === "BLOCKED") {
            li.classList.add("task-blocked"); 
        } else {
            li.classList.add("task-pending"); 
        }

        li.innerHTML = `
            <span>Description: ${task.description} | Due: ${task.dueDate} | Priority: ${task.priority} | Status: ${task.status}</span>
            ${task.status !== "DONE" ? `<button onclick="markDone(${task.id})">✔ Mark Done</button>` : ""}
            <button onclick="editTask(${task.id}, '${task.description}', '${task.dueDate}', '${task.priority}', '${task.status}')">✏ Edit</button>
            <button onclick="deleteTask(${task.id})">🗑 Delete</button>
        `;

        taskList.appendChild(li);
    });
}    
function openTaskModal(editMode = false) {
    const overlay = document.getElementById("modalOverlay");
    const modal = document.getElementById("taskModal");

    overlay.style.display = "flex"; 
    modal.style.display = "block";

    document.getElementById("modalTitle").innerText = editMode ? "Edit Task" : "New Task";
} 
function closeTaskModal() {
        document.getElementById("modalOverlay").style.display = "none";
        document.getElementById("taskModal").style.display = "none";
        resetForm();
    }
async function createOrUpdateTask(e) {
        e.preventDefault();
        const token = localStorage.getItem("jwt");

        const task = {
            description: document.getElementById("taskDescription").value,
            dueDate: document.getElementById("taskDueDate").value,
            priority: document.getElementById("taskPriority").value,
            status: document.getElementById("taskStatus") ? document.getElementById("taskStatus").value : "TO_DO"
        };

        if (!task.description || !task.dueDate) {
            alert("Please fill in all fields!");
            return;
        }

        const taskId = document.getElementById("taskId").value;
        const url = taskId ? `http://localhost:8082/tasks/${taskId}` : "http://localhost:8082/tasks";
        const method = taskId ? "PUT" : "POST";

        try {
            const response = await fetch(url, {
                method: method,
                headers: { "Content-Type": "application/json", "Authorization": "Bearer " + token },
                body: JSON.stringify(task)
            });

            if (response.ok) {
                fetchTasks();
                resetForm();
                closeTaskModal();
            } else {
                alert("Failed to save task!");
            }
        } catch (error) {
            console.error("Error saving task:", error);
        }
    }

    function editTask(taskId, description, dueDate, priority, status) {
        document.getElementById("taskId").value = taskId;
        document.getElementById("taskDescription").value = description;
        document.getElementById("taskDueDate").value = dueDate;
        document.getElementById("taskPriority").value = priority;

        if (document.getElementById("taskStatus")) {
            document.getElementById("taskStatus").value = status;
        }

        document.getElementById("saveTaskBtn").innerText = "Update Task";
        openTaskModal(true);
    }

    async function markDone(taskId) {
        const token = localStorage.getItem("jwt");

        try {
            const response = await fetch(`http://localhost:8082/tasks/${taskId}`, {
                method: "GET",
                headers: { "Authorization": "Bearer " + token }
            });

            if (!response.ok) {
                alert("Failed to fetch task details!");
                return;
            }

            const task = await response.json();
            task.status = "DONE";

            const updateResponse = await fetch(`http://localhost:8082/tasks/${taskId}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                },
                body: JSON.stringify(task)
            });

            if (updateResponse.ok) {
                fetchTasks();
            } else {
                alert("Failed to mark task as done!");
            }
        } catch (error) {
            console.error("Error updating task:", error);
        }
    }

    async function deleteTask(taskId) {
        const token = localStorage.getItem("jwt");

        

    const isConfirmed = confirm("Are you sure you want to delete this task?");
    if (!isConfirmed) {
        return; 
    }

        try {
            const response = await fetch(`http://localhost:8082/tasks/${taskId}`, {
                method: "DELETE",
                headers: { "Authorization": "Bearer " + token }
            });

            if (response.ok) {
                fetchTasks();
                
            } else {
                alert("Failed to delete task!");
            }
        } catch (error) {
            console.error("Error deleting task:", error);
        }
    }

    function resetForm() {
        document.getElementById("taskId").value = "";
        document.getElementById("taskDescription").value = "";
        document.getElementById("taskDueDate").value = "";
        document.getElementById("taskPriority").value = "LOW";

        if (document.getElementById("taskStatus")) {
            document.getElementById("taskStatus").value = "TO_DO";
        }

        document.getElementById("saveTaskBtn").innerText = "Create Task";
    }
   function filterTasks(filter) {
    document.querySelectorAll(".task-item").forEach(task => {
        task.style.display = "block";

        if (filter === "TO_DO" && (task.classList.contains("task-done") || task.classList.contains("task-blocked"))) {
            task.style.display = "none";
        } else if (filter === "DONE" && !task.classList.contains("task-done")) {
            task.style.display = "none";
        } else if (filter === "OVERDUE" && !task.classList.contains("task-overdue")) {
            task.style.display = "none";
        } else if (filter === "BLOCKED" && !task.classList.contains("task-blocked")) {
            task.style.display = "none";
        }
    });
    }
    function logout() {
        localStorage.removeItem("jwt");
        localStorage.removeItem("username");
        window.location.href = "index.html";
    }
