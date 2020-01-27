// import * as myModule from 'https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js';
//test
var config, obJSON1, listP;
var defined = true;
var data=[], obj =[], allResults = [];

function scrAPIr(apiURL, reqParameters, responseFields, numOfResults){
  // console.log("HERE: ", reqParameters)
  $.ajax({
    url: 'https://superapi-52bc2.firebaseio.com/config.json',
    method: "GET",
    success: function (conf) {
      // config = conf;
      // firebase.initializeApp(config);

    var apiTitle;
    firebase.database().ref('/apis/').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) { //for each API
        if(childSnapshot.val().url == apiURL){
          apiTitle = childSnapshot.val().title;
        //   console.log("API name: ", apiTitle);

    //[1] Get the API's description from ScrAPIr
    $.ajax({
      url: 'https://superapi-52bc2.firebaseio.com/apis/'+apiTitle+'.json',
      method: "GET",
      success: function (response) {
        obJSON1 = response;

    //[2] From description, get maxResPerPage

      //START HERE
        var pages, numResults, numRes = numOfResults;

        if(numRes){
          var pages = Math.ceil(numRes/obJSON1.maxResPerPage);
          // console.log("pages: ", pages);
          var totalRes = numRes;
          numResults = obJSON1.maxResPerPage;
        }else{
          page=1;
        }

        var start = 0;
        var next="";
        var nextPage = "";
        var p=1;

        requestParameters(obJSON1.parameters);

        getTheNextPage(p, pages, nextPage);

        function getTheNextPage(p, pages, nextPage){
          // console.log("next")
          //[3] From description, get request parameters
          listP=  "{";
          for(var i=0; i<obJSON1.parameters.length; ++i) {
            if($("#"+obJSON1.parameters[i]['name']).val() || obJSON1.parameters[i]['value']){
              listP+= JSON.stringify(obJSON1.parameters[i]['name']); //check conditions before adding names
              listP+= ":"
              listP+= JSON.stringify(obJSON1.parameters[i]['value']);
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
          listP+= (p-1)*(eval(obJSON1.maxResPerPage));
        }else if(obJSON1.currPageParam){
          listP+= ","
          listP+= JSON.stringify(obJSON1.currPageParam);
          listP+= ":";
          listP+= JSON.stringify(nextPage);
        }
        listP+= "}";

    //  console.log("listP: ",JSON.parse(listP));

    if((!obJSON1.headers) || obJSON1.headers[0].headerValue==""){ //no header //no CORS
        $.ajax({
          url: obJSON1.url,
          data: JSON.parse(listP),
          method: 'GET',
          success: function (response) {
            // console.log("RES API: ", response);

            if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
              for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){
                 objData={};
                 objData["id"]= start;

                //  if($("input[name='checkbox-w']").is(":checked")){
                //      $("input[name='checkbox-w']:checked").each(function(){
                    for(var m=0; m < obJSON1.responses.length; ++m){
                      var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                      if(eval(s)){
                       var id = obJSON1.responses[m].name;//this.value;
                       if(obJSON1.responses[m].name=="Video URL"){
                         objData[id] = "https://www.youtube.com/watch?v="+eval("response."+this.id);
                       }else{
                        //  var str = (this.checked ? "response."+this.id : 0);
                        var str = "response."+obJSON1.responses[m].parameter;
                        //  console.log("Each responses: ", "response."+obJSON1.responses[m].parameter);
                         //IF ARRAY
                         if(str.includes("[i]")){
                           var i=0;
                           var splt =  str.split("[i]");
                           // start if undefined
                           if(eval(splt[0]).length==0){
                            objData[id]="";
                          }else{// start if NOT undefined
                          objData[id] = eval("response."+obJSON1.responses[m].parameter);
                          for(i=1; i<eval(splt[0]).length; ++i){
                            objData[id] += ", ";
                            objData[id] += eval("response."+obJSON1.responses[m].parameter);
                          }
                        }///test undefined
                          //IF OBJECT and not ARRAY
                         }else if(eval("response."+obJSON1.responses[m].parameter) instanceof Object && !(eval("response."+obJSON1.responses[m].parameter) instanceof Array)){
                           //console.log("IT IS OBJECT");
                           var objD = eval("response."+obJSON1.responses[m].parameter);
                           var objKV = "";
                           var first = true;
                           for(var i in objD){
                            if(!first){
                              objKV+=", "
                            }else{
                              first = false;
                            }
                            objKV+=i+": "+objD[i];
                          }
                          objData[id]=objKV;

                          for(var i in objD){
                           objData[i]=objD[i];
                         }
                         //IF NEITHER
                         }else{
                           objData[id] = eval("response."+obJSON1.responses[m].parameter);
                         }
                       }
                     }//if not undefined
                   else{
                     defined=false;
                   }
                // });//checkbox //REM
               }//chckbox loop //REM

                   if(defined){
                     data.push(objData);
                     obj.lists=[];
                     obj.lists.push(objData);
                  }
              }//while loop
            }else{
            var j=0;
            while(defined){
               objData={};
               ++start;
               objData["id"]= start;
            //    if($("input[name='checkbox-w']").is(":checked")){
                //    $("input[name='checkbox-w']:checked").each(function(){
                for(var m=0; m < obJSON1.responses.length; ++m){
                     var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                     var arrLength = "response."+obJSON1.responses[m].parameter.split('[j]')[0];
                     var ln = s.split('[')[0];

                     if(j<eval(arrLength).length){
                     var id = obJSON1.responses[m].name;
                     if(obJSON1.responses[m].name=="Video URL"){
                       objData[id] = "https://www.youtube.com/watch?v="+eval("response."+obJSON1.responses[m].parameter);
                     }else{
                       var str = "response."+obJSON1.responses[m].parameter;
                       //IF ARRAY
                       if(str.includes("[i]")){
                         var i=0;
                         var splt =  str.split("[i]");
                         // start if undefined
                         if(eval(splt[0]).length==0){
                          objData[id]="";
                        }else{// start if NOT undefined
                        objData[id] = eval("response."+obJSON1.responses[m].parameter);
                        for(i=1; i<eval(splt[0]).length; ++i){
                          objData[id] += ", ";
                          objData[id] += eval("response."+obJSON1.responses[m].parameter);
                        }
                      }///test undefined
                        //IF OBJECT and not ARRAY
                       }else if(eval("response."+obJSON1.responses[m].parameter) instanceof Object && !(eval("response."+obJSON1.responses[m].parameter) instanceof Array)){
                         var objD = eval("response."+obJSON1.responses[m].parameter);
                         var objKV = "";
                         var first = true;
                         for(var i in objD){
                          if(!first){
                            objKV+=", "
                          }else{
                            first = false;
                          }
                          objKV+=i+": "+objD[i];
                        }
                        objData[id]=objKV;

                        for(var i in objD){
                         objData[i]=objD[i];
                       }
                       //IF NEITHER
                       }else{
                         objData[id] = eval("response."+obJSON1.responses[m].parameter);
                       }

                     }
                   }//if not undefined
                 else{
                   defined=false;
                 }
            //    });//checkbox //REM
             }//chckbox loop //REM

                 if(defined){
                   data.push(objData);
                   obj.lists=[];
                   obj.lists.push(objData);
                }
                ++j;
            }//while loop
          }//else

            if(p<pages){
              if(obJSON1.currPageParam){ //nex\prev page
                  // console.log("nextPage: ", eval("response."+obJSON1.nextPageParam))
                  ++p;
                  getTheNextPage(p, pages, eval("response."+obJSON1.nextPageParam));
              }else if(obJSON1.offsetPage){//offset page
                // console.log("ofsetPage")
                ++p;
                getTheNextPage(p, pages, eval("response."+obJSON1.offsetPage));
              }else{//index page
                // console.log("indexPage")
                ++p;
                getTheNextPage(p, pages, eval("response."+obJSON1.indexPage));
              }
            }else{
              // populateTable(data);
              //return json or create csv csv data
              // console.log("All results: ", data);
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
          success: function (response) {
            if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
              for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
                 objData={};
                 objData["id"]= start;

                 if($("input[name='checkbox-w']").is(":checked")){
                     $("input[name='checkbox-w']:checked").each(function(){
                      var s = "response."+this.id.split('.')[0];
                      if(eval(s)){
                       var id = obJSON1.responses[m].name;
                       if(obJSON1.responses[m].name=="Video URL"){
                         objData[id] = "https://www.youtube.com/watch?v="+eval("response."+this.id);
                       }else{
                         var str = "response."+this.id;
                         //IF ARRAY
                         if(str.includes("[i]")){
                           var i=0;
                           var splt =  str.split("[i]");
                           // start if undefined
                           if(eval(splt[0]).length==0){
                            objData[id]="";
                          }else{// start if NOT undefined
                          objData[id] = eval("response."+this.id);
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
                            if(!first){
                              objKV+=", "
                            }else{
                              first = false;
                            }
                            objKV+=i+": "+objD[i];
                          }
                          objData[id]=objKV;

                          for(var i in objD){
                           objData[i]=objD[i];
                         }
                         //IF NEITHER
                         }else{
                           objData[id] = (this.checked ? eval("response."+this.id) : 0);
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
              }//while loop
            }else{
            var j=0;
            while(defined){
          objData={};
          ++start;
          objData["id"]= start;

          if($("input[name='checkbox-w']").is(":checked")){
              $("input[name='checkbox-w']:checked").each(function(){
                var s = "response."+this.id.split('.')[0];
                var arrLength = "response."+this.id.split('[j]')[0];
                var ln = s.split('[')[0];

                if(j<eval(arrLength).length){
                var id = obJSON1.responses[m].name;
                if(obJSON1.responses[m].name=="Video URL"){
                  objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                }else{
                  var str = (this.checked ? "response."+this.id : 0);
                  //IF ARRAY
                  if(str.includes("[i]")){
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
                    var objD = (this.checked ? eval("response."+this.id) : 0);
                    var objKV = "";
                    var first = true;
                    for(var i in objD){
                     if(!first){
                       objKV+=", "
                     }else{
                       first = false;
                     }
                     objKV+=i+": "+objD[i];
                   }
                   objData[id]=objKV;

                   for(var i in objD){
                    objData[i]=objD[i];
                  }
                  //IF NEITHER
                  }else{
                    objData[id] = (this.checked ? eval("response."+this.id) : 0);
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
          }//while loop
        }//else

            if(p<pages){
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
                // console.log("All results: ", data);
            }

          }//response
       });//AJAX
     }//else CORS

     }//end of getTheNextPage function

     }
     });


     }
   });
   });
} });//end of firebase config

return data;

}//end of functions


function scrAPIrRawJSON(){

}


function scrAPIrJSON(){

}

function scrAPIrCSV(){

}


function requestParameters(reqParams){

  // console.log("Parameters: ",reqParams)

  params=  "{";
  for(var i=0; i<reqParams.length; ++i){
    params+= reqParams[i]['name'];
    params+= ":"
    params+= JSON.stringify(reqParams[i]['value']);

    if(i+1<reqParams.length){
      params+= ", ";
    }
  }
  params+= "}";
  // console.log(params);
}

function responseFields(){

}


function availableAPIsInScrAPIr(){
  var apis_names_urls=[];

  $.ajax({
    url: 'https://superapi-52bc2.firebaseio.com/config.json',
    method: "GET",
    success: function (config) {
      // config = config;
      firebase.initializeApp(config);
      firebase.database().ref('/apis/').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
          var ob = {
            name:childSnapshot.val().title,
            url:childSnapshot.val().url
          }
          apis_names_urls.push(ob);
        });
        // console.log("apis: ", apis_names_urls);
      });
    }
  });

  return apis_names_urls;
}
