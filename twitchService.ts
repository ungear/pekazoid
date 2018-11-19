import { CONFIG } from "./config";
import { ITwitchVideo, IGetVideosResponse } from "./typing/twitch";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://api.twitch.tv/helix/videos",
  params: { user_id: CONFIG.userId },
  headers: { "Client-ID": CONFIG.twitchClientId }
});

async function getVideoSourceData(
  cursor?: string
): Promise<IGetVideosResponse> {
  let response = cursor
    ? await axiosInstance.get("", { params: { after: cursor, first: 100 } })
    : await axiosInstance.get("", { params: { first: 100 } });
  let respData = response.data;
  return respData.data && respData.data.length ? respData : null;
}

async function* asyncDataGenerator(): AsyncIterableIterator<ITwitchVideo[]> {
  let cursor: string = null;
  let finish = false;
  while (!finish) {
    yield await getVideoSourceData(cursor).then(d => {
      if (d) {
        cursor = d.pagination.cursor;
        return d.data;
      } else {
        finish = true;
      }
    });
  }
}

export async function getVideoData(): Promise<ITwitchVideo[]> {
  let data: ITwitchVideo[] = [];
  let gen = asyncDataGenerator();
  for await (let x of gen) {
    data = data.concat(x);
  }
  return data;
}
