import * as fs from "fs";
import { getVideoData } from "./twitchService";
import { getLinkFromImage } from "./ocrApiService";
import * as googleService from "./googleService";

const FROM_LOCAL_JSON = true;

async function main() {
  let videosData = !FROM_LOCAL_JSON
    ? await getVideoData()
    : JSON.parse(fs.readFileSync("temp-videos.json", "utf8"));

  if (!FROM_LOCAL_JSON) {
    saveVideosData(videosData);
  }

  let finalResult = [];
  videosData
    .reduce((result, item) => {
      return result.then(async _ => {
        console.log("Processing " + item.id);
        let googleLink = await getLinkFromImage(item.thumbnail_url);
        if (googleLink) {
          let spreadSheetId = await googleService.getSpreadsheetIdByShortLink(
            googleLink
          );
          item.spreadSheetId = spreadSheetId;
        }
        finalResult.push(item);
      });
    }, Promise.resolve())
    .then(_ => {
      saveVideosData(finalResult);
    });
}

main();

function saveVideosData(d) {
  fs.writeFileSync("temp-videos.json", JSON.stringify(d));
}
