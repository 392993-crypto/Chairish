async function loadChairFeed() {
  try {
    const response = await fetch('chairs.json'); // Or your local storage array if you've migrated it
    const chairs = await response.json();

    const grid = document.getElementById('chair-grid');
    grid.innerHTML = ''; // Clear any static placeholder content

    chairs.forEach(chair => {
      // Create the card element
      const card = document.createElement('div');
      card.className = 'chair-card';

      // Build the internal HTML structure structure
      card.innerHTML = `
        <h3>${chair.name}</h3>
        <p>${chair.description.substring(0, 100)}...</p>
        <a href="postinfo.html?id=${chair.id}" class="view-btn">View Details</a>
      `;

      grid.appendChild(card);
    });
  } catch (error) {
    console.error("Error loading the chair feed:", error);
  }
}

// Run the function when the page loads
document.addEventListener('DOMContentLoaded', loadChairFeed);