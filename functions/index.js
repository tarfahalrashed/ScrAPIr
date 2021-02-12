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


var ParallelRequest = require('parallel-http-request');
var config = {
    response: "simple"    // [optional] detail|simple|unirest, if empty then the response output is simple
};
 
var request = new ParallelRequest(config);
 
//or without config
var request = new ParallelRequest();


// Automatically allow cross-origin requests

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





var apiDesc="";

app.get('/testAPI2', (req, res) => {

var apis = [
  {
    "title": "YouTube API",
    "order": 1,
    "parentAPI": {
    "apiName":"",
    "apiPk":""
    }
  },
  {
    "title": "YouTube Video",
    "order": 2,
    "parentAPI": {
      "apiName":"YouTube API",
      "apiPk":"videoId",
      "atOnce": true
    }
  },
  {
    "title": "YouTube Comment",
    "order": 3,
    "parentAPI": {
      "apiName":"YouTube API",
      "apiPk":"videoId",
      "atOnce": true
    }
  },
]

console.log("apis ARRAY: ", apis)

// res.json();

var order1="", firstAPIResponse, ids="", key;

for(var i=0; i<apis.length; ++i){
  if(apis[i].order==1){
    order1=apis[i].title;//name of the API that will be the parent
    request.add({url:'https://scrapir.org/api/YouTube API?Number of Results=2',method:'get'})
    // .add({url:'https://scrapir.org/api/YouTube Video',method:'get'})
    // .add({url:'https://scrapir.org/api/YouTube Comment',method:'get'})
    .send(function(response){
        // console.log("ORDER# 1: ",response[0].body);
        //apis_names_urls.push(response)
        // res.json(response.body);
        firstAPIResponse = response[0].body;
        // console.log("firstAPIResponse: ",firstAPIResponse)

        childrenAPIs=[]

        for(var i=0; i<apis.length; ++i){
          if(apis[i].parentAPI.apiName == order1){
            childrenAPIs.push(
              {
                name: apis[i].title,
                fkey: apis[i].parentAPI.apiPk
              });
          }
        }

        // console.log("childrenAPIs: ",childrenAPIs)

        for(var i=0; i<firstAPIResponse.length; ++i){
          key = childrenAPIs[0].fkey
          // console.log("videoID: ", firstAPIResponse[i][key])
          // ids = ids.concat(firstAPIResponse[i][key]);
          getComments(firstAPIResponse[i][key])

          // if(i+1<firstAPIResponse.length){
            // ids = ids.concat(',');
          // }
          // console.log("description: ", firstAPIResponse[i]['description'])

        }

        console.log("IDs: ", ids);

    }); //end of .send(function(response)

    var apis_names_urls=[];

    setTimeout(function(){
        res.json(apiDesc);
    }, 8000);  

    // setTimeout(function(){
    //   console.log(apis_names_urls)
    //     res.json(apis_names_urls);
    // }, 500);  


    // var apis_names_urls=[];
    // request.add({url:'https://scrapir.org/api/YouTube Comment?'+key+'='+ids,method:'get'})
    //   // .add({url:'https://scrapir.org/api/YouTube Comment?'+key+'='+firstAPIResponse[i][childrenAPIs[0].fkey],method:'get'})
    //   .send(function(response1){
    //       // console.log("DANGLLLLL: ",response1);
    //       console.log("DANGLLLLLX: ",response1[0].body);
    //       // apis_names_urls.push(response)
    //       // console.log("full description: ", response1['description'])
    //        res.json(response1);
    //   });

  }

}


// var apis_names_urls=[];
//   request.add({url:'https://scrapir.org/api/YouTube API',method:'get'})
//     .add({url:'https://scrapir.org/api/YouTube Video',method:'get'})
//     .add({url:'https://scrapir.org/api/YouTube Comment',method:'get'})
//     .send(function(response){
//         console.log("DANGLLLLL: ",response[0].body);
//         // apis_names_urls.push(response)
//         res.json(response.body);
//     });

// res.json()

});


function getComments(id){
  https.get('https://scrapir.org/api/YouTube Comment?Video ID='+id, res => {
            res.setEncoding("utf8");
            res.on("data", data => {
                apiDesc += data;
            });
            res.on("end", () => {
                apiDesc = JSON.parse(apiDesc);
                // console.log("apiDesc: ", apiDesc)
            });
          });
}



