/* ==========================================
            PASSWORD PROTECTION
========================================== */

const ARYAN_PASSWORD_HASH =
"4dc1b28b1b9d731f85dd94c23fce0e35e53ef97bf8f9380f693970c6ceb21712";

const MANSHII_PASSWORD_HASH =
"f22d21fe6cd1966e8ed9c96250f36a40560187b03dd8157c5c6f1b7a802deaab";

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

async function saveLoginActivity(user) {

    const { error } = await supabaseClient
        .from("login_activities")
        .insert({
            user_name: user
        });

    if (error) {
        console.error("Login activity save failed:", error);
    }

}

async function unlockWebsite() {

    const enteredPassword = passwordInput.value.trim();

    const enteredHash = await sha256(enteredPassword);

   if (enteredHash === ARYAN_PASSWORD_HASH) {

    sessionStorage.setItem("websiteUnlocked", "true");
    sessionStorage.setItem("currentUser", "aryan");

    await saveLoginActivity("aryan");

    window.location.href = "index.html";

}

else if (enteredHash === MANSHII_PASSWORD_HASH) {

    sessionStorage.setItem("websiteUnlocked", "true");
    sessionStorage.setItem("currentUser", "manshi");

    await saveLoginActivity("manshi");

    window.location.href = "index.html";

}

    error.innerText = "❌ Incorrect Password";

    passwordInput.value = "";

}



unlockBtn.addEventListener("click", unlockWebsite);

passwordInput.addEventListener("keypress", function(e){

    if(e.key === "Enter"){

        unlockWebsite();

    }

});