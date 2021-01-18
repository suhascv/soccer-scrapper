const axios = require('axios');
require('dotenv').config();

async function getMatches(league){

    const CODES = {'premier-league':2021,
                  'ligue-1':2015,
                  'bundesliga':2002,
                  'serie-a':2019,
                  'la-liga':2014
              }
  
    var URL = `http://api.football-data.org/v2/competitions/${CODES[league]}/matches/`
    
    try{
    var resp = await axios.get(URL,
      {
        'headers':{'X-Auth-Token':process.env.TOKEN},
        'params':{'season':2020}
      }
      );
    
    var data = resp.data.matches;
    var matches={}
    for(let d in data)
    {
      d=data[d]
      if(d.status==="FINISHED")
      {
        let match = {
                    "matchId":d.id,
                    "utcDate":d.utcDate,
                    "matchday":d.matchday,
                    "homeTeam":d["homeTeam"]["name"],
                    "awayTeam":d["awayTeam"]["name"],
                    "homeTeamScore":d["score"]["fullTime"]["homeTeam"],
                    "awayTeamScore":d["score"]["fullTime"]["awayTeam"],
                    "winner":d["score"]["winner"]
                  }
        console.log(match)
        try{

            matches[d["matchday"]].push(match)
            }
      catch(er){
         matches[d["matchday"]]=[match,];
            }
      }
    }

    console.log(matches[2])



    }
    catch(e){
      console.log(e);
    }
    
  }  


(()=>{
getMatches('premier-league');
})();

