# 🌿 Harvest Book (Rythu Khata - రైతు ఖాతా)

**Live Demo:** [https://deliverynotefarm.netlify.app/](https://deliverynotefarm.netlify.app/)

## 📖 About The Project
Say goodbye to messy paper notebooks. Harvest Book is a complete agricultural accounting and digital ledger tool designed specifically for local farmers and crop traders. Generate professional Farmer Delivery Notes (రైతు డెలివరీ నోటు), automatically calculate net weights and freight deductions, and keep a live track of advances and balances. Export your entire ledger to PDF, Image, or Excel in just one click.

## ✨ Key Features

### 📝 Digital Delivery Notes (రైతు డెలివరీ నోటు)
*   **Custom Form Generation:** Input farmer details, crop weight, rates, and vehicle information.
*   **Digital Signatures:** Touch/mouse signature pad for instant digital signing.
*   **Auto-Capitalization:** Vehicle numbers and file names auto-format to uppercase.

### 📂 Multi-Sheet Ledger System
*   **Unlimited Sheets:** Create, name, and save multiple independent ledger sheets without losing previous data.
*   **Local Storage Memory:** All data is safely auto-saved in the browser.
*   **Smart Navigation:** Seamlessly toggle between the Form view and the Ledger view.

### 🧮 Automated Math Engine
*   **Live Row Calculations:** Automatically calculates Final Weight (`Net Weight` - `MC Cut`) and Net Amount (`Amount` - Deductions).
*   **Smart Rounding:** All monetary totals (Amount, Freight, Rusum, Net Amount) automatically round to the nearest whole number.
*   **Bottom Line Summaries:** Stacks **TOTAL NET AMOUNT**, **PAID**, and **FINAL BALANCE** clearly at the bottom of the ledger.

### 💸 Payments & Advances Tracker
*   **Dedicated Payment Table:** Log advances (Date, Name, Amount) securely.
*   **Auto-Deduction:** Payments are dynamically summed up and subtracted from the Ledger's Total Net Amount to generate a live Final Balance.

### 📄 Advanced Exports
*   **📊 Pro Excel (.csv):** Exports a perfectly formatted sheet with the Ledger table, stacked summaries, and individual payments.
*   **🖼️ Unified Image & 📄 PDF Downloads:** Captures both the Ledger and Payment tables in one clean document, automatically hiding UI action buttons (Edit/Delete) for a clean print.

## 🛠️ Built With
*   **HTML5 & CSS3:** For a responsive, modern, and printable UI.
*   **Vanilla JavaScript:** For local storage management and the dynamic math engine.
*   **html2canvas & jsPDF:** For seamless Image and PDF generation.
