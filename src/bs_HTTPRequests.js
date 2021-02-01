import * as Debugging from "../WebScience/Utilities/Debugging.js"
import * as Storage from "../WebScience/Utilities/Storage.js"

const debugLog = Debugging.getDebuggingLog("HTTPRequests");
let storage = null;

export async function runStudy() {
    debugLog("HTTPRequests.js");

    storage = await (new Storage.KeyValueStorage("HTTPRequests")).initialize();

    async function getStats(requestDetails) {

        const url_string = requestDetails.url;
        const raw = JSON.stringify(requestDetails);
        // let url = new URL(url_string);
        const date = Date.now();

        const decoder = new TextDecoder("utf-8");
        const encoder = new TextEncoder();
        const filter = browser.webRequest.filterResponseData(requestDetails.requestId);

        const data = [];
        filter.ondata = event => {
            data.push(event.data);
        };

        filter.onstop = event => {
            let str = "";
            if (data.length == 1) {
                str = decoder.decode(data[0]);
            } else {
                for (let i = 0; i < data.length; i++) {
                    const stream = (i == data.length - 1) ? false : true;
                    str += decoder.decode(data[i], {stream});
                }
            }
            // filter.write(str);
            const response = str;
            filter.write(encoder.encode(str));
            filter.close();

            const schema_v = {
                url_string: url_string,
                date: date,
                raw: raw,
                response: response
            };


            // console.log(schema_v);
            storage.set(date.toString() + url_string, schema_v);
        };
    }

    browser.webRequest.onBeforeRequest.addListener(getStats,
        {
            urls: ["*://*.youtube.com/api/stats/*",
                "*://*.youtube.com/youtubei/v1/*"]
        }, ["blocking"]);

}


export async function getStudyDataAsObjectAndClear() {
    const output = {};
    const arr = [];

    if (storage != null) {

        await storage.iterate((value, key, iterationNumber) => {
            arr.push(key);
            const tmp = JSON.stringify(value);
            output[key] = tmp;

        });

        for (const v in arr) {
            storage.storageInstance.removeItem(arr[v]).then().catch(function (err) {
                // This code runs if there were any errors
                console.log(err);
            });
        }
        return JSON.stringify(output);
    }
    return null;
}
