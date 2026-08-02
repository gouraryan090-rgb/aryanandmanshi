/* =========================================
        OUR LITTLE WORLD
          GIFT SYSTEM
          PART - 1
========================================= */

// =========================
// Detect User
// =========================

const params = new URLSearchParams(window.location.search);

const currentUser = params.get("user") || "aryan";


// =========================
// Elements
// =========================

const giftBox = document.getElementById("giftBox");

const openGiftBtn = document.getElementById("openGift");

const rewardPopup = document.getElementById("rewardPopup");

const rewardTitle = document.getElementById("rewardTitle");

const rewardDescription = document.getElementById("rewardDescription");

const rarityBadge = document.getElementById("rarity");

const acceptGiftBtn = document.getElementById("acceptGift");

const countdown = document.getElementById("countdown");

const lastGift = document.getElementById("lastGift");


// =========================
// Cooldown
// =========================

const COOLDOWN = 36 * 60 * 60 * 1000;

const storageKey = `gift_${currentUser}`;

const rewardKey = `gift_reward_${currentUser}`;


// =========================
// Aryan Rewards
// =========================

const aryanRewards = [

{
title:"❤️ Luvv Uhh x8",
desc:"Say 'Luvv Uhh' 8 times.",
rarity:"Common",
emoji:"❤️",
chance:30
},

{
title:"☕ Coffee Date",
desc:"One coffee date is booked.",
rarity:"Common",
emoji:"☕",
chance:20
},

{
title:"📸 Selfie",
desc:"Send today's cutest selfie.",
rarity:"Rare",
emoji:"📸",
chance:15
},

{
title:"🎤 Voice Note",
desc:"Send one cute voice note.",
rarity:"Rare",
emoji:"🎤",
chance:12
},

{
title:"💌 Paragraph",
desc:"Write one cute paragraph.",
rarity:"Epic",
emoji:"💌",
chance:10
},

{
title:"🤗 10 Hugs",
desc:"Give 10 warm hugs.",
rarity:"Epic",
emoji:"🤗",
chance:8
},

{
title:"👑 Jackpot",
desc:"One wish without saying no.",
rarity:"Legendary",
emoji:"👑",
chance:5
}

];


// =========================
// Manshii Rewards
// =========================

const manshiRewards = [

{
title:"❤️ Luvv Uhh x8",
desc:"Say 'Luvv Uhh' 8 times.",
rarity:"Common",
emoji:"❤️",
chance:30
},

{
title:"☕ Coffee Date",
desc:"Coffee date coupon.",
rarity:"Common",
emoji:"☕",
chance:20
},

{
title:"🎤 Voice Note",
desc:"Send one cute voice note.",
rarity:"Rare",
emoji:"🎤",
chance:15
},

{
title:"😂 Tell Joke",
desc:"Tell Aryan one funny joke.",
rarity:"Rare",
emoji:"😂",
chance:12
},

{
title:"💌 Cute Letter",
desc:"Write one handwritten letter.",
rarity:"Epic",
emoji:"💌",
chance:10
},

{
title:"🤗 10 Hugs",
desc:"Give Aryan 10 hugs.",
rarity:"Epic",
emoji:"🤗",
chance:8
},

{
title:"📸 Aryan Pic",
desc:"Get Aryan's pic without emoji 😏",
rarity:"Legendary",
emoji:"📸",
chance:5
}

];


// =========================

const rewards =
currentUser === "aryan"
?
aryanRewards
:
manshiRewards;


// =========================
// Rarity Colors
// =========================

const rarityColors = {

Common:"🟢 Common",

Rare:"🔵 Rare",

Epic:"🟣 Epic",

Legendary:"🟡 Legendary"

};


// =========================

console.log("Gift System Part 1 Loaded ❤️");

/* =========================================
        PART 2
    GIFT OPENING ENGINE
========================================= */

// =========================
// Weighted Random Reward
// =========================

function getRandomReward(){

    let total = 0;

    rewards.forEach(r => total += r.chance);

    let random = Math.random() * total;

    for(const reward of rewards){

        if(random < reward.chance){

            return reward;

        }

        random -= reward.chance;

    }

    return rewards[0];

}


// =========================
// Open Gift
// =========================

openGiftBtn.addEventListener("click",()=>{

    if(openGiftBtn.disabled) return;

    openGiftBtn.disabled = true;

    openGiftBtn.innerHTML = "Opening... ❤️";

    giftBox.classList.add("shake");

    setTimeout(()=>{

        giftBox.classList.remove("shake");

        giftBox.classList.add("open");

    },1200);

    setTimeout(()=>{

        const reward = getRandomReward();

        rewardTitle.innerHTML =
        reward.emoji + " " + reward.title;

        rewardDescription.innerHTML =
        reward.desc;

        rarityBadge.innerHTML =
        rarityColors[reward.rarity];

        rewardPopup.classList.add("show");

        currentReward = reward;

    },2200);

});


// =========================
// Accept Gift
// =========================

let currentReward = null;

acceptGiftBtn.addEventListener("click",()=>{

    rewardPopup.classList.remove("show");

    giftBox.classList.remove("open");

    openGiftBtn.innerHTML = "Open Gift ❤️";

});

/* =========================================
        PART 3
   COOLDOWN + LAST GIFT
========================================= */

function saveReward(reward){

    const data={

        title:reward.title,

        desc:reward.desc,

        rarity:reward.rarity,

        emoji:reward.emoji

    };

    localStorage.setItem(

        rewardKey,

        JSON.stringify(data)

    );

    lastGift.innerHTML=
        reward.emoji+" "+reward.title;

}

function loadLastGift(){

    const saved=
        localStorage.getItem(rewardKey);

    if(!saved) return;

    const reward=
        JSON.parse(saved);

    lastGift.innerHTML=
        reward.emoji+" "+reward.title;

}

function startCooldown(){

    const last=

        Number(localStorage.getItem(storageKey));

    if(!last){

        countdown.innerHTML="Ready ❤️";

        openGiftBtn.disabled=false;

        return;

    }

    const timer=setInterval(()=>{

        const left=

            COOLDOWN-(Date.now()-last);

        if(left<=0){

            clearInterval(timer);

            localStorage.removeItem(storageKey);

            countdown.innerHTML="Ready ❤️";

            openGiftBtn.disabled=false;

            openGiftBtn.innerHTML="Open Gift ❤️";

            return;

        }

        openGiftBtn.disabled=true;

        const h=

        Math.floor(left/3600000);

        const m=

        Math.floor(

        (left%3600000)/60000);

        const s=

        Math.floor(

        (left%60000)/1000);

        countdown.innerHTML=

        `${h}H : ${m}M : ${s}S`;

    },1000);

}

/* ==========================
      ACCEPT GIFT
========================== */

acceptGiftBtn.addEventListener("click",()=>{

    if(currentReward){

        saveReward(currentReward);

    }

    localStorage.setItem(

        storageKey,

        Date.now()

    );

    rewardPopup.classList.remove("show");

    giftBox.classList.remove("open");

    openGiftBtn.innerHTML="Gift Claimed ❤️";

    startCooldown();

});

/* ==========================
      FIRST LOAD
========================== */

loadLastGift();

startCooldown();