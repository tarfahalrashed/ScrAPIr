var s = document.createElement("script");
s.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js";
document.head.appendChild(s); 

var config, obJSON1, listP;
var defined = true;
var data=[], obj =[], allResults = [];
var apiParams = [];
var method="GET";

var start = 0, next = "", nextPage = "", p = 1, totalRes, pages, numResults, numRes;

function scrAPIr(apiTitle, apiParameters, numOfResults){
   console.log("apiTitle: ", apiTitle)
    //[1] Get the API's description from ScrAPIr
    $.ajax({
      url: 'https://superapi-52bc2.firebaseio.com/apis/'+apiTitle+'.json',
      method: "GET",
      success: function (response) {
        obJSON1 = response;
        
        //[2] From description, get maxResPerPage
        numRes = numOfResults;
        if(numRes){
          pages = Math.ceil(numRes/obJSON1.maxResPerPage);
          totalRes = numRes;
          numResults = obJSON1.maxResPerPage;
        }else{
          page=1;
        }

        start = 0, next = "", nextPage = "", p = 1;

        getTheNextPage(p, pages, nextPage);

        function getTheNextPage(p, pages, nextPage){
          //[3] From description, get request parameters OR from the parameters passed in the function
          if(apiParameters == ""){
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
          }else{ //if parameters were passed to the ScrAPIr function
            var arrParamVal = [];
            var reqParam = apiParameters.split("&");

            listP=  "{";
            for(var i=0; i<reqParam.length; ++i) {
              listP+= JSON.stringify(reqParam[i].split("=")[0]); //check conditions before adding names
              listP+= ":"
              listP+= JSON.stringify(reqParam[i].split("=")[1]);

              if(i+1<reqParam.length){
                if(reqParam[i].split("=")[1]) {
                  listP+= ",";
                }
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

          // console.log("listP: ",JSON.parse(listP));
          if(obJSON1.method){
            method = obJSON1.method;
          }else{
            method = "GET"
          }

      if(((!obJSON1.headers) || obJSON1.headers[0].headerValue=="") && ((!obJSON1.oauth2) || obJSON1.oauth2[0].authURL=="")){ //no header //no CORS
          console.log("NO OAUTH/NO HEADER")
          $.ajax({
            url: obJSON1.url,
            data: JSON.parse(listP),
            method: method,
            success: function (response) {
              // console.log("RES API: ", response);
              if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
                for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){
                  objData={};
                  objData["id"]= start;
                      for(var m=0; m < obJSON1.responses.length; ++m){
                        var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                        if(eval(s)){
                        var id = obJSON1.responses[m].name;//this.value;
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
                  for(var m=0; m < obJSON1.responses.length; ++m){
                      var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                      var arrLength = "response."+obJSON1.responses[m].parameter.split('[j]')[0];
                      var ln = s.split('[')[0];

                      if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){
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
                }//checkbox loop

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
                  // console.log("ofsetPage")
                  ++p;
                  getTheNextPage(p, pages, eval("response."+obJSON1.offsetPage));
                }else if(obJSON1.indexPage){//index page
                  // console.log("indexPage")
                  ++p;
                  getTheNextPage(p, pages, eval("response."+obJSON1.indexPage));
                }else{

                }
              }else{
                if(data.length>0){
                  console.log("data: ", data);
                }else{
                  console.log("create something else other than table!")
                }
              }

            }//response
        //  );//new AJAX
        });//AJAX
      }else if(obJSON1.headers && obJSON1.headers[0].headerValue){ //if header
        console.log("HEADER")
        var data1='';
        fetch("https://scrapir.org/api/"+apiTitle+'?'+listP)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          data1 = data; 
        });

        setTimeout(function(){
          console.log("DATA1: ", data1);
          data = data1;
        }, 2000);  

      }else{ //if oauth
        console.log("if oauth");
        authorize();
      }//else
     }//end of getTheNextPage function
    }
  });

  return data;

}//end of functions


var auth_url,token_url, redirect_url, client_id, client_secret, response_type, scope, grant_type, client_auth, tok;

function authorize(){

    auth_url= obJSON1.oauth2[0].authURL;
    token_url= obJSON1.oauth2[0].tokenURL;
    redirect_url= obJSON1.oauth2[0].callbackURL;
    client_id= obJSON1.oauth2[0].clientId;
    client_secret= obJSON1.oauth2[0].clientSec;
    response_type= obJSON1.oauth2[0].resType;
    scope= obJSON1.oauth2[0].scope;
    grant_type= obJSON1.oauth2[0].grantType;
    client_auth= obJSON1.oauth2[0].clientAuth;

    var win = window.open(auth_url+"?response_type="+JSON.parse(JSON.stringify(response_type))+"&scope="+JSON.parse(JSON.stringify(scope))+"&client_id="+JSON.parse(JSON.stringify(client_id))+"&redirect_uri="+JSON.parse(JSON.stringify(redirect_url))+"", "windowname1", 'width=800, height=600');

    var pollTimer = window.setInterval(function() {
      try {
        console.log("win.document.URL", win.document.URL); 
        if (win.document.URL.indexOf('http://127.0.0.1:8080') != -1) {
          window.clearInterval(pollTimer);
          var url= win.document.URL;
          acToken= gup(url, response_type);
          // tokenType = gup(url, 'token_type');
          // expiresIn = gup(url, 'expires_in');
          win.close();
          validateToken(acToken);
        }
      } catch(e) {
        console.log("oauth is not working correctly!");
      }
    }, 200);

}

function gup(url, name) {
  name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
  var regexS = "[\?&]"+name+"=([^&#]*)";
  var regex = new RegExp( regexS );
  var results = regex.exec( url );
  if( results == null )
    return "";
  else
    return results[1];
}

function validateToken(token) {
  console.log("Token: ",token)
  console.log("Token URL: ",token_url)

  $.ajax({
    url: token_url,
    method: "POST",
    data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type} ,
    success: function(response) {
      console.log("response: ",response);
      //important to check access token and token type (e.g. bearer)
      tok = response.access_token;
      console.log("tok: ", tok)
      getData();
      //removed
    },
    error: function(response, jqXHR, textStatus, errorThrown) {
      console.log("error: ",response);
    }
  });
}

