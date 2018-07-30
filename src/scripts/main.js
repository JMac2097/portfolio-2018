/*jshint esversion: 6 */ 

let showHomeBackground = true;
const body = document.body;

document.addEventListener('DOMContentLoaded', checkForHomeBackground);

function checkForHomeBackground() {
    if(showHomeBackground) {
        body.classList.add("bg-image");
    }
};