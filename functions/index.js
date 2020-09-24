var cors = require('cors')({origin: true});
var firebase = require('firebase');
const admin = require("firebase-admin");
var functions = require('firebase-functions');
var express = require('express');
var axios = require('axios');
var http = require('http');
var https = require('https');
var $ = require('jquery');
var querystring = require('querystring');
var request = require('request');
var open = require('open');
var path = require('path');
var fs  = require('fs');
var app = express();

// const graphqlHTTP = require('express-graphql');
// const { buildSchema } = require('graphql');
const fetch = require('node-fetch')
const { ApolloServer, gql } = require('apollo-server-express');

//Construct a schema, using GraphQL schema language
// const typeDefs = gql`

//   type Video {	
//     id: String
//     title: String
//     channel: Channel
//     owner: String
//   }

//   type Channel {	
//     id: String
//     name: String
//     description: String
//     videos: [Video]
//   }

//   type Playlist {
//     id: String
//     name: String
//     owner: String
//   }

//   type User {
//     id: String
//     screenname: String
//     userVideos: [Video]
//   }


//   type Query {
//     videos(search: String): [Video]
//     video(id: String): Video

//     channels: [Channel]
//     channel(channelId: String): Channel
//     channelVideos(channelId: String): [Video]
//     channelUsers(channelId: String): [User]

//     playlists: [Playlist]
//     playlist(playlistId: String): Playlist
//     playlistVideos(playlistId: String): [Video]

//     users(usernames: [String]): [User]
//     user(usernames: [String]): User
//     userFollowers(userId: String): [User]
//     userVideos(userId: String): [Video]
//     userSubscriptions(userId: String): [Video]
//   }

//   type Mutation {
//     setMessage(message: String): String
//   }


// `;

// const baseURL = `https://api.dailymotion.com`

// // function fetchResponseByURL(relativeURL) {
// //   return fetch(`${baseURL}${relativeURL}`).then(res => res.json());
// // }

// // /user/{id}/favorites
// // /user/{userId}/followers
// // /channel/{id}/users
// // /user/x1xvgtc/subscriptions
// // /user/{id}/subscriptions


// const resolvers = {
//   Query: {
//     // user:(root, args) => {
//     //   id: return fetch(`${baseURL}/user/${args.id}`).then(res => res.json().id)
//     //   userVideos: parent => {
//     //         let results =  Promise.all(parent.id.map((id) => axios.get(`${baseURL}/user/${args.id}/videos`))) 
//     //         return results.map((result) => result.data)
//     //      }
//     // },

//     videos: (root, args) => {
//       return fetch(`${baseURL}/videos?search=${args.search}`)
//       .then(res => res.json())
//       .then(data => data.list);
//     },

//     video: (root, args) => {
//       return fetch(`${baseURL}/video/${args.id}`).then(res => res.json())
//     },

//     channel: (root, args) => {
//       return fetch(`${baseURL}/channel/${args.channelId}`).then(res => res.json())
//     },

//     channelVideos: (root, args) => {
//       return fetch(`${baseURL}/channel/${args.channelId}/videos`)
//       .then(res => res.json())
//       .then(data => data.list);
//     },

//     playlistVideos: (root, args) => {
//       return fetch(`${baseURL}/playlist/${args.playlistId}/videos`)
//       .then(res => res.json())
//       .then(data => data.list);
//     }

//   },
// }

// const server = new ApolloServer({
//   typeDefs,
//   resolvers,
// });

// server.applyMiddleware({ app }); //just add this line to be abel to call /graphql in your javascript code

// //The following lines are for testing graphQL using the dashboard
// app.listen({ port: 4000 }, () =>
//   console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
// )


var requestToken, redirect_uri, passedToken;

