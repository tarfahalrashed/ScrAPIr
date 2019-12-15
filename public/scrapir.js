var obJSON1, listP;
//function scrAPIr(api, parameters, response, numRes, format){
function scrAPIr(apiURL, numOfResults, format){
 // console.log("callFunc");
 // console.log("API URl: ", apiURL);

 var apiTitle;
 firebase.database().ref('/apis/').once('value').then(function(snapshot) {
   snapshot.forEach(function(childSnapshot) { //for each API
     if(childSnapshot.val().url == apiURL){
       apiTitle = childSnapshot.val().title;
       // console.log("API name: ", apiTitle);

 //[1] Get the API's description from ScrAPIr
 $.ajax({
   url: 'https://superapi-52bc2.firebaseio.com/apis/'+apiTitle+'.json',
   method: "GET",
   success: function (response) {
     // console.log("RES: ", response);
     obJSON1 = response;



//[2] From description, get maxResPerPage

   //START HERE
     var pages, numResults;

     var numRes=numOfResults;

     // console.log("obJSON1.maxResPerPage: ", obJSON1.maxResPerPage);

     if(numRes){
       var pages = Math.ceil(numRes/obJSON1.maxResPerPage);
       var totalRes = numRes;
       numResults = obJSON1.maxResPerPage;
     }else{
       page=1;
     }

     var start = 0;
     var next="";
     var nextPage = "";
     var p=1;

     getTheNextPage(p, pages, nextPage);

     function getTheNextPage(p, pages, nextPage){

       listP=  "{";
       for(var i=0; i<obJSON1.parameters.length; ++i) {
         if($("#"+obJSON1.parameters[i]['name']).val() || obJSON1.parameters[i]['value']){
           listP+= JSON.stringify(obJSON1.parameters[i]['name']); //check conditions before adding names
           listP+= ":"
           // if(obJSON1.parameters[i]['displayedName']){ //displayedName
           //   listP+= JSON.stringify($("#"+obJSON1.parameters[i]['name']).val());
           // }else{
           listP+= JSON.stringify(obJSON1.parameters[i]['value']);
           // }
         }

         if(i+1<obJSON1.parameters.length){
           if($("#"+obJSON1.parameters[i+1]['name']).val() || obJSON1.parameters[i+1]['value']) {
             listP+= ",";
           }
         }
      }


     if(obJSON1.resPerPageParam){
       listP+= ","
       listP+= JSON.stringify(obJSON1.resPerPageParam);
       listP+= ":";
       listP+= JSON.stringify(obJSON1.maxResPerPage);
     }
     if(obJSON1.indexPage){
       listP+= ","
       listP+= JSON.stringify(obJSON1.indexPage);
       listP+= ":";
       listP+= p;
     }else if(obJSON1.offsetPage){
       listP+= ","
       listP+= JSON.stringify(obJSON1.offsetPage);
       listP+= ":";
       listP+= p*(eval(obJSON1.maxResPerPage));
     }else if(obJSON1.currPageParam){
       listP+= ","
       listP+= JSON.stringify(obJSON1.currPageParam);
       listP+= ":";
       listP+= JSON.stringify(nextPage);
     }
     listP+= "}";

   // console.log("listP: ",JSON.parse(listP));

 if((!obJSON1.headers) || obJSON1.headers[0].headerValue==""){ //no header //no CORS
     $.ajax({
       url: obJSON1.url,
       data: JSON.parse(listP),
       method: 'GET',
       success: function (response) {
         // console.log("RES API: ", response);

         if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
           for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
              objData={};
              objData["id"]= start;

              if($("input[name='checkbox-w']").is(":checked")){
                  $("input[name='checkbox-w']:checked").each(function(){
                   var s = "response."+this.id.split('.')[0];
                    //console.log("s: ",s);
                   if(eval(s)){
                    var id = this.value;
                    if(this.value=="Video URL"){
                      objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                    }else{
                      var str = (this.checked ? "response."+this.id : 0);
                      //IF ARRAY
                      if(str.includes("[i]")){
                        //console.log("Includes [i]: ",str);
                        var i=0;
                        var splt =  str.split("[i]");
                        // start if undefined
                        if(eval(splt[0]).length==0){
                         objData[id]="";
                       }else{// start if NOT undefined
                       objData[id] = (this.checked ? eval("response."+this.id) : 0);
                       for(i=1; i<eval(splt[0]).length; ++i){
                         objData[id] += ", ";
                         objData[id] += eval("response."+this.id);
                       }
                     }///test undefined
                       //IF OBJECT and not ARRAY
                      }else if(eval("response."+this.id) instanceof Object && !(eval("response."+this.id) instanceof Array)){
                        //console.log("IT IS OBJECT");
                        var objD = (this.checked ? eval("response."+this.id) : 0);
                        var objKV = "";
                        var first = true;
                        for(var i in objD){
                         //console.log("Key: ", i);
                         //console.log("Value: ", objD[i]);
                         if(!first){
                           objKV+=", "
                         }else{
                           first = false;
                         }
                         objKV+=i+": "+objD[i];
                       }
                       objData[id]=objKV;

                       for(var i in objD){
                        //console.log("Key: ", i);
                        //console.log("Value: ", objD[i]);
                        objData[i]=objD[i];
                        //console.log("objData[id]: ", objData[i]);
                      }
                      //console.log("objData[id]: ", objData[id]);
                      //IF NEITHER
                      }else{
                        //console.log("Does NOT Include [i]");
                        objData[id] = (this.checked ? eval("response."+this.id) : 0);
                        //console.log("objData[id]: ", objData[id]);
                      }
                    }
                  }//if not undefined
                else{
                  defined=false;
                }
              });//checkbox
            }//chckbox loop

                if(defined){
                  data.push(objData);
                  obj.lists=[];
                  obj.lists.push(objData);
               }

               //++j;
               //++start;

           }//while loop
         }else{
         var j=0;
         while(defined){
         // for (var j=0; j<25 && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
            objData={};
            ++start;
            objData["id"]= start;
            // console.log("J: ",j);
            if($("input[name='checkbox-w']").is(":checked")){
                $("input[name='checkbox-w']:checked").each(function(){
                  var s = "response."+this.id.split('.')[0];
                  var arrLength = "response."+this.id.split('[j]')[0];
                  var ln = s.split('[')[0];

                  if(j<eval(arrLength).length){// || typeof eval(s) === 'undefined' || j==eval(ln).length){
                  var id = this.value;
                  if(this.value=="Video URL"){
                    objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                  }else{
                    var str = (this.checked ? "response."+this.id : 0);
                    //IF ARRAY
                    if(str.includes("[i]")){
                      //console.log("Includes [i]: ",str);
                      var i=0;
                      var splt =  str.split("[i]");
                      // start if undefined
                      if(eval(splt[0]).length==0){
                       objData[id]="";
                     }else{// start if NOT undefined
                     objData[id] = (this.checked ? eval("response."+this.id) : 0);
                     for(i=1; i<eval(splt[0]).length; ++i){
                       objData[id] += ", ";
                       objData[id] += eval("response."+this.id);
                     }
                   }///test undefined
                     //IF OBJECT and not ARRAY
                    }else if(eval("response."+this.id) instanceof Object && !(eval("response."+this.id) instanceof Array)){
                      //console.log("IT IS OBJECT");
                      var objD = (this.checked ? eval("response."+this.id) : 0);
                      var objKV = "";
                      var first = true;
                      for(var i in objD){
                       //console.log("Key: ", i);
                       //console.log("Value: ", objD[i]);
                       if(!first){
                         objKV+=", "
                       }else{
                         first = false;
                       }
                       objKV+=i+": "+objD[i];
                     }
                     objData[id]=objKV;

                     for(var i in objD){
                      //console.log("Key: ", i);
                      //console.log("Value: ", objD[i]);
                      objData[i]=objD[i];
                      //console.log("objData[id]: ", objData[i]);
                    }
                    //console.log("objData[id]: ", objData[id]);
                    //IF NEITHER
                    }else{
                      //console.log("Does NOT Include [i]");
                      objData[id] = (this.checked ? eval("response."+this.id) : 0);
                      //console.log("objData[id]: ", objData[id]);
                    }

                  }
                }//if not undefined
              else{
                defined=false;
              }
            });//checkbox
          }//chckbox loop

              if(defined){
                data.push(objData);
                obj.lists=[];
                obj.lists.push(objData);
             }

             ++j;
             //++start;

         }//while loop
       }//else

         if(p<pages){
           // console.log("Data: ", data);
           if(obJSON1.currPageParam){ //nex\prev page
               ++p;
               // console.log("Next: ", eval("response."+obJSON1.nextPageParam));
               getTheNextPage(p, pages, eval("response."+obJSON1.nextPageParam));
           }else if(obJSON1.offsetPage){//offset page
             // console.log("offset");
             ++p;
             getTheNextPage(p, pages, eval("response."+obJSON1.offsetPage));
           }else{//index page
               // console.log("index");
             ++p;
             getTheNextPage(p, pages, eval("response."+obJSON1.indexPage));
           }
         }else{
           // populateTable(data);
           //return json or create csv csv data
           console.log("All results: ", objData);
         }

       }//response
   //  );//new AJAX
    });//AJAX
  }//if header
 else{
   //if(obJSON1.headers[0].headerValue){
   var headername= obJSON1.headers[0].headerKey;//$("#nameH").val();
   var headervar= obJSON1.headers[0].headerValue;//$("#valueH").val();
   var headers_to_set = {};
   headers_to_set[headername] = headervar;

     $.ajax({
       url: "https://cors-anywhere.herokuapp.com/"+obJSON1.url,
       data: JSON.parse(listP),
       method: 'GET',
       headers: headers_to_set,
       // {
       //   "Authorization" : obJSON1.headers[0].headerValue//"Bearer lFvvnoRne1-Od__tDTS_kC4w_ifGdXq7XeYGXhxj67FlTAWnZuwiD46hWe15i3ZQEz9c4zTsAES_MdSgzcHnDM2b1QvvaKzOB7KbBFJOrk5cCNdAxjfSB4R6VRFeXHYx"
       // },
       success: function (response) {
         //console.log("RES_Ret: ", response);
         if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
           for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
              objData={};

              objData["id"]= start;

              if($("input[name='checkbox-w']").is(":checked")){
                  $("input[name='checkbox-w']:checked").each(function(){
                   var s = "response."+this.id.split('.')[0];
                    //console.log("s: ",s);
                   if(eval(s)){
                    var id = this.value;
                    if(this.value=="Video URL"){
                      objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                    }else{
                      var str = (this.checked ? "response."+this.id : 0);
                      //IF ARRAY
                      if(str.includes("[i]")){
                        //console.log("Includes [i]: ",str);
                        var i=0;
                        var splt =  str.split("[i]");
                        // start if undefined
                        if(eval(splt[0]).length==0){
                         objData[id]="";
                       }else{// start if NOT undefined
                       objData[id] = (this.checked ? eval("response."+this.id) : 0);
                       for(i=1; i<eval(splt[0]).length; ++i){
                         objData[id] += ", ";
                         objData[id] += eval("response."+this.id);
                       }
                     }///test undefined
                       //IF OBJECT and not ARRAY
                      }else if(eval("response."+this.id) instanceof Object && !(eval("response."+this.id) instanceof Array)){
                        //console.log("IT IS OBJECT");
                        var objD = (this.checked ? eval("response."+this.id) : 0);
                        var objKV = "";
                        var first = true;
                        for(var i in objD){
                         //console.log("Key: ", i);
                         //console.log("Value: ", objD[i]);
                         if(!first){
                           objKV+=", "
                         }else{
                           first = false;
                         }
                         objKV+=i+": "+objD[i];
                       }
                       objData[id]=objKV;

                       for(var i in objD){
                        //console.log("Key: ", i);
                        //console.log("Value: ", objD[i]);
                        objData[i]=objD[i];
                        //console.log("objData[id]: ", objData[i]);
                      }
                      //console.log("objData[id]: ", objData[id]);
                      //IF NEITHER
                      }else{
                        //console.log("Does NOT Include [i]");
                        objData[id] = (this.checked ? eval("response."+this.id) : 0);
                        //console.log("objData[id]: ", objData[id]);
                      }

                    }
                  }//if not undefined
                else{
                  defined=false;
                }
              });//checkbox
            }//chckbox loop

                if(defined){
                  data.push(objData);
                  obj.lists=[];
                  obj.lists.push(objData);
               }

               //++j;
               //++start;

           }//while loop
         }else{
         var j=0;
         while(defined){
       //for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
       objData={};
       ++start;
       objData["id"]= start;
       // console.log("J: ",j);

       if($("input[name='checkbox-w']").is(":checked")){
           $("input[name='checkbox-w']:checked").each(function(){
             var s = "response."+this.id.split('.')[0];
             var arrLength = "response."+this.id.split('[j]')[0];
             var ln = s.split('[')[0];

             if(j<eval(arrLength).length){// || typeof eval(s) === 'undefined' || j==eval(ln).length){
             var id = this.value;
             if(this.value=="Video URL"){
               objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
             }else{
               var str = (this.checked ? "response."+this.id : 0);
               //IF ARRAY
               if(str.includes("[i]")){
                 //console.log("Includes [i]: ",str);
                 var i=0;
                 var splt =  str.split("[i]");
                 // start if undefined
                 if(eval(splt[0]).length==0){
                  objData[id]="";
                }else{// start if NOT undefined
                objData[id] = (this.checked ? eval("response."+this.id) : 0);
                for(i=1; i<eval(splt[0]).length; ++i){
                  objData[id] += ", ";
                  objData[id] += eval("response."+this.id);
                }
              }///test undefined
                //IF OBJECT and not ARRAY
               }else if(eval("response."+this.id) instanceof Object && !(eval("response."+this.id) instanceof Array)){
                 //console.log("IT IS OBJECT");
                 var objD = (this.checked ? eval("response."+this.id) : 0);
                 var objKV = "";
                 var first = true;
                 for(var i in objD){
                  //console.log("Key: ", i);
                  //console.log("Value: ", objD[i]);
                  if(!first){
                    objKV+=", "
                  }else{
                    first = false;
                  }
                  objKV+=i+": "+objD[i];
                }
                objData[id]=objKV;

                for(var i in objD){
                 //console.log("Key: ", i);
                 //console.log("Value: ", objD[i]);
                 objData[i]=objD[i];
                 //console.log("objData[id]: ", objData[i]);
               }
               //console.log("objData[id]: ", objData[id]);
               //IF NEITHER
               }else{
                 //console.log("Does NOT Include [i]");
                 objData[id] = (this.checked ? eval("response."+this.id) : 0);
                 //console.log("objData[id]: ", objData[id]);
               }

             }
           }//if not undefined
         else{
           defined=false;
         }
       });//checkbox
     }//chckbox loop

         if(defined){
           data.push(objData);
           obj.lists=[];
           obj.lists.push(objData);
        }

        ++j;
        //++start;

       }//while loop
     }//else

         if(p<pages){
           //console.log("Data: ", data);
           if(obJSON1.currPageParam){ //nex\prev page
               ++p;
               getTheNextPage(p, pages, eval("response."+obJSON1.nextPageParam));
           }else if(obJSON1.offsetPage){//offset page
             ++p;
             getTheNextPage(p, pages, eval("response."+obJSON1.offsetPage));
           }else{//index page
             ++p;
             getTheNextPage(p, pages, eval("response."+obJSON1.indexPage));
           }
         }else{
           // populateTable(data);
           //return json or create csv csv data
           console.log("All results: ", objData);
         }

       }//response
   //  );//new AJAX
    });//AJAX
  }//else CORS

  }//end of getTheNextPage function

  }
  });


  }
});
});

}//end of functions






// var myObj={"a":"1", "b":"2"}

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
// $.post("/writeFile",{FileContent: JSON.stringify(myObj), FileName: 'testingDUH'}, function(data){
//     console.log("data: ", data);
//     console.log("print: ", myObj);
// });

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
