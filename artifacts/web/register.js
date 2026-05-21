document.getElementById('registrationForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Stop page from refreshing

    // 1. Grab values from the form fields
    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const feedback = document.getElementById('formFeedback');

    if (!username || !email || !password) {
        feedback.textContent = "Please fill out all fields.";
        feedback.className = "feedback-message error";
        return;
    }

    // 2. Instantiate a unique ID and data object structure
    // Generating a simple pseudo-ID to mimic database behaviors
    const uniqueUserId = 'user-' + Date.now();

    const newUserObject = {
        id: uniqueUserId,
        username: username,
        email: email,
        isAdmin: false, // Defaulting to a regular user state
        // Initializing blank structures for the 9 Extended Profile fields required for Checkpoint #04 / AI Ergo-Match
        extendedProfile: {
            height: "",
            dailySittingHours: "",
            backPainStatus: "",
            preferredRecline: "",
            armrestPreference: "",
            headrestRequired: "",
            weightCapacityNeeded: "",
            primaryWorkSurface: "",
            budgetRange: ""
        }
    };

    try {
        // 3. Save the simulated login state session to localStorage
        localStorage.setItem('currentUser', JSON.stringify(newUserObject));

        // OPTIONAL: If maintaining a persistent client-side list of all registered test users
        let allUsers = JSON.parse(localStorage.getItem('mockUsersList')) || [];
        allUsers.push(newUserObject);
        localStorage.setItem('mockUsersList', JSON.stringify(allUsers));

        // 4. Success UI indicators & Automatic Routing redirection
        feedback.textContent = "Registration successful! Logging you in...";
        feedback.className = "feedback-message success";

        setTimeout(() => {
            // Send user straight to profile to fill out their physical/sitting traits
            window.location.href = 'profile.html';
        }, 1500);

    } catch (error) {
        console.error("Local storage allocation error:", error);
        feedback.textContent = "An error occurred during registration. Please try again.";
        feedback.className = "feedback-message error";
    }
});