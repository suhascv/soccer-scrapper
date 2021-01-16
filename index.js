var express = require("express");
const app = express();
var path = require('path');
var cors = require('cors');
var standings = require('./src/standings.js');
var RESP = {'serie-a':null,'premier-league':null,'la-liga':null,'ligue-1':null,'bundesliga':null}



app.use(cors())
app.use(express.static('public'));
app.use(express.static(path.join(__dirname, 'public')));



//create a server object:

app.get('/', (req, res) => {
  res.sendFile('./views/index.html', { root: __dirname });
});

app.get("/standings/:league", async function (req, res) {
  try{
    
  //const html = await standings(req.params["league"]);
  res.send(RESP[req.params["league"]]);
  }
  catch(e){
    console.log(e);
  }
});

app.get("/hello",(req,res)=>{
  res.send("hello");
});

app.listen(process.env.PORT || 3000, () => {

  console.log("app is listening on port 3000.");

  setInterval(async function(){
    RESP['serie-a']        = await standings('serie-a');
    RESP['la-liga']        = await standings('la-liga');
    RESP['bundesliga']     = await standings('bundesliga');
    RESP['premier-league'] = await standings('premier-league');
    RESP['ligue-1']        = await standings('ligue-1');
    },1*1000*60);

});
//the server object listens on port 8080
