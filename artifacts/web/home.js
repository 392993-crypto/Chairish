// Store the chairs globally so we can access them when liking
let allChairs = []; 

document.addEventListener('DOMContentLoaded', () => {
    fetchChairFeed();
});

async function fetchChairFeed() {
    try {
        const response = await fetch('chairs.json');

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        allChairs = await response.json();

        if (allChairs.length === 0) {
            document.getElementById('chair-grid').innerHTML = '<p>No chairs found.</p>';
            return;
        }

        // Retrieve liked tags from localStorage
        const likedTags = JSON.parse(localStorage.getItem('likedTags')) || [];

        // Sort the chairs based on how many tags match the user's preferences
        const sortedChairs = [...allChairs].sort((a, b) => {
            const aScore = calculateTagScore(a.tags || [], likedTags);
            const bScore = calculateTagScore(b.tags || [], likedTags);
            return bScore - aScore; // Sorts descending (highest score first)
        });

        renderChairCards(sortedChairs);

    } catch (error) {
        console.error('Error fetching chair data:', error);
        document.getElementById('chair-grid').innerHTML = '<p>Failed to load the feed. Are you using Live Server?</p>';
    }
}

// Helper function to count how many matching tags a chair has
function calculateTagScore(chairTags, likedTags) {
    return chairTags.filter(tag => likedTags.includes(tag)).length;
}

function renderChairCards(chairs) {
    const chairGrid = document.getElementById('chair-grid');
    chairGrid.innerHTML = ''; 

    chairs.forEach(chair => {
        const card = document.createElement('div');
        card.className = 'chair-card'; 

        // Join the tags into a comma-separated string for display (fallback to empty array if missing)
        const tagsDisplay = (chair.tags || []).join(', ');

        card.innerHTML = `
            <img src="${chair.image}" alt="${chair.name}" style="max-width: 100%; height: auto; border-radius: 8px;">
            <h3>${chair.name}</h3>
            <p><strong>Brand:</strong> ${chair.brand}</p>
            <p><strong>Tags:</strong> ${tagsDisplay || 'None'}</p>

            <button onclick="likeChair('${chair.id}')" style="margin-bottom: 10px; cursor: pointer;">
                👍 Like This Style
            </button>
            <br>
            <a href="detail.html?id=${chair.id}">View Chair Details</a>
        `;

        chairGrid.appendChild(card);
    });
}

// Function to handle liking based on tags
function likeChair(chairId) {
    // Find the specific chair that was liked in our global array
    const likedChair = allChairs.find(c => c.id === chairId);

    // If the chair doesn't exist or has no tags, do nothing
    if (!likedChair || !likedChair.tags || likedChair.tags.length === 0) {
        alert('This chair has no tags to like!');
        return;
    }

    // Get existing tags from storage
    let likedTags = JSON.parse(localStorage.getItem('likedTags')) || [];
    let newTagsAdded = false;

    // Loop through the chair's tags and add any that aren't already saved
    likedChair.tags.forEach(tag => {
        if (!likedTags.includes(tag)) {
            likedTags.push(tag);
            newTagsAdded = true;
        }
    });

    if (newTagsAdded) {
        localStorage.setItem('likedTags', JSON.stringify(likedTags));
        alert('Preferences updated! We will prioritize chairs with these tags.');
        // Refresh the feed to show the newly sorted list
        fetchChairFeed();
    } else {
        alert('You already like all the tags associated with this chair!');
    }
}