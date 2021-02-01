/* This module is temporary! It is being used for debugging purposes. In the future this will be replaced by Rally
* functionality. We are currently sending our data to a AWS instance to get a grip on what's going on */


/**
 * This sends data to a server and flushes the local storage of what is being collected.
 * @param data_identifier {string[]} - A string identifiying where this data comes from
 * @param data_function {function} - A function that gets the data from a content script and cleans the localforage.
 * @returns {Promise<void>}
 */
module.exports.senddata = async function send_data(data_identifier, data_function) {
    const content = await data_function();
    const payload = {
        data_identifier: data_identifier,
        content: content,
        who: "me"
    };

    // console.log(payload)
    const xmlhttp = new XMLHttpRequest();
    const theUrl = "http://34.208.116.92:8080/";
    xmlhttp.open("POST", theUrl);
    xmlhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    await xmlhttp.send(JSON.stringify(payload));

};
