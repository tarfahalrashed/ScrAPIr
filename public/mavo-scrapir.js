var s = document.createElement("script");
s.src = "scrapir.js";
document.head.appendChild(s); 

var d = document.createElement("script");
d.src = "https://cdn.jsdelivr.net/algoliasearch/3/algoliasearch.min.js";
document.head.appendChild(d); 

var a = document.createElement("script");
a.src = "https://www.gstatic.com/firebasejs/7.1.0/firebase.js";
document.head.appendChild(a); 

var b = document.createElement("script");
b.src = "https://www.gstatic.com/firebasejs/7.1.0/firebase-app.js";
document.head.appendChild(b); 

var c = document.createElement("script");
c.src = "https://www.gstatic.com/firebasejs/7.1.0/firebase-database.js";
document.head.appendChild(c); 

var w = document.createElement("script");
w.src = "woo.js";
document.head.appendChild(w); 

// var data1=[] , tokens= [], token='', token1='', apis_tokens=[], elems, mv_actions_apis=[];

Mavo.Backend.register($.Class({
    // Mandatory. You may instead extend another backend, e.g. Mavo.Backend.Github
    extends: Mavo.Backend,

    id: "scrapir", // an id for your backend

    constructor: function() {
        // Initialization code
        // Already defined by the parent constructor:

        this.permissions.on(["login", "read"]);
        this.attributes = this.mavo.element.attributes
		this.service = this.mavo.element.getAttribute("mv-source-service");
        this.type    = this.mavo.element.getAttribute("mv-source-action");
        this.action  = this.mavo.element.getAttribute("mv-source-action");
        this.params  = this.mavo.element.getAttribute("mv-source-params");
        
        this.source // Raw URL (attribute value)
        this.url // URL object from this.source
        this.mavo // Mavo instance
        this.format // Current format
        // this.permissions.on(["read"]); // Permissions of this particular backend.
        this.permissions.on(["read"]);
        // this.permissions.on(["read", "login"]);

        this.login(true);
    },

    // Low-level functions for reading data. You don’t need to implement this
    // if the mv-storage/mv-source value is a URL and reading the data is just
    // a GET request to that URL.
    get: function(url) {
        // console.log("THIS Serv: ", this.service)
        // console.log("THIS Type: ", this.type)
        // console.log("THIS Act: ", this.action)
        console.log("THIS Par: ", this.attributes['mv-source-params'].value)

        // if(callThis!=""){
        // }else{
        var callThis = this.service+'.'+this.type+'('+JSON.stringify(this.attributes['mv-source-params'].value)+')';
        // }
        console.log("callThis: ", callThis);
        // dailymotion.MusicPlaylist("x706zx") 
        return new Promise(function(resolve, reject) {setTimeout(() => resolve(eval(callThis)), 8000);});

		// var sites = this.source.split('(')[1].split(')')[0];
		// var type  = this.source.split('(')[0];
		// type = type.replace('get', '');
		// console.log("sites: ", sites)
		// console.log("type: ", type)

		// // // Should return a promise that resolves to the data as a string or object
        // return new Promise(function(resolve, reject) {resolve(fetch('https://scrapir.org/multi?sites='+sites+'&type='+type).then(response => response.json())) });
        // var data=""
        // if(localStorage.getItem("token")){
		// 	token1 = localStorage.getItem("token");
		// 	console.log("localStorage Token: ", token1);
		// 	data = scrAPIrCallAPI(token1, 'My Dailymotion Favorites Videos', '', 10);
		// }else{
		// 	this.login();
        // }
        
        // return new Promise(function(resolve, reject) {setTimeout(() => resolve(data), 4000);});

        // (async function(){
       
            // setTimeout(() => {
            //     console.log(unsplash.Person("fu_psi"))
            // }, 2000);

           
            // dailymotion.MusicPlaylist("x706zx")
            // console.log("unsplash user: ", user)
            // console.log("unsplash search: ", await unsplash.searchPhotos("Flowers","","","","","")
    },

    // High level function for reading data. Calls this.get().
    // You rarely need to override this.
    load: function() {
		//Should return a promise that resolves to the data as an object
			return this.ready
				.then(() => this.get())
				.then(response => {
					if (typeof response != "string") {
						// Backend did the parsing, we're done here
						return response;
					}
	
					response = response.replace(/^\ufeff/, ""); // Remove Unicode BOM
			
					return this.format.parse(response);
				});
    },

    // Low-level saving code.
    // serialized: Data serialized according to this.format
    // path: Path to store data
    // o: Arbitrary options
    put: function(serialized, path = this.path, o = {}) {
        // Returns promise
    },

    // If your backend supports uploads, this is mandatory.
    // file: File object to be uploaded
    // path: relative path to store uploads (e.g. "images")
    upload: function(file, path) {
        // Upload code. Should call this.put()
    },

    // High level function for storing data.
    // You rarely need to override this, except to avoid serialization.
    store: function(data, {path, format = this.format} = {}) {
        // Should return a promise that resolves when the data is saved successfully
    },

    // Takes care of authentication. If passive is true, only checks if
    // the user is already logged in, but does not present any login UI.
    // Typically, you’d call this.login(true) in the constructor

    login: function(passive) {
        // Typically, you’d check if a user is already authenticated
        // and return Promise.resolve() if so.

        // Returns promise that resolves when the user has successfully authenticated

		// token = scrAPIrLogin('My Dailymotion Favorites Videos','',10);	
		// setTimeout(function(){
		// 	console.log("ScrAPIr token: ", token);
		// 	localStorage.setItem("tokenAPI", token);
		// 	this.get();	
		// }, 6000);
    },

    // Log current user out
    logout: function() {
        // Returns promise
        return this.oAuthLogout();
    },
    

    static: {
        // Mandatory and very important! This determines when your backend is used.
        // value: The mv-storage/mv-source/mv-init value
        test: function(value) {
            // return this.source.start
            return value.startsWith("scrapir");

            //I should change this to if the value is a function in woo.js
            // return !isValidHttpUrl(value);
            
            // function isValidHttpUrl(string) {
            //     let url;
            //     try {
            //       url = new URL(string);
            //     } catch (_) {
            //       return false;  
            //     }
            //     return url.protocol === "http:" || url.protocol === "https:";
            //   }
            // Returns true if this value applies to this backend
        }
    }
}));


