/* ==========================================
              ADMIN PROTECTION
========================================== */

const ADMIN_PASSWORD_HASH =
"4dc1b28b1b9d731f85dd94c23fce0e35e53ef97bf8f9380f693970c6ceb21712";


/* ==========================================
              SHA-256
========================================== */

async function sha256(text) {

    const encoder = new TextEncoder();

    const data = encoder.encode(text);

    const hashBuffer =
        await crypto.subtle.digest("SHA-256", data);

    const hashArray =
        Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

}


/* ==========================================
              CUSTOM ADMIN MODAL
========================================== */

function checkAdminPassword() {

    /* Create overlay */

    const overlay =
        document.createElement("div");

    overlay.className =
        "admin-login-overlay";


    overlay.innerHTML = `

        <div class="admin-login-modal">

            <button
                class="admin-login-close"
                id="adminCloseBtn">
                ×
            </button>


            <div class="admin-login-icon">
                🧑‍💻
            </div>


            <h2>
                Admin Access
            </h2>


            <p>
                Enter the administrator password
            </p>


            <div class="admin-password-wrapper">

                <input
                    type="password"
                    id="adminPasswordInput"
                    placeholder="Enter password"
                    autocomplete="off"
                >

                <button
                    type="button"
                    id="adminTogglePassword"
                    class="admin-password-toggle">
                    👁
                </button>

            </div>


            <div
                id="adminLoginError"
                class="admin-login-error">
            </div>


            <button
                id="adminUnlockBtn"
                class="admin-unlock-btn">

                🔓 Unlock Admin

            </button>

        </div>

    `;


    document.body.appendChild(overlay);


    const passwordInput =
        document.getElementById(
            "adminPasswordInput"
        );

    const unlockBtn =
        document.getElementById(
            "adminUnlockBtn"
        );

    const closeBtn =
        document.getElementById(
            "adminCloseBtn"
        );

    const toggleBtn =
        document.getElementById(
            "adminTogglePassword"
        );

    const error =
        document.getElementById(
            "adminLoginError"
        );


    /* Focus input */

    setTimeout(() => {

        passwordInput.focus();

    }, 100);


    /* ==========================================
                CLOSE MODAL
    ========================================== */

    closeBtn.addEventListener(
        "click",
        () => {

            overlay.remove();

        }
    );


    /* ==========================================
                PASSWORD VISIBILITY
    ========================================== */

    toggleBtn.addEventListener(
        "click",
        () => {

            if (
                passwordInput.type ===
                "password"
            ) {

                passwordInput.type =
                    "text";

                toggleBtn.textContent =
                    "🙈";

            } else {

                passwordInput.type =
                    "password";

                toggleBtn.textContent =
                    "👁";

            }

        }
    );


    /* ==========================================
                UNLOCK
    ========================================== */

    async function unlockAdmin() {

        const password =
            passwordInput.value.trim();


        if (!password) {

            error.textContent =
                "Please enter the password.";

            passwordInput.focus();

            return;

        }


        unlockBtn.disabled = true;

        unlockBtn.textContent =
            "Checking...";


        const enteredHash =
            await sha256(password);


        if (
            enteredHash ===
            ADMIN_PASSWORD_HASH
        ) {

            sessionStorage.setItem(
                "adminAuthenticated",
                "true"
            );


            unlockBtn.textContent =
                "✓ Access Granted";


            setTimeout(() => {

                window.location.href =
                    "pages/admin.html";

            }, 300);


        } else {

            error.textContent =
                "❌ Incorrect admin password.";

            passwordInput.value = "";

            passwordInput.focus();


            unlockBtn.disabled = false;

            unlockBtn.textContent =
                "🔓 Unlock Admin";

        }

    }


    unlockBtn.addEventListener(
        "click",
        unlockAdmin
    );


    /* Enter key */

    passwordInput.addEventListener(
        "keypress",
        (e) => {

            if (e.key === "Enter") {

                unlockAdmin();

            }

        }
    );


    /* Click outside */

    overlay.addEventListener(
        "click",
        (e) => {

            if (e.target === overlay) {

                overlay.remove();

            }

        }
    );

}

/* ==========================================
          GIFT MANAGER
========================================== */

let giftSettings = null;


/* Open Gift Manager */

/* ==========================================
          GIFT MANAGER
========================================== */

let giftSettings = null;


/* ==========================================
          OPEN GIFT MANAGER
========================================== */

async function openGiftManager() {

    const modal =
        document.getElementById("giftManagerModal");

    modal.style.display = "flex";

    await loadGiftSettings();

}


/* ==========================================
          CLOSE GIFT MANAGER
========================================== */

function closeGiftManager() {

    const modal =
        document.getElementById("giftManagerModal");

    modal.style.display = "none";

}


