import * as fs from "fs";
import { getVideoData } from "./twitchService";

async function main() {
  let data = await getVideoData();
  fs.writeFileSync("temp-videos.json", JSON.stringify(data));
}
main();
