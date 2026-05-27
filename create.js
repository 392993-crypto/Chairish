document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();
  const form = document.getElementById('add-chair-form');
  if(form) form.addEventListener('submit', handleAddChair);
});

async function fetchCategories() {
  try {
      const response = await fetch('categories.json');
      if (!response.ok) return; // Skip if file doesn't exist yet
      const categories = await response.json();
      const categorySelect = document.getElementById('chairCategory');
      if (!categorySelect) return;
      
      categorySelect.innerHTML = '<option value="" disabled selected>-- Select a Category --</option>';
      categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id || category.name; 
          option.textContent = category.name; 
          categorySelect.appendChild(option);
      });
  } catch (error) {
      console.error('Error populating dropdown:', error);
  }
}

async function handleAddChair(event) {
  event.preventDefault(); 
  let activeUser;
  try { activeUser = JSON.parse(localStorage.getItem('currentUser')); } catch(e) { activeUser = null; }
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
      const response = await fetch('/api/chairs', {
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newChair)
      });

      if (!response.ok) throw new Error("Server rejected the save request.");

      alert("Success! Your chair has been synced to the global community feed.");
      document.getElementById('add-chair-form').reset();
      window.location.href = 'home.html';
  } catch (error) {
      console.error("Failed to write to chairs via server:", error);
      alert("Error: Could not sync your chair data. Check the console for details.");
  }
}
