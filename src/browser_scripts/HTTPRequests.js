import * as Debugging from "../../WebScience/Utilities/Debugging.js"
import * as Storage from "../../WebScience/Utilities/Storage.js"

const debugLog = Debugging.getDebuggingLog("HTTPRequests");

/**
 * A KeyValueStorage object for data associated with the study.
 * @type {Object}
 * @private
 */
var storage = null;


/**
 * This sets a listener to get out outgoing http requests made to the youtube api.
 * @returns {Promise<void>}
 */
export async function runStudy() {

    storage = await (new Storage.KeyValueStorage("HTTPRequests")).initialize();

    async function getStats(requestDetails) {
        console.log("Loading: " + requestDetails.url);
        let url_string = requestDetails.url;
        let url = new URL(url_string);
        let date = Date.now();
        let schema_v = {
            raw: url_string,
            date: date
        };
        storage.set(date.toString(), schema_v);
    }

        browser.webRequest.onBeforeRequest.addListener(getStats, {urls: ["*://*.youtube.com/api/stats/*"]}
    );

}

/* Utilities */

/**
 * Retrieve the study data as an object. Clears sessions that are already complete.
 * @returns {(Object|null)} - The study data, or `null` if no data
 * could be retrieved.
 */
export async function getStudyDataAsObjectAndClear() {
    let output = {};
    let arr = [];

    if (storage != null) {

        await storage.iterate((value, key, iterationNumber) => {
            arr.push(key);
            let tmp = JSON.stringify(value);
            output[key] = tmp;

        });

        for (let v in arr) {
            // console.log("removed", arr[v]);
            storage.storageInstance.removeItem(arr[v]).then().catch(function (err) {
                // This code runs if there were any errors
                console.log(err);
            });
        }
        return JSON.stringify(output);
    }
    return null;
}
