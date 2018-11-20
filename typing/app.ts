import { ITwitchVideo } from "./twitch";

export interface ITwitchVideoProcessed extends ITwitchVideo {
  spreadSheetId?: string;
}
