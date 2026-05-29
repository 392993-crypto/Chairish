let allChairs = [];

document.addEventListener('DOMContentLoaded', () => {
    fetchChairFeed();
});

async function fetchChairFeed() {
    try {
        const response = await fetch('/api/chairs');
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        allChairs = await response.json();

        if (allChairs.length === 0) {
            document.getElementById('chair-grid').innerHTML = '<p>No chairs posted yet. Be the first to <a href="create.html">add one</a>!</p>';
            return;
        }

        const likedTags = JSON.parse(localStorage.getItem('likedTags')) || [];
        const sortedChairs = [...allChairs].sort((a, b) => {
            const aScore = (a.tags || []).filter(t => likedTags.includes(t)).length;
            const bScore = (b.tags || []).filter(t => likedTags.includes(t)).length;
            return bScore - aScore;
        });

        renderChairCards(sortedChairs);

    } catch (error) {
        console.error('Error fetching chair data:', error);
        document.getElementById('chair-grid').innerHTML = '<p>Failed to load the feed. Please try refreshing.</p>';
    }
}

function renderChairCards(chairs) {
    const grid = document.getElementById('chair-grid');
    grid.innerHTML = '';

    chairs.forEach(chair => {
        const card = document.createElement('div');
        card.className = 'chair-card';
        const tagsDisplay = (chair.tags || []).join(', ');
        card.innerHTML = `
            <img src="${chair.image}" alt="${chair.name}" style="max-width:100%;height:auto;border-radius:8px;">
            <h3>${chair.name}</h3>
            <p><strong>Brand:</strong> ${chair.brand}</p>
            <p><strong>Category:</strong> ${chair.categoryId || 'Uncategorized'}</p>
            <p><strong>Tags:</strong> ${tagsDisplay || 'None'}</p>
            <button onclick="likeChair('${chair.id}')" style="margin-bottom:10px;cursor:pointer;">👍 Like This Style</button>
            <br>
            <a href="postinfo.html?id=${chair.id}">View Chair Details</a>
        `;
        grid.appendChild(card);
    });
}

function likeChair(chairId) {
    const likedChair = allChairs.find(c => c.id === chairId);
    if (!likedChair || !likedChair.tags || likedChair.tags.length === 0) {
        alert('This chair has no tags to like!');
        return;
    }

    let likedTags = JSON.parse(localStorage.getItem('likedTags')) || [];
    let newTagsAdded = false;
    likedChair.tags.forEach(tag => {
        if (!likedTags.includes(tag)) { likedTags.push(tag); newTagsAdded = true; }
    });

    if (newTagsAdded) {
        localStorage.setItem('likedTags', JSON.stringify(likedTags));
        alert('Preferences updated! Chairs with matching tags will appear first.');
        fetchChairFeed();
    } else {
        alert('You already like all the tags for this chair!');
    }
}
