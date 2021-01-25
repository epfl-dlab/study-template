(
    async function () {

        function resizeObs() {
            let ro = new ResizeObserver(entries => {
                getSearch("resize")
            });
            ro.observe(document.body.querySelector("#contents"));
        }

        function getSearch(origin = "load") {

            let domLinkElements = Array.from(
                document.body.querySelectorAll("#contents > ytd-video-renderer," +
                    "#contents > ytd-playlist-renderer,#contents > ytd-search-pyv-renderer," +
                    "#contents > ytd-channel-renderer"));

            function getContent(element) {

                let is_video = element.querySelector("ytd-video-renderer") !== null;
                let is_playlist = element.querySelector("ytd-playlist-renderer") !== null;
                let is_sponsored = element.querySelector("ytd-pyv-renderer") !== null;
                let is_channel = element.querySelector("ytd-pyv-renderer") !== null;

                return {
                    "is_video": is_video,
                    "is_playlist": is_playlist,
                    "is_sponsored": is_sponsored,
                    "is_channel": is_channel,
                    "raw_html": element.innerHTML
                }
            }

            let url_src = window.location.href;

            let searches = JSON.stringify(domLinkElements.map(x => getContent(x)));

            let loadTime = Date.now();


            sendSearchEvent(url_src, loadTime, searches, origin);

        }

        function sendSearchEvent(url_src, loadTime, recs, origin) {
            if (url_src.match(/www\.youtube\.com\/results\?/gi) !== null) {
                console.log({
                    type: "search",
                    url_src: url_src,
                    loadTime: loadTime,
                    origin: origin
                });
                browser.runtime.sendMessage({
                    type: "search",
                    url_src: url_src,
                    search: recs,
                    loadTime: loadTime,
                    origin: origin
                });
            }
        }

        const waitMs = 2000;
        console.log("searchYouTube.js");

        /** sleep and then check for search videos */
        setTimeout(getSearch, waitMs, "load");
        setTimeout(resizeObs, waitMs);
    }()
);