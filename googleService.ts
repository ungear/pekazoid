import axios from "axios";

// takes a ID from links like "https://docs.google.com/spreadsheets/d/<ID>/edit?usp=sharing"
function parseSpreadsheetId(url: string) {
  return url.replace(
    /(https\:\/\/docs.google.com\/spreadsheets\/d\/)(.*)(\/.*)/,
    "$2"
  );
}

// expects to get URL with short link like "goo.gl/MTJreu"
export async function getSpreadsheetIdByShortLink(url: string) {
  return axios.get("https://" + url, { maxRedirects: 0 }).catch(e => {
    if (e.response.status === 301 && e.response.headers.location)
      return parseSpreadsheetId(e.response.headers.location);
    else return null;
  });
}