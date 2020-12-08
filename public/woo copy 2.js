
var config = {
    apiKey: "AIzaSyBaJakjjAHw0wvBtELAtDLPmhq1piGWwqQ",
    authDomain: "superapi-52bc2.firebaseapp.com",
    databaseURL: "https://superapi-52bc2.firebaseio.com",
    projectId: "superapi-52bc2",
    storageBucket: "superapi-52bc2.appspot.com",
    messagingSenderId: "859121565515"
};
  

var promiseResolve, promiseReject, result, xx;

// function test(){
$(document).ready(function (e) {
    var properties = []
    var methods = []

    firebase.initializeApp(config);

    //TODO - for each site, fetch the classess youtube.VideoObject(...args) OR VideoObject("youtube", ...args)
    firebase.database().ref('/abstractions/youtube').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) { 
            // var host = childSnapshot.val().host;
            // var basePath = childSnapshot.val().basePath;
            // var url = host.concat(basePath)
            // var objects = childSnapshot.val().objects
            // console.log("url: ", url);
            // console.log("objects: ", objects);
            // for(t in objects){
            //     console.log("objects[t]: ", objects[t])
            // }
                       
            var type = childSnapshot.key;
            var val  = childSnapshot.val();

            window[type] = {} //initilize function
            window[type] = function(...args) {return self(val, "self", ...args)  };  
              
            function self (typeOb, caller, ...args) { 
                var endpoint = typeOb.construct[caller].endpoint;
                var params = typeOb.construct[caller].input;
                var properties = typeOb.properties;
                var fields=[], paramList="";

                if(params){
                    for(var p=0; p<params.length; ++p){
                        Object.entries(params[p]).forEach(([key, value]) => {
                            paramList+=`${key}`
                            paramList+="="
                            paramList+=args[p]
                        });
                        if(p+1<params.length){
                            paramList+="&" 
                        }
                    }
                }

                for(f in properties){
                    if(properties[f].field != undefined){
                        fields.push(properties[f].property)
                    }
                }

                // var obj={};
                // return new Promise(function(resolve, reject) {resolve(fetch('https://scrapir.org/api/'+endpoint+'?'+paramList+'&Number of Results=2').then(response => response.json())) }).then(o => {                         
                return firebase.database().ref('/apis/'+endpoint).once('value').then(function(snapshot) {
                    obJSON = snapshot.val();

                    if(obJSON.oauth2){
                        console.log("oauth2")
                        return new Promise((resolve, reject) => {
                        console.log("auth function");
                            auth_url= obJSON.oauth2[0].authURL;
                            token_url= obJSON.oauth2[0].tokenURL;
                            redirect_url= obJSON.oauth2[0].callbackURL;
                            client_id= obJSON.oauth2[0].clientId;
                            client_secret= obJSON.oauth2[0].clientSec;
                            response_type= obJSON.oauth2[0].resType;
                            scope= obJSON.oauth2[0].scope;
                            grant_type= obJSON.oauth2[0].grantType;
                            client_auth= obJSON.oauth2[0].clientAuth;
                                
                            var win = window.open(auth_url+"?response_type="+JSON.parse(JSON.stringify(response_type))+"&scope="+JSON.parse(JSON.stringify(scope))+"&client_id="+JSON.parse(JSON.stringify(client_id))+"&redirect_uri="+JSON.parse(JSON.stringify(redirect_url))+"", "windowname1", 'width=800, height=600');
                            //while(acToken === undefined){
                            var pollTimer = window.setInterval(function() {
                                try {
                                    console.log("url here: ", win.document.URL); //here url
                                    if (win.document.URL.indexOf(redirect_url) != -1) {
                                        window.clearInterval(pollTimer);
                                        var url =   win.document.URL;
                                        acToken =   gup(url, 'code');
                                        resolve(acToken)
                                        // tokenType = gup(url, 'token_type');
                                        // expiresIn = gup(url, 'expires_in');
                                        win.close();
                                        // return validateToken(acToken)
                                    }
                                } catch(e) {
                                    console.log("error in oauth")
                                }
                            }, 200);

                            function gup(url, name) {
                                name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
                                var regexS = "[\?&]"+name+"=([^&#]*)";
                                var regex = new RegExp( regexS );
                                var results = regex.exec( url );
                                if( results == null )
                                    return "";
                                else
                                    return results[1];
                            }//end of gup()
                            
                        })
                        .then(token=>{ 
                            return new Promise((resolve, reject) => {
                            // console.log("vvv: ", vvv)
                            console.log("Token: ",token)
                            console.log("Token URL: ",token_url)
                            $.ajax({
                                url: token_url,
                                method: "POST",
                                data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                success: function(response) {
                                    console.log("response: ",response);
                                    //important to check access token and token type (e.g. bearer)
                                    tok = response.access_token;
                                    console.log("tok: ", tok)
                                    resolve('https://scrapir.org/api/'+endpoint+'?tokenAPI='+tok)
                                    //console.log("result: ",result);
                                    //return result;
                                },
                                error: function(response, jqXHR, textStatus, errorThrown) {
                                    console.log("error: ",response);
                                }
                            })
                        })
                        // return something
                        })

                    }else{ //no oauth
                        console.log("!!!oauth2")
                        result =  'https://scrapir.org/api/'+endpoint+'?'+paramList
                        //console.log("result: ",result);
                        return result;
                    }

                })//firebase
                .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url).then(response => response.json() )) })   })
                .then(o => {
                    console.log("o: ", o)
                    //map response to class properties                
                    if(o.constructor === Array){
                        console.log("ARRAY");
                        o.forEach(function(ob) {
                            for(p in properties){
                                if(properties[p].field){// it won't check type properties (e.g. comment for VideoObject)
                                    if (properties[p].property !== properties[p].field && ob[properties[p].field]) {
                                        Object.defineProperty(ob, properties[p].property, Object.getOwnPropertyDescriptor(ob, properties[p].field));
                                        delete ob[properties[p].field];
                                    }
                                }else{ //if the property is a type
                                    var propType = properties[p].property;
                                    var typeName = properties[p].type;
                                    var id = properties[p].id;
                                    var obId=ob.videoId; //NEED TO BE CHANGED
                                    // creat a getter for property of type Type
                                    // var getter = "get"
                                    // Object.defineProperty(o, 'b', {
                                    //     // Using shorthand method names (ES2015 feature).
                                    //     // This is equivalent to:
                                    //     // get: function() { return bValue; },
                                    //     // set: function(newValue) { bValue = newValue; },
                                    //     get() { return bValue; },
                                    //     set(newValue) { bValue = newValue; },
                                    //     enumerable: true,
                                    //     configurable: true
                                    // });
                                      
                                    Object.defineProperty(ob, propType, { 
                                        get: function() { 
                                            return firebase.database().ref('/abstractions/youtube/'+typeName).once('value').then(function(snapshot) {
                                                return self(snapshot.val(), type, obId);
                                            });
                                        }
                                    });//end of getter
                                    

                                    // Object.defineProperty(ob, propType, { 
                                    //     set: function() { 
                                    //         // return firebase.database().ref('/abstractions/youtube/'+typeName).once('value').then(function(snapshot) {
                                    //         //     return self(snapshot.val(), type, obId);
                                    //         // });
                                    //     }
                                    // });//end of setter
                                }
                            }
                        });

                        //remove the fields that are not in the class
                        var keys = Object.keys(o[0])
                        for(k in keys){
                            if(!fields.includes(keys[k])){
                                o.forEach(function(ob) {
                                    delete ob[keys[k]];
                                })
                            }
                        }
                            
                    }else{
                        console.log("NOT ARRAY")
                        for(p in properties){
                            if(properties[p].field){// it won't check type properties (e.g. comment for VideoObject)
                                if (properties[p].property !== properties[p].field && o[properties[p].field]) {
                                    Object.defineProperty(o, properties[p].property, Object.getOwnPropertyDescriptor(o, properties[p].field));
                                    delete o[properties[p].field];
                                }
                            }else{ //if the property is a type
                                var propType = properties[p].property;
                                var typeName = properties[p].type;
                                var id = properties[p].id;
                                var obId=o.videoId; //NEED TO BE CHANGED
                                // creat a getter for property of type Type
                                // var getter= "get"
                                Object.defineProperty(o, propType, { 
                                    get: function() { 
                                        return firebase.database().ref('/abstractions/youtube/'+typeName).once('value').then(function(snapshot) {
                                            return self(snapshot.val(), type, obId);
                                        });
                                    }
                                });
                            }
                        }

                        //remove the fields that are not in the class
                        var keys = Object.keys(o)
                        for(k in keys){
                            if(!fields.includes(keys[k])){
                                delete o[keys[k]];
                            }
                        }
                    }
                    return o;
                })         
                // return obj; 
            };
        });
    });



    //STEPS:
    //[1] getter and setter for playlist
    //[2] oauth situation 


    // if oauth2
    // return new Promise(function(resolve, reject) {resolve(fetch('https://scrapir.org/api/'+endpoint+'?tokenAPI=tok&'+paramList).then(response => response.json() )) })

    // tokenAPI=tok

