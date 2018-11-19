import { CONFIG } from "./config";
import axios from "axios";

const IMAGE_WIDTH = 1920;
const IMAGE_HEIGHT = 1080;

const axiosInstance = axios.create({
  baseURL: "https://api.ocr.space/parse/imageurl",
  params: { apikey: CONFIG.ocrApiKey }
});

async function getRecognitionData(imageUrl: string) {
  imageUrl = imageUrl.replace(/\%\{width\}/, IMAGE_WIDTH.toString());
  imageUrl = imageUrl.replace(/\%\{height\}/, IMAGE_HEIGHT.toString());
  try {
    let resp = await axiosInstance.get("", {
      params: { url: imageUrl }
    });
    return resp.data;
  } catch (e) {
    console.log(e);
  }
}

export async function getLinkFromImage(imageUrl: string) {
  if (imageUrl === "") return null;
  try {
    let recData = await getRecognitionData(imageUrl);
    let text = recData.ParsedResults[0].ParsedText;
    text = text.replace(/\r\n/g, "");
    return text.indexOf("goo.gl") > 0
      ? text.replace(/(.*)(goo.gl\/\w*) (.*)/m, "$2")
      : null;
  } catch (e) {
    return null;
  }
}
