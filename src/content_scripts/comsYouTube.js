(
    async function () {
        console.log("1231123");
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
                    var target = mutation.target.querySelector("ytd-comment-renderer");

                    if (target != null && target != undefined) {
                        let vote_count = -1;
                        try {
                            vote_count = target.querySelector("#vote-count-middle").textContent.trim();
                        } catch (err) { // no votes
                            vote_count = 0
                        }

                        let comment = {
                            "source_url": window.location.href,
                            "author_link": target.querySelector("a#author-text").getAttribute("href"),
                            "author_text": target.querySelector("a#author-text").textContent.trim(),
                            "content_text": target.querySelector("#content-text").textContent.trim(),
                            "vote_count": vote_count
                        };

                        console.log(comment);

                        let loadTime = Date.now();

                        sendComment(JSON.stringify(comment), loadTime);
                    }
                }
            }
        };


        function sendComment(comment, time) {

            browser.runtime.sendMessage({
                type: "comment",
                comment: comment,
                loadTime: time
            });
        }

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);

        // Start observing the target node for configured mutations
        observer.observe(targetNode, config);
    }()
);