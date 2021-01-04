var config = {
    apiKey: "AIzaSyBaJakjjAHw0wvBtELAtDLPmhq1piGWwqQ",
    authDomain: "superapi-52bc2.firebaseapp.com",
    databaseURL: "https://superapi-52bc2.firebaseio.com",
    projectId: "superapi-52bc2",
    storageBucket: "superapi-52bc2.appspot.com",
    messagingSenderId: "859121565515"
};
  

var promiseResolve, promiseReject, result, obJSON, auth_url,token_url, redirect_url, client_id, client_secret, response_type, scope, grant_type, client_auth, tok, expires_in;
var properties = [], methods = []

var sitesToken=[]; currentType="";

$(document).ready(function (e) {

    firebase.initializeApp(config);

    firebase.database().ref('/abstractions/').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) { 

            var siteOAuthObj={
                site: childSnapshot.key,
                token:"",
                expires_in:""
            }
            sitesToken.push(siteOAuthObj)
        })
        localStorage.setItem('tokens', JSON.stringify(sitesToken));

    })

    //console.log("tokens: ", localStorage.getItem('tokens'));

    //TODO - for each site, fetch the classess youtube.VideoObject(...args) OR VideoObject("youtube", ...args)
    // window['Website'] = {} //initilize function
    // window['Website'] = function(arg) {return {"name":arg, VideoObject:"Tarsha"}};  
    // window['Website']['VideoObject']= function() {return "Tarfah"}; 


    firebase.database().ref('/abstractions').once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) { 
            // console.log("key sites: ", childSnapshot.key)

            if(childSnapshot.key!= "youtube"){

    var site = childSnapshot.key;
    
    window[site] = {} //initilize function

    // firebase.database().ref('/abstractions/'+site+'/objects').once('value').then(function(snapshot) {
    firebase.database().ref('/abstractions/'+site).once('value').then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) { 

            let siteKey = childSnapshot.key;
            let siteVal  = childSnapshot.val();
            // console.log("type: ", siteKey)
            // console.log("val: ", siteVal)
            
        if(siteKey == "objects"){
            for (const [key, value] of Object.entries(siteVal)) {
                //console.log(eval(value));
                let type = key;
                let val  = eval(value);
            
            window[site][type] = function(...args) { return self(type, val, "self", "none", ...args) };  

            function self (typekey, typeOb, caller, prop, ...args) { 
                // console.log("typeOb:", typeOb)
                // console.log("caller:", caller)
                console.log("callerTYPE:", typekey)
                currentType = typekey;

                console.log("prop:", prop)

                if(prop == "none"){
                    var endpoint = typeOb.construct[caller].endpoint;
                    var params = typeOb.construct[caller].input;
                    // var typeId = typeOb.id
                    // console.log("typeId1: ", typeId)
                }else{
                    var arrEndpoints= typeOb.construct[caller];
                    console.log("arrEndpoints: ", arrEndpoints)
                    var elemIndex = arrEndpoints.findIndex(element => element.property == prop)
                    var endpoint = typeOb.construct[caller][elemIndex].endpoint;
                    var params = typeOb.construct[caller][elemIndex].input;
                    // var typeId = typeOb.construct[caller][elemIndex].id;
                    // console.log("typeId2: ", typeId)
                }

                var idValue = args[0];
                var typeId = typeOb.id
                var properties = typeOb.properties;
                var getters = typeOb.getters;
                var setters = typeOb.setters;
                var methods = typeOb.methods;
                var fields=[], paramList="", mParamList="";

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
                                    resolve('http://localhost:5000/api/'+endpoint+'?tokenAPI='+tok)
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
                        console.log("NOT oauth2")
                        result =  'http://localhost:5000/api/'+endpoint+'?'+paramList
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
                                    if (properties[p].property != properties[p].field && ob[properties[p].field]) {
                                        Object.defineProperty(ob, properties[p].property, Object.getOwnPropertyDescriptor(ob, properties[p].field));
                                        delete ob[properties[p].field];
                                    }
                                }else{ //if the property is a type
                                    let propType = properties[p].property;
                                    let typeName = properties[p].type;

                                    Object.defineProperty(ob, propType, { 
                                        get: function() { 
                                            let promise = firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                                console.log("typeOb4: ", snapshot.val())
                                                // return self(snapshot.val(), type, propType, ob[typeId]);
                                                return self(snapshot.key, snapshot.val(), currentType, propType, ob[typeId]);
                                            });
                                            return promise;
                                        }
                                    });//end of getter
   
                                }
                            }
                       
                            //***************************** GETTERS *********************************/


                            //***************************** SETTERS *********************************/
                            for(s in setters){
                                // console.log("setter: ", setters[s])   
                                var field = setters[s].field; //API endpoint field to be set
                                var prop;
                                var setEndpoint =  setters[s].endpoint;
                                var setParams = setters[s].params;
                                var idd = setters[s].id;
                                //get the schema.org property mapped to this field
                                for(f in properties){
                                    if(properties[f].field == field){
                                        prop = properties[f].property;
                                    }
                                }

                                Object.defineProperty(ob, prop, { 
                                    set: function(newValue) { 
                                        console.log("newValue: ", newValue)
                                        this.pro = firebase.database().ref('/apis/'+setEndpoint).once('value').then(function(snapshot) {
                                        obJSON = snapshot.val();
                                        console.log(obJSON)
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
                                                            resolve('http://localhost:5000/api/'+setEndpoint+'?tokenAPI='+tok+'&'+field+'='+newValue+'&'+idd+'='+idValue)
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
                                            result =  'http://localhost:5000/api/'+setEndpoint+'?'+paramList+'&'+pro+'='+newValue+'&id='+identifier
                                            //console.log("result: ",result);
                                            return result;
                                        }
            
                                    })//firebase
                                    .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url)) })   })
                                        
                                    }
                                });
                            }

                            //***************************** METHODS *********************************/
                            for(m in methods){
                                var mName = methods[m].name;
                                var mEndpoint = methods[m].endpoint;
                                var mParams = methods[m].params;

                                // add the imageId
                                Object.defineProperty(ob, mName.toString(), { value: function(...mArgs) { 
                                    if(mArgs.length>0){
                                        if(mParams){
                                            for(var p=0; p<mParams.length; ++p){
                                                //Object.entries(mParams[p]).forEach(([key, value]) => {
                                                    mParamList+=mParams[p]//`${key}`
                                                    mParamList+="="
                                                    mParamList+=mArgs[p]//THIS ASSUMES THAT id value will be sent
                                                // });
                                                if(p+1<mParams.length){
                                                    mParamList+="&" 
                                                }
                                            }
                                        }
                                    }else{
                                        // console.log("methods[m]:2 ", ob.imageId)
                                        // let elemIndexM = properties.findIndex(element => element.field == methods[m].params[0])
                                        // let endpointM = properties[elemIndexM].property;
                                        // console.log("HERE: ", ob[endpointM])
                                        mParamList+=mParams[0]
                                        mParamList+="="
                                        mParamList+=ob[mParams[0]]
                                    }

                                    console.log("mParamList: ", mParamList)
                                    return firebase.database().ref('/apis/'+mEndpoint).once('value').then(function(snapshot) {
                                    obJSON = snapshot.val();
                                    //console.log(obJSON)
                                
                                    if(obJSON.oauth2){
                                        console.log("oauth2")
        
                                        var tokenPromise;
                                        var sTokens = JSON.parse(localStorage.getItem('tokens'));
                                        console.log(sTokens)
                                        const elementsIndex = sTokens.findIndex(element => element.site == site)
                                        console.log("sTokens[elementsIndex]: ", sTokens[elementsIndex].token)
                                        if(sTokens[elementsIndex].token!=""){
                                                    tokenPromise= new Promise((resolve, reject) => {resolve(sTokens[elementsIndex].token)})
                                                    .then(token=>{ 
                                                        return new Promise((resolve, reject) => {
                                                            console.log("Token: ",token)
                                                            $.ajax({
                                                                url: token_url,
                                                                method: "POST",
                                                                data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                                success: function(response) {
                                                                    console.log("response: ",response);
                                                                    tok = response.access_token;
                                                                    expires_in = response.expires_in;
                                                                    console.log("tok: ", tok)
                                                                    console.log("expires_in: ", expires_in)
                                                                    // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                                    // console.log("tokens: ", localStorage.getItem('tokens'));
                                                                    //const elementsIndex = this.sTokens.findIndex(element => element.site == site)
                                                                    let newArray = [...sTokens]
                                                                    newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                                    newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                                    // this.setState({newArray});

                                                                    localStorage.setItem('tokens', JSON.stringify(newArray));
                                                                    console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
                
                                                                    resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                                },
                                                                error: function(response, jqXHR, textStatus, errorThrown) {
                                                                    console.log("error: ",response);
                                                                }
                                                            })
                                                        })
                                                    })
                                                }else{
                                                    tokenPromise= new Promise((resolve, reject) => {
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
                                                            console.log("Token: ",token)
                                                            $.ajax({
                                                                url: token_url,
                                                                method: "POST",
                                                                data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                                success: function(response) {
                                                                    console.log("response: ",response);
                                                                    tok = response.access_token;
                                                                    expires_in = response.expires_in;
                                                                    console.log("tok: ", tok)
                                                                    console.log("expires_in: ", expires_in)
                                                                    // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                                    // console.log("tokens: ", localStorage.getItem('tokens'));
                                                                    let newArray = [...sTokens]
                                                                    newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                                    newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                                    // this.setState({newArray});

                                                                    localStorage.setItem('tokens', JSON.stringify(newArray));
                                                                    console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
                
                
                                                                    resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                                },
                                                                error: function(response, jqXHR, textStatus, errorThrown) {
                                                                    console.log("error: ",response);
                                                                }
                                                            })
                                                        })
                                                    })
                                                }
                            
                                        return tokenPromise

                    
                                    }else{ //no oauth
                                        console.log("!!!oauth2")
                                        result =  'http://localhost:5000/api/'+mEndpoint+'?'+mParamList
                                        return result;
                                    }
        
                                    })//firebase
                                    .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url).then(response => response.json() )) })   })
                                }
                                });
                            //   });

                            }//loop to create methods
                                
                        });//loop over array of objects


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
                                if (properties[p].property != properties[p].field && o[properties[p].field]) {
                                    Object.defineProperty(o, properties[p].property,Object.getOwnPropertyDescriptor(o, properties[p].field));
                                    delete o[properties[p].field];
                                }
                            }else{ //if the property is a type
                                let propType = properties[p].property;
                                let typeName = properties[p].type;                                
                                // console.log("propType: ", propType);
                                // console.log("typeName not array: ", typeName)

                                // creat a getter for property of type Type
                                Object.defineProperty(o, propType, { 
                                    get: function() { 
                                        let promise = firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                            console.log("typeOb1: ", snapshot.val())
                                            return self(snapshot.key, snapshot.val(), currentType, propType, o[typeId]);
                                        });
                                        return promise;
                                    }
                                });

                                //***** if you want to remove the getter, replce iti with this
                                // o[propType]= firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                //     console.log("typeOb1: ", snapshot.val())
                                //     return self(snapshot.key, snapshot.val(), currentType, propType, o[typeId]);
                                // });
                                // return o;

                                
                            }
                        }//end of for loop properties

                        //***************************** GETTERS *********************************/


                        //***************************** SETTERS *********************************/
                        for(s in setters){
                            // console.log("setter: ", setters[s])   
                            var field = setters[s].field; //API endpoint field to be set
                            var prop;
                            var setEndpoint =  setters[s].endpoint;
                            var setParams = setters[s].params;
                            var idd = setters[s].id;
                            //get the schema.org property mapped to this field
                            for(f in properties){
                                if(properties[f].field == field){
                                    prop = properties[f].property;
                                }
                            }

                            Object.defineProperty(o, prop, { 
                                set: function(newValue) { 
                                    console.log("newValue: ", newValue)
                                    this.pro = firebase.database().ref('/apis/'+setEndpoint).once('value').then(function(snapshot) {
                                    obJSON = snapshot.val();
                                    console.log(obJSON)
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
                                                        resolve('http://localhost:5000/api/'+setEndpoint+'?tokenAPI='+tok+'&'+field+'='+newValue+'&'+idd+'='+idValue)
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
                                        result =  'http://localhost:5000/api/'+setEndpoint+'?'+paramList+'&'+pro+'='+newValue+'&id='+identifier
                                        //console.log("result: ",result);
                                        return result;
                                    }
        
                                })//firebase
                                .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url)) })   })
                                    
                                }
                            });
                        }

                        //***************************** METHODS *********************************/
                        for(m in methods){
                            console.log("methods[m]: ", methods[m].name)
                            var mName = methods[m].name;
                            var mEndpoint = methods[m].endpoint;
                            var mParams = methods[m].params;
    
                            Object.defineProperty(o, mName.toString(), { value: function(...mArgs) { 
                                if(mParams){
                                    for(var p=0; p<mParams.length; ++p){
                                        //Object.entries(mParams[p]).forEach(([key, value]) => {
                                            mParamList+=mParams[p]//`${key}`
                                            mParamList+="="
                                            mParamList+=mArgs[p]
                                        // });
                                        if(p+1<mParams.length){
                                            mParamList+="&" 
                                        }
                                    }
                                }
                                console.log("mParamList: ", mParamList)
                                return firebase.database().ref('/apis/'+mEndpoint).once('value').then(function(snapshot) {
                                obJSON = snapshot.val();
                                console.log(obJSON)
                            
                                if(obJSON.oauth2){
                                    console.log("oauth2")
       
                                    var tokenPromise;
                                    var sTokens = JSON.parse(localStorage.getItem('tokens'));
                                    console.log(sTokens)
                                    const elementsIndex = sTokens.findIndex(element => element.site == site)
                                    console.log("sTokens[elementsIndex]: ", sTokens[elementsIndex].token)
                                    if(sTokens[elementsIndex].token!=""){
                                                tokenPromise= new Promise((resolve, reject) => {resolve(sTokens[elementsIndex].token)})
                                                .then(token=>{ 
                                                    return new Promise((resolve, reject) => {
                                                        console.log("Token: ",token)
                                                        $.ajax({
                                                            url: token_url,
                                                            method: "POST",
                                                            data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                            success: function(response) {
                                                                console.log("response: ",response);
                                                                tok = response.access_token;
                                                                expires_in = response.expires_in;
                                                                console.log("tok: ", tok)
                                                                console.log("expires_in: ", expires_in)
                                                                // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                                // console.log("tokens: ", localStorage.getItem('tokens'));
                                                                //const elementsIndex = this.sTokens.findIndex(element => element.site == site)
                                                                let newArray = [...sTokens]
                                                                newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                                newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                                // this.setState({newArray});

                                                                localStorage.setItem('tokens', JSON.stringify(newArray));
                                                                console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
            
                                                                resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                            },
                                                            error: function(response, jqXHR, textStatus, errorThrown) {
                                                                console.log("error: ",response);
                                                            }
                                                        })
                                                    })
                                                })
                                            }else{
                                                tokenPromise= new Promise((resolve, reject) => {
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
                                                        console.log("Token: ",token)
                                                        $.ajax({
                                                            url: token_url,
                                                            method: "POST",
                                                            data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                            success: function(response) {
                                                                console.log("response: ",response);
                                                                tok = response.access_token;
                                                                expires_in = response.expires_in;
                                                                console.log("tok: ", tok)
                                                                console.log("expires_in: ", expires_in)
                                                                // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                                // console.log("tokens: ", localStorage.getItem('tokens'));
                                                                let newArray = [...sTokens]
                                                                newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                                newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                                // this.setState({newArray});

                                                                localStorage.setItem('tokens', JSON.stringify(newArray));
                                                                console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
            
            
                                                                resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                            },
                                                            error: function(response, jqXHR, textStatus, errorThrown) {
                                                                console.log("error: ",response);
                                                            }
                                                        })
                                                    })
                                                })
                                            }
                           
                                    return tokenPromise

                
                                }else{ //no oauth
                                    console.log("!!!oauth2")
                                    result =  'http://localhost:5000/api/'+mEndpoint+'?'+mParamList
                                    return result;
                                }
    
                                })//firebase
                                .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url).then(response => response.json() )) })   })
                            }
                            });
                        //   });

                        }//loop to create methods

                        //remove the fields that are not in the class
                        var keys = Object.keys(o)
                        for(k in keys){
                            if(!fields.includes(keys[k])){
                                delete o[keys[k]];
                            }
                        }
                    }//end of else of no array

                    return o;
                })         
                // return obj; 
            };

           }
        }//if objects

        if(siteKey == "functions"){
             for (v in siteVal) {
                let funcName = siteVal[v].name;
                //var mName = methods[m].name;
                var mEndpoint = siteVal[v].endpoint;
                var mParams = siteVal[v].params;
                var mObject = siteVal[v].object;
                var mParamList="";

                var properties=[], fields=[];
                firebase.database().ref('/abstractions/'+site+'/objects/'+mObject+'/properties').once('value').then(function(snapshot) {
                    snapshot.forEach(function(childSnapshot) { 
                        properties.push(childSnapshot.val())
                    })
                })

                window[site][funcName] = function(...mArgs) { return siteFunction(...mArgs) }; 
                
                function siteFunction(...mArgs) { 
                    if(mArgs.length>0){
                        if(mParams){
                            for(var p=0; p<mParams.length; ++p){
                                    mParamList+=mParams[p]//`${key}`
                                    mParamList+="="
                                    mParamList+=mArgs[p]//THIS ASSUMES THAT id value will be sent
                                if(p+1<mParams.length){
                                    mParamList+="&" 
                                }
                            }
                        }
                    }else{
                        // console.log("methods[m]:2 ", ob.imageId)
                        // let elemIndexM = properties.findIndex(element => element.field == methods[m].params[0])
                        // let endpointM = properties[elemIndexM].property;
                        // console.log("HERE: ", ob[endpointM])
                        mParamList+=mParams[0]
                        mParamList+="="
                        mParamList+=ob[mParams[0]]
                    }

                    for(f in properties){
                        if(properties[f].field != undefined){
                            fields.push(properties[f].property)
                        }
                    }

                    console.log("mParamList: ", mParamList)
                    return firebase.database().ref('/apis/'+mEndpoint).once('value').then(function(snapshot) {
                    obJSON = snapshot.val();
                    //console.log(obJSON)
                
                    if(obJSON.oauth2){
                        console.log("oauth2")

                        var tokenPromise;
                        var sTokens = JSON.parse(localStorage.getItem('tokens'));
                        console.log(sTokens)
                        const elementsIndex = sTokens.findIndex(element => element.site == site)
                        console.log("sTokens[elementsIndex]: ", sTokens[elementsIndex].token)
                        if(sTokens[elementsIndex].token!=""){
                                    tokenPromise= new Promise((resolve, reject) => {resolve(sTokens[elementsIndex].token)})
                                    .then(token=>{ 
                                        return new Promise((resolve, reject) => {
                                            console.log("Token: ",token)
                                            $.ajax({
                                                url: token_url,
                                                method: "POST",
                                                data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                success: function(response) {
                                                    console.log("response: ",response);
                                                    tok = response.access_token;
                                                    expires_in = response.expires_in;
                                                    console.log("tok: ", tok)
                                                    console.log("expires_in: ", expires_in)
                                                    // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                    // console.log("tokens: ", localStorage.getItem('tokens'));
                                                    //const elementsIndex = this.sTokens.findIndex(element => element.site == site)
                                                    let newArray = [...sTokens]
                                                    newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                    newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                    // this.setState({newArray});

                                                    localStorage.setItem('tokens', JSON.stringify(newArray));
                                                    console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))

                                                    resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                },
                                                error: function(response, jqXHR, textStatus, errorThrown) {
                                                    console.log("error: ",response);
                                                }
                                            })
                                        })
                                    })
                                }else{
                                    tokenPromise= new Promise((resolve, reject) => {
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
                                            console.log("Token: ",token)
                                            $.ajax({
                                                url: token_url,
                                                method: "POST",
                                                data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                success: function(response) {
                                                    console.log("response: ",response);
                                                    tok = response.access_token;
                                                    expires_in = response.expires_in;
                                                    console.log("tok: ", tok)
                                                    console.log("expires_in: ", expires_in)
                                                    // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                    // console.log("tokens: ", localStorage.getItem('tokens'));
                                                    let newArray = [...sTokens]
                                                    newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                    newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                    // this.setState({newArray});

                                                    localStorage.setItem('tokens', JSON.stringify(newArray));
                                                    console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))


                                                    resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                },
                                                error: function(response, jqXHR, textStatus, errorThrown) {
                                                    console.log("error: ",response);
                                                }
                                            })
                                        })
                                    })
                                }
            
                        return tokenPromise

    
                    }else{ //no oauth
                        console.log("!!!oauth2")
                        result =  'http://localhost:5000/api/'+mEndpoint+'?'+mParamList
                        return result;
                    }

                    })//firebase
                    .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url).then(response => response.json() )) })   })
                    .then(o => {
                        console.log("o: ", o)
                        console.log("properties!!! ", properties)

                        //map response to class properties                
                        if(o.constructor === Array){
                            console.log("ARRAY");
                            o.forEach(function(ob) {
                                for(p in properties){
                                    if(properties[p].field){// it won't check type properties (e.g. comment for VideoObject)
                                        if (properties[p].property != properties[p].field && ob[properties[p].field]) {
                                            Object.defineProperty(ob, properties[p].property, Object.getOwnPropertyDescriptor(ob, properties[p].field));
                                            delete ob[properties[p].field];
                                        }
                                    }else{ //if the property is a type
                                        let propType = properties[p].property;
                                        let typeName = properties[p].type;
    
                                        Object.defineProperty(ob, propType, { 
                                            get: function() { 
                                                let promise = firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                                    console.log("typeOb2: ", snapshot.val())
                                                    // return self(snapshot.val(), type, propType, ob[typeId]);
                                                    return self(snapshot.key, snapshot.val(), currentType, propType, ob[typeId]);

                                                });
                                                return promise;
                                            }
                                        });//end of getter
       
                                    }
                                }
                           
                                //***************************** GETTERS *********************************/
    
    
                                //***************************** SETTERS *********************************/
                                // if(setters){
                                // for(s in setters){
                                //     // console.log("setter: ", setters[s])   
                                //     var field = setters[s].field; //API endpoint field to be set
                                //     var prop;
                                //     var setEndpoint =  setters[s].endpoint;
                                //     var setParams = setters[s].params;
                                //     var idd = setters[s].id;
                                //     //get the schema.org property mapped to this field
                                //     for(f in properties){
                                //         if(properties[f].field == field){
                                //             prop = properties[f].property;
                                //         }
                                //     }
    
                                //     Object.defineProperty(ob, prop, { 
                                //         set: function(newValue) { 
                                //             console.log("newValue: ", newValue)
                                //             this.pro = firebase.database().ref('/apis/'+setEndpoint).once('value').then(function(snapshot) {
                                //             obJSON = snapshot.val();
                                //             console.log(obJSON)
                                //             if(obJSON.oauth2){
                                //                 console.log("oauth2")
                                //                 return new Promise((resolve, reject) => {
                                //                         console.log("auth function");
                                //                         auth_url= obJSON.oauth2[0].authURL;
                                //                         token_url= obJSON.oauth2[0].tokenURL;
                                //                         redirect_url= obJSON.oauth2[0].callbackURL;
                                //                         client_id= obJSON.oauth2[0].clientId;
                                //                         client_secret= obJSON.oauth2[0].clientSec;
                                //                         response_type= obJSON.oauth2[0].resType;
                                //                         scope= obJSON.oauth2[0].scope;
                                //                         grant_type= obJSON.oauth2[0].grantType;
                                //                         client_auth= obJSON.oauth2[0].clientAuth;
                                                            
                                //                         var win = window.open(auth_url+"?response_type="+JSON.parse(JSON.stringify(response_type))+"&scope="+JSON.parse(JSON.stringify(scope))+"&client_id="+JSON.parse(JSON.stringify(client_id))+"&redirect_uri="+JSON.parse(JSON.stringify(redirect_url))+"", "windowname1", 'width=800, height=600');
                                //                         var pollTimer = window.setInterval(function() {
                                //                             try {
                                //                                 console.log("url here: ", win.document.URL); //here url
                                //                                 if (win.document.URL.indexOf(redirect_url) != -1) {
                                //                                     window.clearInterval(pollTimer);
                                //                                     var url =   win.document.URL;
                                //                                     acToken =   gup(url, 'code');
                                //                                     resolve(acToken)
                                //                                     // tokenType = gup(url, 'token_type');
                                //                                     // expiresIn = gup(url, 'expires_in');
                                //                                     win.close();
                                //                                     // return validateToken(acToken)
                                //                                 }
                                //                             } catch(e) {
                                //                                 console.log("error in oauth")
                                //                             }
                                //                         }, 200);
                            
                                //                         function gup(url, name) {
                                //                             name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
                                //                             var regexS = "[\?&]"+name+"=([^&#]*)";
                                //                             var regex = new RegExp( regexS );
                                //                             var results = regex.exec( url );
                                //                             if( results == null )
                                //                                 return "";
                                //                             else
                                //                                 return results[1];
                                //                         }//end of gup()
                                                        
                                //                     })
                                //                     .then(token=>{ 
                                //                         return new Promise((resolve, reject) => {
                                //                         console.log("Token: ",token)
                                //                         console.log("Token URL: ",token_url)
                                //                         $.ajax({
                                //                             url: token_url,
                                //                             method: "POST",
                                //                             data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                //                             success: function(response) {
                                //                                 console.log("response: ",response);
                                //                                 //important to check access token and token type (e.g. bearer)
                                //                                 tok = response.access_token;
                                //                                 console.log("tok: ", tok)
                                //                                 resolve('http://localhost:5000/api/'+setEndpoint+'?tokenAPI='+tok+'&'+field+'='+newValue+'&'+idd+'='+idValue)
                                //                             },
                                //                             error: function(response, jqXHR, textStatus, errorThrown) {
                                //                                 console.log("error: ",response);
                                //                             }
                                //                         })
                                //                     })
                                //                     // return something
                                //                     })
                            
                                //             }else{ //no oauth
                                //                 console.log("!!!oauth2")
                                //                 result =  'http://localhost:5000/api/'+setEndpoint+'?'+paramList+'&'+pro+'='+newValue+'&id='+identifier
                                //                 //console.log("result: ",result);
                                //                 return result;
                                //             }
                
                                //         })//firebase
                                //         .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url)) })   })
                                            
                                //         }
                                //     });
                                // }}
    
                                //***************************** METHODS *********************************/
                                for(m in methods){
                                    var mName = methods[m].name;
                                    var mEndpoint = methods[m].endpoint;
                                    var mParams = methods[m].params;
    
                                    // add the imageId
                                    Object.defineProperty(ob, mName.toString(), { value: function(...mArgs) { 
                                        if(mArgs.length>0){
                                            if(mParams){
                                                for(var p=0; p<mParams.length; ++p){
                                                    //Object.entries(mParams[p]).forEach(([key, value]) => {
                                                        mParamList+=mParams[p]//`${key}`
                                                        mParamList+="="
                                                        mParamList+=mArgs[p]//THIS ASSUMES THAT id value will be sent
                                                    // });
                                                    if(p+1<mParams.length){
                                                        mParamList+="&" 
                                                    }
                                                }
                                            }
                                        }else{
                                            // console.log("methods[m]:2 ", ob.imageId)
                                            // let elemIndexM = properties.findIndex(element => element.field == methods[m].params[0])
                                            // let endpointM = properties[elemIndexM].property;
                                            // console.log("HERE: ", ob[endpointM])
                                            mParamList+=mParams[0]
                                            mParamList+="="
                                            mParamList+=ob[mParams[0]]
                                        }
    
                                        console.log("mParamList: ", mParamList)
                                        return firebase.database().ref('/apis/'+mEndpoint).once('value').then(function(snapshot) {
                                        obJSON = snapshot.val();
                                        //console.log(obJSON)
                                    
                                        if(obJSON.oauth2){
                                            console.log("oauth2")
            
                                            var tokenPromise;
                                            var sTokens = JSON.parse(localStorage.getItem('tokens'));
                                            console.log(sTokens)
                                            const elementsIndex = sTokens.findIndex(element => element.site == site)
                                            console.log("sTokens[elementsIndex]: ", sTokens[elementsIndex].token)
                                            if(sTokens[elementsIndex].token!=""){
                                                        tokenPromise= new Promise((resolve, reject) => {resolve(sTokens[elementsIndex].token)})
                                                        .then(token=>{ 
                                                            return new Promise((resolve, reject) => {
                                                                console.log("Token: ",token)
                                                                $.ajax({
                                                                    url: token_url,
                                                                    method: "POST",
                                                                    data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                                    success: function(response) {
                                                                        console.log("response: ",response);
                                                                        tok = response.access_token;
                                                                        expires_in = response.expires_in;
                                                                        console.log("tok: ", tok)
                                                                        console.log("expires_in: ", expires_in)
                                                                        // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                                        // console.log("tokens: ", localStorage.getItem('tokens'));
                                                                        //const elementsIndex = this.sTokens.findIndex(element => element.site == site)
                                                                        let newArray = [...sTokens]
                                                                        newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                                        newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                                        // this.setState({newArray});
    
                                                                        localStorage.setItem('tokens', JSON.stringify(newArray));
                                                                        console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
                    
                                                                        resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                                    },
                                                                    error: function(response, jqXHR, textStatus, errorThrown) {
                                                                        console.log("error: ",response);
                                                                    }
                                                                })
                                                            })
                                                        })
                                                    }else{
                                                        tokenPromise= new Promise((resolve, reject) => {
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
                                                                console.log("Token: ",token)
                                                                $.ajax({
                                                                    url: token_url,
                                                                    method: "POST",
                                                                    data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                                    success: function(response) {
                                                                        console.log("response: ",response);
                                                                        tok = response.access_token;
                                                                        expires_in = response.expires_in;
                                                                        console.log("tok: ", tok)
                                                                        console.log("expires_in: ", expires_in)
                                                                        // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                                        // console.log("tokens: ", localStorage.getItem('tokens'));
                                                                        let newArray = [...sTokens]
                                                                        newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                                        newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                                        // this.setState({newArray});
    
                                                                        localStorage.setItem('tokens', JSON.stringify(newArray));
                                                                        console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
                    
                    
                                                                        resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                                    },
                                                                    error: function(response, jqXHR, textStatus, errorThrown) {
                                                                        console.log("error: ",response);
                                                                    }
                                                                })
                                                            })
                                                        })
                                                    }
                                
                                            return tokenPromise
    
                        
                                        }else{ //no oauth
                                            console.log("!!!oauth2")
                                            result =  'http://localhost:5000/api/'+mEndpoint+'?'+mParamList
                                            return result;
                                        }
            
                                        })//firebase
                                        .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url).then(response => response.json() )) })   })
                                    }
                                    });
                                //   });
    
                                }//loop to create methods
                                    
                            });//loop over array of objects
    
    
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
                                    if (properties[p].property != properties[p].field && o[properties[p].field]) {
                                        Object.defineProperty(o, properties[p].property,Object.getOwnPropertyDescriptor(o, properties[p].field));
                                        delete o[properties[p].field];
                                    }
                                }else{ //if the property is a type
                                    let propType = properties[p].property;
                                    let typeName = properties[p].type;

                                    // creat a getter for property of type Type
                                    this.status = {};
                                    Object.defineProperty(o, propType, { 
                                        get: function() { 
                                            let promise = firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                                console.log("typeOb3: ", snapshot.val())
                                                // return self(snapshot.val(), type, propType, o[typeId]);
                                                return self(snapshot.key, snapshot.val(), currentType, propType, o[typeId]);
                                            });
                                            return promise;
                                        }
                                    });
                                }
                            }//end of for loop properties
    
                            //***************************** GETTERS *********************************/
    
    
                            //***************************** SETTERS *********************************/
                            for(s in setters){
                                // console.log("setter: ", setters[s])   
                                var field = setters[s].field; //API endpoint field to be set
                                var prop;
                                var setEndpoint =  setters[s].endpoint;
                                var setParams = setters[s].params;
                                var idd = setters[s].id;
                                //get the schema.org property mapped to this field
                                for(f in properties){
                                    if(properties[f].field == field){
                                        prop = properties[f].property;
                                    }
                                }
    
                                Object.defineProperty(o, prop, { 
                                    set: function(newValue) { 
                                        console.log("newValue: ", newValue)
                                        this.pro = firebase.database().ref('/apis/'+setEndpoint).once('value').then(function(snapshot) {
                                        obJSON = snapshot.val();
                                        console.log(obJSON)
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
                                                            resolve('http://localhost:5000/api/'+setEndpoint+'?tokenAPI='+tok+'&'+field+'='+newValue+'&'+idd+'='+idValue)
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
                                            result =  'http://localhost:5000/api/'+setEndpoint+'?'+paramList+'&'+pro+'='+newValue+'&id='+identifier
                                            //console.log("result: ",result);
                                            return result;
                                        }
            
                                    })//firebase
                                    .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url)) })   })
                                        
                                    }
                                });
                            }
    
                            //***************************** METHODS *********************************/
                            for(m in methods){
                                console.log("methods[m]: ", methods[m].name)
                                var mName = methods[m].name;
                                var mEndpoint = methods[m].endpoint;
                                var mParams = methods[m].params;
        
                                Object.defineProperty(o, mName.toString(), { value: function(...mArgs) { 
                                    if(mParams){
                                        for(var p=0; p<mParams.length; ++p){
                                            //Object.entries(mParams[p]).forEach(([key, value]) => {
                                                mParamList+=mParams[p]//`${key}`
                                                mParamList+="="
                                                mParamList+=mArgs[p]
                                            // });
                                            if(p+1<mParams.length){
                                                mParamList+="&" 
                                            }
                                        }
                                    }
                                    console.log("mParamList: ", mParamList)
                                    return firebase.database().ref('/apis/'+mEndpoint).once('value').then(function(snapshot) {
                                    obJSON = snapshot.val();
                                    console.log(obJSON)
                                
                                    if(obJSON.oauth2){
                                        console.log("oauth2")
           
                                        var tokenPromise;
                                        var sTokens = JSON.parse(localStorage.getItem('tokens'));
                                        console.log(sTokens)
                                        const elementsIndex = sTokens.findIndex(element => element.site == site)
                                        console.log("sTokens[elementsIndex]: ", sTokens[elementsIndex].token)
                                        if(sTokens[elementsIndex].token!=""){
                                                    tokenPromise= new Promise((resolve, reject) => {resolve(sTokens[elementsIndex].token)})
                                                    .then(token=>{ 
                                                        return new Promise((resolve, reject) => {
                                                            console.log("Token: ",token)
                                                            $.ajax({
                                                                url: token_url,
                                                                method: "POST",
                                                                data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                                success: function(response) {
                                                                    console.log("response: ",response);
                                                                    tok = response.access_token;
                                                                    expires_in = response.expires_in;
                                                                    console.log("tok: ", tok)
                                                                    console.log("expires_in: ", expires_in)
                                                                    // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                                    // console.log("tokens: ", localStorage.getItem('tokens'));
                                                                    //const elementsIndex = this.sTokens.findIndex(element => element.site == site)
                                                                    let newArray = [...sTokens]
                                                                    newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                                    newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                                    // this.setState({newArray});
    
                                                                    localStorage.setItem('tokens', JSON.stringify(newArray));
                                                                    console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
                
                                                                    resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                                },
                                                                error: function(response, jqXHR, textStatus, errorThrown) {
                                                                    console.log("error: ",response);
                                                                }
                                                            })
                                                        })
                                                    })
                                                }else{
                                                    tokenPromise= new Promise((resolve, reject) => {
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
                                                            console.log("Token: ",token)
                                                            $.ajax({
                                                                url: token_url,
                                                                method: "POST",
                                                                data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                                success: function(response) {
                                                                    console.log("response: ",response);
                                                                    tok = response.access_token;
                                                                    expires_in = response.expires_in;
                                                                    console.log("tok: ", tok)
                                                                    console.log("expires_in: ", expires_in)
                                                                    // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                                    // console.log("tokens: ", localStorage.getItem('tokens'));
                                                                    let newArray = [...sTokens]
                                                                    newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                                    newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                                    // this.setState({newArray});
    
                                                                    localStorage.setItem('tokens', JSON.stringify(newArray));
                                                                    console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
                
                
                                                                    resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                                },
                                                                error: function(response, jqXHR, textStatus, errorThrown) {
                                                                    console.log("error: ",response);
                                                                }
                                                            })
                                                        })
                                                    })
                                                }
                               
                                        return tokenPromise
    
                    
                                    }else{ //no oauth
                                        console.log("!!!oauth2")
                                        result =  'http://localhost:5000/api/'+mEndpoint+'?'+mParamList
                                        return result;
                                    }
        
                                    })//firebase
                                    .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url).then(response => response.json() )) })   })
                                }
                                });
                            //   });
    
                            }//loop to create methods
    
                            //remove the fields that are not in the class
                            var keys = Object.keys(o)
                            for(k in keys){
                                if(!fields.includes(keys[k])){
                                    delete o[keys[k]];
                                }
                            }
                        }//end of else of no array
    
                        return o;
                    })  
                
                }


            }
         }//if functions



         if(siteKey == "functions2"){
            for (v in siteVal) {
                console.log("v: ", v)
                console.log("siteVal: ", siteVal)
        
               let funcName = v//siteVal[v].name;
               //var mName = methods[m].name;
               var mEndpoint = siteVal[v].query;
               var mParams = siteVal[v].params;
               var mObject = siteVal[v].result;
               var mParamList="";
        
            //    console.log("mEndpoint: ", mEndpoint)
            //    console.log("mParams: ", mParams)
            //    console.log("siteVal: ", siteVal)
        
               var properties=[], fields=[];
               firebase.database().ref('/abstractions/'+site+'/objects/'+mObject+'/properties').once('value').then(function(snapshot) {
                   snapshot.forEach(function(childSnapshot) { 
                       properties.push(childSnapshot.val())
                   })
               })
        
               window[site][funcName] = function(...mArgs) { return siteFunction(...mArgs) }; 
               
               function siteFunction(...mArgs) { 
                   if(mArgs.length>0){
                       if(mParams){
                           for(var p=0; p<mParams.length; ++p){
                                   mParamList+=mParams[p]//`${key}`
                                   mParamList+="="
                                   mParamList+=mArgs[p]//THIS ASSUMES THAT id value will be sent
                               if(p+1<mParams.length){
                                   mParamList+="&" 
                               }
                           }
                       }
                   }else{
                       // console.log("methods[m]:2 ", ob.imageId)
                       // let elemIndexM = properties.findIndex(element => element.field == methods[m].params[0])
                       // let endpointM = properties[elemIndexM].property;
                       // console.log("HERE: ", ob[endpointM])
                       mParamList+=mParams[0]
                       mParamList+="="
                       mParamList+=ob[mParams[0]]
                   }
        
                   for(f in properties){
                       if(properties[f].field != undefined){
                           fields.push(properties[f].property)
                       }
                   }
        
                   console.log("mParamList: ", mParamList)
                   return firebase.database().ref('/apis/'+mEndpoint).once('value').then(function(snapshot) {
                   obJSON = snapshot.val();
                   //console.log(obJSON)
               
                   if(obJSON.oauth2){
                       console.log("oauth2")
        
                       var tokenPromise;
                       var sTokens = JSON.parse(localStorage.getItem('tokens'));
                       console.log(sTokens)
                       const elementsIndex = sTokens.findIndex(element => element.site == site)
                       console.log("sTokens[elementsIndex]: ", sTokens[elementsIndex].token)
                       if(sTokens[elementsIndex].token!=""){
                                   tokenPromise= new Promise((resolve, reject) => {resolve(sTokens[elementsIndex].token)})
                                   .then(token=>{ 
                                       return new Promise((resolve, reject) => {
                                           console.log("Token: ",token)
                                           $.ajax({
                                               url: token_url,
                                               method: "POST",
                                               data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                               success: function(response) {
                                                   console.log("response: ",response);
                                                   tok = response.access_token;
                                                   expires_in = response.expires_in;
                                                   console.log("tok: ", tok)
                                                   console.log("expires_in: ", expires_in)
                                                   // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                   // console.log("tokens: ", localStorage.getItem('tokens'));
                                                   //const elementsIndex = this.sTokens.findIndex(element => element.site == site)
                                                   let newArray = [...sTokens]
                                                   newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                   newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                   // this.setState({newArray});
        
                                                   localStorage.setItem('tokens', JSON.stringify(newArray));
                                                   console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
        
                                                   resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                               },
                                               error: function(response, jqXHR, textStatus, errorThrown) {
                                                   console.log("error: ",response);
                                               }
                                           })
                                       })
                                   })
                               }else{
                                   tokenPromise= new Promise((resolve, reject) => {
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
                                           console.log("Token: ",token)
                                           $.ajax({
                                               url: token_url,
                                               method: "POST",
                                               data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                               success: function(response) {
                                                   console.log("response: ",response);
                                                   tok = response.access_token;
                                                   expires_in = response.expires_in;
                                                   console.log("tok: ", tok)
                                                   console.log("expires_in: ", expires_in)
                                                   // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                   // console.log("tokens: ", localStorage.getItem('tokens'));
                                                   let newArray = [...sTokens]
                                                   newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                   newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                   // this.setState({newArray});
        
                                                   localStorage.setItem('tokens', JSON.stringify(newArray));
                                                   console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
        
        
                                                   resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                               },
                                               error: function(response, jqXHR, textStatus, errorThrown) {
                                                   console.log("error: ",response);
                                               }
                                           })
                                       })
                                   })
                               }
           
                       return tokenPromise
        
        
                   }else{ //no oauth
                       console.log("!!!oauth2")
                       result =  'http://localhost:5000/api/'+mEndpoint+'?'+mParamList
                       return result;
                   }
        
                   })//firebase
                   .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url).then(response => response.json() )) })   })
                   .then(o => {
                       console.log("o: ", o)
                       console.log("properties!!! ", properties)
        
                       //map response to class properties                
                       if(o.constructor === Array){
                           console.log("ARRAY");
                           o.forEach(function(ob) {
                               for(p in properties){
                                   if(properties[p].field){// it won't check type properties (e.g. comment for VideoObject)
                                       if (properties[p].property != properties[p].field && ob[properties[p].field]) {
                                           Object.defineProperty(ob, properties[p].property, Object.getOwnPropertyDescriptor(ob, properties[p].field));
                                           delete ob[properties[p].field];
                                       }
                                   }else{ //if the property is a type
                                       let propType = properties[p].property;
                                       let typeName = properties[p].type;
        
                                       Object.defineProperty(ob, propType, { 
                                           get: function() { 
                                               let promise = firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                                   console.log("typeOb2: ", snapshot.val())
                                                //    return self(snapshot.val(), type, propType, ob[typeId]);
                                                   return self(snapshot.key, snapshot.val(), currentType, propType, ob[typeId]);
                                               });
                                               return promise;
                                           }
                                       });//end of getter
        
                                   }
                               }
                          
                               //***************************** GETTERS *********************************/
        
        
                               //***************************** SETTERS *********************************/
                               // if(setters){
                               // for(s in setters){
                               //     // console.log("setter: ", setters[s])   
                               //     var field = setters[s].field; //API endpoint field to be set
                               //     var prop;
                               //     var setEndpoint =  setters[s].endpoint;
                               //     var setParams = setters[s].params;
                               //     var idd = setters[s].id;
                               //     //get the schema.org property mapped to this field
                               //     for(f in properties){
                               //         if(properties[f].field == field){
                               //             prop = properties[f].property;
                               //         }
                               //     }
        
                               //     Object.defineProperty(ob, prop, { 
                               //         set: function(newValue) { 
                               //             console.log("newValue: ", newValue)
                               //             this.pro = firebase.database().ref('/apis/'+setEndpoint).once('value').then(function(snapshot) {
                               //             obJSON = snapshot.val();
                               //             console.log(obJSON)
                               //             if(obJSON.oauth2){
                               //                 console.log("oauth2")
                               //                 return new Promise((resolve, reject) => {
                               //                         console.log("auth function");
                               //                         auth_url= obJSON.oauth2[0].authURL;
                               //                         token_url= obJSON.oauth2[0].tokenURL;
                               //                         redirect_url= obJSON.oauth2[0].callbackURL;
                               //                         client_id= obJSON.oauth2[0].clientId;
                               //                         client_secret= obJSON.oauth2[0].clientSec;
                               //                         response_type= obJSON.oauth2[0].resType;
                               //                         scope= obJSON.oauth2[0].scope;
                               //                         grant_type= obJSON.oauth2[0].grantType;
                               //                         client_auth= obJSON.oauth2[0].clientAuth;
                                                           
                               //                         var win = window.open(auth_url+"?response_type="+JSON.parse(JSON.stringify(response_type))+"&scope="+JSON.parse(JSON.stringify(scope))+"&client_id="+JSON.parse(JSON.stringify(client_id))+"&redirect_uri="+JSON.parse(JSON.stringify(redirect_url))+"", "windowname1", 'width=800, height=600');
                               //                         var pollTimer = window.setInterval(function() {
                               //                             try {
                               //                                 console.log("url here: ", win.document.URL); //here url
                               //                                 if (win.document.URL.indexOf(redirect_url) != -1) {
                               //                                     window.clearInterval(pollTimer);
                               //                                     var url =   win.document.URL;
                               //                                     acToken =   gup(url, 'code');
                               //                                     resolve(acToken)
                               //                                     // tokenType = gup(url, 'token_type');
                               //                                     // expiresIn = gup(url, 'expires_in');
                               //                                     win.close();
                               //                                     // return validateToken(acToken)
                               //                                 }
                               //                             } catch(e) {
                               //                                 console.log("error in oauth")
                               //                             }
                               //                         }, 200);
                           
                               //                         function gup(url, name) {
                               //                             name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
                               //                             var regexS = "[\?&]"+name+"=([^&#]*)";
                               //                             var regex = new RegExp( regexS );
                               //                             var results = regex.exec( url );
                               //                             if( results == null )
                               //                                 return "";
                               //                             else
                               //                                 return results[1];
                               //                         }//end of gup()
                                                       
                               //                     })
                               //                     .then(token=>{ 
                               //                         return new Promise((resolve, reject) => {
                               //                         console.log("Token: ",token)
                               //                         console.log("Token URL: ",token_url)
                               //                         $.ajax({
                               //                             url: token_url,
                               //                             method: "POST",
                               //                             data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                               //                             success: function(response) {
                               //                                 console.log("response: ",response);
                               //                                 //important to check access token and token type (e.g. bearer)
                               //                                 tok = response.access_token;
                               //                                 console.log("tok: ", tok)
                               //                                 resolve('http://localhost:5000/api/'+setEndpoint+'?tokenAPI='+tok+'&'+field+'='+newValue+'&'+idd+'='+idValue)
                               //                             },
                               //                             error: function(response, jqXHR, textStatus, errorThrown) {
                               //                                 console.log("error: ",response);
                               //                             }
                               //                         })
                               //                     })
                               //                     // return something
                               //                     })
                           
                               //             }else{ //no oauth
                               //                 console.log("!!!oauth2")
                               //                 result =  'http://localhost:5000/api/'+setEndpoint+'?'+paramList+'&'+pro+'='+newValue+'&id='+identifier
                               //                 //console.log("result: ",result);
                               //                 return result;
                               //             }
               
                               //         })//firebase
                               //         .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url)) })   })
                                           
                               //         }
                               //     });
                               // }}
        
                               //***************************** METHODS *********************************/
                               for(m in methods){
                                   var mName = methods[m].name;
                                   var mEndpoint = methods[m].endpoint;
                                   var mParams = methods[m].params;
        
                                   // add the imageId
                                   Object.defineProperty(ob, mName.toString(), { value: function(...mArgs) { 
                                       if(mArgs.length>0){
                                           if(mParams){
                                               for(var p=0; p<mParams.length; ++p){
                                                   //Object.entries(mParams[p]).forEach(([key, value]) => {
                                                       mParamList+=mParams[p]//`${key}`
                                                       mParamList+="="
                                                       mParamList+=mArgs[p]//THIS ASSUMES THAT id value will be sent
                                                   // });
                                                   if(p+1<mParams.length){
                                                       mParamList+="&" 
                                                   }
                                               }
                                           }
                                       }else{
                                           // console.log("methods[m]:2 ", ob.imageId)
                                           // let elemIndexM = properties.findIndex(element => element.field == methods[m].params[0])
                                           // let endpointM = properties[elemIndexM].property;
                                           // console.log("HERE: ", ob[endpointM])
                                           mParamList+=mParams[0]
                                           mParamList+="="
                                           mParamList+=ob[mParams[0]]
                                       }
        
                                       console.log("mParamList: ", mParamList)
                                       return firebase.database().ref('/apis/'+mEndpoint).once('value').then(function(snapshot) {
                                       obJSON = snapshot.val();
                                       //console.log(obJSON)
                                   
                                       if(obJSON.oauth2){
                                           console.log("oauth2")
           
                                           var tokenPromise;
                                           var sTokens = JSON.parse(localStorage.getItem('tokens'));
                                           console.log(sTokens)
                                           const elementsIndex = sTokens.findIndex(element => element.site == site)
                                           console.log("sTokens[elementsIndex]: ", sTokens[elementsIndex].token)
                                           if(sTokens[elementsIndex].token!=""){
                                                       tokenPromise= new Promise((resolve, reject) => {resolve(sTokens[elementsIndex].token)})
                                                       .then(token=>{ 
                                                           return new Promise((resolve, reject) => {
                                                               console.log("Token: ",token)
                                                               $.ajax({
                                                                   url: token_url,
                                                                   method: "POST",
                                                                   data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                                   success: function(response) {
                                                                       console.log("response: ",response);
                                                                       tok = response.access_token;
                                                                       expires_in = response.expires_in;
                                                                       console.log("tok: ", tok)
                                                                       console.log("expires_in: ", expires_in)
                                                                       // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                                       // console.log("tokens: ", localStorage.getItem('tokens'));
                                                                       //const elementsIndex = this.sTokens.findIndex(element => element.site == site)
                                                                       let newArray = [...sTokens]
                                                                       newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                                       newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                                       // this.setState({newArray});
        
                                                                       localStorage.setItem('tokens', JSON.stringify(newArray));
                                                                       console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
                   
                                                                       resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                                   },
                                                                   error: function(response, jqXHR, textStatus, errorThrown) {
                                                                       console.log("error: ",response);
                                                                   }
                                                               })
                                                           })
                                                       })
                                                   }else{
                                                       tokenPromise= new Promise((resolve, reject) => {
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
                                                               console.log("Token: ",token)
                                                               $.ajax({
                                                                   url: token_url,
                                                                   method: "POST",
                                                                   data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                                   success: function(response) {
                                                                       console.log("response: ",response);
                                                                       tok = response.access_token;
                                                                       expires_in = response.expires_in;
                                                                       console.log("tok: ", tok)
                                                                       console.log("expires_in: ", expires_in)
                                                                       // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                                       // console.log("tokens: ", localStorage.getItem('tokens'));
                                                                       let newArray = [...sTokens]
                                                                       newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                                       newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                                       // this.setState({newArray});
        
                                                                       localStorage.setItem('tokens', JSON.stringify(newArray));
                                                                       console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
                   
                   
                                                                       resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                                   },
                                                                   error: function(response, jqXHR, textStatus, errorThrown) {
                                                                       console.log("error: ",response);
                                                                   }
                                                               })
                                                           })
                                                       })
                                                   }
                               
                                           return tokenPromise
        
                       
                                       }else{ //no oauth
                                           console.log("!!!oauth2")
                                           result =  'http://localhost:5000/api/'+mEndpoint+'?'+mParamList
                                           return result;
                                       }
           
                                       })//firebase
                                       .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url).then(response => response.json() )) })   })
                                   }
                                   });
                               //   });
        
                               }//loop to create methods
                                   
                           });//loop over array of objects
        
        
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
                                   if (properties[p].property != properties[p].field && o[properties[p].field]) {
                                       Object.defineProperty(o, properties[p].property,Object.getOwnPropertyDescriptor(o, properties[p].field));
                                       delete o[properties[p].field];
                                   }
                               }else{ //if the property is a type
                                   let propType = properties[p].property;
                                   let typeName = properties[p].type;

                                   // creat a getter for property of type Type
                                   this.status = {};
                                   Object.defineProperty(o, propType, { 
                                       get: function() { 
                                           let promise = firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                               console.log("typeOb3: ", snapshot.val())
                                               // return self(snapshot.val(), type, propType, o[typeId]);
                                               return self(snapshot.key, snapshot.val(), currentType, propType, o[typeId]);
                                           });
                                           return promise;
                                       }
                                   });
                               }
                           }//end of for loop properties
        
                           //***************************** GETTERS *********************************/
        
        
                           //***************************** SETTERS *********************************/
                           for(s in setters){
                               // console.log("setter: ", setters[s])   
                               var field = setters[s].field; //API endpoint field to be set
                               var prop;
                               var setEndpoint =  setters[s].endpoint;
                               var setParams = setters[s].params;
                               var idd = setters[s].id;
                               //get the schema.org property mapped to this field
                               for(f in properties){
                                   if(properties[f].field == field){
                                       prop = properties[f].property;
                                   }
                               }
        
                               Object.defineProperty(o, prop, { 
                                   set: function(newValue) { 
                                       console.log("newValue: ", newValue)
                                       this.pro = firebase.database().ref('/apis/'+setEndpoint).once('value').then(function(snapshot) {
                                       obJSON = snapshot.val();
                                       console.log(obJSON)
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
                                                           resolve('http://localhost:5000/api/'+setEndpoint+'?tokenAPI='+tok+'&'+field+'='+newValue+'&'+idd+'='+idValue)
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
                                           result =  'http://localhost:5000/api/'+setEndpoint+'?'+paramList+'&'+pro+'='+newValue+'&id='+identifier
                                           //console.log("result: ",result);
                                           return result;
                                       }
           
                                   })//firebase
                                   .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url)) })   })
                                       
                                   }
                               });
                           }
        
                           //***************************** METHODS *********************************/
                           for(m in methods){
                            //    console.log("methods[m]: ", methods[m].name)
                               var mName = methods[m].name;
                               var mEndpoint = methods[m].endpoint;
                               var mParams = methods[m].params;
        
                               Object.defineProperty(o, mName.toString(), { value: function(...mArgs) { 
                                   if(mParams){
                                       for(var p=0; p<mParams.length; ++p){
                                           //Object.entries(mParams[p]).forEach(([key, value]) => {
                                               mParamList+=mParams[p]//`${key}`
                                               mParamList+="="
                                               mParamList+=mArgs[p]
                                           // });
                                           if(p+1<mParams.length){
                                               mParamList+="&" 
                                           }
                                       }
                                   }
                                   console.log("mParamList: ", mParamList)
                                   return firebase.database().ref('/apis/'+mEndpoint).once('value').then(function(snapshot) {
                                   obJSON = snapshot.val();
                                   console.log(obJSON)
                               
                                   if(obJSON.oauth2){
                                       console.log("oauth2")
          
                                       var tokenPromise;
                                       var sTokens = JSON.parse(localStorage.getItem('tokens'));
                                       console.log(sTokens)
                                       const elementsIndex = sTokens.findIndex(element => element.site == site)
                                       console.log("sTokens[elementsIndex]: ", sTokens[elementsIndex].token)
                                       if(sTokens[elementsIndex].token!=""){
                                                   tokenPromise= new Promise((resolve, reject) => {resolve(sTokens[elementsIndex].token)})
                                                   .then(token=>{ 
                                                       return new Promise((resolve, reject) => {
                                                           console.log("Token: ",token)
                                                           $.ajax({
                                                               url: token_url,
                                                               method: "POST",
                                                               data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                               success: function(response) {
                                                                   console.log("response: ",response);
                                                                   tok = response.access_token;
                                                                   expires_in = response.expires_in;
                                                                   console.log("tok: ", tok)
                                                                   console.log("expires_in: ", expires_in)
                                                                   // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                                   // console.log("tokens: ", localStorage.getItem('tokens'));
                                                                   //const elementsIndex = this.sTokens.findIndex(element => element.site == site)
                                                                   let newArray = [...sTokens]
                                                                   newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                                   newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                                   // this.setState({newArray});
        
                                                                   localStorage.setItem('tokens', JSON.stringify(newArray));
                                                                   console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
               
                                                                   resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                               },
                                                               error: function(response, jqXHR, textStatus, errorThrown) {
                                                                   console.log("error: ",response);
                                                               }
                                                           })
                                                       })
                                                   })
                                               }else{
                                                   tokenPromise= new Promise((resolve, reject) => {
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
                                                           console.log("Token: ",token)
                                                           $.ajax({
                                                               url: token_url,
                                                               method: "POST",
                                                               data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
                                                               success: function(response) {
                                                                   console.log("response: ",response);
                                                                   tok = response.access_token;
                                                                   expires_in = response.expires_in;
                                                                   console.log("tok: ", tok)
                                                                   console.log("expires_in: ", expires_in)
                                                                   // localStorage.setItem('tokens', JSON.stringify(sitesToken));
                                                                   // console.log("tokens: ", localStorage.getItem('tokens'));
                                                                   let newArray = [...sTokens]
                                                                   newArray[elementsIndex] = {...newArray[elementsIndex], token: tok}
                                                                   newArray[elementsIndex] = {...newArray[elementsIndex], expires_in: expires_in}
                                                                   // this.setState({newArray});
        
                                                                   localStorage.setItem('tokens', JSON.stringify(newArray));
                                                                   console.log("NEW LOCAL STORGAE: ", localStorage.getItem('tokens'))
               
               
                                                                   resolve('http://localhost:5000/api/'+mEndpoint+'?tokenAPI='+tok+'&'+mParamList)
                                                               },
                                                               error: function(response, jqXHR, textStatus, errorThrown) {
                                                                   console.log("error: ",response);
                                                               }
                                                           })
                                                       })
                                                   })
                                               }
                              
                                       return tokenPromise
        
                   
                                   }else{ //no oauth
                                       console.log("!!!oauth2")
                                       result =  'http://localhost:5000/api/'+mEndpoint+'?'+mParamList
                                       return result;
                                   }
        
                                   })//firebase
                                   .then(url => { console.log("url: ", url); return new Promise(function(resolve, reject) {resolve(fetch(url).then(response => response.json() )) })   })
                               }
                               });
                           //   });
        
                           }//loop to create methods
        
                           //remove the fields that are not in the class
                           var keys = Object.keys(o)
                           for(k in keys){
                               if(!fields.includes(keys[k])){
                                   delete o[keys[k]];
                               }
                           }
                       }//end of else of no array
        
                       return o;
                   })  
               
               }
        
        
           }
        }//if functions2

        });
    });
   }//if not youtube
  })


});


