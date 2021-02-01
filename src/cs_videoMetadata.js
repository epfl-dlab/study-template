(
    async function () {
        function getMetadata(origin = "load") {
            // TODO: ADD EXCEPTIONS
            /* Keywords seem to be obsolete now! Some videos have "hashtags," other don't. Pretty messy */
            // let keywords = null;
            // Array.from(document.body.querySelectorAll('meta[property="og:video:tag"]'));
            // keywords = keywords.map(e => e.getAttribute("content"));
            // keywords = keywords.join(";");

            const metadata_dict = JSON.parse(document.body.querySelector("#scriptTag").textContent);
            const description = metadata_dict["description"];
            const genre = metadata_dict["genre"];
            const title = metadata_dict["name"];


            const subscriber_button = document.body.querySelector("#content #subscribe-button").innerHTML;

            const metadata_dict_raw = JSON.stringify(metadata_dict);

            const channel = document.body.querySelector('.ytd-channel-name').querySelector('a');
            const channel_link = channel.getAttribute("href");
            const channel_name = channel.textContent;

            let views = document.body.querySelector("span.view-count").textContent;
            views = parseInt(views.replace(/[ ,(views)]+/g, "").trim());

            let date = document.body.querySelector("#date").textContent;
            date = date.replace(/•/, "");

            let likes = document.body.querySelector(".ytd-sentiment-bar-renderer > div.paper-tooltip");
            likes = likes.textContent.trim().replace(/[ ,]+/g, "").split("/");
            likes = likes.map(e => parseInt(e.trim()));
            const dislikes = likes[1];
            likes = likes[0];

            const loadTime = Date.now();

            const url_src = window.location.href;

            sendMetadataEvent(loadTime, title, likes, dislikes, description, origin, subscriber_button,
                channel_link, channel_name, date, views, genre, url_src, metadata_dict_raw)

        }


        function sendMetadataEvent(loadtime, title, likes, dislikes, description, origin, subscriber_button,
                                   channel_link, channel_name, date, views, genre, url_src, metadata_dict_raw) {


            if (url_src.match(/www\.youtube\.com\/watch\?v/gi) !== null) {

                console.log({
                    type: "videoMetaData",
                    origin: origin,
                    title: title
                });

                browser.runtime.sendMessage({
                    type: "videoMetaData",
                    origin: origin,
                    loadTime: loadtime,
                    title: title,
                    likes: likes,
                    dislikes: dislikes,
                    description: description,
                    channel_link: channel_link,
                    channel_name: channel_name,
                    date: date,
                    views: views,
                    genre: genre,
                    url_src: url_src,
                    metadata_dict_raw: metadata_dict_raw
                });

            }

        }


        console.log("videoMetadata.js");

        const waitMs = 2000;
        document.body.addEventListener("yt-navigate-start", function (event) {
            setTimeout(getMetadata, waitMs, "yt-navigate-start");
        });
        document.body.addEventListener("yt-navigate-finish", function (event) {
            setTimeout(getMetadata, waitMs, "yt-navigate-finish");
        });

        setTimeout(getMetadata, waitMs, "load");
    }()
);