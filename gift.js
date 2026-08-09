/* ==========================================
              GIFT PART 1
========================================== */


/* ----------------------------
        USER
---------------------------- */

const params =
    new URLSearchParams(
        window.location.search
    );


const currentUser =
    params.get("user") || "aryan";


/* ----------------------------
        ELEMENTS
---------------------------- */

const giftTitle =
    document.getElementById("giftTitle");

const giftUserEmoji =
    document.getElementById("giftUserEmoji");

const backBtn =
    document.getElementById("backBtn");

const giftBox =
    document.getElementById("giftBox");

const giftStatus =
    document.getElementById("giftStatus");

const rewardCard =
    document.getElementById("rewardCard");

const rewardEmoji =
    document.getElementById("rewardEmoji");

const rewardTitle =
    document.getElementById("rewardTitle");

const rewardDescription =
    document.getElementById("rewardDescription");

const acceptBtn =
    document.getElementById("acceptBtn");

const cooldown =
    document.getElementById("cooldown");

const lastGift =
    document.getElementById("lastGift");


/* ----------------------------
        REWARDS
---------------------------- */

const aryanRewards = [

    {
        emoji: "❤️",
        title: "Luvv Uhh ×3",
        desc:
            "Manshii has to say 'Luvv Uhh' 3 times to Aryan."
    },

    {
        emoji: "🎤",
        title: "Voice Note",
        desc:
            "Manshii has to send one cute voice note."
    },

    {
        emoji: "🌷",
        title: "One Wish",
        desc:
            "Manshii has to fulfill one reasonable wish of Aryan."
    },

    {
        emoji: "💌",
        title: "Cute Paragraph",
        desc:
            "Manshii has to write a cute paragraph for Aryan."
    },

    {
        emoji: "👑",
        title: "Jackpot",
        desc:
            "Aryan gets to choose one reasonable task."
    }

];


const manshiRewards = [

    {
        emoji: "📸",
        title: "Aryan's Picture",
        desc:
            "Aryan has to send his picture without emoji."
    },

    {
        emoji: "❤️",
        title: "I Luvv Uhh ×5",
        desc:
            "Aryan has to say 'I Luvv Uhh' 5 times in chat."
    },

    {
        emoji: "🌷",
        title: "One Wish",
        desc:
            "Aryan has to fulfill one reasonable wish."
    },

    {
        emoji: "💌",
        title: "Cute Paragraph",
        desc:
            "Aryan has to write a heartfelt paragraph."
    },

    {
        emoji: "👑",
        title: "Jackpot",
        desc:
            "Manshii gets to choose one reasonable task."
    }

];


const rewards =
    currentUser === "aryan"
        ? aryanRewards
        : manshiRewards;


/* ----------------------------
        HEADER
---------------------------- */

if (currentUser === "aryan") {

    giftTitle.innerHTML =
        "Aryan's Daily Gift";

    giftUserEmoji.innerHTML =
        "💙";

    backBtn.setAttribute(
        "href",
        "./aryan.html"
    );

} else {

    giftTitle.innerHTML =
        "Manshii's Daily Gift";

    giftUserEmoji.innerHTML =
        "💗";

    backBtn.setAttribute(
        "href",
        "./manshii.html"
    );

}


/* ==========================================
              GIFT SETTINGS
========================================== */

const STORAGE_KEY =
    currentUser === "aryan"
        ? "gift_aryan"
        : "gift_manshi";


const TIMER_FIELD =
    currentUser === "aryan"
        ? "aryan_timer_end"
        : "manshi_timer_end";


let giftSettings = null;

let timer = null;

let selectedReward = null;


/* ==========================================
              LOAD SETTINGS
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
            "Gift settings error:",
            error
        );

        return false;

    }


    giftSettings = data;


    return true;

}


/* ==========================================
              GIFT FEATURE CHECK
========================================== */

function giftFeatureEnabled() {

    return (
        giftSettings &&
        giftSettings.feature_enabled === true
    );

}


