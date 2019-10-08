var http = require('http');
var fs = require('fs');
var express = require('express');
var path = require('path');
var url = require('url');
var app = express();
var request = require('request');
var $ = jQuery = require('jquery');
var bodyParser = require("body-parser");
// var jsonfile = require('jsonfile');
var cors = require('cors');
var proxy = require('http-proxy');
var cors = require('firebase-functions');

const cors = require('cors')({origin: true});
app.use(cors);

const admin = require('firebase-admin'),

const app = express();

app.get('/timestamp', (request,response) => {
  response.send(`${Date.now();}`)
  // console.log(request.body);
});

// app.post('/writeFile',function(req,res){
//   var FileContent=req.body.FileContent;
//   var FileName=req.body.FileName;
//
//   res.json(JSON.parse(FileContent));
//   // res.json(req.body);
//
//
//   // var requestedData = req.body;
//   // console.log("reqData: ", requestedData);
//   //
//   // res.status(200).end();
//
//   //Wrting Json file
//   fs.writeFileSync(__dirname+'/specs/'+FileName+'.json', FileContent);
//
// })

exports.app = functions.https.onRequest(app);



// // use it before all route definitions
// app.use(cors({origin: '*'}));
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: true}));
//
// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
//
//
// //app.use(express.static(path.resolve(".//")));
// app.use(express.static(__dirname));
//
// app.get('/', function(req, res) {
//   res.sendFile('/index.html',{root:__dirname});
// });
//
// var port = 80;
// app.listen(port);
//
// app.listen(process.env.PORT || 80);
// //http.createServer(app).listen(8080);
//
// // app.on('listening', function() {
// //     console.log('Express server started on port %s at %s', app.address().port, port.address().address);
// // });
//
// // var mw = require('./my-middleware.js')
// // app.use(mw({ option1: '1', option2: '2' }))
//
// //writing json description to .json file
app.post('/writeFile',function(req,res){
  var FileContent=req.body.FileContent;
  var FileName=req.body.FileName;

  res.json(JSON.parse(FileContent));
  // res.json(req.body);


  // var requestedData = req.body;
  // console.log("reqData: ", requestedData);
  //
  // res.status(200).end();

  //Wrting Json file
  fs.writeFileSync(__dirname+'/specs/'+FileName+'.json', FileContent);

})
