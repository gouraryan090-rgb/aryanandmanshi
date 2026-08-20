// Multiple Attachments Arrays & State
let selectedPhotos = [];
let selectedAudios = [];
let targetDate = "";

let mediaRecorder = null;
let audioChunks = [];

// Clean Formatting Function with Selection Preservation
function formatDoc(cmd, value = null) {
    const editor = document.getElementById("diaryEditor");
    if (!editor) return;

    editor.focus();
    document.execCommand(cmd, false, value);
    updateToolbarState();
}

// Global Event Delegation for Toolbar Buttons
document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    targetDate = urlParams.get("date");

    if (!targetDate) {
        alert("No date selected! Redirecting back...");
        window.location.href = "diary.html";
        return;
    }

    const badge = document.getElementById("selectedDateBadge");
    const title = document.getElementById("editorPageTitle");
    if (badge) badge.innerText = `📅 Date: ${targetDate}`;
    if (title) title.innerText = `Memory for ${targetDate}`;

    loadExistingEntry(targetDate);

    // Dynamic Toolbar Listeners
    const toolbar = document.querySelector('.editor-toolbar');
    if (toolbar) {
        toolbar.addEventListener('mousedown', (e) => {
            const btn = e.target.closest('.tool-btn');
            if (!btn) return;
            
            e.preventDefault(); // Prevents losing text selection in contenteditable
            const cmd = btn.getAttribute('data-cmd');
            if (cmd) {
                formatDoc(cmd);
            }
        });
    }

    // Cursor Movement / Selection Change Sync
    const editor = document.getElementById("diaryEditor");
    if (editor) {
        ['keyup', 'mouseup', 'click', 'input'].forEach(evt => {
            editor.addEventListener(evt, updateToolbarState);
        });
    }
});

// Update active highlight status on buttons
function updateToolbarState() {
    const btns = document.querySelectorAll('.tool-btn[data-cmd]');
    btns.forEach(btn => {
        const cmd = btn.getAttribute('data-cmd');
        try {
            if (document.queryCommandState(cmd)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        } catch (e) {
            btn.classList.remove('active');
        }
    });
}

/* ==========================================
     MULTIPLE PHOTOS HANDLERS
========================================== */
function handleMultiplePhotos(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        selectedPhotos.push(file);
    });
    renderPhotosPreview();
}

function renderPhotosPreview() {
    const container = document.getElementById("photosGalleryPreview");
    if (!container) return;
    container.innerHTML = "";

    selectedPhotos.forEach((file, index) => {
        const src = typeof file === "string" ? file : URL.createObjectURL(file);
        
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "position:relative; display:inline-block;";
        wrapper.innerHTML = `
            <img src="${src}" style="width:80px; height:80px; object-fit:cover; border-radius:8px; border:1px solid #ff8eaa;">
            <button type="button" onclick="removePhoto(${index})" style="position:absolute; top:-5px; right:-5px; background:red; color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:10px;">✕</button>
        `;
        container.appendChild(wrapper);
    });
}

function removePhoto(index) {
    selectedPhotos.splice(index, 1);
    renderPhotosPreview();
}

/* ==========================================
     MULTIPLE AUDIOS & RECORDING HANDLERS
========================================== */
function handleMultipleAudios(event) {
    const files = Array.from(event.target.files);
    files.forEach(file => {
        selectedAudios.push(file);
    });
    renderAudiosPreview();
}

function renderAudiosPreview() {
    const container = document.getElementById("audiosListPreview");
    if (!container) return;
    container.innerHTML = "";

    selectedAudios.forEach((file, index) => {
        const src = typeof file === "string" ? file : URL.createObjectURL(file);
        
        const wrapper = document.createElement("div");
        wrapper.style.cssText = "display:flex; align-items:center; gap:8px; background:rgba(0,0,0,0.3); padding:5px 10px; border-radius:8px;";
        wrapper.innerHTML = `
            <audio controls src="${src}" style="height:30px; max-width:200px;"></audio>
            <button type="button" onclick="removeAudio(${index})" style="background:red; color:white; border:none; border-radius:6px; padding:3px 8px; cursor:pointer; font-size:12px;">✕</button>
        `;
        container.appendChild(wrapper);
    });
}

function removeAudio(index) {
    selectedAudios.splice(index, 1);
    renderAudiosPreview();
}

async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) audioChunks.push(event.data);
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            const recordedFile = new File([audioBlob], `recorded_voice_${Date.now()}.webm`, { type: 'audio/webm' });
            selectedAudios.push(recordedFile);
            renderAudiosPreview();
        };

        mediaRecorder.start();
        document.getElementById("startRecBtn").style.display = "none";
        document.getElementById("stopRecBtn").style.display = "inline-block";
        document.getElementById("recordingStatus").style.display = "inline";
    } catch (err) {
        alert("Microphone access denied!");
    }
}

