/* ==========================================
            PASSWORD PROTECTION
========================================== */

const PASSWORD_HASH = "4dc1b28b1b9d731f85dd94c23fce0e35e53ef97bf8f9380f693970c6ceb21712";

const passwordInput = document.getElementById("password");
const unlockBtn = document.getElementById("unlockBtn");
const error = document.getElementById("error");

async function sha256(text) {

    const encoder = new TextEncoder();

    const data = encoder.encode(text);

    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    const hashArray = Array.from(new Uint8Array(hashBuffer));

    return hashArray
        .map(b => b.toString(16).padStart(2, "0"))
        .join("");

}

async function unlockWebsite() {

    const enteredPassword = passwordInput.value.trim();

    const enteredHash = await sha256(enteredPassword);

    if (enteredHash === PASSWORD_HASH) {

        sessionStorage.setItem("websiteUnlocked", "true");

        window.location.href = "index.html";

    }

    else {

        error.innerText = "❌ Incorrect Password";

        passwordInput.value = "";

    }

}

unlockBtn.addEventListener("click", unlockWebsite);

passwordInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        unlockWebsite();

    }

});