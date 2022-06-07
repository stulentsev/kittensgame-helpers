// ==UserScript==
// @name     Auto-Convert Resources
// @version  1
// @grant    GM.getValue
// @grant    GM.setValue
// @include  https://kittensgame.com/web/*
// ==/UserScript==

function restoreSettings() {
    document.getElementById("gm-rac-saveSettings").addEventListener("click", saveSettings);

    GM.getValue("gmRacSettings").then(ls => {
        let saved = JSON.parse(ls || "{}") || {};
        [
            "gm-rac-praiseSun",
            "gm-rac-convertCatnip",
            "gm-rac-convertWood",
            "gm-rac-convertMinerals",
            "gm-rac-convertIron",
            "gm-rac-makeSteel",
            "gm-rac-makeConcrete",
            "gm-rac-makeGear",
            "gm-rac-makeAlloy",
            "gm-rac-makeScaffold",
            "gm-rac-makeShip",
            "gm-rac-makeParchments",
            "gm-rac-makeManuscripts",
            "gm-rac-makeCompendiums",
            "gm-rac-makeBlueprints",
            "gm-rac-sendHunters",
            "gm-rac-autoBuyBuildings"

        ].forEach(elemId => {
            document.getElementById(elemId).checked = !!saved[elemId];
        });

        [
            "gm-rac-neededBuildings"
        ].forEach(elemId => {
            document.getElementById(elemId).value = saved[elemId];
        })
    })
}

function saveSettings() {
    let saved = {};

    [
        "gm-rac-praiseSun",
        "gm-rac-convertCatnip",
        "gm-rac-convertWood",
        "gm-rac-convertMinerals",
        "gm-rac-convertIron",
        "gm-rac-makeSteel",
        "gm-rac-makeConcrete",
        "gm-rac-makeGear",
        "gm-rac-makeAlloy",
        "gm-rac-makeScaffold",
        "gm-rac-makeShip",
        "gm-rac-makeParchments",
        "gm-rac-makeManuscripts",
        "gm-rac-makeCompendiums",
        "gm-rac-makeBlueprints",
        "gm-rac-sendHunters",
        "gm-rac-autoBuyBuildings"

    ].forEach(elemId => {
        saved[elemId] = document.getElementById(elemId).checked;
    });

    [
        "gm-rac-neededBuildings"
    ].forEach(elemId => {
        saved[elemId] = document.getElementById(elemId).value;
    });
    GM.setValue("gmRacSettings", JSON.stringify(saved));
}

function getReactElement(reactid) {
    let elems = document.querySelectorAll(`[data-reactid='${reactid}']`);
    if (elems.length) {
        return elems[0]
    }
    return null;
}

function isResourceAtCap(selector) {
    let curValueNodes = document.querySelectorAll(`.${selector} .resAmount`);
    if(!curValueNodes.length) {
        return false;
    }
    let curValue = curValueNodes[0].innerText;

    let maxValue = document.querySelectorAll(`.${selector} .maxRes`)[0].innerText.slice(1); // drop leading slash
    return curValue === maxValue;
}