function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
        mediaRecorder.stop();
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
    }
    document.getElementById("startRecBtn").style.display = "inline-block";
    document.getElementById("stopRecBtn").style.display = "none";
    document.getElementById("recordingStatus").style.display = "none";
}

/* ==========================================
     LOAD & SAVE DATA HANDLERS
========================================== */
async function loadExistingEntry(dateVal) {
    try {
        const { data, error } = await supabaseClient
            .from("diary_entries")
            .select("*")
            .eq("entry_date", dateVal)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            document.getElementById("diaryTitle").value = data.title || "";
            document.getElementById("diaryEditor").innerHTML = data.content || "";
            if (data.author) document.getElementById("diaryAuthor").value = data.author;

            if (data.photo_url) {
                try {
                    selectedPhotos = JSON.parse(data.photo_url);
                } catch(e) {
                    selectedPhotos = [data.photo_url];
                }
                renderPhotosPreview();
            }

            if (data.audio_url) {
                try {
                    selectedAudios = JSON.parse(data.audio_url);
                } catch(e) {
                    selectedAudios = [data.audio_url];
                }
                renderAudiosPreview();
            }
        }
    } catch (err) {
        console.error("Error loading entry:", err);
    }
}

async function saveDiaryEntry() {
    const saveBtn = document.getElementById("saveDiaryBtn");
    const authorVal = document.getElementById("diaryAuthor").value;
    const titleVal = document.getElementById("diaryTitle").value.trim();
    const contentVal = document.getElementById("diaryEditor").innerHTML.trim();

    if (!titleVal || !contentVal) {
        alert("Please write a title and content! ❤️");
        return;
    }

    saveBtn.disabled = true;
    saveBtn.innerText = "⏳ Saving Memory...";

    try {
        // Upload All Photos
        const uploadedPhotoUrls = await Promise.all(selectedPhotos.map(async (file) => {
            if (typeof file === "string") return file;
            const ext = file.name.split('.').pop();
            const fileName = `photo_${targetDate}_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
            const { error } = await supabaseClient.storage.from("gallery").upload(fileName, file);
            if (error) throw error;
            const { data: publicUrlData } = supabaseClient.storage.from("gallery").getPublicUrl(fileName);
            return publicUrlData.publicUrl;
        }));

        // Upload All Audios
        const uploadedAudioUrls = await Promise.all(selectedAudios.map(async (file) => {
            if (typeof file === "string") return file;
            const ext = file.name.split('.').pop();
            const fileName = `audio_${targetDate}_${Date.now()}_${Math.random().toString(36).substring(7)}.${ext}`;
            const { error } = await supabaseClient.storage.from("gallery").upload(fileName, file);
            if (error) throw error;
            const { data: publicUrlData } = supabaseClient.storage.from("gallery").getPublicUrl(fileName);
            return publicUrlData.publicUrl;
        }));

        const { error: dbError } = await supabaseClient
            .from("diary_entries")
            .upsert({
                entry_date: targetDate,
                title: titleVal,
                author: authorVal,
                content: contentVal,
                photo_url: JSON.stringify(uploadedPhotoUrls),
                audio_url: JSON.stringify(uploadedAudioUrls),
                updated_at: new Date()
            }, { onConflict: "entry_date" });

        if (dbError) throw dbError;

        alert("Memory Saved Successfully! ❤️");
        window.location.href = "diary.html";

    } catch (err) {
        console.error("Error saving memory:", err);
        alert("Failed to save memory. Check console.");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = "💾 Save Memory & Return ❤️";
    }
}

/* ==========================================
     IMAGE LIGHTBOX, DOWNLOAD & SHARE
========================================== */
document.addEventListener("click", function (e) {
    if (e.target.tagName === "IMG" && !e.target.classList.contains("image-modal-content")) {
        const imgSrc = e.target.src;

        const modal = document.createElement("div");
        modal.className = "image-modal-overlay";
        modal.innerHTML = `
            <span class="modal-close-btn">&times;</span>
            <img src="${imgSrc}" class="image-modal-content" />
            <div class="image-modal-actions">
                <button class="modal-btn" id="downloadImgBtn">📥 Download</button>
                <button class="modal-btn" id="shareImgBtn">📤 Share</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Close Modal Event
        modal.querySelector(".modal-close-btn").onclick = () => modal.remove();
        modal.onclick = (event) => { if (event.target === modal) modal.remove(); };

        // Download Action
        modal.querySelector("#downloadImgBtn").onclick = () => {
            const a = document.createElement("a");
            a.href = imgSrc;
            a.download = "diary-memory.jpg";
            a.click();
        };

        // Web Share API Action
        modal.querySelector("#shareImgBtn").onclick = async () => {
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: 'Diary Memory',
                        url: imgSrc
                    });
                } catch (err) { console.log('Share canceled'); }
            } else {
                navigator.clipboard.writeText(imgSrc);
                alert("Image link copied to clipboard!");
            }
        };
    }
});