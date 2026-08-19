// Function ko global window scope par define kar rahe hain
window.goToEditor = function(dateVal = null) {
    const selectedDate = dateVal || document.getElementById("diaryDate").value;
    if (!selectedDate) {
        alert("Please select a date first!");
        return;
    }
    // diary-editor.html page par date parameter ke saath redirect karega
    window.location.href = `diary-editor.html?date=${selectedDate}`;
};

document.addEventListener("DOMContentLoaded", () => {
    const dateInput = document.getElementById("diaryDate");
    if (dateInput) {
        const today = new Date().toISOString().split("T")[0];
        dateInput.value = today;
    }

    loadSavedMemories();
});

async function loadSavedMemories() {
    const grid = document.getElementById("memoriesGrid");
    if (!grid) return;

    try {
        const { data, error } = await supabaseClient
            .from("couple_diary")
            .select("*")
            .order("entry_date", { ascending: false });

        if (error) throw error;

        if (!data || data.length === 0) {
            grid.innerHTML = `<div class="empty-text">No memories recorded yet. Pick a date above to write your first entry! ❤️</div>`;
            return;
        }

        grid.innerHTML = "";
        data.forEach(item => {
            const card = document.createElement("div");
            card.className = "memory-summary-card";
            
            const hasPhoto = item.photo_url ? "📸 Photo" : "";
            const hasAudio = item.audio_url ? "🎙️ Voice Note" : "";
            const badges = [hasPhoto, hasAudio].filter(Boolean).join(" • ");

            card.innerHTML = `
                <div class="memory-card-header">
                    <span class="memory-date">📅 ${item.entry_date}</span>
                    <span class="memory-author">${item.author === "Aryan" ? "🗿 Aryan" : "💗 Manshii"}</span>
                </div>
                <h3 class="memory-title">${item.title}</h3>
                ${badges ? `<div class="memory-badges">${badges}</div>` : ""}
            `;

            card.onclick = () => window.goToEditor(item.entry_date);
            grid.appendChild(card);
        });

    } catch (err) {
        console.error("Error loading memories:", err);
        grid.innerHTML = `<div class="error-text">Failed to load memories list.</div>`;
    }
}