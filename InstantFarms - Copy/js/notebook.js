let editingId = null;

document.addEventListener("DOMContentLoaded", function() {
    let d = new Date().toISOString().split("T")[0];
    if(document.getElementById("nbDate")) document.getElementById("nbDate").value = d;
    if(document.getElementById("payDate")) document.getElementById("payDate").value = d;
    
    initNotebookSystem(); 
});

// ==========================================
// 1. MULTI-SHEET SYSTEM MANAGER
// ==========================================
function initNotebookSystem() {
    let files = JSON.parse(localStorage.getItem('if_notebook_files'));
    
    let oldData = JSON.parse(localStorage.getItem('if_notebook'));
    if (!files && oldData && oldData.length > 0) {
        let migratedId = Date.now();
        files = [{ id: migratedId, name: "Ledger 1", entries: oldData, payments: [] }];
        localStorage.setItem('if_notebook_files', JSON.stringify(files));
        localStorage.setItem('if_current_file_id', migratedId);
        localStorage.removeItem('if_notebook'); 
    } 
    else if (!files || files.length === 0) {
        let initialId = Date.now();
        files = [{ id: initialId, name: "Ledger 1", entries: [], payments: [] }];
        localStorage.setItem('if_notebook_files', JSON.stringify(files));
        localStorage.setItem('if_current_file_id', initialId);
    } else {
        files = files.map(f => {
            if (!f.payments) f.payments = [];
            return f;
        });
        localStorage.setItem('if_notebook_files', JSON.stringify(files));
    }

    loadCurrentFile();
}

function getCurrentFile() {
    let files = JSON.parse(localStorage.getItem('if_notebook_files')) || [];
    let currentId = parseInt(localStorage.getItem('if_current_file_id'));
    let currentFile = files.find(f => f.id === currentId);
    
    if (!currentFile && files.length > 0) {
        currentFile = files[0];
        localStorage.setItem('if_current_file_id', currentFile.id);
    }
    return currentFile;
}

function saveCurrentFile(updatedFile) {
    let files = JSON.parse(localStorage.getItem('if_notebook_files')) || [];
    files = files.map(f => f.id === updatedFile.id ? updatedFile : f);
    localStorage.setItem('if_notebook_files', JSON.stringify(files));
}

function loadCurrentFile() {
    let currentFile = getCurrentFile();
    if (currentFile) {
        let nameInput = document.getElementById("exportFileName");
        if (nameInput) nameInput.value = currentFile.name;
        
        syncHeader(currentFile.name);
        renderNotebookList();
        renderPaymentList();
    }
}

function syncHeader(val) { 
    // This forces the text to be uppercase in the background data
    let upperVal = val.toUpperCase();
    let titleText = upperVal.trim() !== "" ? upperVal.trim() : "NOTEBOOK LEDGER";
    
    const tableHeader = document.getElementById('notebookHeader');
    if (tableHeader) tableHeader.innerText = titleText; 
    
    const mainTitle = document.getElementById('notebookMainTitle');
    if (mainTitle) mainTitle.innerText = "📒 " + titleText;

    let currentFile = getCurrentFile();
    if (currentFile) {
        currentFile.name = titleText;
        saveCurrentFile(currentFile);
    }
}

// ==========================================
// 2. MATH ENGINE & SAVING MAIN LEDGER
// ==========================================
function calcNotebook() {
    let netWeight = parseFloat(document.getElementById('nbNetWeight').value) || 0;
    let mcCut = parseFloat(document.getElementById('nbMCCut').value) || 0;
    
    let finalWeight = netWeight - mcCut;
    if (document.getElementById('nbNetWeight').value !== "") {
        document.getElementById('nbFinalWeight').value = finalWeight;
    } else {
        document.getElementById('nbFinalWeight').value = "";
        finalWeight = 0;
    }

    let rate = parseFloat(document.getElementById('nbRate').value) || 0;
    let amount = finalWeight * rate;
    document.getElementById('nbAmount').value = amount > 0 ? Math.round(amount) : "";

    let frightDif = parseFloat(document.getElementById('nbFrightDif').value) || 0;
    let fright = parseFloat(document.getElementById('nbFright').value) || 0;
    let rusum = parseFloat(document.getElementById('nbRusum').value) || 0;

    let netAmount = amount - frightDif - fright - rusum;
    document.getElementById('nbNetAmount').value = (amount > 0) ? Math.round(netAmount) : "";
}

