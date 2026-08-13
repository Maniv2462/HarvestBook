// Automatically saves the current form data to Local Storage
function saveToHistory() {
    let noteData = {
        id: Date.now(), 
        dateStr: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        farmerName: document.getElementById('farmerName').value,
        date: document.getElementById('date').value,
        address: document.getElementById('address').value,
        from: document.getElementById('from').value,
        to: document.getElementById('to').value,
        product: document.getElementById('product').value,
        weight: document.getElementById('weight').value,
        rate: document.getElementById('rate').value,
        total: document.getElementById('total').value,
        vehicle: document.getElementById('vehicle').value,
        driver: document.getElementById('driver').value,
        saleAddress: document.getElementById('saleAddress').value,
        specialNote: document.getElementById('specialNote') ? document.getElementById('specialNote').value : "",
        hire: document.getElementById('hire').value,
        extra: document.getElementById('extra').value,
        final: document.getElementById('final').value
    };
    
    if (!noteData.farmerName) return; 

    let history = JSON.parse(localStorage.getItem('if_history')) || [];
    history.unshift(noteData); 
    if(history.length > 50) history.pop(); 
    
    localStorage.setItem('if_history', JSON.stringify(history));
}

// Toggles the history panel open and closed
function toggleHistory() {
    let container = document.getElementById('historyContainer');
    let btn = document.getElementById('historyBtn');

    if (container.classList.contains('hidden')) {
        renderHistoryList();
        container.classList.remove('hidden');
        btn.innerHTML = "❌ Close History";
        btn.style.backgroundColor = "#EF4444"; 
        container.scrollIntoView({ behavior: 'smooth' });
    } else {
        container.classList.add('hidden');
        btn.innerHTML = "📜 History";
        btn.style.backgroundColor = "#6B7280"; 
    }
}

// Builds the visual list of past notes
function renderHistoryList() {
    let history = JSON.parse(localStorage.getItem('if_history')) || [];
    let listHTML = "";
    
    if (history.length === 0) {
        listHTML = "<p style='text-align:center; color:var(--text-muted); margin-top:20px;'>No saved notes yet! Generate a note to save it here.</p>";
    } else {
        history.forEach(note => {
            // NEW: Added a flex container for the buttons and a Delete (🗑️) button
            listHTML += `
            <div style="border: 1px solid var(--border-color); padding: 15px; margin-bottom: 12px; border-radius: 8px; background: var(--input-bg); display:flex; justify-content: space-between; align-items: center; box-shadow: 0 2px 4px rgba(0,0,0,0.02);">
                <div>
                    <strong style="color: var(--primary-color); font-size: 16px;">${note.farmerName}</strong><br>
                    <small style="color: var(--text-muted); font-size: 13px;">${note.dateStr} • ${note.product || 'No product'} • ${note.final ? note.final + '/-' : ''}</small>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button onclick="loadFromHistory(${note.id})" style="margin: 0; padding: 8px 16px; font-size: 14px; width: auto; box-shadow: none;">Load</button>
                    <button onclick="deleteFromHistory(${note.id})" style="margin: 0; padding: 8px 12px; font-size: 14px; width: auto; box-shadow: none; background-color: #EF4444;" title="Delete Note">🗑️</button>
                </div>
            </div>`;
        });
    }
    
    document.getElementById('historyList').innerHTML = listHTML;
}

// Fills the form back out with old data
function loadFromHistory(id) {
    let history = JSON.parse(localStorage.getItem('if_history')) || [];
    let note = history.find(n => n.id === id);
    
    if(note) {
        document.getElementById('farmerName').value = note.farmerName || "";
        document.getElementById('date').value = note.date || "";
        document.getElementById('address').value = note.address || "";
        document.getElementById('from').value = note.from || "";
        document.getElementById('to').value = note.to || "";
        document.getElementById('product').value = note.product || "";
        document.getElementById('weight').value = note.weight || "";
        document.getElementById('rate').value = note.rate || "";
        document.getElementById('total').value = note.total || "";
        document.getElementById('vehicle').value = note.vehicle || "";
        document.getElementById('driver').value = note.driver || "";
        document.getElementById('saleAddress').value = note.saleAddress || "";
        if(document.getElementById('specialNote')) document.getElementById('specialNote').value = note.specialNote || "";
        document.getElementById('hire').value = note.hire || "";
        document.getElementById('extra').value = note.extra || "";
        document.getElementById('final').value = note.final || "";
        
        if (typeof calculateTotal === "function") calculateTotal();
        if (typeof calculateFinal === "function") calculateFinal();
        
        toggleHistory();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        alert("✅ Note Loaded Successfully!");
    }
}

// NEW: Deletes a specific note from history
function deleteFromHistory(id) {
    // Show a quick warning popup to make sure they didn't click it by accident
    let confirmDelete = confirm("Are you sure you want to delete this note permanently?");
    
    if (confirmDelete) {
        // Get the current history
        let history = JSON.parse(localStorage.getItem('if_history')) || [];
        
        // Filter out the note that has the matching ID
        history = history.filter(note => note.id !== id);
        
        // Save the updated list back to the phone
        localStorage.setItem('if_history', JSON.stringify(history));
        
        // Immediately redraw the list so the note disappears visually
        renderHistoryList();
    }
}