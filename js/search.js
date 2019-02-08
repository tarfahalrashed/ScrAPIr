var nextPageToken = null;
var prevPageToken = null;
var pageToken = null;

var request1;
var numberOfPages, currPage;
var typeSelected;
var h;
var counterText = 0;
var counterRadioButton = 0;
var counterCheckBox = 0;
var counterTextArea = 0;
var api;
var counter = 1;
var objString;
var totalNoResult;
var objArray = [];
var reachLastPage = false;
var publishedAfter;


// Initialize Firebase
  //var firebase = require(‘firebase’);

  var config = {
    apiKey: "AIzaSyBaJakjjAHw0wvBtELAtDLPmhq1piGWwqQ",
    authDomain: "superapi-52bc2.firebaseapp.com",
    databaseURL: "https://superapi-52bc2.firebaseio.com",
    projectId: "superapi-52bc2",
    storageBucket: "superapi-52bc2.appspot.com",
    messagingSenderId: "859121565515"
  };

function registration(){
  firebase.initializeApp(config);

  firebase.auth().onAuthStateChanged(function (user) {
    if(user){
      //console.log("CURRENT USER: ",user.uid);
      firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
        //console.log("NAME: ", displayName);
        $("#SignupLogin").html(snapshot.val().name);
      });

      $('#acc').show();
      $('#signout').show();

      // document.getElementById('acc').style.visibility = 'visible';
      // document.getElementById('signout').style.visibility = 'visible';
    }
    else{
      //window.alert("No USER")
      $("#SignupLogin").html("Sign in");

      document.getElementById('acc').style.visibility = 'hidden';
      document.getElementById('signout').style.visibility = 'hidden';
    }
  });
}

// function createResource(properties) {
//   var resource = {};
//   var normalizedProps = properties;
//   for (var p in properties) {
//     var value = properties[p];
//     if (p && p.substr(-2, 2) == '[]') {
//       var adjustedName = p.replace('[]', '');
//       if (value) {
//         normalizedProps[adjustedName] = value.split(',');
//       }
//       delete normalizedProps[p];
//     }
//   }
//   for (var p in normalizedProps) {
//     // Leave properties that don't have values out of inserted resource.
//     if (normalizedProps.hasOwnProperty(p) && normalizedProps[p]) {
//       var propArray = p.split('.');
//       var ref = resource;
//       for (var pa = 0; pa < propArray.length; pa++) {
//         var key = propArray[pa];
//         if (pa == propArray.length - 1) {
//           ref[key] = normalizedProps[p];
//         } else {
//           ref = ref[key] = ref[key] || {};
//         }
//       }
//     };
//   }
//   return resource;
// }


// //Start edit
// function requiredFieldValidator(value) {
//     if (value == null || value == undefined || !value.length) {
//       return {valid: false, msg: "This is a required field"};
//     } else {
//       return {valid: true, msg: null};
//     }
//   }
//End edit

// Start CompositeEditor to implement detached item edit form
// function openDetails() {
//     if (grid.getEditorLock().isActive() && !grid.getEditorLock().commitCurrentEdit()) {
//       return;
//     }
//     var $modal = $("<div class='item-details-form'></div>");
//     $modal = $("#itemDetailsTemplate")
//         .tmpl({
//           context: grid.getDataItem(grid.getActiveCell().row),
//           columns: col.columns
//         })
//         .appendTo("#tableViewContainer");
//     $modal.keydown(function (e) {
//       if (e.which == $.ui.keyCode.ENTER) {
//         grid.getEditController().commitCurrentEdit();
//         e.stopPropagation();
//         e.preventDefault();
//       } else if (e.which == $.ui.keyCode.ESCAPE) {
//         grid.getEditController().cancelCurrentEdit();
//         e.stopPropagation();
//         e.preventDefault();
//       }
//     });
//     $modal.find("[data-action=save]").click(function () {
//       grid.getEditController().commitCurrentEdit();
//     });
//     $modal.find("[data-action=cancel]").click(function () {
//       grid.getEditController().cancelCurrentEdit();
//     });
//     var containers = $.map(col.columns, function (c) {
//       return $modal.find("[data-editorid=" + c.id + "]");
//     });
//     var compositeEditor = new Slick.CompositeEditor(
//         col.columns,
//         containers,
//         {
//           destroy: function () {
//             $modal.remove();
//           }
//         }
//     );
//     grid.editActiveCell(compositeEditor);
//   }
// End CompositeEditor to implement detached item edit form

function isIEPreVer9() { var v = navigator.appVersion.match(/MSIE ([\d.]+)/i); return (v ? v[1] < 9 : false); }

var checkboxSelector = new Slick.CheckboxSelectColumn({
  cssClass: "slick-cell-checkboxsel"
});


//filter and stuff
  var gridElementName = "grid_";
  var pagerElementName = "gridPager_";
  var sliderElementName = "pcSlider_";
  var searchElementName = "txtSearch_";
  var selectButtonElementName = "btnSelectRows_";

  var gridArray;

  function GetGridIndex(grid) {
	for (var i=1; i<gridArray.length; i++) {
		if (gridArray[i] === grid) { return i; }
	}
	return -1;
  }

  function GetDataViewIndex(dataView) {
	for (var i=1; i<dataViewArray.length; i++) {
		if (dataViewArray[i] === dataView) { return i; }
	}
	return -1;
  }
  // -----------------------------------------------------------------------------------

  var sortcolArray = [];
  var sortdirArray = [];
  var percentCompleteThresholdArray = [];
  var searchStringArray = [];
  var h_runfiltersArray = [];

//end ilter and stuff

//group by
function groupByChannelTitle() {
  dataView.setGrouping({
    getter: "ChannelTitle",
    formatter: function (g) {
      return "Channel Title: " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
    },
    //aggregators: [
    //  new Slick.Data.Aggregators.Sum("duration"),
    //  new Slick.Data.Aggregators.Sum("cost")
    //],
    aggregateCollapsed: true,
    lazyTotalsCalculation: true
  });
}

function groupByDate() {
  dataView.setGrouping({
    getter: "PublishedAt",
    formatter: function (g) {
      return "Published At: " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
    },
    //aggregators: [
    //  new Slick.Data.Aggregators.Sum("duration"),
    //  new Slick.Data.Aggregators.Sum("cost")
    //],
    aggregateCollapsed: false,
    lazyTotalsCalculation: true
  });
}

function groupByChannelTitleDate() {
  dataView.setGrouping([
    {
      getter: "ChannelTitle",
      formatter :function (g) {
        return "Channel Title:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
      },
      //aggregators: [
      //  new Slick.Data.Aggregators.Sum("duration"),
      //  new Slick.Data.Aggregators.Sum("cost")
      //],
      aggregateCollapsed: true,
      lazyTotalsCalculation: true
    },
    {
      getter: "PublishedAt",
      formatter :function (g) {
        return "Published At:  " + g.value + "  <span style='color:green'>(" + g.count + " items)</span>";
      },
      //aggregators: [
      //  new Slick.Data.Aggregators.Avg("percentComplete"),
      //  new Slick.Data.Aggregators.Sum("cost")
      //],
      collapsed: true,
      lazyTotalsCalculation: true
    }
  ]);
}

//group by

var videoFormatter = function (row, cell, value, columnDef, dataContext) {
    var s ="<b><a href='" + dataContext + ">" + "</a></b><br/>";
    return s;
  };


var data = [];
var data2 = [];

var grid, s;
var loader = new Slick.Data.RemoteModel();
var mpnFormatter = function (row, cell, value, columnDef, dataContext) {
    s ="<a href='" + dataContext.octopart_url + "' target=_blank>" + dataContext.mpn + "</a>";
    return s;
};
var brandFormatter = function (row, cell, value, columnDef, dataContext) {
    return dataContext.brand.name;
};

var dataView;
var searchString = "";

var options = {
  columnPicker: {
    columnTitle: "Columns",
    hideForceFitButton: true,
    hideSyncResizeButton: true,
    //forceFitTitle: "Force fit columns",
    //syncResizeTitle: "Synchronous resize",
  },
  rowHeight: 21,
  editable: true,
  enableAddRow: true,
  enableCellNavigation: true,
  asyncEditorLoading: true,
  enableColumnReorder: true,
  multiColumnSort: true,
  autoEdit: true,
	editorLock: new Slick.EditorLock(),
  forceFitColumns: true,
  autoEdit: false,
  topPanelHeight: 25
  //forceFitColumns: false,
};

var loadingIndicator = null;

var sortcol = "title";
var sortdir = 1;
var percentCompleteThreshold = 0;
var prevPercentCompleteThreshold = 0;

// define some minimum height/width/padding before resizing
var DATAGRID_MIN_HEIGHT = 180;
var DATAGRID_MIN_WIDTH = 500;
var DATAGRID_BOTTOM_PADDING = 20;
/** Attach an auto resize trigger on the datagrid, if that is enable then it will resize itself to the available space
  * Options: we could also provide a % factor to resize on each height/width independently
  */
function attachAutoResizeDataGrid(grid, gridId, gridContainerId) {
  var gridDomElm = $('#' + gridId);
  if (!gridDomElm || typeof gridDomElm.offset() === "undefined") {
    // if we can't find the grid to resize, return without attaching anything
        return null;
  }
  //-- 1st resize the datagrid size on first load (because the onResize is not triggered on first page load)
  resizeToFitBrowserWindow(grid, gridId, gridContainerId);
  //-- 2nd attach a trigger on the Window DOM element, so that it happens also when resizing after first load
  $(window).on("resize", function () {
    // for some yet unknown reason, calling the resize twice removes any stuttering/flickering when changing the height and makes it much smoother
    resizeToFitBrowserWindow(grid, gridId, gridContainerId);
    resizeToFitBrowserWindow(grid, gridId, gridContainerId);
  });
  // in a SPA (Single Page App) environment you SHOULD also call the destroyAutoResize()
}
/* destroy the resizer when user leaves the page */
function destroyAutoResize() {
  $(window).trigger('resize').off('resize');
}
/**
* Private function, calculate the datagrid new height/width from the available space, also consider that a % factor might be applied to calculation
* object gridOptions
*/

function calculateGridNewDimensions(gridId, gridContainerId) {
  var availableHeight = $(window).height() - $('#' + gridId).offset().top - DATAGRID_BOTTOM_PADDING;
  var availableWidth = $('#' + gridContainerId).width();
  var newHeight = availableHeight;
  var newWidth = availableWidth;
        // we want to keep a minimum datagrid size, apply these minimum if required
  if (newHeight < DATAGRID_MIN_HEIGHT) {
    newHeight = DATAGRID_MIN_HEIGHT;
  }
  if (newWidth < DATAGRID_MIN_WIDTH) {
    newWidth = DATAGRID_MIN_WIDTH;
  }
  return {
    height: newHeight,
    width: newWidth
  };
}
/** resize the datagrid to fit the browser height & width */
function resizeToFitBrowserWindow(grid, gridId, gridContainerId) {
  // calculate new available sizes but with minimum height of 220px
  var newSizes = calculateGridNewDimensions(gridId, gridContainerId);
  if (newSizes) {
    // apply these new height/width to the datagrid
    $('#' + gridId).height(newSizes.height);
    $('#' + gridId).width(newSizes.width);
    // resize the slickgrid canvas on all browser except some IE versions
    // exclude all IE below IE11
    if (new RegExp('MSIE [6-8]').exec(navigator.userAgent) === null && grid) {
      grid.resizeCanvas();
    }
  }
}

