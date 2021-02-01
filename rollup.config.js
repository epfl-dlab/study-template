/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";

export default () => {
    return [
        {
            input: "src/background.js",
            output: {
                file: "dist/background.js"
            },
            plugins: [
                resolve({
                    browser: true,
                }),
                commonjs(),
            ],
        },
        {
            input: "src/cs_clicksYouTube.js",
            output: {
                file: "dist/cs_clicksYouTube.js"
            },
            plugins: [
                resolve({
                    browser: true,
                }),
                commonjs(),
            ],
        },
        {
            input: "src/cs_comsYouTube.js",
            output: {
                file: "dist/cs_comsYouTube.js"
            },
            plugins: [
                resolve({
                    browser: true,
                }),
                commonjs(),
            ],
        }
        ,
        {
            input: "src/cs_comsYouTube.js",
            output: {
                file: "dist/cs_comsYouTube.js"
            },
            plugins: [
                resolve({
                    browser: true,
                }),
                commonjs(),
            ],
        },
        {
            input: "src/cs_frontpageYouTube.js",
            output: {
                file: "dist/cs_frontpageYouTube.js"
            },
            plugins: [
                resolve({
                    browser: true,
                }),
                commonjs(),
            ],
        },
        {
            input: "src/cs_recsYouTube.js",
            output: {
                file: "dist/cs_recsYouTube.js"
            },
            plugins: [
                resolve({
                    browser: true,
                }),
                commonjs(),
            ],
        },
        {
            input: "src/cs_searchYouTube.js",
            output: {
                file: "dist/cs_searchYouTube.js"
            },
            plugins: [
                resolve({
                    browser: true,
                }),
                commonjs(),
            ],
        },
        {
            input: "src/cs_videoMetadata.js",
            output: {
                file: "dist/cs_videoMetadata.js"
            },
            plugins: [
                resolve({
                    browser: true,
                }),
                commonjs(),
            ],
        }
    ]
};
