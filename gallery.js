/* ==========================================
   OUR GALLERY ❤️
   SUPABASE STORAGE VERSION WITH CUSTOM MODALS + DOWNLOAD/SHARE/ZOOM
========================================== */


/* ==========================================
   ELEMENTS
========================================== */

const photoGallery = document.getElementById("photoGallery");
const videoGallery = document.getElementById("videoGallery");
const photoCount = document.getElementById("photoCount");
const videoCount = document.getElementById("videoCount");

const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxVideo = document.getElementById("lightboxVideo");
const closeBtn = document.getElementById("closeBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");


/* ==========================================
   VARIABLES
========================================== */

let photos = [];
let videos = [];
let currentItems = [];
let currentIndex = 0;
let currentType = "image";
let fileToDelete = null; // Store file name temporarily for deletion

// Zoom & Drag Variables
let scale = 1;
let pointX = 0;
let pointY = 0;
let startX = 0;
let startY = 0;
let isDragging = false;
let initialDistance = 0;


/* ==========================================
   SUPABASE CHECK
========================================== */

if (typeof supabaseClient === "undefined") {
    console.error("Supabase client not found.");
    showGalleryError("Unable to connect to gallery.");
}


/* ==========================================
   LOAD GALLERY
========================================== */

async function loadGallery() {
    try {
        console.log("Loading gallery...");

        const { data, error } = await supabaseClient
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

        if (error) throw error;

        if (!data) {
            updateCounters();
            return;
        }

        photoGallery.innerHTML = "";
        videoGallery.innerHTML = "";
        photos = [];
        videos = [];

        data.forEach(function (file) {
            if (!file.name || file.name === ".emptyfolderplaceholder") return;

            const fileName = file.name.toLowerCase();
            const result = supabaseClient.storage.from("gallery").getPublicUrl(file.name);
            const publicURL = result.data.publicUrl;

            if (isImage(fileName)) {
                photos.push(publicURL);
            } else if (isVideo(fileName)) {
                videos.push(publicURL);
            }
        });

        renderPhotos();
        renderVideos();
        updateCounters();

    } catch (error) {
        console.error("Gallery loading error:", error);
        showGalleryError("Unable to load gallery. Please try again.");
    }
}


/* ==========================================
   FILE CHECKS
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
        photoGallery.innerHTML = `
        <div class="gallery-empty">
            📷 No photos uploaded yet.
        </div>
        `;
        return;
    }

    photos.forEach(function (src, index) {
        const img = document.createElement("img");
        img.src = src;
        img.className = "gallery-item";
        img.alt = "Our memory ❤️";
        img.loading = "lazy";
        img.decoding = "async";

        img.addEventListener("click", function () {
            currentItems = photos;
            currentIndex = index;
            currentType = "image";
            openImage();
        });

        img.addEventListener("load", function () {
            img.classList.add("loaded");
        });

        photoGallery.appendChild(img);
    });
}


/* ==========================================
   RENDER VIDEOS
========================================== */

function renderVideos() {
    videoGallery.innerHTML = "";

    if (videos.length === 0) {
        videoGallery.innerHTML = `
        <div class="gallery-empty">
            🎥 No videos uploaded yet.
        </div>
        `;
        return;
    }

    videos.forEach(function (src, index) {
        const video = document.createElement("video");
        video.src = src;
        video.className = "gallery-item";
        video.muted = true;
        video.playsInline = true;
        video.preload = "metadata";

        video.addEventListener("click", function () {
            currentItems = videos;
            currentIndex = index;
            currentType = "video";
            openVideo();
        });

        videoGallery.appendChild(video);
    });
}


/* ==========================================
   LIGHTBOX CONTROLS WITH ZOOM & PAN RESET
========================================== */

function resetZoom() {
    scale = 1;
    pointX = 0;
    pointY = 0;
    if (lightboxImg) {
        lightboxImg.style.transform = `translate(0px, 0px) scale(1)`;
        lightboxImg.style.cursor = "grab";
    }
}

function updateTransform() {
    if (lightboxImg) {
        lightboxImg.style.transform = `translate(${pointX}px, ${pointY}px) scale(${scale})`;
    }
}

