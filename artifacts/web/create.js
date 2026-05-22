document.addEventListener('DOMContentLoaded', () => {
  fetchCategories();

  const form = document.getElementById('add-chair-form');
  form.addEventListener('submit', handleAddChair);
});

// Dynamically fetch and display categories inside the select dropdown
async function fetchCategories() {
  try {
      const response = await fetch('categories.json');
      if (!response.ok) throw new Error('Failed to load global categories file.');

      const categories = await response.json();
      const categorySelect = document.getElementById('chairCategory');

      // Clear the placeholder loading text
      categorySelect.innerHTML = '<option value="" disabled selected>-- Select a Category --</option>';

      // Populate the dropdown options
      categories.forEach(category => {
          const option = document.createElement('option');
          option.value = category.id; // Store ID behind the scenes
          option.textContent = category.name; // Show clean text to user
          categorySelect.appendChild(option);
      });

  } catch (error) {
      console.error('Error populating dropdown:', error);
      document.getElementById('chairCategory').innerHTML = '<option value="">Error loading choices</option>';
  }
}

// Process the form submission
function handleAddChair(event) {
  event.preventDefault(); // Stop standard browser page refresh

  // 1. Fetch the actively logged-in user profile from state
  const activeUser = JSON.parse(localStorage.getItem('currentUser'));

  // Safety Fallback: Ensure an active user exists to establish ownership
  if (!activeUser || !activeUser.id) {
      alert("Action Denied: You must be logged in to contribute to the feed!");
      return;
  }

  // 2. Build out the structured chair object matching requirements
  const newChair = {
      id: 'chair_' + Date.now(), // Creates a simple runtime timestamp unique ID
      name: document.getElementById('chairName').value,
      brand: document.getElementById('chairBrand').value,
      image: document.getElementById('chairImage').value, // Extracted custom text link
      categoryId: document.getElementById('chairCategory').value,
      description: document.getElementById('chairDescription').value,
      userId: activeUser.id, // Automatically embed active browser user ID
      tags: ["user-sub"] // Default tracking tag
  };

  // 3. Save into simulated persistence state (localStorage custom list array)
  let customChairs = JSON.parse(localStorage.getItem('customChairs')) || [];
  customChairs.push(newChair);
  localStorage.setItem('customChairs', JSON.stringify(customChairs));

  alert("Success! Your chair has been added.");

  // 4. Reset interface state and send user home to verify listing
  document.getElementById('add-chair-form').reset();
  window.location.href = 'home.html';
}