// Declare the redirect route
app.get('/oauth', (req, res) => {
  console.log("DUH!")
  // The req.query object has the query params that
  // were sent to this route. We want the `code` param
  console.log("req.query: ", req.query)
  requestToken = req.query.code
  console.log("requestToken: ", requestToken)

  var jsonDataObj = {'grant_type': grant_type, 'client_id': client_id, 'client_secret': client_secret, 'redirect_uri':redirect_url, 'code': requestToken};
  jsonDataObj = querystring.stringify(jsonDataObj); 

  request.post({
    url: token_url, 
    headers: {'Content-Type' : 'application/x-www-form-urlencoded'},
    body: jsonDataObj
  }, function(error, response, body){
    passedToken = JSON.parse(body);
    //getDataFromOauth(passedToken.access_token);
    //console.log(response);
    var tok = passedToken.access_token;

    console.log("getDataFromOauth");
    console.log("tok: ", tok);
    //[2] pass the token as a header to the optionsAPI
    var optionsAPI= {
      method: "GET",
      headers: {"Authorization": "Bearer " +tok}
    };
  
    https.get(urlAPI, optionsAPI, res => {//HERE
      res.setEncoding("utf8");
      res.on("data", data2 => {
          apiData1 += data2;
      });
      res.on("end", () => {
          response = JSON.parse(apiData1);
          //console.log("RES API: ", response);
          if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
              for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){
                 objData={};
                 //objData["id"]= start;
                    for(var m=0; m < obJSON1.responses.length; ++m){
                      var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                      if(eval(s)){
                       var id = obJSON1.responses[m].name;//this.value;
                       //if(obJSON1.responses[m].name=="Video URL"){
                       if(obJSON1.responses[m].displayedName=="videoId"){
                         objData[id] = "https://www.youtube.com/embed/"+eval("response."+obJSON1.responses[m].parameter);
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
                       } //if Video URL
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
               //objData["id"]= start;
                for(var m=0; m < obJSON1.responses.length; ++m){
                     var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                     var arrLength = "response."+obJSON1.responses[m].parameter.split('[j]')[0];
                     var ln = s.split('[')[0];
  
                     if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){
                     var id = obJSON1.responses[m].name;
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
                ++p;
                getTheNextPage(p, pages, eval("response."+obJSON1.offsetPage));
              }else if(obJSON1.indexPage){//index page
                ++p;
                getTheNextPage(p, pages, eval("response."+obJSON1.indexPage));
              }else{
  
              }
            }else{
              if(data.length>1){

              }else{
                for(var r=0; r<obJSON1.responses.length; ++r){
                  var id = obJSON1.responses[r].name;
                  var str = "response."+obJSON1.responses[r].parameter;
                  if(str.includes("[j]")){
                    str = str.replace('j', '0');
                  }
                  dataObj[id]= eval(str);
                }
              }
            }
            console.log("data: ", data);
        }); //res
      });

    // var optionsAPI= {
    //     method: "GET",
    //     headers: {"Authorization": "Bearer " +bod.access_token}
    // };
    // var apiData1='', apiData2='';

    // https.get('https://api.dailymotion.com/me/favorites', optionsAPI, res => { //GENERALIZE
    //   res.setEncoding("utf8");
    //   res.on("data", data2 => {
    //     apiData1 += data2;
    //   });
    //   res.on("end", () => {
    //     apiData2 = apiData1;
    //     console.log("apiData1: ",apiData2);
    //   });
    // });

  });

  setTimeout(function(){
    res.json(data);
  }, 8000); 
});



//***************************** GET endpoints *****************************//


//--------------------- [/apis] endpoints ---------------------//

//Get all APIs integrated into ScrAPIr
app.get("/apis", (req, res, next) => {
    var apis='';
    let data = '';

    var url = "https://superapi-52bc2.firebaseio.com/apis.json";
    var apis_names_urls=[];

    https.get(url, res => {
        res.setEncoding("utf8");
        res.on("data", data => {
          apis += data;
        });
        res.on("end", () => {
            apis = JSON.parse(apis);
            for(a in apis){
                var ob = {
                    name: apis[a].title,
                    url:  apis[a].url,
                    type: apis[a].apiType
                }
                apis_names_urls.push(ob);
            }
        });
    });

    setTimeout(function(){
        res.json(apis_names_urls);
    }, 500);  
});

var api_to_set = {};

function getData(apiUrl, apiName){
  var apiDesc='';

  https.get(apiUrl, res => {
    res.setEncoding("utf8");
    res.on("data", data => {
      apiDesc += data;
    });
    res.on("end", () => {
      apiDesc = JSON.parse(apiDesc);
      //console.log(apiDesc)
      var name= apiName;
      api_to_set[name] = apiDesc;
      //a = a.concat(apiDesc);//union
    });
  });

}

//Get multiple APIs data specified in :name (e.g. /apis/NewsAPI|YouTube API)
app.get("/apis/:names", (req, res, next) => {

  var apis_params = req.url; //e.g. /apis/NewsAPI?nParameters%7CGoogleBooks
  apis_params = apis_params.split('/apis/')[1];
  apis_params = apis_params.split('%7C');

  for(var i=0; i<apis_params.length; ++i){
    var apiUrl = 'https://scrapir.org/api/'+apis_params[i];
    if(apis_params[i].includes('%20')){
      apiName = apis_params[i].split("%20").join("");
    }else if(apis_params[i].includes(' ')){
      apiName = apis_params[i].split(" ").join("");
    }else{
      apiName = apis_params[i];
    }

    if(apiName.includes('?')){
      apiName = apiName.split('?')[0];
    }else if(apiName.includes('%3F')){
      apiName = apiName.split('%3F')[0];
      //NewsAPI%3Fq%3Dtrump
    }

    getData(apiUrl, apiName);
  }

  setTimeout(function(){
    res.json(api_to_set);
  }, 6000); 

});



var u =[];
var firstP;

function getUniondData(apiUrl, apiName, joinedParams){
  var apiDesc='';
  firstP = joinedResponse[1];

  https.get(apiUrl, res => {
    res.setEncoding("utf8");
    res.on("data", data => {
      apiDesc += data;
    });
    res.on("end", () => {
      apiDesc = JSON.parse(apiDesc);
      //console.log(apiDesc)
      var name= apiName;
      api_to_set[name] = apiDesc;

      //var key = 'en';
      for(var i=0; i<apiDesc.length; ++i){
        for (var p in apiDesc[i]) {
          if (!(joinedParams.includes(p))) {
              delete apiDesc[i][p];
              //console.log("apiDesc: ", apiDesc[i][p]);
          }else{
            // if(p != firstP){
            //   console.log("firstP: ", firstP);
            //   apiDesc[i][p] = apiDesc[i][firstP];
            // }
          }
        }
      }
      u = u.concat(apiDesc);//union
    });
  });

}

var joinedParams = [], joinedResponse = [];
//Union APIs 
app.get("/unionApis/:names", (req, res, next) => {

  var apis_params = req.url; //e.g. /apis/NewsAPI?nParameters%7CGoogleBooks
  apis_params = apis_params.split('/unionApis/')[1];
  apis_params = apis_params.split('%7C'); //split apis by |

  joinedResponse = [['Title', 'URL'], ['Title', 'URL']]; //union on these response fields

  for(var i=0; i<apis_params.length; ++i){
    var apiUrl = 'https://scrapir.org/api/'+apis_params[i];
    if(apis_params[i].includes('%20')){
      apiName = apis_params[i].split("%20").join("");
    }else if(apis_params[i].includes(' ')){
      apiName = apis_params[i].split(" ").join("");
    }else{
      apiName = apis_params[i];
    }

    if(apiName.includes('?')){
      apiName = apiName.split('?')[0];
    }else if(apiName.includes('%3F')){
      apiName = apiName.split('%3F')[0];
      //NewsAPI%3Fq%3Dtrump
    }

    joinedParams = joinedResponse[i]; // API_0 will get responses_0

    getUniondData(apiUrl, apiName, joinedParams);
  }

  setTimeout(function(){
    res.json(u);
  }, 8000); 

});



var merge=[];
var apiDesc='', apiDesc2='';
var item;

function getJoinedData(apiUrl1, apiUrl2, outParam, inParam){
  merge=[];
  //console.log("URL2: ", apiUrl2);
  apiDesc='', apiDesc2='';

  https.get(apiUrl1, res => {
    res.setEncoding("utf8");
    res.on("data", data => {
      apiDesc += data;
    });
    res.on("end", () => {
      apiDesc = JSON.parse(apiDesc);
      //console.log("apiDesc: ", apiDesc);

      //Check the other URL
      for(var i=0; i<apiDesc.length; ++i){
        // if(apiUrl2.includes('{')){
        //   var url = apiUrl2.replace("{"+inParam+"}", apiDesc[i][outParam]);
        // }else{
        var url = apiUrl2+'?'+inParam+'='+apiDesc[i][outParam];
        // }
        console.log("URL: ", url);
        item = apiDesc[i];
        mergeData(url, item)
      }
    });
  });

}

function mergeData(url, item){

  https.get(url, res => {
    res.setEncoding("utf8");
    apiDesc2='';
    res.on("data", data => {
      apiDesc2 += data;
    });
    res.on("end", () => {
      apiDesc2 = JSON.parse(apiDesc2);
      console.log("apiDesc[i]: ", item);
      console.log("apiDesc2: ", apiDesc2);
      merge.push(Object.assign({}, item, apiDesc2));
    });
  });

}

//Join APIs
app.get("/joinApis/:names", (req, res, next) => {

  var apis_params = req.url; //e.g. /apis/NewsAPI?nParameters%7CGoogleBooks
  apis_params = apis_params.split('/joinApis/')[1];
  apis_params = apis_params.split('%7C'); //split apis by |

  //for(var i=0; i<apis_params.length; ++i){
  var apiUrl1 = 'https://scrapir.org/api/'+apis_params[0];
  var apiUrl2 = 'https://scrapir.org/api/'+apis_params[1];

  getJoinedData(apiUrl1, apiUrl2, "id", "id");

  setTimeout(function(){
    res.json(merge);
  }, 8000); 

});


//--------------------- [/specs] endpoints ---------------------//

//Get the API descreption specified in :name (e.g. /apis/NewsAPI)
app.get("/specs/:name", (req, res, next) => {

    var apiDesc='';
    var data = '';
    var url = 'https://superapi-52bc2.firebaseio.com/apis/'+req.params.name+'.json';

    https.get(url, res => {
        res.setEncoding("utf8");
        res.on("data", data => {
            apiDesc += data;
        });
        res.on("end", () => {
            apiDesc = JSON.parse(apiDesc);
        });
    });

    setTimeout(function(){
        res.json(apiDesc);
    }, 1000);  
  
});

//Get the API parameters
app.get("/specs/:name/parameters", (req, res, next) => {
    var apiDesc='';
    var data = '';
    var url = 'https://superapi-52bc2.firebaseio.com/apis/'+req.params.name+'.json';

    https.get(url, res => {
        res.setEncoding("utf8");
        res.on("data", data => {
            apiDesc += data;
        });
        res.on("end", () => {
            apiDesc = JSON.parse(apiDesc);
        });
    });

    setTimeout(function(){
        res.json(apiDesc.parameters);
    }, 500);  
});

//Get the API responses
app.get("/specs/:name/responses", (req, res, next) => {
  var apiDesc='';
  var data = '';
  var url = 'https://superapi-52bc2.firebaseio.com/apis/'+req.params.name+'.json';

  https.get(url, res => {
      res.setEncoding("utf8");
      res.on("data", data => {
          apiDesc += data;
      });
      res.on("end", () => {
          apiDesc = JSON.parse(apiDesc);
      });
  });

  setTimeout(function(){
      res.json(apiDesc.responses);
  }, 500);  
});

//Get the API URL
app.get("/specs/:name/url", (req, res, next) => {
  var apiDesc='';
  var data = '';
  var url = 'https://superapi-52bc2.firebaseio.com/apis/'+req.params.name+'.json';

  https.get(url, res => {
      res.setEncoding("utf8");
      res.on("data", data => {
          apiDesc += data;
      });
      res.on("end", () => {
          apiDesc = JSON.parse(apiDesc);
      });
  });

  setTimeout(function(){
      res.json(apiDesc.url);
  }, 500);  
});



//--------------------- [/api] endpoints ---------------------//

var config, obJSON1, listP, dataObj = {};
var auth_url,token_url, redirect_url, client_id, client_secret, response_type, scope, grant_type, client_auth, tok;
var urlAPI, pages, numResults, apiData1='';
var start, next, nextPage, p, pages, totalRes;


var defined, data=[], obj =[], allResults = [], apiParams = [], method="GET", apiParameters="", apiData='', data1 = '', apiTitle, paramInURL;
app.get("/api/:name", (req, res, next) => {
  // console.log("req.query: ", req.query);

  tok = req.query.tokenAPI;

  dataObj = {};
  cors(req, res, () => {

    //if URL contains {id}, then get the value from the parameter id=374829365
    //console.log("Number of Results: ", req.query.scpNumResults)
    defined = true;
    data=[], obj =[], allResults = [];
    apiParams = [];
    method="GET";
    apiParameters="";

    apiData='';
    data1 = '';
    apiTitle;

    paramInURL;

    if(isEmpty(req.query)){ //No parameters passed
        apiParameters= "";
    }else{ //Parameters passed
        apiParameters= req.query;
    }

    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    apiTitle = req.params.name.split('?')[0]

    //[1] Get the API's description from ScrAPIr
    var urlDesc = 'https://superapi-52bc2.firebaseio.com/apis/'+apiTitle+'.json';
    var optionsDesc = {
        method: "GET"
    };

    https.get(urlDesc, optionsDesc, res => {
        res.setEncoding("utf8");
        res.on("data", data1 => {
            apiData += data1;
        });
        res.on("end", () => {
            obJSON1 = JSON.parse(apiData);
            method = obJSON1.method;

            //[2] From description, get maxResPerPage
            if(req.query.scpNumResults){
                numRes = req.query.scpNumResults;
            }else{
                numRes = obJSON1.maxResPerPage;
            }

            if(numRes){
                pages = Math.ceil(numRes/obJSON1.maxResPerPage);
                totalRes = numRes;
                numResults = obJSON1.maxResPerPage;
                // console.log("numResults: ",obJSON1.maxResPerPage)
            }else{
                page=1;
            }

            start = 0;
            next = "";
            nextPage = "";
            p = 1;
            var link = obJSON1.url;

            getTheNextPage(p, pages, nextPage); 

            function getTheNextPage(p, pages, nextPage){
              // console.log("NEXT PAGE")

                //[3] From description, get request parameters OR from the parameters passed in the function
                if(apiParameters == ""){ //if no parameters were passed
                  // console.log("NO PARAMS")
                 if(obJSON1.parameters){
                  listP=  "";
                  parsLength = obJSON1.parameters.length;
                  for(var i=0; i<parsLength; ++i) {
                    if(obJSON1.parameters[i]['value']){
                      if(link.includes('{'+obJSON1.parameters[i]['name']+'}')){
                        parsLength= parsLength-1;
                        link=link.replace('{'+obJSON1.parameters[i]['name']+'}', obJSON1.parameters[i]['value']);
                      }else{
                        listP+= obJSON1.parameters[i]['name']; //check conditions before adding names
                        listP+= "="
                        listP+= obJSON1.parameters[i]['value'];
                      }
                    }
      
                    if(i+1<parsLength){
                      if(obJSON1.parameters[i+1]['value']) {
                        listP+= "&";
                      }
                    }
                  //}
                 }//for loop
                }
              }else{ //if parameters were passed
                console.log("passed!1");
                 if(obJSON1.parameters){
                  listP=  "";
                  parsLength = obJSON1.parameters.length;
                  for(var i=0; i<parsLength; ++i) {
                    console.log("passed!2");
                    var value = getKeyByValue(apiParameters, obJSON1.parameters[i]['name']); 
                    console.log("value: ", value)
                    //if(value || (obJSON1.parameters[i]['value'])){
                      if(link.includes('{'+obJSON1.parameters[i]['name']+'}')){
                        parsLength= parsLength-1;
                        link=link.replace('{'+obJSON1.parameters[i]['name']+'}', value);
                      }else{
                      
                    if(value){
                      listP+= obJSON1.parameters[i]['name']; 
                      listP+= "="
                      listP+= value;
                    }else{
                    if(obJSON1.parameters[i]['value']){
                      listP+= obJSON1.parameters[i]['name']; 
                      listP+= "="
                      listP+= obJSON1.parameters[i]['value'];
                    }
                    }
                   }
                 // }
                    if(i+1<parsLength){
                      if(obJSON1.parameters[i+1]['value']) {
                        listP+= "&";
                      }
                    }
                  }//for loop

                    function getKeyByValue(object, key) { 
                      for (var prop in object) { 
                          if (object.hasOwnProperty(prop)) { 
                              if (prop === key) 
                              return object[prop]; 
                          } 
                      } 
                    } // end of getKeyByValue function
                 }
                }
                
      
                if(obJSON1.resPerPageParam){
                  if(listP.charAt(1)){
                    listP+= "&"
                  }
                  listP+= obJSON1.resPerPageParam;
                  listP+= "=";
                  listP+= obJSON1.maxResPerPage;
                }
                if(obJSON1.indexPage){
                  if(listP.charAt(1)){
                    listP+= "&"
                  }
                  //listP+= "&"
                  listP+= obJSON1.indexPage;
                  listP+= "=";
                  listP+= p;
                }else if(obJSON1.offsetPage){
                  if(listP.charAt(1)){
                    listP+= "&"
                  }
                  //listP+= "&"
                  listP+= obJSON1.offsetPage;
                  listP+= "=";
                  listP+= (p-1)*(eval(obJSON1.maxResPerPage));
                }else if(obJSON1.currPageParam){
                  if(listP.charAt(1)){
                    listP+= "&"
                  }
                  //listP+= "&"
                  listP+= obJSON1.currPageParam;
                  listP+= "=";
                  listP+= nextPage;
                }
                listP+= "";
      
                // console.log("listP: ",JSON.stringify(listP));

                if(obJSON1.method){
                  method = obJSON1.method;
                }else{
                  method = "GET"
                }
      
                var apiData1='';
                var data2 = '';

                urlAPI = link+"?"+listP;

                function getKeyByValue(object, key) { 
                  for (var prop in object) { 
                      if (object.hasOwnProperty(prop)) { 
                          if (prop === key) 
                          return object[prop]; 
                      } 
                  } 
                } 


                // console.log("URL1: ", urlAPI)

                if((!obJSON1.headers || obJSON1.headers[0].headerValue=="") && ((!obJSON1.oauth2) || obJSON1.oauth2[0].authURL=="") ){
                  console.log("no headrer/no oauth")
                    var optionsAPI= {
                        method: obJSON1.method//"GET"
                    };
                }else if((obJSON1.oauth2) && obJSON1.oauth2[0].authURL!=""){

                  console.log("if oauth index.js: ", tok);
                  var headerKey= "Authorization"; //obJSON1.headers[0].headerKey;
                  var headerVal= "Bearer " +tok; //obJSON1.headers[0].headerValue;
                  var headers_to_set = {};
                  headers_to_set[headerKey] = headerVal;
                  
                  console.log("if oauth index.js: ", headers_to_set);

                  var optionsAPI= {
                      method: obJSON1.method,
                      headers: headers_to_set
                  };        
          
                }else{//if header
                  console.log("if header index.js")
                    var headerKey= obJSON1.headers[0].headerKey;
                    var headerVal= obJSON1.headers[0].headerValue;
                    var headers_to_set = {};
                    headers_to_set[headerKey] = headerVal;
                    
                    var optionsAPI= {
                        method: obJSON1.method,//"GET",
                        headers: headers_to_set
                    };
                }
                
                https.get(urlAPI, optionsAPI, res => {//HERE
                    res.setEncoding("utf8");
                    res.on("data", data2 => {
                        apiData1 += data2;
                    });
                    res.on("end", () => {
                        response = JSON.parse(apiData1);
                        //console.log("RES API: ", response);

                        ///start HERE
                        if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
                          console.log("FIRST if")
                            for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){
                               objData={};
                               //objData["id"]= start;
                                  for(var m=0; m < obJSON1.responses.length; ++m){
                                    var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                                    if(eval(s)){
                                     var id = obJSON1.responses[m].displayedName;//name;//this.value;
                                     if(obJSON1.responses[m].displayedName=="videoId"){
                                       objData[id] = "https://www.youtube.com/embed/"+eval("response."+obJSON1.responses[m].parameter);
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
                                    } //if Video URL
                                   }//if not undefined
                                 else{
                                   defined=false;
                                 }
                              // });//checkbox 
                             }//chckbox loop
                                // console.log("objData: ", objData);
                                 if(defined){
                                   data.push(objData);
                                   obj.lists=[];
                                   obj.lists.push(objData);
                                }
                            }//while loop
                          }else{
                          // console.log("SECOND if")
                          var j=0;
                          while(defined){
                             objData={};
                             ++start;
                             //objData["id"]= start;
                              for(var m=0; m < obJSON1.responses.length; ++m){
                                   var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                                   var arrLength = "response."+obJSON1.responses[m].parameter.split('[j]')[0];
                                   var ln = s.split('[')[0];
              
                                   if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){
                                   var id = obJSON1.responses[m].displayedName;//name;
                                   if(obJSON1.responses[m].displayedName=="videoId"){
                                   //if(obJSON1.responses[m].name=="Video URL"){
                                     objData[id] = "https://www.youtube.com/embed/"+eval("response."+obJSON1.responses[m].parameter);
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
                                   } //if Video URL
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
                            // console.log("p: ", p)
                            // console.log("pages: ", pages)
              
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
                              // console.log("data: ", data);
                              // populateListAndTree(arrData2)
                              // populateTable(data);
                            }else{
                              // $("#tableV").hide();
                              //console.log("data: ", response); //RAW JSON
                              for(var r=0; r<obJSON1.responses.length; ++r){
                                var id = obJSON1.responses[r].displayedName;//name;
                                var str = "response."+obJSON1.responses[r].parameter;
                                if(str.includes("[j]")){
                                  str = str.replace('j', '0');
                                }
                                dataObj[id]= eval(str);
                                //console.log(eval(str));
                              }
                              // console.log("arrData2: ", arrData2);
                              // populateListAndTree(response);
                              //console.log("create something else other than table!")
                            }
                          }
 
                    });
                });
                
            }//end of getTheNextPage function


          // }else{
          //   console.log("YES OAUTH");
          //   Authorize();

          //}

  });
    });

    setTimeout(function(){
        if(Object.keys(dataObj).length === 0 && dataObj.constructor === Object){
          // console.log(data);
          res.json(data);
        }else{
          // console.log(dataObj);
          res.json(dataObj);
        }
        
    }, 1000);  

  });
});