app.get('/testAPI', (req, res) => {

  var apis_names_urls=[];
  request.add({url:'https://scrapir.org/api/YouTube API',method:'get'})
    .add({url:'https://scrapir.org/api/YouTube Video',method:'get'})
    .add({url:'https://scrapir.org/api/YouTube Comment',method:'get'})
    .send(function(response){
        console.log("DANGLLLLL: ",response[0].body);
        // apis_names_urls.push(response)
        res.json(response.body);
    });

  //   setTimeout(function(){
  //     res.json(apis_names_urls);
  // }, 4000);  
  
});







///////////////////////////////////////////

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
                          objData[id] = eval("response."+obJSON1.responses[m].parameter);
                        //  objData[id] = "https://www.youtube.com/embed/"+eval("response."+obJSON1.responses[m].parameter);
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




app.get("/multi", (req, res, next) => {
  
  // console.log("sites: ",req.query.sites)
  var sites=req.query.sites;
  var splitSites= sites.split(',');
  var apiSites=[];

  var params=req.query.params;
  console.log("PARAM: ", params) //keywords:cats

  for(var i=0; i<splitSites.length; ++i){
    apiSites.push('https://scrapir.org/class/'+req.query.type+'?sites='+splitSites[i]+'&params='+params)
  }
  
  var urls = apiSites;

  fetchData = () => {
    const allRequests = urls.map(url => 
      fetch(url).then(response => response.json())
    );
    
    return Promise.all(allRequests);
  };

  fetchData().then(arrayOfResponses => 
    res.json([].concat.apply([], arrayOfResponses))
  );

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

  joinedResponse = [['title'], ['title']]; //union on these response fields

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
  }, 15000); 

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
        console.log("URLX: ", url);
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

