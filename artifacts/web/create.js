    document.addEventListener('DOMContentLoaded', () => {
      fetchCategories();

      const form = document.getElementById('add-chair-form');
      form.addEventListener('submit', handleAddChair);
    });

    // Dynamically fetch categories
    async function fetchCategories() {
      try {
          const response = await fetch('categories.json');
          if (!response.ok) throw new Error('Failed to load global categories file.');

          const categories = await response.json();
          const categorySelect = document.getElementById('chairCategory');

          categorySelect.innerHTML = '<option value="" disabled selected>-- Select a Category --</option>';

          categories.forEach(category => {
              const option = document.createElement('option');
              option.value = category.id; 
              option.textContent = category.name; 
              categorySelect.appendChild(option);
          });
      } catch (error) {
          console.error('Error populating dropdown:', error);
      }
    }

    // Process the form submission and POST directly to the server API
    async function handleAddChair(event) {
      event.preventDefault(); 

      const activeUser = JSON.parse(localStorage.getItem('currentUser'));
      const activeUserId = activeUser ? (activeUser.userId || activeUser.id) : "user_01"; 

      // Build the chair object
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
          // Adjusted endpoint to hit the Express backend API routing route
          const response = await fetch('/api/chairs', {
              method: 'POST', 
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(newChair)
          });

          if (!response.ok) {
              throw new Error("Server rejected the save request.");
          }

          alert("Success! Your chair has been synced to the global community feed.");

          document.getElementById('add-chair-form').reset();
          window.location.href = 'home.html';

      } catch (error) {
          console.error("Failed to write to chairs.json via server:", error);
          alert("Error: Could not sync your chair data. Check the console for details.");
      }
    }