// (function($, $$) {
// 	var _ = Mavo.Backend.register($.Class({
// 		extends: Mavo.Backend,
// 		id: "ScrAPIr",
// 		constructor: function(url, {mavo, format}) {
// 			this.source // Raw URL (attribute value)
// 			this.url // URL object from this.source
// 			this.mavo // Mavo instance
// 			this.format // Current format
// 			// this.permissions // Permissions of this particular backend.
// 			this.permissions.on(["read"]);
// 			//this.key = this.mavo.element.getAttribute("mv-scrapir-key") || "e30bfeb6ad6c4e849a97"//"c27b385721adeda6633b003df4417672f305d3033426b891bfaffed1a73b033c";
// 			//var extension = this.format.constructor.extensions[0] || ".json";
			
// 			//this.info = this.parseSource(this.source);
// 			// this.login(true);
// 		},

// 		get: function() {
// 			// var source1="My Dailymotion Favorites Videos";
// 			// var str="";
// 			// var source1= this.source.split('(')[1].split(')')[0];//.split(', ').join('|');
// 			// if(this.source.includes(',')){
// 			// 	var source= source1.split(', ');//.join('|');
// 			// 	for(var i=0; i<source.length; ++i){
// 			// 		if(mv_actions_apis.indexOf(source[i]) > -1){
// 			// 			str+=source[i]+"?tokenAPI=3fe20be1920689781962f90d3db72c5e";							
// 			// 		}else{
// 			// 			str+=source[i]
// 			// 		}
// 			// 		if(i+1<source.length){
// 			// 			str+="|"
// 			// 		}
// 			// 		console.log("SOURCE: ", str)
// 			// 	}
// 			// }else{
// 			// 	var source= source1;
// 			// 	if(mv_actions_apis.indexOf(source[i]) > -1){
// 			// 		str+=source+"?tokenAPI=3fe20be1920689781962f90d3db72c5e";							
// 			// 	}else{
// 			// 		str+=source;
// 			// 	}

