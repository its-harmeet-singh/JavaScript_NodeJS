$(document).ready(function () {
    let users = [];

    // Load user data from user.json
    function loadUsers() {
        $.getJSON("data/user.json", function (data) {
            users = data;
        }).fail(function () {
            alert("Failed to load user data. Please ensure user.json is available.");
        });
    }

    // Save logged-in user to session
    function saveLoggedInUser(user) {
        sessionStorage.setItem("loggedInUser", JSON.stringify(user));
    }

    // Get logged-in user from session
    function getLoggedInUser() {
        return JSON.parse(sessionStorage.getItem("loggedInUser"));
    }

    // Update Navbar
    function updateNavbar() {
        const user = getLoggedInUser();

        if (user) {
            $("#loginLink").hide();
            $("#registerLink").hide();
            $("#logoutLink").show();
            if (user.role === "admin") {
                $("#adminLink").show();
            }
        } else {
            $("#loginLink").show();
            $("#registerLink").show();
            $("#logoutLink").hide();
            $("#adminLink").hide();
        }
    }

    // Registration Logic using API
    $("#registerForm").submit(function (event) {
        event.preventDefault();

        const username = $("#regUsername").val().trim();
        const password = $("#regPassword").val().trim();
        const contact = $("#contact").val().trim();

        // Password validation (at least 8 chars, 1 number, 1 special character)
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        if (!passwordRegex.test(password)) {
            alert("Password must be at least 8 characters long and include at least one number and one special character.");
            return;
        }

        // Prepare new user data
        const newUser = { username, password, contact, role: "user" };

        // Send POST request to /api/register
        $.ajax({
            url: "/api/register",
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify(newUser),
            success: function (response) {
                alert(response.message || "Registration successful! Please log in.");
                window.location.href = "login.html";
            },
            error: function (xhr) {
                const errorResponse = xhr.responseJSON || { error: "An error occurred. Please try again." };
                alert(errorResponse.error);
            },
        });
    });

    // Login Logic
    $("#loginForm").submit(function (event) {
        event.preventDefault();

        const username = $("#username").val().trim();
        const password = $("#password").val().trim();

        const user = users.find((u) => u.username === username && u.password === password);

        if (user) {
            saveLoggedInUser(user);
            alert("Login successful!");
            window.location.href = "index.html";
        } else {
            alert("Invalid username or password.");
        }
    });

    // Logout Logic
    $("#logoutLink").click(function () {
        sessionStorage.removeItem("loggedInUser");
        alert("Logged out successfully!");
        window.location.href = "index.html";
    });

    // Initial Load
    loadUsers();
    updateNavbar();
});