var obj = {};
var lists = []
obj.lists = lists;

var col = {};
var columns = [];

// function myFilter(item, args) {
//  if (args.searchString != "" && item["VideoTitle"].indexOf(args.searchString) == -1) {
//     return true;
//   }
//   if (args.searchString != "" && item["ChannelTitle"].indexOf(args.searchString) == -1) {
//      return true;
//    }
//
//   if(args.searchString == ""){
//     return true;
//   }
//   return false;
// }

// function toggleFilterRow() {
//   grid.setTopPanelVisibility(!grid.getOptions().showTopPanel);
// }

$(".grid-header .ui-icon")
.addClass("ui-state-default ui-corner-all")
.mouseover(function (e) {
  $(e.target).addClass("ui-state-hover")
})
.mouseout(function (e) {
  $(e.target).removeClass("ui-state-hover")
});

//when any of field check box is checked\unchecked
function fieldHasBeenSelected(select){
  retrieveData();
}



var myObj;
var listP, listP1;
var obJSON;
var obJSON1;
var obSavedData;
var url, url1;


function copyFbRecord(oldRef, newRef) {
     oldRef.once('value', function(snap)  {
          newRef.set( snap.val(), function(error) {
               if( error && typeof(console) !== 'undefined' && console.error ) {  console.error(error); }
          });
     });
}


// function prettierURL(){
//   var link = window.location.href;
//   var url = link.split('.html');
//   window.history.replaceState( null, null, url[0] );
// }

function checkButtonClicked(){

  var str = window.location.href;

  if(str.includes("/#")){
    var url = window.location.href.split("?api=");
    var url_title1 = url[1].split('_').join(' ');
    var url_title_only = url_title1.split("/#");
    var url_title = url_title_only[0];
    var url_fileName = url_title_only[1].split('_').join(' ');//url_title_only[1];

    // var link = window.location.href;
    // var url1 = link.replace('.html','');
    // var url2 = url1.replace('/#','/');
    // var url3 = url2.replace('?api=','/api=');
    // window.history.replaceState( null, null, url3 );
    // retrieve myObj for YouTube from FireBase DB
    registration();

    //Saved Data
    firebase.database().ref('/publicSavedData/').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot){ //for each API
        if(childSnapshot.val().title == url_fileName){//check if this API exists
          console.log("obSavedData: ", childSnapshot.val());
          obSavedData = childSnapshot.val();
        }
      });
    });

    //copyFbRecord(firebase.database().ref('/demos/YouTube API Demo'), firebase.database().ref('/apis/YouTube API Demo'));
    firebase.database().ref('/apis/').once('value').then(function(snapshot) {
      //console.log("FIREBASE Parent: ", snapshot.val());
      snapshot.forEach(function(childSnapshot){ //for each API
        if(childSnapshot.val().title == url_title){//check if this API exists
          //console.log("FIREBASE: ", childSnapshot.val());
          obJSON1 = childSnapshot.val();
          //[1] Request URL
          url = obJSON1.url;
          //[2] Populate HTML elements from request parameters
            var arr;
            for(var i=0; i<obJSON1.parameters.length; ++i){
              if(obJSON1.parameters[i]['displayedName']){//if it should be displayed
                $("#reqParameters").append("<label style='font-size:1em'>"+obJSON1.parameters[i]['displayedName']+"</label>")
                  if(obJSON1.parameters[i]['listOfValues']){
                    $("#reqParameters").append("<select class='form-control' id="+obJSON1.parameters[i]['name']+"></select></br>");
                    arr = obJSON1.parameters[i]['listOfValues'].split(',');
                    valueSelected = obSavedData.parameters[i]['value'];
                    for(var j=0; j<arr.length; ++j){
                      if(valueSelected == arr[j]){
                        $("#"+obJSON1.parameters[i]['name']).append("<option selected>"+arr[j]+"</option>");
                      }else{
                        $("#"+obJSON1.parameters[i]['name']).append("<option>"+arr[j]+"</option>");
                      }

                    }
                  }else{
                    $("#reqParameters").append('<input style="height:27px" type="text" class="form-control" id="'+obJSON1.parameters[i]['name']+'" value="'+obSavedData.parameters[i]['value']+'"></input></br>');
                  }
              }
            }

            //[3] Request parameters
            listP1="{";

            for(var i=0; i<obJSON1.parameters.length; ++i){

              listP1+= JSON.stringify(obJSON1.parameters[i]['name']);
              listP1+= ":" //$('#queryw').val()
              if(obJSON1.parameters[i]['displayedName']){
                listP1+= JSON.stringify($("#"+obJSON1.parameters[i]['name']).val());
              }else{
                listP1+= JSON.stringify(obJSON1.parameters[i]['value']);
              }
              if(i+1<obJSON1.parameters.length){
                 listP1+= ","
               }
            }
            //listP1+= ",";
            if(obJSON1.resPerPageParam){
              listP1+= JSON.stringify(obJSON1.resPerPageParam);
              listP1+= ":";
              listP1+= JSON.stringify(obJSON1.maxResPerPage);
            }
            listP1+= "}";
            console.log("listP1 SETITEM: ",listP1);

            $("#reqParameters").append("<label style='font-size:1em'>Number of results</label>");
            $("#reqParameters").append("<input style='height:27px' type='text' class='form-control' id='numOfResults' value="+obJSON1.maxResPerPage+"></input>")

          //[4] Response parameters
          for(var i=0; i<obSavedData.responses.length; ++i){
            var par = obSavedData.responses[i]['parameter'];
            var nameD = obSavedData.responses[i]['displayedName'];
            if(obSavedData.responses[i]['isChecked']){
              $("#resParameters").append("<div><input id="+par+" value="+nameD+" class='checkbox-style' name='checkbox-w' type='checkbox'  onchange='fieldHasBeenSelected(this)' autocomplete='off' checked><label for="+par+" class='checkbox-style-3-label'>"+nameD+"</label></div>");
            }else{
              $("#resParameters").append("<div><input id="+par+" value="+nameD+" class='checkbox-style' name='checkbox-w' type='checkbox'  onchange='fieldHasBeenSelected(this)' autocomplete='off'><label for="+par+" class='checkbox-style-3-label'>"+nameD+"</label></div>");
            }
          }//for response
          retrieveData();
        }
      });
    });

}else{
  var url = window.location.href.split("api=");
  var url_title = url[1].split('_').join(' ');


    // retrieve myObj for YouTube from FireBase DB
    registration();
    //copyFbRecord(firebase.database().ref('/demos/YouTube API Demo'), firebase.database().ref('/apis/YouTube API Demo'));
    firebase.database().ref('/apis/').once('value').then(function(snapshot) {
      //console.log("FIREBASE Parent: ", snapshot.val());
      snapshot.forEach(function(childSnapshot) { //for each API
        if(childSnapshot.val().title == url_title){//check if this API exists
          //console.log("FIREBASE: ", childSnapshot.val());
          obJSON1 = childSnapshot.val();
          //[1] Request URL
          url = obJSON1.url;
          //[2] Populate HTML elements from request parameters
            var arr;
            for(var i=0; i<obJSON1.parameters.length; ++i){
              if(obJSON1.parameters[i]['displayedName']){//if it should be displayed
                $("#reqParameters").append("<label style='font-size:1em'>"+obJSON1.parameters[i]['displayedName']+"</label>")
                  if(obJSON1.parameters[i]['listOfValues']){
                    $("#reqParameters").append("<select class='form-control' id="+obJSON1.parameters[i]['name']+"></select></br>");
                    arr = obJSON1.parameters[i]['listOfValues'].split(',');
                    for(var j=0; j<arr.length; ++j){
                      $("#"+obJSON1.parameters[i]['name']).append("<option>"+arr[j]+"</option>");
                    }
                  }else{
                    $("#reqParameters").append('<input style="height:27px" type="text" class="form-control" id="'+obJSON1.parameters[i]['name']+'" value="'+obJSON1.parameters[i]['value']+'"></input></br>');
                  }
              }
            }

            //[3] Request parameters
            listP1="{";

            for(var i=0; i<obJSON1.parameters.length; ++i){

              listP1+= JSON.stringify(obJSON1.parameters[i]['name']);
              listP1+= ":" //$('#queryw').val()
              if(obJSON1.parameters[i]['displayedName']){
                listP1+= JSON.stringify($("#"+obJSON1.parameters[i]['name']).val());
              }else{
                listP1+= JSON.stringify(obJSON1.parameters[i]['value']);
              }
              if(i+1<obJSON1.parameters.length){
                 listP1+= ","
               }
            }
            //listP1+= ",";
            if(obJSON1.resPerPageParam){
              listP1+= JSON.stringify(obJSON1.resPerPageParam);
              listP1+= ":";
              listP1+= JSON.stringify(obJSON1.maxResPerPage);
            }
            listP1+= "}";
            console.log("listP1 SETITEM: ",listP1);

            $("#reqParameters").append("<label style='font-size:1em'>Number of results</label>");
            $("#reqParameters").append("<input style='height:27px' type='text' class='form-control' id='numOfResults' value="+obJSON1.maxResPerPage+"></input>")

          //[4] Response parameters
          for(var i=0; i<obJSON1.responses.length; ++i){ //new response
            var par = obJSON1.responses[i]['parameter'];
            var nameD = obJSON1.responses[i]['displayedName'];
            //change to checkbox-style-1-label checkbox-small
            $("#resParameters").append("<div><input id="+par+" value="+nameD+" class='checkbox-style' name='checkbox-w' type='checkbox'  onchange='fieldHasBeenSelected(this)' autocomplete='off' checked><label for="+par+" class='checkbox-style-3-label'>"+nameD+"</label></div>");
          }
        }
      });
    });

  }//else API

}

