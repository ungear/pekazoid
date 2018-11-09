import { CONFIG } from "../config";
import axios from "axios";

const instance = axios.create({
  baseURL: "https://api.twitch.tv/helix/videos?user_id=" + CONFIG.userId,
  headers: { "Client-ID": CONFIG.twitchClientId }
});
instance.get("").then(x => console.log(x));
