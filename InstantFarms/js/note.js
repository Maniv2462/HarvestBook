function val(x) { return x && x !== "" ? x : "........"; }
function moneyVal(x) { return (!x || x === "") ? "........" : (isNaN(x) ? x : x + "/-"); }
function weightVal(x) { return x && x !== "" ? x + " Q" : "........"; }

function formatDate(d) {
    if (!d || d === "") return "........";
    let parts = d.split("-");
    if (parts.length === 3) { return parts[2] + "-" + parts[1] + "-" + parts[0]; }
    return d; 
}

function numberToWords(num) {
    if (!num || isNaN(num) || num == 0) return "";
    let n = parseInt(num);
    let a = ["", "One ", "Two ", "Three ", "Four ", "Five ", "Six ", "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ", "Twelve ", "Thirteen ", "Fourteen ", "Fifteen ", "Sixteen ", "Seventeen ", "Eighteen ", "Nineteen "];
    let b = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    function convert(n) {
        let str = "";
        if (n > 9999999) { str += convert(Math.floor(n / 10000000)) + "Crore "; n %= 10000000; }
        if (n > 99999) { str += convert(Math.floor(n / 100000)) + "Lakh "; n %= 100000; }
        if (n > 999) { str += convert(Math.floor(n / 1000)) + "Thousand "; n %= 1000; }
        if (n > 99) { str += convert(Math.floor(n / 100)) + "Hundred "; n %= 100; }
        if (n > 0) {
            if (n < 20) { str += a[n]; } else { str += b[Math.floor(n / 10)] + " " + a[n % 10]; }
        }
        return str;
    }
    return "Rupees " + convert(n).trim() + " Only";
}

