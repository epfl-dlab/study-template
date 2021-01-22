(
    async function () {
        console.log("vmd7");

        /** @constant {number} milliseconds */
        const waitMs = 2000;

        document.body.addEventListener("yt-navigate-start", function (event) {
            setTimeout(getMetadata, waitMs);
        });
        document.body.addEventListener("yt-navigate-finish", function (event) {
            setTimeout(getMetadata, waitMs);
        });

        setTimeout(getMetadata, waitMs);

        function getMetadata() {
            // TODO: ADD EXCEPTIONS
            /* Keywords seem to be obsolete now! Some videos have "hashtags," other don't. Pretty messy */
            // let keywords = null;
            // Array.from(document.body.querySelectorAll('meta[property="og:video:tag"]'));
            // keywords = keywords.map(e => e.getAttribute("content"));
            // keywords = keywords.join(";");

            let metadata_dict = JSON.parse(document.body.querySelector("#scriptTag").textContent);
            let description = metadata_dict["description"];
            let genre = metadata_dict["genre"];
            let title = metadata_dict["name"];

            let metadata_dict_raw = JSON.stringify(metadata_dict);

            let channel = document.body.querySelector('.ytd-channel-name').querySelector('a');
            let channel_link = channel.getAttribute("href");
            let channel_name = channel.textContent;

            let views = document.body.querySelector("span.view-count").textContent;
            views = parseInt(views.replace(/[ ,(views)]+/g, "").trim());

            let date = document.body.querySelector("#date").textContent;
            date = date.replace(/•/, "");

            let likes = document.body.querySelector(".ytd-sentiment-bar-renderer > div.paper-tooltip");
            likes = likes.textContent.trim().replace(/[ ,]+/g, "").split("/");
            likes = likes.map(e => parseInt(e.trim()));
            let dislikes = likes[1];
            likes = likes[0];

            let loadTime = Date.now();

            let url_src = window.location.href;

            sendMetadataEvent(loadTime, title, likes, dislikes, description,
                channel_link, channel_name, date, views, genre, url_src, metadata_dict_raw)

        }

        function sendMetadataEvent(loadtime, title, likes, dislikes, description, channel_link,
                                   channel_name, date, views, genre, url_src, metadata_dict_raw) {
            console.log("title");
            browser.runtime.sendMessage({
                type: "videoMetaData",
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

    }()
);