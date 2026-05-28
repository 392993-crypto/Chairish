document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const feedback = document.getElementById('formFeedback');

    if (!username || !email || !password) {
        feedback.textContent = "Please fill out all fields.";
        feedback.className = "feedback-message error";
        return;
    }

    const existingUsers = JSON.parse(localStorage.getItem('users')) || [];
    if (existingUsers.find(u => u.username === username)) {
        feedback.textContent = "That username is already taken. Please choose another.";
        feedback.className = "feedback-message error";
        return;
    }

    const newUser = {
        id: 'user-' + Date.now(),
        username: username,
        email: email,
        password: password,
        isAdmin: false,
        extendedProfile: {
            height: "", sittingHours: "", posture: "",
            deskType: "", chairUse: "", lumbarPref: "",
            material: "", aesthetic: "", priority: ""
        }
    };

    try {
        existingUsers.push(newUser);
        localStorage.setItem('users', JSON.stringify(existingUsers));
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        localStorage.setItem('activeUser', JSON.stringify({ id: newUser.id, username: newUser.username, isAdmin: false }));

        feedback.textContent = "Registration successful! Logging you in...";
        feedback.className = "feedback-message success";

        setTimeout(() => { window.location.href = 'profile.html'; }, 1500);

    } catch (error) {
        feedback.textContent = "An error occurred. Please try again.";
        feedback.className = "feedback-message error";
    }
});