function saveNotebookEntry() {
    try {
        let currentFile = getCurrentFile();
        if (!currentFile) return;

        let nbData = {
            id: editingId ? editingId : Date.now(),
            date: document.getElementById('nbDate').value || "",
            vehicle: (document.getElementById('nbVehicle').value || "").toUpperCase(),
            mc1: document.getElementById('nbMC1').value || "",
            netWT: document.getElementById('nbNetWT').value || "",
            netWeight: document.getElementById('nbNetWeight').value || "",
            mc2: document.getElementById('nbMC2').value || "",
            mcCut: document.getElementById('nbMCCut').value || "",
            finalWeight: document.getElementById('nbFinalWeight').value || "",
            rate: document.getElementById('nbRate').value || "",
            amount: document.getElementById('nbAmount').value || "0",
            frightDif: document.getElementById('nbFrightDif').value || "",
            fright: document.getElementById('nbFright').value || "",
            rusum: document.getElementById('nbRusum').value || "",
            netAmount: document.getElementById('nbNetAmount').value || "0"
        };

        if (editingId) {
            currentFile.entries = currentFile.entries.map(e => e.id === editingId ? nbData : e);
            editingId = null;
            document.getElementById('saveBtn').innerText = "💾 Save Ledger Entry";
            if(typeof showCustomAlert === "function") showCustomAlert("Entry Updated!");
        } else {
            currentFile.entries.push(nbData);
            if(typeof showCustomAlert === "function") showCustomAlert("Entry Saved!");
        }

        saveCurrentFile(currentFile);
        clearNotebookInputs();
        renderNotebookList();
        renderPaymentList();
    } catch (error) {
        if(typeof showCustomAlert === "function") showCustomAlert("Error saving data. Please try again.");
    }
}