// function addQueryToDB(){
//
//   var qObj={};
//   var strQuery="";
//   //save API name
//   qObj.apiName = obJSON1.title;
//   //save parameters name and value
//   var parameters = [];
//
//   strQuery+=obJSON1.url
//   strQuery+="?"
//
//   for(var i=0; i<obJSON1.parameters.length; ++i){
//     var v;
//     strQuery+=obJSON1.parameters[i]['name']
//     strQuery+="="
//     if(obJSON1.parameters[i]['displayedName']){
//       v = JSON.stringify($("#"+obJSON1.parameters[i]['name']).val());
//       strQuery+=$("#"+obJSON1.parameters[i]['name']).val()
//     }else{
//       v = JSON.stringify(obJSON1.parameters[i]['value']);
//       strQuery+=obJSON1.parameters[i]['value']
//     }
//
//     if(i+1<obJSON1.parameters.length)
//       strQuery+="&"
//
//     parameters.push({
//       name: obJSON1.parameters[i]['name'],
//       value: v
//     });
//   }
//   qObj.parameters = parameters;
//
//
//   //save each response displayed name and id AND if it is checked or not
//   var responses = [];
//
//   for(var i=0; i<obJSON1.responses.length; ++i){
//     if($("#"+obJSON1.responses[i]['parameter']).is(":checked")){
//       var checked = true;
//     }
//     responses.push({
//       parameter: obJSON1.responses[i]['parameter'],
//       displayedName: obJSON1.responses[i]['displayedName'],
//       isChecked:checked
//     });
//   }
//
//   qObj.responses = responses;
//
//   qObj.name = $("#savedName").val()
//
//   qObj.queryLink = strQuery;
//
//   firebase.auth().onAuthStateChanged(function (user) {
//     if(user){
//       console.log("CURRENT USER: ",user.uid);
//
//       firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
//         var displayName = snapshot.val().name;
//         console.log("NAME: ", displayName);
//         $("#SignupLogin").html(displayName);
//         //save the saved query in the firebase
//         firebase.database().ref('users/'+ user.uid+'/savedQueries/' + $("#savedName").val()).set(JSON.parse(JSON.stringify(qObj)));
//
//         console.log("addedQuery");
//
//         //If public add the to the public savedQueries and allow users to search for these queries!
//         //firebase.database().ref('savedQueries/' + $("#savedName").val()).set(JSON.parse(JSON.stringify(qObj)));
//
//       });
//     }
//     else{
//       //window.alert("No USER")
//     }
//   });
//
//   //add query to account query table
//   console.log("Save Query: ", strQuery);
// }



$('#downloadCSVFileButton').click(function () {

  var array = typeof data != 'object' ? JSON.parse(data) : data;

  var str = '';

  for (var i = 0; i < array.length; i++) {
      var line = '';

      for (var index in array[i]) {
          line += array[i][index] + ',';
      }

      line.slice(0,line.Length-1);

      str += line + '\r\n';
  }
  window.open( "data:text/csv;charset=utf-8," + escape(str))


    var textFile = $('.postingFile textarea').val();
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
    element.setAttribute('download', 'filename.csv');
    element.style.display = 'none';
    if (typeof element.download != "undefined") {
      //browser has support - process the download
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }
    else {
      //browser does not support - alert the user
      alert('This functionality is not supported by the current browser, recommend trying with Google Chrome instead.  (http://caniuse.com/#feat=download)');
    } //end of if...else...block
  }); //end of $('.downloadCSVFileButton').click(function () {




function populateAccountTables(){
  //look for the user, then get their save queries and files and add them to the tables
  prettierURL();
  firebase.initializeApp(config);

  firebase.auth().onAuthStateChanged(function (user) {
    if(user){
      console.log("USER ID: ",user.uid);
      firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
        var displayName = snapshot.val().name;
        console.log("NAME: ", displayName);
        $("#SignupLogin").html(displayName);

        //Query Table
        // firebase.database().ref('users/'+ user.uid+'/savedQueries/').once('value').then(function(snapshot) {
        //   snapshot.forEach(function(childSnapshot) { //for each saved query
        //     if(childSnapshot.val() != undefined){
        //       $("#queryTable").show();
        //       $("#query_table_content").show();
        //       console.log(childSnapshot.val().queryLink);
        //       var name = childSnapshot.val().name;
        //       var api_name = childSnapshot.val().apiName;
        //       var link = childSnapshot.val().queryLink;
        //       $("#query_table_content tbody").append('<tr><td>'+name+'</td><td>'+api_name+'</td><td><a target="_blank" rel="noopener noreferrer" href='+link+'><img src="images/link.png" style="top:20px; width:18px" ></a> &nbsp;&nbsp;<a target="_blank" rel="noopener noreferrer" href="data-management.html?query='+link+'"><img src="images/edit.png" style="top:20px; width:18px" ></a> &nbsp; <a target="_blank" rel="noopener noreferrer" id="'+name+'" onclick="deleteRowAccountTable(this,this)"><img src="images/del.png" style="width:18px"></a></td></tr>');
        //       //var api_title = str.split(' ').join('_');
        //       //$("#apis_list").append("<option id="+api_title+">"+childSnapshot.val().title+"</option>");
        //
        //     }else{
        //       //window.alert("No USER")
        //       $("#SignupLogin").html("Sign in");
        //     }
        //   });
        // });

        //Files Table
        firebase.database().ref('users/'+ user.uid+'/savedData/').once('value').then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) { //for each saved query
            if(childSnapshot.val() != undefined){
              $("#dataTable").show();
              $("#data_table_content").show();
              //console.log(childSnapshot.val().title);
              var name = childSnapshot.val().title;
              var api_name = childSnapshot.val().apiName;
              var file_desc = childSnapshot.val().description;
              //var type = childSnapshot.val().type;
              var url = childSnapshot.val().urlCSV;
              var urlJ = childSnapshot.val().urlJSON;
              var link = childSnapshot.val().queryLink;
              $("#data_table_content tbody").append('<tr><td>'+name+'</td><td>'+api_name+'</td><td>'+file_desc+'</td><td><a href='+url+' download="my_data.csv"><img src="images/csv-file.png" width="30px"></a> &nbsp; <a href="data:'+ urlJ +'" download="data.json"><img src="images/json-file.png" width="25px"></a> &nbsp;  <a href="data-management.html?api='+api_name.replace(" ", "_")+'/#'+name.split(' ').join('_')+'" target="_blank"><img src="images/edit.png" width="25px"></a> &nbsp; <a target="_blank" rel="noopener noreferrer" href='+link+'><img src="images/link.png" style="top:20px; width:18px" ></a> &nbsp;   <a id="'+name+'" href="" onclick="deleteRowAccountTableFiles(this,this)"><img src="images/del.png" width="25px"></a>   </td></tr>');

// <input id="'+name+'" type="image" src="images/del.png" width="25px" style="bottom:   -30px;" onclick="deleteRowAccountTableFiles(this,this)">
            }else{
              //window.alert("No USER")
              $("#SignupLogin").html("Sign in");
            }
          });
        });

      });

      $('#acc').show();
      $('#signout').show();
    }
    else{
      //window.alert("No USER")
    }
  });

}


var i = 0;
var x = 0;
var numResults = 0;

