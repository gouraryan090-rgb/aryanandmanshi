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
        CHECK MAINTENANCE MODE
========================================== */

async function checkMaintenanceMode() {

    // Admin page ko maintenance screen se bypass karein
    if (window.location.pathname.includes("admin.html")) return;

    if (typeof supabaseClient === "undefined") return;

    try {
        const { data, error } = await supabaseClient
            .from("site_settings")
            .select("is_maintenance")
            .eq("id", 1)
            .single();

        if (data && data.is_maintenance === true) {

            // Loader remove kar do agar visible ho
            const loader = document.getElementById("loader");
            if (loader) loader.remove();

            document.body.innerHTML = `
                <div style="
                    min-height: 100vh;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    background: #0f172a;
                    color: #ffffff;
                    font-family: 'Poppins', sans-serif;
                    text-align: center;
                    padding: 20px;
                    box-sizing: border-box;
                    position: relative;
                ">
                    <div style="font-size: 80px; margin-bottom: 20px;">🛠️</div>
                    <h1 style="font-size: 2.2rem; margin-bottom: 12px; color: #ff6b6b; font-weight: 600;">
                        Website is Under Maintenance
                    </h1>
                    <p style="font-size: 1.05rem; color: #cbd5e1; max-width: 480px; line-height: 1.6; margin-bottom: 30px;">
                        We are currently updating our little world ❤️.<br>
                        Please check back again in a few minutes!
                    </p>

                    <button onclick="goToAdminPanel()" style="
                        background: rgba(255, 255, 255, 0.1);
                        border: 1px solid rgba(255, 255, 255, 0.2);
                        color: #ffb6c1;
                        padding: 10px 20px;
                        border-radius: 20px;
                        font-size: 0.9rem;
                        cursor: pointer;
                        transition: all 0.3s ease;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                    " onmouseover="this.style.background='rgba(255,255,255,0.2)'" onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                        🧑‍💻 Admin Access
                    </button>
                </div>
            `;
        }
    } catch (err) {
        console.error("Maintenance check error:", err);
    }
}

// Admin Panel redirect ya password check function
function goToAdminPanel() {
    if (typeof checkAdminPassword === "function") {
        checkAdminPassword();
    } else {
        window.location.href = "pages/admin.html";
    }
}

// Maintenance check run karein
document.addEventListener("DOMContentLoaded", () => {
    checkMaintenanceMode();
});


/* ==========================================
            ENTER BUTTON
========================================== */

if (enterBtn) {

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

}

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

    if (heartsContainer) {
        heartsContainer.appendChild(heart);
    }

    setTimeout(()=>{

        heart.remove();

    },11000);

}

setInterval(createHeart,700);

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

            if (loaderBar) loaderBar.style.width = progress + "%";

            if (changeCounter % 6 === 0 && loaderIcon) {

                loaderIcon.style.transform = "scale(0.6)";
                loaderIcon.style.opacity = "0";

                setTimeout(() => {

                    loaderIcon.innerHTML = loaderIcons[iconIndex];

                    loaderIcon.style.transform = "scale(1)";
                    loaderIcon.style.opacity = "1";

                    iconIndex = (iconIndex + 1) % loaderIcons.length;

                }, 500);

            }

            if (changeCounter % 8 === 0 && loaderText) {

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

                    if (loader) {
                        loader.classList.add("loader-hide");

                        setTimeout(() => {
                            loader.remove();
                        }, 1000);
                    }

                }, 500);

            }

        }, 330);

    }

}

/* ===========================
      APPLE PAGE TRANSITION
=========================== */

window.addEventListener("load", () => {

    document.body.classList.add("page-enter");

    requestAnimationFrame(() => {

        requestAnimationFrame(() => {

            document.body.classList.remove("page-enter");

        });

    });

});

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


const logoutBtn = document.getElementById("logoutBtn");

if(logoutBtn){

    logoutBtn.addEventListener("click",(e)=>{

        e.preventDefault();

        sessionStorage.clear();

        window.location.replace("../password.html");

    });

}