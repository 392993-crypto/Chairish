const viewPane = document.getElementById('profile-view-pane');
const editPane = document.getElementById('profile-edit-pane');
const toEditBtn = document.getElementById('to-edit-mode-btn');
const cancelEditBtn = document.getElementById('cancel-edit-btn');
const editForm = document.getElementById('edit-profile-form');

function loadUser() {
    const raw = localStorage.getItem('currentUser');
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
}

function saveUser(user) {
    localStorage.setItem('currentUser', JSON.stringify(user));
}

function populateViewPane(user) {
    document.getElementById('view-username').textContent = user.username || '---';
    document.getElementById('view-email').textContent = user.email || '---';

    const p = user.extendedProfile || {};
    document.getElementById('view-height').textContent = p.height || '---';
    document.getElementById('view-sitting-hours').textContent = p.sittingHours || '---';
    document.getElementById('view-posture').textContent = p.posture || '---';
    document.getElementById('view-desk-type').textContent = p.deskType || '---';
    document.getElementById('view-chair-use').textContent = p.chairUse || '---';
    document.getElementById('view-lumbar-pref').textContent = p.lumbarPref || '---';
    document.getElementById('view-material').textContent = p.material || '---';
    document.getElementById('view-aesthetic').textContent = p.aesthetic || '---';
    document.getElementById('view-priority').textContent = p.priority || '---';
}

function populateEditPane(user) {
    const p = user.extendedProfile || {};
    document.getElementById('edit-height').value = p.height || '';
    document.getElementById('edit-sitting-hours').value = p.sittingHours || '';
    document.getElementById('edit-posture').value = p.posture || 'Straight Back / Alert';
    document.getElementById('edit-desk-type').value = p.deskType || 'Standard Fixed Desk';
    document.getElementById('edit-chair-use').value = p.chairUse || 'Productivity / Coding';
    document.getElementById('edit-lumbar-pref').value = p.lumbarPref || 'Firm & Pronounced';
    document.getElementById('edit-material').value = p.material || 'Breathable Mesh';
    document.getElementById('edit-aesthetic').value = p.aesthetic || 'Mid-Century Modern';
    document.getElementById('edit-priority').value = p.priority || 'Pure Ergonomics & Health';
}

function showViewPane() {
    viewPane.classList.remove('hidden');
    editPane.classList.add('hidden');
}

function showEditPane() {
    viewPane.classList.add('hidden');
    editPane.classList.remove('hidden');
}

toEditBtn.addEventListener('click', function () {
    const user = loadUser();
    if (user) populateEditPane(user);
    showEditPane();
});

cancelEditBtn.addEventListener('click', showViewPane);

editForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const user = loadUser() || { extendedProfile: {} };

    user.extendedProfile = {
        height: document.getElementById('edit-height').value,
        sittingHours: document.getElementById('edit-sitting-hours').value,
        posture: document.getElementById('edit-posture').value,
        deskType: document.getElementById('edit-desk-type').value,
        chairUse: document.getElementById('edit-chair-use').value,
        lumbarPref: document.getElementById('edit-lumbar-pref').value,
        material: document.getElementById('edit-material').value,
        aesthetic: document.getElementById('edit-aesthetic').value,
        priority: document.getElementById('edit-priority').value,
    };

    saveUser(user);
    populateViewPane(user);
    showViewPane();
});

// Init
const user = loadUser();
if (user) {
    populateViewPane(user);
} else {
    document.getElementById('view-username').textContent = 'Not logged in';
    document.getElementById('view-email').textContent = 'Not logged in';
}