function generateNote() {
    window.scrollTo(0, 0); 
    saveToHistory();
    let manualSale = document.getElementById("saleAddress").value;
    let autoSale = document.getElementById("saleAddressAuto").value;
    let noteText = document.getElementById("specialNote") ? document.getElementById("specialNote").value : "";
    
    let combinedSale = "";
    if (manualSale && autoSale) { combinedSale = manualSale + ", " + autoSale; } 
    else { combinedSale = manualSale || autoSale; }

    let finalWords = numberToWords(final.value);
    let signatureImage = document.getElementById("previewSignature").toDataURL();
    
    let html = `
    <div style="background-color: #FAFAFA; color: #1e4d2b; padding: 40px; font-family: 'Segoe UI', sans-serif; border: 1px solid #ccc; max-width: 800px; margin: 0 auto; box-shadow: 0 4px 8px rgba(0,0,0,0.1);">
        
        <div style="display: flex; justify-content: center; margin-bottom: 30px;">
            <div style="border: 2px solid #1e4d2b; padding: 8px 30px; border-radius: 6px;">
                <h2 style="margin: 0; font-size: 24px; text-decoration: underline;">రైతు డెలివరీ నోటు</h2>
            </div>
        </div>

        <div style="text-align: right; margin-bottom: 20px; font-size: 16px; font-weight: bold;">
            తేది: <span style="border-bottom: 1px dotted #1e4d2b; padding: 0 20px; display: inline-block; min-width: 120px; text-align: center; color: black;">${formatDate(date.value)}</span>
        </div>

        <table style="width: 100%; border-collapse: collapse; font-size: 16px; line-height: 2.5;">
            <tr>
                <td style="width: 30px;">1.</td><td style="width: 160px;">రైతు పేరు</td><td style="width: 20px;">:</td>
                <td style="border-bottom: 1px dotted #1e4d2b; text-align: center; color: black; font-weight: 500;">${val(farmerName.value)}</td>
            </tr>
            <tr>
                <td>2.</td><td>అడ్రస్సు</td><td>:</td>
                <td style="border-bottom: 1px dotted #1e4d2b; text-align: center; color: black; font-weight: 500;">${val(address.value)}</td>
            </tr>
            <tr>
                <td>3.</td><td>ఎచ్చట నుండి</td><td>:</td>
                <td style="border-bottom: 1px dotted #1e4d2b; text-align: center; color: black; font-weight: 500;">${val(from.value)}</td>
            </tr>
            <tr>
                <td>4.</td><td>ఎచ్చటకు</td><td>:</td>
                <td style="border-bottom: 1px dotted #1e4d2b; text-align: center; color: black; font-weight: 500;">${val(to.value)}</td>
            </tr>
            <tr>
                <td>5.</td><td>సరుకుల వివరం</td><td>:</td>
                <td style="border-bottom: 1px dotted #1e4d2b; text-align: center; color: black; font-weight: 500;">${val(product.value)}</td>
            </tr>
            <tr>
                <td>6.</td><td>మొత్తం తూకం</td><td>:</td>
                <td style="border-bottom: 1px dotted #1e4d2b; text-align: center; color: black; font-weight: 500;">
                    ${weightVal(weight.value)} <span style="margin-left: 40px; color: #1e4d2b; font-weight: normal;">ధర :</span> <span style="margin-left: 10px;">${moneyVal(rate.value)}</span>
                </td>
            </tr>
            <tr>
                <td>7.</td><td>మొత్తం ఖరీదు</td><td>:</td>
                <td style="border-bottom: 1px dotted #1e4d2b; text-align: center; color: black; font-weight: 500;">${moneyVal(total.value)}</td>
            </tr>
            <tr>
                <td>8.</td><td>వాహనము నెంబరు</td><td>:</td>
                <td style="border-bottom: 1px dotted #1e4d2b; text-align: center; color: black; font-weight: 500;">${val(vehicle.value)}</td>
            </tr>
            <tr>
                <td>9.</td><td>ఓనరు పేరు</td><td>:</td>
                <td style="border-bottom: 1px dotted #1e4d2b; text-align: center; color: black; font-weight: 500;">${val(driver.value)}</td>
            </tr>
            <tr>
                <td style="vertical-align: top;">10.</td>
                <td style="vertical-align: top; line-height: 1.4; padding-top: 10px;">విక్రయమునకై ఎవరి<br>కొట్టుకు తీసుకొని<br>వెళ్ళుచున్నది వారి అడ్రసు</td>
                <td style="vertical-align: top; padding-top: 10px;">:</td>
                <td style="border-bottom: 1px dotted #1e4d2b; vertical-align: bottom; text-align: center; color: black; font-weight: 500;">${val(combinedSale)}</td>
            </tr>
        </table>

        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 30px; margin-bottom: 20px;">
            <div style="width: 60%; text-align: center; color: black;">
                ${noteText ? `<span style="white-space: pre-wrap; line-height: 1.4; font-size: 24px; font-weight: bold;">${noteText}</span>` : ''}
            </div>
            
            <div style="width: 35%; text-align: right;">
                <p style="margin-bottom: 10px; font-weight: bold;">పైన వ్రాసినదంతయు యదార్ధము</p>
                <img src="${signatureImage}" height="80" style="display: inline-block; max-width: 150px; object-fit: contain; margin-bottom: 10px;">
                <p style="font-weight: bold; margin: 0;">రైతు సంతకము</p>
            </div>
        </div>

        <div style="font-size: 15px; line-height: 2; margin-top: 20px;">
            <div>
                1. కిరాయి <span style="border-bottom: 1px dotted #1e4d2b; padding: 0 20px; display: inline-block; min-width: 80px; text-align: center; color: black; font-weight: 500;">${moneyVal(hire.value)}</span> 
                + మామూలు, అడ్వాన్సు <span style="border-bottom: 1px dotted #1e4d2b; padding: 0 20px; display: inline-block; min-width: 80px; text-align: center; color: black; font-weight: 500;">${moneyVal(extra.value)}</span>
            </div>
            
            <div style="margin-top: 10px; margin-left: 20px;">
                పోను వెరశి మొత్తము <span style="border-bottom: 1px dotted #1e4d2b; padding: 0 30px; display: inline-block; min-width: 100px; text-align: center; color: black; font-weight: bold;">${moneyVal(final.value)}</span> యివ్వగలరు.
            </div>
            
            ${finalWords ? `<div style="margin-top: 2px; margin-left: 20px; font-weight: bold; color: #333; font-size: 14px;">( ${finalWords} )</div>` : ''}
            
            <div style="margin-top: 15px;">2. అగ్రికల్చర్ సెస్సు రశీదు తీసుకొని డబ్బు ఇవ్వగలరు.</div>
            <div>3. అదనముగా చెల్లించిన కమర్షియల్ టాక్సు రశీదు తీసుకొని డబ్బు ఇవ్వగలరు.</div>
        </div>
    </div>
    `;

    document.getElementById("noteContent").innerHTML = html;
    if(document.getElementById("noteNumber")) { document.getElementById("noteNumber").innerHTML = ""; }
    goScreen(2);
}

