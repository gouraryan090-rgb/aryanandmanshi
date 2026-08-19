/* ==========================================================
                ARYAN PAGE INTERACTIVE SCRIPT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    createFloatingHearts();
    setupLogout();
    initBirthdayCountdown();
});

// Floating Hearts Background Animation
function createFloatingHearts() {
    const container = document.querySelector(".hearts");
    if (!container) return;

    const heartSymbols = ["💙", "❤️", "✨", "🌸"];

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

// Birthday Countdown Logic (14 June)
function initBirthdayCountdown() {
    const countdownElement = document.getElementById("birthdayCountdown");
    if (!countdownElement) return;

    function updateTimer() {
        const now = new Date();
        let currentYear = now.getFullYear();
        let nextBirthday = new Date(currentYear, 5, 14); // 5 = June (0-indexed)

        if (now > nextBirthday) {
            nextBirthday = new Date(currentYear + 1, 5, 14);
        }

        const diff = nextBirthday - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        countdownElement.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    updateTimer();
    setInterval(updateTimer, 1000);
}

// Gift Click Handler
function handleGiftClick(event, user) {
    // Custom check logic if required
    console.log(`Gift opened for ${user}`);
}

// Logout Setup
function setupLogout() {
    const logoutBtn = document.getElementById("logoutBtn");
    if (!logoutBtn) return;

    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        sessionStorage.clear();
        localStorage.removeItem("currentUser");
        window.location.href = "../index.html";
    });
}