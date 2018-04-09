var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

/*******************/
/***** DATABASE ****/
/*******************/

// Create a persistent connection to the database
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "abc123",
  multipleStatements: true
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to SQL DB.");
});

/*******************/
/**** FUNCTIONS ****/
/*******************/

// render the home page, passing the list of teams to the page
function renderHomePage(res) {
  var q = 'SELECT * FROM teams;';
  con.query(q, function (err, result, fields) {
    if (err) { res.sendFile(path + "index.html"); }
    let teamsList = [];
    for (var i=0; i<result.length; i++) {
      teamsList.push([result[i].teamName, result[i].teamLogo]);
    }
    console.log('LIST OF TEAM NAMES: ' + teamsList.toString());
    res.render('index.html', { teams: teamsList });
  });
}



// render the Team page for a given request
function renderTeamPage(req,res) {
  var teamName = req.query.name;
  var q1 = 'SELECT * FROM teams WHERE teamName = \'' + teamName + '\';'
  var q2 = 'SELECT * FROM games WHERE homeTeamName = \'' + teamName + '\' OR awayTeamName = \'' + teamName + '\';'
  con.query(q1, function (err, result1, fields) {
    if (err) {
      res.sendFile(path + "team.html");
    }
      con.query(q2, function (err, result2, fields) {
        if (err) {
          res.sendFile(path + "team.html");
        }
            let homeTeamsList = [];
            let awayTeamsList = [];
            let datesList = [];
            for (var i=0; i<result2.length; i++) {
              homeTeamsList.push(result2[i].homeTeamName);
              awayTeamsList.push(result2[i].awayTeamName);
              datesList.push(result2[i].gameDate);
            }


            res.render('team.html', {
            teamName: result1[0].teamName,
            teamLogo: result1[0].teamLogo,
            gamesHomeTeams: homeTeamsList,
            gamesAwayTeams: awayTeamsList,
            gameDates: datesList

          });

      });

  });


}

function renderGamePage(req,res) {
  var homeTeamName = req.query.team1;
  var awayTeamName = req.query.team2;
  var gamedate = req.query.date;
  var q1 = 'SELECT * FROM games WHERE homeTeamNameRender = \'' + homeTeamName + '\' AND awayTeamNameRender = \'' + awayTeamName + '\'AND gameDateRender = \'' + gamedate + '\';'

      con.query(q1, function (err, result1, fields) {
        if (err) {
          res.sendFile(path + "team.html");
        }

            var tcolor = "color:green";
            if (result1[0].winningTeamPrediction != result1[0].gameResult) {
              tcolor = "color:red"
            }
            if (result1[0].gameResult == "TBD") {
              tcolor = "color:orange"
            }
            res.render('game.html', {
            gamePrediction: result1[0].winningTeamPrediction,
            gameResult: result1[0].gameResult,
            homeTeamStat1: result1[0].homeTeamStat1,
            homeTeamStat2: result1[0].homeTeamStat2,
            homeTeamStat3: result1[0].homeTeamStat3,
            awayTeamStat1: result1[0].awayTeamStat1,
            awayTeamStat2: result1[0].awayTeamStat2,
            awayTeamStat3: result1[0].awayTeamStat3,
            color: tcolor

          });

      });



}

/*******************/
/* EXPRESS ROUTING */
/*******************/

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  renderHomePage(res);
});

router.get("/home",function(req,res){
  renderHomePage(res);
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});

router.get('/team', function(req,res,next) {
  renderTeamPage(req,res)
  // res.sendFile(path + "team.html");
});

router.get("/game",function(req,res){
  renderGamePage(req,res);
  //res.sendFile(path + "game.html");
});
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
  var q = "USE BETSY;"
  con.query(q, function (err, result, fields) {
     if (err) {
       res.sendFile(path + "team.html");
     }
     console.log(result);
  });
});
