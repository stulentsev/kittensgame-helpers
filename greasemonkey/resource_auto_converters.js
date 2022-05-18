// ==UserScript==
// @name     Auto-Convert Resources
// @version  1
// @grant    none
// ==/UserScript==

function getReactElement(reactid) {
    let elems = document.querySelectorAll(`[data-reactid='${reactid}']`);
    if (elems.length) {
        return elems[0]
    }
    return null;
}

function convertResource(triggerId, actionId, toggleId, condition) {
    let toggle = document.getElementById(toggleId);

    if(toggle && toggle.checked) {
        let trigger = getReactElement(triggerId);
        let btn = getReactElement(actionId);
        if (trigger && btn && (!condition || condition(trigger, btn))) {
            btn.click();
        }
    }

    setTimeout(function () {
        convertResource(triggerId, actionId, toggleId, condition)
    }, 3000)
}

function clickButton(id) {
    let elem = document.getElementById(id);
    if (elem) {
        elem.click();
    }
    setTimeout(function () {
        clickButton(id)
    }, 3000)
}

function startConverters() {
    console.log("starting the helpers...");

    const buttons = {
        food: {triggerId: ".0.5.1.0.0.5.0.1", buttonId: ".0.5.1.0.0.6.0", toggleId: "gm-rac-convertCatnip"},
        beam: {triggerId: ".0.5.1.0.3.3.0.1", buttonId: ".0.5.1.0.3.6.0", toggleId: "gm-rac-convertWood"},
        slab: {triggerId: ".0.5.1.0.4.3.0.1", buttonId: ".0.5.1.0.4.6.0", toggleId: "gm-rac-convertMinerals"},
        plate: {triggerId: ".0.5.1.0.5.3.0.1", buttonId: ".0.5.1.0.5.6.0", toggleId: "gm-rac-convertIron"},
        steel: {triggerId: ".0.5.1.0.6.3.0.1", buttonId: ".0.5.1.0.6.6.0", toggleId: "gm-rac-makeSteel"},
        parchment: {triggerId: ".0.5.1.0.f.3.0.1", buttonId: ".0.5.1.0.f.6.0", toggleId: "gm-rac-makeParchments"},
        manuscripts: {triggerId: ".0.5.1.0.g.3.0.1", buttonId: ".0.5.1.0.g.6.0", toggleId: "gm-rac-makeManuscripts"},
        compendiums: {triggerId: ".0.5.1.0.h.3.0.1", buttonId: ".0.5.1.0.h.6.0", toggleId: "gm-rac-makeCompendiums"},
        hunters: {
            triggerId: ".0.2.0.1.0",
            buttonId: ".0.2.0.1.0",
            toggleId: "gm-rac-sendHunters",
            condition: elem => parseInt(elem.innerText) >= parseInt(document.getElementById("gm-rac-needHunters").value)
        },
    }

    Object.values(buttons).forEach(obj => {
        convertResource(obj.triggerId, obj.buttonId, obj.toggleId, obj.condition)
    });

    clickButton("observeBtn");
}

function startBuyers() {
    let toggle = document.getElementById("gm-rac-autoBuyBuildings");
    if(toggle && toggle.checked) {
        let itemsToBuy = document.getElementById("gm-rac-neededBuildings").value.split("\n").map(s => s.trim()).filter(s => s !== "");
        let activeButtons = [...document.querySelectorAll(".bldGroupContainer .btn:not(.disabled)")]
            .filter(elem => itemsToBuy.some(itemName => elem.innerText.includes(itemName)));
        if(activeButtons.length) {
            activeButtons[0].click();
        }
    }

    setTimeout(startBuyers, 3000);
}

function createUI() {
    let elemDiv = document.createElement('div');
    let leftOffset = document.getElementById('save-link').offsetLeft;
    let topOffset = document.getElementById('gameLog').offsetTop;
    let containerWidth = document.getElementById('versionLink').offsetLeft - leftOffset;
    elemDiv.style.cssText = `position:absolute;left:${leftOffset}px;top:${topOffset}px;width:${containerWidth}px;height:auto;z-index:100;background:#eeeeee;border:2px solid black`;
    document.body.appendChild(elemDiv);
    let html = `
        <ul style="list-style-type: none">
            <li><input type="checkbox" id="gm-rac-convertCatnip" checked /><label for="gm-rac-convertCatnip">Convert catnip</label></li>
            <li><input type="checkbox" id="gm-rac-convertWood" checked /><label for="gm-rac-convertWood">Convert wood</label></li>
            <li><input type="checkbox" id="gm-rac-convertMinerals" checked /><label for="gm-rac-convertMinerals">Convert minerals</label></li>
            <li><input type="checkbox" id="gm-rac-convertIron" checked /><label for="gm-rac-convertIron">Convert iron</label></li>
            <li><input type="checkbox" id="gm-rac-makeSteel" checked /><label for="gm-rac-makeSteel">Make steel</label></li>
            <li><input type="checkbox" id="gm-rac-makeParchments" checked /><label for="gm-rac-makeParchments">Make parchments</label></li>
            <li><input type="checkbox" id="gm-rac-makeManuscripts" checked /><label for="gm-rac-makeManuscripts">Make manuscripts</label></li>
            <li><input type="checkbox" id="gm-rac-makeCompendiums" checked /><label for="gm-rac-makeCompendiums">Make compendiums</label></li>
            <li><input type="checkbox" id="gm-rac-sendHunters" checked /><label for="gm-rac-sendHunters">Send hunters when have </label><input type="number" value="27" id="gm-rac-needHunters" style="width:50px" /></li>
            <li><input type="checkbox" id="gm-rac-autoBuyBuildings" checked /><label for="gm-rac-autoBuyBuildings">Auto-buy buildings</label></li>
            <li>
                <textarea id="gm-rac-neededBuildings" style="width:292px;height:138px">Aqueduct
Catnip Field
Pasture
Barn
Mine
Library
Academy
Log House
Workshop
Lumber Mill
Tradepost</textarea>    
            </li>
        </ul>
    `;
    elemDiv.innerHTML = html;
}

function whenReady(callback) {
    let gameUI = document.getElementById('gameContainerId');
    if (gameUI && gameUI.offsetLeft) {
        callback();
    } else {
        setTimeout(() => whenReady(callback), 3000);
    }
}

whenReady(() => {
    createUI();
    startConverters();
    startBuyers();
})

