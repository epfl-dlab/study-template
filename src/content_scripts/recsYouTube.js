(
    async function () {
        const waitMs = 2000;

        document.body.addEventListener("yt-navigate-start", function (event) {
            setTimeout(getRecs, waitMs);
        });
        document.body.addEventListener("yt-navigate-end", function (event) {
            setTimeout(getRecs, waitMs);
        });
        /** sleep and then check for news video */
        setTimeout(getRecs, waitMs);

        function getRecs() {
            console.log("gerreck");

            let domLinkElements = Array.from(document.body
                .querySelectorAll(".ytd-compact-video-renderer .details," +
                    ".ytd-compact-radio-renderer .details"));
            console.log(domLinkElements);

            function getContent(element) {
                let title = element.querySelector("span").getAttribute("aria-label");
                let kind = "video";
                if (title == null || title == undefined) {
                    title = element.querySelector("span").getAttribute("title");
                    kind = "playlist";
                }

                let link = element.querySelector("a").getAttribute("href");


                return {"title": title, "link": link, "kind": kind}
            }

            let url_src = window.location.href;

            let recs = JSON.stringify(domLinkElements.map(x => getContent(x)));
            //JSON.stringify(domLinkElements.map(x => getContent(x)));

            let loadtime = Date.now();


            console.log(recs);

            sendRecEvent(url_src, loadtime, recs);

        }

        function sendRecEvent(url_src, loadtime, recs) {
            console.log({
                type: "recsYoutube",
                url_src: url_src,
                recs: recs,
                loadTime: loadtime
            });
            browser.runtime.sendMessage({
                type: "recsYoutube",
                url_src: url_src,
                recs: recs,
                loadTime: loadtime
            });
        }

    }()
);