// 			// 	var url = 'https://scrapir.org/api/'+str;

// 			// }
// 			// console.log("URL from mavo-scrapir: ", url);

// 			//console.log("URL from mavo-scrapir: ", url+"?tokenAPI="+localStorage.getItem("tokenAPI"));//'https://scrapir.org/apis/'+source);
			
// 			// fetch('https://scrapir.org/api/'+source1+"?tokenAPI="+localStorage.getItem("tokenAPI"))
// 			// .then((response) => { 
// 			// 	return response.json().then((data) => {
// 			// 		data1= data;
// 			// 		console.log("DATA from Source: ", data);
// 			// 		//return data;
// 			// 	}).catch((err) => {
// 			// 		console.log(err);
// 			// 	}) 
// 			// });

// 			// setTimeout(function(){
// 			// 	console.log("ScrAPIr data: ", data1);
// 			// }, 6000);


// 		//////////////////////////
// 			//GOOD
// 			// if(localStorage.getItem("tokenAPI")){
// 			// 	token = localStorage.getItem("tokenAPI");
// 			// 	//console.log("localStorage Token: ", token);
// 			// 	data = scrAPIrCallAPI(token, 'My Dailymotion Favorites Videos', '', 10);
// 			// }else{
// 			// 	this.login();
// 			// }


// 			// https://scrapir.org/multi?sites=dailymotion,youtube&type=VideoObject

// 			// return Promise.all(fetch('https://scrapir.org/multi')
// 			// 	.then((response) => { 
// 			// 		return response.json().then((data) => {
// 			// 			data1= data;
						
// 			// 		}).catch((err) => {
// 			// 			console.log(err);
// 			// 		}) 
// 			// 	}));


// 			// fetchData = () => {

// 			var urls = ['https://scrapir.org/multi?sites=dailymotion,youtube&type=VideoObject']

// 			const allRequests = urls.map(url => 
// 				fetch(url).then(response => response.json())
// 			);
			
// 			// return Promise.all(allRequests);
// 			// };

// 			// fetchData().then(arrayOfResponses => 
// 			// 	arrayOfResponses
// 			// );

// 			return new Promise(function(resolve, reject) {setTimeout(() => resolve(allRequests), 1000);});

// 		},

// 		load: function() {
// 			console.log("THIS SOURCE: ", this.source)
// 			return this.ready
// 				.then(() => this.get())
// 				.then(response => {
// 					if (typeof response != "string") {
// 						// Backend did the parsing, we're done here
// 						return response;
// 					}
	
// 					response = response.replace(/^\ufeff/, ""); // Remove Unicode BOM
			
// 					return this.format.parse(response);
// 				});
// 		},
	
// 		// load: function() {
// 		// 	// console.log("LOAD Token: ", localStorage.getItem("tokenAPI"));
			
// 		// 	//[1] Check mv-source, all the APIs in retrieve() and if they need oauth
// 		// 	var source1 = this.source.split('(')[1].split(')')[0];//.split(', ').join('|');
// 		// 	if(this.source.includes(',')){
// 		// 		var source= source1.split(', ');//array
// 		// 	}else{
// 		// 		var source= source1;
// 		// 	}

// 		// 	for(var i=0; i<source.length; ++i){
// 		// 		fetch('https://scrapir.org/specs/'+source[i])
// 		// 		.then((response) => { 
// 		// 			return response.json().then((data) => {
// 		// 				data1= data;
// 		// 				if(data.oauth2){
// 		// 					apis_tokens.push({
// 		// 						api:data.title,
// 		// 						apiTokenVar: "token_"+data.title.split(' ').join('')
// 		// 					});
// 		// 					mv_actions_apis.push(actionAPI);
// 		// 					this.permissions.on(["read", "login"]);
// 		// 				}
// 		// 			}).catch((err) => {
// 		// 				console.log(err);
// 		// 			}) 
// 		// 		});
// 		// 	}