function getData(){
  console.log("getData()")
  $.ajax({
    url: obJSON1.url,
    data: JSON.parse(listP),
    method: method,
    headers: {
      "Authorization" : "Bearer " +tok, 
      "Content-Type"  : "application/json"
    },
    success: function (response) {
      // console.log("RES API: ", response);
      if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
        for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){
           objData={};
           objData["id"]= start;
              for(var m=0; m < obJSON1.responses.length; ++m){
                var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                if(eval(s)){
                 var id = obJSON1.responses[m].name;//this.value;
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
          // });//checkbox 
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
          for(var m=0; m < obJSON1.responses.length; ++m){
               var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
               var arrLength = "response."+obJSON1.responses[m].parameter.split('[j]')[0];
               var ln = s.split('[')[0];

               if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){
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
        }//checkbox loop

           if(defined){
             data.push(objData);
             obj.lists=[];
             obj.lists.push(objData);
          }
          ++j;
      }//while loop
    }//else

      if(p<pages){
        console.log("p: ", p)
        console.log("pages: ", pages)

        if(obJSON1.currPageParam){ //nex\prev page
            ++p;
            getTheNextPage(p, pages, eval("response."+obJSON1.nextPageParam));
        }else if(obJSON1.offsetPage){//offset page
          // console.log("ofsetPage")
          ++p;
          getTheNextPage(p, pages, eval("response."+obJSON1.offsetPage));
        }else if(obJSON1.indexPage){//index page
          // console.log("indexPage")
          ++p;
          getTheNextPage(p, pages, eval("response."+obJSON1.indexPage));
        }else{

        }
      }else{
        if(data.length>1){
          console.log("data: ", data)
        }else{
         
          console.log("create something else other than table!")
        }
      }

    },//response
    error: function(response, jqXHR, textStatus, errorThrown) {
      console.log("error: ",response);
    }
  });//AJAX
  // console.log("outside data: ", data);
  return data;
}

function requestParameters(reqParams){
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

function haapiDescription(){
  return obJSON1;
}

function availableAPIsInScrAPIr(){
  var apis_names_urls=[];

  $.ajax({
    url: 'https://superapi-52bc2.firebaseio.com/apis.json',
    method: "GET",
    success: function (config) {
      for (a in config){
        var ob = {
          name: config[a].title,
          url:  config[a].url,
          type: config[a].apiType
        }
        apis_names_urls.push(ob);
      } 

      // firebase.initializeApp(config);
      // firebase.database().ref('/apis/').once('value').then(function(snapshot) {
      //   snapshot.forEach(function(childSnapshot) {
      //     var ob = {
      //       name:childSnapshot.val().title,
      //       url:childSnapshot.val().url,
      //       type: childSnapshot.val().apiType
      //     }
      //     apis_names_urls.push(ob);
        // });
      //console.log("apis: ", apis_names_urls);
      // });
    }
  });

  return apis_names_urls;
}



