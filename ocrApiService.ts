import { CONFIG } from "./config";
import axios from "axios";

const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

const axiosInstance = axios.create({
  baseURL: "https://api.ocr.space/parse/imageurl",
  params: { apikey: CONFIG.ocrApiKey }
});

export async function getRecognitionData(imageUrl: string) {
  imageUrl = imageUrl.replace(/\%\{width\}/, IMAGE_WIDTH.toString());
  imageUrl = imageUrl.replace(/\%\{height\}/, IMAGE_HEIGHT.toString());
  let resp = await axiosInstance.get("", {
    params: { url: imageUrl }
  });
  return resp.data.ParsedResults[0].ParsedText;
}