function convertResource(obj) {
    let {triggerId, buttonId, toggleId, condition, sourceSelector} = obj;

    let toggle = document.getElementById(toggleId);

    if (toggle && toggle.checked) {
        let trigger = getReactElement(triggerId);
        let btn = getReactElement(buttonId);
        let predicatesSatisfied = (!condition || condition(trigger, btn)) &&
            (!sourceSelector || isResourceAtCap(sourceSelector));
        if (trigger && btn && predicatesSatisfied) {
            btn.click();
        }
    }

    setTimeout(function () {
        convertResource(obj)
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
        food: {triggerId: ".0.5.1.0.0.6.0", buttonId: ".0.5.1.0.0.6.0", toggleId: "gm-rac-convertCatnip", sourceSelector: "resource_catnip"},
        beam: {triggerId: ".0.5.1.0.3.6.0", buttonId: ".0.5.1.0.3.6.0", toggleId: "gm-rac-convertWood", sourceSelector: "resource_wood"},
        slab: {triggerId: ".0.5.1.0.4.6.0", buttonId: ".0.5.1.0.4.6.0", toggleId: "gm-rac-convertMinerals", sourceSelector: "resource_minerals"},
        plate: {triggerId: ".0.5.1.0.5.6.0", buttonId: ".0.5.1.0.5.6.0", toggleId: "gm-rac-convertIron", sourceSelector: "resource_iron"},
        steel: {triggerId: ".0.5.1.0.6.6.0", buttonId: ".0.5.1.0.6.6.0", toggleId: "gm-rac-makeSteel", sourceSelector: "resource_coal"},
        concrete: {triggerId: ".0.5.1.0.7.3.0.1", buttonId: ".0.5.1.0.7.6.0", toggleId: "gm-rac-makeConcrete"},
        gear: {triggerId: ".0.5.1.0.8.5.0.1", buttonId: ".0.5.1.0.8.6.0", toggleId: "gm-rac-makeGear"},
        alloy: {triggerId: ".0.5.1.0.9.6.0", buttonId: ".0.5.1.0.9.6.0", toggleId: "gm-rac-makeAlloy", sourceSelector: "resource_titanium"},
        scaffold: {triggerId: ".0.5.1.0.b.5.0.1", buttonId: ".0.5.1.0.b.6.0", toggleId: "gm-rac-makeScaffold"},
        ship: {triggerId: ".0.5.1.0.c.3.0.1", buttonId: ".0.5.1.0.c.6.0", toggleId: "gm-rac-makeShip"},
        parchment: {triggerId: ".0.5.1.0.f.5.0.1", buttonId: ".0.5.1.0.f.6.0", toggleId: "gm-rac-makeParchments"},
        manuscripts: {triggerId: ".0.5.1.0.g.4.0.1", buttonId: ".0.5.1.0.g.6.0", toggleId: "gm-rac-makeManuscripts"},
        compendiums: {triggerId: ".0.5.1.0.h.3.0.1", buttonId: ".0.5.1.0.h.6.0", toggleId: "gm-rac-makeCompendiums"},
        blueprint: {triggerId: ".0.5.1.0.i.3.0.1", buttonId: ".0.5.1.0.i.6.0", toggleId: "gm-rac-makeBlueprints"},
        hunters: {triggerId: ".0.2.0.1.0", buttonId: ".0.2.0.1.0", toggleId: "gm-rac-sendHunters", sourceSelector: "resource_manpower"},
        faith: {triggerId: ".0.3.0", buttonId: ".0.3.0", toggleId: "gm-rac-praiseSun", sourceSelector: "resource_faith"}
    }

    Object.values(buttons).forEach(obj => {
        convertResource(obj)
    });

    clickButton("observeBtn");
}

function startBuyers() {
    let toggle = document.getElementById("gm-rac-autoBuyBuildings");
    if (toggle && toggle.checked) {
        let itemsToBuy = document.getElementById("gm-rac-neededBuildings").value.split("\n").map(s => s.trim()).filter(s => s !== "");
        let activeButtons = [...document.querySelectorAll(".bldGroupContainer .btn:not(.disabled)")]
            .filter(elem => itemsToBuy.some(itemName => elem.innerText.includes(itemName)));
        if (activeButtons.length) {
            activeButtons[0].click();
        }
    }

    setTimeout(startBuyers, 3000);
}

function startAutoSaver() {
    saveSettings();
    setTimeout(startAutoSaver, 10000);
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
            <li><input type="checkbox" id="gm-rac-praiseSun" /><label for="gm-rac-praiseSun">Praise sun</label></li>
            <li>
                <input type="checkbox" id="gm-rac-convertCatnip" /><label for="gm-rac-convertCatnip">Make wood</label>
<!--                <input type="checkbox" id="gm-rac-convertCatnipAtCap" /><label for="gm-rac-convertCatnipAtCap">At cap</label>-->
            </li>
            <li>
                <input type="checkbox" id="gm-rac-convertWood" /><label for="gm-rac-convertWood">Make beam</label>
<!--                <input type="checkbox" id="gm-rac-convertWoodAtCap" /><label for="gm-rac-convertWoodAtCap">At cap</label>-->
            </li>
            <li>
                <input type="checkbox" id="gm-rac-convertMinerals" /><label for="gm-rac-convertMinerals">Make slab</label>
<!--                <input type="checkbox" id="gm-rac-convertMineralsAtCap" /><label for="gm-rac-convertMineralsAtCap">At cap</label>-->
            </li>
            <li>
                <input type="checkbox" id="gm-rac-convertIron" /><label for="gm-rac-convertIron">Make plate</label>
<!--                <input type="checkbox" id="gm-rac-convertIronAtCap" /><label for="gm-rac-convertIronAtCap">At cap</label>-->
            </li>
            <li><input type="checkbox" id="gm-rac-makeSteel" /><label for="gm-rac-makeSteel">Make steel</label></li>
            <li><input type="checkbox" id="gm-rac-makeConcrete" /><label for="gm-rac-makeConcrete">Make concrete</label></li>
            <li><input type="checkbox" id="gm-rac-makeGear" /><label for="gm-rac-makeGear">Make gear</label></li>
            <li><input type="checkbox" id="gm-rac-makeAlloy" /><label for="gm-rac-makeAlloy">Make alloy</label></li>
            <li><input type="checkbox" id="gm-rac-makeScaffold" /><label for="gm-rac-makeScaffold">Make scaffold</label></li>
            <li><input type="checkbox" id="gm-rac-makeShip" /><label for="gm-rac-makeShip">Make ship</label></li>
            <li><input type="checkbox" id="gm-rac-makeParchments" /><label for="gm-rac-makeParchments">Make parchments</label></li>
            <li><input type="checkbox" id="gm-rac-makeManuscripts" /><label for="gm-rac-makeManuscripts">Make manuscripts</label></li>
            <li><input type="checkbox" id="gm-rac-makeCompendiums" /><label for="gm-rac-makeCompendiums">Make compendiums</label></li>
            <li><input type="checkbox" id="gm-rac-makeBlueprints" /><label for="gm-rac-makeBlueprints">Make blueprints</label></li>
            <li><input type="checkbox" id="gm-rac-sendHunters" /><label for="gm-rac-sendHunters">Send hunters</label>
            <li><input type="checkbox" id="gm-rac-autoBuyBuildings" /><label for="gm-rac-autoBuyBuildings">Auto-buy buildings</label></li>
            <li>
                <textarea id="gm-rac-neededBuildings" style="width:292px;height:138px"></textarea>    
            </li>
            <li><input type="button" id="gm-rac-saveSettings" value="Save settings" /></li>
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
    restoreSettings();
    startConverters();
    startBuyers();
    startAutoSaver();
})

