/* ==========================================
   OUR GALLERY ❤️
   SUPABASE STORAGE VERSION
========================================== */


/* ==========================================
   ELEMENTS
========================================== */

const photoGallery =
    document.getElementById("photoGallery");

const videoGallery =
    document.getElementById("videoGallery");

const photoCount =
    document.getElementById("photoCount");

const videoCount =
    document.getElementById("videoCount");

const lightbox =
    document.getElementById("lightbox");

const lightboxImg =
    document.getElementById("lightboxImg");

const lightboxVideo =
    document.getElementById("lightboxVideo");

const closeBtn =
    document.getElementById("closeBtn");

const prevBtn =
    document.getElementById("prevBtn");

const nextBtn =
    document.getElementById("nextBtn");


/* ==========================================
   VARIABLES
========================================== */

let photos = [];

let videos = [];

let currentItems = [];

let currentIndex = 0;

let currentType = "image";


/* ==========================================
   SUPABASE CHECK
========================================== */

if (
    typeof supabaseClient ===
    "undefined"
) {

    console.error(
        "Supabase client not found."
    );

    showGalleryError(
        "Unable to connect to gallery."
    );

}


/* ==========================================
   LOAD GALLERY
========================================== */

async function loadGallery() {

    try {

        console.log(
            "Loading gallery from Supabase..."
        );


        const {
            data,
            error
        } =
            await supabaseClient
                .storage
                .from("gallery")
                .list("", {
                    limit: 1000,
                    offset: 0,
                    sortBy: {
                        column: "created_at",
                        order: "asc"
                    }
                });


        if (error) {

            throw error;

        }


        if (!data) {

            console.log(
                "No media found."
            );

            updateCounters();

            return;

        }


        /* ==================================
           CLEAR OLD GALLERY
        ================================== */

        photoGallery.innerHTML = "";

        videoGallery.innerHTML = "";


        photos = [];

        videos = [];


        /* ==================================
           PROCESS FILES
        ================================== */

        data.forEach(
            function (file) {

                /*
                 * Ignore folders
                 */

                if (!file.name) {

                    return;

                }


                const fileName =
                    file.name.toLowerCase();


                /*
                 * Ignore hidden/system files
                 */

                if (
                    fileName === ".emptyfolderplaceholder"
                ) {

                    return;

                }


                /*
                 * Get public URL
                 */

                const result =
                    supabaseClient
                        .storage
                        .from("gallery")
                        .getPublicUrl(
                            file.name
                        );


                const publicURL =
                    result.data.publicUrl;


                /*
                 * IMAGE
                 */

                if (
                    isImage(fileName)
                ) {

                    photos.push(
                        publicURL
                    );

                }


                /*
                 * VIDEO
                 */

                else if (
                    isVideo(fileName)
                ) {

                    videos.push(
                        publicURL
                    );

                }

            }
        );


        /* ==================================
           RENDER
        ================================== */

        renderPhotos();

        renderVideos();

        updateCounters();


        console.log(
            "Gallery loaded:",
            photos.length,
            "photos,",
            videos.length,
            "videos"
        );


    }

    catch (error) {

        console.error(
            "Gallery loading error:",
            error
        );


        showGalleryError(
            "Unable to load gallery. Please try again."
        );

    }

}


/* ==========================================
   IMAGE CHECK
========================================== */

function isImage(fileName) {

    return (

        fileName.endsWith(".jpg") ||

        fileName.endsWith(".jpeg") ||

        fileName.endsWith(".png") ||

        fileName.endsWith(".webp") ||

        fileName.endsWith(".gif") ||

        fileName.endsWith(".avif")

    );

}


/* ==========================================
   VIDEO CHECK
========================================== */

function isVideo(fileName) {

    return (

        fileName.endsWith(".mp4") ||

        fileName.endsWith(".webm") ||

        fileName.endsWith(".mov") ||

        fileName.endsWith(".m4v")

    );

}


/* ==========================================
   RENDER PHOTOS
========================================== */

function renderPhotos() {

    photoGallery.innerHTML = "";


    if (photos.length === 0) {

        photoGallery.innerHTML =
            `
            <div class="gallery-empty">
                📷 No photos uploaded yet.
            </div>
            `;

        return;

    }


    photos.forEach(
        function (src, index) {

            const img =
                document.createElement(
                    "img"
                );


            img.src = src;

            img.className =
                "gallery-item";

            img.alt =
                "Our memory ❤️";

            img.loading =
                "lazy";

            img.decoding =
                "async";


            /*
             * Open lightbox
             */

            img.addEventListener(
                "click",
                function () {

                    currentItems =
                        photos;

                    currentIndex =
                        index;

                    currentType =
                        "image";

                    openImage();

                }
            );


            /*
             * Loading effect
             */

            img.addEventListener(
                "load",
                function () {

                    img.classList.add(
                        "loaded"
                    );

                }
            );


            photoGallery.appendChild(
                img
            );

        }
    );

}


