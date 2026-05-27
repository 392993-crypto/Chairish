document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
  const form = document.getElementById('add-chair-form');
  if (form) form.addEventListener('submit', handleAddChair);
});

// Backend URL for the Replit deployment
const BACKEND_URL = 'https://1e6d76c9-df65-4677-b1cf-e9216da63fbc-00-18rszk1ts6hey.janeway.replit.dev';

async function fetchCategories() {
  try {
    const response = await fetch(`${BACKEND_URL}/categories.json`);
    if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
    const categories = await response.json();
    populateCategories(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    // Fallback: Use a default list if fetch fails
    const defaultCategories = [
      { id: '1', name: 'Modern' },
      { id: '2', name: 'Vintage' },
      { id: '3', name: 'Industrial' }
    ];
    populateCategories(defaultCategories);
  }
}

function populateCategories(categories) {
  const categorySelect = document.getElementById('chairCategory');
  categorySelect.innerHTML = '<option value="" disabled selected>-- Select a Category --</option>';
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category.id || category.name; 
    option.textContent = category.name; 
    categorySelect.appendChild(option);
  });
}

async function handleAddChair(event) {
  event.preventDefault(); 

  let activeUser = null;
  try { 
      activeUser = JSON.parse(localStorage.getItem('currentUser')); 
  } catch(e) {}

  const activeUserId = activeUser ? (activeUser.userId || activeUser.id) : "user_01"; 

  const newChair = {
      id: 'chair_' + Date.now(), 
      name: document.getElementById('chairName').value,
      brand: document.getElementById('chairBrand').value,
      image: document.getElementById('chairImage').value,
      categoryId: document.getElementById('chairCategory').value,
      description: document.getElementById('chairDescription').value,
      userId: activeUserId, 
      tags: ["user-sub"]
  };

  try {
      const response = await fetch(`${BACKEND_URL}/api/chairs`, {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newChair)
      });

      if (!response.ok) {
          const serverMessage = await response.text();
          throw new Error(`Server Error ${response.status}: ${serverMessage}`);
      }

      alert("Success! Your chair has been synced.");
      document.getElementById('add-chair-form').reset();
      window.location.href = 'home.html';

  } catch (error) {
    console.error(error);
    alert("Failed to sync: " + error.message);
  }
}