window.browser = require("webextension-polyfill");

const Rally = require("@mozilla/rally");
const rally = new Rally();

rally.initialize(
    // A sample key id used for encrypting data.
    "sample-invalid-key-id",
    // A sample *valid* JWK object for the encryption.
    {
        "kty": "EC",
        "crv": "P-256",
        "x": "f83OJ3D2xF1Bg8vub9tLe1gHMzV76e8Tus9uPHvRVEU",
        "y": "x_FEzRu9m36HLN_tue659LNpXW6pCyStikYjKIWI5a0",
        "kid": "Public key used in JWS spec Appendix A.3 example"
    },
    // The following constant is automatically provided by
    // the build system.
    __ENABLE_DEVELOPER_MODE__,
);

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
