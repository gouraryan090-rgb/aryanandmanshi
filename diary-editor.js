let selectedPhotoFile = null;
let selectedAudioFile = null;
let currentPhotoUrl = "";
let currentAudioUrl = "";
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

// Media Preview & Recording Handlers
function previewDiaryPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        selectedPhotoFile = file;
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("diaryPhotoPreview").src = e.target.result;
            document.getElementById("photoPreviewContainer").style.display = "block";
        };
        reader.readAsDataURL(file);
    }
}

function removeDiaryPhoto() {
    selectedPhotoFile = null;
    currentPhotoUrl = "";
    const input = document.getElementById("diaryPhotoInput");
    if (input) input.value = "";
    document.getElementById("diaryPhotoPreview").src = "";
    document.getElementById("photoPreviewContainer").style.display = "none";
}

function previewDiaryAudio(event) {
    const file = event.target.files[0];
    if (file) {
        selectedAudioFile = file;
        const reader = new FileReader();
        reader.onload = function (e) {
            document.getElementById("diaryAudioPreview").src = e.target.result;
            document.getElementById("audioPreviewContainer").style.display = "block";
        };
        reader.readAsDataURL(file);
    }
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
            selectedAudioFile = new File([audioBlob], `recorded_voice_${Date.now()}.webm`, { type: 'audio/webm' });
            document.getElementById("diaryAudioPreview").src = URL.createObjectURL(audioBlob);
            document.getElementById("audioPreviewContainer").style.display = "block";
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

function removeDiaryAudio() {
    selectedAudioFile = null;
    currentAudioUrl = "";
    const audioInput = document.getElementById("diaryAudioInput");
    if (audioInput) audioInput.value = "";
    document.getElementById("diaryAudioPreview").src = "";
    document.getElementById("audioPreviewContainer").style.display = "none";
}

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
                currentPhotoUrl = data.photo_url;
                document.getElementById("diaryPhotoPreview").src = data.photo_url;
                document.getElementById("photoPreviewContainer").style.display = "block";
            }

            if (data.audio_url) {
                currentAudioUrl = data.audio_url;
                document.getElementById("diaryAudioPreview").src = data.audio_url;
                document.getElementById("audioPreviewContainer").style.display = "block";
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
        if (selectedPhotoFile) {
            const ext = selectedPhotoFile.name.split('.').pop();
            const fileName = `photo_${targetDate}_${Date.now()}.${ext}`;
            const { error } = await supabaseClient.storage.from("gallery").upload(fileName, selectedPhotoFile);
            if (error) throw error;
            const { data: publicUrlData } = supabaseClient.storage.from("gallery").getPublicUrl(fileName);
            currentPhotoUrl = publicUrlData.publicUrl;
        }

        if (selectedAudioFile) {
            const ext = selectedAudioFile.name.split('.').pop();
            const fileName = `audio_${targetDate}_${Date.now()}.${ext}`;
            const { error } = await supabaseClient.storage.from("gallery").upload(fileName, selectedAudioFile);
            if (error) throw error;
            const { data: publicUrlData } = supabaseClient.storage.from("gallery").getPublicUrl(fileName);
            currentAudioUrl = publicUrlData.publicUrl;
        }

        const { error: dbError } = await supabaseClient
            .from("diary_entries")
            .upsert({
                entry_date: targetDate,
                title: titleVal,
                author: authorVal,
                content: contentVal,
                photo_url: currentPhotoUrl,
                audio_url: currentAudioUrl,
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