function openImage() {
    const src = currentItems[currentIndex];

    lightboxVideo.pause();
    lightboxVideo.removeAttribute("src");
    lightboxVideo.style.display = "none";

    resetZoom();

    lightboxImg.style.display = "block";
    lightboxImg.style.opacity = "0";

    lightbox.style.display = "flex";

    lightboxImg.onload = function () {
        lightboxImg.style.opacity = "1";
    };

    lightboxImg.src = src;
}

function openVideo() {
    const src = currentItems[currentIndex];

    lightboxImg.style.display = "none";
    lightboxImg.src = "";

    lightboxVideo.style.display = "block";
    lightbox.style.display = "flex";

    lightboxVideo.src = src;
    lightboxVideo.load();

    lightboxVideo.play().catch(function () {
        console.log("Autoplay prevented.");
    });
}

function closeLightbox() {
    lightbox.style.display = "none";
    lightboxImg.src = "";

    lightboxVideo.pause();
    lightboxVideo.src = "";
    resetZoom();
}

if (closeBtn) closeBtn.addEventListener("click", closeLightbox);

function nextMedia() {
    if (currentItems.length === 0) return;

    currentIndex++;
    if (currentIndex >= currentItems.length) {
        currentIndex = 0;
    }

    if (currentType === "image") {
        openImage();
    } else {
        openVideo();
    }
}

if (nextBtn) nextBtn.addEventListener("click", nextMedia);

function previousMedia() {
    if (currentItems.length === 0) return;

    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = currentItems.length - 1;
    }

    if (currentType === "image") {
        openImage();
    } else {
        openVideo();
    }
}

if (prevBtn) prevBtn.addEventListener("click", previousMedia);

document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeLightbox();
    if (lightbox.style.display !== "flex") return;
    if (event.key === "ArrowRight") nextMedia();
    if (event.key === "ArrowLeft") previousMedia();
});

if (lightbox) {
    lightbox.addEventListener("click", function (event) {
        if (event.target === lightbox) closeLightbox();
    });
}


/* ==========================================
   ZOOM & DRAG LOGIC (MOUSE + TOUCH)
========================================== */

if (lightboxImg) {
    lightboxImg.addEventListener("wheel", function (e) {
        e.preventDefault();
        const delta = e.deltaY < 0 ? 0.25 : -0.25;
        scale = Math.min(Math.max(1, scale + delta), 4);
        if (scale === 1) {
            pointX = 0;
            pointY = 0;
        }
        updateTransform();
    }, { passive: false });

    lightboxImg.addEventListener("mousedown", function (e) {
        if (scale <= 1) return;
        isDragging = true;
        startX = e.clientX - pointX;
        startY = e.clientY - pointY;
        lightboxImg.style.cursor = "grabbing";
    });

    window.addEventListener("mousemove", function (e) {
        if (!isDragging) return;
        pointX = e.clientX - startX;
        pointY = e.clientY - startY;
        updateTransform();
    });

    window.addEventListener("mouseup", function () {
        isDragging = false;
        if (lightboxImg) lightboxImg.style.cursor = "grab";
    });

    lightboxImg.addEventListener("touchstart", function (e) {
        if (e.touches.length === 1 && scale > 1) {
            isDragging = true;
            startX = e.touches[0].clientX - pointX;
            startY = e.touches[0].clientY - pointY;
        } else if (e.touches.length === 2) {
            isDragging = false;
            initialDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
        }
    }, { passive: true });

    lightboxImg.addEventListener("touchmove", function (e) {
        if (e.touches.length === 1 && isDragging) {
            e.preventDefault();
            pointX = e.touches[0].clientX - startX;
            pointY = e.touches[0].clientY - startY;
            updateTransform();
        } else if (e.touches.length === 2) {
            e.preventDefault();
            const currentDistance = Math.hypot(
                e.touches[0].clientX - e.touches[1].clientX,
                e.touches[0].clientY - e.touches[1].clientY
            );
            const factor = currentDistance / initialDistance;
            scale = Math.min(Math.max(1, scale * factor), 4);
            initialDistance = currentDistance;
            if (scale === 1) {
                pointX = 0;
                pointY = 0;
            }
            updateTransform();
        }
    }, { passive: false });

    lightboxImg.addEventListener("touchend", function (e) {
        if (e.touches.length < 1) {
            isDragging = false;
        }
    });
}


