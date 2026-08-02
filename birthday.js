/* ==========================================
          SMART BIRTHDAY COUNTDOWN
========================================== */

const banner = document.getElementById("birthdayBanner");
const title = document.querySelector(".birthday-title");
const countdown = document.getElementById("birthdayCountdown");

if (banner && title && countdown) {

    // Detect page
    let birthdayMonth;
    let birthdayDay;
    let personName;

    if (window.location.pathname.toLowerCase().includes("aryan")) {

        birthdayDay = 14;
        birthdayMonth = 5; // June (0 = Jan)
        personName = "Aryan";

    } else if (window.location.pathname.toLowerCase().includes("manshi")) {

        birthdayDay = 20;
        birthdayMonth = 2; // March
        personName = "Manshii";

    }

    function updateBirthday() {

        const now = new Date();

        const todayDay = now.getDate();
        const todayMonth = now.getMonth();

        // 🎉 Birthday Today
        if (todayDay === birthdayDay && todayMonth === birthdayMonth) {

            banner.classList.add("birthday");

            title.innerHTML = `🎉 Happy Birthday ${personName} ❤️`;

            countdown.innerHTML = "00M : 00D : 00H : 00M : 00S";

            return;

        }

        banner.classList.remove("birthday");

        title.innerHTML = `🎂 ${personName}'s Birthday In`;

        let nextBirthday = new Date(
            now.getFullYear(),
            birthdayMonth,
            birthdayDay,
            0,
            0,
            0
        );

        if (nextBirthday < now) {

            nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);

        }

        let diff = nextBirthday - now;

        let totalSeconds = Math.floor(diff / 1000);

        let seconds = totalSeconds % 60;

        let totalMinutes = Math.floor(totalSeconds / 60);

        let minutes = totalMinutes % 60;

        let totalHours = Math.floor(totalMinutes / 60);

        let hours = totalHours % 24;

        let totalDays = Math.floor(totalHours / 24);

        let months = Math.floor(totalDays / 30);

        let days = totalDays % 30;

        countdown.innerHTML =
            `${String(months).padStart(2,"0")}M : `
            + `${String(days).padStart(2,"0")}D : `
            + `${String(hours).padStart(2,"0")}H : `
            + `${String(minutes).padStart(2,"0")}M : `
            + `${String(seconds).padStart(2,"0")}S`;

    }

    updateBirthday();

    setInterval(updateBirthday,1000);

}