// 		// 	//[2] Check mv-action, all the APIs in retrieve() and if they need oauth
// 		// 	var elemBut = document.getElementsByTagName('button');
// 		// 	for (var i=0; i < elemBut.length; i++) {
// 		//  		if(elemBut[i].hasAttribute('mv-action') && (elemBut[i].getAttribute('mv-action').startsWith("remove") || elemBut[i].getAttribute('mv-action').startsWith("insert") || elemBut[i].getAttribute('mv-action').startsWith("update"))){ 
// 		// 			var action = elemBut[i].getAttribute('mv-action')
// 		// 			var n = action.lastIndexOf(", ");
// 		// 			var actionAPI = action.substring(n + 1).split("'").join("").split(")")[0];
// 		// 			apis_tokens.push({
// 		// 				api:actionAPI,
// 		// 				apiTokenVar: "token_"+actionAPI.split(' ').join('')
// 		// 			});
// 		// 			this.permissions.on(["read", "login"]);
// 		// 		}
// 		// 	}


// 		// 	//[3] run load original code
// 		// 	//setTimeout(function(){
// 		// 	//console.log("mv_actions_apis: ", mv_actions_apis)
// 		// 	return this.ready
// 		// 	.then(() => this.get())
// 		// 	.then(response => {
// 		// 		if (typeof response != "string") {
// 		// 			// Backend did the parsing, we're done here
// 		// 			return response;
// 		// 		}

// 		// 		response = response.replace(/^\ufeff/, ""); // Remove Unicode BOM

// 		// 		return this.format.parse(response);
// 		// 	});
// 		// 	//}, 100);
// 		// },
	
// 		// login: function(passive) {
// 		// 	console.log("apis_tokens: ", apis_tokens)

// 		// 	//login
// 		// 	//once they are logged in
// 		// 	// for(var i=0; i<apis_tokens.length; ++i){
// 		// 	// 	//console.log("mv_actions_apis: ", apis_tokens[i]['api']);
// 		// 	// 	//console.log("mv_actions_apis: ", apis_tokens[i]['apiTokenVar']);
// 		// 	// 	token = scrAPIrLogin(apis_tokens[i]['api'],'',10);
// 		// 	// 	setTimeout(function(){
// 		// 	// 		console.log("ScrAPIr token: ", token);
// 		// 	// 		localStorage.setItem(apis_tokens[i]['apiTokenVar'], token);
// 		// 	// 	}, 6000);
// 		// 	// }

// 		// 	// if(apis_tokens.length>0){ //token have been saved
// 		// 	// 	for(var i=0; i<apis_tokens.length; ++i){
// 		// 	// 		console.log("Get toke: ", localStorage.getItem(apis_tokens[i]['apiTokenVar']));
// 		// 	// 	}
// 		// 	// }
			
// 		// 	//right one below
// 		// 	token = scrAPIrLogin('My Dailymotion Favorites Videos','',10);	
// 		// 	setTimeout(function(){
// 		// 		console.log("ScrAPIr token: ", token);
// 		// 		localStorage.setItem("tokenAPI", token);
// 		// 		this.get();	
// 		// 	 }, 6000);
			 
// 		// 	//  setTimeout(function(){
// 		// 	// 	token1 = scrAPIrLogin('Dailymotion Favorites Delete','',10);	
// 		// 	// 	console.log("ScrAPIr token1: ", token1);
// 		// 	// 	// this.get();	
// 		// 	//  }, 12000);
// 		// },
	
// 		// // Log current user out
// 		// logout: function() {
// 		// 	// Returns promise
// 		// 	return this.oAuthLogout();
// 		// },
	
// 		static: {
// 			// apiDomain: "https://api.dailymotion.com/", //"https://api.unsplash.com/",
// 			// oAuth: "https://www.dailymotion.com/oauth/authorize",
		
// 			test: function(value) {
// 				// Returns true if this value applies to this backend
// 				url = new URL(this.url, Mavo.base);
// 				return url.startsWith("");
// 			}


// 			// test: function(url) {
// 			// 	// Returns true if this value applies to this backend
// 			// 	url = new URL(url, Mavo.base);
// 			// 	// return url.startsWith("getVideoObject");
// 			// 	return url.href.startsWith("/getVideoObject");
// 			// }
// 		}

