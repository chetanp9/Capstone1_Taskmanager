document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const registerForm = document.getElementById("registerForm");
    const toggleText = document.getElementById("toggleText");
    const formSubtitle = document.getElementById("formSubtitle");
    const toggleLink = document.createElement("a");

    
    if (!loginForm || !registerForm || !toggleText || !formSubtitle) {
        console.error("One or more elements not found. Check HTML structure.");
        return;
    }

    toggleLink.href = "#";
    toggleLink.id = "toggleLink";
    toggleText.appendChild(toggleLink);

  

    
    toggleLink.addEventListener("click", function (e) {
        e.preventDefault();
        toggleForm();
    });

    
    loginForm.style.display = "block";
    registerForm.style.display = "none";
    toggleForm(); 

  
    loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        login();
    });


    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        register();
    });
});


async function login() {
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
        const response = await fetch("http://localhost:8081/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem("jwt", data.token);
            localStorage.setItem("username", username);
            window.location.href = "dashboard.html"; 
        } else {
            alert("Login failed. Please check your credentials.");
        }
    } catch (error) {
        console.error("Login error:", error);
        alert("An error occurred during login.");
    }
}

function toggleForm() {
    if (loginForm.style.display === "none") {
        loginForm.style.display = "block";
        registerForm.style.display = "none";
        formSubtitle.textContent = "Sign in to manage your tasks";
        toggleText.firstChild.textContent = "Don't have an account? ";
        toggleLink.textContent = "Register";
    } else {
        loginForm.style.display = "none";
        registerForm.style.display = "block";
        formSubtitle.textContent = "Create a new account";
        toggleText.firstChild.textContent = "Already have an account? ";
        toggleLink.textContent = "Login";
    }
}

async function register() {
    const username = document.getElementById("registerUsername").value.trim();
    const email = document.getElementById("registerEmail").value.trim();
    const password = document.getElementById("registerPassword").value.trim();

  
    if (!validateUsername(username)) {
        alert("Username must be at least 4 characters and contain only letters and numbers.");
        return;
    }
    if (!validateEmail(email)) {
        alert("Please enter a valid email address.");
        return;
    }
    if (!validatePassword(password)) {
        alert("Password must be at least 6 characters and contain at least one letter and one number.");
        return;
    }

    try {
        const response = await fetch("http://localhost:8081/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, email, password })
        });

        if (response.ok) {
            alert("Registration successful! Please login.");
            toggleForm();
        } else {
            alert("Registration failed. Please try again.");
        }
    } catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred during registration.");
    }
}

function validateUsername(username) {
    return /^[a-zA-Z0-9]{4,}$/.test(username);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


function validatePassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%^&*])[A-Za-z\d@#$%^&*]{6,}$/.test(password);
}