function retrieveData(){
  console.log("retrieveData() has been called");

  $('#myTree').empty();
  //$('#myList').empty();

  obJSON2 = {};
  data = [];
  col = {};
  columns = [];
  col.columns = columns;
  //publishedAfter = new Date($("input[name=afterDate]").val());
  //publishedBefore = new Date($("input[name=beforeDate]").val());
  //console.log("DATE: "+ publishedAfter.toISOString());
  $("#editModal").show();
  $("#CSV").show();
  $("#Save-Data").show();
  $("#JSON").show();
  $("#viewButtons").show();
  $("#groupByFilter").show();
  $("#txtSearch").show();
  //$("#searchTable").show();

  //col.columns.push(checkboxSelector.getColumnDefinition());
  //col.columns.push({id: 'i', name:'', field: '', behavior: 'selectAndMove', selectable: false, resizable: false, cssClass: 'cell-reorder dnd', width: 25, editor: Slick.Editors.Text, formatter:false, sortable: false});
  col.columns.push({id: 'id', name: '#', field: 'id', behavior: 'select', width: 25, editor: Slick.Editors.Text, formatter:false, sortable: true});

  if($("input[name='checkbox-w']").is(":checked")){
      $("input[name='checkbox-w']:checked").each(function(){
        col.columns.push({id: this.id, name: this.value, field: this.value, editor: Slick.Editors.Text, sortable: true});
      });
  }

    var pages = Math.ceil($("#numOfResults").val()/obJSON1.maxResPerPage); //# of pages = (# of results entered by the user \ # of results returned by the API)
    var totalRes = $("#numOfResults").val();
    // console.log("totalRes: ", totalRes);
    // console.log("number of pages: ", pages);
    numResults = obJSON1.maxResPerPage;

    var start = 0;
    var next="";
    var nextPage = "";
    var p=1;

    getTheNextPage(p, pages, nextPage);

    function getTheNextPage(p, pages, nextPage){
      console.log("getTheNextPage");

    listP=  "{";
    for(var i=0; i<obJSON1.parameters.length; ++i){
      if(!obJSON1.parameters[i]['description']){
        //  console.log("No DESC: ");
      //   console.log(obJSON1.parameters[i]['description'])
      // }
      listP+= JSON.stringify(obJSON1.parameters[i]['name']); //check conditions before adding names
      listP+= ":"
      if(obJSON1.parameters[i]['displayedName']){ //displayedName
        listP+= JSON.stringify($("#"+obJSON1.parameters[i]['name']).val());
      }else{
        listP+= JSON.stringify(obJSON1.parameters[i]['value']);
      }
      listP+= ","

    }//if
  }

    if(obJSON1.resPerPageParam){
      listP+= JSON.stringify(obJSON1.resPerPageParam);
      listP+= ":";
      listP+= JSON.stringify(obJSON1.maxResPerPage);
      listP+= ","
    }
    if(obJSON1.indexPage){
      listP+= JSON.stringify(obJSON1.indexPage);
      listP+= ":";
      listP+= p;
    }else{
      listP+= JSON.stringify(obJSON1.currPageParam);
      listP+= ":";
      listP+= JSON.stringify(nextPage);
    }
    listP+= "}";

    //console.log("listP: ", JSON.parse(listP));
    // console.log("Page: ", p);

    $.ajax({
      url: obJSON1.url,
      data: JSON.parse(listP),
      dataType: 'jsonp',
      method: 'GET',
      success: function (response) {
        for (var j=0; start<totalRes && j<numResults ; ++j, ++start){ // && start<2000LIMIT THE RESULT TO 100 LINES
           var objData={};
           objData["id"]= start;

           if($("input[name='checkbox-w']").is(":checked")){
               $("input[name='checkbox-w']:checked").each(function(){
                 var id = this.value;

                 if(this.value=="videoId"){
                   objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                 }else{
                   var str = (this.checked ? "response."+this.id : 0);
                   //console.log("STR: ", str)
                   //IF ARRAY
                   if(str.includes("[i]")){
                     //console.log("Includes [i]");
                     var i=0;
                     var splt =  str.split("[i]");
                     // start if undefined
                     if(eval(splt[0]).length==0){
                       //console.log("undefined");
                       objData[id]="";
                     }else{// start if NOT undefined
                     objData[id] = (this.checked ? eval("response."+this.id) : 0);
                     //console.log("objData[id]: ", objData[id]);
                     //console.log("splt: ", eval(splt[0]).length);
                     for(i=1; i<eval(splt[0]).length; ++i){
                       objData[id] += ", ";
                       objData[id] += eval("response."+this.id);
                       //console.log("objData[id]: ", objData[id]);
                     }
                   }///test undefined
                     //IF OBJECT and not ARRAY
                   }else if(eval("response."+this.id) instanceof Object && !(eval("response."+this.id) instanceof Array)){
                     //console.log("IT IS OBJECT");
                     var objD = (this.checked ? eval("response."+this.id) : 0);
                     var objKV = "";
                     var first = true;
                     for(var i in objD){
                      //console.log("Key: ", i);
                      //console.log("Value: ", objD[i]);
                      if(!first){
                        objKV+=", "
                      }else{
                        first = false;
                      }
                      objKV+=i+": "+objD[i];
                    }
                    objData[id]=objKV;

                    for(var i in objD){
                     //console.log("Key: ", i);
                     //console.log("Value: ", objD[i]);
                     objData[i]=objD[i];
                     //console.log("objData[id]: ", objData[i]);
                   }

                   //console.log("objData[id]: ", objData[id]);
                   //IF NEITHER
                   }else{
                     //console.log("Does NOT Include [i]");
                     objData[id] = (this.checked ? eval("response."+this.id) : 0);
                     //console.log("objData[id]: ", objData[id]);
                   }

                 }
               });
           }

           data.push(objData);
           obj.lists=[];
           obj.lists.push(objData);
        }//for loop

        if(p<pages){
          if(!obJSON1.indexPage){
              ++p;
              getTheNextPage(p, pages, eval("response."+obJSON1.nextPageParam));
          }else{
            ++p;
            getTheNextPage(p, pages, eval("response."+obJSON1.indexPage));
          }
        }else{
          populateTable(data);
        }

      }//response
    });//AJAX

  }//end of getTheNextPage function


  function populateTable(data){
        //console.log("DATA: ", data);
          /***************** Tree View ******************/
          //setTimeout(function(){
          document.getElementById("myTree").appendChild(renderjson(data));
          //document.getElementById("myTree").innerHTML = JSONTree.create(response);
          //Download
          var data1 = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, '', 7));

          $( "#JSON" ).remove();
          $( "#CSV" ).remove();
          $( "#saveBut" ).remove();
          $( "#SCRIPT" ).remove();

          $('<a id="CSV" class="button button-mini button-border button-rounded button-red" style="" onclick="DownloadJSON2CSV()"><i class="glyphicon glyphicon-download-alt" style="left:2px"></i>CSV</a>').appendTo('#viewButtons2');
          $('<a id="JSON" class="button button-mini button-border button-rounded button-blue" style="" href="data:' + data1 + '" download="data.json"><i class="glyphicon glyphicon-download-alt" style="left:2px"></i>JSON</a>').appendTo('#viewButtons2');
          $('<button id="saveBut" type="button" class="button button-mini button-border button-rounded button-yellow dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="glyphicon glyphicon-floppy-disk" style="left:2px"></i>SAVE </button>').appendTo('#viewButtons2');
          $('<button id="SCRIPT" type="button" class="button button-mini button-border button-rounded button-green"  aria-haspopup="true" aria-expanded="false"> <img src="images/java.png" width="15px" height="15px" bottom="5px"> &nbsp;Script </button>').appendTo('#viewButtons2');
          /***************** Table View ******************/
          var loadingIndicator = null;
          var jsonReturn;
          function getJsonP(resp) {
              jsonReturn = resp;
              return true;
          }

          $(function () {
            var groupItemMetadataProvider = new Slick.Data.GroupItemMetadataProvider({ checkboxSelect: true, checkboxSelectPlugin: checkboxSelector });
            dataView = new Slick.Data.DataView({
              groupItemMetadataProvider: groupItemMetadataProvider,
              inlineFilters: true
            });
            //dataView = new Slick.Data.DataView({inlineFilters: true});
            grid = new Slick.Grid("#myGrid", dataView, col.columns, options);
            // register the group item metadata provider to add expand/collapse group handlers
            grid.registerPlugin(groupItemMetadataProvider);
            grid.setSelectionModel(new Slick.RowSelectionModel({selectActiveRow: false}));
            grid.registerPlugin(checkboxSelector);
            var pager = new Slick.Controls.Pager(dataView, grid, $("#pager"));

            //group by
            var columnpicker = new Slick.Controls.ColumnPicker(col.columns, grid, options);
            dataView.syncGridSelection(grid, true, true);

            //search
            grid.onCellChange.subscribe(function (e, args) {
              dataView.updateItem(args.item.id, args.item);
            });
            grid.onAddNewRow.subscribe(function (e, args) {
              var item = {"num": data.length, "id": "new_" + (Math.round(Math.random() * 10000)), "title": "New task", "duration": "1 day", "percentComplete": 0, "start": "01/01/2009", "finish": "01/01/2009", "effortDriven": false};
              $.extend(item, args.item);
              dataView.addItem(item);
            });
            grid.onKeyDown.subscribe(function (e) {
              // select all rows on ctrl-a
              if (e.which != 65 || !e.ctrlKey) {
                return false;
              }
              var rows = [];
              for (var i = 0; i < dataView.getLength(); i++) {
                rows.push(i);
              }
              grid.setSelectedRows(rows);
              e.preventDefault();
            });

            //START sort
            grid.onSort.subscribe(function(e, args){
                var cols = args.sortCols;

                args.grid.getData().sort(function(dataRow1, dataRow2){
                     for (var i = 0, l = cols.length; i < l; i++){
                          var field = cols[i].sortCol.field;
                          var sign = cols[i].sortAsc ? 1 : -1;
                          var value1 = dataRow1[field], value2 = dataRow2[field];
                          var result = (value1 == value2 ? 0 : (value1 > value2 ? 1 : -1)) * sign;

                          if (result != 0) return result
                     }

                     return 0;
                })

                args.grid.invalidate()
                args.grid.render()
             })

            //END sort*/

            //start edit
            grid.setSelectionModel(new Slick.CellSelectionModel());

            grid.onAddNewRow.subscribe(function (e, args) {
                  var item = args.item;
                  grid.invalidateRow(data.length);
                  data.push(item);
                  grid.updateRowCount();
                  grid.render();
                });
            //end edit

            //start move rows
            var moveRowsPlugin = new Slick.RowMoveManager({
                cancelEditOnDrag: true
              });
              moveRowsPlugin.onBeforeMoveRows.subscribe(function (e, data) {
                for (var i = 0; i < data.rows.length; i++) {
                  // no point in moving before or after itself
                  if (data.rows[i] == data.insertBefore || data.rows[i] == data.insertBefore - 1) {
                    e.stopPropagation();
                    return false;
                  }
                }
                return true;
              });
              moveRowsPlugin.onMoveRows.subscribe(function (e, args) {
                var extractedRows = [], left, right;
                var rows = args.rows;
                var insertBefore = args.insertBefore;
                left = data.slice(0, insertBefore);
                right = data.slice(insertBefore, data.length);
                rows.sort(function(a,b) { return a-b; });
                for (var i = 0; i < rows.length; i++) {
                  extractedRows.push(data[rows[i]]);
                }
                rows.reverse();
                for (var i = 0; i < rows.length; i++) {
                  var row = rows[i];
                  if (row < insertBefore) {
                    left.splice(row, 1);
                  } else {
                    right.splice(row - insertBefore, 1);
                  }
                }
                data = left.concat(extractedRows.concat(right));
                var selectedRows = [];
                for (var i = 0; i < rows.length; i++)
                  selectedRows.push(left.length + i);
                grid.resetActiveCell();
                grid.setData(data);
                grid.setSelectedRows(selectedRows);
                grid.render();
              });
              grid.registerPlugin(moveRowsPlugin);
              grid.onDragInit.subscribe(function (e, dd) {
                // prevent the grid from cancelling drag'n'drop by default
                e.stopImmediatePropagation();
              });
              grid.onDragStart.subscribe(function (e, dd) {
                var cell = grid.getCellFromEvent(e);
                if (!cell) {
                  return;
                }
                dd.row = cell.row;
                if (!data[dd.row]) {
                  return;
                }
                if (Slick.GlobalEditorLock.isActive()) {
                  return;
                }
                e.stopImmediatePropagation();
                dd.mode = "recycle";
                var selectedRows = grid.getSelectedRows();
                if (!selectedRows.length || $.inArray(dd.row, selectedRows) == -1) {
                  selectedRows = [dd.row];
                  grid.setSelectedRows(selectedRows);
                }
                dd.rows = selectedRows;
                dd.count = selectedRows.length;
                var proxy = $("<span></span>")
                    .css({
                      position: "absolute",
                      display: "inline-block",
                      padding: "4px 10px",
                      background: "#e0e0e0",
                      border: "1px solid gray",
                      "z-index": 99999,
                      "-moz-border-radius": "8px",
                      "-moz-box-shadow": "2px 2px 6px silver"
                    })
                    .text("Drag to Recycle Bin to delete " + dd.count + " selected row(s)")
                    .appendTo("body");
                dd.helper = proxy;
                $(dd.available).css("background", "pink");
                return proxy;
              });
              grid.onDrag.subscribe(function (e, dd) {
                if (dd.mode != "recycle") {
                  return;
                }
                dd.helper.css({top: e.pageY + 5, left: e.pageX + 5});
              });
              grid.onDragEnd.subscribe(function (e, dd) {
                if (dd.mode != "recycle") {
                  return;
                }
                dd.helper.remove();
                $(dd.available).css("background", "beige");
              });
              $.drop({mode: "mouse"});
              $("#dropzone")
                  .on("dropstart", function (e, dd) {
                    if (dd.mode != "recycle") {
                      return;
                    }
                    $(this).css("background", "yellow");
                  })
                  .on("dropend", function (e, dd) {
                    if (dd.mode != "recycle") {
                      return;
                    }
                    $(dd.available).css("background", "pink");
                  })
                  .on("drop", function (e, dd) {
                    if (dd.mode != "recycle") {
                      return;
                    }
                    var rowsToDelete = dd.rows.sort().reverse();
                    for (var i = 0; i < rowsToDelete.length; i++) {
                      data.splice(rowsToDelete[i], 1);
                    }
                    grid.invalidate();
                    grid.setSelectedRows([]);
                  });
              grid.onAddNewRow.subscribe(function (e, args) {
                var item = {name: "New task", complete: false};
                $.extend(item, args.item);
                data.push(item);
                grid.invalidateRows([data.length - 1]);
                grid.updateRowCount();
                grid.render();
              });
            //end move row

            // wire up model events to drive the grid
            dataView.onRowCountChanged.subscribe(function (e, args) {
              grid.updateRowCount();
              grid.render();
            });
            dataView.onRowsChanged.subscribe(function (e, args) {
             grid.invalidateRows(args.rows);
             grid.render();
            });

            //search box
            dataView.onPagingInfoChanged.subscribe(function (e, pagingInfo) {
              grid.updatePagingStatusFromView( pagingInfo );
            });

            // wire up the search textbox to apply the filter to the model
            $("#txtSearch").keyup(function (e) {
              Slick.GlobalEditorLock.cancelCurrentEdit();
              // clear on Esc
              if (e.which == 27) {
                this.value = "";
              }
              searchString = this.value;
              updateFilter();
            });

            function updateFilter() {
              dataView.setFilterArgs({
                //percentCompleteThreshold: percentCompleteThreshold,
                searchString: searchString
              });
              dataView.refresh();
            }
            /*$("#btnSelectRows").click(function () {
              if (!Slick.GlobalEditorLock.commitCurrentEdit()) {
                return;
              }
              var rows = [];
              for (var i = 0; i < 10 && i < dataView.getLength(); i++) {
                rows.push(i);
              }
              grid.setSelectedRows(rows);
            });*/

            // initialize the model after all the events have been hooked up
            dataView.beginUpdate();
            dataView.setItems(data);
            dataView.setFilterArgs({
              //percentCompleteThreshold: percentCompleteThreshold,
              searchString: searchString
            });
            //dataView.setFilter(myFilter);
            dataView.setFilterArgs(0);
            dataView.endUpdate();

            // if you don't want the items that are not visible (due to being filtered out
            // or being on a different page) to stay selected, pass 'false' to the second arg
            dataView.syncGridSelection(grid, true);

            $("#gridContainer").resizable();
          })

        }//end of populateTable function

}//end of retrieveData function


