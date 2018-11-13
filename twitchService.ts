import { CONFIG } from "./config";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.twitch.tv/helix/videos",
  params: { user_id: CONFIG.userId },
  headers: { "Client-ID": CONFIG.twitchClientId }
});

async function getIds(cursor?: string) {
  let response = cursor
    ? await axiosInstance.get("", { params: { after: cursor } })
    : await axiosInstance.get("");
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

export async function getVideoData() {
  let data = [];
  let gen = asyncDataGenerator();
  for await (let x of gen) {
    data = data.concat(x);
  }
  return data;
}
