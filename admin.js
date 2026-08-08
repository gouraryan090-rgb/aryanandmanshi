/* ==========================================
              ADMIN PROTECTION
========================================== */

const ADMIN_PASSWORD_HASH =
"4dc1b28b1b9d731f85dd94c23fce0e35e53ef97bf8f9380f693970c6ceb21712";


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


async function checkAdminPassword() {

    const password =
        prompt("🔐 Enter Admin Password");

    if (password === null) {

        window.location.href = "../index.html";

        return;

    }


    const enteredHash =
        await sha256(password);


    if (enteredHash === ADMIN_PASSWORD_HASH) {

        sessionStorage.setItem(
            "adminAuthenticated",
            "true"
        );

        window.location.href = "pages/admin.html";

    } else {

        alert("❌ Incorrect Admin Password");

        window.location.href = "../index.html";

    }

}