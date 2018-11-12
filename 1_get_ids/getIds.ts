import { CONFIG } from "../config";
import axios from "axios";
import * as fs from "fs";

const instance = axios.create({
  baseURL: "https://api.twitch.tv/helix/videos",
  params: { user_id: CONFIG.userId },
  headers: { "Client-ID": CONFIG.twitchClientId }
});

async function main() {
  let data = [];
  let gen = asyncDataGenerator();
  for await (let x of gen) {
    data = data.concat(x);
  }
  fs.writeFileSync("1_get_ids/result.json", JSON.stringify(data));
}

async function getIds(cursor?: string) {
  let response = cursor
    ? await instance.get("", { params: { after: cursor } })
    : await instance.get("");
  let data = response.data;
  return data.data && data.data.length ? data : null;
}

async function* asyncDataGenerator(): AsyncIterableIterator<any> {
  let cursor = null;
  let finish = false;
  while (!finish) {
    yield await getIds(cursor).then(d => {
      if (d) {
        cursor = d.pagination.cursor;
        return d.data;
      } else {
        finish = true;
      }
    });
  }
}

main();
