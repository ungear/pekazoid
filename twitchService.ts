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
  let params: any = { first: 100 };
  if (cursor) {
    params.after = cursor;
  }
  let response = await axiosInstance.get("", { params });
  let respData = response.data;
  return respData.data && respData.data.length ? respData : null;
}

async function* asyncDataGenerator(): AsyncIterableIterator<ITwitchVideo[]> {
  let cursor: string = null;
  let finish = false;
  while (!finish) {
    let videos = await getVideoSourceData(cursor)
      /* pause to make less than 30 requests per minute not to exceed twitch limit */
      // .then(
      //   (d: IGetVideosResponse) => new Promise(r => setTimeout(_ => r(d), 2100))
      // )
      .then((d: IGetVideosResponse) => {
        if (d) {
          cursor = d.pagination.cursor;
          return d.data;
        } else {
          finish = true;
        }
      });

    if (videos) yield videos;
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