var here = false;
var t = 0;
function flattenObjectJSON(response){
  // console.log("INSER FLATT");
  var toReturn = {};

  for (var i in response) {
    //if (!response.hasOwnProperty(i))
      //continue;

    if ((typeof response[i]) == 'object') {
      //console.log("object: ",response[i]);
      var flatObject = flattenObjectJSON(response[i]);
      for (var x in flatObject) {

        //if (!flatObject.hasOwnProperty(x))
          //continue;
        var n = i.split('.');
        // console.log("x: ",x);
        // console.log("n: ",n);
        if(!isNaN(Number(n))){
          //toReturn[x] = flatObject[x];
          //if(!x.includes('[j]')){
          toReturn['[j].'+x] = flatObject[x];
        //  }else{
        //    toReturn[x] = flatObject[x];
        //  }
        }else{
            if(x.startsWith("[j]")){
              toReturn[i] = flatObject[x];//new added
              toReturn[i + x] = flatObject[x];
            }else{
              toReturn[i] = flatObject[x];//new added
              toReturn[i + '.' + x] = flatObject[x];
            }
        }
      }
    } else {
      toReturn[i] = response[i]; //"";
    }
  }


  var strObj = JSON.stringify(toReturn);
  var strObj2 = strObj.replace(".[j]", "[j]")
// console.log("INSER FLATT OBJECT: ",strObj2);
  return JSON.parse(strObj2);
}



/* //OLD

function flattenObjectJSON(response){
  var toReturn = {};

  for (var i in response) {
    //if (!response.hasOwnProperty(i))
      //continue;

    if ((typeof response[i]) == 'object') {
      //console.log("object: ",response[i]);
      var flatObject = flattenObjectJSON(response[i]);
      for (var x in flatObject) {
        //if (!flatObject.hasOwnProperty(x))
          //continue;
        var n = i.split('.');
        if(!isNaN(Number(n))){
          toReturn['[j].'+x] = flatObject[x];
        }else{
            if(x.startsWith("[j]")){
                toReturn[i + x] = flatObject[x];
            }else{
                toReturn[i + '.' + x] = flatObject[x];
            }
        }
      }
    } else {
      toReturn[i] = "";
    }
  }

  var strObj = JSON.stringify(toReturn);
  var strObj2 = strObj.replace(".[j]", "[j]")

  return JSON.parse(strObj2);
}

*/
/*
function flattenObjectJSON(response){
  //console.log("response");
  var toReturn = {};

  for (var i in response) {
    //console.log("i: ", i)
    if (!response.hasOwnProperty(i))
      continue;

    if ((typeof response[i]) == 'object') {
      var flatObject = flattenObjectJSON(response[i]);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x))
          continue;
        var n = i.split('.');
        var j = i+1;
        var n1 = j.split('.');
        //console.log("PRINT AFTER DOT: ", i.split('.'))
        if(!isNaN(Number(n))){
          //console.log("THIS IS A NUMBER!!! ",n);
          //console.log("PRINT AFTER DOT: ", x)
          toReturn[x] = flatObject[x]; //toReturn['['+i+'].' + x] = flatObject[x];
        //}else if(!isNaN(Number(n1))){
          //toReturn[i+'.' + x] = flatObject[x];
        }else{
          toReturn[i + '.' + x] = flatObject[x];
        }
      }
    } else {
      toReturn[i] = response[i];
    }
  }
  return toReturn;
}
*/

var c = 1;

function addDataToDB(){

  var dObj={};

  dObj.apiName = obJSON1.title;
  dObj.title = $("#savedName").val()
  dObj.description = $("#savedDescription").val()
  //dObj.type = 'CSV';

  var array = typeof data != 'object' ? JSON.parse(data) : data;

  var str = '';

  for (var i = 0; i < array.length; i++) {
      var line = '';

      for (var index in array[i]) {
          line += array[i][index] + ',';
      }

      line.slice(0,line.Length-1);

      str += line + '\r\n';
  }

  encodedUri = "data:text/csv;charset=utf-8," + escape(str);
  dObj.urlCSV = encodedUri;

  dObj.urlJSON = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, '', 7));

  ///query stuff
  var parameters = [];
  var strQuery="";

  strQuery+=obJSON1.url
  strQuery+="?"

  for(var i=0; i<obJSON1.parameters.length; ++i){
    var v;
    strQuery+=obJSON1.parameters[i]['name']
    strQuery+="="
    if(obJSON1.parameters[i]['displayedName']){
      v = $("#"+obJSON1.parameters[i]['name']).val();
      strQuery+=$("#"+obJSON1.parameters[i]['name']).val().replace(" ", "%20");
    }else{
      v = obJSON1.parameters[i]['value'];
      strQuery+=obJSON1.parameters[i]['value'].replace(" ", "%20");
    }

    if(i+1<obJSON1.parameters.length)
      strQuery+="&"

    parameters.push({
      name: obJSON1.parameters[i]['name'],
      value: v
    });
  }
  dObj.parameters = parameters;


  //save each response displayed name and id AND if it is checked or not
  var responses = [];
  //response
  if($("input[name='checkbox-w']").is(":checked")){
      $("input[name='checkbox-w']").each(function(){
        if(this.checked){
        responses.push({
          parameter: this.id,
          displayedName: this.value,
          isChecked:true
        });
      }else{
        responses.push({
          parameter: this.id,
          displayedName: this.value,
          isChecked:false
        });
      }
    });
  }

  dObj.responses = responses;

  dObj.queryLink = strQuery;

  firebase.auth().onAuthStateChanged(function (user) {
    if(user){
      console.log("CURRENT USER: ",user.uid);

      firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
        var displayName = snapshot.val().name;
        console.log("NAME: ", displayName);
        $("#SignupLogin").html(displayName);
        //save the saved query in the firebase
        //firebase.database().ref('users/'+ user.uid+'/savedFiles/' + $("#savedName").val()).set(JSON.parse(JSON.stringify(dObj)));
        firebase.database().ref('users/'+ user.uid+'/savedData/' + $("#savedName").val()).set(JSON.parse(JSON.stringify(dObj)));

        console.log("addedFile");


      });
    }
    else{
      //window.alert("No USER")
    }
  });
  //IF public add the to the public savedQueries and allow users to search for these queries!
  if(document.getElementById("publicData").checked==true){
    //console.log("saved publicly")
    firebase.database().ref('publicSavedData/' + $("#savedName").val()).set(JSON.parse(JSON.stringify(dObj)));
  }
}



function DownloadJSON2CSV(){
        var array = typeof data != 'object' ? JSON.parse(data) : data;
        var str = '';

        for (var i = 0; i < array.length; i++) {
            var line = '';

            for (var index in array[i]) {
                line += array[i][index] + ',';
            }

            line.slice(0,line.Length-1);
            str += line + '\r\n';
        }
        window.open( "data:text/csv;charset=utf-8," + escape(str))
}


function viewTable(){
  $('#myTree').hide();
  $('#myList').hide();
  $("#myGrid").show();
  $("#pager").show();
  $("#editModal").show();
  $("#CSV").show();
  $("#Save-Data").show();
  $("#JSON").show();
  $("#HTML").hide();}

function viewTree(){
  $('#myTree').show();
  $('#myList').hide();
  $("#myGrid").hide();
  $("#pager").hide();
  $("#editModal").hide();
  $("#CSV").show();
  $("#JSON").show();
  $("#HTML").hide();
}

function viewList(){
  $('#myTree').hide();
  $('#myList').show();
  $("#myGrid").hide();
  $("#pager").hide();
  $("#editModal").hide();
  $("#CSV").show();
  $("#JSON").show();
  $("#HTML").show();
}


//Copy HTML
function copyHTML(){
  var a = document.getElementById("tableViewContainer").appendChild(document.createElement("a"));
  a.download = "export.html";
  a.href = "data:text/html," + document.getElementById("myList").innerHTML;
  a.click();
}


$("#groupByFilterSelect").change(function() {
    var str = "";
    $( "#groupByFilterSelect option:selected" ).each(function() {
      str += $(this).text() + " ";
    });

    if(str == "Channel Title "){
      groupByChannelTitle();
    }else if(str == "Published At "){
      groupByDate();
    }else if("Channel Title Published At " || "Published At Channel Title "){
      groupByChannelTitleDate();
    }else if(str==" "){
      degroupBy();
    }

  }).trigger("change");

function degroupBy(){
  dataView.setGrouping([]);
  $('#groupByFilterSelect').val([]);
}


//request functions
function addRow() {
  $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name" placeholder=""></td><td><input class="form-control" type="text" id="value" placeholder=""></td><td><input class="form-control" type="text" id="listOfValues" placeholder=""></td><td><div><input id="displayedName" class="form-control" type="text"></div></td><td><input class="form-control" type="text" id="desc"></td><td><select class="form-control" id="type" style="height:30px"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');
}


function deleteRow(row) {
  var i = row.parentNode.parentNode.rowIndex;
  document.getElementById('requestTabel').deleteRow(i);
}

// function deleteRowAccountTable(row,name) {
//   console.log("ROW id: ", name.id);
//   var i = row.parentNode.parentNode.rowIndex;
//   document.getElementById('query_table_content').deleteRow(i);
//
//   //remove it from firebase
//   firebase.database().ref('savedQueries/' + name.id).remove();
// }

function deleteRowAccountTableFiles(row,name) {
  console.log("ROW id: ", name.id);
  var i = row.parentNode.parentNode.rowIndex;
  document.getElementById('data_table_content').deleteRow(i);

  firebase.auth().onAuthStateChanged(function (user) {
    if(user){
      //private account data "account"
      firebase.database().ref('users/'+ user.uid+'/savedData/'+name.id).remove();
      //public saved data
      firebase.database().ref('publicSavedData/'+name.id).remove();
    }//user
  });

  //window.location.href='account.html';
}


//response functions
function addRowResponse() {
  $("#responseTabel tbody").append('<tr><td><input class="form-control" type="text" id="name" placeholder=""></td><td><select class="form-control" id="type" style="height:30px"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><div><input id="displayedName" class="form-control" type="text"></div></td><td><input class="form-control" type="text" id="path" placeholder=""></td><td><input class="form-control" type="text" id="desc" placeholder=""></td><td><div><input id="default" value="" class="checkbox-style" name="" type="checkbox"  autocomplete=“off” checked></div></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRowResponse(this)"</td></tr>');
}

function deleteRowResponse(row) {
  var i = row.parentNode.parentNode.rowIndex;
  document.getElementById('responseTabel').deleteRow(i);
}


//retrieve JSON schema for the chosen "clicked on" API