var obJSON;


var auth_url,token_url, redirect_url, client_id, client_secret, response_type, scope, grant_type, client_auth, tok;


function getData(){
    return new Promise(function(resolve, reject) {resolve(fetch('https://scrapir.org/api/'+endpoint+'?tokenAPI='+tok).then(response => response.json() )) })
    .then(o => {
        //map response to class properties                
        if(o.constructor === Array){
            console.log("ARRAY");
            o.forEach(function(ob) {
                for(p in properties){
                    if(properties[p].field){// it won't check type properties (e.g. comment for VideoObject)
                        if (properties[p].property !== properties[p].field && ob[properties[p].field]) {
                            Object.defineProperty(ob, properties[p].property, Object.getOwnPropertyDescriptor(ob, properties[p].field));
                            delete ob[properties[p].field];
                        }
                    }else{ //if the property is a type
                        var propType = properties[p].property;
                        var typeName = properties[p].type;
                        var id = properties[p].id;
                        var obId=ob.videoId; //NEED TO BE CHANGED
                        // creat a getter for property of type Type
                        // var getter = "get"
                        // Object.defineProperty(o, 'b', {
                        //     // Using shorthand method names (ES2015 feature).
                        //     // This is equivalent to:
                        //     // get: function() { return bValue; },
                        //     // set: function(newValue) { bValue = newValue; },
                        //     get() { return bValue; },
                        //     set(newValue) { bValue = newValue; },
                        //     enumerable: true,
                        //     configurable: true
                        // });
                          
                        Object.defineProperty(ob, propType, { 
                            get: function() { 
                                return firebase.database().ref('/abstractions/youtube/'+typeName).once('value').then(function(snapshot) {
                                    return self(snapshot.val(), type, obId);
                                });
                            }
                        });//end of getter
                    }
                }
            });

            //remove the fields that are not in the class
            var keys = Object.keys(o[0])
            for(k in keys){
                if(!fields.includes(keys[k])){
                    o.forEach(function(ob) {
                        delete ob[keys[k]];
                    })
                }
            }
                
        }else{
            console.log("NOT ARRAY")
            for(p in properties){
                if(properties[p].field){// it won't check type properties (e.g. comment for VideoObject)
                    if (properties[p].property !== properties[p].field && o[properties[p].field]) {
                        Object.defineProperty(o, properties[p].property, Object.getOwnPropertyDescriptor(o, properties[p].field));
                        delete o[properties[p].field];
                    }
                }else{ //if the property is a type
                    var propType = properties[p].property;
                    var typeName = properties[p].type;
                    var id = properties[p].id;
                    var obId=o.videoId; //NEED TO BE CHANGED
                    // creat a getter for property of type Type
                    // var getter= "get"
                    Object.defineProperty(o, propType, { 
                        get: function() { 
                            return firebase.database().ref('/abstractions/youtube/'+typeName).once('value').then(function(snapshot) {
                                return self(snapshot.val(), type, obId);
                            });
                        }
                    });
                }
            }

            //remove the fields that are not in the class
            var keys = Object.keys(o)
            for(k in keys){
                if(!fields.includes(keys[k])){
                    delete o[keys[k]];
                }
            }
        }
        return o;
    })  
}






    setTimeout(() => {               
        // (async function(){
        // })()
        // var playlist = MusicPlaylist("Fun Music", "Tarfah", "PL55713C70BA91BD6E");
        // console.log("Object: ", playlist);

        (async function(){
            // var video =   await VideoObject("xQOO2xGQ1Pc")
            // console.log("video await: ", video)
            var video =   await VideoObject("xQOO2xGQ1Pc")
            console.log("video await: ", video)
            console.log("comment await: ", await video.comment)
            // var comment = await Comment("Ugw6LPQAg1DQ8dyi18x4AaABAg,UgxRr7U4jePnkI4HBT54AaABAg");
            // console.log("comment await: ", comment)
        })()

        // video.then(video=> {
        //     console.log("video: ",video);
        //     console.log("video name: ",video.name);

        //     video.comment.then(comments=> {
        //         console.log("video comments: ",comments)
        //     });
        //     // render(video)
        // })

        // var comment = Comment("Ugw6LPQAg1DQ8dyi18x4AaABAg,UgxRr7U4jePnkI4HBT54AaABAg")
        
        // comment.then(comment=> {
        //     console.log("comment info: ",comment)
        // })



        // var youtube = new Website()
        // var videoSites = new Website
        // youtube.search("")

        // var video = new VideoObject("youtube", "xQOO2xGQ1Pc")
        // var video = new VideoObject( [("youtube", "xQOO2xGQ1Pc"), ("dailymotion", "7ywefg")] )

       
        // function render(v){
        //     console.log("print the video outisde: ",v)
        // }

    }, 3000);  
   


    // function Car(make, model, year) {
    //     this.make = make;
    //     this.model = model;
    //     this.year = year;
    // }

    // const car1 = new Car('Eagle', 'Talon TSi', 1993);

    // console.log(car1);

});






  



