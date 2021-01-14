var express = require("express");
const app = express();

var puppeteer = require("puppeteer");
var cheerio = require("cheerio");

async function ssr(url) {
  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox']});
  const page = await browser.newPage();
  await page.goto(url, { waitUntil: "networkidle0" });
  const html = await page.content(); // serialized HTML of page DOM.
  await browser.close();
  return html;
}

async function extract(league) {
  const URL = {
    "premier-league":"https://www.scorebat.com/england-premier-league-live-scores/",
    "serie-a": "https://www.scorebat.com/italy-serie-a-live-scores/",
    "la-liga": "https://www.scorebat.com/spain-la-liga-live-scores/",
    "ligue-1": "https://www.scorebat.com/france-ligue-1-live-scores/",
    bundesliga: "https://www.scorebat.com/germany-bundesliga-live-scores/"
  };

  if (league in URL) {
    const executedJS = await ssr(URL[league]);
    const html = cheerio.load(executedJS);
    const standings = {};

    html(".StandingsRowColTeam").each((index, element) => {
      standings[index] = { pos: index + 1, team: element.firstChild.data };
    });

    html(".StandingsRowCol30").each((index, element) => {
      let j = 0;
      if ((index + 1) % 3 === 0) {
        standings[j]["matches"] = element.firstChild.data;
        j++;
      }
    });

    html(".StandingsRowColPnt").each((index, element) => {
      standings[index]["points"] = element.firstChild.firstChild.data;
    });

    html(".StandingsRowStatW").each((index, element) => {
      standings[index]["won"] = element.firstChild.data;
    });

    html(".StandingsRowStatD").each((index, element) => {
      standings[index]["drew"] = element.firstChild.data;
    });

    html(".StandingsRowStatL").each((index, element) => {
      standings[index]["lost"] = element.firstChild.data;
    });
    let resp = [];
    for (let s in standings) {
      resp.push(standings[s]);
    }
    return resp;
  }
  return { message: "league not found/ misspelled the leagues" };
}

//create a server object:

app.get("/", async function (req, res) {
  const html = await extract("premier-league");
  res.send(html);
});

app.get("/hello",(req,res)=>{
  res.send("hello");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("app is listening on port 3000.");
});
//the server object listens on port 8080