app.get("/function/:name", (req, res, next) => {
  console.log("req.query: ", req.query);

  tok = req.query.tokenAPI;

  dataObj = {};
  cors(req, res, () => {

    //if URL contains {id}, then get the value from the parameter id=374829365
    //console.log("Number of Results: ", req.query.scpNumResults)
    defined = true;
    data=[], obj =[], allResults = [];
    apiParams = [];
    method="GET";
    apiParameters="";

    apiData='';
    data1 = '';
    apiTitle;

    paramInURL;

    if(isEmpty(req.query)){ //No parameters passed
        apiParameters= "";
    }else{ //Parameters passed
        apiParameters= req.query;
    }

    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    apiTitle = req.params.name.split('?')[0]

    //[1] Get the API's description from ScrAPIr
    var urlDesc = 'https://superapi-52bc2.firebaseio.com/functions/'+apiTitle+'.json';
    var optionsDesc = {
        method: "GET"
    };

    https.get(urlDesc, optionsDesc, res => {
        res.setEncoding("utf8");
        res.on("data", data1 => {
            apiData += data1;
        });
        res.on("end", () => {
            obJSON1 = JSON.parse(apiData);
            method = obJSON1.method;

            //[2] From description, get maxResPerPage
            if(req.query.scpNumResults){
                numRes = req.query.scpNumResults;
            }else{
                numRes = obJSON1.maxResPerPage;
            }

            if(numRes){
                pages = Math.ceil(numRes/obJSON1.maxResPerPage);
                totalRes = numRes;
                numResults = obJSON1.maxResPerPage;
                console.log("numResults: ",obJSON1.maxResPerPage)
            }else{
                page=1;
            }

            start = 0;
            next = "";
            nextPage = "";
            p = 1;
            var link = obJSON1.url;

            getTheNextPage(p, pages, nextPage); 

            function getTheNextPage(p, pages, nextPage){
              console.log("NEXT PAGE")

                //[3] From description, get request parameters OR from the parameters passed in the function
                if(apiParameters == ""){ //if no parameters were passed
                  console.log("NO PARAMS")
                 if(obJSON1.parameters){
                  listP=  "";
                  parsLength = obJSON1.parameters.length;
                  for(var i=0; i<parsLength; ++i) {
                    if(obJSON1.parameters[i]['value']){
                      if(link.includes('{'+obJSON1.parameters[i]['name']+'}')){
                        parsLength= parsLength-1;
                        link=link.replace('{'+obJSON1.parameters[i]['name']+'}', obJSON1.parameters[i]['value']);
                      }else{
                        listP+= obJSON1.parameters[i]['name']; //check conditions before adding names
                        listP+= "="
                        listP+= obJSON1.parameters[i]['value'];
                      }
                    }
      
                    if(i+1<parsLength){
                      if(obJSON1.parameters[i+1]['value']) {
                        listP+= "&";
                      }
                    }
                  //}
                 }//for loop
                }
              }else{ //if parameters were passed
                console.log("passed!1");
                 if(obJSON1.parameters){
                  listP=  "";
                  parsLength = obJSON1.parameters.length;
                  for(var i=0; i<parsLength; ++i) {
                    console.log("passed!2");
                    var value = getKeyByValue(apiParameters, obJSON1.parameters[i]['name']); 
                    console.log("value: ", value)
                    //if(value || (obJSON1.parameters[i]['value'])){
                      if(link.includes('{'+obJSON1.parameters[i]['name']+'}')){
                        parsLength= parsLength-1;
                        link=link.replace('{'+obJSON1.parameters[i]['name']+'}', value);
                      }else{
                      
                    if(value){
                      listP+= obJSON1.parameters[i]['name']; 
                      listP+= "="
                      listP+= value;
                    }else{
                    if(obJSON1.parameters[i]['value']){
                      listP+= obJSON1.parameters[i]['name']; 
                      listP+= "="
                      listP+= obJSON1.parameters[i]['value'];
                    }
                    }
                   }
                 // }
                    if(i+1<parsLength){
                      if(obJSON1.parameters[i+1]['value']) {
                        listP+= "&";
                      }
                    }
                  }//for loop

                    function getKeyByValue(object, key) { 
                      for (var prop in object) { 
                          if (object.hasOwnProperty(prop)) { 
                              if (prop === key) 
                              return object[prop]; 
                          } 
                      } 
                    } // end of getKeyByValue function
                 }
                }
                
      
                if(obJSON1.resPerPageParam){
                  if(listP.charAt(1)){
                    listP+= "&"
                  }
                  listP+= obJSON1.resPerPageParam;
                  listP+= "=";
                  listP+= obJSON1.maxResPerPage;
                }
                if(obJSON1.indexPage){
                  if(listP.charAt(1)){
                    listP+= "&"
                  }
                  //listP+= "&"
                  listP+= obJSON1.indexPage;
                  listP+= "=";
                  listP+= p;
                }else if(obJSON1.offsetPage){
                  if(listP.charAt(1)){
                    listP+= "&"
                  }
                  //listP+= "&"
                  listP+= obJSON1.offsetPage;
                  listP+= "=";
                  listP+= (p-1)*(eval(obJSON1.maxResPerPage));
                }else if(obJSON1.currPageParam){
                  if(listP.charAt(1)){
                    listP+= "&"
                  }
                  //listP+= "&"
                  listP+= obJSON1.currPageParam;
                  listP+= "=";
                  listP+= nextPage;
                }
                listP+= "";
      
                console.log("listP: ",JSON.stringify(listP));

                if(obJSON1.method){
                  method = obJSON1.method;
                }else{
                  method = "GET"
                }
      
                var apiData1='';
                var data2 = '';

                urlAPI = link+"?"+listP;

                function getKeyByValue(object, key) { 
                  for (var prop in object) { 
                      if (object.hasOwnProperty(prop)) { 
                          if (prop === key) 
                          return object[prop]; 
                      } 
                  } 
                } 


                console.log("URL1: ", urlAPI)

                if((!obJSON1.headers || obJSON1.headers[0].headerValue=="") && ((!obJSON1.oauth2) || obJSON1.oauth2[0].authURL=="") ){
                  console.log("no headrer/no oauth")
                    var optionsAPI= {
                        method: obJSON1.method//"GET"
                    };
                }else if((obJSON1.oauth2) && obJSON1.oauth2[0].authURL!=""){

                  console.log("if oauth index.js: ", tok);
                  var headerKey= "Authorization"; //obJSON1.headers[0].headerKey;
                  var headerVal= "Bearer " +tok; //obJSON1.headers[0].headerValue;
                  var headers_to_set = {};
                  headers_to_set[headerKey] = headerVal;
                  
                  console.log("if oauth index.js: ", headers_to_set);

                  var optionsAPI= {
                      method: obJSON1.method,
                      headers: headers_to_set
                  };        
          
                }else{//if header
                  console.log("if header index.js")
                    var headerKey= obJSON1.headers[0].headerKey;
                    var headerVal= obJSON1.headers[0].headerValue;
                    var headers_to_set = {};
                    headers_to_set[headerKey] = headerVal;
                    
                    var optionsAPI= {
                        method: obJSON1.method,//"GET",
                        headers: headers_to_set
                    };
                }
                
                https.get(urlAPI, optionsAPI, res => {//HERE
                    res.setEncoding("utf8");
                    res.on("data", data2 => {
                        apiData1 += data2;
                    });
                    res.on("end", () => {
                        response = JSON.parse(apiData1);
                        //console.log("RES API: ", response);

                        ///start HERE
                        if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
                          console.log("FIRST if")
                            for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){
                               objData={};
                               //objData["id"]= start;
                                  for(var m=0; m < obJSON1.responses.length; ++m){
                                    var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                                    if(eval(s)){
                                     var id = obJSON1.responses[m].displayedName;//name;//this.value;
                                     if(obJSON1.responses[m].displayedName=="videoId"){
                                       objData[id] = "https://www.youtube.com/embed/"+eval("response."+obJSON1.responses[m].parameter);
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
                                    } //if Video URL
                                   }//if not undefined
                                 else{
                                   defined=false;
                                 }
                              // });//checkbox 
                             }//chckbox loop
                                console.log("objData: ", objData);
                                 if(defined){
                                   data.push(objData);
                                   obj.lists=[];
                                   obj.lists.push(objData);
                                }
                            }//while loop
                          }else{
                          console.log("SECOND if")
                          var j=0;
                          while(defined){
                             objData={};
                             ++start;
                             //objData["id"]= start;
                              for(var m=0; m < obJSON1.responses.length; ++m){
                                   var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                                   var arrLength = "response."+obJSON1.responses[m].parameter.split('[j]')[0];
                                   var ln = s.split('[')[0];
              
                                   if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){
                                   var id = obJSON1.responses[m].displayedName;//name;
                                   if(obJSON1.responses[m].displayedName=="videoId"){
                                   //if(obJSON1.responses[m].name=="Video URL"){
                                     objData[id] = "https://www.youtube.com/embed/"+eval("response."+obJSON1.responses[m].parameter);
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
                                   } //if Video URL
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
                            // console.log("p: ", p)
                            // console.log("pages: ", pages)
              
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
                              // console.log("data: ", data);
                              // populateListAndTree(arrData2)
                              // populateTable(data);
                            }else{
                              // $("#tableV").hide();
                              //console.log("data: ", response); //RAW JSON
                              for(var r=0; r<obJSON1.responses.length; ++r){
                                var id = obJSON1.responses[r].displayedName;//name;
                                var str = "response."+obJSON1.responses[r].parameter;
                                if(str.includes("[j]")){
                                  str = str.replace('j', '0');
                                }
                                dataObj[id]= eval(str);
                                //console.log(eval(str));
                              }
                              // console.log("arrData2: ", arrData2);
                              // populateListAndTree(response);
                              //console.log("create something else other than table!")
                            }
                          }
 
                    });
                });
                
            }//end of getTheNextPage function


          // }else{
          //   console.log("YES OAUTH");
          //   Authorize();

          //}

  });
    });

    setTimeout(function(){
        if(Object.keys(dataObj).length === 0 && dataObj.constructor === Object){
          console.log(data);
          res.json(data);
        }else{
          console.log(dataObj);
          res.json(dataObj);
        }
        
    }, 1000);  

  });
});