function combine(...args){
    var arr=[];
    if(Array.isArray(args[0])){ // if arrays
        console.log("Combine ARRAYS: ", [].concat.apply(...args));    
    }else{ //if objects
        for(var i=0; i<args.length; ++i){
            console.log(args[i])
            arr.push(args[i])
        }
        console.log("Combine OBJECTS: ", arr); 
    }
}

    setTimeout(() => { 
        
        (async function(){
            // var product = await etsy.Product("679481230")
            // console.log("etsy product: ", product)
            
            var user = await etsy.Person("54550541")
            console.log("etsy user: ", user)
             var userShops = await user.shops;
             console.log("etsy user's shops: ", userShops)
             console.log("etsy user's shops' listings: ", await userShops.listing)

            //var user2 = await etsy.Person("ELARBOLDECEREZO")
            //console.log("etsy user2: ", user2)

            // var etsyUsers = combine(user, user2)
            // var etsyUsers2 = combine([1,2], [3,4,5])

            // var user = await unsplash.Person("fu_psi");
            // console.log("unsplash user: ", user)
            // console.log("unsplash search: ", await unsplash.searchPhotos("Flowers","","","","",""))

            //var fImages =  await unsplash.searchPhotos("Flowers","","","","","")
            // var rImages =  await unsplash.searchPhotos("Roses","","","","","")

            //console.log("Flowers photos: ", fImages)
            // console.log("Roses photos: ", rImages)

            // var dailymotionVideos = await dailymotion.SearchActions("cats")
            
            // var dailymotionVideos = await dailymotion.VideoObject("x7xf8kc")
            // console.log("dailymotionVideos: ", dailymotionVideos)

            // var youtubeVideos  = await youtube.VideoObject("bUUBdcUGgA8")
            // console.log("youtubeVideos: ", youtubeVideos)


            // console.log("unsplash search: ", await unsplash.searchPhotos("Flowers","","","","",""))


            // console.log("unsplash search: ", await unsplash.searchPhotos("Flowers","","","","",""))

            // var userImages = await user.image
            // userImages[0].likePhoto()
            // console.log("unsplash user liked photos: ", await user.likedImage)
            // console.log("unsplash user collections: ", await user.collection)

            // var playlist = await MusicPlaylist("x6xvoa"); //method to get an exisiting playlist
            // // var playlist2 = MusicPlaylist.create("Auto NEW Playlist"); //method to create a new playlist
            // console.log("playlist: ", playlist)
            // console.log("playlist name: ", playlist.name)
            // var playlistVideos = await playlist.video
            // console.log("playlist videos: ", playlistVideos)
            // console.log("playlist videos: ", playlistVideos[0].name)

            //********* getters
            // playlist.name 
            // playlist.creator
            // playlist.video

            //********* setters
            // playlist.name= "Adele's NEW2 Music"
            // console.log("playlist name after: ", playlist.name)

            //********* methods
            //console.log("playlist remove video: ", await playlist.removePlaylist('x6xx33'))
        })()


        // var youtube = Website("youtube");
        // console.log("y: ", youtube)
        // console.log("yv: ", youtube.VideoObject)

        // (async function(){
        // })()
        // var playlist = MusicPlaylist("Fun Music", "Tarfah", "PL55713C70BA91BD6E");
        // console.log("Object: ", playlist);

        // (async function(){
        //     // var video =   await VideoObject("xQOO2xGQ1Pc")
        //     // console.log("video await: ", video)
        //     var video =   await VideoObject("xQOO2xGQ1Pc")
        //     console.log("video await: ", video)
        //     console.log("comment await: ", await video.comment)
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

    }, 8000);  
   


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