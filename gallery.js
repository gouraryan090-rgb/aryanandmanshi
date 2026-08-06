/* ==========================================
            OUR GALLERY ❤️
========================================== */

const photos = [];

// photo1.jpg → photo5.jpg
for (let i = 1; i <= 5; i++) {
    photos.push(`../images/photo${i}.jpg`);
}

// photo6.png → photo15.png
for (let i = 6; i <= 15; i++) {
    photos.push(`../images/photo${i}.png`);
}

// photo16.jpg
photos.push("../images/photo16.jpg");


const videos = [];

// vid1.mp4 → vid11.mp4
for (let i = 1; i <= 11; i++) {
    videos.push(`../images/vid${i}.mp4`);
}


const photoGallery = document.getElementById("photoGallery");
const videoGallery = document.getElementById("videoGallery");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxVideo = document.getElementById("lightboxVideo");

const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentItems = [];
let currentIndex = 0;
let currentType = "image";


/* ==========================================
            LOAD PHOTOS
========================================== */

photos.forEach((src, index) => {

    const img = document.createElement("img");

    img.src = src;

    img.className = "gallery-item";

    img.loading = "lazy";

    img.onclick = () => {

        currentItems = photos;

        currentIndex = index;

        currentType = "image";

        openImage();

    };

    photoGallery.appendChild(img);

});


/* ==========================================
            LOAD VIDEOS
========================================== */

videos.forEach((src, index) => {

    const video = document.createElement("video");

    video.src = src;

    video.className = "gallery-item";

    video.muted = true;

    video.preload = "metadata";

    video.onclick = () => {

        currentItems = videos;

        currentIndex = index;

        currentType = "video";

        openVideo();

    };

    videoGallery.appendChild(video);

});


/* ==========================================
            IMAGE
========================================== */

function openImage() {

    lightboxImg.style.display = "block";
    lightboxVideo.style.display = "none";

    // Hide image until loaded
    lightboxImg.style.opacity = "0";

    lightboxImg.onload = () => {

        lightbox.style.display = "flex";

        lightboxImg.style.opacity = "1";

    };

    lightboxImg.src = currentItems[currentIndex];

}


/* ==========================================
            VIDEO
========================================== */

function openVideo() {

    lightbox.style.display = "flex";

    lightboxImg.style.display = "none";

    lightboxVideo.style.display = "block";

    lightboxVideo.src = currentItems[currentIndex];

    lightboxVideo.play();

}


/* ==========================================
            CLOSE
========================================== */

closeBtn.onclick = () => {

    lightbox.style.display = "none";

    lightboxVideo.pause();

};


/* ==========================================
            NEXT
========================================== */

nextBtn.onclick = () => {

    currentIndex++;

    if (currentIndex >= currentItems.length) {

        currentIndex = 0;

    }

    if (currentType === "image") {

        openImage();

    } else {

        openVideo();

    }

};


/* ==========================================
            PREVIOUS
========================================== */

prevBtn.onclick = () => {

    currentIndex--;

    if (currentIndex < 0) {

        currentIndex = currentItems.length - 1;

    }

    if (currentType === "image") {

        openImage();

    } else {

        openVideo();

    }

};


/* ==========================================
            ESC CLOSE
========================================== */

document.addEventListener("keydown", (e) => {

    if (e.key === "Escape") {

        lightbox.style.display = "none";

        lightboxVideo.pause();

    }

});


/* ==========================================
            KEYBOARD NAVIGATION
========================================== */

document.addEventListener("keydown", (e) => {

    if (lightbox.style.display !== "flex") return;

    if (e.key === "ArrowRight") {

        nextBtn.click();

    }

    if (e.key === "ArrowLeft") {

        prevBtn.click();

    }

});


/* ==========================================
            COUNTER
========================================== */

document.getElementById("photoCount").innerText = photos.length;
document.getElementById("videoCount").innerText = videos.length;

console.log("Gallery Loaded ❤️");