// 	}));
	
// })(Bliss, Bliss.$);










// (function($, $$) {

// 	var _ = Mavo.Backend.register($.Class({
// 		extends: Mavo.Backend,
// 		id: "ScrAPIr",
// 		constructor: function(url, {mavo, format}) {
// 			// Initialization code

// 			// Already defined by the parent constructor:
// 			this.source // Raw URL (attribute value)
// 			this.url // URL object from this.source
// 			this.mavo // Mavo instance
// 			this.format // Current format
// 			// this.permissions // Permissions of this particular backend.
// 			this.permissions.on(["login", "read"]);
// 			//this.login(true);
// 		},

// 		get: function(url) {
// 			// if(this.url.href.includes('api')){
// 			// 	//window.open("https://www.dailymotion.com/oauth/authorize?response_type=code&scope=&client_id=e30bfeb6ad6c4e849a97&redirect_uri=https://scrapir.org/oauth", "windowname1", 'width=800, height=600');
// 			// 	var win= window.open("https://github.com/login/oauth/authorize?client_id=c56789ff1ca6c64816ed&redirect_uri=http://scrapir.org/oauth", "windowname1", 'width=800, height=600');
			
// 			// 	var pollTimer = window.setInterval(function() {
// 			// 		try {
// 			// 			console.log("win open", win.document); //here url
// 			// 			if (win.document.URL.indexOf('http://scrapir.org/oauth') != -1) {
// 			// 				window.clearInterval(pollTimer);
// 			// 				var url =   win.document.URL;
// 			// 				acToken =   gup(url, 'code');
// 			// 				// tokenType = gup(url, 'token_type');
// 			// 				// expiresIn = gup(url, 'expires_in');
// 			// 				win.close();
// 			// 				//validateToken(acToken);
// 			// 			}
// 			// 		} catch(e) {
// 			// 		}
// 			// 	}, 200);

// 			// 	function gup(url, name) {
// 			// 		name = name.replace(/[[]/,"\[").replace(/[]]/,"\]");
// 			// 		var regexS = "[\?&]"+name+"=([^&#]*)";
// 			// 		var regex = new RegExp( regexS );
// 			// 		var results = regex.exec( url );
// 			// 		if( results == null )
// 			// 		  return "";
// 			// 		else
// 			// 		  return results[1];
// 			// 	  }
// 			// }

// 			// var data1 = [], data2 = [], apiURL, apiParams, urlM= this.url.pathname, apiName = this.url.pathname, apisParams = [], apisList='';
// 			// if(this.url.href.includes('|')){
// 			// 	apisParams = this.url.href.split("https://scrapir.org/api/")[1];
// 			// 	apisParams = apisParams.split("|")

// 			// 	for(var j=0; j<apisParams.length; ++j){
// 			// 		apiParams = apisParams[j];
// 			// 		apiParams = apiParams.split(':').join('=');
// 			// 		apiParams = apiParams.split(',').join('&');
// 			// 		apiParams = apiParams.split('{').join('');
// 			// 		apiParams = apiParams.split('}').join('');
// 			// 		// apiParams = apiParams.split('%20').join('');
// 			// 		apiParams = apiParams.split('%22').join('');
// 			// 		//console.log(apisParams[j]);

// 			// 		apisList+=apiParams
// 			// 		if(j+1<apisParams.length){
// 			// 			apisList+='|';
// 			// 		}
// 			// 		//console.log("API LIST: ",apisList);
// 			// 	}
// 			// 	apiURL = 'https://scrapir.org/apis/'+apisList;
// 			// 	console.log('URL: ', apiURL);
// 			// }else{ //One API
// 			// 	apisParams = this.url.href.split("https://scrapir.org/api/")[1];
// 			// 	apiParams = apisParams;//this.url.search;
// 			// 	apiParams = apiParams.split(':').join('=');
// 			// 	apiParams = apiParams.split(',').join('&');
// 			// 	apiParams = apiParams.split('{').join('');
// 			// 	apiParams = apiParams.split('}').join('');
// 			// 	//apiParams = apiParams.split('%20').join('');
// 			// 	apiParams = apiParams.split('%22').join('');

