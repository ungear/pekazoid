const puppeteer = require("puppeteer");

(async () => {
  // const browser = await puppeteer.launch({
  //   headless: false,
  //   slowMo: 250,
  //   // defaultViewport: {
  //   //   width: 1000,
  //   //   height: 1000
  //   // },
  //   // args: [
  //   //   `--window-size=1000,1000`
  //   // ],
  // });
  const browser = await puppeteer.launch({
    executablePath: "PATH_TO_CHROME"
  });
  const page = await browser.newPage();
  await page.goto("URL");
  await delay(3000);
  await page.screenshot({ path: "example.png" });

  await browser.close();
})();

function delay(timeout) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}
