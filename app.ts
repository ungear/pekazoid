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

  let googleLink = await getLinkFromImage(videosData[41].thumbnail_url);
  let spreadSheetId = await googleService.getSpreadsheetIdByShortLink(
    googleLink
  );

  //saveVideosData(videosData);
}

main();

function saveVideosData(d) {
  fs.writeFileSync("temp-videos.json", JSON.stringify(d));
}
