let selectedPhotoFile = null;
let selectedAudioFile = null;
let currentPhotoUrl = "";
let currentAudioUrl = "";

// Text formatting toolbar function
function formatDoc(cmd, value = null) {
    const editor = document.getElementById("diaryEditor");
    if (!editor) return;

    editor.focus();
    document.execCommand(cmd, false, value);
}

// Initialize on DOM Ready
document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("diaryDate");
    if (dateInput) {
        // Set default date to today
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;

        // Load entry for today
        loadDiaryEntry(today);

        // Event listener for date change
        dateInput.addEventListener("change", (e) => {
            loadDiaryEntry(e.target.value);
        });
    }
});

// Preview selected Photo
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

// Remove Photo Preview
function removeDiaryPhoto() {
    selectedPhotoFile = null;
    currentPhotoUrl = "";
    const photoInput = document.getElementById("diaryPhotoInput");
    if (photoInput) photoInput.value = "";
    document.getElementById("diaryPhotoPreview").src = "";
    document.getElementById("photoPreviewContainer").style.display = "none";
}

// Preview selected Audio
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

// Remove Audio Preview
function removeDiaryAudio() {
    selectedAudioFile = null;
    currentAudioUrl = "";
    const audioInput = document.getElementById("diaryAudioInput");
    if (audioInput) audioInput.value = "";
    document.getElementById("diaryAudioPreview").src = "";
    document.getElementById("audioPreviewContainer").style.display = "none";
}

// Load Diary Entry by Date (Fixed Table Name)
async function loadDiaryEntry(selectedDate) {
    const statusBadge = document.getElementById("dateStatusBadge");
    if (statusBadge) statusBadge.innerText = "🔄 Loading...";

    // Reset fields
    const titleInput = document.getElementById("diaryTitle");
    const editorInput = document.getElementById("diaryEditor");
    if (titleInput) titleInput.value = "";
    if (editorInput) editorInput.innerHTML = "";
    
    removeDiaryPhoto();
    removeDiaryAudio();

    try {
        const { data, error } = await supabaseClient
            .from("diary_entries")
            .select("*")
            .eq("entry_date", selectedDate)
            .maybeSingle();

        if (error) throw error;

        if (data) {
            if (titleInput) titleInput.value = data.title || "";
            if (editorInput) editorInput.innerHTML = data.content || "";
            if (data.author) {
                const authorSelect = document.getElementById("diaryAuthor");
                if (authorSelect) authorSelect.value = data.author;
            }

            // Load saved Photo
            if (data.photo_url) {
                currentPhotoUrl = data.photo_url;
                document.getElementById("diaryPhotoPreview").src = data.photo_url;
                document.getElementById("photoPreviewContainer").style.display = "block";
            }

            // Load saved Audio
            if (data.audio_url) {
                currentAudioUrl = data.audio_url;
                document.getElementById("diaryAudioPreview").src = data.audio_url;
                document.getElementById("audioPreviewContainer").style.display = "block";
            }

            if (statusBadge) statusBadge.innerText = "✨ Memory Found";
            const lastSavedInfo = document.getElementById("lastSavedInfo");
            if (lastSavedInfo) lastSavedInfo.innerText = `Last saved: ${new Date(data.updated_at).toLocaleTimeString()}`;
        } else {
            if (statusBadge) statusBadge.innerText = "📝 New Memory Page";
            const lastSavedInfo = document.getElementById("lastSavedInfo");
            if (lastSavedInfo) lastSavedInfo.innerText = "Not saved yet";
        }
    } catch (err) {
        console.error("Error loading entry:", err);
        if (statusBadge) statusBadge.innerText = "❌ Error Loading";
    }
}

// Save Diary Entry (Fixed Table Name)
async function saveDiaryEntry() {
    const saveBtn = document.getElementById("saveDiaryBtn");
    const dateVal = document.getElementById("diaryDate").value;
    const authorVal = document.getElementById("diaryAuthor").value;
    const titleVal = document.getElementById("diaryTitle").value.trim();
    const contentVal = document.getElementById("diaryEditor").innerHTML.trim();

    if (!dateVal || !titleVal || !contentVal) {
        alert("Please enter a title and diary content! ❤️");
        return;
    }

    saveBtn.disabled = true;
    saveBtn.innerText = "⏳ Saving Memory...";

    try {
        // Upload Photo if new file is chosen
        if (selectedPhotoFile) {
            const fileName = `photo_${dateVal}_${Date.now()}.${selectedPhotoFile.name.split('.').pop()}`;
            const { error } = await supabaseClient.storage
                .from("gallery")
                .upload(fileName, selectedPhotoFile);

            if (error) throw error;

            const { data: publicUrlData } = supabaseClient.storage
                .from("gallery")
                .getPublicUrl(fileName);

            currentPhotoUrl = publicUrlData.publicUrl;
        }

        // Upload Audio if new file is chosen
        if (selectedAudioFile) {
            const fileName = `audio_${dateVal}_${Date.now()}.${selectedAudioFile.name.split('.').pop()}`;
            const { error } = await supabaseClient.storage
                .from("gallery")
                .upload(fileName, selectedAudioFile);

            if (error) throw error;

            const { data: publicUrlData } = supabaseClient.storage
                .from("gallery")
                .getPublicUrl(fileName);

            currentAudioUrl = publicUrlData.publicUrl;
        }

        // Upsert record into Supabase Table 'diary_entries'
        const { error: dbError } = await supabaseClient
            .from("diary_entries")
            .upsert({
                entry_date: dateVal,
                title: titleVal,
                author: authorVal,
                content: contentVal,
                photo_url: currentPhotoUrl,
                audio_url: currentAudioUrl,
                updated_at: new Date()
            }, { onConflict: "entry_date" });

        if (dbError) throw dbError;

        alert("Memory Saved Successfully! ❤️");
        const lastSavedInfo = document.getElementById("lastSavedInfo");
        const statusBadge = document.getElementById("dateStatusBadge");
        if (lastSavedInfo) lastSavedInfo.innerText = `Saved on ${new Date().toLocaleTimeString()}`;
        if (statusBadge) statusBadge.innerText = "✨ Memory Saved";

    } catch (err) {
        console.error("Error saving diary entry:", err);
        alert("Failed to save memory. Check Supabase connection and console for details.");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerText = "💾 Save Memory ❤️";
    }
}