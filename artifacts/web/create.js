document.addEventListener('DOMContentLoaded', () => {
    fetchCategories();
    const form = document.getElementById('add-chair-form');
    if (form) form.addEventListener('submit', handleAddChair);
});

async function fetchCategories() {
    try {
        const response = await fetch('categories.json');
        if (!response.ok) throw new Error('Failed to fetch categories');
        const categories = await response.json();
        populateCategories(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        populateCategories([
            { id: 'cat_01', name: 'Ergonomic' },
            { id: 'cat_02', name: 'Lounge' },
            { id: 'cat_03', name: 'Dining' },
            { id: 'cat_04', name: 'Accent' },
            { id: 'cat_05', name: 'Outdoor' }
        ]);
    }
}

function populateCategories(categories) {
    const select = document.getElementById('chairCategory');
    select.innerHTML = '<option value="" disabled selected>-- Select a Category --</option>';
    categories.forEach(cat => {
        const opt = document.createElement('option');
        opt.value = cat.id || cat.name;
        opt.textContent = cat.name;
        select.appendChild(opt);
    });
}

async function handleAddChair(event) {
    event.preventDefault();

    let activeUser = null;
    try { activeUser = JSON.parse(localStorage.getItem('currentUser')); } catch(e) {}

    const newChair = {
        name: document.getElementById('chairName').value,
        brand: document.getElementById('chairBrand').value,
        image: document.getElementById('chairImage').value,
        categoryId: document.getElementById('chairCategory').value,
        description: document.getElementById('chairDescription').value,
        userId: activeUser ? (activeUser.id || activeUser.userId) : 'guest',
        tags: ['user-sub']
    };

    try {
        const response = await fetch('/api/chairs', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newChair)
        });

        if (!response.ok) {
            const msg = await response.text();
            throw new Error(`Server error ${response.status}: ${msg}`);
        }

        alert("Chair posted successfully!");
        document.getElementById('add-chair-form').reset();
        window.location.href = 'home.html';

    } catch (error) {
        console.error(error);
        alert("Failed to post chair: " + error.message);
    }
}
