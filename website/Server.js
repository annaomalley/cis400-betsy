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
  var q = 'SELECT teamName FROM teams;';
  con.query(q, function (err, result, fields) {
    if (err) { res.sendFile(path + "index.html"); }
    let teamsList = [];
    for (var i=0; i<result.length; i++) {
      teamsList.push(result[i].teamName);
    }
    console.log('LIST OF TEAM NAMES: ' + teamsList.toString());
    res.render('index.html', { teams: teamsList });
  });
}

// render the Team page for a given request
function renderTeamPage(req,res) {
  var teamName = req.query.name;
  var q = 'SELECT * FROM teams WHERE teamName = \'' + teamName + '\';'
  con.query(q, function (err, result, fields) {
    if (err) {
      res.sendFile(path + "team.html");
    }
    console.log(result[0]);
    console.log(result[0].teamName);
    let teamsList = [];
    res.render('team.html', {
      teamName: result[0].teamName,
      teamLogo: result[0].teamLogo
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
  res.sendFile(path + "game.html");
});
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
  var q = "USE BETSY; SELECT * FROM TEST_TEAMS;"
  con.query(q, function (err, result, fields) {
    if (err) {
      res.sendFile(path + "team.html");
    }
    console.log(result);
  });
});