/* ==========================================
   RENDER VIDEOS
========================================== */

function renderVideos() {

    videoGallery.innerHTML = "";


    if (videos.length === 0) {

        videoGallery.innerHTML =
            `
            <div class="gallery-empty">
                🎥 No videos uploaded yet.
            </div>
            `;

        return;

    }


    videos.forEach(
        function (src, index) {

            const video =
                document.createElement(
                    "video"
                );


            video.src = src;

            video.className =
                "gallery-item";

            video.muted =
                true;

            video.playsInline =
                true;

            video.preload =
                "metadata";


            /*
             * Open lightbox
             */

            video.addEventListener(
                "click",
                function () {

                    currentItems =
                        videos;

                    currentIndex =
                        index;

                    currentType =
                        "video";

                    openVideo();

                }
            );


            videoGallery.appendChild(
                video
            );

        }
    );

}


/* ==========================================
   OPEN IMAGE
========================================== */

function openImage() {

    const src =
        currentItems[currentIndex];


    lightboxVideo.pause();

    lightboxVideo.removeAttribute(
        "src"
    );


    lightboxVideo.style.display =
        "none";


    lightboxImg.style.display =
        "block";


    lightboxImg.style.opacity =
        "0";


    lightbox.style.display =
        "flex";


    lightboxImg.onload =
        function () {

            lightboxImg.style.opacity =
                "1";

        };


    lightboxImg.src =
        src;

}


/* ==========================================
   OPEN VIDEO
========================================== */

function openVideo() {

    const src =
        currentItems[currentIndex];


    lightboxImg.style.display =
        "none";


    lightboxImg.src =
        "";


    lightboxVideo.style.display =
        "block";


    lightbox.style.display =
        "flex";


    lightboxVideo.src =
        src;


    lightboxVideo.load();


    lightboxVideo.play()
        .catch(
            function () {

                console.log(
                    "Video autoplay blocked."
                );

            }
        );

}


/* ==========================================
   CLOSE LIGHTBOX
========================================== */

function closeLightbox() {

    lightbox.style.display =
        "none";


    lightboxImg.src =
        "";


    lightboxVideo.pause();

    lightboxVideo.src =
        "";

}


/* ==========================================
   CLOSE BUTTON
========================================== */

closeBtn.addEventListener(
    "click",
    closeLightbox
);


/* ==========================================
   NEXT
========================================== */

function nextMedia() {

    if (
        currentItems.length === 0
    ) {

        return;

    }


    currentIndex++;


    if (
        currentIndex >=
        currentItems.length
    ) {

        currentIndex = 0;

    }


    if (
        currentType ===
        "image"
    ) {

        openImage();

    }

    else {

        openVideo();

    }

}


nextBtn.addEventListener(
    "click",
    nextMedia
);


/* ==========================================
   PREVIOUS
========================================== */

function previousMedia() {

    if (
        currentItems.length === 0
    ) {

        return;

    }


    currentIndex--;


    if (
        currentIndex < 0
    ) {

        currentIndex =
            currentItems.length - 1;

    }


    if (
        currentType ===
        "image"
    ) {

        openImage();

    }

    else {

        openVideo();

    }

}


prevBtn.addEventListener(
    "click",
    previousMedia
);


/* ==========================================
   ESCAPE
========================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            event.key ===
            "Escape"
        ) {

            closeLightbox();

        }

    }
);


/* ==========================================
   KEYBOARD NAVIGATION
========================================== */

document.addEventListener(
    "keydown",
    function (event) {

        if (
            lightbox.style.display !==
            "flex"
        ) {

            return;

        }


        if (
            event.key ===
            "ArrowRight"
        ) {

            nextMedia();

        }


        if (
            event.key ===
            "ArrowLeft"
        ) {

            previousMedia();

        }

    }
);


/* ==========================================
   CLICK OUTSIDE LIGHTBOX
========================================== */

lightbox.addEventListener(
    "click",
    function (event) {

        if (
            event.target ===
            lightbox
        ) {

            closeLightbox();

        }

    }
);


/* ==========================================
   COUNTERS
========================================== */

function updateCounters() {

    photoCount.textContent =
        photos.length;


    videoCount.textContent =
        videos.length;

}


/* ==========================================
   ERROR
========================================== */

function showGalleryError(
    message
) {

    photoGallery.innerHTML =
        `
        <div class="gallery-empty">
            ❌ ${message}
        </div>
        `;


    videoGallery.innerHTML =
        `
        <div class="gallery-empty">
            ❌ ${message}
        </div>
        `;

}


/* ==========================================
   START GALLERY
========================================== */

loadGallery();