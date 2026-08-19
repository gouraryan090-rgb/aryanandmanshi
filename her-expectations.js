document.addEventListener("DOMContentLoaded", () => {
    // 1. Floating Hearts Background Generator
    function createFloatingHeart() {
        const heartsContainer = document.querySelector(".hearts");
        if (!heartsContainer) return;

        const heart = document.createElement("span");
        heart.classList.add("floating-heart");
        
        const emojis = ["💗", "❤️", "🌸", "✨", "🌷"];
        heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = Math.random() * 3 + 4 + "s";
        heart.style.fontSize = Math.random() * 12 + 16 + "px";

        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 7000);
    }

    // Har 800ms me ek floating heart add hoga
    setInterval(createFloatingHeart, 800);

    // 2. Smooth Scroll Fade-In Effect
    const card = document.querySelector(".info-card");
    if (card) {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.8s ease, transform 0.8s ease";

        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 200);
    }
});