// 			// 	apiURL = 'https://scrapir.org/api/'+apiParams;
// 			// 	console.log('URL: ', apiURL);
// 			// }

// 			// fetch(apiURL)
// 			// .then((response) => {
// 			// 	return response.json();
// 			// })
// 			// .then((data) => {
// 			// 	data1 = data; 
// 			// });

// 			// setTimeout(function(){
// 			// 	data2=data1;
// 			// 	//data = scrAPIr(apiName, "", "", 10);
// 			// 	console.log("DATA1: ", data1);
// 			// }, 8000);  

// 			// //console.log("DATA2: ", data2);

// 			// // data = [{"a": "aa1","b": "bb1"}, {"a": "aa2","b": "bb2"}]
// 			// // data = '{"YouTubeAPI": [{"y": "aaa"}, {"y": "bbb"}, {"y": "ccc"}],"NewsAPI": [{"n": "ddd"}, {"n": "eee"}]}';
// 			// // console.log("ScrAPIr load(): ", new Promise(function(resolve, reject) {setTimeout(() => resolve(data2), 3000);}));
// 			// return new Promise(function(resolve, reject) {setTimeout(() => resolve(data2), 8000);});
// 		},
	
// 		load: function() {
// 			return this.ready
// 			.then(() => this.get())
// 			.then(response => {
// 				if (typeof response != "string") {
// 					// Backend did the parsing, we're done here
// 					return response;
// 				}

// 				response = response.replace(/^\ufeff/, ""); // Remove Unicode BOM
// 				return this.format.parse(response);
// 			});
// 		},
	
// 		// Low-level saving code.
// 		// serialized: Data serialized according to this.format
// 		// path: Path to store data
// 		// o: Arbitrary options
// 		put: function(serialized, path = this.path, o = {}) {
// 			// Returns promise
// 		},
	
// 		// If your backend supports uploads, this is mandatory.
// 		// file: File object to be uploaded
// 		// path: relative path to store uploads (e.g. "images")
// 		upload: function(file, path) {
// 			// Upload code. Should call this.put()
// 		},
	
// 		// High level function for storing data.
// 		// You rarely need to override this, except to avoid serialization.
// 		store: function(data, {path, format = this.format} = {}) {
// 			// Should return a promise that resolves when the data is saved successfully
// 		},

// 		//oAuthParams: () => `&scope=public+read_user+write_user+read_photos+write_photos+write_likes+write_followers+read_collections+write_collections`,
// 		//&redirect_uri=${encodeURIComponent("https://auth.mavo.io")}&response_type=code&client_id=e30bfeb6ad6c4e849a97`,

	
// 		// Takes care of authentication. If passive is true, only checks if
// 		// the user is already logged in, but does not present any login UI.
// 		// Typically, you’d call this.login(true) in the constructor
// 		login: function(passive) {
// 			// Typically, you’d check if a user is already authenticated
// 			// and return Promise.resolve() if so.
// 			console.log("LOGIN CLICKED X")
// 			scrAPIr('My Dailymotion Favorites Videos','',10);			
// 		},
	
// 		// Log current user out
// 		logout: function() {
// 			// Returns promise
// 			return this.oAuthLogout();
// 		},
	
// 		static: {
// 			// Mandatory and very important! This determines when your backend is used.
// 			// value: The mv-storage/mv-source/mv-init value
// 			test: function(url) {
// 				// Returns true if this value applies to this backend
// 				url = new URL(url, Mavo.base);
// 				return url.href.startsWith("scrapirxxxx");
// 			}
// 		}

// 	}));
	
// 	})(Bliss, Bliss.$);







// 	//Google Drive

// 	(function($, $$) {

// 		var _ = Mavo.Backend.register($.Class({
// 			extends: Mavo.Backend,
// 			id: "Gdrive",
		
// 			constructor: function() {
// 				this.permissions.on(["login", "read"]);
		
// 				this.key = this.mavo.element.getAttribute("mv-gdrive-key") || "447389063766-ipvdoaoqdds9tlcmr8pjdo5oambcj7va.apps.googleusercontent.com";
// 				this.extension = this.format.constructor.extensions[0] || ".json";
// 				this.fileFields = "name, id, mimeType, parents, capabilities";
// 				this.info = this.parseSource(this.source);
				
