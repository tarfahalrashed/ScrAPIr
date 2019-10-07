function callFunc(){
 console.log("callFunc");

var myObj={"a":"1", "b":"2"}

 // $.ajax({
 //        url: "/server.js",
 //        data: JSON.stringify(myObj),
 //        dataType: "json",
 //        cache: false,
 //        method:'POST'
 //    }).success(function (result) {
 //        // Do something with responce
 //        console.log("result: ", result);
 //    });


//
$.post("/writeFile",{FileContent: JSON.stringify(myObj), FileName: 'testingDUH'}, function(data){
    console.log("data: ", data);
    console.log("print: ", myObj);
});

// function createCORSRequest(method, url){
//     var xhr = new XMLHttpRequest();
//     if ("withCredentials" in xhr){
//         xhr.open(method, url, true);
//     } else if (typeof XDomainRequest != "undefined"){
//         xhr = new XDomainRequest();
//         xhr.open(method, url);
//     } else {
//         xhr = null;
//     }
//     return xhr;
// }
//
// var request = createCORSRequest("get", "http://scrapir.org/specs/YouTubeAPI.json");
// if (request){
//     request.onload = function(){
//         //do something with request.responseText
//     };
//     request.send();
// }


  // $.ajax({
  //   url: 'http://scrapir.org/specs/YouTubeAPI.json',
  //   // data: JSON.parse(listP),
  //   // dataType: 'jsonp',
  //   // accepts: 'application/json',
  //   // callback: 'callback',
  //   method: 'GET',
  //   xhrFields: {
  //       withCredentials: true
  //   },
  //   // headers :{
  //   //   "Origin": "http://localhost:8080",
  //   //   // "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
  //   //   // "Access-Control-Allow-Methods" : "GET, POST, PUT, DELETE, OPTIONS"
  //   // },
  //   success: function (response) {
  //     console.log("response: ",response);
  //   }
  // });




// var xhttp = new XMLHttpRequest();
// xhttp.onload = function() {
//   console.log("xhttp.status: ",xhttp.status);
//   if (xhttp.status != 200)
//     return;
//   var specList = JSON.parse(xhttp.responseText)
//   console.log("xhttp.responseText: ",JSON.parse(xhttp.responseText));
//
//
//   };
//   xhttp.open('GET', 'http://scrapir.org/specs/YouTubeAPI.json', true);
//   xhttp.send(null);

// https://api.apis.guru/v2/specs/api2cart.com/1.0.0/swagger.json



// var urlStr = 'https://www.googleapis.com/youtube/v3/search';//$("#url").val();
// var u = urlStr.split("https://www.")[1];
// var uNoPath = u.substring(0, u.lastIndexOf("/") );
//
// var urlTemplate = '{swaggerJson}';
// var match = window.location.search.match(/^\?urlTemplate=(.*)$/);
// if (match)
//   urlTemplate = decodeURIComponent(match[1]);
// var rootUrl = 'https://api.apis.guru/v2/';
// var xhttp = new XMLHttpRequest();
// xhttp.onload = function() {
//   if (xhttp.status != 200)
//     return;
//   var specList = JSON.parse(xhttp.responseText)
//   var links = '';
//   for(var apiId in specList){
//     var api = specList[apiId];
//     for (var version in api.versions) {
//       // var swaggerYaml = api.versions[version].swaggerYamlUrl;
//       var swaggerJson = api.versions[version].swaggerUrl;
//       console.log("swaggerJson: ",swaggerJson);
//       var specName = swaggerJson.replace(rootUrl + 'specs/', '');
//       console.log("specName: ",specName);
//
//       var href = urlTemplate.replace('{swaggerJson}', swaggerJson);
//       console.log("href: ",href);
//
//       // links += '<p><a href="'+ href +'" target="_blank">'+ specName +'</a></p>';
//        if(href.includes(uNoPath)){
//          $.ajax({
//            url: href,
//            method: "GET",
//            success: function (response) {
//              optionalParam = [];
//              var firstOptParam = true;
//              var obj = response;
//              var tmp = urlStr.split("/");
//              var path = "/"+tmp.pop();
//              var params = obj.paths[path].get.parameters;
//              console.log("Parames: ", params);
//            }
//          });
//
//        }
//      }
//     }
//   };
//   xhttp.open('GET', rootUrl + 'list.json', true);
//   xhttp.send(null);
}
