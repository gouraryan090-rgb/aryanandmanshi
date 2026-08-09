/* ==========================================
   MEDIA MANAGER
========================================== */


/* ==========================================
   ELEMENTS
========================================== */

const mediaFileInput =
    document.getElementById("mediaFileInput");

const selectedMedia =
    document.getElementById("selectedMedia");

const mediaPreview =
    document.getElementById("mediaPreview");

const mediaFileName =
    document.getElementById("mediaFileName");

const mediaFileSize =
    document.getElementById("mediaFileSize");

const uploadMediaBtn =
    document.getElementById("uploadMediaBtn");

const uploadProgressContainer =
    document.getElementById(
        "uploadProgressContainer"
    );

const uploadProgressBar =
    document.getElementById(
        "uploadProgressBar"
    );

const uploadProgressText =
    document.getElementById(
        "uploadProgressText"
    );

const uploadStatus =
    document.getElementById(
        "uploadStatus"
    );

const mediaLibrary =
    document.getElementById(
        "mediaLibrary"
    );


let selectedFile = null;


/* ==========================================
   FILE SIZE
========================================== */

function formatFileSize(bytes) {

    if (bytes < 1024) {

        return bytes + " B";

    }


    if (bytes < 1024 * 1024) {

        return (
            (bytes / 1024).toFixed(1) +
            " KB"
        );

    }


    return (
        (bytes / (1024 * 1024))
            .toFixed(2) +
        " MB"
    );

}


/* ==========================================
   FILE SELECT
========================================== */

mediaFileInput.addEventListener(
    "change",
    function () {

        console.log(
            "File selected"
        );


        const file =
            mediaFileInput.files[0];


        if (!file) {

            return;

        }


        selectedFile =
            file;


        mediaFileName.textContent =
            file.name;


        mediaFileSize.textContent =
            formatFileSize(
                file.size
            );


        selectedMedia.style.display =
            "flex";


        uploadMediaBtn.disabled =
            false;


        uploadStatus.textContent =
            "";


        mediaPreview.innerHTML =
            "";


        const previewURL =
            URL.createObjectURL(
                file
            );


        if (
            file.type.startsWith(
                "image/"
            )
        ) {

            const img =
                document.createElement(
                    "img"
                );


            img.src =
                previewURL;


            img.alt =
                "Selected image";


            mediaPreview.appendChild(
                img
            );

        }


        else if (
            file.type.startsWith(
                "video/"
            )
        ) {

            const video =
                document.createElement(
                    "video"
                );


            video.src =
                previewURL;


            video.controls =
                true;


            video.muted =
                true;


            mediaPreview.appendChild(
                video
            );

        }


        else {

            mediaPreview.textContent =
                "📄";

        }

    }
);


/* ==========================================
   UPLOAD MEDIA
========================================== */

async function uploadMedia() {

    console.log(
        "UPLOAD BUTTON CLICKED"
    );


    if (!selectedFile) {

        uploadStatus.textContent =
            "❌ Please select a file first.";

        return;

    }


    if (
        typeof supabaseClient ===
        "undefined"
    ) {

        uploadStatus.textContent =
            "❌ Supabase is not connected.";

        console.error(
            "supabaseClient is not defined."
        );

        return;

    }


    uploadMediaBtn.disabled =
        true;


    uploadProgressContainer.style.display =
        "block";


    uploadProgressBar.style.width =
        "10%";


    uploadProgressText.textContent =
        "Preparing upload...";


    uploadStatus.textContent =
        "";


    try {

        const extension =
            selectedFile.name
                .split(".")
                .pop()
                .toLowerCase();


        const fileName =
            Date.now() +
            "_" +
            Math.random()
                .toString(36)
                .substring(2, 10) +
            "." +
            extension;


        console.log(
            "Uploading file:",
            fileName
        );


        uploadProgressBar.style.width =
            "30%";


        uploadProgressText.textContent =
            "Uploading...";


        const {
            data,
            error
        } =
            await supabaseClient
                .storage
                .from("gallery")
                .upload(
                    fileName,
                    selectedFile,
                    {
                        cacheControl:
                            "3600",

                        upsert:
                            false,

                        contentType:
                            selectedFile.type
                    }
                );


        if (error) {

            throw error;

        }


        console.log(
            "UPLOAD SUCCESS:",
            data
        );


        uploadProgressBar.style.width =
            "100%";


        uploadProgressText.textContent =
            "Upload complete!";


        uploadStatus.textContent =
            "✅ Media uploaded successfully!";


        uploadStatus.classList.add(
            "success"
        );


        /* Refresh media library */

        await loadMediaLibrary();


        /* Reset upload */

        setTimeout(
            function () {

                mediaFileInput.value =
                    "";

                selectedFile =
                    null;

                selectedMedia.style.display =
                    "none";

                mediaPreview.innerHTML =
                    "";

                uploadMediaBtn.disabled =
                    true;

                uploadProgressContainer.style.display =
                    "none";

                uploadProgressBar.style.width =
                    "0%";

            },
            1200
        );

    }


    catch (error) {

        console.error(
            "UPLOAD ERROR:",
            error
        );


        uploadProgressContainer.style.display =
            "none";


        uploadProgressBar.style.width =
            "0%";


        uploadStatus.textContent =
            "❌ Upload failed: " +
            (
                error.message ||
                "Unknown error"
            );


        uploadMediaBtn.disabled =
            false;

    }

}


/* ==========================================
   LOAD MEDIA LIBRARY
========================================== */

