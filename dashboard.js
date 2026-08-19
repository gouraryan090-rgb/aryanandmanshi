/* ==========================================================
                DASHBOARD INTERACTIVE SCRIPT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    createFloatingHearts();
    setupLogoutHandler();
});

// Floating Hearts Animation Background
function createFloatingHearts() {
    const container = document.querySelector(".hearts");
    if (!container) return;

    const heartSymbols = ["❤️", "💖", "✨", "🌸", "💕"];

    setInterval(() => {
        const heart = document.createElement("div");
        heart.classList.add("floating-heart");
        heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = Math.random() * 3 + 4 + "s";
        heart.style.fontSize = Math.random() * 10 + 14 + "px";

        container.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 7000);
    }, 650);
}

// Logout Action Logic
function setupLogoutHandler() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Clear all local & session authentications
        sessionStorage.clear();
        localStorage.removeItem("currentUser");

        // Redirect to homepage
        window.location.href = "index.html";
    });
}