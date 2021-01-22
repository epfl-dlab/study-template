window.browser = require("webextension-polyfill");

/* Loads WebScience stuff */
const WebScienceDebugging = require("../WebScience/Utilities/Debugging.js");
WebScienceDebugging.enableDebugging();
let debugLog = WebScienceDebugging.getDebuggingLog("study");
const WebScienceLifecycle = require("../WebScience/Utilities/Lifecycle.js");

/* Loads browser scripts*/
const PageNavigation = require("./browser_scripts/PageNavigation.js");
const HTTPRequests = require("./browser_scripts/HTTPRequests.js");
const YouTubeUsage = require("./browser_scripts/YouTubeUsage.js");


/* Creates partial functions to send data, done to modularize the send data stuff */
const sd = require("./send_data.js");
const sendPageNavigation = () => {
    return sd.senddata("pagenav",
        PageNavigation.getStudyDataAsObjectAndClear)
};
const sendHTTPRequests = () => {
    return sd.senddata("httpreq",
        HTTPRequests.getStudyDataAsObjectAndClear)
};

const sendYouTubeUsage = () => {
    return sd.senddata("ytusage",
        YouTubeUsage.getStudyDataAsObjectAndClear)
};


function stopStudy() {
    // TODO -- send Telemetry message to delete remote data, and uninstall
    debugLog("Ending study");
}

async function runStudy() {


    await PageNavigation.runStudy({
        domains: ["youtube.com"],
        trackUserAttention: true
    });

    await HTTPRequests.runStudy();

    await YouTubeUsage.runStudy();

    setInterval(sendPageNavigation, 100000);
    setInterval(sendHTTPRequests, 100000);
    setInterval(sendYouTubeUsage, 100000);
}

WebScienceLifecycle.registerStudyStartedListener(runStudy);
WebScienceLifecycle.registerStudyEndedListener(stopStudy);
WebScienceLifecycle.requestBegin();
