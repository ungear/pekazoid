import * as fs from "fs";
import { getVideoData } from "./twitchService";
import { getLinkFromImage } from "./ocrApiService";
import * as googleService from "./googleService";
import { ITwitchVideo } from "./typing/twitch";
import { ITwitchVideoProcessed } from "./typing/app";

const FROM_LOCAL_JSON = true;

async function main() {
  let videoSourceData: ITwitchVideo[] = !FROM_LOCAL_JSON
    ? await getVideoData()
    : JSON.parse(fs.readFileSync("temp-videos.json", "utf8"));

  if (!FROM_LOCAL_JSON) {
    saveVideosData(videoSourceData);
  }

  let finalResult: ITwitchVideoProcessed[] = [];
  videoSourceData
    .reduce((result, item) => {
      return result.then(async _ => {
        console.log("Processing " + item.id);
        let processedItem: ITwitchVideoProcessed = item;
        let googleLink =
          getLinkFromVideoTitle(item.title) ||
          (await getLinkFromImage(item.thumbnail_url));
        if (googleLink) {
          processedItem.spreadSheetId = await googleService.getSpreadsheetIdByShortLink(
            googleLink
          );
        }
        finalResult.push(processedItem);
      });
    }, Promise.resolve())
    .then(_ => {
      saveResult(finalResult);
    });
}

main();

function getLinkFromVideoTitle(title: string): string {
  if (title.includes("goo.gl/")) {
    return title.replace(/(.*)(goo\.gl\/[A-Za-z0-9]*)(.*)/, "$2");
  }
  if (title.includes("bit.ly/")) {
    return title.replace(/(.*)(bit\.ly\/[A-Za-z0-9]*)(.*)/, "$2");
  }
}

function saveVideosData(d) {
  fs.writeFileSync("temp-videos.json", JSON.stringify(d));
}

function saveResult(d: ITwitchVideoProcessed[]) {
  fs.writeFileSync("result.json", JSON.stringify(d));
}
