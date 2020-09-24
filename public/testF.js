var s = document.createElement("script");
s.src = "https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js";
document.head.appendChild(s); 


window.onload = function() {
  $.ajax({
    url: 'https://superapi-52bc2.firebaseio.com/functions.json',
    method: "GET",
    success: function (response) {
      for(funcName in response){
        if(response[funcName]['method']){
          var method = response[func]['method'];
        }else{
          var method = "GET";
        }
        window[funcName] = new Function('...args', 'let [...params] = args; callAPI("'+funcName+'","'+method+'",params)');
      }
    }
  });


//   //setTimeout(function(){
//     console.log("Data: ",getBooksTitle('Cats', 'relevance'));
// //}, 2000);  

};

function callAPI(funcName,method, params){
  // console.log("API: ", funcName);
  // console.log("Params: ", params);
  // console.log("method: ", method);
  var data;
  $.ajax({
    url: 'http://localhost:5000/function/'+funcName,
    method: "GET",
    success: function (response) {
      data = response;
      console.log(response);
    }
  });

  //return data;
}




//check the method type, if delete, call scrapirRemove, if add, call 