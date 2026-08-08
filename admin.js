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