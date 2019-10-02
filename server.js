var http = require('http');
var fs = require('fs');
var express = require('express');
var path = require('path');
var url = require('url');
var app = express();
var request = require('request');
var $ = jQuery = require('jquery');
var bodyParser = require("body-parser");
var jsonfile = require('jsonfile');

//Start reading from main
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '5mb', extended: true}));
app.use(bodyParser.json({ limit:'50mb' }));
app.use(bodyParser.raw({ limit:'50mb' }));
app.use(bodyParser.text({ limit:'50mb' }));


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});
app.use(express.static(path.resolve(".//")));

app.get('/', function(req, res) {
  res.sendFile('/index.html',{root:__dirname});
});


var port = 8080;
var server = app.use(express.static(__dirname));
app.listen(port);


//writing json description to .json file
app.post('/writeFileToJson',function(req,res){

  var FileContent=req.body.FileContent;
  var FileName=req.body.FileName;
  res.send(JSON.parse(FileContent));
  // console.log( "The file has been uploaded!");
  // var FileContent = JSON.parse(FileContent)
  // console.log(FileContent);

  //Wrting Json file
  fs.writeFileSync(__dirname + '/specs/'+FileName+'.json', FileContent);

  // var file = __dirname + '/'+FileName+'.json'
  // // console.log("dir: ", file);
  // jsonfile.writeFile(file, FileContent, encoding = 'ascii', function (err) {
  //   console.error(err)
  //   console.log("the file is "+file)
  // });
  //  var args =[]
  //  args[0]= JSON.stringify(FileContent)
  // var spawn = require('child_process').spawnSync;
  // var process = spawn(__dirname + '/81828172.exe', args);

  // console.log("stdout: " + process.output.toString())
  // //send back the data
  //   res.end(process.output.toString());
})