/* ==========================================
              OPEN GIFT
========================================== */

giftBox.addEventListener(
    "click",
    async () => {

        /*
         * Gift feature OFF
         */

      if (!giftFeatureEnabled()) {

    showGiftFeatureError();

    return;

}


        /* Already opened */

        if (
            selectedReward !== null
        ) {

            return;

        }


        /* Cooldown */

        if (
            giftBox.dataset.locked === "true"
        ) {

            return;

        }


        giftBox.classList.add(
            "shake"
        );


        giftStatus.innerHTML =
            "Opening...";


        setTimeout(() => {

            giftBox.classList.remove(
                "shake"
            );

            giftBox.classList.add(
                "open"
            );

        }, 700);


        setTimeout(() => {

            const rewardIndex =
                getReward();


            selectedReward =
                rewards[rewardIndex];


            rewardEmoji.innerHTML =
                selectedReward.emoji;


            rewardTitle.innerHTML =
                selectedReward.title;


            rewardDescription.innerHTML =
                selectedReward.desc;


            rewardCard.style.display =
                "block";


            giftStatus.innerHTML =
                "Gift Opened ❤️";


        }, 1300);

    }
);


/* ==========================================
              RANDOM REWARD
========================================== */

function getReward() {

    const index =
        Math.floor(
            Math.random() *
            rewards.length
        );


    return index;

}


/* ==========================================
              LOAD SAVED REWARD
========================================== */

function loadSavedGift() {

    const saved =
        JSON.parse(
            localStorage.getItem(
                STORAGE_KEY
            )
        );


    if (!saved) {

        lastGift.innerHTML =
            "No gift claimed yet.";

        return;

    }


    lastGift.innerHTML = `

        <strong>
            ${saved.emoji}
            ${saved.title}
        </strong>

        <br><br>

        Claimed on
        ${new Date(
            saved.time
        ).toLocaleString()}

    `;

}


/* ==========================================
              START COOLDOWN
========================================== */

function startCooldown(
    timerEnd
) {

    clearInterval(timer);


    giftBox.dataset.locked =
        "true";


    function update() {

        const now =
            Date.now();


        const left =
            timerEnd - now;


        if (left <= 0) {

            clearInterval(timer);


            cooldown.innerHTML =
                "Ready ❤️";


            giftStatus.innerHTML =
                "Gift Available";


            giftBox.dataset.locked =
                "false";


            selectedReward =
                null;


            rewardCard.style.display =
                "none";


            giftBox.classList.remove(
                "open"
            );


            return;

        }


        const totalSeconds =
            Math.floor(
                left / 1000
            );


        const hrs =
            Math.floor(
                totalSeconds / 3600
            );


        const mins =
            Math.floor(
                (totalSeconds % 3600) /
                60
            );


        const secs =
            totalSeconds % 60;


        cooldown.innerHTML =
            `${hrs}h ${mins}m ${secs}s`;


        giftStatus.innerHTML =
            "Next Gift";

    }


    update();


    timer =
        setInterval(
            update,
            1000
        );

}


/* ==========================================
              LOAD DATABASE TIMER
========================================== */

async function loadDatabaseTimer() {

    if (!giftSettings) {

        return;

    }


    const timerEnd =
        giftSettings[TIMER_FIELD];


    if (!timerEnd) {

        cooldown.innerHTML =
            "Ready ❤️";

        giftStatus.innerHTML =
            "Gift Available";

        giftBox.dataset.locked =
            "false";

        return;

    }


    const endTime =
        new Date(
            timerEnd
        ).getTime();


    if (
        endTime <= Date.now()
    ) {

        cooldown.innerHTML =
            "Ready ❤️";

        giftStatus.innerHTML =
            "Gift Available";

        giftBox.dataset.locked =
            "false";

        return;

    }


    startCooldown(
        endTime
    );

}


/* ==========================================
              ACCEPT / CLAIM GIFT
========================================== */

