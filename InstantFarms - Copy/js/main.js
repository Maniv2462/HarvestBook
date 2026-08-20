function goScreen(n){
    document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
    document.getElementById("screen"+n).classList.remove('hidden');
    
    // Auto-update the toggle button text/color based on the screen
    let nbBtn = document.getElementById("notebookBtn");
    if(nbBtn) {
        if(n === 4) {
            nbBtn.innerHTML = "📋 Form";
            nbBtn.style.background = "#6B7280"; // Gray color when going back
        } else {
            nbBtn.innerHTML = "📒 Notebook";
            nbBtn.style.background = "#F59E0B"; // Orange color normally
        }
    }
}

// The new Toggle logic for the top button
function toggleNotebook() {
    let screen4 = document.getElementById("screen4");
    if (screen4.classList.contains("hidden")) {
        goScreen(4); // Go to Notebook
    } else {
        goScreen(0); // Go back to Form
    }
}

function goToPreview(){
    showPreview();
    goScreen(1);
}

window.onload=function(){
    let d=new Date().toISOString().split("T")[0];
    if(document.getElementById("date")) document.getElementById("date").value=d;
}

// Custom Alerts
function showCustomAlert(message) {
    const alertBox = document.getElementById('customAlertOverlay');
    if(!alertBox) return;
    alertBox.innerText = message;
    alertBox.style.display = 'block';
    setTimeout(() => { alertBox.style.display = 'none'; }, 3000);
}

function showConfirm(message, yesCallback) {
    const modal = document.getElementById('customConfirmOverlay');
    if(!modal) return;
    document.getElementById('confirmMessage').innerText = message;
    modal.style.display = 'flex';
    document.getElementById('btnYes').onclick = function() {
        modal.style.display = 'none';
        yesCallback();
    };
}

// Helper function to format date to DD-MM-YYYY
function formatDate(dateString) {
    if (!dateString) return "";
    const parts = dateString.split("-");
    if (parts.length === 3) {
        return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
}