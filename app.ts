import * as fs from "fs";
import { getVideoData } from "./twitchService";
import { getLinkFromImage } from "./ocrApiService";
import * as googleService from "./googleService";
import { ITwitchVideo } from "./typing/twitch";
import { IResult } from "./typing/app";

const FROM_LOCAL_JSON = true;

async function main() {
  let videoSourceData: ITwitchVideo[] = !FROM_LOCAL_JSON
    ? await getVideoData()
    : JSON.parse(fs.readFileSync("temp-videos.json", "utf8"));

  if (!FROM_LOCAL_JSON) {
    saveVideosData(videoSourceData);
  }

  let finalResult: IResult[] = [];
  videoSourceData
    .reduce((result, item) => {
      return result.then(async _ => {
        console.log("Processing " + item.id);
        let googleLink = await getLinkFromImage(item.thumbnail_url);
        if (googleLink) {
          let spreadSheetId = await googleService.getSpreadsheetIdByShortLink(
            googleLink
          );
          finalResult.push({
            twitchVideoId: item.id,
            spreadSheetId: spreadSheetId
          });
        }
      });
    }, Promise.resolve())
    .then(_ => {
      saveResult(finalResult);
    });
}

main();

function saveVideosData(d) {
  fs.writeFileSync("temp-videos.json", JSON.stringify(d));
}

function saveResult(d: IResult[]) {
  fs.writeFileSync("result.json", JSON.stringify(d));
}
