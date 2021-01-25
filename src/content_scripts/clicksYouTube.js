(
    async function () {
        console.log("clicksYouTube.js");
        var currentPageClicksYouTube = null;

        document.body.addEventListener("mousedown", function (event) {

            currentPageClicksYouTube = window.location.href;
        });

        document.body.addEventListener("click", function (event) {
            var url_src = currentPageClicksYouTube; //currentPageClicksYouTube;
            let clickTime = Date.now();
            var node = event.target;
            var logged_off = document.body.querySelector("button#avatar-btn") === null;
            var higher_local_name = node.localName;
            while (node != undefined && node.localName != 'a') {
                node = node.parentNode;
            }
            if (node != undefined && node != null) {
                sendClickEvent(url_src, node.href, clickTime, higher_local_name, logged_off)
            }
        });

        function sendClickEvent(url_src, url_dst, clickTime, higher_local_name, logged_off) {
            console.log({
                type: "YoutubeLinkClick",
                url_src: url_src,
                loadTime: clickTime,
                url_dst: url_dst,
                node: higher_local_name,
                logged_off: logged_off
            });
            browser.runtime.sendMessage({
                type: "YoutubeLinkClick",
                url_src: url_src,
                loadTime: clickTime,
                url_dst: url_dst,
                node: higher_local_name,
                logged_off: logged_off
            });
        }
    }()
);