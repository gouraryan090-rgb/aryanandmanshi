/* ==========================================
            AUTH CHECK
========================================== */

// Password page ko skip mat karo
const isPasswordPage = window.location.pathname.endsWith("password.html");

// Agar password page nahi hai
if (!isPasswordPage) {

    // Login check
    if (sessionStorage.getItem("websiteUnlocked") !== "true") {

        if (window.location.pathname.includes("/pages/")) {

            window.location.href = "../password.html";

        } else {

            window.location.href = "password.html";

        }

    }

    // ========== AUTO LOCK (1 Hour) ==========
    let inactivityTimer;

    function resetInactivityTimer() {

        clearTimeout(inactivityTimer);

        inactivityTimer = setTimeout(() => {

            sessionStorage.removeItem("websiteUnlocked");

            alert("Session expired. Please enter the password again.");

            if (window.location.pathname.includes("/pages/")) {

                window.location.href = "../password.html";

            } else {

                window.location.href = "password.html";

            }

        }, 60 * 60 * 1000); // 1 hour

    }

    ["mousemove","keydown","click","scroll","touchstart"].forEach(event => {

        document.addEventListener(event, resetInactivityTimer);

    });

    resetInactivityTimer();

}