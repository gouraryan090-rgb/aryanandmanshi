document.addEventListener("DOMContentLoaded", () => {
    // Floating Hearts Generation
    function createFloatingHeart() {
        const heartsContainer = document.querySelector(".hearts");
        if (!heartsContainer) return;

        const heart = document.createElement("span");
        heart.classList.add("floating-heart");
        
        const emojis = ["💌", "❤️", "🌸", "✨", "💗"];
        heart.innerText = emojis[Math.floor(Math.random() * emojis.length)];

        heart.style.left = Math.random() * 100 + "vw";
        heart.style.animationDuration = Math.random() * 3 + 4 + "s";
        heart.style.fontSize = Math.random() * 12 + 16 + "px";

        heartsContainer.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 7000);
    }

    setInterval(createFloatingHeart, 800);

    // Reveal animation for cards on load
    const revealElements = document.querySelectorAll("[reveal], .info-card");
    revealElements.forEach((el, index) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(25px)";
        el.style.transition = "opacity 0.8s ease, transform 0.8s ease";

        setTimeout(() => {
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }, 150 * (index + 1));
    });
});