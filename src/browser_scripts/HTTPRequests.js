import * as Debugging from "../../WebScience/Utilities/Debugging.js"
import * as Storage from "../../WebScience/Utilities/Storage.js"

const debugLog = Debugging.getDebuggingLog("HTTPRequests");
var storage = null;

export async function runStudy() {
    debugLog("HTTPRequests.js");

    storage = await (new Storage.KeyValueStorage("HTTPRequests")).initialize();

    async function getStats(requestDetails) {

        let url_string = requestDetails.url;
        let raw = JSON.stringify(requestDetails);
        // let url = new URL(url_string);
        let date = Date.now();

        let decoder = new TextDecoder("utf-8");
        let encoder = new TextEncoder();
        var filter = browser.webRequest.filterResponseData(requestDetails.requestId);

        let data = [];
        filter.ondata = event => {
            data.push(event.data);
        };

        filter.onstop = event => {
            let str = "";
            if (data.length == 1) {
                str = decoder.decode(data[0]);
            } else {
                for (let i = 0; i < data.length; i++) {
                    let stream = (i == data.length - 1) ? false : true;
                    str += decoder.decode(data[i], {stream});
                }
            }
            // filter.write(str);
            let response = str;
            filter.write(encoder.encode(str));
            filter.close();

            let schema_v = {
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
    let output = {};
    let arr = [];

    if (storage != null) {

        await storage.iterate((value, key, iterationNumber) => {
            arr.push(key);
            let tmp = JSON.stringify(value);
            output[key] = tmp;

        });

        for (let v in arr) {
            storage.storageInstance.removeItem(arr[v]).then().catch(function (err) {
                // This code runs if there were any errors
                console.log(err);
            });
        }
        return JSON.stringify(output);
    }
    return null;
}