var fields_paths=[];

function showResponseSchema(){

  //$("#fields").empty();
  $("#jsonSample").empty();
  $("#jsoneditor").empty();

  var final_tree = [];
  fields_paths=[];

  myObj = {};
  //(1) info
  myObj.title = $("#title").val();
  myObj.version=$("#version").val();
  myObj.description=$("#description").val();
  myObj.type=$("#type").val();
  myObj.url=$("#url").val();
  myObj.key=$("#key").val();
  //pagination
  //common
  myObj.resPerPageParam=$("#result_param").val();
  //myObj.defResPerPage=$("#result_default").val();
  myObj.maxResPerPage=$("#result_max").val();
  //indexed pagination
  myObj.indexPage=$("#index_param").val();
  //sequential pagination
  myObj.currPageParam=$("#cur_page_param").val();
  myObj.nextPageParam=$("#next_page_param").val();
  //We should add parameters names to the request parameters


  var parameters = [];

        $('#requestTabel tbody tr').each(function(i, n){
          var $row = $(n);
            parameters.push({
                name:          $row.find('#name:eq(0)').val(),
                value:         $row.find('#value:eq(0)').val(),
                //multi:         $row.find('#multi:eq(0)').is(":checked"),
                listOfValues:  $row.find('#listOfValues:eq(0)').val(),
                //display:       $row.find('#display:eq(0)').is(":checked"),
                displayedName: $row.find('#displayedName:eq(0)').val(),
                //element:       $row.find('#element:eq(0)').val(),
                description:   $row.find('#desc:eq(0)').val(),
                type:          $row.find('#type:eq(0)').val()
                //required:      $row.find('#required:eq(0)').is(":checked")
            });
        });
   //(2) request parameters
        myObj.parameters = parameters;
        var paths = [];
        var pathsID = [];
        var pathsNames = [];
        var output;

    //(3) get the JSON schema
        $.ajax({
          url: myObj.url,
          data: myObj.parameters,
          dataType: 'jsonp',
          method: 'GET',
          success: function (response) {

            //console.log("response in showRequest!!: ",JSON.stringify(response));
            var objJSONOBJ = flattenObjectJSON(response);
            //console.log("flattenObjectJSON: ",objJSONOBJ);

            var objJSONOBJ2 = Object.getOwnPropertyNames(objJSONOBJ);
            //console.log("getOwnPropertyNames: ",objJSONOBJ2);

            //JSON Response Using JSONEDITOR
            var container, options, json, editor;

            container = document.getElementById('jsoneditor');

            options = {
              mode: 'view',
              modes: ['code', 'form', 'text', 'tree','view'],
              ace: ace,
              onError: function (err) {
                alert(err.toString());
              },
              onChange: function () {
                //console.log('change');
              },
              onModeChange: function (mode) {
                var treeMode = document.getElementById('treeModeSelection');
                var textMode = document.getElementById('textModeSelection');

                treeMode.style.display = textMode.style.display = 'none';

                if (mode === 'code' || mode === 'text') {
                  textMode.style.display = 'inline';
                } else {
                  treeMode.style.display = 'inline';
                }
              },
              indentation: 4,
              escapeUnicode: true,
              // onTextSelectionChange: function(start, end, text) {
              //   var rangeEl = document.getElementById('textRange');
              //   rangeEl.innerHTML = 'start: ' + JSON.stringify(start) + ', end: ' + JSON.stringify(end);
              //   var textEl = document.getElementById('selectedText');
              //   //var t = textEl.split(":");
              //   textEl.innerHTML = JSON.stringify(text);
              //   console.log(text);
              // },

              onTextSelectionChange: function(start, end, text) {
                var rangeEl = document.getElementById('textRange');
                rangeEl.innerHTML = 'start: ' + JSON.stringify(start) + ', end: ' + JSON.stringify(end);
                var textEl = document.getElementById('selectedText');
                //var t = textEl.split(":");
                textEl.innerHTML = text;
                //console.log("Text: ", text);
              },
              onSelectionChange: function(start, end) {
                var nodesEl = document.getElementById('selectedNodes');
                nodesEl.innerHTML = '';
                if (start) {
                  nodesEl.innerHTML = ('start: '  + JSON.stringify(start));
                  if (end) {
                    nodesEl.innerHTML += ('<br/>end: '  + JSON.stringify(end));
                  }
                }
              },
              onEvent: function(node, event) {
                if (event.type === 'click') {
                  var textEl = document.getElementById('selectedText');
                  //var t = textEl.split(":");
                  //textEl.innerHTML = JSON.stringify(node.field);
                  //console.log(node.field);
                  // var message = 'click on <' + node.field +
                  //   '> under path <' + node.path +
                  //   '> with pretty path: <' + prettyPrintPath(node.path) + '>';
                  if (node.value) message += ' with value <' + node.value + '>';
                  //console.log("Field: ", node.field);
                  //console.log("Path: ", prettyPrintPath(node.path));//message);
                  var paramValue = eval("response."+prettyPrintPath(node.path));
                  //console.log("Value: ",paramValue);//response.items[0].volumeInfo.authors); //eval("response."+node.path));

                  if(paramValue instanceof Array){
                    //console.log("Array");
                    for(var i=0; i< paramValue.length; ++i){
                      //console.log(paramValue[i]);
                    }

                  }else{
                    //console.log("NOT Array");
                  }

                  fields_paths.push(node.field+"#"+prettyPrintPath(node.path));
                  console.log("fields_paths: ",fields_paths);
                }



                if (event.type === 'delete') {
                  //console.log("removed!");
                }
                function prettyPrintPath(path) {
                  var str = '';
                  for (var i=0; i<path.length; i++) {
                    var element = path[i];
                    if (typeof element === 'number') {
                      str += '[' + element + ']'
                    } else {
                      if (str.length > 0) str += '.';
                      str += element;
                    }
                  }
                  return str;
                }
              }

            };

            json = response;

            window.editor = new JSONEditor(container, options, json);

            //console.log('json', json);
            //console.log('string', JSON.stringify(json));


            for(var y=0; y<objJSONOBJ2.length; ++y){
              paths.push(objJSONOBJ2[y].replace("[j].", ".")); //arrays of paths to json schema
              pathsID.push(objJSONOBJ2[y]);
            }

            //convert array of paths (paths) to JSON
            var parsePathArray = function() {
                var parsed = {};
                for(var i = 0; i < paths.length; i++) {
                    var position = parsed;
                    var split = paths[i].split('.');
                    for(var j = 0; j < split.length; j++) {
                        if(split[j] !== "") {
                            if(typeof position[split[j]] === 'undefined' || position[split[j]] === "")
                            	if(j+1<split.length)
                            		position[split[j]] = {};
                              else
                              	position[split[j]] = "";
                            position = position[split[j]];
                        }
                    }
                }
                return parsed;
            }

            //begin of treeview
            var json =  parsePathArray();
            //console.log("parsePathArray: ", json);
            var tree = [];
            var final_tree = [];

            //called with every property and its value
            function process(key, value) {
                //console.log(key + " : "+value);
            }

            idcounter = 0;
            parentid_array = [];
            parentid_array[0] = 0;

            function traverse(o, func) {
                for (var i in o) {
                    func.apply(this, [i, o[i]]);
                    if (o[i] !== null && typeof(o[i]) == "object") {
                        //going one step down in the object tree
                        var obj = {};
                        obj["name"] = i;
                        obj["id"] = idcounter;
                        obj["parentid"] = parentid_array[parentid_array.length - 1];
                        obj["children"] = [];
                        tree.push(obj);
                        parentid_array.push(idcounter)
                        idcounter++;
                        traverse(o[i], func);
                    } else {
                        var obj = {};
                        obj["name"] = i;
                        obj["id"] = idcounter;
                        obj["parentid"] = parentid_array[parentid_array.length - 1];
                        obj["children"] = [];
                        tree.push(obj);
                        idcounter++;
                    }
                }
                parentid_array.pop()
            }

            function traverse2(o, func, parentid, currentitem) {
                if (o["id"]) {
                    if (o["id"] == parentid) {
                        o["children"].push(currentitem)
                    }
                }

                for (var i in o) {

                    func.apply(this, [i, o[i]]);
                    if (o[i] !== null && typeof(o[i]) == "object") {
                        //going one step down in the object tree
                        traverse2(o[i], func, parentid, currentitem);
                    }
                }
                parentid_array.pop()
            }

            traverse(json, process);

            for (var counter = 0; counter < tree.length; counter++) {
                if (tree[counter]["parentid"] == 0) {
                    final_tree.push(tree[counter])
                } else {
                    traverse2(final_tree, process, tree[counter]["parentid"], tree[counter]);
                }
            }

            var expandAll = document.getElementById('expandAll');
            var collapseAll = document.getElementById('collapseAll');
            //var submit = document.getElementById('submit');

            var t = new TreeView(final_tree, 'tree');
            var ids = 0;

            $('.tree-leaf-text').each(function() {
                ids++;
                $(this).prepend('<input id="' + ids + '" class="dynamically_added_checkbox" type="checkbox" name="checkbox-1" value='+$(this).text()+"#"+pathsID[ids-1]+'>&nbsp;');//autocomplete="off"
                //$(this).replaceWith('<input id="' + ids + '" class="dynamically_added_checkbox" type="checkbox" name="checkbox-1" value='+$(this).text()+"#"+pathsID[ids-1]+'>'+$(this).text()+'');//autocomplete="off"
            });

            // Attach events

            function selectnode(id) {
                var apenstr = "";
                $("#" + id).parents(".tree-leaf").each(function() {
                    if (apenstr == "") {
                        apenstr = $(this).find('.tree-leaf-text').eq(0).text()
                     } else {
                        apenstr = apenstr//jQuery(this).find('.tree-leaf-text').eq(0).text()// + "." + apenstr
                     }
                });
                //jQuery("#" + id).parents(".tree-leaf-text").eq(0).append('&nbsp&nbsp<span id="responce" class="badge badge-success" value='+apenstr+'>' + apenstr + '</span>');//badge badge-success
            }

            function checkChildren(node){
              if(node.children.length>0){
                for(var c=0; c<node.children.length; ++c){
                  checkChildren(node.children[c]);
                  $("input[name='checkbox-1']")[node.children[c].id].checked=true;
                  $("#" + (node.children[c].id+1)).parents(".tree-leaf-text").eq(0).children('#responce').eq(0).remove();
                  var splitVal = $("#" + (node.children[c].id+1)).attr("value").split('#');
                  //$("#" + (node.children[c].id+1)).parents(".tree-leaf-text").eq(0).append('<span id="responce" class="badge badge-pill badge-success" onclick="removeCheckedResponseField(this,'+node.children[c].id+')">' +splitVal[0]+ '<i class="glyphicon glyphicon-remove"></i></span>');
                  $("#fields tbody").append('<tr id="'+node.children[c].id+'"><td><a id="'+node.children[c].id+'" class="button button-mini button-circle button-reveal button-xsmall button-yellow tright" style="height:25px" onclick="removeCheckedResponseField(this,'+node.children[c].id+')"><i class="glyphicon glyphicon-remove"></i><span>' +splitVal[0]+'</span></a></td></tr>');
                  //<h4><span id="responce" class="badge badge-pill badge-success" onclick="removeCheckedResponseField('+node.children[c].id+')">' +splitVal[0]+ '<i class="glyphicon glyphicon-remove"></i></span></h4>');
                }
              }
            }

            function unCheckChildren(node){
              $("#" + (node.id+1)).parents(".tree-leaf-text").eq(0).children('#responce').eq(0).remove();
              //document.getElementById('fields').deleteRow(node.id);
              $('tr[id="'+node.id+'"').remove();
              //console.log("NODE: ", node.id);
              if(node.children.length>0){
                for(var c=0; c<node.children.length; ++c){
                  $('tr[id="'+node.children[c].id+'"').remove();
                  unCheckChildren(node.children[c]);
                  $("input[name='checkbox-1']")[node.children[c].id].checked=false;
                }
              }
            }

          function getObject(o, id) {
              if(o.id === id){
                return o;
              }
              var result, p;
              for (p in o) {
                  if( o.hasOwnProperty(p) && typeof o[p] === 'object' ) {
                      result = getObject(o[p], id);
                      if(result){
                          return result;
                      }
                  }
              }
              return result;
          }



            $("input[name='checkbox-1']").change(function() {
                if ($(this).is(":checked")) { //ADD a badge with the name of response parameter
                  var o = getObject(final_tree,$(this).attr("id")-1);
                  var splitVal = $(this).attr("value").split('#');
                  $("#fields tbody").append('<tr id="'+o.id+'"><td><a id="'+o.id+'" onclick="removeCheckedResponseField(this, '+o.id+')" class="button button-mini button-circle button-reveal button-xsmall button-yellow tright" style="height:25px"><i class="glyphicon glyphicon-remove"></i><span>' +splitVal[0]+'</span></a></td></tr>');
                  checkChildren(o);
                  selectnode($(this).attr("id"))

                } else { //REMOVE a badge with the name of response parameter
                  unCheckChildren(getObject(final_tree,$(this).attr("id")-1));
                }
            });
        }
      });

      //console.log("DATA2: ",data2);
      final_tree2 = final_tree;
}



