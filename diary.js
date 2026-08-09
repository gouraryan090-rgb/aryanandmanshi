/* ==========================================
        COUPLE DIARY - FIXED RICH EDITOR
========================================== */

const diaryDateInput = document.getElementById('diaryDate');
const dateStatusBadge = document.getElementById('dateStatusBadge');
const diaryAuthorSelect = document.getElementById('diaryAuthor');
const diaryTitleInput = document.getElementById('diaryTitle');
const diaryEditor = document.getElementById('diaryEditor');
const saveDiaryBtn = document.getElementById('saveDiaryBtn');
const lastSavedInfo = document.getElementById('lastSavedInfo');

let currentEntryId = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    // Set today's date by default (YYYY-MM-DD)
    const today = new Date().toISOString().split('T')[0];
    diaryDateInput.value = today;

    // Fetch entry for today
    fetchDiaryForDate(today);

    // Listen for date change
    diaryDateInput.addEventListener('change', (e) => {
        fetchDiaryForDate(e.target.value);
    });
});

/* ------------------------------------------
    ADVANCED FIXED FORMATTING FUNCTION
------------------------------------------ */
function formatDoc(command, value = null) {
    // Bring focus back to the editor area first
    diaryEditor.focus();

    if (command === 'foreColor' || command === 'hiliteColor') {
        // Execute color command
        document.execCommand(command, false, value);
    } else {
        // Execute standard formatting (bold, italic, underline, etc.)
        document.execCommand(command, false, null);
    }

    diaryEditor.focus();
}

// Custom listener for color pickers to apply directly to selected text
document.getElementById('textColorPicker')?.addEventListener('input', (e) => {
    formatDoc('foreColor', e.target.value);
});

document.getElementById('bgColorPicker')?.addEventListener('input', (e) => {
    formatDoc('hiliteColor', e.target.value);
});


/* ------------------------------------------
        FETCH DIARY FROM SUPABASE
------------------------------------------ */
async function fetchDiaryForDate(dateStr) {
    resetEditorUI();
    dateStatusBadge.textContent = "Checking date... ⏳";
    dateStatusBadge.style.background = "rgba(255, 255, 255, 0.1)";

    try {
        const { data, error } = await supabaseClient
            .from('diary_entries')
            .select('*')
            .eq('entry_date', dateStr)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;

        if (data) {
            // Entry Exists for this date!
            currentEntryId = data.id;
            diaryTitleInput.value = data.title || '';
            diaryEditor.innerHTML = data.content || '';
            diaryAuthorSelect.value = data.author || 'Aryan';
            
            const formattedTime = new Date(data.updated_at || data.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            lastSavedInfo.textContent = `Last saved at ${formattedTime}`;

            dateStatusBadge.textContent = "✨ Memory Found (Editing Mode)";
            dateStatusBadge.style.background = "rgba(109, 93, 252, 0.25)";
        } else {
            // New Entry for this date
            currentEntryId = null;
            dateStatusBadge.textContent = "✍️ New Entry for this day";
            dateStatusBadge.style.background = "rgba(255, 77, 148, 0.25)";
            lastSavedInfo.textContent = "Not saved yet";
        }
    } catch (err) {
        console.error("Error fetching diary:", err.message);
        dateStatusBadge.textContent = "⚠️ Error loading data";
    }
}

/* ------------------------------------------
        SAVE OR UPDATE IN SUPABASE
------------------------------------------ */
async function saveDiaryEntry() {
    const selectedDate = diaryDateInput.value;
    const title = diaryTitleInput.value.trim();
    const content = diaryEditor.innerHTML.trim();
    const author = diaryAuthorSelect.value;

    if (!selectedDate) {
        alert("Please select a date!");
        return;
    }

    if (!title || !content || content === '<br>') {
        alert("Please enter both title and content for your memory! ❤️");
        return;
    }

    saveDiaryBtn.textContent = "Saving... ⏳";
    saveDiaryBtn.disabled = true;

    try {
        const payload = {
            entry_date: selectedDate,
            title: title,
            content: content,
            author: author,
            updated_at: new Date()
        };

        let result;

        if (currentEntryId) {
            // Update existing entry
            result = await supabaseClient
                .from('diary_entries')
                .update(payload)
                .eq('id', currentEntryId);
        } else {
            // Insert new entry
            payload.created_at = new Date();
            result = await supabaseClient
                .from('diary_entries')
                .insert([payload])
                .select();

            if (result.data && result.data.length > 0) {
                currentEntryId = result.data[0].id;
            }
        }

        if (result.error) throw result.error;

        // Success UI Feedback
        saveDiaryBtn.textContent = "Saved Successfully! ❤️";
        dateStatusBadge.textContent = "✨ Memory Saved";
        lastSavedInfo.textContent = `Last saved just now`;

        setTimeout(() => {
            saveDiaryBtn.textContent = "💾 Save Memory ❤️";
            saveDiaryBtn.disabled = false;
        }, 2000);

    } catch (err) {
        console.error("Error saving diary:", err.message);
        alert("Failed to save entry: " + err.message);
        saveDiaryBtn.textContent = "💾 Save Memory ❤️";
        saveDiaryBtn.disabled = false;
    }
}

// Reset Editor Input Fields
function resetEditorUI() {
    diaryTitleInput.value = '';
    diaryEditor.innerHTML = '';
    currentEntryId = null;
}