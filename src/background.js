window.browser = require("webextension-polyfill");

/* Loads WebScience stuff */
const WebScienceDebugging = require("../WebScience/Utilities/Debugging.js");
const WebScienceLifecycle = require("../WebScience/Utilities/Lifecycle.js");

WebScienceDebugging.enableDebugging();
const debugLog = WebScienceDebugging.getDebuggingLog("study");

/* Loads browser scripts*/
const PageNavigation = require("./bs_PageNavigation.js");
const HTTPRequests = require("./bs_HTTPRequests.js");
const YouTubeUsage = require("./bs_YouTubeUsage.js");
const sd = require("./bs_SendData.js");

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

    setInterval(sendPageNavigation, 10000);
    setInterval(sendHTTPRequests, 10000);
    setInterval(sendYouTubeUsage, 10000);
}

WebScienceLifecycle.registerStudyStartedListener(runStudy);
WebScienceLifecycle.registerStudyEndedListener(stopStudy);
WebScienceLifecycle.requestBegin();