app.get("/apiClean/:name", (req, res, next) => {
  console.log("apiClean")
  dataObj = {};
  cors(req, res, () => {

    //if URL contains {id}, then get the value from the parameter id=374829365

    console.log("Query PARAM: ", req.query)
    defined = true;
    data=[], obj =[], allResults = [];
    apiParams = [];
    method="GET";
    apiParameters="";

    apiData='';
    data1 = '';
    apiTitle;

    paramInURL;

    if(isEmpty(req.query)){ //No parameters passed
        apiParameters= "";
    }else{ //Parameters passed
        apiParameters= req.query;
    }

    function isEmpty(obj) {
        for(var key in obj) {
            if(obj.hasOwnProperty(key))
                return false;
        }
        return true;
    }
    apiTitle = req.params.name.split('?')[0]

    //[1] Get the API's description from ScrAPIr
    var urlDesc = 'https://superapi-52bc2.firebaseio.com/apis/'+apiTitle+'.json';
    var optionsDesc = {
        method: "GET"
    };

    https.get(urlDesc, optionsDesc, res => {
        res.setEncoding("utf8");
        res.on("data", data1 => {
            apiData += data1;
        });
        res.on("end", () => {
            obJSON1 = JSON.parse(apiData);
            method = obJSON1.method;

            //[2] From description, get maxResPerPage
            if(req.query.scpNumResults){
                numRes = req.query.scpNumResults;
            }else{
                numRes = obJSON1.maxResPerPage;
            }

            if(numRes){
                pages = Math.ceil(numRes/obJSON1.maxResPerPage);
                totalRes = numRes;
                numResults = obJSON1.maxResPerPage;
                console.log("numResults: ",obJSON1.maxResPerPage)
            }else{
                page=1;
            }

            start = 0;
            next = "";
            nextPage = "";
            p = 1;

            getTheNextPage(p, pages, nextPage); 

            function getTheNextPage(p, pages, nextPage){
              
                //[3] From description, get request parameters OR from the parameters passed in the function
                if(apiParameters == ""){ //if no parameters were passed
                  listP=  "";
                  for(var i=0; i<obJSON1.parameters.length; ++i) {
                    if(obJSON1.parameters[i]['value']){
                      listP+= obJSON1.parameters[i]['name']; //check conditions before adding names
                      listP+= "="
                      listP+= obJSON1.parameters[i]['value'];
                    }
      
                    if(i+1<obJSON1.parameters.length){
                      if(obJSON1.parameters[i+1]['value']) {
                        listP+= "&";
                      }
                    }
                  }
                }else{ //if parameters were passed

                  listP=  "";
                  for(var i=0; i<obJSON1.parameters.length; ++i) {
                    var value = getKeyByValue(apiParameters, obJSON1.parameters[i]['name']); 
                    //console.log("VALUE: ", value);
                    if(value){
                      listP+= obJSON1.parameters[i]['name']; //check conditions before adding names
                      listP+= "="
                      listP+= value;
                    }else{
                    if(obJSON1.parameters[i]['value']){
                      listP+= obJSON1.parameters[i]['name']; //check conditions before adding names
                      listP+= "="
                      listP+= obJSON1.parameters[i]['value'];
                    }
                    }
      
                    if(i+1<obJSON1.parameters.length){
                      if(obJSON1.parameters[i+1]['value']) {
                        listP+= "&";
                      }
                    }
                  }

                    function getKeyByValue(object, key) { 
                      for (var prop in object) { 
                          if (object.hasOwnProperty(prop)) { 
                              if (prop === key) 
                              return object[prop]; 
                          } 
                      } 
                  } 
                }
      
                if(obJSON1.resPerPageParam){
                  listP+= "&"
                  listP+= obJSON1.resPerPageParam;
                  listP+= "=";
                  listP+= obJSON1.maxResPerPage;
                }
                if(obJSON1.indexPage){
                  listP+= "&"
                  listP+= obJSON1.indexPage;
                  listP+= "=";
                  listP+= p;
                }else if(obJSON1.offsetPage){
                  listP+= "&"
                  listP+= obJSON1.offsetPage;
                  listP+= "=";
                  listP+= (p-1)*(eval(obJSON1.maxResPerPage));
                }else if(obJSON1.currPageParam){
                  listP+= "&"
                  listP+= obJSON1.currPageParam;
                  listP+= "=";
                  listP+= nextPage;
                }
                listP+= "";
      
                console.log("listP: ",JSON.stringify(listP));

                if(obJSON1.method){
                  method = obJSON1.method;
                }else{
                  method = "GET"
                }
      
                var apiData1='', data2 = '';
                urlAPI = obJSON1.url+"?"+listP;

                console.log("URL1: ", urlAPI)
                if((!obJSON1.headers || obJSON1.headers[0].headerValue=="") && ((!obJSON1.oauth2) || obJSON1.oauth2[0].authURL=="") ){
                  console.log("no headrer/no oauth")
                    var optionsAPI= {
                        method: "GET"
                    };
                }else if((obJSON1.oauth2) && obJSON1.oauth2[0].authURL!=""){
                  console.log("OAUTH")
                  auth_url= obJSON1.oauth2[0].authURL;
                  token_url= obJSON1.oauth2[0].tokenURL;
                  redirect_url= obJSON1.oauth2[0].callbackURL;
                  client_id= obJSON1.oauth2[0].clientId;
                  client_secret= obJSON1.oauth2[0].clientSec;
                  response_type= obJSON1.oauth2[0].resType;
                  scope= obJSON1.oauth2[0].scope;
                  grant_type= obJSON1.oauth2[0].grantType;
                  client_auth= obJSON1.oauth2[0].clientAuth;

                  //console.log("redirect_url: ",redirect_url);

                  //[1] Popup window of auth url

                  open(auth_url+"?response_type="+JSON.parse(JSON.stringify(response_type))+"&scope="+JSON.parse(JSON.stringify(scope))+"&client_id="+JSON.parse(JSON.stringify(client_id))+"&redirect_uri="+JSON.parse(JSON.stringify(redirect_url)), function (err) {
                    if ( err ) throw err;    
                  });

                  oauth();
        
          
                }else{//if header
                  console.log("if header index.js")
                    var headerKey= obJSON1.headers[0].headerKey;
                    var headerVal= obJSON1.headers[0].headerValue;
                    var headers_to_set = {};
                    headers_to_set[headerKey] = headerVal;
                    
                    var optionsAPI= {
                        method: "GET",
                        headers: headers_to_set
                    };
                }
                
                https.get(urlAPI, optionsAPI, res => {//HERE
                    res.setEncoding("utf8");
                    res.on("data", data2 => {
                        apiData1 += data2;
                    });
                    res.on("end", () => {
                        response = JSON.parse(apiData1);
                        console.log("RES API INDEX.JS: ", response);

                    });
                });
                
            }//end of getTheNextPage function

        });
    });

    setTimeout(function(){
        // if(Object.keys(dataObj).length === 0 && dataObj.constructor === Object){
        //   res.json(data);
        // }else{
          console.log(dataObj);
          res.json(response);
        // }
        
    }, 1000);  

  });
});




