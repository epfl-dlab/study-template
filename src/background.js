window.browser = require("webextension-polyfill");

/* Loads WebScience stuff */
const WebScienceDebugging = require("../WebScience/Utilities/Debugging.js");
WebScienceDebugging.enableDebugging();
let debugLog = WebScienceDebugging.getDebuggingLog("study");
const WebScienceLifecycle = require("../WebScience/Utilities/Lifecycle.js");

/* Loads browser scripts*/
const PageNavigation = require("./browser_scripts/PageNavigation.js");

/* Creates partial functions to send data, done to modularize the send data stuff */
const sd = require("./send_data.js");
const sendPageNavigation = () => {
    return sd.senddata("pagenav",
        PageNavigation.getStudyDataAsObjectAndClear)
};

function stopStudy() {
    // TODO -- send Telemetry message to delete remote data, and uninstall
    debugLog("Ending study");
}

async function runStudy() {

    // Configure navigation collection
    PageNavigation.runStudy({
        domains: ["youtube.com"],
        trackUserAttention: true
    });

    setInterval(sendPageNavigation, 10000);
}

WebScienceLifecycle.registerStudyStartedListener(runStudy);
WebScienceLifecycle.registerStudyEndedListener(stopStudy);
WebScienceLifecycle.requestBegin();