// class Company {
//     constructor(brand) {
//        this.Compname = brand;
//     }
//     get name() {
//        return this.Compname;
//     }
//     set name(x) {
//        this.Compname = x;
//     }
//  }
//  myName = new Company("Tutorialspoint");
//  console.log("myName: ", myName)
//  myName.Compname="newNAME"
//  console.log("new myName: ", myName)
 //  document.getElementById("method").innerHTML = myName.Compname;


 //getters to get properties' values
 //setters to update properties' values
 //constructor to add new object to the site
 //methods



    



// var MusicPlaylist = MusicPlaylist|| {}; 

// MusicPlaylist = function (playlistId, name) { 
//   this.playlistId = playlistId; 
//   this.name = name; 
//   // this.videos = this.getVideos();
//   this.videos = function(){return this.playlistId;}; //send a playlistId to VideoObject and return a collection of VideoObject (return videos and then map it to the VideoObject properties)
// } 

// var playlist = new MusicPlaylist("46", "Tarfah"); 

// res.send(playlist) //return playlist object {"playlistId":"46","name":"Tarfah"}
// how to construct playlist automatically? when we search, a construct will automatically be created var playlist = new MusicPlaylist("46", "Tarfah"); these values are turned from the search 
// playlist.videos()



          // function get(obj, prop) {
            //     return obj[prop]
            //   }
              
            //   function set(obj, prop, value) {
            //     obj[prop] = value
            //   }
            
              // use set
            //   set(pastry, "name", "waffle")
              
              // use get
              //console.log(get(pastry, "name")) // waffle




            // if(val.properties){
            //     properties=Object.keys(val.properties)
            //     for(var i=0; i<properties.length; ++i){
            //         property = properties[i]
            //         window[type][property]=property; //Thing.name = name
            //     }
            // }else{
            // }

            // if(val.mathods){
            //     methods=Object.keys(val.methods)
            //     for(var i=0; i<methods.length; ++i){
            //         method = methods[i]
            //         window[type][method]= function() {return callAPI(this.method)}
            //     }
            // }else{  
            // }