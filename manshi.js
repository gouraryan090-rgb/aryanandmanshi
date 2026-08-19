document.addEventListener("DOMContentLoaded", () => {
    // 1. Birthday Countdown Logic (20 March)
    function updateBirthdayCountdown() {
        const countdownEl = document.getElementById("birthdayCountdown");
        if (!countdownEl) return;

        const now = new Date();
        let targetYear = now.getFullYear();
        
        // Manshii's Birthday: March 20
        let nextBirthday = new Date(targetYear, 2, 20); // March is Month index 2

        // If March 20 has passed this year, set for next year
        if (now > nextBirthday) {
            nextBirthday = new Date(targetYear + 1, 2, 20);
        }

        const diff = nextBirthday - now;

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((diff / 1000 / 60) % 60);
        const seconds = Math.floor((diff / 1000) % 60);

        if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
            countdownEl.innerText = "🎉 Happy Birthday Manshii! 🎂❤️";
        } else {
            countdownEl.innerText = `${days}d ${hours}h ${minutes}m ${seconds}s`;
        }
    }

    updateBirthdayCountdown();
    setInterval(updateBirthdayCountdown, 1000);

    // 2. Floating Hearts Animation
    function createFloatingHeart() {
        const heartsContainer = document.querySelector(".hearts");
        if (!heartsContainer) return;

        const heart = document.createElement("span");
        heart.classList.add("floating-heart");
        
        const emojis = ["💗", "🌸", "✨", "❤️", "👑"];
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

    // 3. Smooth Card Entrance
    const cards = document.querySelectorAll(".info-card");
    cards.forEach((card, i) => {
        card.style.opacity = "0";
        card.style.transform = "translateY(20px)";
        card.style.transition = "opacity 0.6s ease, transform 0.6s ease";

        setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }, 120 * (i + 1));
    });
});