function editNotebookEntry(entryId) {
    let currentFile = getCurrentFile();
    let entry = currentFile.entries.find(e => e.id === entryId);

    if (entry) {
        document.getElementById('nbDate').value = entry.date || "";
        document.getElementById('nbVehicle').value = entry.vehicle || "";
        document.getElementById('nbMC1').value = entry.mc1 || "";
        document.getElementById('nbNetWT').value = entry.netWT || "";
        document.getElementById('nbNetWeight').value = entry.netWeight || "";
        document.getElementById('nbMC2').value = entry.mc2 || "";
        document.getElementById('nbMCCut').value = entry.mcCut || "";
        document.getElementById('nbFinalWeight').value = entry.finalWeight || "";
        document.getElementById('nbRate').value = entry.rate || "";
        document.getElementById('nbAmount').value = entry.amount || "";
        document.getElementById('nbFrightDif').value = entry.frightDif || "";
        document.getElementById('nbFright').value = entry.fright || "";
        document.getElementById('nbRusum').value = entry.rusum || "";
        document.getElementById('nbNetAmount').value = entry.netAmount || "";

        editingId = entryId;
        document.getElementById('saveBtn').innerText = "✏️ Update Entry";
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function deleteNotebookEntry(entryId) {
    if(typeof showConfirm === "function") {
        showConfirm("Are you sure you want to delete this entry?", () => {
            let currentFile = getCurrentFile();
            currentFile.entries = currentFile.entries.filter(e => e.id !== entryId);
            saveCurrentFile(currentFile);
            renderNotebookList();
            renderPaymentList();
            showCustomAlert("Deleted!");
        });
    }
}

function clearNotebookInputs() {
    document.getElementById('nbVehicle').value = ""; document.getElementById('nbMC1').value = "";
    document.getElementById('nbNetWT').value = ""; document.getElementById('nbNetWeight').value = "";
    document.getElementById('nbMC2').value = ""; document.getElementById('nbMCCut').value = "";
    document.getElementById('nbFinalWeight').value = ""; document.getElementById('nbRate').value = "";
    document.getElementById('nbAmount').value = ""; document.getElementById('nbFrightDif').value = "";
    document.getElementById('nbFright').value = ""; document.getElementById('nbRusum').value = "";
    document.getElementById('nbNetAmount').value = "";
}

function renderNotebookList() {
    let currentFile = getCurrentFile();
    let listHTML = "";

    if(!currentFile || currentFile.entries.length === 0) {
        listHTML = "<tr><td colspan='15' style='text-align: center; padding: 15px; color: black;'>No entries in this sheet yet.</td></tr>";
    } else {
        let sumNet = 0;
        let totalPaid = 0;

        // Get total paid first to calculate balance
        if (currentFile.payments) {
            currentFile.payments.forEach(pay => {
                totalPaid += parseFloat(pay.amount) || 0;
            });
        }
        totalPaid = Math.round(totalPaid);

        currentFile.entries.forEach(entry => {
            sumNet += parseFloat(entry.netAmount) || 0;

            listHTML += `
            <tr style="border-bottom: 1px solid #ccc; color: black; white-space: nowrap;">
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.date}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.vehicle}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.mc1}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.netWT}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.netWeight}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.mc2}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.mcCut}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.finalWeight}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.rate}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.amount}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.frightDif}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.fright}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${entry.rusum}</td>
                <td style="padding: 5px; border: 1px solid #ccc; font-weight: bold;">${entry.netAmount}</td>
                <td data-html2canvas-ignore="true" style="padding: 5px; border: 1px solid #ccc; text-align: center;">
                    <button onclick="editNotebookEntry(${entry.id})" style="margin:2px; padding: 4px 8px; font-size: 12px; background: #3B82F6;">✏️</button>
                    <button onclick="deleteNotebookEntry(${entry.id})" style="margin:2px; padding: 4px 8px; font-size: 12px; background: #EF4444;">❌</button>
                </td>
            </tr>`;
        });
        
        sumNet = Math.round(sumNet);
        let balance = sumNet - totalPaid;

        // All 3 Summary Rows (TOTAL, PAID, BALANCE) stacked at the bottom of the Ledger
        listHTML += `
        <tr style="background: #e8f5e9; font-weight: bold; color: black; white-space: nowrap;">
            <td colspan="13" style="padding: 8px; border: 1px solid #ccc; text-align: right;">TOTAL:</td>
            <td style="padding: 8px; border: 1px solid #ccc; color: #2E7D32;">${sumNet}</td>
            <td data-html2canvas-ignore="true" style="border: 1px solid #ccc;"></td>
        </tr>
        <tr style="background: #fff3cd; font-weight: bold; color: black; white-space: nowrap;">
            <td colspan="13" style="padding: 8px; border: 1px solid #ccc; text-align: right;">PAID:</td>
            <td style="padding: 8px; border: 1px solid #ccc; color: #d97706;">${totalPaid}</td>
            <td data-html2canvas-ignore="true" style="border: 1px solid #ccc;"></td>
        </tr>
        <tr style="background: #f8d7da; font-weight: bold; color: black; white-space: nowrap;">
            <td colspan="13" style="padding: 8px; border: 1px solid #ccc; text-align: right;">BALANCE:</td>
            <td style="padding: 8px; border: 1px solid #ccc; color: #dc2626;">${balance}</td>
            <td data-html2canvas-ignore="true" style="border: 1px solid #ccc;"></td>
        </tr>`;
    }
    document.getElementById('notebookList').innerHTML = listHTML;
}

// ==========================================
// 3. PAYMENTS & ADVANCES ENGINE
// ==========================================
function addPayment() {
    let currentFile = getCurrentFile();
    if(!currentFile) return;
    if(!currentFile.payments) currentFile.payments = [];
    
    let payData = {
        id: Date.now(),
        date: document.getElementById('payDate').value || "",
        name: document.getElementById('payName').value || "",
        amount: document.getElementById('payAmount').value || "0"
    };
    
    currentFile.payments.push(payData);
    saveCurrentFile(currentFile);
    
    document.getElementById('payName').value = "";
    document.getElementById('payAmount').value = "";
    renderNotebookList(); // Re-render Ledger to update balance
    renderPaymentList();
    if(typeof showCustomAlert === "function") showCustomAlert("Payment Added!");
}

function deletePayment(id) {
    if(typeof showConfirm === "function") {
        showConfirm("Delete this payment?", () => {
            let currentFile = getCurrentFile();
            currentFile.payments = currentFile.payments.filter(p => p.id !== id);
            saveCurrentFile(currentFile);
            renderNotebookList(); // Re-render Ledger to update balance
            renderPaymentList();
            showCustomAlert("Payment Deleted!");
        });
    }
}

function renderPaymentList() {
    let currentFile = getCurrentFile();
    let listHTML = "";
    let totalPaid = 0;

    if(!currentFile || !currentFile.payments || currentFile.payments.length === 0) {
        listHTML = "<tr><td colspan='4' style='text-align: center; padding: 10px; color: black;'>No payments added yet.</td></tr>";
    } else {
        currentFile.payments.forEach(pay => {
            totalPaid += parseFloat(pay.amount) || 0;
            listHTML += `
            <tr style="border-bottom: 1px solid #ccc; color: black; white-space: nowrap;">
                <td style="padding: 5px; border: 1px solid #ccc;">${pay.date}</td>
                <td style="padding: 5px; border: 1px solid #ccc;">${pay.name}</td>
                <td style="padding: 5px; border: 1px solid #ccc; font-weight:bold;">${pay.amount}</td>
                <td data-html2canvas-ignore="true" style="padding: 5px; border: 1px solid #ccc; text-align: center;">
                    <button onclick="deletePayment(${pay.id})" style="margin:2px; padding: 4px 8px; font-size: 12px; background: #EF4444;">❌</button>
                </td>
            </tr>`;
        });

        totalPaid = Math.round(totalPaid);

        // Append just the Total Paid sum at the bottom of Payments table
        listHTML += `
        <tr style="background: #fff3cd; font-weight: bold; color: black;">
            <td colspan="2" style="padding: 8px; border: 1px solid #ccc; text-align: right;">TOTAL PAID:</td>
            <td style="padding: 8px; border: 1px solid #ccc; color: #d97706;">${totalPaid}</td>
            <td data-html2canvas-ignore="true" style="border: 1px solid #ccc;"></td>
        </tr>`;
    }

    document.getElementById('paymentList').innerHTML = listHTML;
}

// ==========================================
// 4. SHEET MANAGEMENT (NEW/OPEN/DELETE)
// ==========================================

function startNewLedger() {
    showConfirm("Create a new blank sheet?", () => {
        let files = JSON.parse(localStorage.getItem('if_notebook_files')) || [];
        let newId = Date.now();
        let newName = "Ledger " + (files.length + 1);
        
        let newFile = { id: newId, name: newName, entries: [], payments: [] };
        files.push(newFile);
        
        localStorage.setItem('if_notebook_files', JSON.stringify(files));
        localStorage.setItem('if_current_file_id', newId);
        
        loadCurrentFile();
        if(typeof showCustomAlert === "function") showCustomAlert("New Sheet Created!");
    });
}

function openSavedNotebooksModal() {
    let files = JSON.parse(localStorage.getItem('if_notebook_files')) || [];
    let listHTML = "";
    let currentId = parseInt(localStorage.getItem('if_current_file_id'));

    files.forEach(f => {
        let isCurrent = (f.id === currentId);
        listHTML += `
        <div style="padding: 12px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; align-items: center;">
            <div style="flex-grow: 1;">
                <strong style="font-size: 16px;">${f.name}</strong> 
                <span style="font-size: 13px; color: #6B7280; display:block;">${f.entries.length} Entries</span>
            </div>
            <div style="display: flex; gap: 8px; align-items: center;">
                ${isCurrent ? '<span style="color: #10B981; font-weight:bold; font-size:14px; margin-right:5px;">(Active)</span>' : `<button onclick="loadSpecificNotebook(${f.id})" style="padding: 8px 12px; font-size: 14px; background: #3B82F6; margin:0;">Open</button>`}
                <button onclick="deleteSpecificNotebook(${f.id})" style="padding: 8px 12px; font-size: 14px; background: #EF4444; margin:0;">🗑️</button>
            </div>
        </div>
        `;
    });

    document.getElementById('savedNotebooksList').innerHTML = listHTML;
    document.getElementById('savedNotebooksOverlay').style.display = 'flex';
}

function loadSpecificNotebook(id) {
    localStorage.setItem('if_current_file_id', id);
    document.getElementById('savedNotebooksOverlay').style.display = 'none';
    loadCurrentFile();
    if(typeof showCustomAlert === "function") showCustomAlert("Sheet Loaded!");
}

function deleteSpecificNotebook(id) {
    let files = JSON.parse(localStorage.getItem('if_notebook_files')) || [];
    
    if (files.length <= 1) {
        if (typeof showCustomAlert === "function") showCustomAlert("You must keep at least one sheet!");
        return;
    }
    
    if(typeof showConfirm === "function") {
        showConfirm("Are you sure you want to delete this sheet permanently?", () => {
            files = files.filter(f => f.id !== id);
            localStorage.setItem('if_notebook_files', JSON.stringify(files));
            
            if (parseInt(localStorage.getItem('if_current_file_id')) === id) {
                localStorage.setItem('if_current_file_id', files[0].id);
                loadCurrentFile();
            }
            openSavedNotebooksModal(); 
            showCustomAlert("Sheet Deleted!");
        });
    }
}

// ==========================================
// 5. EXPORTS
// ==========================================

function exportToExcel() {
    let currentFile = getCurrentFile();
    if (!currentFile || currentFile.entries.length === 0) return;
    
    let sumNetAmount = 0;
    let sumPayAmount = 0;

    // Calculate Payments First
    if (currentFile.payments && currentFile.payments.length > 0) {
        currentFile.payments.forEach(pay => {
            sumPayAmount += parseFloat(pay.amount) || 0;
        });
    }
    sumPayAmount = Math.round(sumPayAmount);
    
    // 1. TOP SECTION: Ledger Entries
    let csv = "DATE,VEHICLE,MC,NET WT,NET WEIGHT,MC,MC CUT,FINAL WEIGHT,RATE,AMOUNT,FRIGHTDIF,FRIGHT,RUSUM,NET AMOUNT\n";
    
    currentFile.entries.forEach(e => {
        csv += `"${e.date}","${e.vehicle}","${e.mc1}","${e.netWT}","${e.netWeight}","${e.mc2}","${e.mcCut}","${e.finalWeight}","${e.rate}","${e.amount}","${e.frightDif}","${e.fright}","${e.rusum}","${e.netAmount}"\n`;
        sumNetAmount += parseFloat(e.netAmount) || 0;
    });
    
    sumNetAmount = Math.round(sumNetAmount);
    let finalBalance = sumNetAmount - sumPayAmount;

    // Output all 3 summary rows under the main ledger
    csv += ["", "", "", "", "", "", "", "", "", "", "", "", "TOTAL:", sumNetAmount].map(val => val !== "" ? `"${val}"` : "").join(",") + "\n";
    csv += ["", "", "", "", "", "", "", "", "", "", "", "", "PAID:", sumPayAmount].map(val => val !== "" ? `"${val}"` : "").join(",") + "\n";
    csv += ["", "", "", "", "", "", "", "", "", "", "", "", "BALANCE:", finalBalance].map(val => val !== "" ? `"${val}"` : "").join(",") + "\n";

    // 2. GAP
    csv += "\n\n\n";

    // 3. BOTTOM SECTION: Payments Table
    if (currentFile.payments && currentFile.payments.length > 0) {
        currentFile.payments.forEach(pay => {
            let row = ["", "", "", "", pay.date, "", "", pay.name, "", "", "", "", "", pay.amount];
            csv += row.map(val => val ? `"${val}"` : "").join(",") + "\n";
        });
        
        // Add Total Paid under the payments table as well
        let payTotalRow = ["", "", "", "", "", "", "", "TOTAL PAID:", "", "", "", "", "", sumPayAmount];
        csv += payTotalRow.map(val => val !== "" ? `"${val}"` : "").join(",") + "\n";
    }
    
    // 4. Download
    let link = document.createElement("a");
    let name = currentFile.name || "Notebook";
    link.download = `${name}.csv`;
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    link.click();
}

function exportToImage() {
    let container = document.getElementById("printableArea");
    html2canvas(container, { backgroundColor: "#ffffff", scale: 2 }).then(canvas => {
        let name = getCurrentFile().name || "Notebook";
        let link = document.createElement("a"); link.download = `${name}.png`;
        link.href = canvas.toDataURL("image/png"); link.click();
    });
}

function exportToPDF() {
    let container = document.getElementById("printableArea");
    html2canvas(container, { backgroundColor: "#ffffff", scale: 2 }).then(canvas => {
        let imgData = canvas.toDataURL("image/png");
        let pdf = new window.jspdf.jsPDF('l', 'mm', 'a4'); 
        let pdfWidth = pdf.internal.pageSize.getWidth();
        let pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        let name = getCurrentFile().name || "Notebook";
        
        pdf.text(name, 14, 15);
        pdf.addImage(imgData, 'PNG', 0, 20, pdfWidth, pdfHeight);
        pdf.save(`${name}.pdf`);
    });
}