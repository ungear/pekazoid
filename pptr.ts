import * as puppeteer from "puppeteer";
import { CONFIG } from "./config";

(async () => {
  const browser = await puppeteer.launch({
    //headless: false,
    executablePath: CONFIG.chromePath,
    defaultViewport: {
      width: 1920,
      height: 1080
    },
    args: [`--window-size=1920,1080`]
  });
  let url = "URL";
  const page = await browser.newPage();
  await page.goto(url);
  await delay(1000);
  await page.goto(url);
  await delay(3000);
  page.click(".player-slider");
  await delay(1000);
  page.click(".video-info__container");
  await delay(3000);
  await page.screenshot({ path: "example.png" });

  await browser.close();
})();

function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
