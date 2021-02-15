// $(document).ready(function (e) {

function shapir(){

    var config = {
        apiKey: "AIzaSyBaJakjjAHw0wvBtELAtDLPmhq1piGWwqQ", //youtube API key
        authDomain: "superapi-52bc2.firebaseapp.com",
        databaseURL: "https://superapi-52bc2.firebaseio.com",
        projectId: "superapi-52bc2",
        storageBucket: "superapi-52bc2.appspot.com",
        messagingSenderId: "859121565515"
    };
    
    firebase.initializeApp(config);

    var result, obJSON, auth_url, token_url, redirect_url, client_id, client_secret, response_type, scope, grant_type, client_auth, tok, expires_in, properties = [], methods = [], sitesToken=[]; currentType="", results = [];
    
    // firebase.database().ref('/abstractions/').once('value').then(function(snapshot) {
    //     snapshot.forEach(function(childSnapshot) { 

    //         var siteOAuthObj={
    //             site: childSnapshot.key,
    //             token:"",
    //             expires_in:""
    //         }
    //         sitesToken.push(siteOAuthObj)
    //     })
    //     localStorage.setItem('tokens', JSON.stringify(sitesToken));

    // })


    return firebase.database().ref('/abstractions').once('value').then(snapshot=> {
        snapshot.forEach( childSnapshot=> { 
            // console.log("key sites: ", childSnapshot.key)

            if(childSnapshot.key!= "youtube"){
                var site = childSnapshot.key;    
                window[site] = {} //initilize function

                var promise = firebase.database().ref('/abstractions/'+site).once('value').then(function(snapshot) {
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
                        
                        // results.push(window[site][type])
                        
                        function self (typekey, typeOb, caller, prop, ...args) { 
                            // console.log("typeOb:", typeOb)
                            // console.log("caller:", caller)
                            console.log("callerTYPE:", typekey)
                            console.log("typeId: ", typeOb.id)
                            console.log("args: ", args)

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
                            var typeId = typeOb.id;
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
                                            Object.defineProperty(ob, mName.toString(), { value: function(mArgs) { 
                                                // var paramLen = Object.entries(mArgs).length;
                                                // // console.log("paramLen: ", paramLen)

                                                // for (const [key, value] of Object.entries(mArgs)) {
                                                //     --paramLen
                                                //     console.log(`${key}: ${value}`);
                                                //     mParamList+= key
                                                //     mParamList+="="
                                                //     mParamList+= value
                                                //     if(paramLen>0){
                                                //         mParamList+="&" 
                                                //     }
                                                // }

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
                                            console.log("typeId: ", typeId);
                                            console.log("o[typeId]1: ", o[typeId])
                                            var idVal = o[typeId];

                                            // creat a getter for property of type Type
                                            Object.defineProperty(o, propType, { 
                                                get: function() { 
                                                    let promise = firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                                        console.log("typeOb1: ", snapshot.val())
                                                        console.log("o[typeId]2: ", idVal)
                                                        return self(snapshot.key, snapshot.val(), currentType, propType, idVal);
                                                    });
                                                    return promise;
                                                }
                                            });

                                            //*** if you want to remove the getter, replce iti with this 
                                            // o[propType]= function(){return ""};                               
                                            // (async function(){
                                            //     o[propType] = await firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                            //         console.log("typeOb1: ", snapshot.val())
                                            //         return self(snapshot.key, snapshot.val(), currentType, propType, o[typeId]);
                                            //     });
                                            //     return o;
                                            // })()
            
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
                                        // var mParams = methods[m].params;
                
                                        Object.defineProperty(o, mName.toString(), { value: function(mArgs) { 
                                            // if(mParams){
                                            //     for(var p=0; p<mParams.length; ++p){
                                            //         //Object.entries(mParams[p]).forEach(([key, value]) => {
                                            //             mParamList+=mParams[p]//`${key}`
                                            //             mParamList+="="
                                            //             mParamList+=mArgs[p]
                                            //         // });
                                            //         if(p+1<mParams.length){
                                            //             mParamList+="&" 
                                            //         }
                                            //     }
                                            // }

                                            var paramLen = Object.entries(mArgs).length;
                                            // console.log("paramLen: ", paramLen)

                                            for (const [key, value] of Object.entries(mArgs)) {
                                                --paramLen
                                                console.log(`${key}: ${value}`);
                                                mParamList+= key
                                                mParamList+="="
                                                mParamList+= value
                                                if(paramLen>0){
                                                    mParamList+="&" 
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
                        };//end of self function

                    }
                    }//if objects

                    if(siteKey == "functions"){
                        for (v in siteVal) {
                            let funcName = siteVal[v].name;
                            //var mName = methods[m].name;
                            let mEndpoint = siteVal[v].endpoint;
                            // let mParams = siteVal[v].params;
                            let mObject = siteVal[v].object;
                            let mParamList="";
                            let mID = siteVal[v].id;

                            var properties=[], fields=[];
                            firebase.database().ref('/abstractions/'+site+'/objects/'+mObject+'/properties').once('value').then(function(snapshot) {
                                snapshot.forEach(function(childSnapshot) { 
                                    properties.push(childSnapshot.val())
                                })
                            })

                            window[site][funcName] = function(...mArgs) { return siteFunction(...mArgs) }; 
                            
                            function siteFunction(mArgs) { 
                                console.log("siet: ", site)
                                // console.log("mArgs TOP: ", JSON.stringify(mArgs))

                                var paramLen = Object.entries(mArgs).length;
                                // console.log("paramLen: ", paramLen)

                                for (const [key, value] of Object.entries(mArgs)) {
                                    --paramLen
                                    console.log(`${key}: ${value}`);
                                    mParamList+= key
                                    mParamList+="="
                                    mParamList+= value
                                    if(paramLen>0){
                                        mParamList+="&" 
                                    }
                                }
                                //   console.log("mParamList: ", mParamList)
                                // if(mArgs.length>0){
                                //     if(mParams){
                                //         for(var p=0; p<Object.entries(mArgs).length; ++p){
                                //                 mParamList+=mParams[p]//`${key}`
                                //                 mParamList+="="
                                //                 mParamList+=mArgs[p]//THIS ASSUMES THAT id value will be sent
                                //             if(p+1<mParams.length){
                                //                 mParamList+="&" 
                                //             }
                                //         }
                                //     }
                                // }else{
                                //     // console.log("methods[m]:2 ", ob.imageId)
                                //     // let elemIndexM = properties.findIndex(element => element.field == methods[m].params[0])
                                //     // let endpointM = properties[elemIndexM].property;
                                //     // console.log("HERE: ", ob[endpointM])
                                //     mParamList+=mParams[0]
                                //     mParamList+="="
                                //     mParamList+=ob[mParams[0]]
                                // }

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
                                                    let idVal = ob[mID]
                                                    // console.log("typeIdFun1: ", mID)
                                                    // console.log("ob[typeId]Fun1: ", ob[mID])
                
                                                    Object.defineProperty(ob, propType, { 
                                                        get: function() { 
                                                            let promise = firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                                                console.log("typeOb2: ", snapshot.val())
                                                                // return self(snapshot.val(), type, propType, ob[typeId]);
                                                                return self(snapshot.key, snapshot.val(), mObject, propType, idVal);

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
                                                let idVal = ob[mID]
                                                console.log("typeIdFun2: ", mID)
                                                console.log("ob[typeId]Fun2: ", ob[mID])

                                                // creat a getter for property of type Type
                                                this.status = {};
                                                Object.defineProperty(o, propType, { 
                                                    enumerable: true,
                                                    get: function() { 
                                                        let promise = firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                                            console.log("typeOb3: ", snapshot.val())
                                                            // return self(snapshot.val(), type, propType, o[typeId]);
                                                            return self(snapshot.key, snapshot.val(), mObject, propType, idVal);
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


                            function self (typekey, typeOb, caller, prop, ...args) { 
                                // console.log("typeOb:", typeOb)
                                // console.log("caller:", caller)
                                console.log("callerTYPE:", typekey)
                                console.log("typeId: ", typeOb.id)
                                console.log("args: ", args)
                
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
                                var typeId = typeOb.id;
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
                                                console.log("typeId: ", typeId);
                                                console.log("o[typeId]1: ", o[typeId])
                                                var idVal = o[typeId];
                
                                                // creat a getter for property of type Type
                                                Object.defineProperty(o, propType, { 
                                                    get: function() { 
                                                        let promise = firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                                            console.log("typeOb1: ", snapshot.val())
                                                            console.log("o[typeId]2: ", idVal)
                                                            return self(snapshot.key, snapshot.val(), currentType, propType, idVal);
                                                        });
                                                        return promise;
                                                    }
                                                });
                
                                                //*** if you want to remove the getter, replce iti with this 
                                                // o[propType]= function(){return ""};                               
                                                // (async function(){
                                                //     o[propType] = await firebase.database().ref('/abstractions/'+site+'/objects/'+typeName).once('value').then(function(snapshot) {
                                                //         console.log("typeOb1: ", snapshot.val())
                                                //         return self(snapshot.key, snapshot.val(), currentType, propType, o[typeId]);
                                                //     });
                                                //     return o;
                                                // })()
                
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
                    
                                            Object.defineProperty(o, mName.toString(), { value: function(mArgs) { 

                                                var paramLen = Object.entries(mArgs).length;
                                                // console.log("paramLen: ", paramLen)

                                                for (const [key, value] of Object.entries(mArgs)) {
                                                    --paramLen
                                                    console.log(`${key}: ${value}`);
                                                    mParamList+= key
                                                    mParamList+="="
                                                    mParamList+= value
                                                    if(paramLen>0){
                                                        mParamList+="&" 
                                                    }
                                                }
                                            
                                                // if(mParams){
                                                //     for(var p=0; p<mParams.length; ++p){
                                                //         //Object.entries(mParams[p]).forEach(([key, value]) => {
                                                //             mParamList+=mParams[p]//`${key}`
                                                //             mParamList+="="
                                                //             mParamList+=mArgs[p]
                                                //         // });
                                                //         if(p+1<mParams.length){
                                                //             mParamList+="&" 
                                                //         }
                                                //     }
                                                // }
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
                    }//if functions

                    });

                });
            }//if not youtube

            results.push(promise);

        })// end of snapshot.forEach

        return Promise.all(results);

    }) //end of then(snapshot



// function combine(...args){
//     var arr=[];
//     if(Array.isArray(args[0])){ // if arrays
//         console.log("Combine ARRAYS: ", [].concat.apply(...args));    
//     }else{ //if objects
//         for(var i=0; i<args.length; ++i){
//             console.log(args[i])
//             arr.push(args[i])
//         }
//         console.log("Combine OBJECTS: ", arr); 
//     }
// }

    // setTimeout(() => { 
        
        // (async function(){
            // var venues= await songkick.searchVenues("Music") //{"q": "game", "city":"NYC"}
            // var venues= await seatgeek.searchVenues({"q": "game", "city":"New York"});

            // var venues = await seatgeek.searchVenues("Music"); //songkick.EventVenue("34514")
            // console.log("venue: ", venues)
            // console.log("venue events: ", await venues.event)

            // var product = await etsy.Product("679481230")
            // console.log("etsy product: ", product)
            
            // var user = await etsy.Person("54550541")
            // console.log("etsy user: ", user)
            //  var userShops = await user.shops;
            //  console.log("etsy user's shops: ", userShops)
            //  console.log("etsy user's shops' listings: ", await userShops.listing)

            //var user2 = await etsy.Person("ELARBOLDECEREZO")
            //console.log("etsy user2: ", user2)

            // var etsyUsers = combine(user, user2)
            // var etsyUsers2 = combine([1,2], [3,4,5])

            // var user = await unsplash.Person("fu_psi");
            // console.log("unsplash user: ", user)
            // var images = await user.image;
            // console.log("unsplash user's images: ", images)
            // images[0].like();


            // console.log("unsplash search: ", await unsplash.searchPhotos("Flowers","","","","",""))

            //var fImages =  await unsplash.searchPhotos("Flowers","","","","","")
            // var rImages =  await unsplash.searchPhotos("Roses","","","","","")

            //console.log("Flowers photos: ", fImages)
            // console.log("Roses photos: ", rImages)

            // var dailymotionVideos = await dailymotion.searchDailymotion("cats")
            // var dailymotionVideos = await dailymotion.VideoObject("x7xf8kc")
            // console.log("dailymotionVideos: ", dailymotionVideos)

            // var youtubeVideos  = await youtube.VideoObject("bUUBdcUGgA8")
            // console.log("youtubeVideos: ", youtubeVideos)
            // console.log("unsplash search: ", await unsplash.Person("fu_psi"))
            // console.log("unsplash search: ", await unsplash.searchPhotos("Flowers","","","","",""))

            // var userImages = await user.image
            // userImages[0].likePhoto()
            // console.log("unsplash user liked photos: ", await user.likedImage)
            // console.log("unsplash user collections: ", await user.collection)

            // var playlist = await dailymotion.MusicPlaylist("x706zx"); //method to get an exisiting playlist
            // console.log("playlist: ", playlist)
            // console.log("playlist name: ", playlist.name)
            // var playlistVideos = await playlist.video
            // console.log("playlist videos: ", playlistVideos)

            // var video = await dailymotion.VideoObject("x7yvk4l"); //method to get an exisiting playlist
            // console.log("video: ", video)
            // console.log("playlist name: ", video.name)
            // var playlistVideos = await playlist.video
            // console.log("playlist videos: ", playlistVideos)

            // video.addToWatchlater()

            // console.log("playlist videos: ", playlistVideos[0].name)
            // // var playlist2 = MusicPlaylist.create("Auto NEW Playlist"); //method to create a new playlist

            //********* getters
            // playlist.name 
            // playlist.creator
            // playlist.video

            //********* setters
            // playlist.name= "Adele's NEW2 Music"
            // console.log("playlist name after: ", playlist.name)

            //********* methods
            //console.log("playlist remove video: ", await playlist.removePlaylist('x6xx33'))
        // })()

    // }, 8000);  
   


}


// });// end of doc