/* ==========================================
          LOAD SETTINGS FROM SUPABASE
========================================== */

async function loadGiftSettings() {

    const { data, error } =
        await supabaseClient
            .from("gift_settings")
            .select("*")
            .eq("id", 1)
            .single();


    if (error) {

        console.error(
            "Gift settings load error:",
            error
        );

        return false;

    }


    giftSettings = data;


    /* Feature toggle */

    const toggle =
        document.getElementById(
            "giftFeatureToggle"
        );


    if (toggle) {

        toggle.checked =
            data.feature_enabled === true;

    }


    /* Timers */

    updateGiftTimerDisplay(
        "manshi",
        data.manshi_timer_end
    );


    updateGiftTimerDisplay(
        "aryan",
        data.aryan_timer_end
    );


    return true;

}


/* ==========================================
          TIMER DISPLAY
========================================== */

function updateGiftTimerDisplay(
    user,
    timerEnd
) {

    const element =
        document.getElementById(
            user + "TimerDisplay"
        );


    if (!element) {

        return;

    }


    if (!timerEnd) {

        element.textContent =
            "Not set";

        return;

    }


    const end =
        new Date(timerEnd);


    const now =
        new Date();


    const difference =
        end - now;


    if (difference <= 0) {

        element.textContent =
            "Expired";

        return;

    }


    const totalMinutes =
        Math.floor(
            difference / 60000
        );


    const hours =
        Math.floor(
            totalMinutes / 60
        );


    const minutes =
        totalMinutes % 60;


    element.textContent =
        `${hours}h ${minutes}m`;

}


/* ==========================================
          TOGGLE GIFT FEATURE
========================================== */

async function toggleGiftFeature() {

    const toggle =
        document.getElementById(
            "giftFeatureToggle"
        );


    const enabled =
        toggle.checked;


    toggle.disabled = true;


    const { data, error } =
        await supabaseClient
            .from("gift_settings")
            .update({

                feature_enabled:
                    enabled,

                updated_at:
                    new Date().toISOString()

            })
            .eq("id", 1)
            .select()
            .single();


    if (error) {

        console.error(
            "Gift feature update error:",
            error
        );


        /* Restore previous state */

        toggle.checked =
            !enabled;


        alert(
            "Gift Feature update failed.\n\n" +
            error.message
        );


        toggle.disabled = false;


        return;

    }


    /* Keep local state updated */

    giftSettings =
        data;


    toggle.checked =
        data.feature_enabled === true;


    toggle.disabled = false;


    console.log(
        "Gift Feature saved:",
        data.feature_enabled
    );

}


/* ==========================================
          CHANGE GIFT TIMER
========================================== */

async function changeGiftTimer(
    user,
    minutes
) {

    /* Make sure settings are loaded */

    if (!giftSettings) {

        const loaded =
            await loadGiftSettings();


        if (!loaded) {

            return;

        }

    }


    const field =
        user === "manshi"
            ? "manshi_timer_end"
            : "aryan_timer_end";


    let currentEnd =
        giftSettings[field];


    let newEnd;


    if (currentEnd) {

        newEnd =
            new Date(currentEnd);

    } else {

        /*
         * If no timer exists,
         * start from current time.
         */

        newEnd =
            new Date();

    }


    newEnd.setMinutes(
        newEnd.getMinutes() +
        minutes
    );


    const newTimer =
        newEnd.toISOString();


    const { data, error } =
        await supabaseClient
            .from("gift_settings")
            .update({

                [field]:
                    newTimer,

                updated_at:
                    new Date().toISOString()

            })
            .eq("id", 1)
            .select()
            .single();


    if (error) {

        console.error(
            "Timer update error:",
            error
        );


        alert(
            "Timer update failed.\n\n" +
            error.message
        );


        return;

    }


    /* Update local settings */

    giftSettings =
        data;


    /* Update UI */

    updateGiftTimerDisplay(
        user,
        data[field]
    );

}


/* ==========================================
          RESET GIFT TIMER
========================================== */

async function resetGiftTimer(
    user
) {

    const confirmed =
        confirm(
            `Reset ${user}'s gift timer?`
        );


    if (!confirmed) {

        return;

    }


    const field =
        user === "manshi"
            ? "manshi_timer_end"
            : "aryan_timer_end";


    const { data, error } =
        await supabaseClient
            .from("gift_settings")
            .update({

                [field]: null,

                updated_at:
                    new Date().toISOString()

            })
            .eq("id", 1)
            .select()
            .single();


    if (error) {

        console.error(
            "Timer reset error:",
            error
        );


        alert(
            "Timer reset failed.\n\n" +
            error.message
        );


        return;

    }


    /* Update local settings */

    giftSettings =
        data;


    /* Update UI */

    updateGiftTimerDisplay(
        user,
        null
    );

}