// ==UserScript==
// @name     Auto-Convert Resources
// @version  1
// @grant    none
// ==/UserScript==


function getReactElement(reactid) {
    var elems = document.querySelectorAll(`[data-reactid='${reactid}']`);
    if(elems.length) {
        return elems[0]
    }
    return null;
}

function convertResource(trigger_reactid, button_reactid, condition) {
    let trigger = getReactElement(trigger_reactid);
    let btn = getReactElement(button_reactid);
    if(trigger && btn && (!condition || condition(trigger, btn))) {
        btn.click();
    }
    setTimeout(function() { convertResource(trigger_reactid, button_reactid, condition) }, 3000)
}

function clickButton(id) {
    let elem = document.getElementById(id);
    if(elem) {
        elem.click();
    }
    setTimeout(function() { clickButton(id) }, 3000)
}


console.log("starting the auto-converter");

const buttons = {
    food10button: [".0.5.1.0.0.5.0.1", ".0.5.1.0.0.6.0"],
    beam10button: ".0.5.1.0.3.5.0.1",
    slab10button: ".0.5.1.0.4.5.0.1",
    steel01button: ".0.5.1.0.6.3.0.1",
    manuscript01button: ".0.5.1.0.g.3.0.1",
    compendium01button: ".0.5.1.0.h.3.0.1",

    parchment: [".0.5.1.0.f.3.0.1", ".0.5.1.0.f.6.0"],

    hunters: [".0.2.0.1.0", ".0.2.0.1.0", elem => parseInt(elem.innerText) >= 25]
}

Object.values(buttons).forEach(ids => {
    let trigger_reactid;
    let button_reactid;
    let condition;
    if(typeof(ids) === "string") {
        trigger_reactid = ids;
        button_reactid = ids;
    } else {
        trigger_reactid = ids[0];
        button_reactid = ids[1] || ids[0];
        condition = ids[2];
    }

    convertResource(trigger_reactid, button_reactid, condition)
});

clickButton("observeBtn");