app.get("/callAPI/:url", (req, res, next) => {
  var obJSON1='', apiData='', list="";
  //console.log(req.params.url)
  var url = req.params.url.split('?')[0];
  var params = req.params.url.split('?')[1];
  //console.log("url: ", url)
  //console.log("params: ", params)
  if(params){
    var par = JSON.parse(params);
    for(a in par){
      list+=a;
      list+="=";
      list+=par[a];
      list+="&"
    }
    list= list.slice(0, -1);
    console.log("List: ",list)
    var urlAPI = url+"?"+list;
  }else{
    var urlAPI = url;
  }

  console.log("urlAPI: ", urlAPI);

  if (req.secure) {
    https.get(urlAPI, res => {
      res.setEncoding("utf8");
      res.on("data", data1 => {
          apiData += data1;
      });
      res.on("end", () => {
          obJSON1 = JSON.parse(apiData);
          console.log("res.on: ", obJSON1)
      });
    });
  }else{
    http.get(urlAPI, res => {
      res.setEncoding("utf8");
      res.on("data", data1 => {
          apiData += data1;
      });
      res.on("end", () => {
          obJSON1 = JSON.parse(apiData);
          console.log("res.on: ", obJSON1)
      });
    });
  }

  setTimeout(function(){
    res.json(obJSON1);
  }, 1500); 

});



