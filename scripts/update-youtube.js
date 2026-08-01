const fs = require("fs");

const CHANNEL_ID = "UCw3CBMvVjZJNfQR3tEvTodQ";

const RSS_URL =
`https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;


async function updateYoutube() {

    try {

        const response = await fetch(RSS_URL);

        if (!response.ok) {
            throw new Error("Failed to fetch YouTube RSS");
        }


        const xml = await response.text();


        const videos = [...xml.matchAll(
            /<yt:videoId>(.*?)<\/yt:videoId>[\s\S]*?<title>(.*?)<\/title>/g
        )]
        .slice(0,4)
        .map(video => {

            return {
                id: video[1],
                title: video[2]
            };

        });



        fs.writeFileSync(
            "data/youtube.json",
            JSON.stringify(videos, null, 2)
        );


        console.log(
            "YouTube JSON updated successfully"
        );


    } catch(error) {

        console.error(
            "YouTube update failed:",
            error
        );

        process.exit(1);

    }

}


updateYoutube();