// 				this.login(true);
// 			},
		
// 			update: function(url, o) {
// 				this.super.update.call(this, url, o);
// 			},
		
// 			get: function() {
// 				console.log("GET")

// 				if (this.info.id && !this.user) {
// 					console.log("HERE: ", $.fetch(`https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?id=${this.info.id}&export=download`)
// 					.then(resp => resp.responseText));
// 					return $.fetch(`https://cors-anywhere.herokuapp.com/https://drive.google.com/uc?id=${this.info.id}&export=download`)
// 						.then(resp => resp.responseText);
// 				}
// 				else {
// 					return this.request(`drive/v3/files/${this.info.id}`, {alt: "media"})
// 						.catch(() => console.warn("Can't access storage file before logging in."));
// 				}
// 			},
		
// 			put: function(serialized, id = this.info.id, o = {}) {
// 				var meta = JSON.stringify(o.meta || {name: this.info.name});
// 				var initRequest;
		
// 				if (id === null) {
// 					initRequest = $.fetch(`${_.apiDomain}upload/drive/v3/files?uploadType=resumable`, {
// 						method: "POST",
// 						data: meta,
// 						headers: {
// 							"Authorization": `Bearer ${this.accessToken}`,
// 							"Content-Type": "application/json; charset=utf-8"
// 						}
// 					});
// 				}
// 				else {
// 					initRequest = $.fetch(`${_.apiDomain}upload/drive/v3/files/${id}?uploadType=resumable`, {
// 						method: "PATCH",
// 						data: meta,
// 						headers: {
// 							"Authorization": `Bearer ${this.accessToken}`,
// 							"Content-Type": "application/json; charset=utf-8"
// 						},
// 					});
// 				}
		
// 				return initRequest
// 					.then(resp => this.request(`${resp.getResponseHeader("location")}&fields=*`, serialized, "PUT"))
// 					.then(info => this.request(`drive/v3/files/${info.id}`, {fields: "webContentLink"}))
// 					.then(info => info.webContentLink);
// 			},
		
// 			upload: function(content, path) {
// 				var pathInfo = path.split("/");
// 				var foldername = pathInfo[0];
// 				var uploadname = pathInfo[pathInfo.length-1];
		
// 				return this.request("drive/v3/files", {q: `name='${foldername}' and mimeType='application/vnd.google-apps.folder' and '${this.info.parents[0]}' in parents and trashed=false`, fields: "files/id"})
// 					.then(result => {
// 						var folderId = !result.files[0] ? null : result.files[0].id;
		
// 						if (result.files.length === 0) {
// 							// If no folder found, create one and put file in there.
// 							return this.request("drive/v3/files", {name: foldername, mimeType: "application/vnd.google-apps.folder", parents:[this.info.parents[0]]}, "POST")
// 								.then(folder => this.put(content, null, {
// 									meta: {
// 										name: uploadname,
// 										parents: [folder.id]
// 									}
// 								}));
// 						}
// 						else {
// 							// If folder found, search for the file in the folder.
// 							return this.request("drive/v3/files", {q: `name='${uploadname}' and '${folderId}' in parents and trashed=false`, fields: "files/id"})
// 								.then(result => {
// 									var fileExists = !!result.files[0];
// 									var meta = {
// 										name : uploadname,
// 									};
// 									meta[fileExists ? "addParents" : "parents"] = fileExists ? folderId : [folderId];
		
// 									return this.put(content, fileExists ? result.files[0].id : null, {
// 										meta: meta
// 									});
// 								});
// 						}
// 					});
// 			},
		
// 			oAuthParams: () => `&scope=https://www.googleapis.com/auth/drive&redirect_uri=${encodeURIComponent("https://auth.mavo.io")}&response_type=code`,
		
// 			// Set the storage file and its path
// 			setStorage: async function() {
// 				var parentId = "root";
		