acceptBtn.addEventListener(
    "click",
    async () => {

        if (!selectedReward) {

            return;

        }


        /*
         * Double-check feature
         */

        const settingsLoaded =
            await loadGiftSettings();


        if (
            !settingsLoaded ||
            !giftFeatureEnabled()
        ) {

            rewardCard.style.display =
                "none";


            giftStatus.innerHTML =
                "🎁 Gift Feature is currently turned off.<br><br>" +
                "Turn it on from the Admin Panel.";

            return;

        }


        /*
         * New 36-hour timer
         */

        const timerEnd =
            new Date(
                Date.now() +
                36 * 60 * 60 * 1000
            );


        const timerEndISO =
            timerEnd.toISOString();


        /*
         * Save timer to Supabase
         */

        const {
            data,
            error
        } =
            await supabaseClient
                .from("gift_settings")
                .update({

                    [TIMER_FIELD]:
                        timerEndISO,

                    updated_at:
                        new Date().toISOString()

                })
                .eq("id", 1)
                .select()
                .single();


        if (error) {

            console.error(
                "Gift timer save error:",
                error
            );


            alert(
                "Could not save gift timer. Please try again."
            );


            return;

        }


        giftSettings =
            data;


        /*
         * Save reward locally
         * for the existing reward history.
         */

        const giftData = {

            emoji:
                selectedReward.emoji,

            title:
                selectedReward.title,

            desc:
                selectedReward.desc,

            time:
                Date.now()

        };


        localStorage.setItem(

            STORAGE_KEY,

            JSON.stringify(
                giftData
            )

        );


        lastGift.innerHTML = `

            <strong>
                ${selectedReward.emoji}
                ${selectedReward.title}
            </strong>

            <br><br>

            Claimed on
            ${new Date().toLocaleString()}

        `;


        rewardCard.style.display =
            "none";


        /*
         * Start timer using
         * Supabase timer.
         */

        startCooldown(
            timerEnd.getTime()
        );

    }
);


/* ==========================================
              INITIALIZE
========================================== */

async function initializeGift() {

    /*
     * Load Supabase settings first.
     */

    const loaded =
        await loadGiftSettings();


    if (!loaded) {

        giftStatus.innerHTML =
            "Unable to load gift settings.";

        return;

    }


    /*
     * Feature OFF
     */

    if (
        !giftFeatureEnabled()
    ) {

        cooldown.innerHTML =
            "Unavailable";

        giftStatus.innerHTML =
            "Gift Feature is currently turned off.";

        giftBox.dataset.locked =
            "true";

    }


    /*
     * Existing reward history
     */

    loadSavedGift();


    /*
     * Database timer
     */

    await loadDatabaseTimer();

}


/* Start */

initializeGift();

function showGiftFeatureError() {

    let popup =
        document.getElementById(
            "giftFeatureErrorPopup"
        );


    if (!popup) {

        popup =
            document.createElement("div");

        popup.id =
            "giftFeatureErrorPopup";


        popup.innerHTML = `

            <div class="gift-error-card">

                <div class="gift-error-badge">
                    <span class="gift-error-icon">🔒</span>
                    <span class="gift-error-sparkle">✨</span>
                </div>

                <h3 class="gift-error-title">
                    Surprise Locked ❤️
                </h3>

                <p class="gift-error-text">
                    The Gift feature is currently turned off!
                    <br><br>
                    <span>Ask Aryan to unlock today's gift from the Admin Panel. 🔑</span>
                </p>

                <button
                    class="gift-error-button"
                    onclick="closeGiftFeatureError()"
                >
                    Got It ❤️
                </button>

            </div>

        `;


        document.body.appendChild(
            popup
        );

    }


    popup.style.display =
        "flex";

}



        document.body.appendChild(
            popup
        );

    


    popup.style.display =
        "flex";

    


function closeGiftFeatureError() {

    const popup =
        document.getElementById(
            "giftFeatureErrorPopup"
        );


    if (popup) {

        popup.style.display =
            "none";

    }

}