(
    async function () {
        console.log("comsYouTube.js");
        /** Comments, obtained through MutationObserver **/
            // Select the node that will be observed for mutations
        const targetNode = document.querySelector('body');

        // Options for the observer (which mutations to observe)
        const config = {attributes: true, childList: true, subtree: true};

        // Callback function to execute when mutations are observed
        const callback = function (mutationsList, observer) {
            // Use traditional 'for loops' for IE 11

            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    const target = mutation.target.querySelector("ytd-comment-renderer");

                    if (target != null && target != undefined) {
                        let vote_count = -1;
                        try {
                            vote_count = target.querySelector("#vote-count-middle").textContent.trim();
                        } catch (err) { // no votes
                            vote_count = 0
                        }

                        const comment = {
                            "source_url": window.location.href,
                            "author_link": target.querySelector("a#author-text").getAttribute("href"),
                            "author_text": target.querySelector("a#author-text").textContent.trim(),
                            "content_text": target.querySelector("#content-text").textContent.trim(),
                            "vote_count": vote_count
                        };

                        const loadTime = Date.now();

                        const url_src = window.location.href;

                        sendComment(JSON.stringify(comment), loadTime, url_src);
                    }
                }
            }
        };


        function sendComment(comment, time, url_src) {

            if (url_src.match(/www\.youtube\.com\/watch\?v/gi) !== null) {

                console.log({
                    type: "comment",
                    loadTime: time,
                    url_src: url_src
                });
                browser.runtime.sendMessage({
                    type: "comment",
                    comment: comment,
                    loadTime: time,
                    url_src: url_src
                });
            }
        }

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }()
);
