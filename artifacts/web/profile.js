document.addEventListener('DOMContentLoaded', () => {
    // 1. Get the securely logged-in user
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const allUsers = JSON.parse(localStorage.getItem('mockUsersList')) || [];

    if (!currentUser) {
        alert("You must be logged in to view profiles!");
        window.location.href = 'register.html'; // Adjust to your login/register page
        return;
    }

    // 2. Check the URL parameters to see whose profile we are looking at
    const urlParams = new URLSearchParams(window.location.search);
    const targetUserId = urlParams.get('id');

    let displayedUser = currentUser; // Default to showing yourself

    // If a specific user ID is in the URL, find them in the master database
    if (targetUserId && targetUserId !== currentUser.id) {
        const foundUser = allUsers.find(user => user.id === targetUserId);
        if (foundUser) {
            displayedUser = foundUser;
        } else {
            alert("User profile not found!");
        }
    }

    // 3. UI Protection: ONLY show the edit button if you are viewing your OWN profile
    const editModeBtn = document.getElementById('to-edit-mode-btn');
    if (displayedUser.id !== currentUser.id) {
        editModeBtn.style.display = 'none'; // Hide the edit button entirely for other users
    }

    // 4. Populate the Profile View Pane with the chosen user's data
    function renderProfileView() {
        document.getElementById('view-username').textContent = displayedUser.username;

        // Grab values safely, default to '---' if they haven't set up their profile yet
        const profile = displayedUser.extendedProfile || {};
        document.getElementById('view-height').textContent = profile.height || '---';
        document.getElementById('view-sitting-hours').textContent = profile.dailySittingHours || '---';
        document.getElementById('view-posture').textContent = profile.backPainStatus || '---'; // Mapping to your new custom traits
        document.getElementById('view-desk-type').textContent = profile.preferredRecline || '---';
        document.getElementById('view-chair-use').textContent = profile.armrestPreference || '---';
        document.getElementById('view-lumbar-pref').textContent = profile.headrestRequired || '---';
        document.getElementById('view-material').textContent = profile.weightCapacityNeeded || '---';
        document.getElementById('view-aesthetic').textContent = profile.primaryWorkSurface || '---';
        document.getElementById('view-priority').textContent = profile.budgetRange || '---';
    }

    renderProfileView();

    // 5. Toggle View/Edit Panes (Only accessible if editModeBtn is visible and clicked)
    const viewPane = document.getElementById('profile-view-pane');
    const editPane = document.getElementById('profile-edit-pane');
    const cancelBtn = document.getElementById('cancel-edit-btn');
    const editForm = document.getElementById('edit-profile-form');

    editModeBtn.addEventListener('click', () => {
        // Pre-fill form inputs with current data before opening edit layout
        const profile = displayedUser.extendedProfile || {};
        document.getElementById('edit-height').value = profile.height || '';
        document.getElementById('edit-sitting-hours').value = profile.dailySittingHours || '';
        document.getElementById('edit-posture').value = profile.backPainStatus || 'Perfect Spine Royalty';
        document.getElementById('edit-desk-type').value = profile.preferredRecline || 'NASA-level Standing Desk';
        document.getElementById('edit-chair-use').value = profile.armrestPreference || 'Intense Competitive Coding';
        document.getElementById('edit-lumbar-pref').value = profile.headrestRequired || 'Subtle / Invisible Magic';
        document.getElementById('edit-material').value = profile.weightCapacityNeeded || 'High-Tech Aerospace Mesh';
        document.getElementById('edit-aesthetic').value = profile.primaryWorkSurface || '1970s Retro Space-Age Egg';
        document.getElementById('edit-priority').value = profile.budgetRange || 'Perfect Cosmic Equilibrium';

        viewPane.classList.add('hidden');
        editPane.classList.remove('hidden');
    });

    cancelBtn.addEventListener('click', () => {
        editPane.classList.add('hidden');
        viewPane.classList.remove('hidden');
    });

    // 6. Save data updates ONLY when the user presses the submit button
    editForm.addEventListener('submit', (event) => {
        event.preventDefault();

        // Package up the newly modified values
        const updatedProfile = {
            height: document.getElementById('edit-height').value,
            dailySittingHours: document.getElementById('edit-sitting-hours').value,
            backPainStatus: document.getElementById('edit-posture').value,
            preferredRecline: document.getElementById('edit-desk-type').value,
            armrestPreference: document.getElementById('edit-chair-use').value,
            headrestRequired: document.getElementById('edit-lumbar-pref').value,
            weightCapacityNeeded: document.getElementById('edit-material').value,
            primaryWorkSurface: document.getElementById('edit-aesthetic').value,
            budgetRange: document.getElementById('edit-priority').value
        };

        // Update the current user object structure
        currentUser.extendedProfile = updatedProfile;
        displayedUser = currentUser; // Sync the view engine state

        // Save back into local session state
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        // Update this user's details inside the global mock users list array
        const userIndex = allUsers.findIndex(user => user.id === currentUser.id);
        if (userIndex !== -1) {
            allUsers[userIndex] = currentUser;
        } else {
            allUsers.push(currentUser);
        }
        localStorage.setItem('mockUsersList', JSON.stringify(allUsers));

        // Refresh visual data states & flip display panels back
        renderProfileView();
        editPane.classList.add('hidden');
        viewPane.classList.remove('hidden');
    });
});