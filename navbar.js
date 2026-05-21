document.addEventListener("DOMContentLoaded", () => {
    // 1. Get the current filename from the URL path
    const currentPath = window.location.pathname;
    const pageName = currentPath.substring(currentPath.lastIndexOf("/") + 1);

    // 2. Strict Project Requirement Check: Hide the nav bar entirely on Landing and Register pages
    if (pageName === "" || pageName === "index.html" || pageName === "register.html") {
        console.log("Navigation Bar is hidden on onboarding/landing pages.");
        return; 
    }

    // 3. Create the navigation container element
    const navContainer = document.createElement("nav");
    navContainer.className = "global-navbar";

    // 4. Define your project's mandatory navigable views
    const routes = [
        { name: "Home Feed", file: "home.html" },
        { name: "My Profile", file: "profile.html" },
        { name: "Add Chair", file: "create.html" },
        { name: "Admin Panel", file: "admin.html" },
        { name: "Checkpoints Log", file: "checkpoints.html" }
    ];

    // 5. Construct the internal links and track active page states
    let navHTML = `<div class="nav-brand"><a href="home.html">🪑 ChairApp</a></div>`;
    navHTML += `<div class="nav-links">`;

    routes.forEach(route => {
        const isActive = pageName === route.file ? "active" : "";
        navHTML += `<a href="${route.file}" class="nav-item ${isActive}">${route.name}</a>`;
    });

    navHTML += `</div>`;
    navContainer.innerHTML = navHTML;

    // 6. Prepend the fully constructed navigation bar to the top of the body
    document.body.insertBefore(navContainer, document.body.firstChild);
});