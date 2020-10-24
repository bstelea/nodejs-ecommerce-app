"use strict";

let url = window.location.search;
let getQuery = url.split('?')[1];
let params = getQuery.split('&');

if (addEventListener) {
    window.addEventListener('load', retainGetValues);
} else {
    window.attachEvent('onload', retainGetValues);
}

function retainGetValues() {
    let sortSelect = document.querySelector("#sort");
    let categorySelect = document.querySelector("#category");
    let startPriceNumber = document.querySelector("#startPrice");
    let endPriceNumber = document.querySelector("#endPrice");

    let numberOfParams = params.length;
    for (let i = 0; i < numberOfParams; i++) {
        
        if (params[i].indexOf('sort') !== -1) {
            sortSelect.value = params[i].substring(5);
        } else if (params[i].indexOf('category') !== -1) {
            categorySelect.value = params[i].replace("+", " ").substring(9);
        } else if (params[i].indexOf('startPrice') !== -1) {
            startPriceNumber.value = params[i].substring(11);
        } else if (params[i].indexOf('endPrice') !== -1) {
            endPriceNumber.value = params[i].substring(9);
        } 
    }
}

