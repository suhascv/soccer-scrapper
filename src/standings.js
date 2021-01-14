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
        if ((index+1) % 3 === 0) {
            //console.log(element.firstChild.data)
          standings[((index+1)/3)-1]["matches"] = parseInt(element.firstChild.data);
        }
      });
  
      html(".StandingsRowColPnt").each((index, element) => {
        standings[index]["points"] = parseInt(element.firstChild.firstChild.data);
      });
  
      html(".StandingsRowStatW").each((index, element) => {
        standings[index]["won"] = parseInt(element.firstChild.data);
      });
  
      html(".StandingsRowStatD").each((index, element) => {
        standings[index]["drew"] = parseInt(element.firstChild.data);
      });
  
      html(".StandingsRowStatL").each((index, element) => {
        standings[index]["lost"] = parseInt(element.firstChild.data);
      });
      let resp = [];
      for (let s in standings) {
        resp.push(standings[s]);
      }
      
      return resp;
    }
    return { message: "league not found/ misspelled the leagues" };
  }

  module.exports = extract;

  let ex = async(url)=>{
    await extract(url);
  }

  ex("premier-league")