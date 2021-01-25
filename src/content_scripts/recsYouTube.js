(
    async function () {

        function resizeObs() {
            let ro = new ResizeObserver(entries => {
                getRecs("resize")
            });
            ro.observe(document.body.querySelector("div#secondary"));
        }

        function getRecs(origin = "load") {

            let domLinkElements = Array.from(document.body
                .querySelectorAll(".ytd-compact-video-renderer .details," +
                    ".ytd-compact-radio-renderer .details"));

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


            sendRecEvent(url_src, loadtime, recs, origin);

        }

        function sendRecEvent(url_src, loadtime, recs, origin) {

            if (url_src.match(/www\.youtube\.com\/watch\?v/gi) !== null) {
                console.log({
                    type: "recsYoutube",
                    url_src: url_src,
                    recs: origin,
                    loadTime: loadtime
                });


                browser.runtime.sendMessage({
                    type: "recsYoutube",
                    url_src: url_src,
                    recs: recs,
                    loadTime: loadtime,
                    origin: origin
                });
            }
        }

        const waitMs = 2000;
        console.log("recsYouTube.js");

        document.body.addEventListener("yt-navigate-start", function (event) {
            setTimeout(getRecs, waitMs, "yt-navigate-start");
        });
        document.body.addEventListener("yt-navigate-end", function (event) {
            setTimeout(getRecs, waitMs, "yt-navigate-end");
        });

        /** sleep and then check for news video */
        setTimeout(getRecs, waitMs, "load");
        setTimeout(resizeObs, waitMs);

    }()
);