/* ==========================================
   DOWNLOAD & SHARE LOGIC
========================================== */

// 1. Download Media File
async function downloadCurrentMedia() {
    if (!currentItems || currentItems.length === 0) return;
    const url = currentItems[currentIndex];
    const dlBtn = document.getElementById("downloadBtn");

    if (dlBtn) dlBtn.textContent = "⏳ Downloading...";

    try {
        const response = await fetch(url);
        const blob = await response.blob();
        const blobUrl = URL.createObjectURL(blob);

        const ext = currentType === "image" ? "jpg" : "mp4";
        const filename = `gallery_memory_${Date.now()}.${ext}`;

        const a = document.createElement("a");
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => URL.revokeObjectURL(blobUrl), 10000);

    } catch (err) {
        console.error("Download failed, opening direct link:", err);
        window.open(url, "_blank");
    } finally {
        if (dlBtn) dlBtn.textContent = "⬇️ Download";
    }
}

// 2. Share Media File (Native Mobile Share for WhatsApp, Drive, Insta, etc.)
async function shareCurrentMedia() {
    if (!currentItems || currentItems.length === 0) return;
    const url = currentItems[currentIndex];

    if (navigator.share) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const ext = currentType === "image" ? "jpg" : "mp4";
            const file = new File([blob], `memory.${ext}`, { type: blob.type });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                await navigator.share({
                    title: "Our Memory ❤️",
                    text: "Check out this memory from our gallery! ❤️",
                    files: [file]
                });
                return;
            } else {
                await navigator.share({
                    title: "Our Memory ❤️",
                    text: "Check out this memory from our gallery! ❤️",
                    url: url
                });
                return;
            }
        } catch (err) {
            if (err.name !== "AbortError") {
                console.log("Web share fallback:", err);
                openCustomShareModal();
            }
            return;
        }
    }

    openCustomShareModal();
}

function openCustomShareModal() {
    const modal = document.getElementById("customShareModal");
    if (modal) modal.style.display = "flex";
}

function closeShareModal() {
    const modal = document.getElementById("customShareModal");
    const status = document.getElementById("shareStatus");
    if (modal) modal.style.display = "none";
    if (status) status.textContent = "";
}