app.get("/amz", (req, res, next) => {
  var ProductAdvertisingAPIv1 = require('paapi5-nodejs-sdk');

  var defaultClient = ProductAdvertisingAPIv1.ApiClient.instance;
  
  // Specify your credentials here. These are used to create and sign the request.
  defaultClient.accessKey = 'AKIAIBYVZ5CVF7RAENNA';
  defaultClient.secretKey = 'ZLBUi/3q88HiP3b/Zc+4Dg9Y62x9gMWdvG4KYGNG';
  
  /**
   * Specify Host and Region to which you want to send the request to.
   * For more details refer:
   * https://webservices.amazon.com/paapi5/documentation/common-request-parameters.html#host-and-region
   */
  defaultClient.host = 'webservices.amazon.com';
  defaultClient.region = 'us-east-1';
  
  var api = new ProductAdvertisingAPIv1.DefaultApi();
  
  /**
   * The following is a sample request for SearchItems operation.
   * For more information on Product Advertising API 5.0 Operations,
   * refer: https://webservices.amazon.com/paapi5/documentation/operations.html
   */
  var searchItemsRequest = new ProductAdvertisingAPIv1.SearchItemsRequest();
  
  /** Enter your partner tag (store/tracking id) and partner type */
  searchItemsRequest['PartnerTag'] = 'scrapir-20';
  searchItemsRequest['PartnerType'] = 'Associates';
  
  // Specify search keywords
  searchItemsRequest['Keywords'] = 'Harry Potter';
  
  /**
   * Specify the category in which search request is to be made.
   * For more details, refer:
   * https://webservices.amazon.com/paapi5/documentation/use-cases/organization-of-items-on-amazon/search-index.html
   */
  searchItemsRequest['SearchIndex'] = 'All';
  
  // Specify the number of items to be returned in search result
  searchItemsRequest['ItemCount'] = 1;
  
  /**
   * Choose resources you want from SearchItemsResource enum
   * For more details, refer: https://webservices.amazon.com/paapi5/documentation/search-items.html#resources-parameter
   */
  searchItemsRequest['Resources'] = ['Images.Primary.Medium', 'ItemInfo.Title', 'Offers.Listings.Price'];
  
  
  var callback = function (error, data, response) {
    if (error) {
      console.log('Error calling PA-API 5.0!');
      console.log('Printing Full Error Object:\n' + JSON.stringify(error, null, 1));
      console.log('Status Code: ' + error['status']);
      if (error['response'] !== undefined && error['response']['text'] !== undefined) {
        console.log('Error Object: ' + JSON.stringify(error['response']['text'], null, 1));
      }
    } else {
      console.log('API called successfully.');
      var searchItemsResponse = ProductAdvertisingAPIv1.SearchItemsResponse.constructFromObject(data);
      console.log('Complete Response: \n' + JSON.stringify(searchItemsResponse, null, 1));
      if (searchItemsResponse['SearchResult'] !== undefined) {
        console.log('Printing First Item Information in SearchResult:');
        var item_0 = searchItemsResponse['SearchResult']['Items'][0];
        if (item_0 !== undefined) {
          if (item_0['ASIN'] !== undefined) {
            console.log('ASIN: ' + item_0['ASIN']);
          }
          if (item_0['DetailPageURL'] !== undefined) {
            console.log('DetailPageURL: ' + item_0['DetailPageURL']);
          }
          if (item_0['ItemInfo'] !== undefined && item_0['ItemInfo']['Title'] !== undefined && item_0['ItemInfo']['Title']['DisplayValue'] !== undefined) {
            console.log('Title: ' + item_0['ItemInfo']['Title']['DisplayValue']);
          }
          if (item_0['Offers'] !== undefined && item_0['Offers']['Listings'] !== undefined && item_0['Offers']['Listings'][0]['Price'] !== undefined && item_0['Offers']['Listings'][0]['Price']['DisplayAmount'] !== undefined) {
            console.log('Buying Price: ' + item_0['Offers']['Listings'][0]['Price']['DisplayAmount']);
          }
        }
      }
      if (searchItemsResponse['Errors'] !== undefined) {
        console.log('Errors:');
        console.log('Complete Error Response: ' + JSON.stringify(searchItemsResponse['Errors'], null, 1));
        console.log('Printing 1st Error:');
        var error_0 = searchItemsResponse['Errors'][0];
        console.log('Error Code: ' + error_0['Code']);
        console.log('Error Message: ' + error_0['Message']);
      }
    }
  };
  
  try {
    api.searchItems(searchItemsRequest, callback);
  } catch (ex) {
    console.log('Exception: ' + ex);
  }


});



exports.app = functions.https.onRequest(app);