function downloadImage() {
    window.scrollTo(0, 0); 
    let note = document.getElementById("noteContent"); 
    let btn = event.target || event.srcElement;
    let originalText = btn.innerHTML;
    btn.innerHTML = "⏳ Generating...";

    html2canvas(note, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#FAFAFA" }).then(function(canvas) {
        let image = canvas.toDataURL("image/png");
        let link = document.createElement("a");
        link.href = image;
        link.download = "DeliveryNote.png";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
            note.innerHTML = `
            <div style="background:#fff; padding:15px; text-align:center; color:#D32F2F; font-size: 14px; border:2px dashed #D32F2F; margin-bottom:15px; border-radius: 6px;">
                📲 <b>Mobile User:</b> Your phone may block automatic downloads.<br>
                Please <b>LONG-PRESS</b> the image below and select "Save Image" or "Download".
            </div>
            <img src="${image}" style="max-width:100%; box-shadow:0px 4px 10px rgba(0,0,0,0.2);">`;
        }
        btn.innerHTML = originalText;
    }).catch(function(error){
        alert("Download failed. Please try again!");
        console.log(error);
        btn.innerHTML = originalText;
    });
}

// --- NEW FEATURE: DIRECT MOBILE SHARE ---
// --- NEW FEATURE: DIRECT MOBILE SHARE ---
function shareImage() {
    window.scrollTo(0, 0); 
    
    // FIX: This now looks for either the A4 page OR the standard note content!
    let noteToCapture = document.getElementById("a4-page") || document.getElementById("noteContent"); 
    
    if (!noteToCapture) {
        alert("Could not find the document to share!");
        return;
    }

    let btn = event.target || event.srcElement;
    let originalText = btn.innerHTML;
    btn.innerHTML = "⏳ Preparing...";

    html2canvas(noteToCapture, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#FAFAFA" }).then(function(canvas) {
        
        canvas.toBlob(function(blob) {
            let file = new File([blob], "DeliveryNote.png", { type: "image/png" });

            if (navigator.canShare && navigator.canShare({ files: [file] })) {
                navigator.share({
                    files: [file],
                    title: 'రైతు డెలివరీ నోటు',
                    text: 'Here is the Delivery Note from InstantFarms.'
                }).then(() => {
                    console.log('Shared successfully');
                    btn.innerHTML = originalText;
                }).catch((error) => {
                    console.log('Sharing failed or cancelled', error);
                    btn.innerHTML = originalText;
                });
            } else {
                // Fallback for laptops
                alert("Your device doesn't support direct sharing. Please use the 'Download' button instead!");
                btn.innerHTML = originalText;
            }
        }, "image/png");

    }).catch(function(error){
        alert("Error preparing image for share. Please try again!");
        console.log(error);
        btn.innerHTML = originalText;
    });
}