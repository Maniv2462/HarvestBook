// Get all the input elements we need
const weightInput = document.getElementById("weight");
const rateInput = document.getElementById("rate");
const totalInput = document.getElementById("total");
const hireInput = document.getElementById("hire");
const extraInput = document.getElementById("extra");
const finalInput = document.getElementById("final");
const toInput = document.getElementById("to");

// 1. Auto copy "To" field ONLY to the second blank
toInput.addEventListener("input", function () {
    document.getElementById("saleAddressAuto").value = this.value;
});

// 2. Calculate Total (Weight * Rate)
function calcTotal() {
    let w = parseFloat(weightInput.value);
    let r = parseFloat(rateInput.value);

    // If both weight and rate have valid numbers, calculate the math
    if (!isNaN(w) && !isNaN(r)) {
        totalInput.value = w * r;
    } else {
        // If either box is empty, revert back to the default text
        totalInput.value = "కాటా ప్రకారం";
    }
    
    // Always check if we need to turn the box green after calculating!
    checkTotalColor();
}

// 3. Calculate Final Amount
function calcFinal() {
    // Using parseFloat ensures we don't get "NaN" errors if a box is empty
    let h = parseFloat(hireInput.value) || 0;
    let e = parseFloat(extraInput.value) || 0;
    
    // Your requested calculation: Hire - Extra
    finalInput.value = h - e;
}

// 4. --- GREEN HIGHLIGHT LOGIC FOR TOTAL FIELD ---
function checkTotalColor() {
    // If the box is NOT empty AND it doesn't say "కాటా ప్రకారం"
    if (totalInput.value.trim() !== "" && totalInput.value.trim() !== "Kataprakaram") {
        totalInput.classList.add("input-filled-green"); // Turn it green
    } else {
        totalInput.classList.remove("input-filled-green"); // Remove green
    }
}

// 5. Attach the events so the math happens instantly as you type
weightInput.addEventListener("input", calcTotal);
rateInput.addEventListener("input", calcTotal);

hireInput.addEventListener("input", calcFinal);
extraInput.addEventListener("input", calcFinal);

// Listen to the total box in case you manually type something inside it
totalInput.addEventListener("input", checkTotalColor);