app.get("/openApi/:name", (req, res, next) => {
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
                // console.log("passed!1");
                 if(obJSON1.parameters){
                  listP=  "";
                  parsLength = obJSON1.parameters.length;
                  for(var i=0; i<parsLength; ++i) {
                    // console.log("passed!2");
                    var value = getKeyByValue(apiParameters, obJSON1.parameters[i]['name']); 
                    console.log("value: ", value)
                    //if(value || (obJSON1.parameters[i]['value'])){
                      console.log("parsLength: ", parsLength)
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
                  console.log("no headrer/no oauth1")
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
                          console.log("FIRST if1")
                            for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){
                               objData={};
                               //objData["id"]= start;
                                  for(var m=0; m < obJSON1.responses.length; ++m){
                                    var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                                    if(eval(s)){
                                     var id = obJSON1.responses[m].displayedName;//name;//this.value;
                                     if(obJSON1.responses[m].displayedName=="videoId"){
                                      //  objData[id] = "https://www.youtube.com/embed/"+eval("response."+obJSON1.responses[m].parameter);
                                       objData[id] =eval("response."+obJSON1.responses[m].parameter);
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
                                     objData[id] = eval("response."+obJSON1.responses[m].parameter);
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


//new
app.get("/api/:name", (req, res, next) => {
  // console.log("req.query: ", req.query);

  tok = req.query.tokenAPI;
  console.log("req.query.tokenAPI: ", req.query.tokenAPI);

  dataObj = {};
  cors(req, res, () => {

    //if URL contains {id}, then get the value from the parameter id=374829365
    // console.log("Number of Results: ", req.query['Number of Results'])
    // console.log("API Key: ", req.query['API Key'])

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
            if(req.query['Number of Results']){
                numRes = req.query['Number of Results'];
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
                var keyParam = "", headerParam="";

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
                // console.log("passed!1");

                //API Key
                var keyParam = "", headerParam="";
                if(req.query['API Key']){
                  if(obJSON1.auth){
                    if(obJSON1.auth.in == "query"){
                      keyParam = obJSON1.auth.keyName;
                    }else{//in headers
                      headerParam = obJSON1.auth.keyName;
                    }
                  }
                }

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
                      }else if(keyParam!="" && keyParam==obJSON1.parameters[i]['name']){ //API Key
                        value = req.query['API Key']; 
                        parsLength= parsLength-1;
                        listP+= obJSON1.parameters[i]['name']; 
                        listP+= "="
                        listP+= value;
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
                      if(obJSON1.parameters[i+1]['value'] && !(link.includes('{'))) {
                        //here now
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
                  console.log("no headrer/no oauth2")
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
                    if(headerParam!=""){
                      console.log("headerParam!=")
                      var headerVal= req.query['API Key'];
                    }else{
                      console.log("headerParam==")
                      var headerVal= obJSON1.headers[0].headerValue;
                    }

                    console.log("headerParam: ", headerVal)

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
                        // console.log("RES API: ", response);
                     if(obJSON1.responses){
                        ///start HERE
                        if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
                          console.log("FIRST if2")
                            for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){
                               objData={};
                               //objData["id"]= start;
                                  for(var m=0; m < obJSON1.responses.length; ++m){
                                    if(obJSON1.responses[m].parameter.includes('[j]')){
                                    var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                                    if(eval(s)){
                                     var id = obJSON1.responses[m].displayedName;//name;//this.value;
                                     if(obJSON1.responses[m].displayedName=="videoId"){
                                      //  objData[id] = "https://www.youtube.com/embed/"+eval("response."+obJSON1.responses[m].parameter);
                                       objData[id] = eval("response."+obJSON1.responses[m].parameter);
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
                                }else{
                                  var s = "response[j]."+obJSON1.responses[m].parameter;
                                  var arrLength = "response"//+obJSON1.responses[m].parameter;
                                  var ln = s//.split('[')[0];
                                  // console.log("arrLength: ", arrLength)
                                  if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){
                                  var id = obJSON1.responses[m].displayedName;//name;
                                  if(obJSON1.responses[m].displayedName=="videoId"){
                                  //if(obJSON1.responses[m].name=="Video URL"){
                                    objData[id] = eval("response[j]."+obJSON1.responses[m].parameter);
                                  }else{
                                    var str = "response[j]."+obJSON1.responses[m].parameter;
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
                                    }else if(eval("response[j]."+obJSON1.responses[m].parameter) instanceof Object && !(eval("response[j]."+obJSON1.responses[m].parameter) instanceof Array)){
                                      var objD = eval("response[j]."+obJSON1.responses[m].parameter);
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
                                      objData[id] = eval("response[j]."+obJSON1.responses[m].parameter);
                                    }
                                  } //if Video URL
                                }//if not undefined
                              else{
                                defined=false;
                              }
                                }
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
                             console.log(obJSON1.responses)
                             
                             
                            for(var m=0; m < obJSON1.responses.length; ++m){
                              // console.log("CHECKKKKK: ", obJSON1.responses[m])
                              if(obJSON1.responses[m].parameter.includes('[j]')){
                                   var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                                   var arrLength = "response."+obJSON1.responses[m].parameter.split('[j]')[0];
                                   var ln = s.split('[')[0];
                                // console.log("arrLength: ", arrLength)
                                   if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){
                                   var id = obJSON1.responses[m].displayedName;//name;
                                   if(obJSON1.responses[m].displayedName=="videoId"){
                                   //if(obJSON1.responses[m].name=="Video URL"){
                                     objData[id] = eval("response."+obJSON1.responses[m].parameter);
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
                              }else{//NORMAL ARRAY
                                var s = "response[j]."+obJSON1.responses[m].parameter;
                                var arrLength = "response"//+obJSON1.responses[m].parameter;
                                var ln = s//.split('[')[0];
                                //console.log("arrLength: ", arrLength)
                                if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){
                                  // console.log(eval(arrLength))
                                var id = obJSON1.responses[m].displayedName;//name;
                                if(obJSON1.responses[m].displayedName=="videoId"){
                                //if(obJSON1.responses[m].name=="Video URL"){
                                  objData[id] = eval("response[j]."+obJSON1.responses[m].parameter);
                                }else{
                                  
                                  var str = "response[j]."+obJSON1.responses[m].parameter;
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
                                  }else if(eval("response[j]."+obJSON1.responses[m].parameter) instanceof Object && !(eval("response[j]."+obJSON1.responses[m].parameter) instanceof Array)){
                                    var objD = eval("response[j]."+obJSON1.responses[m].parameter);
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
                                    //console.log("enter here?")
                                    objData[id] = str//eval("response[j]."+obJSON1.responses[m].parameter);
                                  }
                                } //if Video URL
                              }//if not undefined
                            else{
                              defined=false;
                            }
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
                        }else{
                          console.log("done")
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
        
    }, 2000);  

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
                // console.log("passed!1");
                 if(obJSON1.parameters){
                  listP=  "";
                  parsLength = obJSON1.parameters.length;
                  for(var i=0; i<parsLength; ++i) {
                    // console.log("passed!2");
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
                  console.log("no headrer/no oauth3")
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
                          console.log("FIRST if3")
                            for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){
                               objData={};
                               //objData["id"]= start;
                                  for(var m=0; m < obJSON1.responses.length; ++m){
                                    var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                                    if(eval(s)){
                                     var id = obJSON1.responses[m].displayedName;//name;//this.value;
                                     if(obJSON1.responses[m].displayedName=="videoId"){
                                       objData[id] = eval("response."+obJSON1.responses[m].parameter);
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
                                     objData[id] = eval("response."+obJSON1.responses[m].parameter);
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
                  console.log("no headrer/no oauth4")
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





// Initialize Firebase
var config = {
  apiKey: "AIzaSyBaJakjjAHw0wvBtELAtDLPmhq1piGWwqQ",
  authDomain: "superapi-52bc2.firebaseapp.com",
  databaseURL: "https://superapi-52bc2.firebaseio.com",
  projectId: "superapi-52bc2",
  storageBucket: "superapi-52bc2.appspot.com",
  messagingSenderId: "859121565515"
};


app.get("/schemaToFirebase", (req, res, next) => {

  firebase.initializeApp(config);

  let directory_name = "schema.org"; 
  let filenames = fs.readdirSync(directory_name); 

  filenames.forEach((file) => { 
    // console.log("File:", file);
    fileName = file.split('.json')[0]
    const rawdata = fs.readFileSync('schema.org/'+file);
    str = JSON.stringify(JSON.parse(rawdata));
    str1=str.split("$ref").join("ref");
    console.log(str1)
    const obj = JSON.parse(str1);

    //save it to firebase db
    firebase.database().ref('schema/'+fileName).set(obj) 
  }); 

});






var obj="", allApis=[], apiDesc='', curretnApiEnd="", apiDesc1="";


app.get("/class/:name", (req, res, next) => {

  console.log("req.query: ", req.query.sites);
  var site = req.query.sites;
  // console.log("SITE: ", site)
  sites=[];
  sites = site.split(',');

  var params=req.query.params;//keywords:cats
  params = params.split(':').join('=');
  params = params.split(',').join('&');

  console.log("PARAM API: ", params)


    var url = 'https://superapi-52bc2.firebaseio.com/functions/'+site+'/'+req.params.name+'.json';

  //   getAPIS(url);

    //[1] Get the site object!
    https.get(url, res => {
      res.setEncoding("utf8");
      res.on("data", data => {
          apiDesc1 += data;
      });
      res.on("end", () => {
          apiDesc1 = JSON.parse(apiDesc1);
          curretnApiEnd =apiDesc1;
          console.log("apiDesc1: ",curretnApiEnd)
      
  defined = true;
    // data=[]
    obj =[], allResults = [];
    apiParams = [];
    method="GET";
    apiParameters="";

    apiData='';
    data1 = '';
    apiTitle;

    paramInURL;

  var apiDesc='';

  tok = req.query.tokenAPI;

  dataObj = {};
  //cors(req, res, () => {

    //if URL contains {id}, then get the value from the parameter id=374829365
    // console.log("Number of Results: ", req.query['Number of Results'])
    // console.log("API Key: ", req.query['API Key'])

    // if(isEmpty(req.query)){ //No parameters passed
        apiParameters= "";
    // }else{ //Parameters passed
    //     apiParameters= req.query;
    // }

    // function isEmpty(obj) {
    //     for(var key in obj) {
    //         if(obj.hasOwnProperty(key))
    //             return false;
    //     }
    //     return true;
    // }
    apiTitle = curretnApiEnd.apiEndpoint;//apiDesc.apiEndpoint//req.params.name.split('?')[0]
    var pars = curretnApiEnd.parameters;//apiDesc.apiEndpoint//req.params.name.split('?')[0]

    console.log("apiTitle!: ", apiTitle)

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
            if(req.query['Number of Results']){
                numRes = req.query['Number of Results'];
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
                var keyParam = "", headerParam="";

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
                        listP+= getParamValue(params, pars, obJSON1.parameters[i]['name'], obJSON1.parameters[i]['value']);
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
                // console.log("passed!1");

                //API Key
                var keyParam = "", headerParam="";
                if(req.query['API Key']){
                  if(obJSON1.auth){
                    if(obJSON1.auth.in == "query"){
                      keyParam = obJSON1.auth.keyName;
                    }else{//in headers
                      headerParam = obJSON1.auth.keyName;
                    }
                  }
                }

                 if(obJSON1.parameters){
                  listP=  "";
                  parsLength = obJSON1.parameters.length;
                  for(var i=0; i<parsLength; ++i) {
                    // console.log("passed!2");
                    var value = getKeyByValue(apiParameters, obJSON1.parameters[i]['displayedName']); 
                    // console.log("value: ", value)
                    //if(value || (obJSON1.parameters[i]['value'])){
                      if(link.includes('{'+obJSON1.parameters[i]['displayedName']+'}')){
                        parsLength= parsLength-1;
                        link=link.replace('{'+obJSON1.parameters[i]['displayedName']+'}', value);
                      }else if(keyParam!="" && keyParam==obJSON1.parameters[i]['name']){ //API Key
                        value = req.query['API Key']; 
                        parsLength= parsLength-1;
                        listP+= obJSON1.parameters[i]['name']; 
                        listP+= "="
                        listP+= value;
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
                  console.log("no headrer/no oauth2")
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
                    if(headerParam!=""){
                      console.log("headerParam!=")
                      var headerVal= req.query['API Key'];
                    }else{
                      console.log("headerParam==")
                      var headerVal= obJSON1.headers[0].headerValue;
                    }

                    console.log("headerParam: ", headerVal)

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
                        // console.log("RES API: ", response);
                        // console.log("Fields!: ", req.query.fields)

                        ///start HERE
                        if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
                          // console.log("FIRST if2")
                            for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){
                            
                               objData={};
                               //objData["id"]= start;
                                  for(var m=0; m < obJSON1.responses.length; ++m){
                                    var fields = curretnApiEnd.fields
                                    var id = getValue(fields, obJSON1.responses[m].displayedName);
                                    if (exists) { 
                                    //if field exists in schema                                    
                                    var s = "response."+obJSON1.responses[m].parameter.split('.')[0];
                                    if(eval(s)){
                                     // var id = obJSON1.responses[m].displayedName;
                                     //  console.log("ID: ", id)
                                     if(obJSON1.responses[m].displayedName=="videoId"){
                                      //  objData[id] = "https://www.youtube.com/embed/"+eval("response."+obJSON1.responses[m].parameter);
                                       objData[id] = eval("response."+obJSON1.responses[m].parameter);
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
                              }//if
                             }//for loop response fields
                                // console.log("objData: ", objData);
                                 if(defined){
                                  
                                   data.push(objData);
                                   obj.lists=[];
                                   obj.lists.push(objData);
                                }
                             
                            }//for loop results
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
                                     objData[id] = eval("response."+obJSON1.responses[m].parameter);
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
                              console.log("XXX: ", response); //RAW JSON
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

  //});//cors

// }, 1000); 
  // }
  });
});


   // }, 3000); 

  //}//for loop for sites

  setTimeout(function(){
    if(Object.keys(dataObj).length === 0 && dataObj.constructor === Object){
      // console.log("AAAA: ", data);
      // console.log("AAAA");
      res.json(data);
    }else{
      // console.log("BBBB");
      res.json(dataObj);
    }
    
  }, 6000);  

});







var exists=false;

function getValue(fields, displayedName){
  exists=false;
  var id="";
  for(var x=0; x<fields.length; ++x){
    // console.log("FIELDS X: ",fields[x].field)
    if(displayedName == fields[x].field){
      exists = true;
      id = fields[x].property;
    }
  }

  if(!exists){
    id = displayedName;
  }

  // console.log("ID: ", id)
  return id;
}

// getParamValue(params, obJSON1.parameters[i]['name'], obJSON1.parameters[i]['value']);

function getParamValue(params, pars, name, defaultValue){
  exists=false;
  var value="";
  var allParams = params.split('&');
  //allParams is the parameters sent to /class
  for(var x=0; x<allParams.length; ++x){
    var p = allParams[x].split('=')[0];
    var v = allParams[x].split('=')[1];

    //pars is the parameters under the /functions schema
    for(var i=0; i<pars.length; ++i){
      if(p==pars[i].input){
        if(pars[i].param == name){
          exists = true;
          value = v;
          // console.log("PAR: ", p)
          // console.log("VALUE: ", value)
        }
      }
    }
  }

  if(!exists){
    value = defaultValue;
  }

  return value;
}




//get videos with their comments (delay http calls)
app.get("/testX", (req, res, next) => {

  let videos;
  const delay = (ms = 1000) => new Promise((r) => setTimeout(r, ms));
  const getTodosSeries = async function (objArray) {
    let items = objArray.map(({ videoId }) => videoId)

    let results = [];
    for (let index = 0; index < items.length; index++) {
      await delay();
      const res = await axios.get(
        `http://localhost:5000/api/YouTube Video?Video ID=${items[index]}`
      );
      // results.push(res.data);
      obj = res.data
      videos[index].description= obj['description']
      results.push(videos[index])
      // console.log(obj['description']);
      //add descreption to the object where the videoId is the same
    }
    return results;
  };

  async function main() {

    let rawdata = fs.readFileSync('data.json');// imagine we've already retreived a list of youtube videos (e.g. YouTube API)
    videos = JSON.parse(rawdata);
    // console.log(videos);
    // const strings = ['BPobdbmzY9o', '1jO2wSpAoxA'];
    const results = await getTodosSeries(videos);//strings
    // console.log(results);
    // console.log(videos);
    res.json(results)
  }
  main();




//   const sleep = (milliseconds) => {
//     return new Promise(resolve => setTimeout(resolve, milliseconds))
//   }

// // const list = [1, 2,3,4]
// var list = ['BPobdbmzY9o', '1jO2wSpAoxA'];

// const doSomething = async () => {
//   for (const item of list) {
//     await sleep(1000)
//     return fetch('http://localhost:5000/api/YouTube Comment?Video ID='+item).then(response => response.json());
//     // return new Promise(function(resolve, reject) {resolve(fetch('http://localhost:5000/api/YouTube Comment?Video ID='+item).then(response => response.json())) });
//     // return     
//   }
// }

// console.log(doSomething())
// res.json()

});


const scrapir = require('./scrapir');
getAge = function () {  return 'getName'; };

let scrObjects = function() {  return new Promise(function(resolve, reject) {resolve(fetch('https://superapi-52bc2.firebaseio.com/abstractions.json').then(response => response.json())) }) }

// https://scrapir.org/multi?type=VideoObject&sites=youtube&params=keywords:cats


app.get("/Y", (req, res, next) => {
  var x= scrObjects()

  setTimeout(function(){
      
    console.log("Data: ",x.VideoObject);
  }, 4000);  

});

var callerId = require('caller-id');



app.get("/XXX", (req, res, next) => {

  var repsonse, type, method, schemaTypes, methods=[];
  
  https.get('https://superapi-52bc2.firebaseio.com/schema.json', res => {
    res.setEncoding("utf8");
    res.on("data", data => {
        schemaTypes += data;
    });
    res.on("end", () => {
     // var response = JSON.parse(schemaTypes);
      // // console.log("response: ", response)

      // methods=[]
      // var response = JSON.parse(schemaTypes);
      // // console.log("response: ", response)
      // Object.entries(response).forEach(([type, val]) => {
      //     // type = key
      //   global[type] = {} //initilize 
      //   // console.log(key); // the name of the current key.
      //   if(val.properties){
      //     methods=Object.keys(val.properties) //NEED to be changed to methods
      //     // console.log(methods)
      //     for(var i=0; i<methods.length; ++i){
      //       method = methods[i]
      //       // console.log(type) //VideoObject
      //       // console.log(method) //getVideos
      //       global[type][method] = function(...args) {return callAPI(...args)}
      //       // global[type][method] = function(...args) {return callAPI2(method, ...args)}
      //     }
      //     // console.log(val.properties); // the value of the current key.
      //   }else{
      //     // console.log("NONE");
      //   }
      
      //     callAPI2 = function (p) { 
      //       //p = the parameters we're sending from VideoObject.caption("babies")
      //       var caller = callerId.getData().methodName;
      //       return caller 
      //     };

      //     callAPI = function (sites) {  
      //     var methodName = callerId.getData().methodName;
      //     // return fetch('https://scrapir.org/multi?type=VideoObject&sites=dailymotion').then(res => res.json());
      //     return new Promise(function(resolve, reject) {resolve(fetch('https://scrapir.org/multi?type=VideoObject&sites=dailymotion').then(response => response.json())) }) ;

      //     };
      //  // }//response old loop
      //  }); //response new loop
      });
    });

    setTimeout(function(){
      var result = VideoObject("xQOO2xGQ1Pc")
      console.log('Woo done!', result)
    }, 1000);  
  
  //**************************************************************** */

  // let videoObject = new VideoObject();
  // func();
  
  //call it, to test it

  // var VideoObject = {
  //   getVideos: function(sites, params) {return  VideoObject.getVideos.name},//[{"name":"Sarah", "age": 15}, {"name":"Tarfah", "age": 15}]
  //   at_21: function() { },
  //   at_99: function() { }
  // };
  // console.log("VAL: ", VideoObject.getVideos())
  // res.json(VideoObject.getVideos());
  // res.json(VideoObject.getVideos(['youtube', 'dailymotion'], ['funny cats']));
});

// var w2v = require('word2vec');
// const {spawn} = require('child_process');
const {PythonShell} =require('python-shell'); 


app.get("/synonyms/:name", (req, res, next) => {

  console.log(req.params.name)
  //Here are the option object in which arguments can be passed for the python_test.js. 
  let options = { 
    mode: 'text', 
    pythonOptions: ['-u'], // get print results in real-time 
      scriptPath: '', //If you are having python_test.py script in same folder, then it's optional. 
    args: [req.params.name] //An argument which can be accessed in the script using sys.argv[1] 
  }; 

  PythonShell.run('treasures.py', options, function (err, result){ 
      if (err) throw err; 
      res.send(result.toString()) 
  }); 


// //   var largeDataSet = [];
// //  // spawn new child process to call the python script
// //  const python = spawn('python', ['script1.py']);
// //  // collect data from script
// //  python.stdout.on('data', function (data) {
// //   console.log('Pipe data from python script ...');
// //   largeDataSet.push(data);
// //  });
// //  // in close event we are sure that stream is from child process is closed
// //  python.on('close', (code) => {
// //  console.log(`child process close all stdio with code ${code}`);
// //  // send data to browser
// //  res.send(largeDataSet.join(""))
// //  });

//   // var _ = require("lodash");
//   // var utils = {};
//   // utils.GOOGLE_BIN = "./freebase-vectors-skipgram1000.bin"

//   // utils.sortObject = function (model) {
//   //   return _.chain(model)
//   //   .map((val, key) => {
//   //     return { name: key, count: val }
//   //   })
//   //   .sortBy('count')
//   //   .reverse()
//   //   .keyBy('name')
//   //   .mapValues('count')
//   //   .value();
//   // }


//   // binary = fs.createReadStream('./freebase-vectors-skipgram1000.bin');
//   // process.stdout.write(binary.slice(0, 48));

//   // console.time("read");
// // w2v.load(utils.GOOGLE_BIN);

//   w2v.loadModel('./glove.6B.50d.txt', function( error, model ) {
//     console.log(model);
//     console.log("W2V: ", model.similarity( 'name', 'title' ));
//       res.json()
//   });
//   // console.timeEnd("read");


// });


// app.get("/wv2", (req, res, next) => {

//   var MusicPlaylist = MusicPlaylist|| {}; 

//   MusicPlaylist = function (playlistId, name) { 
//     this.playlistId = playlistId; 
//     this.name = name; 
//     // this.videos = this.getVideos();
//     this.videos = function(){return this.playlistId;}; //send a playlistId to VideoObject and return a collection of VideoObject (return videos and then map it to the VideoObject properties)
//   } 

//   var playlist = new MusicPlaylist("46", "Tarfah"); 

//   //res.send(playlist) //return playlist object {"playlistId":"46","name":"Tarfah"}
//   // how to construct playlist automatically? when we search, a construct will automatically be created var playlist = new MusicPlaylist("46", "Tarfah"); these values are turned from the search 
//   res.send(playlist.videos())

});




// const woo = require("./woo.js");

// app.get("/wooo", (req, res, next) => {

//   // var user = woo.etsy.Person("54550541")
//   //console.log("etsy user: ", user)
//   res.send(woo.combine([1,2], [3,4,5]))

// });



exports.app = functions.https.onRequest(app);