function shareToWhatsApp() {
    const url = currentItems[currentIndex];
    const text = encodeURIComponent(`Check out this memory from our gallery! ❤️\n${url}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
    closeShareModal();
}

function copyMediaLink() {
    const url = currentItems[currentIndex];
    const status = document.getElementById("shareStatus");

    navigator.clipboard.writeText(url).then(() => {
        if (status) status.textContent = "✅ Link copied to clipboard!";
        setTimeout(closeShareModal, 1500);
    }).catch(() => {
        if (status) status.textContent = "❌ Failed to copy link.";
    });
}


/* ==========================================
   COUNTERS
========================================== */

function updateCounters() {
    if (photoCount) {
        photoCount.textContent = photos.length;
    }

    if (videoCount) {
        videoCount.textContent = videos.length;
    }
}


/* ==========================================
   ERROR
========================================== */

function showGalleryError(message) {
    if (photoGallery) {
        photoGallery.innerHTML = `
            <div class="gallery-empty">
                ❌ ${message}
            </div>
            `;
    }

    if (videoGallery) {
        videoGallery.innerHTML = `
            <div class="gallery-empty">
                ❌ ${message}
            </div>
            `;
    }
}


/* ==========================================
   MANAGE MEDIA MODAL LOGIC
========================================== */

function openMediaModal() {
    const modal = document.getElementById("manageMediaModal");
    if (modal) {
        modal.style.display = "flex";
        renderModalMediaList();
    }
}

function closeMediaModal() {
    const modal = document.getElementById("manageMediaModal");
    if (modal) {
        modal.style.display = "none";
    }
}

async function renderModalMediaList() {
    const listContainer = document.getElementById("modalMediaList");
    if (!listContainer) return;

    listContainer.innerHTML = "<p style='color: #cbd5e1; grid-column: 1/-1;'>Loading media... ⏳</p>";

    try {
        const { data, error } = await supabaseClient
            .storage
            .from("gallery")
            .list("", { limit: 100 });

        if (error) throw error;

        listContainer.innerHTML = "";

        if (!data || data.length === 0) {
            listContainer.innerHTML = "<p style='color: #cbd5e1; grid-column: 1/-1;'>No media found.</p>";
            return;
        }

        data.forEach((file) => {
            if (!file.name || file.name === ".emptyfolderplaceholder") return;

            const publicURL = supabaseClient
                .storage
                .from("gallery")
                .getPublicUrl(file.name).data.publicUrl;

            const isVid = isVideo(file.name.toLowerCase());

            const itemWrapper = document.createElement("div");
            itemWrapper.style.cssText = "position: relative; border-radius: 10px; overflow: hidden; height: 85px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1);";

            if (isVid) {
                itemWrapper.innerHTML = `<video src="${publicURL}" style="width:100%; height:100%; object-fit:cover;"></video>`;
            } else {
                itemWrapper.innerHTML = `<img src="${publicURL}" style="width:100%; height:100%; object-fit:cover;">`;
            }

            const delBtn = document.createElement("button");
            delBtn.innerHTML = "🗑️";
            delBtn.title = "Delete media";
            delBtn.style.cssText = "position: absolute; top: 4px; right: 4px; background: rgba(239, 68, 68, 0.9); border: none; border-radius: 50%; width: 24px; height: 24px; color: #fff; font-size: 11px; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 5px rgba(0,0,0,0.4);";

            delBtn.onclick = () => {
                showDeleteConfirmModal(file.name);
            };

            itemWrapper.appendChild(delBtn);
            listContainer.appendChild(itemWrapper);
        });

    } catch (err) {
        console.error("Error fetching modal media list:", err);
        listContainer.innerHTML = "<p style='color: #f87171; grid-column: 1/-1;'>Failed to load media list.</p>";
    }
}


/* ==========================================
   CUSTOM DELETE CONFIRMATION LOGIC
========================================== */

function showDeleteConfirmModal(fileName) {
    fileToDelete = fileName;
    const confirmModal = document.getElementById("deleteConfirmModal");
    if (confirmModal) {
        confirmModal.style.display = "flex";
    }
}

function closeDeleteConfirmModal() {
    fileToDelete = null;
    const confirmModal = document.getElementById("deleteConfirmModal");
    if (confirmModal) {
        confirmModal.style.display = "none";
    }
}

const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
if (confirmDeleteBtn) {
    confirmDeleteBtn.onclick = async () => {
        if (fileToDelete) {
            confirmDeleteBtn.disabled = true;
            confirmDeleteBtn.textContent = "Deleting... ⏳";

            await deleteMediaFile(fileToDelete);

            confirmDeleteBtn.disabled = false;
            confirmDeleteBtn.textContent = "Delete";
            closeDeleteConfirmModal();
        }
    };
}

async function deleteMediaFile(fileName) {
    try {
        const { error } = await supabaseClient
            .storage
            .from("gallery")
            .remove([fileName]);

        if (error) throw error;

        await loadGallery();
        renderModalMediaList();
    } catch (err) {
        alert("Delete failed: " + err.message);
    }
}


/* ==========================================
   UPLOAD MEDIA FROM MODAL
========================================== */

async function uploadMediaFromModal(event) {
    const file = event.target.files[0];
    const statusText = document.getElementById("modalUploadStatus");
    const uploadBtn = document.getElementById("modalUploadBtn");

    if (!file) return;

    statusText.textContent = "Uploading... ⏳";
    statusText.style.color = "#ff8eaa";
    uploadBtn.disabled = true;

    try {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 7)}.${fileExt}`;

        const { error } = await supabaseClient
            .storage
            .from("gallery")
            .upload(fileName, file);

        if (error) throw error;

        statusText.textContent = "✨ Uploaded successfully! ❤️";
        statusText.style.color = "#4ade80";

        event.target.value = "";
        await loadGallery();
        renderModalMediaList();

        setTimeout(() => {
            statusText.textContent = "";
            uploadBtn.disabled = false;
        }, 2000);

    } catch (err) {
        statusText.textContent = "❌ Failed: " + err.message;
        statusText.style.color = "#f87171";
        uploadBtn.disabled = false;
    }
}


/* ==========================================
   START GALLERY
========================================== */

loadGallery();