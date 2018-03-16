var express = require("express");
var app = express();
var router = express.Router();
var path = __dirname + '/views/';

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

function dbQuery(queryText) {
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
  con.query(queryText, function (err, result, fields) {
    if (err) throw err;
    console.log(result);
  });
};

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/home",function(req,res){
  console.log("Here 0");
  dbQuery("SELECT * FROM teams");
  res.sendFile(path + "index.html");

});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/game",function(req,res){
  res.sendFile(path + "game.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});

router.get("/team",function(req,res){
  res.sendFile(path + "team.html");
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
  var q = "USE BETSY; SELECT * FROM TEST_TEAMS;"
  dbQuery(q);
});
