import * as fs from "fs";
import { getVideoData } from "./twitchService";
import { getRecognitionData } from "./ocrApiService";

async function main() {
  // let data = await getVideoData();
  // fs.writeFileSync("temp-videos.json", JSON.stringify(data));

  let f = await getRecognitionData(
    "https://static-cdn.jtvnw.net/s3_vods/786f5053d86fbcc0aa8c_adolf_peka2tv_27499227280_787371874//thumb/thumb225920205-%{width}x%{height}.jpg"
  );
}
main();
