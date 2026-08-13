// function goScreen(n){
//     document.getElementById("screen0").style.display="none";
//     document.getElementById("screen1").style.display="none";
//     document.getElementById("screen2").style.display="none";

//     document.getElementById("screen"+n).style.display="block";
// }

// function goToPreview(){
//     showPreview();
//     goScreen(1);
// }

// // auto date
// window.onload=function(){
//     let d=new Date().toISOString().split("T")[0];
//     document.getElementById("date").value=d;
// }
function goScreen(n){
    document.getElementById("screen0").style.display="none";
    document.getElementById("screen1").style.display="none";
    document.getElementById("screen2").style.display="none";
    document.getElementById("screen"+n).style.display="block";
}

function goToPreview(){
    showPreview();
    goScreen(1);
}

// Auto set today's date on load
window.onload=function(){
    let d=new Date().toISOString().split("T")[0];
    document.getElementById("date").value=d;
}