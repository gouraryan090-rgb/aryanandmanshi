// Show loader only once per tab
if (sessionStorage.getItem("loaderShown")) {

    const loader = document.getElementById("loader");

    if (loader) {
        loader.remove();
    }

} else {

    sessionStorage.setItem("loaderShown", "true");

}


/* ==========================================
        OUR LITTLE WORLD ❤️
        SCRIPT.JS
========================================== */

const home = document.querySelector(".home");

const dashboard = document.querySelector(".dashboard");

const enterBtn = document.getElementById("enterBtn");

const heartsContainer = document.querySelector(".hearts");

/* ==========================================
            ENTER BUTTON
========================================== */

enterBtn.addEventListener("click",()=>{

    home.classList.add("fade-out");

    setTimeout(()=>{

        home.style.display="none";

        dashboard.classList.add("show");

        dashboard.classList.add("fade-in");

        window.scrollTo({

            top:0,

            behavior:"smooth"

        });

    },700);

});

/* ==========================================
        FLOATING HEARTS
========================================== */

function createHeart(){

    const heart=document.createElement("div");

    heart.classList.add("floating-heart");

    heart.innerHTML="❤️";

    heart.style.left=Math.random()*100+"vw";

    heart.style.fontSize=(18+Math.random()*22)+"px";

    heart.style.animationDuration=(6+Math.random()*5)+"s";

    heartsContainer.appendChild(heart);

    setTimeout(()=>{

        heart.remove();

    },11000);

}

setInterval(createHeart,700);

/* ==========================================
        CARD HOVER SOUND (Future)
========================================== */

// Reserved

/* ==========================================
        PASSWORD (Future)
========================================== */

// Reserved

/* ==========================================
        MUSIC (Future)
========================================== */

// Reserved

/* ==========================================
        LOADER (Future)
========================================== */

// Reserved

/* ==========================================
        CONSOLE MESSAGE ❤️
========================================== */

console.log("%cWelcome to Our Little World ❤️","color:#ff4d94;font-size:18px;font-weight:bold;");

/* ==========================================
        SCROLL REVEAL
========================================== */

const reveals = document.querySelectorAll(".reveal");

function revealOnScroll(){

    reveals.forEach((item)=>{

        const windowHeight = window.innerHeight;

        const top = item.getBoundingClientRect().top;

        const visible = 100;

        if(top < windowHeight - visible){

            item.classList.add("active");

        }

    });

}

window.addEventListener("scroll", revealOnScroll);

revealOnScroll();

/* ===========================
        PREMIUM LOADER
=========================== */

const loader = document.getElementById("loader");

if (loader) {

    // Loader already shown in this tab?
    if (sessionStorage.getItem("loaderShown")) {
        loader.remove();
    } else {

        sessionStorage.setItem("loaderShown", "true");

        const loaderIcon = document.getElementById("loaderIcon");
        const loaderText = document.getElementById("loaderText");
        const loaderBar = document.getElementById("loaderBar");

        const loaderIcons = [
            "❤️","💌","📸","🎵","☕","🌙","💍","🏎️","✨","💕"
        ];

        const loaderMessages = [
            "Creating Memories... ❤️",
            "Finding Cute Moments... 🥹",
            "Collecting Smiles... 😊",
            "Loading Love... 💗",
            "Opening Your World... 🌎",
            "Almost There... ✨"
        ];

        let progress = 0;
        let iconIndex = 0;
        let messageIndex = 0;
        let changeCounter = 0;

        const loaderInterval = setInterval(() => {

            changeCounter++;

            progress += 2.1;

            loaderBar.style.width = progress + "%";

            if (changeCounter % 6 === 0) {

                loaderIcon.style.transform = "scale(0.6)";
                loaderIcon.style.opacity = "0";

                setTimeout(() => {

                    loaderIcon.innerHTML = loaderIcons[iconIndex];

                    loaderIcon.style.transform = "scale(1)";
                    loaderIcon.style.opacity = "1";

                    iconIndex = (iconIndex + 1) % loaderIcons.length;

                }, 500);

            }

            if (changeCounter % 8 === 0) {

                loaderText.style.opacity = "0";

                setTimeout(() => {

                    loaderText.innerHTML = loaderMessages[messageIndex];

                    loaderText.style.opacity = "1";

                    messageIndex = (messageIndex + 1) % loaderMessages.length;

                }, 500);

            }

            if (progress >= 100) {

                clearInterval(loaderInterval);

                setTimeout(() => {

                    loader.classList.add("loader-hide");

                    setTimeout(() => {
                        loader.remove();
                    }, 1000);

                }, 500);

            }

        }, 330);

    }

}

/* ===========================
      APPLE PAGE TRANSITION
=========================== */

// Page Enter Animation
window.addEventListener("load", () => {

    document.body.classList.add("page-enter");

    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            document.body.classList.remove("page-enter");

        });

    });

});

// Page Exit Animation
document.querySelectorAll("a").forEach(link => {

    const href = link.getAttribute("href");

    if (
        href &&
        !href.startsWith("#") &&
        !href.startsWith("javascript") &&
        !link.target
    ) {

        link.addEventListener("click", function(e){

            e.preventDefault();

            document.body.classList.add("page-exit");

            setTimeout(() => {

                window.location.href = href;

            },550);

        });

    }

});
window.addEventListener("pageshow", () => {
    document.body.classList.remove("page-exit");
    document.body.classList.remove("page-enter");
});