async function loadMediaLibrary() {

    if (
        !mediaLibrary
    ) {

        return;

    }


    mediaLibrary.innerHTML =
        `
        <div class="media-library-loading">
            Loading media...
        </div>
        `;


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .storage
                .from("gallery")
                .list(
                    "",
                    {
                        limit: 1000,
                        offset: 0,
                        sortBy: {
                            column:
                                "created_at",
                            order:
                                "desc"
                        }
                    }
                );


        if (error) {

            throw error;

        }


        mediaLibrary.innerHTML =
            "";


        if (
            !data ||
            data.length === 0
        ) {

            mediaLibrary.innerHTML =
                `
                <div class="media-library-empty">
                    📂 No media uploaded yet.
                </div>
                `;

            return;

        }


        data.forEach(
            function (file) {

                if (
                    !file.name ||
                    file.name ===
                    ".emptyfolderplaceholder"
                ) {

                    return;

                }


                createMediaCard(
                    file
                );

            }
        );

    }


    catch (error) {

        console.error(
            "MEDIA LIBRARY ERROR:",
            error
        );


        mediaLibrary.innerHTML =
            `
            <div class="media-library-empty">
                ❌ Failed to load media.
            </div>
            `;

    }

}


/* ==========================================
   CREATE MEDIA CARD
========================================== */

function createMediaCard(
    file
) {

    const fileName =
        file.name;


    const lowerName =
        fileName.toLowerCase();


    const {
        data
    } =
        supabaseClient
            .storage
            .from("gallery")
            .getPublicUrl(
                fileName
            );


    const publicURL =
        data.publicUrl;


    const card =
        document.createElement(
            "div"
        );


    card.className =
        "media-library-card";


    /* ==================================
       PREVIEW
    ================================== */

    const preview =
        document.createElement(
            "div"
        );


    preview.className =
        "media-library-preview";


    if (
        isImageFile(
            lowerName
        )
    ) {

        const img =
            document.createElement(
                "img"
            );


        img.src =
            publicURL;


        img.alt =
            fileName;


        preview.appendChild(
            img
        );

    }


    else if (
        isVideoFile(
            lowerName
        )
    ) {

        const video =
            document.createElement(
                "video"
            );


        video.src =
            publicURL;


        video.muted =
            true;


        video.preload =
            "metadata";


        preview.appendChild(
            video
        );

    }


    else {

        preview.textContent =
            "📄";

    }


    /* ==================================
       INFO
    ================================== */

    const info =
        document.createElement(
            "div"
        );


    info.className =
        "media-library-info";


    const name =
        document.createElement(
            "div"
        );


    name.className =
        "media-library-name";


    name.textContent =
        fileName;


    info.appendChild(
        name
    );


    /* ==================================
       DELETE BUTTON
    ================================== */

    const deleteBtn =
        document.createElement(
            "button"
        );


    deleteBtn.type =
        "button";


    deleteBtn.className =
        "media-delete-btn";


    deleteBtn.innerHTML =
        "🗑️ Delete";


    deleteBtn.addEventListener(
        "click",
        function () {

            deleteMedia(
                fileName,
                card
            );

        }
    );


    info.appendChild(
        deleteBtn
    );


    card.appendChild(
        preview
    );


    card.appendChild(
        info
    );


    mediaLibrary.appendChild(
        card
    );

}


/* ==========================================
   IMAGE CHECK
========================================== */

function isImageFile(
    fileName
) {

    return (

        fileName.endsWith(
            ".jpg"
        ) ||

        fileName.endsWith(
            ".jpeg"
        ) ||

        fileName.endsWith(
            ".png"
        ) ||

        fileName.endsWith(
            ".webp"
        ) ||

        fileName.endsWith(
            ".gif"
        ) ||

        fileName.endsWith(
            ".avif"
        )

    );

}


/* ==========================================
   VIDEO CHECK
========================================== */

function isVideoFile(
    fileName
) {

    return (

        fileName.endsWith(
            ".mp4"
        ) ||

        fileName.endsWith(
            ".webm"
        ) ||

        fileName.endsWith(
            ".mov"
        ) ||

        fileName.endsWith(
            ".m4v"
        )

    );

}


/* ==========================================
   DELETE MEDIA
========================================== */

async function deleteMedia(
    fileName,
    card
) {

    const confirmed =
        confirm(
            `Delete "${fileName}"?\n\nThis will permanently remove the file from the gallery.`
        );


    if (!confirmed) {

        return;

    }


    try {

        card.style.opacity =
            "0.5";


        const {
            error
        } =
            await supabaseClient
                .storage
                .from("gallery")
                .remove([
                    fileName
                ]);


        if (error) {

            throw error;

        }


        card.remove();


        uploadStatus.textContent =
            "🗑️ Media deleted successfully.";


        uploadStatus.classList.add(
            "success"
        );


        /*
         * Check if library is empty
         */

        if (
            mediaLibrary.children.length ===
            0
        ) {

            mediaLibrary.innerHTML =
                `
                <div class="media-library-empty">
                    📂 No media uploaded yet.
                </div>
                `;

        }

    }


    catch (error) {

        console.error(
            "DELETE ERROR:",
            error
        );


        card.style.opacity =
            "1";


        uploadStatus.textContent =
            "❌ Delete failed: " +
            (
                error.message ||
                "Unknown error"
            );

    }

}


/* ==========================================
   LOAD ON PAGE OPEN
========================================== */

loadMediaLibrary();