function removeCheckedResponseField(row, id){
  //console.log("ROW: ", row.parentNode.parentNode.rowIndex);
  $("input[name='checkbox-1']")[id].checked=false;
  if(!$("input[name='checkbox-1']")[id].checked){
    $("#" + (id+1)).parents(".tree-leaf-text").eq(0).children('#responce').eq(0).remove();
    var i = row.parentNode.parentNode.rowIndex;
    document.getElementById('fields').deleteRow(i);
  }

}


var first_time=true;

function populateDocs(){
  prettierURL();
}

function callFirebase(){
  prettierURL();
  registration();
}

function signOutFunction(){
  firebase.auth().signOut();
}

function callFirebaseForRegistration(){
  prettierURL();
  registration();
  initApp();

  /**
   * Handles the sign in button press.
   */
  function toggleSignIn() {
    if (firebase.auth().currentUser) {
      // [START signout]
      firebase.auth().signOut();
      // [END signout]
    } else {
      var email = document.getElementById('email').value;
      var password = document.getElementById('password').value;
      //var displayName = document.getElementById('displayName').value;

      if (email.length < 4) {
        alert('Please enter an email address.');
        return;
      }
      if (password.length < 4) {
        alert('Please enter a password.');
        return;
      }
      // Sign in with email and pass.
      // [START authwithemail]
      firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // [START_EXCLUDE]
        if (errorCode === 'auth/wrong-password') {
          alert('Wrong password.');
        } else {
          alert(errorMessage);
        }
        console.log(error);
        document.getElementById('quickstart-sign-in').disabled = false;
        window.location='account.html';
        // [END_EXCLUDE]
      });
      // [END authwithemail]

      window.location.herf='index.html';


    }

    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
      // [START_EXCLUDE silent]
      //document.getElementById('quickstart-verify-email').disabled = true;
      //$('#profile').show()
      //$('#profile').append("<p>Hello Tarfah!</p>");
      // [END_EXCLUDE]
      if (user) {
        // User is signed in.
        //var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
        // [START_EXCLUDE]


        //writeUserData(user.uid, document.getElementById('displayName').value, user.email);

        //document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
        document.getElementById('quickstart-sign-in').textContent = 'Sign out';
        //show the sign out button
        $('#acc').show();
        $('#signout').show();
        //console.log(JSON.stringify(user, null, '  '));
        //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
        if (!emailVerified) {
          //document.getElementById('quickstart-verify-email').disabled = false;
        }

        firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
          var displayName = snapshot.val().name;
          console.log("NAME: ", displayName);
          $("#SignupLogin").html(displayName);
        });


        // [END_EXCLUDE]
      } else {
        // User is signed out.
        // [START_EXCLUDE]
        //document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
        document.getElementById('quickstart-sign-in').textContent = 'Sign in';
        //document.getElementById('quickstart-account-details').textContent = 'null';
        // [END_EXCLUDE]

        $("#SignupLogin").html('Sign in');

      }
      // [START_EXCLUDE silent]
      document.getElementById('quickstart-sign-in').disabled = false;
      // [END_EXCLUDE]
    });

    document.getElementById('quickstart-sign-in').disabled = true;

  }

  /**
   * Handles the sign up button press.
   */
  var displayName = "";
  function handleSignUp() {
    var email = document.getElementById('email1').value;
    var password = document.getElementById('password1').value;
    displayName = document.getElementById('displayName1').value;

    if (email.length < 4) {
      alert('Please enter an email address.');
      return;
    }
    if (password.length < 4) {
      alert('Please enter a password.');
      return;
    }
    // Sign in with email and pass.
    // [START createwithemail]
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/weak-password') {
        alert('The password is too weak.');
      } else {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END createwithemail]


    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
      // [START_EXCLUDE silent]
      //document.getElementById('quickstart-verify-email').disabled = true;
      //$('#profile').show()
      //$('#profile').append("<p>Hello Tarfah!</p>");
      // [END_EXCLUDE]
      if (user) {
        // User is signed in.
        //var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
        // [START_EXCLUDE]


        writeUserData(user.uid, document.getElementById('displayName1').value, user.email);

        //document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
        document.getElementById('quickstart-sign-in').textContent = 'Sign out';
        //console.log(JSON.stringify(user, null, '  '));
        //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
        if (!emailVerified) {
          //document.getElementById('quickstart-verify-email').disabled = false;
        }

        firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
          var displayName = snapshot.val().name;
          console.log("NAME: ", displayName);
          $("#SignupLogin").html(displayName);
        });


        // [END_EXCLUDE]
      } else {
        // User is signed out.
        // [START_EXCLUDE]
        //document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
        document.getElementById('quickstart-sign-in').textContent = 'Sign in';
        //document.getElementById('quickstart-account-details').textContent = 'null';
        // [END_EXCLUDE]

        $("#SignupLogin").html('Sign in');

      }
      // [START_EXCLUDE silent]
      document.getElementById('quickstart-sign-in').disabled = false;
      // [END_EXCLUDE]
    });
  }

  /**
   * Sends an email verification to the user.
   */
  function sendEmailVerification() {
    // [START sendemailverification]
    firebase.auth().currentUser.sendEmailVerification().then(function() {
      // Email Verification sent!
      // [START_EXCLUDE]
      alert('Email Verification Sent!');
      // [END_EXCLUDE]
    });
    // [END sendemailverification]
  }

  function sendPasswordReset() {
    var email = document.getElementById('email').value;
    // [START sendpasswordemail]
    firebase.auth().sendPasswordResetEmail(email).then(function() {
      // Password Reset Email Sent!
      // [START_EXCLUDE]
      alert('Password Reset Email Sent!');
      // [END_EXCLUDE]
    }).catch(function(error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // [START_EXCLUDE]
      if (errorCode == 'auth/invalid-email') {
        alert(errorMessage);
      } else if (errorCode == 'auth/user-not-found') {
        alert(errorMessage);
      }
      console.log(error);
      // [END_EXCLUDE]
    });
    // [END sendpasswordemail];
  }

  /**
   * initApp handles setting up UI event listeners and registering Firebase auth listeners:
   *  - firebase.auth().onAuthStateChanged: This listener is called when the user is signed in or
   *    out, and that is where we update the UI.
   */
  function initApp(){

    // [END authstatelistener]

    document.getElementById('quickstart-sign-in').addEventListener('click', toggleSignIn, false);
    document.getElementById('quickstart-sign-up').addEventListener('click', handleSignUp, false);
    //document.getElementById('quickstart-verify-email').addEventListener('click', sendEmailVerification, false);
    //document.getElementById('quickstart-password-reset').addEventListener('click', sendPasswordReset, false);



    // Listening for auth state changes.
    // [START authstatelistener]
    firebase.auth().onAuthStateChanged(function(user) {
      // [START_EXCLUDE silent]
      //document.getElementById('quickstart-verify-email').disabled = true;
      //$('#profile').show()
      //$('#profile').append("<p>Hello Tarfah!</p>");
      // [END_EXCLUDE]
      if (user) {
        // User is signed in.
        //var displayName = user.displayName;
        var email = user.email;
        var emailVerified = user.emailVerified;
        // var photoURL = user.photoURL;
        // var isAnonymous = user.isAnonymous;
        // var uid = user.uid;
        // var providerData = user.providerData;
        // [START_EXCLUDE]

//        writeUserData(user.uid, document.getElementById('displayName').value, user.email);

        //document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
        document.getElementById('quickstart-sign-in').textContent = 'Sign out';
        //console.log(JSON.stringify(user, null, '  '));
        //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
        if (!emailVerified) {
          //document.getElementById('quickstart-verify-email').disabled = false;
        }

        firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
          var displayName = snapshot.val().name;
          console.log("NAME: ", displayName);
          $("#SignupLogin").html(displayName);
        });


        // [END_EXCLUDE]
      } else {
        // User is signed out.
        // [START_EXCLUDE]
        //document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
        document.getElementById('quickstart-sign-in').textContent = 'Sign in';
        //document.getElementById('quickstart-account-details').textContent = 'null';
        // [END_EXCLUDE]

        $("#SignupLogin").html('Sign in');

      }
      // [START_EXCLUDE silent]
      document.getElementById('quickstart-sign-in').disabled = false;
      // [END_EXCLUDE]
    });

  }

  function writeUserData(userId, name, email) {
    firebase.database().ref('users/' + userId).set({
      userId: userId,
      email: email,
      name:name
      //some more user data
    });
  }


}