// 				for (const foldername of this.info.ancestorNames) {
// 					const folderResult = await this.request("drive/v3/files", {q: `name='${foldername}' and trashed=false and mimeType='application/vnd.google-apps.folder' and '${parentId}' in parents`, fields: "files/id"});
// 					var info = "";
		
// 					if (folderResult.files.length === 0) {
// 						info = await this.request("drive/v3/files", {name: foldername, mimeType: "application/vnd.google-apps.folder", parents: [parentId]}, "POST");
// 					}
// 					else {
// 						info = folderResult.files[0];
// 					}
		
// 					parentId = info.id;
// 				}
				
// 				return this.request("drive/v3/files", {q: `name='${this.info.name}' and trashed=false and '${parentId}' in parents`, fields: `files(${this.fileFields})`})
// 					.then(result => {
// 						if (result.files.length === 0) {
// 							return this.request(`drive/v3/files?fields=${this.fileFields}`, {name: this.info.name, parents: [parentId]}, "POST");
// 						}
// 						else {
// 							return result.files[0];
// 						}
// 					})
// 					// Store storage file metadata for later use
// 					.then(info => this.info = info);
// 			},
		
// 			// Set permission of authenticated, Mavo app user
// 			setPermission: async function() {
// 				var canEdit = this.info.capabilities ? this.info.capabilities.canEdit : false;
// 				var canComment = this.info.capabilities ? this.info.capabilities.canComment : false;
		
// 				if (canEdit || canComment || !this.info.id) {
// 					this.permissions.on(["edit", "save"]);
// 				}
// 				else {
// 					console.warn("Don't have edit permission");
// 				}
// 			},
		
// 			getUser: function() {
// 				if (this.user) {
// 					return Promise.resolve(this.user);
// 				}
				
// 				return this.request("drive/v3/about", {fields: "user"})
// 					.then(info => {
// 						this.user = {
// 							username: info.user.emailAddress,
// 							name: info.user.displayName,
// 							avatar: info.user.photoLink,
// 							info
// 						};
		
// 						$.fire(this.mavo.element, "mv-login", { backend: this });
// 					});
// 			},
		
// 			login: function(passive) {
// 				return this.oAuthenticate(passive)
// 					.then(() => {
// 						// Check whether mv-storage/init/source contains the storage file ID via. Share Link or file path and name
// 						if (this.info.id) {
// 							return this.request(`drive/v3/files/${this.info.id}`, {fields: this.fileFields}).then(info => this.info = info);
// 						}
// 						else {
// 							return this.setStorage();
// 						}
// 					})
// 					.then(() => this.getUser())
// 					.catch(xhr => {
// 						if (xhr.status == 401) {
// 							this.logout();
// 						}
// 					})
// 					.then(() => {
// 						if (this.user) {
// 							this.permissions.logout = true;
// 							this.setPermission();
// 						}
// 					});
// 			},
		
// 			logout: function() {
// 				return this.oAuthLogout();
// 			},
		
// 			// Extract information from mv-storage/init/source to init this.info
// 			parseSource: function(url) {
// 				var arr = url.split("://");
		
// 				if (url.startsWith("gdrive")) {
// 					// Parse name of storage file. If extension not found, add it.
// 					var name = arr[arr.length-1].indexOf(this.extension) !== -1 ? arr.pop() : `${this.mavo.id}${this.extension}`;
// 					arr.shift();
// 					// Parse names of storage file's ancestor folders
// 					var ancestorNames = arr.filter(n => n !== "");
		
// 					return {
// 						name: name,
// 						ancestorNames: ancestorNames
// 					};
// 				}
// 				else {
// 					var from = "/d/";
// 					var to = "/";
// 					return {
// 						id: url.substring(url.indexOf(from) + from.length, url.lastIndexOf(to))
// 					};
// 				}
// 			},

		
// 			static: {
// 				apiDomain: "https://www.googleapis.com/",
// 				oAuth: "https://accounts.google.com/o/oauth2/v2/auth",
		
// 				test: function (url) {
// 					url = new URL(url, Mavo.base);
// 					// Need a better way to test paths
// 					return /drive.google.com/.test(url.host) || url.href.startsWith("gdrive://");
// 				}
// 			}
// 		}));
			
// 		})(Bliss, Bliss.$);









