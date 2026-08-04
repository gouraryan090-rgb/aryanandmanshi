/* ==========================================
            GIFT PART 1
========================================== */

// ----------------------------
// USER
// ----------------------------

const params = new URLSearchParams(window.location.search);

const currentUser =
params.get("user") || "aryan";

// ----------------------------
// ELEMENTS
// ----------------------------

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

// ----------------------------
// REWARDS
// ----------------------------

const aryanRewards=[

{

emoji:"❤️",

title:"Luvv Uhh ×3",

desc:"Manshii has to say 'Luvv Uhh' 3 times to Aryan."

},

{

emoji:"🎤",

title:"Voice Note",

desc:"Manshii has to send one cute voice note."

},

{

emoji:"🌷",

title:"One Wish",

desc:"Manshii has to fulfill one reasonable wish of Aryan."

},

{

emoji:"💌",

title:"Cute Paragraph",

desc:"Manshii has to write a cute paragraph for Aryan."

},

{

emoji:"👑",

title:"Jackpot",

desc:"Aryan gets to choose one reasonable task."

}

];



const manshiRewards=[

{

emoji:"📸",

title:"Aryan's Picture",

desc:"Aryan has to send his picture without emoji."

},

{

emoji:"❤️",

title:"I Luvv Uhh ×5",

desc:"Aryan has to say 'I Luvv Uhh' 5 times in chat."

},

{

emoji:"🌷",

title:"One Wish",

desc:"Aryan has to fulfill one reasonable wish."

},

{

emoji:"💌",

title:"Cute Paragraph",

desc:"Aryan has to write a heartfelt paragraph."

},

{

emoji:"👑",

title:"Jackpot",

desc:"Manshii gets to choose one reasonable task."

}

];

// ----------------------------
// ACTIVE REWARDS
// ----------------------------

const rewards=
currentUser==="aryan"
? aryanRewards
: manshiRewards;

// ----------------------------
// HEADER
// ----------------------------

if(currentUser==="aryan"){

giftTitle.innerHTML=
"Aryan's Daily Gift";

giftUserEmoji.innerHTML="💙";

backBtn.setAttribute("href","./aryan.html");

}else{

giftTitle.innerHTML=
"Manshii's Daily Gift";

giftUserEmoji.innerHTML="💗";

backBtn.setAttribute("href","./manshii.html");

}



// ----------------------------
// STORAGE
// ----------------------------

const STORAGE_KEY=
currentUser==="aryan"
? "gift_aryan"
: "gift_manshi";

const COOLDOWN=
36*60*60*1000;

// ----------------------------

let selectedReward=null;

/* ==========================================
            GIFT PART 2
========================================== */

// ----------------------------
// RANDOM REWARD
// ----------------------------

function getReward(){

    let index =
    Math.floor(
        Math.random() * rewards.length
    );

   

    return index;

}

// ----------------------------
// OPEN GIFT
// ----------------------------

giftBox.addEventListener("click",()=>{

    // Already opened
    if(selectedReward!==null) return;

    // Cooldown running
    if(giftBox.dataset.locked==="true") return;

    giftBox.classList.add("shake");

    giftStatus.innerHTML="Opening...";

    setTimeout(()=>{

        giftBox.classList.remove("shake");

        giftBox.classList.add("open");

    },700);

    setTimeout(()=>{

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

    },1300);

});

/* ==========================================
            GIFT PART 3
========================================== */

let timer;

// ----------------------------
// LOAD SAVED DATA
// ----------------------------

function loadGift(){

    const saved =
    JSON.parse(
        localStorage.getItem(STORAGE_KEY)
    );

    if(!saved){

        cooldown.innerHTML="Ready ❤️";

        lastGift.innerHTML="No gift claimed yet.";

        giftBox.dataset.locked="false";

        return;

    }

    lastGift.innerHTML=`

        <strong>

        ${saved.emoji}
        ${saved.title}

        </strong>

        <br><br>

        Claimed on

        ${new Date(saved.time).toLocaleString()}

    `;

    startCooldown(saved.time);

}

loadGift();

// ----------------------------
// COOLDOWN
// ----------------------------

function startCooldown(time){

    clearInterval(timer);

    giftBox.dataset.locked="true";

    function update(){

        const left =
        COOLDOWN -
        (Date.now()-time);

        if(left<=0){

            clearInterval(timer);

            cooldown.innerHTML="Ready ❤️";

            giftStatus.innerHTML="Gift Available";

            giftBox.dataset.locked="false";

            selectedReward=null;

            rewardCard.style.display="none";

            giftBox.classList.remove("open");

            return;

        }

        const hrs =
        Math.floor(left/3600000);

        const mins =
        Math.floor(
            (left%3600000)/60000
        );

        const secs =
        Math.floor(
            (left%60000)/1000
        );

        cooldown.innerHTML=

        `${hrs}h ${mins}m ${secs}s`;

        giftStatus.innerHTML="Next Gift";

    }

    update();

    timer=
    setInterval(update,1000);

}

// ----------------------------
// ACCEPT
// ----------------------------

acceptBtn.addEventListener("click",()=>{

    if(!selectedReward) return;

    const data={

        emoji:selectedReward.emoji,

        title:selectedReward.title,

        desc:selectedReward.desc,

        time:Date.now()

    };

    localStorage.setItem(

        STORAGE_KEY,

        JSON.stringify(data)

    );

    lastGift.innerHTML=`

        <strong>

        ${selectedReward.emoji}

        ${selectedReward.title}

        </strong>

        <br><br>

        Claimed on

        ${new Date().toLocaleString()}

    `;

    rewardCard.style.display="none";

    startCooldown(data.time);

});