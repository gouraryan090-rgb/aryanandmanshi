/* ==========================================================
                INDEX PAGE INTERACTIVE SCRIPT
========================================================== */

document.addEventListener("DOMContentLoaded", () => {
    initLoader();
    createFloatingHearts();
});

// Loader Animation Handling
function initLoader() {
    const loader = document.getElementById("loader");
    const loaderBar = document.getElementById("loaderBar");
    const loaderText = document.getElementById("loaderText");

    if (!loader) return;

    const messages = [
        "Creating Memories...",
        "Connecting Moments...",
        "Loading Love & Heartbeats..."
    ];

    let progress = 0;
    let messageIndex = 0;

    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 12) + 8;

        if (progress > 35 && messageIndex === 0) {
            messageIndex = 1;
            if (loaderText) loaderText.textContent = messages[messageIndex];
        } else if (progress > 70 && messageIndex === 1) {
            messageIndex = 2;
            if (loaderText) loaderText.textContent = messages[messageIndex];
        }

        if (progress >= 100) {
            progress = 100;
            if (loaderBar) loaderBar.style.width = "100%";
            clearInterval(interval);

            setTimeout(() => {
                loader.classList.add("loader-hide");
            }, 500);
        } else {
            if (loaderBar) loaderBar.style.width = `${progress}%`;
        }
    }, 180);
}

// Background Floating Hearts Animation
function createFloatingHearts() {
    const container = document.querySelector(".hearts");
    if (!container) return;

    const heartSymbols = ["❤️", "💖", "✨", "💕"];

    setInterval(() => {
        const heart = document.createElement("div");
        heart.classList.add("floating-heart");
        
        // Random Heart Icon
        heart.innerHTML = heartSymbols[Math.floor(Math.random() * heartSymbols.length)];
        
        // Random Horizontal Position & Size
        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = Math.random() * 3 + 4 + "s"; // 4s to 7s
        heart.style.fontSize = Math.random() * 12 + 14 + "px";

        container.appendChild(heart);

        // Remove from DOM after animation completes
        setTimeout(() => {
            heart.remove();
        }, 7000);
    }, 600);
}