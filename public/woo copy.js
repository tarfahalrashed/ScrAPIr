
var config = {
    apiKey: "AIzaSyBaJakjjAHw0wvBtELAtDLPmhq1piGWwqQ",
    authDomain: "superapi-52bc2.firebaseapp.com",
    databaseURL: "https://superapi-52bc2.firebaseio.com",
    projectId: "superapi-52bc2",
    storageBucket: "superapi-52bc2.appspot.com",
    messagingSenderId: "859121565515"
};
  

var promiseResolve, promiseReject;


$(document).ready(function (e) {
    var properties = []
    var methods = []

    firebase.initializeApp(config);

    firebase.database().ref('/abstractions/youtube').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) { 
            var type = childSnapshot.key;
            var val  = childSnapshot.val();

            
            window[type] = {} //initilize function
            // window[type] = function() {return this} //allows us to ceate new instacnce of this function

            window[type] = function(...args) {return self(val, "self", ...args)  };  
              
            function self (typeOb, caller, ...args) { 
                var endpoint = typeOb.construct[caller].endpoint;
                var params = typeOb.construct[caller].input;
                var properties = typeOb.properties;
                var fields=[], paramList="";

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

                for(f in properties){
                    if(properties[f].field != undefined){
                        fields.push(properties[f].property)
                    }
                }

                // var obj={};
                // return new Promise(function(resolve, reject) {resolve(fetch('https://scrapir.org/api/'+endpoint+'?'+paramList+'&Number of Results=2').then(response => response.json())) }).then(o => {                         
                return new Promise(function(resolve, reject) {resolve(fetch('https://scrapir.org/api/'+endpoint+'?'+paramList).then(response => response.json() )) })
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
                                    // var getter= "get"
                                    Object.defineProperty(ob, propType, { 
                                        get: function() { 
                                            return firebase.database().ref('/abstractions/youtube/'+typeName).once('value').then(function(snapshot) {
                                                return self(snapshot.val(), type, obId);
                                            });
                                        }
                                    });
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



    setTimeout(() => {               
        // (async function(){
        // })()
        // var playlist = MusicPlaylist("Fun Music", "Tarfah", "PL55713C70BA91BD6E");
        // console.log("Object: ", playlist);

        // (async function(){
        //     var video =   await VideoObject("xQOO2xGQ1Pc")
        //     console.log("video await: ", video)
        //     // var comment = await Comment("Ugw6LPQAg1DQ8dyi18x4AaABAg,UgxRr7U4jePnkI4HBT54AaABAg");
        //     // console.log("comment await: ", comment)
        // })()

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