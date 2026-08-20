let selectedPhotoFile = null;
let selectedAudioFile = null;
let currentPhotoUrl = "";
let currentAudioUrl = "";
let targetDate = "";

// Live Recording Variables
let mediaRecorder = null;
let audioChunks = [];

// Text formatting toolbar function (UPDATED FIX)
function formatDoc(cmd, value = null) {
    const editor = document.getElementById("diaryEditor");
    if (!editor) return;

    // Editor ko focus karo
    editor.focus();

    // Command execute karo
    document.execCommand(cmd, false, value);
}

document.addEventListener("DOMContentLoaded", () => {
    const urlParams = new URLSearchParams(window.location.search);
    targetDate = urlParams.get("date");

    if (!targetDate) {
        alert("No date selected! Redirecting back...");
        window.location.href = "diary.html";
        return;
    }

    document.getElementById("selectedDateBadge").innerText = `📅 Date: ${targetDate}`;
    document.getElementById("editorPageTitle").innerText = `Memory for ${targetDate}`;

    loadExistingEntry(targetDate);
});

// Photo Functions
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
    document.getElementById("diaryPhotoInput").value = "";
    document.getElementById("diaryPhotoPreview").src = "";
    document.getElementById("photoPreviewContainer").style.display = "none";
}

// Audio Upload Function
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

// Live Voice Recording Functions
async function startRecording() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                audioChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
            selectedAudioFile = new File([audioBlob], `recorded_voice_${Date.now()}.webm`, { type: 'audio/webm' });

            const audioUrl = URL.createObjectURL(audioBlob);
            document.getElementById("diaryAudioPreview").src = audioUrl;
            document.getElementById("audioPreviewContainer").style.display = "block";
        };

        mediaRecorder.start();
        document.getElementById("startRecBtn").style.display = "none";
        document.getElementById("stopRecBtn").style.display = "inline-block";
        document.getElementById("recordingStatus").style.display = "inline";
    } catch (err) {
        alert("Microphone access denied or not supported on this browser!");
        console.error(err);
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

// Fetch Existing Entry
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

// Save Entry to Supabase
async function saveDiaryEntry() {
    const saveBtn = document.getElementById("saveDiaryBtn");
    const authorVal = document.getElementById("diaryAuthor").value;
    const titleVal = document.getElementById("diaryTitle").value.trim();
    const contentVal = document.getElementById("diaryEditor").innerHTML.trim();

    if (!titleVal || !contentVal) {
        alert("Please write a title and content for this memory! ❤️");
        return;
    }

    saveBtn.disabled = true;
    saveBtn.innerText = "⏳ Saving Memory...";

    try {
        // Upload Photo if new file selected
        if (selectedPhotoFile) {
            const ext = selectedPhotoFile.name.split('.').pop();
            const fileName = `photo_${targetDate}_${Date.now()}.${ext}`;
            const { error } = await supabaseClient.storage
                .from("gallery")
                .upload(fileName, selectedPhotoFile);

            if (error) throw error;

            const { data: publicUrlData } = supabaseClient.storage
                .from("gallery")
                .getPublicUrl(fileName);

            currentPhotoUrl = publicUrlData.publicUrl;
        }

        // Upload Audio (File or Live Recording) if available
        if (selectedAudioFile) {
            const ext = selectedAudioFile.name.split('.').pop();
            const fileName = `audio_${targetDate}_${Date.now()}.${ext}`;
            const { error } = await supabaseClient.storage
                .from("gallery")
                .upload(fileName, selectedAudioFile);

            if (error) throw error;

            const { data: publicUrlData } = supabaseClient.storage
                .from("gallery")
                .getPublicUrl(fileName);

            currentAudioUrl = publicUrlData.publicUrl;
        }

        // Upsert into Supabase Table
        const { error: dbError } = await supabaseClient
            .from("couple_diary")
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

        alert("Memory Saved Successfully! ❤️ Redirecting to Diary List...");
        window.location.href = "diary.html";

    } catch (err) {
        console.error("Error saving memory:", err);
        alert("Failed to save memory. Please check your storage & table permissions.");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = "💾 Save Memory & Return ❤️";
    }
}