function reviewAPIIntegration(){ //Review? show all information in 3 squares to edit

// //YES HERE
//   var start = 0;
//   var objData={};
//   data2 = [];
//
//   objData["id"]= start;
//
//
//
//   for(var j=0; j<fields_paths.length; ++j){
//         var f = fields_paths[j].split('#');
//         var id = fields_paths[j][0];//this.value;
//         // if(this.value=="videoId"){
//         //   objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
//         // }else{
//           //if array, add them to the same line and seperate them with a comma (e.g. authors: tom, jerry, eric)
//         objData[id] = eval("response."+prettyPrintPath(fields_paths[j][1]));
//         //}
//       }
//       //});
//   //  }
//   function prettyPrintPath(path) {
//     var str = '';
//     for (var i=0; i<path.length; i++) {
//       var element = path[i];
//       if (typeof element === 'number') {
//         str += '[' + element + ']'
//       } else {
//         if (str.length > 0) str += '.';
//         str += element;
//       }
//     }
//     return str;
//   }
//
//   data2.push(objData);
//   obj.lists=[];
//   obj.lists.push(objData);
//
//   console.log("Data2: ", data2);

  var responses = [];
      //(4) responses
      for(var j=0; j<fields_paths.length; ++j){
              var f = fields_paths[j].split('#');
              var name = f[0];//this.value;
              var value1 =  f[1].replace(/[0-9]/, "j"); // /([0]/, replacer
              var value = value1.replace("[0]", "[i]");
              console.log("value replaced: ", value);

              responses.push({
                displayedName: name,
                parameter: value//.split('[j]').join('*')
              });
              // if(this.value=="videoId"){
              //   objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
              // }else{
                //if array, add them to the same line and seperate them with a comma (e.g. authors: tom, jerry, eric)
              //objData[id] = eval("response."+prettyPrintPath(f[1]));
              //}
            }


//OLD WAY
    //   if($("input[name='checkbox-1']").is(":checked")){
    //       $("input[name='checkbox-1']:checked").each(function(){
    //         var splitVal = this.value.split('#');
    //         var name = splitVal[0];
    //         var value = splitVal[1];
    //         responses.push({
    //           displayedName: name,
    //           parameter: value//.split('[j]').join('*')
    //         });
    //       });
    // }


    //HERE NEW

    console.log("responses: ", myObj);
    myObj.responses = responses;

    var api_title = myObj.title.split(' ').join('_');

    //if(first_time){
      // save myObj to FireBase DB
      if($("#url").val()){
      firebase.database().ref('apis/' + $("#title").val()).set(JSON.parse(JSON.stringify(myObj)));
    }else{//do nothing
    }
      first_time=false;
    //  }//else{
    //   firebase.database().ref('apis/' + $("#title").val()).set(JSON.parse(JSON.stringify(myObj)));
    // }
    $("#previewAPIIntegration").empty();
    $("#previewAPIIntegration").append("<div class='box' style='border: 1px solid gray;'><iframe src='data-management-review.html?api="+api_title+"' width = '100%' height= '440px'></iframe><div>");
}


function saveAPI(){
  window.location.href='data-management.html?api='+ myObj.title.replace(" ", "_");//api title firebase.database().ref('apis/' + $("#title").val())
  //document.getElementById("jsonSchema").innerHTML = JSON.stringify(myObj, '', 7);
}

function cancelAPI(){
  //firebase.initializeApp(config);
  console.log("title:", firebase.database().ref('apis/'+ myObj.title));
  firebase.database().ref('apis/'+ myObj.title).remove();
}

function submitRequestSchema(){
  var str = myObj.title;
  var api_title = str.split(' ').join('_');
  window.location.href='data-management.html?api='+api_title;
}



function populateListOfAPIs(){

  prettierURL();
  registration();

  firebase.database().ref('/apis/').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) { //for each API
      if(childSnapshot.val().title != undefined){
        console.log(childSnapshot.val().title);
        var str = childSnapshot.val().title;
        var api_title = str.split(' ').join('_');
        $("#apis_list").append("<option id="+api_title+">"+childSnapshot.val().title+"</option>");
      }
    });
  });
}

// $('input[name="checkbox-w"]').on('change', function () {
//     retrieveData();
// })

function apiHasBeenChosen(select){
//alert(select.options[select.selectedIndex].getAttribute("myid"));
var str = select.options[select.selectedIndex].getAttribute("id");
var api_title = str.split('_').join(' ');

console.log("selected: ", api_title);
window.location.href='data-management.html?api='+str;
}

function callGitHub(u){
  console.log("URL: ", u);
  var objJSON = [];

  //for(var i=0; i<5; ++i){
  var pageGit = 5;
  var i = 0;

  getTheNextPageGitHub(pageGit, i)

  function getTheNextPageGitHub(pageGit, i){
    if(i<pageGit){
    var par = {
      "q" : u,
      "access_token" : '9b670443489b576acd26c944d064f5d675998b54',
      "page":i,
      "per_page" : 100 //maximum results we can get from github
    }

    $.ajax({ //https://api.github.com/search/code?q=https://www.googleapis.com/youtube/v3/search&access_token=9b670443489b576acd26c944d064f5d675998b54
          beforeSend: function(request) {
	        request.setRequestHeader("Accept", "application/vnd.github.v3.text-match+json");
    	    },
    	    dataType: "json",
          url: 'https://api.github.com/search/code',
          data: par,
          //method: 'GET',
          success: function (response) {
            console.log("RESPONSE: ",response);//.text_matches[0].fragment)
            for(var n=0; n<response.items.length; ++n){
              for(var m=0; m<response.items[n].text_matches.length; ++m){
                objJSON.push(response.items[n].text_matches[m].fragment);
              }
            }

          }//response function
        });//ajax
        ++i;
        getTheNextPageGitHub(pageGit, i);//call until it goes through the 5 pages
      }else{
        //appendJSON(objJSON,response);
        var c = 0;
        var arrParamVal = [];

          setTimeout(function(){
            //console.log("LENGTH: ",objJSON.length);
          for(var i=0; i<objJSON.length; ++i){
            var str= JSON.stringify(objJSON[i], '', 7);
            if(str.includes(u+"?")){
              //console.log(str);
              var urls = str.split(u+"?");
              var reqParameters = urls[1].split(/[^\=\&\dA-Z]/gi);
              //console.log(reqParameters[0]);
              var reqParam = reqParameters[0].split("&");
              for(var x=0; x<reqParam.length; ++x){
                //console.log(reqParam[x]);
                arrParamVal.push(reqParam[x]);
              }
            }
          }

          var ob = []

          for(var z=0; z< arrParamVal.length; ++z){
            var cnt = 0;
            for(var z1=0; z1< arrParamVal.length; ++z1){
              if(arrParamVal[z] == arrParamVal[z1]){
                ++cnt;
              }
            }
            ob.push({
              p: arrParamVal[z],
              c: cnt
            });
          }
          //console.log("OB: ", ob)
          function removeDuplicates(originalArray, prop) {
               var newArray = [];
               var lookupObject  = {};
               for(var i in originalArray) {
                  lookupObject[originalArray[i][prop]] = originalArray[i];
               }
               for(i in lookupObject) {
                   newArray.push(lookupObject[i]);
               }
                return newArray;
           }
           var uniqueArray = removeDuplicates(ob, "p");
           //console.log("uniqueArray is: ", uniqueArray);

           var ob1 = []
           for(var i=0; i<uniqueArray.length; ++i){
             var p = uniqueArray[i]['p'].split("=");
             ob1.push({
               p: p[0],
               v: p[1],
               c: uniqueArray[i]['c']
             });
           }
           //console.log("NEW Array: ", ob1);
           var tempOb = [];
           //console.log(checkValues(ob1,tempOb));
           tempOb = checkValues(ob1,tempOb);

           populateRequestParam(tempOb);

           console.log("tempOb: ",tempOb)

          function checkValues(ob1, tempOb){
            console.log("checkValues");
           for(var i=0; i<ob1.length; ++i){
             if(tempOb == undefined){
               //if empty don't do anything
             }else{//if not empty
               var exist = false;
               for(var x=0; x<tempOb.length; ++x){
                 if(ob1[i]['p'] == tempOb[x]['p']){
                   exist = true;
                 }
               }
               if(!exist){
                   var tempP = ob1[i]['p'];
                   var tempV = ob1[i]['v'];
                   var tempC = ob1[i]['c'];
                   for(var j=0; j<ob1.length; ++j){
                    if(ob1[i]['p']==ob1[j]['p'] && ob1[i]['c']<ob1[j]['c']){
                      tempC = ob1[j]['c'];
                      tempV = ob1[j]['v'];
                    }
                  }//seconf loop
                  tempOb.push({
                    p:tempP,
                    v:tempV,
                    c:tempC
                  });
                }else{

                }
             }//else
           }//first loop

           return tempOb;
          }
        }, 2000);

      }
    }//end of page loop

}//callGithub function

function populateRequestParam(list){
  console.log("populateRequestParam");
  console.log("list: ", list);

  document.getElementById('name').value = list[0]['p']
  document.getElementById('value').value =list[0]['v']

  for(var i=1; i<list.length; ++i){
    $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name" placeholder="" value="'+list[i]['p']+'"></td><td><input class="form-control" type="text" id="value" placeholder="" value="'+list[i]['v']+'"></td><td><input class="form-control" type="text" id="listOfValues" placeholder=""></td><td><div><input id="displayedName" class="form-control" type="text"></div></td><td><input class="form-control" type="text" id="desc"></td><td><select class="form-control" id="type" style="height:30px"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');
  }
}

function prettierURL(){
  var link = window.location.href;
  var url = link.split('.html');
  window.history.replaceState( null, null, url[0] );
}

function populatePublicSavedDataset(){

  //prettierURL();
  registration();
  //Files Table
  firebase.database().ref('publicSavedData/').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) { //for each saved data
      if(childSnapshot.val() != undefined){
        //console.log("VALUE: ", childSnapshot.val().description);
        var api_name = childSnapshot.val().apiName;
        var file_title = childSnapshot.val().title;
        var file_desc = childSnapshot.val().description;
        var url = childSnapshot.val().urlCSV;
        var link = childSnapshot.val().queryLink;
        var urlJ = childSnapshot.val().urlJSON;
        $("#public_data_table tbody").append('<tr><td>'+file_desc+'</td><td>'+api_name+'</td><td><a href='+url+' download="my_data.csv"><img src="images/csv-file.png" width="28px"></a> &nbsp; <a href="data:'+ urlJ +'" download="data.json"><img src="images/json-file.png" width="25px"></a> &nbsp; <a href="data-management.html?api='+api_name.replace(" ", "_")+'/#'+file_title.split(' ').join('_')+'" target="_blank"><img src="images/edit.png" width="25px"></a> &nbsp; <a target="_blank" rel="noopener noreferrer" href='+link+'><img src="images/link.png" style="top:20px; width:18px" ></a> </td> </tr>');
        // <td><img src="images/eye.png" alt="" width="15px">aa &nbsp;  <img src="images/down.png" alt="" width="15px">aa </td>
      }else{
        //////////
      }
    });
  });

}

/*
function requestAPI(url,listP){
		//YOUTUBE
		/*var listP = {
		    "maxResults": "3",
   			"part": "snippet",
   		    "q": $('#queryw').val(),
		   	"key": "AIzaSyBaJakjjAHw0wvBtELAtDLPmhq1piGWwqQ"
	  	};

	    $.ajax({
	      url: url,//'https://www.googleapis.com/youtube/v3/search',
	      data: JSON.parse(listP),
	      dataType: 'jsonp',
	      success: function (x) {
	        console.log(JSON.stringify(x, '', 7));
          return x;
	      }
	    });
}
*/



//////////////////// LOGIN
