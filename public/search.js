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
  // firebase.auth().onAuthStateChanged(function (user) {
  //   if(user){
  //     firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
  //       $("#SignupLogin").html(snapshot.val().name);
  //     });
  //
  //     $('#acc').show();
  //     $('#signout').show();
  //   }
  //   else{
  //     $("#SignupLogin").html("Sign in");
  //     document.getElementById('acc').style.visibility = 'hidden';
  //     document.getElementById('signout').style.visibility = 'hidden';
  //   }
  // });
}


function openModal(){
  $('#consentDataModal').modal('show');
}


function isSignedUp(){
  firebase.initializeApp(config);

  initApp();


  //Handles the sign in button press.

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
        // [END_EXCLUDE]
      });
      // [END authwithemail]
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
          //currUser = displayName;
          $("#SignupLogin").html(displayName);
          window.location.href='api-integration.html';
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
    var email    = document.getElementById('email1').value;
    var password = document.getElementById('password1').value;
    displayName  = document.getElementById('displayName1').value;

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

        firebase.database().ref('users/'+user.uid).set({
          userId: user.uid,
          email: user.email,
          name:displayName
          //some more user data
        });

        //document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
        document.getElementById('quickstart-sign-in').textContent = 'Sign out';
        //console.log(JSON.stringify(user, null, '  '));
        //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
        if (!emailVerified) {
          //document.getElementById('quickstart-verify-email').disabled = false;
        }

        firebase.database().ref('/users/'+user.uid).once('value').then(function(snapshot) {
          var displayName = snapshot.val().name;
          $("#SignupLogin").html(displayName);
          setTimeout(function(){
            window.location.href='api-integration.html';
          }, 1000);

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

       // writeUserData(user.uid, document.getElementById('displayName').value, user.email);

        //document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
        document.getElementById('quickstart-sign-in').textContent = 'Sign out';
        //console.log(JSON.stringify(user, null, '  '));
        //document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
        if (!emailVerified) {
          //document.getElementById('quickstart-verify-email').disabled = false;
        }

        firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
          var displayName = snapshot.val().name;
          // console.log("NAME: ", displayName);
          $("#SignupLogin").html(displayName);
        });

        $('#acc').show();
        $('#signout').show();

        $('#butDDInt').click();
        // [END_EXCLUDE]
      } else {

        // User is signed out.
        // [START_EXCLUDE]
        //document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
        document.getElementById('quickstart-sign-in').textContent = 'Sign in';
        //document.getElementById('quickstart-account-details').textContent = 'null';
        // [END_EXCLUDE]
        $('#loginModal').modal('show');
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

var logDecision="accept";
var logIntDecision="accept";

// var logDecision="decline";
// var logIntDecision="decline";


function canIntLog(dec){
  logIntDecision = dec;
  document.getElementById("myForm").style.display = "none";
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

//DAH
// var checkboxSelector = new Slick.CheckboxSelectColumn({
//   cssClass: "slick-cell-checkboxsel"
// });


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
var dataChanges = [];
var arrData2=[];


//DAH
var grid, s;
// var loader = new Slick.Data.RemoteModel();
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
  //DAH
	// editorLock: new Slick.EditorLock(),
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

// $(".grid-header .ui-icon")
// .addClass("ui-state-default ui-corner-all")
// .mouseover(function (e) {
//   $(e.target).addClass("ui-state-hover")
// })
// .mouseout(function (e) {
//   $(e.target).removeClass("ui-state-hover")
// });

var firstChecked = true;

var arrData=[];

//when any of field check box is checked\unchecked
function fieldHasBeenSelected(th, select){
  if(firstChecked){
       //retrieveData();
       arrData2 = JSON.parse( JSON.stringify( data ) );
       //console.log("arrData2: ", arrData2);
       firstChecked=false;
    }

    for(var j=0; j<data.length; ++j){
      delete data[j][select.value]; //just remove it from the UI
      delete arrData2[j][select]//actually delete it
      arrData.push({
        id:j,
        key: select,
        value: data[j][select]
      });
    }

    console.log("arrData2: ", arrData2);

  col = {};
  columns = [];
  col.columns = columns;

  col.columns.push({id: 'id', name: '#', field: 'id', behavior: 'select', width: 25, editor: Slick.Editors.Text, formatter:false, sortable: true});

  if($("input[name='checkbox-w']").is(":checked")){
      $("input[name='checkbox-w']:checked").each(function(){
        col.columns.push({id: this.id, name: this.value, field: this.value, editor: Slick.Editors.Text, sortable: true});
        //data[this.id].push(this.value);
        for(var x=0; x<data.length; ++x){
          var v=this.value;
          var i=this.id;
          arrData2[x][v]= data[x][v];//works
        }
      });
  }

  //console.log("FINAL arrData2: ", arrData2);

populateTable(data);

function populateTable(data){
  $("#jsCode").empty();

  console.log("THIS DATA: ", data)
  //pagination + response fields + headers

  jsSnippet= '<code class="language-javascript">$.ajax({</br>&nbsp;&nbsp;&nbsp;url: "'+obJSON1.url+'",</br>&nbsp;&nbsp;&nbsp;data:'+JSON.parse(JSON.stringify(listP))+',</br>&nbsp;&nbsp;&nbsp;method: "GET",</br>&nbsp;&nbsp;&nbsp;success: function (response) {</br>&nbsp;&nbsp;&nbsp;&nbsp;console.log(response);</br>&nbsp;&nbsp;&nbsp;},</br>&nbsp;&nbsp;&nbsp;error: function(response, jqXHR, textStatus, errorThrown) {</br>&nbsp;&nbsp;&nbsp;&nbsp;console.log(response.textStatus);</br>&nbsp;&nbsp;}</br>});</code>';

  pySnippet= 'import requests</br>url = "'+obJSON1.url+'" </br>querystring = '+JSON.parse(JSON.stringify(listP))+' </br>response = requests.request("GET", url, params=querystring)';

  $("#jsCode").append(jsSnippet);

  $('#myTree').empty();
  $('#myList').empty();

//ooops
        /***************** List View ******************/
        for(var j=0; j<arrData2.length; ++j){
          for(var i=1; i<col.columns.length; ++i){
            var v = col.columns[i].name;
            if(typeof arrData2[j][v] == 'string' ){
            //if(arrData2[j][v].startsWith("http")){//link
              if(arrData2[j][v].startsWith("http") && arrData2[j][v].includes(".jpg") || arrData2[j][v].includes(".png")){//image
                $("#myList").append("<label value='' style='font-size:1em; color:teal'>"+col.columns[i].name+": </label>");
                $("#myList").append("</br><img style='width:200px' src='"+arrData2[j][v]+"'></img></br>");
              }else if(arrData2[j][v].startsWith("http")){//not image
                $("#myList").append("<label value='' style='font-size:1em; cursor:pointer; color:teal'>"+col.columns[i].name+": </label>");
                $("#myList").append("<a style='color:blue' target='_blank' href='"+arrData2[j][v]+"'>"+arrData2[j][v]+"</a></br>");
              }else{
                $("#myList").append("<label value='' style='font-size:1em; color:teal; display:inline-block'>"+col.columns[i].name+": </label>");
                $("#myList").append("<p value='' style='font-size:1em; margin:0px; padding:0px; display:inline-block'>"+arrData2[j][v]+"</p></br>");
              }
            }else{
              $("#myList").append("<label value='' style='font-size:1em; color:teal; display:inline-block'>"+col.columns[i].name+": </label>");
              $("#myList").append("<p value='' style='font-size:1em; margin:0px; padding:0px; display:inline-block'>"+arrData2[j][v]+"</p></br>");
            }

        }
            $("#myList").append("</br></br></br>");
      }

        // for(var j=0; j<arrData2.length; ++j){
        //   for(var i=1; i<col.columns.length; ++i){
        //     var v = col.columns[i].name;
        //     $("#myList").append("<label value='' style='font-size:1em; '>"+col.columns[i].name+": </label>");
        //     if(typeof arrData2[j][v] == 'string' ){
        //     if(arrData2[j][v].startsWith("http")){//link
        //       if(arrData2[j][v].includes(".jpg") || arrData2[j][v].includes(".png")){//image
        //         $("#myList").append("</br><img style='width:200px' src='"+arrData2[j][v]+"'></img></br>");
        //       }else{//not image
        //         $("#myList").append("<a href='"+arrData2[j][v]+"'>"+arrData2[j][v]+"</a></br>");
        //       }
        //     }}else{
        //       $("#myList").append("<label value='' style='font-size:1em'>"+arrData2[j][v]+": </label></br>");
        //     }
        //   }
        //   $("#myList").append("</br></br></br>");
        // }

        document.getElementById("myTree").appendChild(renderjson(arrData2));
        //Download
        var data1 = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arrData2, '', 7));

        $( "#JSON" ).remove();
        $( "#CSV" ).remove();
        $( "#JS" ).remove();
        $( "#saveBut" ).remove();
        //$( "#SCRIPT" ).remove();

        $('<a id="CSV" class="button button-mini button-border button-rounded button-red" style="" href="data:text/csv,'+encodeURIComponent(DownloadJSON2CSV())+'" download = "data.csv"><i class="glyphicon glyphicon-download-alt" style="left:2px"></i>CSV</a>').appendTo('#viewButtons2');
        $('<a id="JSON" class="button button-mini button-border button-rounded button-blue" style="" onclick="downloadJSON()" href="data:' + data1 + '" download="data.json"><i class="glyphicon glyphicon-download-alt" style="left:2px"></i>JSON</a>').appendTo('#viewButtons2');
        $('<a id="JS" class="button button-mini button-border button-rounded button-green" onclick="getCodeClicked()" data-toggle="modal" data-target="#modalPaste" href=""><i class="glyphicon glyphicon-console" style="left:2px"></i>CODE</a>').appendTo('#viewButtons2');
        $('<button id="saveBut" type="button" class="button button-mini button-border button-rounded button-amber dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="glyphicon glyphicon-floppy-disk" style="left:2px"></i>SAVE </button>').appendTo('#viewButtons2');
        // $('<button id="SCRIPT" type="button" class="button button-mini button-border button-rounded button-green"  aria-haspopup="true" aria-expanded="false"> <img src="images/java.png" width="15px" height="15px" bottom="5px"> &nbsp;Script </button>').appendTo('#viewButtons2');
        /***************** Table View ******************/
        var loadingIndicator = null;
        var jsonReturn;
        function getJsonP(resp) {
            jsonReturn = resp;
            return true;
        }

        $(function () {
          var checkboxSelector = new Slick.CheckboxSelectColumn({
            cssClass: "slick-cell-checkboxsel"
          });
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
}



var myObj;
var listP='', listP1='';
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


// $("#button").click(function() {
//     $("#reqExp").toggle();
// });

function showHideDiv(t) {
    var e = document.getElementById('reqExp');
    if ( e.style.display != 'none' ) {
        e.style.display = 'none';
        t.value="Show Explanation";

    }
    else {
        t.value="Hide Explanation";
        e.style.display = '';
    }
}

function showHideDivPag(t) {
    var e = document.getElementById('pagExp');
    if ( e.style.display != 'none' ) {
        e.style.display = 'none';
        t.value="Show Explanation";

    }
    else {
        t.value="Hide Explanation";
        e.style.display = '';
    }
}


function showHideDivOptionalParams(t) {
    var e = document.getElementById('optionalP');
    if ( e.style.display != 'none' ) {
        e.style.display = 'none';
        t.value="Show Optional Parameters";

    }
    else {
        t.value="Hide Optional Parameters";
        e.style.display = '';
    }
}


function openForm() {
  document.getElementById("myForm").style.display = "block";
}

function closeForm(dec) {
  logDecision = dec;
  document.getElementById("myForm").style.display = "none";
}


var ui;

function checkButtonClicked(){

  ui = create_UUID();
  //console.log("UI: ", ui);

  cookie_name = ui;
  //The cookie name is set as Counter_Cookie. If you're going to put this onto other pages to count them, change this with a new name.
  doCookie();

  function doCookie() {
    if(document.cookie){
    }else{
      document.cookie = cookie_name + ";expires=Fri, 30 Dec 2022 12:00:00 UTC; ";//cookie_string;
    }
  }//function


  //show consent modal
  $('#butDD').click();

  var str = window.location.href;

  if(str.includes("/#")){
    var url = window.location.href.split("?api=");
    var url_title1 = url[1].split('_').join(' ');
    var url_title_only = url_title1.split("/#");
    var url_title = url_title_only[0];
    var url_fileName = url_title_only[1].split('_').join(' ');

    // retrieve myObj for YouTube from FireBase DB
    registration();

    firebase.database().ref('apis/test/responses/1').remove();

    //Saved Data
    firebase.database().ref('/publicSavedData/').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot){ //for each API
        if(childSnapshot.val().title == url_fileName){//check if this API exists
          //console.log("obSavedData: ", childSnapshot.val());
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

            if(obJSON1.parameters){

            for(var i=0; i<obJSON1.parameters.length; ++i){
              //if(obJSON1.parameters[i]['displayed'] == true){
              if(obJSON1.parameters[i]['displayedName']){//if it should be displayed
                //<a type="" class="" data-toggle="tooltip" data-placement="right" title="Tooltip on">Tooltip on right</button>
                if(obJSON1.parameters[i]['required'] == true){
                  // $("#reqParameters").append(""+obJSON1.parameters[i]['displayedName']+"&nbsp;<a type='' data-toggle='tooltip' data-placement='right' title='"+obJSON1.parameters[i]['description']+"'><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span></a>")
                  $("#reqParameters").append("<a type='' class='' data-toggle='tooltip' data-placement='right' title='"+obJSON1.parameters[i]['description']+"'>"+obJSON1.parameters[i]['displayedName']+"<span style='color:red'>*</span></a>")
                }else{
                  $("#reqParameters").append("<a type='' class='' data-toggle='tooltip' data-placement='right' title='"+obJSON1.parameters[i]['description']+"'>"+obJSON1.parameters[i]['displayedName']+"</a>")
                }
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
              }//if displayedName
            }
          }
            // <a class="" data-toggle="tooltip" data-placement="right" title="Tooltip on ">Tooltip on right!!!</a>

            //[3] Request parameters
          if(obJSON1.parameters){
            listP1="{";
            for(var i=0; i<obJSON1.parameters.length; ++i){
              console.log("second ", obJSON1.parameters[i]['value'])

              if($("#"+obJSON1.parameters[i]['name']).val() || obJSON1.parameters[i]['value']){
              listP1+= JSON.stringify(obJSON1.parameters[i]['name']);
              listP1+= ":"
              if(obJSON1.parameters[i]['displayedName']){
                listP1+= JSON.stringify($("#"+obJSON1.parameters[i]['name']).val());
              }else{
                listP1+= JSON.stringify(obJSON1.parameters[i]['value']);
              }
              // if(i+1<obJSON1.parameters.length){
              //    listP1+= ","
              //  }
             }

             if(i+1<obJSON1.parameters.length){
             if($("#"+obJSON1.parameters[i+1]['name']).val() || obJSON1.parameters[i+1]['value']) {
               listP+= ",";
             }
            }

            }

            //listP1+= ",";

            if(obJSON1.resPerPageParam){
              listP1+= JSON.stringify(obJSON1.resPerPageParam);
              listP1+= ":";
              listP1+= JSON.stringify(obSavedData.maxResPerPage);
            }
            listP1+= "}";
          }//end of if(obJSON1.parameters)
         

            //console.log("listP1 SETITEM: ",listP1);

            if(obSavedData.maxResPerPage){
              $("#reqParameters").append("<label style='font-size:1em'>Number of results</label>");
              $("#reqParameters").append("<input style='height:27px' type='text' class='form-control' id='numOfResults' value="+obSavedData.maxResPerPage+"></input>")
            }
          //[4] Response parameters
          for(var i=0; i<obSavedData.responses.length; ++i){
            var par = obSavedData.responses[i]['parameter'];
            var nameD = obSavedData.responses[i]['displayedName'];
            if(obJSON1.responses[i]['description']){
              var descF = obJSON1.responses[i]['description'];
            }else{
              var descF="";
            }
            if(obJSON1.responses[i]['name']){
              var nameF = obJSON1.responses[i]['name'];
            }else{
              var nameF = obJSON1.responses[i]['displayedName'];
            }

            if(obSavedData.responses[i]['isChecked']){
              $("#resParameters").append("<div><input id='"+par+"' value='"+nameF+"' class='checkbox-style' name='checkbox-w' type='checkbox'  onchange='fieldHasBeenSelected(this, this.value)' autocomplete='off' checked/><label for="+par+" class='checkbox-style-3-label' data-toggle='tooltip' data-placement='right' title='"+descF+"'>"+nameF+"</label></div>");

              //$("#resParameters").append("<div><input id="+par+" value="+nameF+" class='checkbox-style' name='checkbox-w' type='checkbox'  onchange='fieldHasBeenSelected(this)' autocomplete='off' checked><label type='' class='checkbox-style-3-label' data-toggle='tooltip' data-placement='right' title='"+descF+"'>"+nameF+"</label></div>");
            }else{
              $("#resParameters").append("<div><input id='"+par+"' value='"+nameF+"' class='checkbox-style' name='checkbox-w' type='checkbox'  onchange='fieldHasBeenSelected(this, this.value)' autocomplete='off'/><label for="+par+" class='checkbox-style-3-label' data-toggle='tooltip' data-placement='right' title='"+descF+"'>"+nameF+"</label></div>");

              //$("#resParameters").append("<div><input id="+par+" value="+nameF+" class='checkbox-style' name='checkbox-w' type='checkbox'  onchange='fieldHasBeenSelected(this)' autocomplete='off'><label type='' class='checkbox-style-3-label' data-toggle='tooltip' data-placement='right' title='"+descF+"'>"+nameF+"</label></div>");
            }
          }//for response
          retrieveData();
        }
      });
    });

}else{
  var url = window.location.href.split("api=");
  var url_title = url[1].split('_').join(' ');


    //logo!
    //document.getElementById('logoImage').src='images/'+url[1]+'.png'";
    // $("#logo").append('<img id="logoImage" src="images/'+url[1]+'.png" alt="" height="10" width="60" style="margin-left:50%; margin-top:50%" onerror="this.parentNode.removeChild(this);">')

    // $("#logo").append('<h5 style="display: inline-block">'+url_title+'</h5>');

    //console.log("images/"+url[1]+".png");

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
          if(obJSON1.parameters){
            $("#reqCol").show();
            $("#submitQuery").show();
            $("#resetQuery").show();

            for(var i=0; i<obJSON1.parameters.length; ++i){
              if(obJSON1.parameters[i]['displayed'] == true){
              //if(obJSON1.parameters[i]['displayedName']){//if it should be displayed
                if(obJSON1.parameters[i]['required'] == true){
                  // $("#reqParameters").append(""+obJSON1.parameters[i]['displayedName']+"&nbsp;<a type='' data-toggle='tooltip' data-placement='right' title='"+obJSON1.parameters[i]['description']+"'><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span></a>")
                  $("#reqParameters").append("<a type='' class='' data-toggle='tooltip' data-placement='right' title='"+obJSON1.parameters[i]['description']+"'>"+obJSON1.parameters[i]['displayedName']+"<span style='color:red'>*</span></a>")
                }else{
                    $("#reqParameters").append("<a type='' class='' data-toggle='tooltip' data-placement='right' title='"+obJSON1.parameters[i]['description']+"'>"+obJSON1.parameters[i]['displayedName']+"</a>")
                }if(obJSON1.parameters[i]['listOfValues']){
                    $("#reqParameters").append("<select class='form-control' id="+obJSON1.parameters[i]['name']+"></select></br>");
                    arr = obJSON1.parameters[i]['listOfValues'].split(',');
                    for(var j=0; j<arr.length; ++j){
                      $("#"+obJSON1.parameters[i]['name']).append("<option>"+arr[j].split('|').join(',')+"</option>");
                    }
                  }else{
                    $("#reqParameters").append('<input style="height:27px" type="text" class="form-control" id="'+obJSON1.parameters[i]['name']+'" value="'+obJSON1.parameters[i]['value']+'"></input></br>');
                  }
              }//if displayedName
              else if(obJSON1.parameters[i]['displayed'] === undefined){
                if(obJSON1.parameters[i]['displayedName']){//if it should be displayed
                  if(obJSON1.parameters[i]['required'] == true){
                    $("#reqParameters").append("<a type='' class='' data-toggle='tooltip' data-placement='right' title='"+obJSON1.parameters[i]['description']+"'>"+obJSON1.parameters[i]['displayedName']+"<span style='color:red'>*</span></a>")
                    // $("#reqParameters").append(""+obJSON1.parameters[i]['displayedName']+"&nbsp;<a type='' data-toggle='tooltip' data-placement='right' title='"+obJSON1.parameters[i]['description']+"'><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span></a>")
                    }else{
                      $("#reqParameters").append("<a type='' class='' data-toggle='tooltip' data-placement='right' title='"+obJSON1.parameters[i]['description']+"'>"+obJSON1.parameters[i]['displayedName']+"</a>")
                    }
                    if(obJSON1.parameters[i]['listOfValues']){
                      $("#reqParameters").append("<select class='form-control' id="+obJSON1.parameters[i]['name']+"></select></br>");
                      arr = obJSON1.parameters[i]['listOfValues'].split(',');
                      for(var j=0; j<arr.length; ++j){
                        $("#"+obJSON1.parameters[i]['name']).append("<option>"+arr[j].split('|').join(',')+"</option>");
                      }
                    }else{
                      $("#reqParameters").append('<input style="height:27px" type="text" class="form-control" id="'+obJSON1.parameters[i]['name']+'" value="'+obJSON1.parameters[i]['value']+'"></input></br>');
                    }
                }
              }
            }
          }else{
            // console.log("NO Param");
           
          }

            //if auth url and descreption exist

            $("#descMenu").append('<p style="word-break: break-all ; font-size: 1.2em;">'+obJSON1.authDesc+'</br><a href="'+obJSON1.authURL+'" target="_blank">'+obJSON1.authURL+'</a></p>');

            if(obJSON1.authIsPublic){
              //console.log("PUBLIC")
              document.getElementById("reqParameters").style.maxHeight = "340px"; //max-height:330px;
              $("#authDIV").show();
              $("#authParameters").append('</br><a>API Key Value</a>')
              $("#authParameters").append('<input style="height:27px" type="text" class="form-control" id="apiKeyVal" value=""></input></br>');
              var paragraph = document.getElementById("opreq");
              var text = document.createTextNode(" Optional");
              paragraph.appendChild(text);
            }else{
              //console.log("NOT PUBLIC")
              document.getElementById("reqParameters").style.maxHeight = "560px";
              var paragraph = document.getElementById("opreq");
              var text = document.createTextNode(" Required");
              paragraph.appendChild(text);
            }

            // $("#authParameters").append('<a type="image" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" cursor="pointer" style="color:#1ABC9C; font-size:1.2em; padding:0px; margin:0px">How?</a>')
            //if has header
            // $("#authParameters").append('<a>Key</a>')
            // $("#authParameters").append('<input style="height:27px" type="text" class="form-control" id="" value=""></input></br>');


            //When click on "submit" button,
            //check the there values in the header key and value,
            //If not check if the integrator make their own pubic, if not show a message asking the user to provide one

            //[3] Request parameters
            if(obJSON1.parameters){
            listP1="{";
            for(var i=0; i<obJSON1.parameters.length; ++i){
              // console.log("first ", obJSON1.parameters[i]['value'])
              if($("#"+obJSON1.parameters[i]['name']).val() || obJSON1.parameters[i]['value']){
              listP1+= JSON.stringify(obJSON1.parameters[i]['name']);
              listP1+= ":" //$('#queryw').val()
              //change here now
              if(obJSON1.parameters[i]['displayedName']){
                // console.log("print this: ", JSON.parse(obJSON1.parameters[i]['name']));
                listP1+= JSON.stringify($("#"+obJSON1.parameters[i]['name']).val());
              }else{
                listP1+= JSON.stringify(obJSON1.parameters[i]['value']);
              }
              // if(i+1<obJSON1.parameters.length){
              //    listP1+= ","
              //  }
             }
             if(i+1<obJSON1.parameters.length){
             if($("#"+obJSON1.parameters[i+1]['name']).val() || obJSON1.parameters[i+1]['value']) {
               listP+= ",";
             }
            }
            }
            //listP1+= ",";
            if(obJSON1.url != "https://www.eventbriteapi.com/v3/events/search"){

              if(obJSON1.resPerPageParam){
                listP1+= JSON.stringify(obJSON1.resPerPageParam);
                listP1+= ":";
                listP1+= JSON.stringify(obJSON1.maxResPerPage);
              }
            }
            listP1+= "}";
          }//end of if parameters.length
            // console.log("listP1 SETITEM: ",listP1);
            if(obJSON1.maxResPerPage){
              $("#reqParameters").append("<label style='font-size:1em'>Number of results</label>");
              $("#reqParameters").append("<input style='height:27px' type='text' class='form-control' id='numOfResults' value="+obJSON1.maxResPerPage+"></input>")
            }
          //[4] Response parameters
          for(var i=0; i<obJSON1.responses.length; ++i){ //new response
            var par = obJSON1.responses[i]['parameter'];
            var nameD = obJSON1.responses[i]['displayedName']; //chnage to nameField if exist
            if(obJSON1.responses[i]['description']){
              var descF = obJSON1.responses[i]['description'];
            }else{
              var descF="";
            }
            if(obJSON1.responses[i]['name']){
              var nameF = obJSON1.responses[i]['name'];
            }else{
              var nameF = obJSON1.responses[i]['displayedName'];
            }
            //change to checkbox-style-1-label checkbox-small
            $("#resParameters").append("<div><input id='"+par+"' value='"+nameF+"' class='checkbox-style' name='checkbox-w' type='checkbox'  onchange='fieldHasBeenSelected(this, this.value)' autocomplete='off' checked/><label for="+par+" class='checkbox-style-3-label' data-toggle='tooltip' data-placement='right' title='"+descF+"'>"+nameF+"</label></div>");
          }
          retrieveData();
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


//
// $('#downloadCSVFileButton').click(function () {
//
//   var array = typeof data != 'object' ? JSON.parse(data) : data;
//
//   var str = '';
//
//   for (var i = 0; i < array.length; i++) {
//       var line = '';
//
//       for (var index in array[i]) {
//           line += array[i][index] + ',';
//       }
//
//       line.slice(0,line.Length-1);
//
//       str += line + '\r\n';
//   }
//   window.open( "data:text/csv;charset=utf-8," + escape(str))
//
//
//     var textFile = $('.postingFile textarea').val();
//     var element = document.createElement('a');
//     element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(str));
//     element.setAttribute('download', 'filename.csv');
//     element.style.display = 'none';
//     if (typeof element.download != "undefined") {
//       //browser has support - process the download
//       document.body.appendChild(element);
//       element.click();
//       document.body.removeChild(element);
//     }
//     else {
//       //browser does not support - alert the user
//       alert('This functionality is not supported by the current browser, recommend trying with Google Chrome instead.  (http://caniuse.com/#feat=download)');
//     } //end of if...else...block
//   }); //end of $('.downloadCSVFileButton').click(function () {
//



function populateAccountTables(){
  //look for the user, then get their save queries and files and add them to the tables
  // prettierURL();
  firebase.initializeApp(config);

  firebase.auth().onAuthStateChanged(function (user) {
    if(user){
      // console.log("USER ID: ",user.uid);
      firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
        var displayName = snapshot.val().name;
        // console.log("NAME: ", displayName);
        $("#SignupLogin").html(displayName);

        //Dataset Table
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
              $("#data_table_content tbody").append('<tr><td>'+name+'</td><td>'+api_name+'</td><td>'+file_desc+'</td><td><a href='+url+' download="'+name+'.csv"><img src="images/csv-file.png" width="30px"></a> &nbsp; <a href="data:'+ urlJ +'" download="'+name+'.json"><img src="images/json-file.png" width="25px"></a> &nbsp;  <a href="data-management.html?api='+api_name.replace(" ", "_")+'/#'+name.split(' ').join('_')+'" target="_blank"><img src="images/edit.png" width="25px"></a> &nbsp; <a target="_blank" rel="noopener noreferrer" href='+link+'><img src="images/link.png" style="top:20px; width:18px" ></a> &nbsp;   <a id="'+name+'" href="" onclick="deleteRowAccountTableFiles(this,this)"><img src="images/del.png" width="25px"></a>   </td></tr>');

            }else{
              //window.alert("No USER")
              $("#SignupLogin").html("Sign in");
            }
          });
        });

        //APIs Table
        firebase.database().ref('users/'+ user.uid+'/savedAPIs/').once('value').then(function(snapshot) {
          snapshot.forEach(function(childSnapshot) { //for each saved query
            if(childSnapshot.val() != undefined){
              $("#apisTable").show();
              $("#api_table_content").show();
              //console.log(childSnapshot.val().title);
              var name1 = childSnapshot.val().title;
              var name = name1.split(' ').join('_');
              // var api_name = childSnapshot.val().apiName;
              // var file_desc = childSnapshot.val().description;
              // //var type = childSnapshot.val().type;
              // var url = childSnapshot.val().urlCSV;
              // var urlJ = childSnapshot.val().urlJSON;
              // var link = childSnapshot.val().queryLink;
              $("#api_table_content tbody").append('<tr><td>'+name1+'</td> <td><a href="api-integration.html?'+name+'" target="_blank"><img src="images/edit.png" width="25px"></a> &nbsp;  <a id="'+name1+'" href="" onclick="deleteRowAccountTableAPIs(this,this)"><img src="images/del.png" width="25px"></a>   </td></tr>');

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



function similar(aa) {

    var a = aa.substring(0, aa.lastIndexOf("/") + 1);

    firebase.database().ref('/apis/').once('value').then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) { //for each API
        if(childSnapshot.val().url != undefined){
          var url = childSnapshot.val().url;
          var b = url.substring(0, url.lastIndexOf("/") + 1);
          console.log("URL: ", b);

          var lengthA = a.length;
          var lengthB = b.length;
          var equivalency = 0;
          var minLength = (a.length > b.length) ? b.length : a.length;
          var maxLength = (a.length < b.length) ? b.length : a.length;
          for(var i = 0; i < minLength; i++) {
              if(a[i] == b[i]) {
                  equivalency++;
              }
          }

          var weight = equivalency / maxLength;
          console.log("Weight: ",weight * 100) + "%";

          if((weight * 100) > 80){
            console.log("similar enoguh");
            console.log(childSnapshot.val().title);
            console.log(childSnapshot.val().maxResPerPage);

            //Basic Info
            $("#title").val(childSnapshot.val().title);
            $("#version").val(childSnapshot.val().version);
            $("#description").val(childSnapshot.val().description);
            $("#type").val(childSnapshot.val().type);


            $("#result_param").val(childSnapshot.val().resPerPageParam);
            $("#result_max").val(childSnapshot.val().maxResPerPage);

            $("#index_param").val(childSnapshot.val().indexPage);

            $("#cur_page_param").val(childSnapshot.val().currPageParam);
            $("#next_page_param").val(childSnapshot.val().nextPageParam);


          }else{
            console.log("NOT similar enoguh");
          }

        }//if
      });//firebase loop
    });

  //  var b = "https://www.reddit.com/new.json";

}


var i = 0;
var x = 0;
var numResults = 0;
var objData={};
var defined=true;
var countResults = 0;
var pages;
var totalRes;


function retrieveDataX(){
  defined=true;
  $('#myTree').empty();
  $('#myList').empty();

  obJSON2 = {};
  data = [];

  //publishedAfter = new Date($("input[name=afterDate]").val());
  //publishedBefore = new Date($("input[name=beforeDate]").val());
  //console.log("DATE: "+ publishedAfter.toISOString());
  $("#editModal").show();
  $("#CSV").show();
  //$("#Save-Data").show();
  $("#JSON").show();
  // $("#viewButtons").show();
  $("#groupByFilter").show();
  $("#txtSearch").show();
  //$("#searchTable").show();

  //col.columns.push(checkboxSelector.getColumnDefinition());
  //col.columns.push({id: 'i', name:'', field: '', behavior: 'selectAndMove', selectable: false, resizable: false, cssClass: 'cell-reorder dnd', width: 25, editor: Slick.Editors.Text, formatter:false, sortable: false});
  col = {};
  columns = [];
  col.columns = columns;

  col.columns.push({id: 'id', name: '#', field: 'id', behavior: 'select', width: 25, editor: Slick.Editors.Text, formatter:false, sortable: true});

  if($("input[name='checkbox-w']").is(":checked")){
      $("input[name='checkbox-w']:checked").each(function(){
        col.columns.push({id: this.id, name: this.value, field: this.value, editor: Slick.Editors.Text, sortable: true});
      });
  }

    //var pages;
    // if(!obJSON1.maxResPerPage){
    //   page = 1;
    // }else{
    if($("#numOfResults").val()){
    pages = Math.ceil($("#numOfResults").val()/obJSON1.maxResPerPage); //# of pages = (# of results entered by the user \ # of results returned by the API)
    totalRes = $("#numOfResults").val();
    // console.log("totalRes: ", totalRes);
    // console.log("number of pages: ", pages);
    numResults = obJSON1.maxResPerPage;
    //console.log("More pages")
  }else{
    page=1;
    //console.log("One page")
  }

    var start = 0;
    var next="";
    var nextPage = "";
    var p=1;

    getTheNextPage(p, pages, nextPage);

    function getTheNextPage(p, pages, nextPage){
      //console.log("getTheNextPage");
     if(obJSON1.parameters){
      listP=  "{";
      for(var i=0; i<obJSON1.parameters.length; ++i) {
        if($("#"+obJSON1.parameters[i]['name']).val() || obJSON1.parameters[i]['value']){
          listP+= JSON.stringify(obJSON1.parameters[i]['name']); //check conditions before adding names
          listP+= ":"
          if(obJSON1.parameters[i]['displayedName']){ //displayedName
            listP+= JSON.stringify($("#"+obJSON1.parameters[i]['name']).val());
          }else{
            listP+= JSON.stringify(obJSON1.parameters[i]['value']);
          }
        }

        if(i+1<obJSON1.parameters.length){
        if($("#"+obJSON1.parameters[i+1]['name']).val() || obJSON1.parameters[i+1]['value']) {
          listP+= ",";
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
    if(obJSON1.apiKeyValue){
      listP+= ","
      listP+= JSON.stringify(obJSON1.apiKeyName);
      listP+=":";
      listP+= JSON.stringify(obJSON1.apiKeyValue);
    }
    listP+= "}";
  }else{
    if(obJSON1.apiKeyValue){
      if(obJSON1.parameters){
        listP+= ","
      }else{
        listP+= "{"
      }
      listP+= JSON.stringify(obJSON1.apiKeyName);
      listP+=":";
      listP+= JSON.stringify(obJSON1.apiKeyValue);
      listP+= "}";
    }
  }


if((!obJSON1.headers) || obJSON1.headers[0].headerValue==""){ //no header //no CORS
    $.ajax({
      url: obJSON1.url,
      data: JSON.parse(listP),
      //dataType: jp,
      method: 'GET',
      success: function (response) {
        // console.log("RES_Ret: ", response);

        if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
          for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
             objData={};

             objData["id"]= start;

             if($("input[name='checkbox-w']").is(":checked")){
                 $("input[name='checkbox-w']:checked").each(function(){
                  var s = "response."+this.id.split('.')[0];
                   //console.log("s: ",s);
                  if(eval(s)){
                   var id = this.value;
                   if(this.value=="Video URL"){
                     objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                   }else{
                     var str = (this.checked ? "response."+this.id : 0);
                     //IF ARRAY
                     if(str.includes("[i]")){
                       //console.log("Includes [i]: ",str);
                       var i=0;
                       var splt =  str.split("[i]");
                       // start if undefined
                       if(eval(splt[0]).length==0){
                        objData[id]="";
                      }else{// start if NOT undefined
                      objData[id] = (this.checked ? eval("response."+this.id) : 0);
                      for(i=1; i<eval(splt[0]).length; ++i){
                        objData[id] += ", ";
                        objData[id] += eval("response."+this.id);
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
                 }//if not undefined
               else{
                 defined=false;
               }
             });//checkbox
           }//chckbox loop

               if(defined){
                 data.push(objData);
                 obj.lists=[];
                 obj.lists.push(objData);
              }

              //++j;
              //++start;

          }//while loop
        }else{
        var j=0;
        while(defined){
           objData={};
           ++start;
           objData["id"]= start;
            // console.log("J: ",j);

           if($("input[name='checkbox-w']").is(":checked")){
               $("input[name='checkbox-w']:checked").each(function(){

                var s = "response."+this.id.split('.')[0];
                var arrLength = "response."+this.id.split('[j]')[0];
                var ln = s.split('[')[0];

                if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){// || typeof eval(s) === 'undefined' || j==eval(ln).length){
                 var id = this.value;
                 if(this.value=="Video URL"){
                   objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                 }else{
                   var str = (this.checked ? "response."+this.id : 0);
                   //IF ARRAY
                   // console.log("check: ", eval("response."+this.id));
                   if(str.includes("[i]")){
                     // console.log("Includes [i]: ",str);
                     var i=0;
                     var splt =  str.split("[i]");
                     // start if undefined
                     if(eval(splt[0]).length==0){
                      objData[id]="";
                    }else{// start if NOT undefined
                    objData[id] = (this.checked ? eval("response."+this.id) : 0);
                    for(i=1; i<eval(splt[0]).length; ++i){
                      objData[id] += ", ";
                      objData[id] += eval("response."+this.id);
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
               }else{
               defined=false;
             }
           });//checkbox
         }//chckbox if

             if(defined){
               data.push(objData);
               obj.lists=[];
               obj.lists.push(objData);
            }

            ++j;

        }//while loop
      }//else

        if(p<pages){
          // console.log("Data: ", data);
          if(obJSON1.currPageParam){ //nex\prev page
              ++p;
              // console.log("Next: ", eval("response."+obJSON1.nextPageParam));
              getTheNextPage(p, pages, eval("response."+obJSON1.nextPageParam));
          }else if(obJSON1.offsetPage){//offset page
            // console.log("offset");
            ++p;
            getTheNextPage(p, pages, eval("response."+obJSON1.offsetPage));
          }else{//index page
              // console.log("index");
            ++p;
            getTheNextPage(p, pages, eval("response."+obJSON1.indexPage));
          }
        }else{
          if(data.length>0){
            console.log("data: ", data);
            populateListAndTree(data)
            populateTable(data);
          }else{
            populateListAndTree(data)
            console.log("create something else other than table!")
          }
        }

      }//response
  //  );//new AJAX
   });//AJAX
 }//if header
else{
  var headername= obJSON1.headers[0].headerKey;//$("#nameH").val();
  var headervar= obJSON1.headers[0].headerValue;//$("#valueH").val();
  var headers_to_set = {};
  headers_to_set[headername] = headervar;

    $.ajax({
      url: "https://cors-anywhere.herokuapp.com/"+obJSON1.url,
      data: JSON.parse(listP),
      method: 'GET',
      headers: headers_to_set,
      // {
      //   "Authorization" : obJSON1.headers[0].headerValue//"Bearer lFvvnoRne1-Od__tDTS_kC4w_ifGdXq7XeYGXhxj67FlTAWnZuwiD46hWe15i3ZQEz9c4zTsAES_MdSgzcHnDM2b1QvvaKzOB7KbBFJOrk5cCNdAxjfSB4R6VRFeXHYx"
      // },
      success: function (response) {
        //console.log("RES_Ret: ", response);
        if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
          for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
             objData={};

             objData["id"]= start;

             if($("input[name='checkbox-w']").is(":checked")){
                 $("input[name='checkbox-w']:checked").each(function(){
                  var s = "response."+this.id.split('.')[0];
                   //console.log("s: ",s);
                  if(eval(s)){
                   var id = this.value;
                   if(this.value=="Video URL"){
                     objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                   }else{
                     var str = (this.checked ? "response."+this.id : 0);
                     //IF ARRAY
                     if(str.includes("[i]")){
                       //console.log("Includes [i]: ",str);
                       var i=0;
                       var splt =  str.split("[i]");
                       // start if undefined
                       if(eval(splt[0]).length==0){
                        objData[id]="";
                      }else{// start if NOT undefined
                      objData[id] = (this.checked ? eval("response."+this.id) : 0);
                      for(i=1; i<eval(splt[0]).length; ++i){
                        objData[id] += ", ";
                        objData[id] += eval("response."+this.id);
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
                 }//if not undefined
               else{
                 defined=false;
               }
             });//checkbox
           }//chckbox loop

               if(defined){
                 data.push(objData);
                 obj.lists=[];
                 obj.lists.push(objData);
              }

              //++j;
              //++start;

          }//while loop
        }else{
        var j=0;
        while(defined){
          //for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
          objData={};
          ++start;
          objData["id"]= start;
          // console.log("J: ",j);

          if($("input[name='checkbox-w']").is(":checked")){
              $("input[name='checkbox-w']:checked").each(function(){
                var s = "response."+this.id.split('.')[0];
                var arrLength = "response."+this.id.split('[j]')[0];
                var ln = s.split('[')[0];

                if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){// || typeof eval(s) === 'undefined' || j==eval(ln).length){
                var id = this.value;
                if(this.value=="Video URL"){
                  objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                }else{
                  var str = (this.checked ? "response."+this.id : 0);
                  //IF ARRAY
                  if(str.includes("[i]")){
                    //console.log("Includes [i]: ",str);
                    var i=0;
                    var splt =  str.split("[i]");
                    // start if undefined
                    if(eval(splt[0]).length==0){
                     objData[id]="";
                   }else{// start if NOT undefined
                   objData[id] = (this.checked ? eval("response."+this.id) : 0);
                   for(i=1; i<eval(splt[0]).length; ++i){
                     objData[id] += ", ";
                     objData[id] += eval("response."+this.id);
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
              }//if not undefined
            else{
              defined=false;
            }
          });//checkbox
        }//chckbox loop

            if(defined){
              data.push(objData);
              obj.lists=[];
              obj.lists.push(objData);
           }

           ++j;
           //++start;

          }//while loop
      }//else

        if(p<pages){
          //console.log("Data: ", data);
          if(obJSON1.currPageParam){ //nex\prev page
              ++p;
              getTheNextPage(p, pages, eval("response."+obJSON1.nextPageParam));
          }else if(obJSON1.offsetPage){//offset page
            ++p;
            getTheNextPage(p, pages, eval("response."+obJSON1.offsetPage));
          }else{//index page
            ++p;
            getTheNextPage(p, pages, eval("response."+obJSON1.indexPage));
          }
        }else{
          if(data.length>0){
            console.log("data: ", data);
            populateListAndTree(data)
            populateTable(data);
          }else{
            arrData2=[];     
            console.log("data: ", response);
            for(var r=0; r<obJSON1.responses.length; ++r){
              var str = "response."+obJSON1.responses[r].parameter;
              if(str.includes("[j]")){
                str = str.replace('j', '0');
              }
              console.log(eval(str));
              arrData2.push(eval(str));
            }

            populateListAndTree(data)
            console.log("create something else other than table!")
          }
        }

      }//response
  //  );//new AJAX
   });//AJAX
 }//else CORS

  }//end of getTheNextPage function


  function populateListAndTree(data){
  /***************** List View ******************/
  for(var j=0; j<arrData2.length; ++j){
    for(var i=1; i<col.columns.length; ++i){
      var v = col.columns[i].name;
      if(typeof arrData2[j][v] == 'string' ){
      //if(arrData2[j][v].startsWith("http")){//link
        if(arrData2[j][v].startsWith("http") && arrData2[j][v].includes(".jpg") || arrData2[j][v].includes(".png")){//image
          $("#myList").append("<label value='' style='font-size:1em; color:teal'>"+col.columns[i].name+": </label>");
          $("#myList").append("</br><img style='width:200px' src='"+arrData2[j][v]+"'></img></br>");
        }else if(arrData2[j][v].startsWith("http")){//not image
          $("#myList").append("<label value='' style='font-size:1em; cursor:pointer; color:teal'>"+col.columns[i].name+": </label>");
          $("#myList").append("<a style='color:blue' target='_blank' href='"+arrData2[j][v]+"'>"+arrData2[j][v]+"</a></br>");
        }else{
          $("#myList").append("<label value='' style='font-size:1em; color:teal; display:inline-block'>"+col.columns[i].name+": </label>");
          $("#myList").append("<p value='' style='font-size:1em; margin:0px; padding:0px; display:inline-block'>"+arrData2[j][v]+"</p></br>");
        }
      }else{
        $("#myList").append("<label value='' style='font-size:1em; color:teal; display:inline-block'>"+col.columns[i].name+": </label>");
        $("#myList").append("<p value='' style='font-size:1em; margin:0px; padding:0px; display:inline-block'>"+arrData2[j][v]+"</p></br>");
      }
    }
    $("#myList").append("</br></br></br>");
  }

  // if(isDataURL(arrData2[j][v])){
  //   console.log("YES: ", arrData2[j][v]);
  // }
  // function isDataURL(s) {
  //     return !!s.match(isDataURL.regex);
  // }
  // isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

  /***************** Tree View ******************/
  document.getElementById("myTree").appendChild(renderjson(arrData2));
  //document.getElementById("myTree").innerHTML = JSONTree.create(response);
  //Download
  var data1 = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arrData2, '', 7));

  $( "#JSON" ).remove();
  $( "#CSV" ).remove();
  $( "#JS" ).remove();
  $( "#saveBut" ).remove();
  //$( "#SCRIPT" ).remove();

  $('<a id="CSV" class="button button-mini button-border button-rounded button-red" style="" href="data:text/csv,'+encodeURIComponent(DownloadJSON2CSV())+'" download = "data.csv"><i class="glyphicon glyphicon-download-alt" style="left:2px"></i>CSV</a>').appendTo('#viewButtons2');
  $('<a id="JSON" class="button button-mini button-border button-rounded button-blue" style="" onclick="downloadJSON()" href="data:' + data1 + '" download="data.json"><i class="glyphicon glyphicon-download-alt" style="left:2px"></i>JSON</a>').appendTo('#viewButtons2');
  $('<a id="JS" class="button button-mini button-border button-rounded button-green" onclick="getCodeClicked()" data-toggle="modal" data-target="#modalPaste" href=""><i class="glyphicon glyphicon-console" style="left:2px"></i>CODE</a>').appendTo('#viewButtons2');

  // $('<button onclick="dang()" id="codeBut" type="button" class="button button-mini button-border button-rounded button-green dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="glyphicon glyphicon-console" style="left:2px"></i>CODE</button>').appendTo('#viewButtons2');
  $('<button id="saveBut" type="button" class="button button-mini button-border button-rounded button-amber dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="glyphicon glyphicon-floppy-disk" style="left:2px"></i>SAVE </button>').appendTo('#viewButtons2');
  // $('<button id="SCRIPT" type="button" class="button button-mini button-border button-rounded button-green"  aria-haspopup="true" aria-expanded="false"> <img src="images/java.png" width="15px" height="15px" bottom="5px"> &nbsp;Script </button>').appendTo('#viewButtons2');
}


function populateListAndTree(data){
  /***************** List View ******************/
  for(var j=0; j<arrData2.length; ++j){
    for(var i=1; i<col.columns.length; ++i){
      var v = col.columns[i].name;
      if(typeof arrData2[j][v] == 'string' ){
      //if(arrData2[j][v].startsWith("http")){//link
        if(arrData2[j][v].startsWith("http") && arrData2[j][v].includes(".jpg") || arrData2[j][v].includes(".png")){//image
          $("#myList").append("<label value='' style='font-size:1em; color:teal'>"+col.columns[i].name+": </label>");
          $("#myList").append("</br><img style='width:200px' src='"+arrData2[j][v]+"'></img></br>");
        }else if(arrData2[j][v].startsWith("http")){//not image
          $("#myList").append("<label value='' style='font-size:1em; cursor:pointer; color:teal'>"+col.columns[i].name+": </label>");
          $("#myList").append("<a style='color:blue' target='_blank' href='"+arrData2[j][v]+"'>"+arrData2[j][v]+"</a></br>");
        }else{
          $("#myList").append("<label value='' style='font-size:1em; color:teal; display:inline-block'>"+col.columns[i].name+": </label>");
          $("#myList").append("<p value='' style='font-size:1em; margin:0px; padding:0px; display:inline-block'>"+arrData2[j][v]+"</p></br>");
        }
      }else{
        $("#myList").append("<label value='' style='font-size:1em; color:teal; display:inline-block'>"+col.columns[i].name+": </label>");
        $("#myList").append("<p value='' style='font-size:1em; margin:0px; padding:0px; display:inline-block'>"+arrData2[j][v]+"</p></br>");
      }
    $("#myList").append("</br></br></br>");
  }
}

  // if(isDataURL(arrData2[j][v])){
  //   console.log("YES: ", arrData2[j][v]);
  // }
  // function isDataURL(s) {
  //     return !!s.match(isDataURL.regex);
  // }
  // isDataURL.regex = /^\s*data:([a-z]+\/[a-z]+(;[a-z\-]+\=[a-z\-]+)?)?(;base64)?,[a-z0-9\!\$\&\'\,\(\)\*\+\,\;\=\-\.\_\~\:\@\/\?\%\s]*\s*$/i;

  /***************** Tree View ******************/
  document.getElementById("myTree").appendChild(renderjson(arrData2));
  //document.getElementById("myTree").innerHTML = JSONTree.create(response);
  //Download
  var data1 = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arrData2, '', 7));

  $( "#JSON" ).remove();
  $( "#CSV" ).remove();
  $( "#JS" ).remove();
  //$( "#saveBut" ).remove();
  //$( "#SCRIPT" ).remove();

  $('<a id="CSV" class="button button-mini button-border button-rounded button-red" style="" href="data:text/csv,'+encodeURIComponent(DownloadJSON2CSV())+'" download = "data.csv"><i class="glyphicon glyphicon-download-alt" style="left:2px"></i>CSV</a>').appendTo('#viewButtons2');
  $('<a id="JSON" class="button button-mini button-border button-rounded button-blue" style="" onclick="downloadJSON()" href="data:' + data1 + '" download="data.json"><i class="glyphicon glyphicon-download-alt" style="left:2px"></i>JSON</a>').appendTo('#viewButtons2');
  $('<a id="JS" class="button button-mini button-border button-rounded button-green" onclick="getCodeClicked()" data-toggle="modal" data-target="#modalPaste" href=""><i class="glyphicon glyphicon-console" style="left:2px"></i>CODE</a>').appendTo('#viewButtons2');
  $('<button id="saveBut" type="button" class="button button-mini button-border button-rounded button-amber dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="glyphicon glyphicon-floppy-disk" style="left:2px"></i>SAVE </button>').appendTo('#viewButtons2');

}

  function populateTable(data){
      console.log("THIS DATA: ", data)

    $("#jsCode").empty();

    //pagination + response fields + headers

    jsSnippet= '<code class="language-javascript">$.ajax({</br>&nbsp;&nbsp;&nbsp;url: "'+obJSON1.url+'",</br>&nbsp;&nbsp;&nbsp;data:'+JSON.parse(JSON.stringify(listP))+',</br>&nbsp;&nbsp;&nbsp;method: "GET",</br>&nbsp;&nbsp;&nbsp;success: function (response) {</br>&nbsp;&nbsp;&nbsp;&nbsp;console.log(response);</br>&nbsp;&nbsp;&nbsp;},</br>&nbsp;&nbsp;&nbsp;error: function(response, jqXHR, textStatus, errorThrown) {</br>&nbsp;&nbsp;&nbsp;&nbsp;console.log(response.textStatus);</br>&nbsp;&nbsp;}</br>});</code>';

    pySnippet= 'import requests</br>url = "'+obJSON1.url+'" </br>querystring = '+JSON.parse(JSON.stringify(listP))+' </br>response = requests.request("GET", url, params=querystring)';

    $("#jsCode").append(jsSnippet);

    // console.log("popTable: ", data)


          /***************** Table View ******************/
          var loadingIndicator = null;
          var jsonReturn;
          function getJsonP(resp) {
              jsonReturn = resp;
              return true;
          }

          $(function () {
            var checkboxSelector = new Slick.CheckboxSelectColumn({
              cssClass: "slick-cell-checkboxsel"
            });
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

      arrData2 = data;

}//end of retrieveData function



var jsSnippet, pySnippet;

function codeSnippetSelected(){

  if(document.getElementById('selectCode').value == "js") {
    $("#jsCode").empty();
    $("#jsCode").append(jsSnippet);
  }else{
    $("#jsCode").empty();
    $("#jsCode").append(pySnippet);
  }

    // $("#jsCode").append(jsSnippet);
}

var getLogObj;
var listExist;
var start;
var next;
var nextPage;
var p;
var pages,totalRes;

function retrieveData(){

  defined=true;
  obJSON2 = {};
  data = [];
  $('#myTree').empty();
  $('#myList').empty();

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

  col = {};
  columns = [];
  col.columns = columns;

  col.columns.push({id: 'id', name: '#', field: 'id', behavior: 'select', width: 25, editor: Slick.Editors.Text, formatter:false, sortable: true});

  if($("input[name='checkbox-w']").is(":checked")){
      $("input[name='checkbox-w']:checked").each(function(){
        col.columns.push({id: this.id, name: this.value, field: this.value, editor: Slick.Editors.Text, sortable: true});
      });
  }

  // save logs submit clicked START
  if(logDecision == "accept"){

    var res = [];
    var param = [];

    if($("input[name='checkbox-w']").is(":checked")){
        $("input[name='checkbox-w']:checked").each(function(){
          res.push({
            name: this.id
          });
        });
      }

if(obJSON1.parameters){
  for(var i=0; i<obJSON1.parameters.length; ++i){
   param.push({
     name: obJSON1.parameters[i]['name'],
     value: obJSON1.parameters[i]['value']
   });
  }
}
  getLogObj = {};

  getLogObj.id = document.cookie;
  getLogObj.timestamp = Date.now();
  getLogObj.url = obJSON1.url;
  getLogObj.parameters = param;
  getLogObj.response = res;
  getLogObj.butClicked = "QUERY";

   firebase.database().ref('getLog/'+ui).push(JSON.parse(JSON.stringify(getLogObj)));
   // firebase.database().ref('getLog/').remove();
   // firebase.database().ref('log/').remove();
  }


  //START HERE

    if($("#numOfResults").val()){
      pages = Math.ceil($("#numOfResults").val()/obJSON1.maxResPerPage);
      totalRes = $("#numOfResults").val();
      numResults = obJSON1.maxResPerPage;
    }else{
      page=1;
      totalRes = 1;
      numResults = 1;
    }

    start = 0;
    next="";
    nextPage = "";
    p=1;
    var link = obJSON1.url;

    getTheNextPage(p, pages, nextPage);

    function getTheNextPage(p, pages, nextPage){

      if(obJSON1.parameters){
        var paramLength= obJSON1.parameters.length;
      listP=  "{";
      for(var i=0; i<paramLength; ++i) {
        if($("#"+obJSON1.parameters[i]['name']).val() || obJSON1.parameters[i]['value']){

          if(link.includes('{'+JSON.parse(JSON.stringify(obJSON1.parameters[i]['name']))+'}')){
            paramLength= paramLength-1;
            if(obJSON1.parameters[i]['displayedName']){ //displayedName
              link=link.replace('{'+JSON.parse(JSON.stringify(obJSON1.parameters[i]['name']))+'}', JSON.parse(JSON.stringify($("#"+obJSON1.parameters[i]['name']).val())));
            }else{
              link=link.replace('{'+JSON.parse(JSON.stringify(obJSON1.parameters[i]['name']))+'}', JSON.parse(JSON.stringify(obJSON1.parameters[i]['value'])));
            }
          }else{
          listP+= JSON.stringify(obJSON1.parameters[i]['name']); //check conditions before adding names
          listP+= ":"
          if(obJSON1.parameters[i]['displayedName']){ //displayedName
            listP+= JSON.stringify($("#"+obJSON1.parameters[i]['name']).val());
          }else{
            listP+= JSON.stringify(obJSON1.parameters[i]['value']);
          }
        }//new if
      }
      console.log("paramLength: ",paramLength);

      if(i+1<paramLength){
        if($("#"+obJSON1.parameters[i+1]['name']).val() || obJSON1.parameters[i+1]['value']) {
          listP+= ",";
        }
      }
   }//for loop


    if(obJSON1.resPerPageParam){
      if(listP.charAt(1)){
        listP+= ","
      }
      listP+= JSON.stringify(obJSON1.resPerPageParam);
      listP+= ":";
      listP+= JSON.stringify(obJSON1.maxResPerPage);
    }
    if(obJSON1.indexPage){
      if(listP.charAt(1)){
        listP+= ","
      }
      //listP+= ","
      listP+= JSON.stringify(obJSON1.indexPage);
      listP+= ":";
      listP+= p;
    }else if(obJSON1.offsetPage){
      if(listP.charAt(1)){
        listP+= ","
      }
      //listP+= ","
      listP+= JSON.stringify(obJSON1.offsetPage);
      listP+= ":";
      listP+= (p-1)*(eval(obJSON1.maxResPerPage));
    }else if(obJSON1.currPageParam){
      if(listP.charAt(1)){
        listP+= ","
      }
      //listP+= ","
      listP+= JSON.stringify(obJSON1.currPageParam);
      listP+= ":";
      listP+= JSON.stringify(nextPage);
    }

    if(obJSON1.apiKeyValue){
      listP+= ","
      listP+= JSON.stringify(obJSON1.apiKeyName);
      listP+=":";
      if($("#apiKeyVal").val()){
        listP+= $("#apiKeyVal").val();
      }else{
        listP+= JSON.stringify(obJSON1.apiKeyValue);
      }
    }

    listP+= "}";
    }

    if(obJSON1.apiKeyValue){
      if(obJSON1.parameters){
        listP+= ","
      }else{
        listP+= "{"
      }
      listP+= JSON.stringify(obJSON1.apiKeyName);
      listP+=":";
      if($("#apiKeyVal").val()){
        listP+= $("#apiKeyVal").val();
      }else{
        listP+= JSON.stringify(obJSON1.apiKeyValue);
      }
      listP+= "}";
    }

  console.log("listPYEAH: ",listP);
  if(listP){
    listExist=JSON.parse(listP);
  }else{
    listExist=""
  }

if(( (!obJSON1.headers) || obJSON1.headers[0].headerValue=="") && ((!obJSON1.oauth2) || obJSON1.oauth2[0].authURL=="")){ //no header //no CORS
  // console.log("no header / no oauth");
    $.ajax({
      url: link,
      data: listExist,
      //dataType: jp,
      method: method,
      success: function (response) {
        //console.log("RES_Ret: ", response);
        if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
          for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
            console.log("INSIDE"); 
            objData={};
             objData["id"]= start;

             if($("input[name='checkbox-w']").is(":checked")){
                 $("input[name='checkbox-w']:checked").each(function(){
                  if(this.id.includes('[j]')){
                  var s = "response."+this.id.split('.')[0];
                  if(eval(s)){
                   var id = this.value;
                   if(this.value=="Video URL"){
                     objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                   }else{
                     var str = (this.checked ? "response."+this.id : 0);
                     //IF ARRAY
                     if(str.includes("[i]")){
                       //console.log("Includes [i]: ",str);
                       var i=0;
                       var splt =  str.split("[i]");
                       // start if undefined
                       if(eval(splt[0]).length==0){
                        objData[id]="";
                      }else{// start if NOT undefined
                      objData[id] = (this.checked ? eval("response."+this.id) : 0);
                      for(i=1; i<eval(splt[0]).length; ++i){
                        objData[id] += ", ";
                        objData[id] += eval("response."+this.id);
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
                 }//if not undefined
               else{
                 defined=false;
               }

              }//if [j]
              else{
                console.log("NO J HERE")
                var s = "response[j]."+this.id;
                  if(eval(s)){
                   var id = this.value;
                   if(this.value=="Video URL"){
                     objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                   }else{
                     var str = (this.checked ? "response[j]."+this.id : 0);
                     //IF ARRAY
                     if(str.includes("[i]")){
                       //console.log("Includes [i]: ",str);
                       var i=0;
                       var splt =  str.split("[i]");
                       // start if undefined
                       if(eval(splt[0]).length==0){
                        objData[id]="";
                      }else{// start if NOT undefined
                      objData[id] = (this.checked ? eval("response[j]."+this.id) : 0);
                      for(i=1; i<eval(splt[0]).length; ++i){
                        objData[id] += ", ";
                        objData[id] += eval("response[j]."+this.id);
                      }
                    }///test undefined
                      //IF OBJECT and not ARRAY
                     }else if(eval("response[j]."+this.id) instanceof Object && !(eval("response[j]."+this.id) instanceof Array)){
                       //console.log("IT IS OBJECT");
                       var objD = (this.checked ? eval("response[j]."+this.id) : 0);
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
                       objData[id] = (this.checked ? eval("response[j]."+this.id) : 0);
                       //console.log("objData[id]: ", objData[id]);
                     }
                   }
                 }//if not undefined
               else{
                 defined=false;
               }
              }
             });//checkbox
           }//chckbox loop

               if(defined){
                 data.push(objData);
                 obj.lists=[];
                 obj.lists.push(objData);
              }
          }//while loop
        }else{
        var j=0;
        while(defined){ //MADE BIG CHANGES!!
        // for (var j=0; j<25 && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
           objData={};
           ++start;
           objData["id"]= start;
           console.log("J: ",j);

           if($("input[name='checkbox-w']").is(":checked")){
               $("input[name='checkbox-w']:checked").each(function(){
                 if(this.id.includes('[j]')){
                    var s = "response."+this.id.split('.')[0];
                    var arrLength = "response."+this.id.split('[j]')[0];
                                  if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){
                                  var id = this.value;
                                  if(this.value=="Video URL"){
                                    objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                                  }else{
                                    var str = (this.checked ? "response."+this.id : 0);
                                    //IF ARRAY
                                    if(str.includes("[i]")){
                                      var i=0;
                                      var splt =  str.split("[i]");
                                      // start if undefined
                                      if(eval(splt[0]).length==0){
                                       objData[id]="";
                                     }else{// start if NOT undefined
                                     objData[id] = (this.checked ? eval("response."+this.id) : 0);
                                     for(i=1; i<eval(splt[0]).length; ++i){
                                       objData[id] += ", ";
                                       objData[id] += eval("response."+this.id);
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
                                }//if not undefined
                              else{
                                defined=false;
                              }
                 }else{ ///NORMAL ARRAY
                  console.log("NO J!")
                  var arrLength = "response";
                if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){
                  console.log("NO J4!")
                  console.log("this.id: ",eval("response[j]."+this.id));
                var id = this.value;
                if(this.value=="Video URL"){
                  objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response[j]."+this.id) : 0);
                }else{
                  var str = (this.checked ? "response[j]."+this.id : 0);
                  //IF ARRAY
                  if(str.includes("[i]")){
                    var i=0;
                    var splt =  str.split("[i]");
                    // start if undefined
                    if(eval(splt[0]).length==0){
                     objData[id]="";
                   }else{// start if NOT undefined
                   objData[id] = (this.checked ? eval("response."+this.id) : 0);
                   for(i=1; i<eval(splt[0]).length; ++i){
                     objData[id] += ", ";
                     objData[id] += eval("response."+this.id);
                   }
                 }///test undefined
                   //IF OBJECT and not ARRAY
                  }else if(eval("response[j]."+this.id) instanceof Object && !(eval("response[j]."+this.id) instanceof Array)){
                    //console.log("IT IS OBJECT");
                    var objD = (this.checked ? eval("response[j]."+this.id) : 0);
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
                  console.log("objData[id]: ", objData[id]);
                  //IF NEITHER
                  }else{
                    //console.log("Does NOT Include [i]");
                    objData[id] = (this.checked ? eval("response[j]."+this.id) : 0);
                    console.log("objData[id]: ", objData[id]);
                  }
                }
                  }//if not undefined
                 else{
                    console.log("NO J3!")
                    defined=false;
                  }
                }
  
           });//checkbox
         }//chckbox loop

             if(defined){
               data.push(objData);
               obj.lists=[];
               obj.lists.push(objData);
            }

            ++j;
            //++start;

        }//while loop
      }//else

        if(p<pages){
          if(obJSON1.currPageParam){ //nex\prev page
            ++p;
            getTheNextPage(p, pages, eval("response."+obJSON1.nextPageParam));
          }else if(obJSON1.offsetPage){//offset page
            ++p;
            getTheNextPage(p, pages, eval("response."+obJSON1.offsetPage));
          }else{//index page
            ++p;
            getTheNextPage(p, pages, eval("response."+obJSON1.indexPage));
          }
        }else{
          if(data.length<2){
            // console.log("data: ", data);
            $("#myGrid").hide();
            $("#tableV").hide();
            $("#listV").click();

            populateListAndTree(arrData2)
            //populateTable(data);
          }
          // else if(data.length==1){
          //   populateListAndTree(response);
          //}
          else{
            //$("#tableV").hide();
            // console.log("data: ", response);
            // console.log("arrData2: ", arrData2);
            populateListAndTree(response);
            populateTable(data);
            // console.log("create something else other than table!")
          }
        }

      }//response
  //  );//new AJAX
   });//AJAX
 }//if header
else if(obJSON1.headers && obJSON1.headers[0].headerValue){ //if header
  // console.log("if headers")

  $.ajax({
    url: "/apiClean/"+obJSON1.title,
    // data: listExist,//JSON.parse(listP),
    method: method,
    // headers: headers_to_set,
    success: function (response) {
      console.log("TEST response: ", response);


        if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
          for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
             objData={};

             objData["id"]= start;

             if($("input[name='checkbox-w']").is(":checked")){
                 $("input[name='checkbox-w']:checked").each(function(){
                  //  console.log("this.id: ", this.id);
                  var s = "response."+this.id.split('.')[0];
                  // console.log("s: ",s);
                  if(eval(s)){
                   var id = this.value;
                   if(this.value=="Video URL"){
                     objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                   }else{
                     var str = (this.checked ? "response."+this.id : 0);
                     //IF ARRAY
                     if(str.includes("[i]")){
                       //console.log("Includes [i]: ",str);
                       var i=0;
                       var splt =  str.split("[i]");
                       // start if undefined
                       if(eval(splt[0]).length==0){
                        objData[id]="";
                      }else{// start if NOT undefined
                      objData[id] = (this.checked ? eval("response."+this.id) : 0);
                      for(i=1; i<eval(splt[0]).length; ++i){
                        objData[id] += ", ";
                        objData[id] += eval("response."+this.id);
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
                 }//if not undefined
               else{
                 defined=false;
               }
             });//checkbox
           }//chckbox loop

               if(defined){
                 data.push(objData);
                 obj.lists=[];
                 obj.lists.push(objData);
              }

              //++j;
              //++start;

          }//while loop
        }else{
        var j=0;
        while(defined){
      //for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
      objData={};
      ++start;
      objData["id"]= start;
      // console.log("J: ",j);

      if($("input[name='checkbox-w']").is(":checked")){
          $("input[name='checkbox-w']:checked").each(function(){
            var s = "response."+this.id.split('.')[0];
            var arrLength = "response."+this.id.split('[j]')[0];
            var ln = s.split('[')[0];

            if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){// || typeof eval(s) === 'undefined' || j==eval(ln).length){
            var id = this.value;
            if(this.value=="Video URL"){
              objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
            }else{
              var str = (this.checked ? "response."+this.id : 0);
              //IF ARRAY
              if(str.includes("[i]")){
                //console.log("Includes [i]: ",str);
                var i=0;
                var splt =  str.split("[i]");
                // start if undefined
                if(eval(splt[0]).length==0){
                 objData[id]="";
               }else{// start if NOT undefined
               objData[id] = (this.checked ? eval("response."+this.id) : 0);
               for(i=1; i<eval(splt[0]).length; ++i){
                 objData[id] += ", ";
                 objData[id] += eval("response."+this.id);
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
          }//if not undefined
        else{
          defined=false;
        }
      });//checkbox
    }//chckbox loop

        if(defined){
          data.push(objData);
          obj.lists=[];
          obj.lists.push(objData);
       }

       ++j;
       //++start;

      }//while loop
    }//else

        if(p<pages){
          //console.log("Data: ", data);
          if(obJSON1.currPageParam){ //nex\prev page
              ++p;
              getTheNextPage(p, pages, eval("response."+obJSON1.nextPageParam));
          }else if(obJSON1.offsetPage){//offset page
            ++p;
            getTheNextPage(p, pages, eval("response."+obJSON1.offsetPage));
          }else{//index page
            ++p;
            getTheNextPage(p, pages, eval("response."+obJSON1.indexPage));
          }
        }else{
          if(data.length>0){
            console.log("data: ", data);
            populateListAndTree(arrData2);
            populateTable(data);
          }else{
            populateListAndTree(response);
            console.log("create something else other than table!")
          }
        }

      }//response
  //  );//new AJAX
   });//AJAX
 }//else CORS
 else{ //if oauth
   console.log("if oauth")
   authorizeSNAPI();

///THERE


 }//else

  }//end of getTheNextPage function

  arrData2 = data;

}//end of retrieveData function

function populateListAndTree(arrData3){
  /***************** List View ******************/
  for(var j=0; j<arrData2.length; ++j){
    for(var i=1; i<col.columns.length; ++i){
      var v = col.columns[i].name;
      if(typeof arrData2[j][v] == 'string' ){
      //if(arrData2[j][v].startsWith("http")){//link
        if(arrData2[j][v].startsWith("http") && arrData2[j][v].includes(".jpg") || arrData2[j][v].includes(".png")){//image
          $("#myList").append("<label value='' style='font-size:1em; color:teal'>"+col.columns[i].name+": </label>");
          $("#myList").append("</br><img style='width:200px' src='"+arrData2[j][v]+"'></img></br>");
        }else if(arrData2[j][v].startsWith("http")){//not image
          $("#myList").append("<label value='' style='font-size:1em; cursor:pointer; color:teal'>"+col.columns[i].name+": </label>");
          $("#myList").append("<a style='color:blue' target='_blank' href='"+arrData2[j][v]+"'>"+arrData2[j][v]+"</a></br>");
        }else{
          $("#myList").append("<label value='' style='font-size:1em; color:teal; display:inline-block'>"+col.columns[i].name+": </label>");
          $("#myList").append("<p value='' style='font-size:1em; margin:0px; padding:0px; display:inline-block'>"+arrData2[j][v]+"</p></br>");
        }
      }else{
        $("#myList").append("<label value='' style='font-size:1em; color:teal; display:inline-block'>"+col.columns[i].name+": </label>");
        $("#myList").append("<p value='' style='font-size:1em; margin:0px; padding:0px; display:inline-block'>"+arrData2[j][v]+"</p></br>");
      }
    }
    $("#myList").append("</br></br></br>");
  }

  /***************** Tree View ******************/
  document.getElementById("myTree").appendChild(renderjson(arrData3));
  //document.getElementById("myTree").innerHTML = JSONTree.create(response);
  //Download
  var data1 = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(arrData3, '', 7));

  $( "#JSON" ).remove();
  $( "#CSV" ).remove();
  $( "#JS" ).remove();
  $( "#saveBut" ).remove();
  //$( "#SCRIPT" ).remove();

  $('<a id="CSV" class="button button-mini button-border button-rounded button-red" style="" href="data:text/csv,'+encodeURIComponent(DownloadJSON2CSV())+'" download = "data.csv"><i class="glyphicon glyphicon-download-alt" style="left:2px"></i>CSV</a>').appendTo('#viewButtons2');
  $('<a id="JSON" class="button button-mini button-border button-rounded button-blue" style="" onclick="downloadJSON()" href="data:' + data1 + '" download="data.json"><i class="glyphicon glyphicon-download-alt" style="left:2px"></i>JSON</a>').appendTo('#viewButtons2');
  $('<a id="JS" class="button button-mini button-border button-rounded button-green" onclick="getCodeClicked()" data-toggle="modal" data-target="#modalPaste" href=""><i class="glyphicon glyphicon-console" style="left:2px"></i>CODE</a>').appendTo('#viewButtons2');

  // $('<button onclick="dang()" id="codeBut" type="button" class="button button-mini button-border button-rounded button-green dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="glyphicon glyphicon-console" style="left:2px"></i>CODE</button>').appendTo('#viewButtons2');
  $('<button id="saveBut" type="button" class="button button-mini button-border button-rounded button-amber dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false"> <i class="glyphicon glyphicon-floppy-disk" style="left:2px"></i>SAVE </button>').appendTo('#viewButtons2');
  // $('<button id="SCRIPT" type="button" class="button button-mini button-border button-rounded button-green"  aria-haspopup="true" aria-expanded="false"> <img src="images/java.png" width="15px" height="15px" bottom="5px"> &nbsp;Script </button>').appendTo('#viewButtons2');
}

  function populateTable(data){
    // console.log("THIS DATA: ", data)

    // const a = document.createElement("a");
    // a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], {
    //   type: "text/plain"
    // }));
    // a.setAttribute("download", "data.json");
    // document.body.appendChild(a);
    // a.click();
    // document.body.removeChild(a);

    $("#jsCode").empty();

    //pagination + response fields + headers

    jsSnippet= '<code class="language-javascript">$.ajax({</br>&nbsp;&nbsp;&nbsp;url: "'+obJSON1.url+'",</br>&nbsp;&nbsp;&nbsp;data:'+JSON.parse(JSON.stringify(listP))+',</br>&nbsp;&nbsp;&nbsp;method: "GET",</br>&nbsp;&nbsp;&nbsp;success: function (response) {</br>&nbsp;&nbsp;&nbsp;&nbsp;console.log(response);</br>&nbsp;&nbsp;&nbsp;},</br>&nbsp;&nbsp;&nbsp;error: function(response, jqXHR, textStatus, errorThrown) {</br>&nbsp;&nbsp;&nbsp;&nbsp;console.log(response.textStatus);</br>&nbsp;&nbsp;}</br>});</code>';

    pySnippet= 'import requests</br>url = "'+obJSON1.url+'" </br>querystring = '+JSON.parse(JSON.stringify(listP))+' </br>response = requests.request("GET", url, params=querystring)';

    $("#jsCode").append(jsSnippet);


          /***************** Table View ******************/
          var loadingIndicator = null;
          var jsonReturn;
          function getJsonP(resp) {
              jsonReturn = resp;
              return true;
          }

          $(function () {
            var checkboxSelector = new Slick.CheckboxSelectColumn({
              cssClass: "slick-cell-checkboxsel"
            });
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

function create_UUID(){
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c=='x' ? r :(r&0x3|0x8)).toString(16);
    });
    return uuid;
}



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

  return JSON.parse(strObj2);
}



var c = 1;

function addDataToDB(){

  var dObj={};

  dObj.apiName = obJSON1.title;
  if($("#savedName").val()){
    dObj.title = $("#savedName").val();
  }else{
    dObj.title = obJSON1.title;
  }

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

if(obJSON1.parameters){
  for(var i=0; i<obJSON1.parameters.length; ++i){
    var v;
    strQuery+=obJSON1.parameters[i]['name']
    strQuery+="="
    if(obJSON1.parameters[i]['displayedName']){
      v = $("#"+obJSON1.parameters[i]['name']).val();
      strQuery+=$("#"+obJSON1.parameters[i]['name']).val().replace(" ", "%20");
    }else{
      if(obJSON1.parameters[i]['value'] == 'true'){
        v = true;
      }else if(obJSON1.parameters[i]['value'] == 'false'){
        v = false;
      }else{
        v = obJSON1.parameters[i]['value'];
      }

      strQuery+=obJSON1.parameters[i]['value'].replace(" ", "%20");
    }

    if(i+1<obJSON1.parameters.length)
      strQuery+="&"

    parameters.push({
      name: obJSON1.parameters[i]['name'],
      value: v
    });
  }
}
  dObj.parameters = parameters;

  //maxResPerPage
  dObj.resPerPageParam = obJSON1.resPerPageParam;
  dObj.maxResPerPage   = $("#numOfResults").val();

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
        firebase.database().ref('users/'+ user.uid+'/savedData/' + dObj.title).set(JSON.parse(JSON.stringify(dObj)));

        console.log("addedFile");


      });
    }
    else{
      //window.alert("No USER")
    }
  });
  //IF public add the to the public savedQueries and allow users to search for these queries!
  var isPublic = false;

  if(document.getElementById("publicData").checked==true){
    firebase.database().ref('publicSavedData/' + dObj.title).set(JSON.parse(JSON.stringify(dObj)));
    isPublic = true;
  }

// save logs csv clicked END
if(logDecision == "accept"){

  var res = [];
  var param = [];

  if($("input[name='checkbox-w']").is(":checked")){
      $("input[name='checkbox-w']:checked").each(function(){
        res.push({
          name: this.id
        });
      });
    }



 if(obJSON1.parameters){

  for(var i=0; i<obJSON1.parameters.length; ++i){
   param.push({
     name: obJSON1.parameters[i]['name'],
     value: obJSON1.parameters[i]['value']
   });
  }
}

  getLogObj = {};

  getLogObj.id = document.cookie;
  getLogObj.timestamp = Date.now();
  getLogObj.url = obJSON1.url;
  getLogObj.parameters = param;
  getLogObj.response = res;
  getLogObj.butClicked = "SAVE";
  getLogObj.savePublic = isPublic;

  firebase.database().ref('getLog/' +ui).push(JSON.parse(JSON.stringify(getLogObj)));
}

  // console.log("Data Logged: ", getLogObj);
  // save logs csv clicked END
}


function getCodeClicked(){
  // save logs code clicked END
  if(logDecision == "accept"){
    var res = [];
    var param = [];

    if($("input[name='checkbox-w']").is(":checked")){
        $("input[name='checkbox-w']:checked").each(function(){
          res.push({
            name: this.id
          });
        });
      }


  if(obJSON1.parameters){

    for(var i=0; i<obJSON1.parameters.length; ++i){
     param.push({
       name: obJSON1.parameters[i]['name'],
       value: obJSON1.parameters[i]['value']
     });
    }
  }

    getLogObj = {};

    getLogObj.id = document.cookie;
    getLogObj.timestamp = Date.now();
    getLogObj.url = obJSON1.url;
    getLogObj.parameters = param;
    getLogObj.response = res;
    getLogObj.butClicked = "CODE";

    firebase.database().ref('getLog/' +ui).push(JSON.parse(JSON.stringify(getLogObj)));
  }
    // console.log("Data Logged: ", getLogObj);
    // save logs code clicked END

}


function downloadJSON(){

  // save logs JSON clicked END
  if(logDecision == "accept"){
    var res = [];
    var param = [];

    if($("input[name='checkbox-w']").is(":checked")){
        $("input[name='checkbox-w']:checked").each(function(){
          // console.log("VALUE: ",this.value);
          // console.log("FIELD: ",this.id);
          res.push({
            name: this.id
          });
        });
      }

  if(obJSON1.parameters){

    for(var i=0; i<obJSON1.parameters.length; ++i){
     param.push({
       name: obJSON1.parameters[i]['name'],
       value: obJSON1.parameters[i]['value']
     });
    }
  }

    getLogObj = {};

    getLogObj.id = document.cookie;
    getLogObj.timestamp = Date.now();
    getLogObj.url = obJSON1.url;
    getLogObj.parameters = param;
    getLogObj.response = res;
    getLogObj.butClicked = "JSON";

    firebase.database().ref('getLog/'+ui.push(JSON.parse(JSON.stringify(getLogObj))));
  }
    // console.log("Data Logged: ", getLogObj);
    // save logs JSON clicked END

}



function convertArrayOfObjectsToCSV(args) {
        var result, ctr, keys, columnDelimiter, lineDelimiter, data;

        data = args.data || null;
        if (data == null || !data.length) {
            return null;
        }

        columnDelimiter = args.columnDelimiter || ',';
        lineDelimiter = args.lineDelimiter || '\n';

        keys = Object.keys(data[0]);

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        data.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                result += item[key];
                ctr++;
            });
            result += lineDelimiter;
        });

        return result;
    }

    function downloadCSV(args) {
        var data, filename, link;

        var csv = convertArrayOfObjectsToCSV({
            data: stockData
        });
        if (csv == null) return;

        filename = args.filename || 'export.csv';

        if (!csv.match(/^data:text\/csv/i)) {
            csv = 'data:text/csv;charset=utf-8,' + csv;
        }
        data = encodeURI(csv);

        link = document.createElement('a');
        link.setAttribute('href', data);
        link.setAttribute('download', filename);
        link.click();
    }




function DownloadJSON2CSV(){
        var array = typeof data != 'object' ? JSON.parse(arrData2) : arrData2;
        var str = '';
        // console.log("array: ", array);

        for (var i = 0; i < array.length; i++) {
            var line = '';
            for (var index in array[i]) {
                line += array[i][index] + ',';
            }
            line.slice(0,line.Length-1);
            str += line + '\r\n';
        }
        // console.log("csv: ", str);
        return str;
}



function saveLogs(){
  console.log("SAVE CSV");
  // save logs save clicked END
  if(logDecision == "accept"){

    var res = [];
    var param = [];

    if($("input[name='checkbox-w']").is(":checked")){
        $("input[name='checkbox-w']:checked").each(function(){
          res.push({
            name: this.id
          });
        });
      }


  if(obJSON1.parameters){

  for(var i=0; i<obJSON1.parameters.length; ++i){
   param.push({
     name: obJSON1.parameters[i]['name'],
     value: obJSON1.parameters[i]['value']
   });
 }
}

  getLogObj = {};

  getLogObj.id = document.cookie;
  getLogObj.timestamp = Date.now();
  getLogObj.url = obJSON1.url;
  getLogObj.parameters = param;
  getLogObj.response = res;
  getLogObj.butClicked = "CSV";

   firebase.database().ref('getLog/' +ui).push(JSON.parse(JSON.stringify(getLogObj)));

  }
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

//
// $("#groupByFilterSelect").change(function() {
//     var str = "";
//     $( "#groupByFilterSelect option:selected" ).each(function() {
//       str += $(this).text() + " ";
//     });
//
//     if(str == "Channel Title "){
//       groupByChannelTitle();
//     }else if(str == "Published At "){
//       groupByDate();
//     }else if("Channel Title Published At " || "Published At Channel Title "){
//       groupByChannelTitleDate();
//     }else if(str==" "){
//       degroupBy();
//     }
//
//   }).trigger("change");

function degroupBy(){
  dataView.setGrouping([]);
  $('#groupByFilterSelect').val([]);
}


function clearTable(){

  $('#requestTabel tbody').empty();

  if(optionalParam.length>0){
    for(var i=0; i < optionalParam.length; ++i){
      $("#optionalP").append('<button id="'+optionalParam[i].name+'" class="button button-mini button-circle button-border button-teal" data-tooltip="'+optionalParam[i].descrip+'" style="text-transform:none; padding: 0 6px; " onclick="addReqRow(this)">'+optionalParam[i].name+'</button>');
    }
  }

  // $("#requestTabel tbody").append('<tr id="firstTR"><td><input class="form-control" type="text" id="name" onchange="urlBlur()" placeholder="Request parameter"></td><td><input class="form-control" type="text" id="value" onchange="urlBlur()" placeholder="Parameter default value"></td><td><input class="form-control" type="text" id="listOfValues" placeholder="Value1, Value2, ..."></td><td><input id="displayedName" class="form-control" type="text" placeholder="Name displayed to users"></td><td><input class="form-control" type="text" id="desc" placeholder="Parameter description"></td><td><select class="form-control" id="type" style="height:30px"><option value="string">String</option><option value="int">Integer</option><option value="date-time">Boolean</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td ><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="" autocomplete="off" checked/></td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"/></td></tr>');

  $("#requestTabel tbody").append('<tr id="firstTR"><td><input class="form-control" type="text" id="name"  style="width:85px" onchange="urlBlur()" placeholder="Request parameter"></td><td><input class="form-control" type="text" id="value"  style="width:85px" onchange="urlBlur()" placeholder="Parameter default value"></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder="Value1, Value2, ..."rows="1" onchange="urlBlurNoCall()"></textarea></td><td><input id="displayedName" class="form-control" type="text" placeholder="" onchange="urlBlurNoCall()"></td><td><textarea class="form-control" type="text" id="desc" placeholder="" rows="1" onchange="urlBlurNoCall()"></textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()"><option value="string">String</option><option value="int">Integer</option><option value="date-time">Boolean</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"/></td></tr>');

  urlBlurNoCall();
}


function generateTableFromSwagger(url){
  console.log("URL: ", url)
  $('#requestTabel tbody').empty();
  $("#optionalP").empty();

  var data = $('textarea[name=swagger_schema]').val();
  var obj = JSON.parse(data);
  var tmp = url.split("/");
  var path = "/"+tmp.pop();
  console.log(obj.paths[path].get.parameters);
  var params = obj.paths[path].get.parameters;
  for(var i=0; i<params.length; ++i){
    console.log("Name: ", params[i]['name']);
    console.log("Description: ", params[i]['description']);
    console.log("Type: ", params[i]['type']);

    //list of values
    var enumSTR = '';
    var enumSTRfirst = '';

    if(params[i]['enum']){
      for(var j=0; j< params[i]['enum'].length; ++j){
        enumSTR+=params[i]['enum'][j];
        if(j+1 < params[i]['enum'].length){
          enumSTR+=",";
        }
      }
      enumSTRfirst = params[i]['enum'][0];
    }else{
      //nothing
    }


    //required
    if(params[i]['required'] == true){
      var required = '<input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/>';
    }else{
       var required = '<input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off"/>'
    }

    //type
    if(params[i]['type'] == 'string'){
      var sub = '<option value="string" selected>String</option><option value="int">Integer</option><option value="date-time">Boolean</option><option value="date">Date</option><option value="date-time">DateTime</option>'
    }else if(params[i]['type'] == 'boolean'){
      var sub = '<option value="string">String</option><option value="int">Integer</option><option value="boolean" selected>Boolean</option><option value="date">Date</option><option value="date-time">DateTime</option>'
    }else if(params[i]['type'] == 'integer'){
      var sub = '<option value="string">String</option><option value="int" selected>Integer</option><option value="boolean">Boolean</option><option value="date">Date</option><option value="date-time">DateTime</option>'
    }else{
      var sub = '<option value="string" selected>String</option><option value="int">Integer</option><option value="date-time">Boolean</option><option value="date">Date</option><option value="date-time">DateTime</option>'
    }

    $("#requestTabel tbody").append('<tr id="firstTR"><td><input class="form-control" type="text" id="name" value="'+params[i]['name']+'" style="width:85px" onchange="urlBlur()"></td><td><input class="form-control" type="text" id="value" value="'+enumSTRfirst+'" style="width:85px" onchange="urlBlur()" ></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder="" rows="1" onchange="urlBlurNoCall()">'+enumSTR+'</textarea></td><td><input id="displayedName" class="form-control" type="text" placeholder="" onchange="urlBlurNoCall()"></td><td><textarea class="form-control" type="text" id="desc" rows="1" onchange="urlBlurNoCall()">'+params[i]['description']+'</textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()">'+sub+'</select></td><td>'+required+'</td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"/></td></tr>');

  }

  $("#toggReq").show();

}

function generateTable() {
  $("#firstTR").remove();
  var data = $('textarea[name=excel_data]').val();

  console.log("DATA!: ", data)

  var rows = data.split("\n");

  //var table = $('<table />');

  for(var y in rows) {
      var cells = rows[y].split("\t");
      console.log(cells);
      if(cells[0]!="" || cells[0]!=" "){
        var d;
        if(cells[2]==undefined){
          if(cells[1]!=undefined){
            d=cells[1];
          }else{
          d=""
        }
        }else{
          d=cells[2];
        }
      //var row = $('<tr />');
      //for(var x in cells) {
          // row.append('<td><input class="form-control" type="text" id="name" placeholder="" value="'+cells[x]+'"></td>');
      $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name" style="width:85px" onchange="urlBlur()" placeholder="" value="'+cells[0]+'"></td><td><input class="form-control" type="text" id="value" style="width:85px" onchange="urlBlur()" placeholder=""></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder=""rows="1" onchange="urlBlurNoCall()"></textarea></td><td><div><input id="displayedName" class="form-control" type="text" value="'+cells[0]+'" onchange="urlBlurNoCall()" ></div></td><td><textarea class="form-control" type="text" id="desc" value="'+d+'" rows="1" onchange="urlBlurNoCall()"></textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');



    //  }
      // table.append(row);
    }
  }

// Insert into DOM
// $('#excel_table').html(table);
}


//request functions
function addRow() {
  $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name" style="width:85px" onchange="urlBlur()" placeholder=""></td><td><input class="form-control" type="text" id="value" style="width:85px" onchange="urlBlur()" placeholder=""></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder=""rows="1" onchange="urlBlurNoCall()"></textarea></td><td><div><input id="displayedName" class="form-control" type="text" onchange="urlBlurNoCall()"></div></td><td><textarea class="form-control" type="text" id="desc" rows="1" onchange="urlBlurNoCall()"></textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');

  urlBlurNoCall();
}


function addHeaderRow() {
  $("#headerTabel").show();
  $("#headerTabel tbody").append('<tr><td><input class="form-control" type="text" id="nameH" placeholder=""></td><td></td><td><input class="form-control" type="text" id="valueH" placeholder=""></td><td></td><td></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteHeaderRow(this)"</td></tr>');
  urlBlurNoCall();
}

var stepsCount = 0;

function addStepRow() {
  ++stepsCount;
  $("#stepsTabel").show();
  $("#stepsTabel tbody").append('<tr><td><label>Step '+stepsCount+ '</label></td><td>&nbsp;</td><td><textarea class="form-control" type="text" id="authDesc" rows="1" cols="70"></textarea></td><td>&nbsp;</td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteStepRow(this)"</td></tr></br></br>');
  // urlBlurNoCall();
}

function addHeaderRowAuth() {
  $("#headerTabel").show();
  $("#headerTabel tbody").empty();
  $("#headerTabel tbody").append('<tr><td><input class="form-control" type="text" id="nameH" placeholder=""></td><td></td><td><input class="form-control" type="text" id="valueH" placeholder=""></td><td></td><td></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteHeaderRow(this)"</td></tr>');
  urlBlurNoCall();
}


function deleteRow(row) {

  var i = row.parentNode.parentNode.rowIndex;
  document.getElementById('requestTabel').deleteRow(i);

  var paramName = row.parentNode.parentNode.childNodes[0].childNodes[0].value;
  //console.log("paramName: ", paramName);


  if($('#optionalP').is(':empty')) {
    console.log("optional parameters DO NO exit");
    //do nothing
  }else{
    if(optionalParam.length > 0){
      for(var i=0; i < optionalParam.length; ++i){
        if(paramName == optionalParam[i].name){
          //add it back to list of oprional parameters
          $("#optionalP").append('<button id="'+optionalParam[i].name+'" class="button button-mini button-circle button-border button-teal" data-tooltip="'+optionalParam[i].descrip+'" style="text-transform:none; padding: 0 6px; " onclick="addReqRow(this)">'+optionalParam[i].name+'</button>');
        }
      }
    }else if(duplicates.length > 0){
      for(var j=0; j < duplicates.length; ++j){
        if(paramName == duplicates[j]){
          //add it back to list of oprional parameters
          $("#optionalP").append('<button id="'+duplicates[j]+'" class="button button-mini button-circle button-border button-teal" data-tooltip="" style="text-transform:none; padding: 0 6px; " onclick="addReqRow(this)">'+duplicates[j]+'</button>');
        }
      }
    }
  }


}

function deleteHeaderRow(row) {
  var i = row.parentNode.parentNode.rowIndex;
  document.getElementById('headerTabel').deleteRow(i);
}

function deleteStepRow(row) {
  var i = row.parentNode.parentNode.rowIndex;
  document.getElementById('stepsTabel').deleteRow(i);
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

function deleteRowAccountTableAPIs(row,name) {
  console.log("ROW id: ", name.id);
  var i = row.parentNode.parentNode.rowIndex;
  document.getElementById('api_table_content').deleteRow(i);

  firebase.auth().onAuthStateChanged(function (user) {
    if(user){
      //private account data "account"
      firebase.database().ref('users/'+ user.uid+'/savedAPIs/'+name.id).remove();
      //public saved data
      firebase.database().ref('apis/'+name.id).remove();
    }//user
  });

  //window.location.href='account.html';
}

// $("#containerALL").click(function(){
//
//     console.log("You knocked?");
//     if($("#url").val()){
//     var arrParamVal = [];
//
//     if($("#url").val().includes('?')){
//       $("#requestTabel tbody").empty();
//       $("#toggReq").show();
//       var parts = $("#url").val().split('?')[1];
//       var link = $("#url").val().split('?')[0];
//       document.getElementById('url').value = link;
//       $("#url").value = link;
//
//       var reqParam = parts.split("&");
//       for(var x=0; x<reqParam.length; ++x){
//         arrParamVal.push(reqParam[x]);
//       }
//
//       for(var x=0; x<arrParamVal.length; ++x){
//         var p = arrParamVal[x].split("=");
//         $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name" style="width:85px" onchange="urlBlur()" placeholder="" value="'+p[0]+'"></td><td><input class="form-control" type="text" id="value"  style="width:85px" onchange="urlBlur()" placeholder="" value="'+p[1]+'"></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder=""rows="1" onchange="urlBlurNoCall()"></textarea></td><td><div><input id="displayedName" class="form-control" type="text" onchange="urlBlurNoCall()"></div></td><td><textarea class="form-control" type="text" id="desc" rows="1" onchange="urlBlurNoCall()"></textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');
//       }
//     }else{
//       var link = $("#url").val();
//     }//else
//
//     // $("#jsonResponse").empty();
//
//     var first = true;
//     var listData="{";
//     $('#requestTabel tbody tr').each(function(i, n){
//       var $row = $(n);
//       if(first){
//         if($row.find('#value:eq(0)').val()){
//           if($row.find('#name:eq(0)').val()){
//             listData+= JSON.stringify($row.find('#name:eq(0)').val());
//             listData+=":";
//             listData+= JSON.stringify($row.find('#value:eq(0)').val());
//           }
//         }
//         first = false;
//       }else{
//       if($row.find('#value:eq(0)').val()){
//         if($row.find('#name:eq(0)').val()){
//           listData+=", "
//           listData+= JSON.stringify($row.find('#name:eq(0)').val());
//           listData+=":";
//           listData+= JSON.stringify($row.find('#value:eq(0)').val());
//         }
//       }
//     }
//
//     $("#reqParameters").append(""+$row.find('#name:eq(0)').val()+"&nbsp;<a type=''  data-trigger='focus' data-placement='right' title='"+$row.find('#name:eq(0)').val()+"'><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span></a>")
//
//     });
//
//
//     listData+="}";
//
//     //console.log("listData: ", listData);
//     //console.log("LINK: ", link);
//
//     $.ajax({
//       url: link,
//       data: JSON.parse(listData),
//       method: 'GET',
//       success: function (response) {
//         // document.getElementById('jsonResponse').style.backgroundColor="#e4f3db";
//         // $("#jsonResponse").append('<code>'+JSON.stringify(response, null, 2)+'</code>');
//
//         showResponseSchema(listData);
//         $("#toggRes").show();
//         $("#correct").show();
//         $("#notcorrect").hide();
//
//         //reviewAPIIntegration();
//       },
//       error: function(response, jqXHR, textStatus, errorThrown) {
//         // document.getElementById('jsonResponse').style.backgroundColor="#ffecef";
//         // $("#jsonResponse").append('<code>'+response.responseText+'</code>');
//         $("#toggRes").hide();
//         $("#correct").hide();
//         $("#notcorrect").show();
//       }
//     });
//   }else{
//     //add url!
//     // $("#toggRes").hide();
//     console.log("No URL");
//    }
//   });



function urlBlurLog(){
  //save log of everything
  console.log("save this row: ");
  // console.log("part "+partNum);

  // if(document.getElementById("correct").display == "hidden"){
  //   console.log("TRUE");
  // }else{
  //   console.log("FALSE");
  // }


  // console.log("listData: ", listData);
  console.log("LINK: ", $("#url").val());
}

var logObj;
var uID, status, jsResponse;
var draw = false;
var logs = [];

var firstSuc = true;
var hasParameters = false;

var isAuth = false, isReq = false;
var errorMessageJson="";

var method="GET";


$("#method").on('change', function() {
    console.log("change to ", $(this).val());

    if ($(this).val() == 'POST'){
        method = 'POST'
    } else if ($(this).val() == 'PUT'){
        method = 'PUT';
    }else if ($(this).val() == 'INSERT'){
        method = 'INSERT';
    }else if ($(this).val() == 'DELETE'){
        method = 'DELETE';
    }else{
        method="GET";
    }
});


function urlBlur(){
  // console.log("urlBlur() is called!");
  logObj = {};
  logs = [];

  firebase.auth().onAuthStateChanged(function (user) {
    if(user){

    if(logIntDecision == "accept"){
      firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
        uID = snapshot.val().userId;

        logObj.user = snapshot.val().name;
        logObj.timestamp = Date.now();
        logObj.fields = this.myObj;
        logObj.status = status;
        logObj.feedback = jsResponse;

        firebase.database().ref('log/' + uID).push(JSON.parse(JSON.stringify(logObj)));
      });
    }
   }
  });


if($("#url").val()){
  var arrParamVal = [];
  hasParameters = false;

  // if($("#url").val().includes('/?')){ //? not for parameters
  //   var link = $("#url").val();

  // }else if($("#url").val().includes('?')){
  if($("#url").val().includes('?')){
    hasParameters = true;

    $("#requestTabel tbody").empty();
    $("#toggReq").show();
    var parts = $("#url").val().split('?')[1];
    var link = $("#url").val().split('?')[0];

    document.getElementById('url').value = link;
    $("#url").value = link;

    var reqParam = parts.split("&");
    for(var x=0; x<reqParam.length; ++x){
      arrParamVal.push(reqParam[x]);
    }

    for(var x=0; x<arrParamVal.length; ++x){
      var p = arrParamVal[x].split("=");
      $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name"  style="width:85px" onchange="urlBlur()" placeholder="" value="'+p[0]+'"></td><td><input class="form-control" type="text" id="value"  style="width:85px" onchange="urlBlur()" placeholder="" value="'+p[1]+'"></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder=""rows="1" onchange="urlBlurNoCall()"></textarea></td><td><div><input id="displayedName" class="form-control" type="text" onchange="urlBlurNoCall()"></div></td><td><textarea class="form-control" type="text" id="desc" rows="1" onchange="urlBlurNoCall()"></textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');
    }
   }else{
    var link = $("#url").val();
  }//else

  $("#jsonResponse").empty();


  var listData="{";
  $('#requestTabel tbody tr').each(function(i, n){
    var $row = $(n);

    if(listData=="{"){
      if($row.find('#value:eq(0)').val()){
        if(link.includes('{'+JSON.parse(JSON.stringify($row.find('#name:eq(0)').val()))+'}')){
          link=link.replace('{'+JSON.parse(JSON.stringify($row.find('#name:eq(0)').val()))+'}', JSON.parse(JSON.stringify($row.find('#value:eq(0)').val())));
        }else{
        if($row.find('#name:eq(0)').val()){
          listData+= JSON.stringify($row.find('#name:eq(0)').val());
          listData+=":";
          listData+= JSON.stringify($row.find('#value:eq(0)').val());
        }
       }//new if
      }else{
      }
    }else{
      if($row.find('#value:eq(0)').val()){
        if($row.find('#name:eq(0)').val()){
          listData+="," //FIX THIS COMMA
          listData+= JSON.stringify($row.find('#name:eq(0)').val());
          listData+=":";
          listData+= JSON.stringify($row.find('#value:eq(0)').val());
        }
      }else{

      }
    }

  $("#reqParameters").append(""+$row.find('#name:eq(0)').val()+"&nbsp;<a type=''  data-trigger='focus' data-placement='right' title='"+$row.find('#name:eq(0)').val()+"'><span class='glyphicon glyphicon-info-sign' aria-hidden='true'></span></a>")

  });

  if($("#valueKey").val() != ""){
    listData+= ","
    listData+= JSON.stringify($("#nameKey").val());
    listData+=":";
    listData+= JSON.stringify($("#valueKey").val());
  }

  listData+="}";
  // console.log("listData: ", listData);

  if($("#valueH").val() && document.getElementById('selectid').value != "oauth2"){

    // $.ajax({
    //   url: "/apiClean/"+obJSON1.title,
    //   // data: listExist,//JSON.parse(listP),
    //   method: method,
    //   // headers: headers_to_set,
    //   success: function (response) {
    //     console.log("TEST response: ", response);

    // var headername= $("#nameH").val();
    // var headervar= $("#valueH").val();
    // var headers_to_set = {};
    // headers_to_set[headername] = headervar;

    $.ajax({
      url: "https://cors-anywhere.herokuapp.com/"+link,
      data: JSON.parse(listData),
      method: method,
      headers: headers_to_set,
      success: function (response) {
        status = "success";
        jsResponse = JSON.stringify(response, null, 2);

        showResponseSchema(listData);
        $("#toggRes").show();

        errorMessageJson = "You've successfully accessed the API!";

        //$("#pDiv").show(); //unhighlight
        $("#correct").show();
        $("#notcorrect").hide();
        document.getElementById("pValidatetext").innerHTML=errorMessageJson;
        document.getElementById('pValidatetext').style.color="green";
        document.getElementById('pDiv').style.borderColor="green";
        document.getElementById('pDiv').style.backgroundColor="#f2f9ee";

        responseMessage(response, status);
      },
      error: function(response, jqXHR, textStatus, errorThrown) {
        // console.log(JSON.stringify(response));
        status = "error";

        if(response.hasOwnProperty('responseText')){
          jsResponse = response.responseText;
        }else{
          jsResponse = response;
        }

        showResponseSchema(listData);
        $("#toggRes").hide();

        var authSubstrings = ['api key','API key', 'key', 'oauth', 'authentication','auth', 'validation'];
        var reqSubstrings = ['parameter', 'parameters', 'required parameter'];

        var lengthA = authSubstrings.length;
        var lengthR = reqSubstrings.length;

        while(lengthA--) {
           if (JSON.stringify(response).indexOf(authSubstrings[lengthA])!=-1){
             isAuth=true;
           }
         }
         while(lengthR--) {
           if (JSON.stringify(response).indexOf(reqSubstrings[lengthR])!=-1){
             isReq=true;
           }
        }

        if(isAuth){
          errorMessageJson = "Error: Missing authentication? Check message below";
        }else if(isReq){
          errorMessageJson = "Error: Missing required parameter(s)? Check message below";
        }else{
          errorMessageJson = "Error: Missing parameter(s)/authentication? Check message below";
        }

        var responseJSONChildren;

        if(response.hasOwnProperty('responseJSON')){
          //get the longest text there and show it as the message
          responseJSONChildren = flatten(response.responseJSON);
        }else if(response.hasOwnProperty('responseText')){
          responseJSONChildren = flatten(response.responseText);
        }else{//custom message (most likely response.responseText)
            // Show a custom message?
        }

          function flatten(obj) {
          var flattenedObj = {};
          Object.keys(obj).forEach(function(key){
              if (typeof obj[key] === 'object') {
                  $.extend(flattenedObj, flatten(obj[key]));
              } else {
                  flattenedObj[key] = obj[key];
              }
          });
          return flattenedObj;
          }

          var arrayOfValues = [];
          var x=0;
          var urlJson;

          for (let [key, value] of Object.entries(responseJSONChildren)) {
            // console.log(`${key}: ${value}`);
            if(ValidURL(`${value}`)){
              urlJson = `${value}`;
            }else{
              arrayOfValues[x]=`${value}`;
              ++x;
            }
          }

          function ValidURL(str) {
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if(!regex .test(str)) {
              return false;
            } else {
              return true;
            }
          }

          var longest = arrayOfValues.reduce(function (a, b) { return a.length > b.length ? a : b; });
          errorMessageJson ="Error: "+ longest+' '+urlJson;


        //$("#pDiv").show(); //unhighlight
        $("#notcorrect").show();
        $("#correct").hide();
        document.getElementById("pValidatetext").innerHTML=createTextLinks_(errorMessageJson);
        document.getElementById('pValidatetext').style.color="red";
        document.getElementById('pDiv').style.borderColor="red";
        document.getElementById('pDiv').style.backgroundColor="#fceff1";

        function createTextLinks_(text) {

          return (text || "").replace(
            /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
            function(match, space, url){
              var hyperlink = url;
              if (!hyperlink.match('^https?:\/\/')) {
                hyperlink = 'http://' + hyperlink;
              }
              return space + '<a target="_blank" href="' + hyperlink + '">' + url + '</a>';
            }
          );

        };
        // console.log(JSON.stringify(response));
        responseMessage(response, status);
      }
    });

  }else if(document.getElementById('selectid').value == "oauth2"){
    console.log("enter oauth section, token = ", tok);
    console.log("method = ", method);
    console.log("data = ",JSON.parse(listData));

    $.ajax({
      url: link,
      data: JSON.parse(listData),
      method: method,
      headers: {
        "Authorization" : "Bearer " +tok, //this will depend on the API
        "Content-Type"  : "application/json"
      },
      success: function (response) {
        console.log("oauth response: ",response)
        status = "success";
        jsResponse = JSON.stringify(response, null, 2);

        showResponseSchema(listData);
        $("#toggRes").show();
        errorMessageJson = "Success! Click on result fields below";
        //You successfully accessed the API!";
        //$("#pDiv").show(); //unhighlight
        $("#correct").show();
        $("#notcorrect").hide();
        document.getElementById("pValidatetext").innerHTML=errorMessageJson;
        document.getElementById('pValidatetext').style.color="green";
        document.getElementById('pDiv').style.borderColor="green";
        document.getElementById('pDiv').style.backgroundColor="#f2f9ee";

        responseMessage(response, status);
      },
      error: function(response, jqXHR, textStatus, errorThrown) {
        console.log(JSON.stringify("oauth error: ", response));
        status = "error";

        if(response.hasOwnProperty('responseText')){
          jsResponse = response.responseText;
        }else{
          jsResponse = response;
        }

        showResponseSchema(listData);
        $("#toggRes").hide();

        var authSubstrings = ['api key','API key', 'key', 'oauth', 'authentication','auth', 'validation'];
        var reqSubstrings = ['parameter', 'parameters', 'required parameter'];
        var lengthA = authSubstrings.length;
        var lengthR = reqSubstrings.length;

        while(lengthA--) {
           if (JSON.stringify(response).indexOf(authSubstrings[lengthA])!=-1) {
             isAuth=true;
           }
         }
         while(lengthR--) {
           if (JSON.stringify(response).indexOf(reqSubstrings[lengthR])!=-1) {
             isReq=true;
           }
        }

        if(isAuth){
          errorMessageJson = "Error: Possibly missing authentication";
        }else if(isReq){
          errorMessageJson = "Error: Possibly missing required parameter(s)";
        }else{
          errorMessageJson = "Error: Possibly missing parameter(s) and/or authentication";
        }

        if(response.hasOwnProperty('responseJSON')){
          //get the longest text there and show it as the message
          var responseJSONChildren = flatten(response.responseJSON);

          function flatten(obj) {
          var flattenedObj = {};
          Object.keys(obj).forEach(function(key){
              if (typeof obj[key] === 'object') {
                  $.extend(flattenedObj, flatten(obj[key]));
              } else {
                  flattenedObj[key] = obj[key];
              }
          });
          return flattenedObj;
          }

          var arrayOfValues = [];
          var x=0;
          var urlJson;

          for (let [key, value] of Object.entries(responseJSONChildren)) {
            // console.log(`${key}: ${value}`);
            if(ValidURL(`${value}`)){
              urlJson = `${value}`;
            }else{
              arrayOfValues[x]=`${value}`;
              ++x;
            }
          }

          var elm;

          function ValidURL(u){
            if(!elm){
              elm = document.createElement('input');
              elm.setAttribute('type', 'url');
            }
            elm.value = u;
            return elm.validity.valid;
          }


          var longest = arrayOfValues.reduce(function (a, b) { return a.length > b.length ? a : b; });

          if(ContainsValidURL(longest)){
            errorMessageJson ="Error: "+ longest;
          }else{
            errorMessageJson ="Error: "+ longest+' '+urlJson;
          }
          //Does the longest string contains links?
          function ContainsValidURL(str) {
            var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
            if(!regex.test(str)) {
              return false;
            } else {
              return true;
            }
          }

        }else{//custom message (most likely response.responseText)
          // Show a custom message
          // console.log("custom")
        }

        //$("#pDiv").show(); //unhighlight
        $("#notcorrect").show();
        $("#correct").hide();
        document.getElementById("pValidatetext").innerHTML=createTextLinks_(errorMessageJson);
        document.getElementById('pValidatetext').style.color="red";
        document.getElementById('pDiv').style.borderColor="red";
        document.getElementById('pDiv').style.backgroundColor="#fceff1";

        function createTextLinks_(text) {
          return (text || "").replace(
            /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
            function(match, space, url){
              var hyperlink = url;
              if (!hyperlink.match('^https?:\/\/')) {
                hyperlink = 'http://' + hyperlink;
              }
              return space + '<a target="_blank" href="' + hyperlink + '">' + url + '</a>';
            }
          );

        };
        // console.log(JSON.stringify(response));
        responseMessage(response, status);
      }

    });


  }else{//does not have header nor oauth
    // console.log("HERE")
      //(3) get the JSON schema
    // $.ajax({
    //   url: "/test/"+encodeURIComponent(link+"?"+listData),
    //   // data: listExist,//JSON.parse(listP),
    //   method: method,
    //   // headers: headers_to_set,
    //   success: function (response) {
    //     console.log("TEST response: ", response);

    // $.ajax({
    // url: "/callAPI/"+encodeURIComponent(link+"?"+listData),
    // method: method,

  $.ajax({
    url: link,
    data: JSON.parse(listData),
    method: method,
    success: function (response) {
      console.log("TEST response: ", response);
      status = "success";
      jsResponse = JSON.stringify(response, null, 2);

      showResponseSchema(listData);
      $("#toggRes").show();
      errorMessageJson = "Success! Click on result fields below";
      //You successfully accessed the API!";
      //$("#pDiv").show(); //unhighlight
      $("#correct").show();
      $("#notcorrect").hide();
      document.getElementById("pValidatetext").innerHTML=errorMessageJson;
      document.getElementById('pValidatetext').style.color="green";
      document.getElementById('pDiv').style.borderColor="green";
      document.getElementById('pDiv').style.backgroundColor="#f2f9ee";

      responseMessage(response, status);
    },
    error: function(response, jqXHR, textStatus, errorThrown) {
      // console.log(JSON.stringify(response));
      status = "error";

      if(response.hasOwnProperty('responseText')){
        jsResponse = response.responseText;
      }else{
        jsResponse = response;
      }

      showResponseSchema(listData);
      $("#toggRes").hide();

      var authSubstrings = ['api key','API key', 'key', 'oauth', 'authentication','auth', 'validation'];
      var reqSubstrings = ['parameter', 'parameters', 'required parameter'];
      var lengthA = authSubstrings.length;
      var lengthR = reqSubstrings.length;

      while(lengthA--) {
         if (JSON.stringify(response).indexOf(authSubstrings[lengthA])!=-1) {
           isAuth=true;
         }
       }
       while(lengthR--) {
         if (JSON.stringify(response).indexOf(reqSubstrings[lengthR])!=-1) {
           isReq=true;
         }
      }

      if(isAuth){
        errorMessageJson = "Error: Possibly missing authentication";
      }else if(isReq){
        errorMessageJson = "Error: Possibly missing required parameter(s)";
      }else{
        errorMessageJson = "Error: Possibly missing parameter(s) and/or authentication";
      }

      if(response.hasOwnProperty('responseJSON')){
        //get the longest text there and show it as the message
        var responseJSONChildren = flatten(response.responseJSON);

        function flatten(obj) {
        var flattenedObj = {};
        Object.keys(obj).forEach(function(key){
            if (typeof obj[key] === 'object') {
                $.extend(flattenedObj, flatten(obj[key]));
            } else {
                flattenedObj[key] = obj[key];
            }
        });
        return flattenedObj;
        }

        var arrayOfValues = [];
        var x=0;
        var urlJson;

        for (let [key, value] of Object.entries(responseJSONChildren)) {
          // console.log(`${key}: ${value}`);
          if(ValidURL(`${value}`)){
            urlJson = `${value}`;
          }else{
            arrayOfValues[x]=`${value}`;
            ++x;
          }
        }

        var elm;

        function ValidURL(u){
          if(!elm){
            elm = document.createElement('input');
            elm.setAttribute('type', 'url');
          }
          elm.value = u;
          return elm.validity.valid;
        }


        var longest = arrayOfValues.reduce(function (a, b) { return a.length > b.length ? a : b; });

        if(ContainsValidURL(longest)){
          errorMessageJson ="Error: "+ longest;
        }else{
          errorMessageJson ="Error: "+ longest+' '+urlJson;
        }
        //Does the longest string contains links?
        function ContainsValidURL(str) {
          var regex = /(http|https):\/\/(\w+:{0,1}\w*)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;
          if(!regex.test(str)) {
            return false;
          } else {
            return true;
          }
        }

      }else{//custom message (most likely response.responseText)
        // Show a custom message
        // console.log("custom")
      }

      //$("#pDiv").show(); //unhighlight
      $("#notcorrect").show();
      $("#correct").hide();
      document.getElementById("pValidatetext").innerHTML=createTextLinks_(errorMessageJson);
      document.getElementById('pValidatetext').style.color="red";
      document.getElementById('pDiv').style.borderColor="red";
      document.getElementById('pDiv').style.backgroundColor="#fceff1";

      function createTextLinks_(text) {
        return (text || "").replace(
          /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi,
          function(match, space, url){
            var hyperlink = url;
            if (!hyperlink.match('^https?:\/\/')) {
              hyperlink = 'http://' + hyperlink;
            }
            return space + '<a target="_blank" href="' + hyperlink + '">' + url + '</a>';
          }
        );

      };
      // console.log(JSON.stringify(response));
      responseMessage(response, status);
    }
  });

  }

}else{

 }

}



var auth_url,token_url, redirect_url, client_id, client_secret, response_type, scope, grant_type, client_auth, tok;

var redirect_url_ = ['http://127.0.0.1:8080/api-integration.html', 'http://127.0.0.1:8080/data-management.html?api=Unsplash_My_Collections', 'https://scrapir.org/data-management.html?api=Unsplash_My_Collections']

function authorizeSNAPI() {

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
          if (win.document.URL.indexOf(redirect_url) != -1) {
            window.clearInterval(pollTimer);
            var url= win.document.URL;
            acToken= gup(url, response_type);
            // tokenType = gup(url, 'token_type');
            // expiresIn = gup(url, 'expires_in');
            win.close();

            validateTokenSNAPI(acToken);
          }
        } catch(e) {
          console.log("oauth is not working correctly!");
        }
      }, 200);
}

function validateTokenSNAPI(token) {
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
      getIT();
      //removed
    },
    error: function(response, jqXHR, textStatus, errorThrown) {
      console.log("error: ",response);
    }
  });

//setTimeout(function(){
   urlBlur();
//}, 4000);

}



function getIT(){
  console.log("getIT called")
  $.ajax({
    url: obJSON1.url,
    data: listExist,//JSON.parse(listData),//JSON.stringify(eventC),//
    method: method,
    headers: {
      "Authorization" : "Bearer " +tok, //this will depend on the API
      "Content-Type"  : "application/json"
    },
    success: function (response) {
      console.log("oauth response: ",response);
      if(obJSON1.indexPage || obJSON1.currPageParam || obJSON1.offsetPage){
        for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
           objData={};

           objData["id"]= start;

           if($("input[name='checkbox-w']").is(":checked")){
               $("input[name='checkbox-w']:checked").each(function(){
                var s = "response."+this.id.split('.')[0];
                 //console.log("s: ",s);
                if(eval(s)){
                 var id = this.value;
                 if(this.value=="Video URL"){
                   objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
                 }else{
                   var str = (this.checked ? "response."+this.id : 0);
                   //IF ARRAY
                   if(str.includes("[i]")){
                     //console.log("Includes [i]: ",str);
                     var i=0;
                     var splt =  str.split("[i]");
                     // start if undefined
                     if(eval(splt[0]).length==0){
                      objData[id]="";
                    }else{// start if NOT undefined
                    objData[id] = (this.checked ? eval("response."+this.id) : 0);
                    for(i=1; i<eval(splt[0]).length; ++i){
                      objData[id] += ", ";
                      objData[id] += eval("response."+this.id);
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
               }//if not undefined
             else{
               defined=false;
             }
           });//checkbox
         }//chckbox loop

             if(defined){
               data.push(objData);
               obj.lists=[];
               obj.lists.push(objData);
            }

            //++j;
            //++start;

        }//while loop
      }else{
      var j=0;
      while(defined){
    //for (var j=0; start<totalRes && j<numResults && defined ; ++j, ++start){// && start<2000LIMIT THE RESULT TO 100 LINES
    objData={};
    ++start;
    objData["id"]= start;
    // console.log("J: ",j);

    if($("input[name='checkbox-w']").is(":checked")){
        $("input[name='checkbox-w']:checked").each(function(){
          var s = "response."+this.id.split('.')[0];
          var arrLength = "response."+this.id.split('[j]')[0];
          var ln = s.split('[')[0];

          console.log("response here: ",response);

          if(j<eval(arrLength).length && Array.isArray(eval(arrLength))){// || typeof eval(s) === 'undefined' || j==eval(ln).length){
          var id = this.value;
          if(this.value=="Video URL"){
            objData[id] = "https://www.youtube.com/watch?v="+(this.checked ? eval("response."+this.id) : 0);
          }else{
            var str = (this.checked ? "response."+this.id : 0);
            //IF ARRAY
            if(str.includes("[i]")){
              //console.log("Includes [i]: ",str);
              var i=0;
              var splt =  str.split("[i]");
              // start if undefined
              if(eval(splt[0]).length==0){
               objData[id]="";
             }else{// start if NOT undefined
             objData[id] = (this.checked ? eval("response."+this.id) : 0);
             for(i=1; i<eval(splt[0]).length; ++i){
               objData[id] += ", ";
               objData[id] += eval("response."+this.id);
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
        }//if not undefined
      else{
        defined=false;
      }
    });//checkbox
  }//chckbox loop

      if(defined){
        data.push(objData);
        obj.lists=[];
        obj.lists.push(objData);
     }

     ++j;
     //++start;

    }//while loop
  }//else

      if(p<pages){
        //console.log("Data: ", data);
        if(obJSON1.currPageParam){ //nex\prev page
            ++p;
            getTheNextPage(p, pages, eval("response."+obJSON1.nextPageParam));
        }else if(obJSON1.offsetPage){//offset page
          ++p;
          getTheNextPage(p, pages, eval("response."+obJSON1.offsetPage));
        }else{//index page
          ++p;
          getTheNextPage(p, pages, eval("response."+obJSON1.indexPage));
        }
      }else{
        if(data.length>0){
          console.log("data: ", data);
          populateListAndTree(arrData2);
          populateTable(data);
        }else{
          populateListAndTree(response);
          console.log("create something else other than table!")
        }
      }

    }//response
//  );//new AJAX
 });//AJAX
}

var auth_url,token_url, redirect_url, client_id, client_secret, response_type, scope, grant_type, client_auth, tok;

function authorize() {

  console.log("auth function");

      auth_url= $("#authURL").val();
      token_url= $("#tokenURL").val();
      redirect_url= $("#callbackURL").val(); //JSON.parse(JSON.stringify($("#callbackURL").val()));
      client_id= $("#clientId").val(); //JSON.parse(JSON.stringify($("#clientId").val()));
      client_secret= $("#clientSec").val(); //JSON.parse(JSON.stringify($("#clientSec").val()));
      response_type= $("#resType").val(); //JSON.parse(JSON.stringify($("#resType").val()));
      scope= $("#scope").val(); //JSON.parse(JSON.stringify($("#scope").val()));
      grant_type= $("#grantType").val(); //JSON.parse(JSON.stringify($("#grantType").val()));
      client_auth= $("#clientAuth").val(); //JSON.parse(JSON.stringify($("#clientAuth").val()));//(bearer header OR client credentials in body)


            var win = window.open(auth_url+"?response_type="+JSON.parse(JSON.stringify(response_type))+"&scope="+JSON.parse(JSON.stringify(scope))+"&client_id="+JSON.parse(JSON.stringify(client_id))+"&redirect_uri="+JSON.parse(JSON.stringify(redirect_url))+"", "windowname1", 'width=800, height=600');

            var pollTimer = window.setInterval(function() {
                try {
                    console.log(win.document.URL); //here url
                    if (win.document.URL.indexOf(redirect_url) != -1) {
                        window.clearInterval(pollTimer);
                        var url =   win.document.URL;
                        acToken =   gup(url, 'code');
                        // tokenType = gup(url, 'token_type');
                        // expiresIn = gup(url, 'expires_in');
                        win.close();

                        validateToken(acToken);
                    }
                } catch(e) {
                  console.log("error in oauth")
                }
            }, 200);
}






function validateToken(token) {
          console.log("Token: ",token)
          console.log("Token URL: ",token_url)

          $.ajax({
        		url: token_url,
        		method: "POST",
            data: {client_id: client_id ,client_secret: client_secret ,redirect_uri: redirect_url ,code: token ,grant_type:grant_type},
              // client_id: $("#clientId").val() ,client_secret: $("#clientSec").val() ,redirect_uri: $("#callbackURL").val() ,code: token ,grant_type:$("#grantType").val()} ,
        		success: function(response) {
              console.log("response: ",response);
              //important to check access token and token type (e.g. bearer)
              tok = response.access_token;
              console.log("tok: ", tok)
              urlBlur();
        		},
            error: function(response, jqXHR, textStatus, errorThrown) {
              console.log("error: ",response);
            }
        	});
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



function responseMessage(response, status){
 //JSON Response Using JSONEDITOR
 var container, options, json, editor;

 container = document.getElementById('jsoneditor2');

 options = {
   mode: 'view',
   // modes: ['code', 'form', 'text', 'tree','view'],
   // ace: ace,
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

   onTextSelectionChange: function(start, end, text) {
     var rangeEl = document.getElementById('textRange');
     rangeEl.innerHTML = 'start: ' + JSON.stringify(start) + ', end: ' + JSON.stringify(end);
     var textEl = document.getElementById('selectedText');
     textEl.innerHTML = text;
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
    if(status == "success"){
     if (event.type === 'click') {
       document.getElementById("toggRes").scrollIntoView();
       // console.log("clicked: ", node.path);
         var textEl = document.getElementById('selectedText');
        //  console.log("node.path: ",node.path);
        //  console.log("node: ",node);

         var paramValue = eval("response."+prettyPrintPath(node.path));
         // console.log(eval("response."+prettyPrintPath(node.path));
         var s1 = node.field;
         var s2 = prettyPrintPath(node.path);
         var xx1 = s1.concat("/");
         xx = xx1.concat(s2);

         if(fields_paths){

         }else{
           fields_paths=[];
         }
         var exists = false;

         for(var i=0; i<fields_paths.length; ++i){
           if(fields_paths[i] == xx){
             exists=true;
           }
         }

         if(exists){

         }else{
           fields_paths.push(xx);
           //console.log("fields_paths: ",fields_paths);
           var safevalue= node.field;
           //console.log("Test sting: ", safevalue);

           r1=prettyPrintPath(node.path).replace(/[0-9]/,'');
           r2=r1.replace('[','');
           r3=r2.replace(']','');

           var nameDefaule1 = node.field.split('_');
           for (var i = 0; i < nameDefaule1.length; i++) {
              nameDefaule1[i] = nameDefaule1[i].charAt(0).toUpperCase() + nameDefaule1[i].substring(1);
          }

         var nameDefaule = nameDefaule1.join(' ');
         $("#fields tbody").append('<tr id="'+xx+'"><td>'+node.field+'</td><td><input type="text" class="form-control" id="displayName'+s1+'" placeholder="" value="'+nameDefaule+'" onchange="urlBlurNoCall()" style="font-size:1em"></td> <td><input type="text" class="form-control" id="displayDesc'+s1+'" placeholder="" onchange="urlBlurNoCall()"> </td> <td><input id='+xx+' type="image" src="images/del.png" style="width:18px"onclick="printFunc(this)"> </td> </tr>');
         urlBlurNoCall();
     }//else does not exists

   }//end og if clicked
  }

      function hasNumbers(t){
        var regex = /\d/g;
        return regex.test(t);
      } 

      function prettyPrintPath(path) {
        // console.log("Path: ",path);
                   var str = '';
                   for (var i=0; i<path.length; i++) {
                    //  console.log("Path: ",path[i]);
                     var element = path[i];
                     if (typeof element === 'number') {
                       if(i!=0){
                         str += '[' + element + ']'
                       }
                     } else if(element.includes(' ')) {
                       str += "['"+element+"']";
                      //  console.log(str)
                     }else {
                      //  console.log("str: ",str);
                       
                       if (str.length > 0){
                         if(hasNumbers(element)){
                          str += '['+element+']';
                         }else{
                          str += '.';
                          str += element;
                         }
                       }else{
                        str += element;
                       }
                       

                      //  if (str.length > 0)str += '.';
                      //  str += element;
                     }
                   }
                  //  console.log("str: ",str);
                   return str;
                 }
   }

 };

 $("#jsoneditor2").empty();

 if(status == "success"){
   json = response;
   var bgcolor = "#f2f9ee";
  }else{
    if(response.hasOwnProperty('responseText')){
      // if(IsJsonString(response.responseText)){
      //   json = flatten(JSON.parse(response.responseText));
      // }else{
      //   json = flatten(response.responseText);
      // }

      if(IsJsonString(response.responseText)){
        json = JSON.parse(response.responseText);
      }else{
        json = response.responseText;
      }

        function IsJsonString(str) {
            try {
                JSON.parse(str);
            } catch (e) {
                return false;
            }
            return true;
        }


        function flatten(obj) {
        var flattenedObj = {};
        Object.keys(obj).forEach(function(key){
            if (typeof obj[key] === 'object') {
                $.extend(flattenedObj, flatten(obj[key]));
            } else {
                flattenedObj[key] = obj[key];
            }
        });
        return flattenedObj;
        }

    }else{
      json = response;
    }
   var bgcolor = "#fceff1";
  }

  window.editor = new JSONEditor(container, options, json);
  document.getElementById('jsoneditor2').style.backgroundColor=bgcolor;
  window.editor.expandAll();

}



function urlBlurNoCall(){
  // console.log("urlBlurNoCall called");

  logObj = {};
  logs = [];

  firebase.auth().onAuthStateChanged(function (user) {
    if(user){

      if(logIntDecision == "accept"){
        firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
          uID = snapshot.val().userId;

          logObj.user = snapshot.val().name;
          logObj.timestamp = Date.now();
          logObj.fields = this.myObj;
          logObj.status = status;
          logObj.feedback = jsResponse;

          firebase.database().ref('log/' + uID).push(JSON.parse(JSON.stringify(logObj)));
        });
      }
    }
  });

    var responses = [];
      //(4) responses
      if(fields_paths.length>0){
      for(var j=0; j<fields_paths.length; ++j){
              var f = fields_paths[j].split("/"); //here change
              var name = f[0];//this.value;
              var value =  f[1].replace(/[0-9]/, "j"); // /([0]/, replacer
              // var value = value1.replace("[0]", "[i]");
              var paramPath = value.replace(/[0-9]/, "i");
              var uiName= $("#displayName"+name).val();
              var uiDesc= $("#displayDesc"+name).val();

              responses.push({
                displayedName: name,
                parameter: paramPath,
                name: uiName,
                description: uiDesc
              });

      }
    }
    // myObj.responses = responses;

}



var reqParamsVales=[];


//response functions
function addRowResponse() {
  $("#responseTabel tbody").append('<tr><td><input class="form-control" type="text" id="name" placeholder=""></td><td><select class="form-control" id="type" style="height:30px"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><div><input id="displayedName" class="form-control" type="text"></div></td><td><input class="form-control" type="text" id="path" placeholder=""></td><td><textarea class="form-control" type="text" id="desc" placeholder="" rows="1"></textarea></td><td><div><input id="default" value="" class="checkbox-style" name="" type="checkbox"  autocomplete=“off” checked></div></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRowResponse(this)"</td></tr>');
}

function deleteRowResponse(row) {
  var i = row.parentNode.parentNode.rowIndex;
  document.getElementById('responseTabel').deleteRow(i);
}


//retrieve JSON schema for the chosen "clicked on" API

var fields_paths=[];
var fields_paths_curr=[];
var firstTime = true;


function showResponseSchema(listData){
  //$("#fields").empty();
  //$("#jsonSample").empty();

  var final_tree = [];
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
  myObj.maxResPerPage=$("#result_max").val();

  //indexed pagination
  myObj.indexPage=$("#index_param").val();

  //offset pagination
  myObj.offsetPage=$("#offset_param").val();

  //sequential pagination
  myObj.currPageParam=$("#cur_page_param").val();
  myObj.nextPageParam=$("#next_page_param").val();
  //We should add parameters names to the request parameters

  var headers = [];

  $('#headerTabel tbody tr').each(function(i, n){
    var $row = $(n);
      headers.push({
          headerKey:          $row.find('#nameH:eq(0)').val(),
          headerValue:         $row.find('#valueH:eq(0)').val()
        });
      });

  myObj.headers = headers;

  var oauth2 = [];


if(document.getElementById('selectid').value == "oauth2"){
  oauth2.push({
    authURL:   $("#authURL").val(),
    tokenURL: $("#tokenURL").val(),
    callbackURL: $("#callbackURL").val(),
    clientId: $("#clientId").val(),
    clientSec: $("#clientSec").val(),
    resType: $("#resType").val(),
    scope: $("#scope").val(),
    grantType: $("#grantType").val(),
    clientAuth: $("#clientAuth").val()
  });
}



  //Authentication description
  myObj.authDesc = $("#authDesc").val();
  myObj.authURL  = $("#authURL").val();

  //API key as a parameter
  myObj.apiKeyName = $("#nameKey").val();
  myObj.apiKeyValue = $("#valueKey").val();

  // console.log("isPublic: ",document.getElementById('isPublic').value)
  if(document.getElementById('isPublic').value == "Yes") {
    myObj.authIsPublic = true
  }else{
    myObj.authIsPublic = false
  }

  var parameters = [];

        $('#requestTabel tbody tr').each(function(i, n){
          var $row = $(n);
          if($row.find('#displayed:eq(0)').is(":checked")){
            if($row.find('#displayedName:eq(0)').val()==""){
              var displayedN = $row.find('#name:eq(0)').val();
            }else{
              var displayedN = $row.find('#displayedName:eq(0)').val();
            }
          }
            parameters.push({
                name:          $row.find('#name:eq(0)').val(),
                value:         $row.find('#value:eq(0)').val(),
                listOfValues:  $row.find('#listOfValues:eq(0)').val(),
                displayedName: displayedN,
                description:   $row.find('#desc:eq(0)').val(),
                type:          $row.find('#type:eq(0)').val(),
                displayed:     $row.find('#displayed:eq(0)').is(":checked"),
                required:      $row.find('#required:eq(0)').is(":checked")
            });
        });
   //(2) request parameters
        myObj.parameters = parameters;
        var paths = [];
        var pathsID = [];
        var pathsNames = [];
        var output;

        //console.log("valueH:", $("#valueH").val());
        if($("#valueH").val()!="" && document.getElementById('selectid').value != "oauth2"){ //CHANGE BEARER
          var headername= $("#nameH").val();
          var headervar= $("#valueH").val();
          var headers_to_set = {};
          headers_to_set[headername] = headervar;

          var settings3 = {
            "url": "https://cors-anywhere.herokuapp.com/"+myObj.url,//https://api.yelp.com/v3/businesses/search?term=burgers&location=boston",
            "data": JSON.parse(listData),
            "method": method,
            "headers": headers_to_set
          }
      }else if(document.getElementById('selectid').value == "oauth2"){
        var settings3 = {
          "url": myObj.url,
          "data": JSON.parse(listData),
          "method": method,
          headers: {
            "Authorization" : "Bearer " +tok 
          }
         }
        }else{
        var settings3 = {
          "url": myObj.url,
          "data": JSON.parse(listData),
          "method": method
        }
      }


    $.ajax(settings3).done(function (response) {
            var objJSONOBJ = flattenObjectJSON(response);
            var objJSONOBJ2 = Object.getOwnPropertyNames(objJSONOBJ);

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
                textEl.innerHTML = text;
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
                  console.log("clicked: ", node.path);
                    var textEl = document.getElementById('selectedText');

                    var paramValue = eval("response."+prettyPrintPath(node.path));
                    // console.log(eval("response."+prettyPrintPath(node.path));


                    var s1 = node.field;
                    var s2 = prettyPrintPath(node.path);
                    var xx1 = s1.concat("/");
                    xx = xx1.concat(s2);

                    if(fields_paths){

                    }else{
                      fields_paths=[];
                    }
                    var exists = false;

                    for(var i=0; i<fields_paths.length; ++i){
                      if(fields_paths[i] == xx){
                        exists=true;
                      }
                    }

                    if(exists){

                    }else{
                    fields_paths.push(xx);
                    //console.log("fields_paths: ",fields_paths);

                    var safevalue= node.field;
                    //console.log("Test sting: ", safevalue);

                    r1=prettyPrintPath(node.path).replace(/[0-9]/,'');
                    r2=r1.replace('[','');
                    r3=r2.replace(']','');

                    var nameDefaule1 = node.field.split('_');
                    for (var i = 0; i < nameDefaule1.length; i++) {
                       nameDefaule1[i] = nameDefaule1[i].charAt(0).toUpperCase() + nameDefaule1[i].substring(1);    ;
                     }

                    var nameDefaule = nameDefaule1.join(' ');
                    $("#fields tbody").append('<tr id="'+xx+'"><td>'+node.field+'</td>    <td><input type="text" class="form-control" id="displayName'+s1+'" placeholder="" value="'+nameDefaule+'" onchange="urlBlurNoCall()" style="font-size:1em"></td> <td><input type="text" class="form-control" id="displayDesc'+s1+'" placeholder="" onchange="urlBlurNoCall()"> </td> <td><input id='+xx+' type="image" src="images/del.png" style="width:18px"onclick="printFunc(this)"> </td> </tr>');
                    urlBlurNoCall();
                }//else does not exists

              }

                // if (event.type === 'delete') {
                //   //console.log("removed!");
                // }

                function prettyPrintPath(path) {
                              var str = '';
                              for (var i=0; i<path.length; i++) {
                                var element = path[i];
                                if (typeof element === 'number') {
                                  str += '[' + element + ']'
                                } else if(element.includes(' ')) {
                                  str += "['"+element+"']";
                                  console.log(str)
                                }else {
                                  if (str.length > 0) str += '.';
                                  str += element;
                                }
                              }
                              return str;
                            }
              }

            };

            json = response;

            // if(!window.editor){
            $("#jsoneditor").empty();
            window.editor = new JSONEditor(container, options, json);
            window.editor.expandAll();
            // }            //   draw = false;

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
                //  $("#fields tbody").append('<tr id="'+node.children[c].id+'"><td><a id="'+node.children[c].id+'" class="button button-mini button-circle button-reveal button-xsmall button-yellow tright" style="height:25px" onclick="removeCheckedResponseField(this,'+node.children[c].id+')"><i class="glyphicon glyphicon-remove"></i><span>' +splitVal[0]+'</span></a></td></tr>');
                  $("#fields").append('<tr id="'+xx+'"><td>'+node.field+'</td>  <td><input type="text" class="form-control" id="displayName'+s1+'" placeholder="" value="'+nameDefaule+'" style="font-size:1em" onchange="urlBlurNoCall()"></td> <td><input type="text" class="form-control" id="displayDesc'+s1+'" placeholder="" onchange="urlBlurNoCall()"> </td> <td><input id='+xx+' type="image" src="images/del.png" style="width:18px"onclick="printFunc(this)"> </td> </tr>');
                  // urlBlurNoCall();
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
    //     },
    //
    // error: function(response, jqXHR, textStatus, errorThrown) {
    //     // When AJAX call has failed
    //
    // }
      });

      var responses = [];
          //(4) responses
          if(fields_paths.length>0){
            // console.log("response fields!!!");
            for(var j=0; j<fields_paths.length; ++j){
                  var f = fields_paths[j].split("/"); //here change
                  var name = f[0];//this.value;
                  var value =  f[1].replace(/[0-9]/, "j"); // /([0]/, replacer
                  // var value = value1.replace("[0]", "[i]");
                  var paramPath = value.replace(/[0-9]/, "i");
                  var uiName= $("#displayName"+name).val();
                  var uiDesc= $("#displayDesc"+name).val();

                  responses.push({
                    displayedName: name,
                    parameter: paramPath,
                    name: uiName,
                    description: uiDesc
                  });

                }
              }


        // console.log("responses: ", myObj);
        myObj.responses = responses;

      //console.log("DATA2: ",data2);
      final_tree2 = final_tree;
}

function printFunc(row){

  //console.log("XX: ",row.id);
  var fields_paths_c=[];

  for(var i=0; i<fields_paths.length; ++i){
    //console.log(fields_paths[i]);
    if(fields_paths[i] == row.id){
      //
    }else{
      fields_paths_c.push(fields_paths[i]);
    }
  }
  console.log("F: ",fields_paths_c);
  fields_paths = fields_paths_c;

  var i = row.parentNode.parentNode.rowIndex;
  document.getElementById('fields').deleteRow(i);

}

function pageSelected(){

if(document.getElementById('selectPage').value == "index") {
  // function showIndex(){
    $("#indexDiv").show();
    $("#nextDiv").hide();
    $("#offsetDiv").hide();

    $("#space").hide();
  }

  // function showOffset(){
  if(document.getElementById('selectPage').value == "offset") {
    $("#indexDiv").hide();
    $("#nextDiv").hide();
    $("#offsetDiv").show();

    $("#space").hide();
  }

  if(document.getElementById('selectPage').value == "nextPrev") {
    $("#indexDiv").hide();
    $("#nextDiv").show();
    $("#offsetDiv").hide();

    $("#space").show();
  }


}



function authSelected(){

  if(document.getElementById('selectid').value != "noAuth"){
    $("#ifAuthDiv").show();
  }else{
    $("#ifAuthDiv").hide();
  }

  if(document.getElementById('selectid').value == "bearerToken") {
      addHeaderRowAuth();
      document.getElementById("nameH").value = "Authorization";
      document.getElementById("nameH").style = "color:red";
      document.getElementById("valueH").value = "Bearer YOUR_TOKEN";
      document.getElementById("valueH").style = "color:red";
      $("#messageB").show();
      // $("#messageQ").hide();
      $("#messageH").hide();
      $("#apiKeyFieldTable").hide();
      $("#oauthTable").hide();

  }else if(document.getElementById('selectid').value == "queryAuth"){
    $("#headerTabel tbody").empty();
    $("#headerTabel").hide();
    // $("#messageQ").show();
    $("#messageH").hide();
    $("#messageB").hide();
    $("#apiKeyFieldTable").show();
    $("#oauthTable").hide();
    document.getElementById("nameH").value = "";
    document.getElementById("valueH").value = "";

  }else if(document.getElementById('selectid').value == "headerAuth"){
    addHeaderRowAuth();
    // $("#messageQ").hide();
    // $("#messageH").show();
    // $("#messageB").hide();
    document.getElementById("nameH").value = "";
    document.getElementById("valueH").value = "";
    $("#apiKeyFieldTable").hide();
    $("#oauthTable").hide();

  }else if(document.getElementById('selectid').value == "noAuth"){
    $("#apiKeyFieldTable").hide();
    $("#oauthTable").hide();
    $("#headerTabel tbody").empty();
    $("#headerTabel").hide();
    // $("#messageQ").hide();
    // $("#messageH").hide();
    // $("#messageB").hide();
    document.getElementById("nameH").value = "";
    document.getElementById("valueH").value = "";

  }else if(document.getElementById('selectid').value == "oauth2"){
    $("#apiKeyFieldTable").hide();
    $("#oauthTable").show();
  }else{
    addHeaderRowAuth();
    document.getElementById("nameH").value = "";
    document.getElementById("valueH").value = "";
    // $("#messageQ").hide();
    // $("#messageH").hide();
    // $("#messageB").hide();
    $("#apiKeyFieldTable").hide();
    $("#oauthTable").hide();
  }

  urlBlurNoCall();
}


// Send the user to the authorize endpoint for login and authorization
// function authorize() {
// 	window.open("https://unsplash.com/oauth/authorize?response_type='"+response_type+"'&scope='"+scope+"'&client_id='"+client_id+"'&redirect_uri="+redirect_url);
// }



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
  //prettierURL();
  registration();
}

function getAPIName(apiName){
  window.localStorage.setItem('link', $('#url').val());
}

function callFirebase(){
  fields_paths=[];
  // registration();
  firebase.initializeApp(config);

  $('#butDDInt').click();
  // initApp();
  // isSignedUp(); //removed for demo
  //callFirebaseForRegistration();

  // document.getElementById('url').value = window.localStorage.getItem('link');
  // document.getElementById('title').value = window.localStorage.getItem('apiname');
  // document.getElementById('result_max').value = window.localStorage.getItem('max');
  // document.getElementById('result_param').value = window.localStorage.getItem('result');
  // document.getElementById('index_param').value = window.localStorage.getItem('index');
  // document.getElementById('offset_param').value = window.localStorage.getItem('offset');
  // document.getElementById('cur_page_param').value = window.localStorage.getItem('cur');
  // document.getElementById('next_page_param').value = window.localStorage.getItem('next');

  // document.getElementById('name').value = window.localStorage.getItem('nameR');
  // document.getElementById('value').value = window.localStorage.getItem('valueR');
  // document.getElementById('listOfValues').value = window.localStorage.getItem('listR');
  // document.getElementById('desc').value = window.localStorage.getItem('descR');

  // document.getElementById('nameH').value = window.localStorage.getItem('nH');
  // document.getElementById('valueH').value = window.localStorage.getItem('vH');


  //if user clicked on edit an exisiting API
  var link = window.location.href;

  if(link.includes('?')){
    var savedApi1 = link.split('?')[1];
    var savedApi = savedApi1.split('_').join(' ');

    firebase.auth().onAuthStateChanged(function (user) {
      if(user){
        firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {

          firebase.database().ref('users/'+ user.uid+'/savedAPIs/').once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) { //for each saved query
              if(childSnapshot.val().title == savedApi){
                document.getElementById('url').value = childSnapshot.val().url;
                document.getElementById('title').value = childSnapshot.val().title;

                document.getElementById('result_max').value      = childSnapshot.val().maxResPerPage;
                document.getElementById('result_param').value    = childSnapshot.val().resPerPageParam;
                document.getElementById('index_param').value     = childSnapshot.val().indexPage;
                document.getElementById('offset_param').value    = childSnapshot.val().offsetPage;
                document.getElementById('cur_page_param').value  = childSnapshot.val().currPageParam;
                document.getElementById('next_page_param').value = childSnapshot.val().nextPageParam;

                //headers
                for(var i=0; i<childSnapshot.val().headers.length; ++i){
                  $("#headerTabel tbody").append('<tr><td><input class="form-control" type="text" id="nameH" placeholder="" onchange="urlBlur()" value="'+childSnapshot.val().headers[i].headerKey+'"></td><td><input class="form-control" type="text" id="valueH" placeholder="" onchange="urlBlur()" value="'+childSnapshot.val().headers[i].headerValue+'"></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteHeaderRow(this)"</td></tr>');
                }

                //parameters
                $("#requestTabel tbody").empty();

                for(var i=0; i<childSnapshot.val().parameters.length; ++i){
                  if(childSnapshot.val().parameters[i].displayed){
                    $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name"  style="width:85px" onchange="urlBlur()" placeholder="" value="'+childSnapshot.val().parameters[i].name+'"></td><td><input class="form-control" type="text" id="value" style="width:85px"  onchange="urlBlur()" placeholder="" value="'+childSnapshot.val().parameters[i].value+'"></td><td><textarea class="form-control" type="text" id="listOfValues" rows="1" onchange="urlBlurNoCall()">'+childSnapshot.val().parameters[i].listOfValues+'</textarea></td><td><div><input id="displayedName" class="form-control" type="text" value="'+childSnapshot.val().parameters[i].displayedName+'" onchange="urlBlurNoCall()"></div></td><td><textarea class="form-control" type="text" id="desc" value="'+childSnapshot.val().parameters[i].description+'" rows="1" onchange="urlBlurNoCall()"></textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()" value="'+childSnapshot.val().parameters[i].type+'"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input id="displayed" value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');
                  }else{
                    $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name"  style="width:85px" onchange="urlBlur()" placeholder="" value="'+childSnapshot.val().parameters[i].name+'"></td><td><input class="form-control" type="text" id="value"  style="width:85px" onchange="urlBlur()" placeholder="" value="'+childSnapshot.val().parameters[i].value+'"></td><td><textarea class="form-control" type="text" id="listOfValues" rows="1" onchange="urlBlurNoCall()">'+childSnapshot.val().parameters[i].listOfValues+'</textarea></td><td><div><input id="displayedName" class="form-control" type="text" onchange="urlBlurNoCall()" value="'+childSnapshot.val().parameters[i].displayedName+'"></div></td><td><textarea class="form-control" type="text" id="desc" value="'+childSnapshot.val().parameters[i].description+'" rows="1" onchange="urlBlurNoCall()"></textarea></td><td><select class="form-control" id="type" onchange="urlBlurNoCall()" style="height:30px" value="'+childSnapshot.val().parameters[i].type+'"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input id="displayed" value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off"/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');
                  }
                }

                //responses
                console.log("length: ", childSnapshot.val().responses.length);
                for(var i=0; i<childSnapshot.val().responses.length; ++i){
                  var f = childSnapshot.val().responses[i].displayedName; //s1
                  console.log("response name: ",f);
                  var pathReplaceJ = childSnapshot.val().responses[i].parameter.replace("[j]", "[0]");
                  var pathf = f+"/"+pathReplaceJ;  //xx
                  fields_paths.push(pathf);

                  $("#fields tbody").append('<tr id="'+pathf+'"><td>'+childSnapshot.val().responses[i].displayedName+'</td>  <td><input type="text" class="form-control" id="displayName'+f+'" placeholder="" value="'+childSnapshot.val().responses[i].name+'" onchange="urlBlurNoCall()" style="font-size:1em"></td> <td><input type="text" class="form-control" id="displayDesc'+f+'" placeholder="" value="'+childSnapshot.val().responses[i].description+'" onchange="urlBlurNoCall()"></td> <td><input id='+pathf+' type="image" src="images/del.png" style="width:18px"onclick="printFunc(this)"> </td> </tr>');
                  // urlBlurNoCall();
                }

              }
            });
          });

          //APIs Table
          firebase.database().ref('users/'+ user.uid+'/savedAPIs/').once('value').then(function(snapshot) {
            snapshot.forEach(function(childSnapshot) { //for each saved query
              if(childSnapshot.val() != undefined){
                $("#apisTable").show();
                $("#api_table_content").show();
                //console.log(childSnapshot.val().title);
                var name1 = childSnapshot.val().title;
                var name = name1.split(' ').join('_');
                // var api_name = childSnapshot.val().apiName;
                // var file_desc = childSnapshot.val().description;
                // //var type = childSnapshot.val().type;
                // var url = childSnapshot.val().urlCSV;
                // var urlJ = childSnapshot.val().urlJSON;
                // var link = childSnapshot.val().queryLink;
                $("#api_table_content tbody").append('<tr><td>'+name1+'</td> <td><a href="api-integration.html?'+name+'" target="_blank"><img src="images/edit.png" width="25px"></a> &nbsp;  <a id="'+name1+'" href="" onclick="deleteRowAccountTableAPIs(this,this)"><img src="images/del.png" width="25px"></a>   </td></tr>');

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

}

function signOutFunction(){
  firebase.auth().signOut();
}

function callFirebaseForRegistration(){
  // prettierURL();
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
        // [END_EXCLUDE]
      });
      // [END authwithemail]

      //window.location.href='index.html';


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
          window.location.href='api-integration.html';
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
    console.log("Handle Signup");
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
          window.location.href='api-integration.html';
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
    console.log("WRITE!");
    firebase.database().ref('users/'+userId).set({
      userId: userId,
      email: email,
      name:name
    });
  }

}

function reviewAPIIntegration(){ //Review? show all information in 3 squares to edit

  urlBlurNoCall();

  // if(!fields_paths){
  // if($("#title").val()){
  //   $("#previewAPIIntegration").empty();
  //   $("#previewAPIIntegration").append("<h5 style='color:red'>You did not add an name to this API, please go to the top of the page and type a name for this API.</h5>")
  // }

  myObj = {};
  //(1) info
  if($("#title").val()){
    myObj.title = $("#title").val();
  }else{
    var urlTitle1 = $("#url").val().split('.').join('/');
    var urlTitle = urlTitle1.split('/').join('');

    myObj.title = urlTitle;
  }

  myObj.method=method; //GET, POST, etc
  myObj.version=$("#version").val();
  myObj.description=$("#description").val();
  myObj.type=$("#type").val();
  myObj.url=$("#url").val();
  myObj.key=$("#key").val();

  //pagination
  //common
  myObj.resPerPageParam=$("#result_param").val();
  myObj.maxResPerPage=$("#result_max").val();

  //indexed pagination
  myObj.indexPage=$("#index_param").val();

  //offset pagination
  myObj.offsetPage=$("#offset_param").val();

  //sequential pagination
  myObj.currPageParam=$("#cur_page_param").val();
  myObj.nextPageParam=$("#next_page_param").val();
  //We should add parameters names to the request parameters

  var headers = [];

  $('#headerTabel tbody tr').each(function(i, n){
    var $row = $(n);
      headers.push({
          headerKey:          $row.find('#nameH:eq(0)').val(),
          headerValue:         $row.find('#valueH:eq(0)').val()
        });
      });

  myObj.headers = headers;



  var oauth2 = [];


if(document.getElementById('selectid').value == "oauth2"){
  oauth2.push({
    authURL:   $("#authURL").val(),
    tokenURL: $("#tokenURL").val(),
    callbackURL: $("#callbackURL").val(),
    clientId: $("#clientId").val(),
    clientSec: $("#clientSec").val(),
    resType: $("#resType").val(),
    scope: $("#scope").val(),
    grantType: $("#grantType").val(),
    clientAuth: $("#clientAuth").val()
  });
}

myObj.oauth2 = oauth2;

  //Authentication description
  myObj.authDesc = $("#authDesc").val();
  myObj.authURL  = $("#authURL").val();

  if(document.getElementById('isPublic').value == "yes") {
    myObj.authIsPublic = true
  }else{
    myObj.authIsPublic = false
  }
  // myObj.authIsPublic = $("#isPublic").is(":checked");

  //API key as a parameter
  myObj.apiKeyName = $("#nameKey").val();
  myObj.apiKeyValue = $("#valueKey").val();

  var parameters = [];

        $('#requestTabel tbody tr').each(function(i, n){
          var $row = $(n);
          if($row.find('#displayed:eq(0)').is(":checked")){
            if($row.find('#displayedName:eq(0)').val()==""){
              var displayedN = $row.find('#name:eq(0)').val();
            }else{
              var displayedN = $row.find('#displayedName:eq(0)').val();
            }
          }
            parameters.push({
                name:          $row.find('#name:eq(0)').val(),
                value:         $row.find('#value:eq(0)').val(),
                listOfValues:  $row.find('#listOfValues:eq(0)').val(),
                displayedName: displayedN,
                description:   $row.find('#desc:eq(0)').val(),
                type:          $row.find('#type:eq(0)').val(),
                displayed:     $row.find('#displayed:eq(0)').is(":checked"),
                required:      $row.find('#required:eq(0)').is(":checked")
            });
        });
   //(2) request parameters
        myObj.parameters = parameters;
        var paths = [];
        var pathsID = [];
        var pathsNames = [];
        var output;


    if(method == "GET"){
      var responses = [];
      //(4) responses
      for(var j=0; j<fields_paths.length; ++j){
              var f = fields_paths[j].split("/"); //here change
              var name = f[0];//this.value;
              var value =  f[1].replace(/[0-9]/, "j"); // /([0]/, replacer
              // var value = value1.replace("[0]", "[i]");
              var paramPath = value.replace(/[0-9]/, "i");
              var uiName= $("#displayName"+name).val();
              var uiDesc= $("#displayDesc"+name).val();

              responses.push({
                displayedName: name,
                parameter: paramPath,
                name: uiName,
                description: uiDesc
              });

            }
          }


    // console.log("responses: ", myObj);
    myObj.responses = responses;

    // if(myObj.title.includes(' ')){
      var api_title = myObj.title.split(' ').join('_');

    // save myObj to FireBase DB
    if($("#url").val()){
      firebase.database().ref('apis/' + myObj.title).set(JSON.parse(JSON.stringify(myObj)));
    }else{
      //do nothing
    }
      first_time=false;

    var tbody = $("#fields tbody");

    if (tbody.children().length == 0 && method == "GET") {
      console.log("choose fields");
      $("#previewAPIIntegration").empty();
      $("#previewAPIIntegration").append("<h5 style='color:red'>Go to 'Response Fields' section and choose fields you are intersted in, then click on 'Review' button</h5>")
    }else{
      $("#previewAPIIntegration").empty();
      $("#previewAPIIntegration").append('<button id="saveAPI" class="button button-3d button-mini button-rounded" onclick="showAPIUI()" style="width:200px; text-align:center;"><span class="glyphicon glyphicon-cloud-upload" aria-hidden="true"></span> Add API to ScrAPIr</button>');
      $("#previewAPIIntegration").append('<button id="cancelAPI" class="button button-3d button-mini button-rounded button-red" onclick="cancelAPI()" style="width:200px; text-align:center;"><span class="glyphicon glyphicon-trash" aria-hidden="true"></span> Cancel</button>');
      $("#previewAPIIntegration").append("<div class='box' style='border: 1px solid gray;'><iframe src='data-management-review.html?api="+api_title+"' width = '100%' height= '500px'></iframe><div>");
  }
}


function saveAPI(){
  firebase.auth().onAuthStateChanged(function (user) {
    if(user){
      firebase.database().ref('apis/' + myObj.title).set(JSON.parse(JSON.stringify(myObj)));
      $("#showUI").show();
    }else{
      console.log("NOT Authorized");
    }
  });

  //document.getElementById("jsonSchema").innerHTML = JSON.stringify(myObj, '', 7);
}

function showAPIUI(){
  addAPIToDB();

  var str = 'data-management.html?api='+ myObj.title.split(' ').join('_');

  //create API desc .json file
  // $.post("http://scrapir.org/specs",{FileContent: JSON.stringify(myObj), FileName: myObj.title.split(' ').join('')}, function(data){
  //   console.log("data: ", data);
  //   console.log("print: ", myObj);
  // });

  $.post("/specs",{FileContent: JSON.stringify(myObj), FileName: myObj.title.split(' ').join('')}, function(data){
      console.log("data: ", data);
      console.log("print: ", myObj);
  });

  //window.open=('data-management.html?api='+ myObj.title.split(' ').join('_'), '_blank');//api title firebase.database().ref('apis/' + $("#title").val())
  window.open(str, '_blank');

  // $('#modalPublish').modal('show');

}

function addAPIToDB(){

  var apibj={};
  apibj.apiName = this.myObj.title;

  firebase.auth().onAuthStateChanged(function (user) {
    if(user){
      // console.log("CURRENT USER: ",user.uid);
      firebase.database().ref('/users/' + user.uid).once('value').then(function(snapshot) {
        var displayName = snapshot.val().name;
        firebase.database().ref('users/'+ user.uid+'/savedAPIs/' + apibj.apiName).set(JSON.parse(JSON.stringify(myObj)));
        firebase.database().ref('apis/'+ apibj.apiName).set(JSON.parse(JSON.stringify(myObj)));
      });
    }
    else{
      //window.alert("No USER")
    }
  });

}


function cancelAPI(){
  console.log("title:", firebase.database().ref('apis/'+ myObj.title));
  firebase.database().ref('apis/'+ myObj.title).remove();
}

function submitRequestSchema(){
  var str = myObj.title;
  var api_title = str.split(' ').join('_');
  window.location.href='data-management.html?api='+api_title;
}



/************************* Create ScrAPIr Functions ************************/

function populateAPIsToFunction(){

  registration();

  firebase.database().ref('/apis/').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) { //for each API
      if(childSnapshot.val().title != undefined){
        var str = childSnapshot.val().title;
        var api_title = str.split(' ').join('_');
        $("#functionAPIsList").append("<option id="+api_title+">"+childSnapshot.val().title+"</option>");
      }
    });
  });

}

function saveScrAPIrOpenAPI(){
  ob = '{"swagger": "2.0", "info": { "description": "ScrAPIr", "version": "", "title": "ScrAPIr", "license": { "name": "", "url": "https://scrapir.org/"}},"host": "scrapir.org/api", "basePath": "/", "schemes": ["https"],"paths": {}}'
  var keyName, keyValue, keyIn;

  registration();

  obj = JSON.parse(ob)

  // firebase.database().ref('openapi/').set(obj)

  firebase.database().ref('/apis/').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) { //for each API
      if((childSnapshot.val().method=='GET' || !childSnapshot.val().method) &&  !childSnapshot.val().title.includes('-')){
      parameters = [], keyName="", keyValue="", keyIn="";

      
      if(childSnapshot.val().parameters){

      for(var i=0 ; i<childSnapshot.val().parameters.length ; ++i){
        if(childSnapshot.val().parameters[i].required){
          required =  childSnapshot.val().parameters[i].required
        }else{
          required = true
        }

        if(childSnapshot.val().parameters[i].displayedName){
        if(childSnapshot.val().parameters[i].listOfValues==""){
          // console.log("parameters: ", childSnapshot.val().parameters[i].name)
          parameters.push({
            name:          childSnapshot.val().parameters[i].displayedName,
            description:   childSnapshot.val().parameters[i].description,
            type:          childSnapshot.val().parameters[i].type,
            required:      required,
            in :           "query"
          });
        }else{
          listValues=[]
          values = childSnapshot.val().parameters[i].listOfValues.split(',')
          for(j=0; j<values.length; j++){
            listValues.push(values[j])
          }
          parameters.push({
            name:          childSnapshot.val().parameters[i].displayedName,
            description:   childSnapshot.val().parameters[i].description,
            type:          childSnapshot.val().parameters[i].type,
            required:      required,
            in :           "query",
            enum:  listValues
          });
        }
       }
      }

      //add "Key" as the auth parameter
      if(childSnapshot.val().auth.keyName!=""){ //if this API requires authentication
        parameters.push({
          name:          'API Key',
          description:   "The value of the API key (whether in query or header)",
          type:          "string",
          required:      false,
          in :           "query"
        });
      }

      //add "Number of Results" as the pagination parameter
      parameters.push({
        name:          'Number of Results',
        description:   "The number of results returned by the API",
        type:          "integer",
        required:      true,
        in :           "query"
      });

    }




      var str = "/"+childSnapshot.val().title
      firebase.database().ref('/openapi/paths/'+str+'/get').set({
        "operationId": childSnapshot.val().title,
             "produces": [
                "application/json"
             ],
             "parameters": parameters,
             "responses": {
              "200": {
                "description": "successful operation"
              }
            }
      });
      }//new if
    });
  })

}

function testAddingAuth(){

  console.log("called")
  registration();

  var authValue=[], keyName, keyValue, keyIn;

  // firebase.database().ref('/apis/').once('value').then(function(snapshot) {
  //   snapshot.forEach(function(childSnapshot) { //for each API
  //     firebase.database().ref('apis/'+childSnapshot.val().title+'/auth').remove()
  //   });
  // });

  firebase.database().ref('/apis/').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) { //for each API
      keyName="", keyValue="", keyIn="";
      if(childSnapshot.val().headers && childSnapshot.val().headers[0].headerKey!=""){
        keyName = childSnapshot.val().headers[0].headerKey
        keyValue = childSnapshot.val().headers[0].headerValue
        keyIn  = "header"
      }else if(childSnapshot.val().parameters){
        for(var i=0; i<childSnapshot.val().parameters.length; ++i){
          if(((childSnapshot.val().parameters[i].displayed==false && childSnapshot.val().parameters[i].displayed) || childSnapshot.val().parameters[i].displayedName=="") && childSnapshot.val().parameters[i].name.includes('key')){
            keyName = childSnapshot.val().parameters[i].name
            keyValue = childSnapshot.val().parameters[i].value
            keyIn  = "query"
          }else{
            ///
          }
        }      
          
      }else{
        //
      }

      authValue.push({
        "name": childSnapshot.val().title,
        "auth":{
          "keyName": keyName,
          "keyValue": keyValue,
          "in": keyIn,
          "isPublic": true
        }
      })

    });
  });


  setTimeout(function(){

  // console.log("authValue: ", authValue)

  firebase.database().ref('/apis/').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) { //for each API
      for(var i=0; i<authValue.length; ++i){
        // console.log("authValue.name: ",authValue[i].name)
        if(authValue[i].name == childSnapshot.val().title){
          // console.log("each: ", authValue[i].auth)
          firebase.database().ref('apis/'+childSnapshot.val().title+'/auth').set(authValue[i].auth);
        }
      }

    });
  });

}, 2000); 

}





function showAPIDescription(){
  var val = document.getElementById("myInput").value;
  console.log('val: ', document.getElementById("myInput").value);

  //show name
  // document.getElementById("apiName").innerHTML=val;

  firebase.database().ref('/apis/').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) { //for each API
      if(childSnapshot.val().title == val){
      // if(childSnapshot.val().title != undefined){
        // document.getElementById("apiURL").innerHTML=childSnapshot.val().url;
        if(childSnapshot.val().parameters){
          // $("#res").show();
          // $("#par").show();
      
          for(var i=0; i<childSnapshot.val().parameters.length; ++i){
            $("#params tbody").append('<tr><td><code>'+childSnapshot.val().parameters[i].name+'</code></td><td>'+childSnapshot.val().parameters[i].description+'</td></tr>');
            $("#funcParMulti").append('<option><code>'+childSnapshot.val().parameters[i].name+'</code></option>');
          }

          for(var i=0; i<childSnapshot.val().responses.length; ++i){
            $("#responses tbody").append('<tr><td><code>'+childSnapshot.val().responses[i].displayedName+'</code></td><td>'+childSnapshot.val().responses[i].description+'</td></tr>');
            $("#funcResMulti").append('<option style="">'+childSnapshot.val().responses[i].displayedName+'</option>');
          }
        }

      }
    });
  });   
}


function createFunction(){
  var apiName = document.getElementById("myInput").value;

  if(document.getElementById("funcName").value.includes(' ')){
    var name = document.getElementById("funcName").value;
    var nameConcatUpperCase = name.replace(/\w+/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1);
    }).replace(/\s/g, '');
    var funcName = nameConcatUpperCase.charAt(0).toLowerCase() + nameConcatUpperCase.slice(1);
  }else{
    var funcName = document.getElementById("funcName").value;
  }

  //var funcName = document.getElementById("funcName").value;
  var resObj, parameters= [], responses= [];

  if(funcName){//if function name was added
    $("#errorMessage").hide();
    $.ajax({
      url: 'https://superapi-52bc2.firebaseio.com/apis/'+apiName+'.json',
      method: "GET",
      success: function (response) {
        //Inherent the API descreption
        resObj= response;
        var parValues = $('#funcParMulti').val();
        var resValues = $('#funcResMulti').val();
        
        //Change the API original parameters to the chosen ones
        if(resObj.parameters){
          for(var j=0; j<resObj.parameters.length; ++j){
            for(var i=0; i<parValues.length; ++i){
              if(parValues[i]==resObj.parameters[j].name){
                if(resObj.parameters[j].required){
                  var req = resObj.parameters[j].required
                }else{
                  var req = false
                }
                parameters.push({
                  name:          resObj.parameters[j].name,
                  value:         resObj.parameters[j].value,
                  listOfValues:  resObj.parameters[j].listOfValues,
                  displayedName: resObj.parameters[j].displayedName,
                  description:   resObj.parameters[j].description,
                  type:          resObj.parameters[j].type,
                  displayed:     resObj.parameters[j].displayed,
                  required:      req
                });
              }
            }
          }
        }
        resObj.parameters = parameters;

        //Change the API original responses to the chosen ones
        if(resObj.responses){
          for(var j=0; j<resObj.responses.length; ++j){
            for(var i=0; i<resValues.length; ++i){
              if(resValues[i]==resObj.responses[j].displayedName){
                responses.push({
                  name:          resObj.responses[j].name,
                  displayedName: resObj.responses[j].displayedName,
                  description:   resObj.responses[j].description,
                  parameter:     resObj.responses[j].parameter
                });
              }
            }
          }
        }
        resObj.responses = responses;

        //save function in fiebase DB
        firebase.database().ref('functions/' + funcName).set(resObj);
      }
    });

  }else{
    $("#errorMessage").show();
  }

}


function viewFunction(){
  $("#codeDiv").show();

  if(document.getElementById("funcName").value.includes(' ')){
    var name = document.getElementById("funcName").value;
    var nameConcatUpperCase = name.replace(/\w+/g, function(txt) {
      // uppercase first letter and add rest unchanged
      return txt.charAt(0).toUpperCase() + txt.substr(1);
    }).replace(/\s/g, '');
    var funcName = nameConcatUpperCase.charAt(0).toLowerCase() + nameConcatUpperCase.slice(1);
  }else{
    var funcName = document.getElementById("funcName").value;
  }

  var parValues = $('#funcParMulti').val();
  var code=funcName+'(';
  for(var i=0; i<parValues.length; ++i){
    code+= parValues[i];
    if(i+1<parValues.length){
      code+=', ';
    }
  }
  code+=')';

  console.log("Code: ", code);
  document.getElementById('codeSnippet').innerText= code;
  // getBooksTitles(q, orderBy)
  var block = document.getElementById('codeSnippet')
  Prism.highlightElement(block);
}


function populateListOfAPIs(){

  // fetch('/graphql', {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json',
  //   },
  //   body: JSON.stringify({query: "{videos {title channel}}"})
  // })
  //   .then(r => r.json())
  //   .then(data => console.log('data returned:', data));

  ////////////////////////

  registration();

  firebase.database().ref('/apis/').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) { //for each API
      if(childSnapshot.val().title != undefined){
        var str = childSnapshot.val().title;
        var api_title = str.split(' ').join('_');
        $("#apis_list").append("<option id="+api_title+">"+childSnapshot.val().title+"</option>");
      }
    });
  });



  // firebase.database().ref('/hotdogs/').set({
  //   "hebrew_national" : {
  //     "isKosher" : true,
  //     "location" : "New York City",
  //     "name" : "Hebrew National",
  //     "style" : "Kosher Beef",
  //     "website" : "https://www.hebrewnational.com"
  //   },
  //   "oscar" : {
  //     "isKosher" : false,
  //     "location" : "Chicago",
  //     "name" : "Oscar Mayer",
  //     "style" : "Ballpark",
  //     "website" : "http://www.oscarmayer.com/"
  //   },
  //   "wa_beans" : {
  //     "isKosher" : false,
  //     "location" : "Bangor",
  //     "name" : "W.A. Bean",
  //     "style" : "Maine Red Snapper",
  //     "website" : "https://www.beansmeats.com"
  //   }
  //   //some more user data
  // });


  firebase.database().ref('/config').set(config);

  //add this back
  // scrAPIr2("https://www.googleapis.com/youtube/v3/search", 200, 'rawJSON'); //format can be rawJSON, formatedJSON, formatedCSV


  // scrAPIr(api, parameters, response, numResults, format)

  // $.ajax({
  //   url: "https://superapi-52bc2.firebaseio.com/apis/YouTube API.json",
  //   method: "GET",
  //   success: function (response) {
  //     console.log("RES: ", response);
  //   }
  // });



  //
  // $.post("/writeFile",{FileContent: JSON.stringify(myObj), FileName: 'testingDUH'}, function(data){
  //     console.log("data: ", data);
  //     console.log("print: ", myObj);
  // });

  // firebase.database().ref('/apis/').once('value').then(function(snapshot) {
  //   snapshot.forEach(function(childSnapshot) { //for each API
  //     if(childSnapshot.val().title != undefined){
  //       var str = childSnapshot.val().title;
  //       var jsonStr = JSON.stringify(childSnapshot.val());
  //       var api_title = str.split(' ').join('X');
  //       if(str == "YouTube API"){
  //           $.post("/writeFile",{FileContent: jsonStr, FileName: api_title}, function(data){
  //             console.log("data: ", data);
  //             console.log("print: ", jsonStr);
  //           });
  //       }
  //     }
  //   });
  // });


}// end populateListOfAPIs


//add this back
// function scrAPIr2(api, nRes){
//   scrAPIr(api, nRes);
// }


var optionalParam = [];

function urlChanged(){
  // console.log("urlChanged");

  if(!hasParameters){
   $('#requestTabel tbody').empty();

  optionalParam = [];
  $("#optionalP").empty();

  //call github
  $("#gitButton").click();
  var urlStr = $("#url").val();
  var u = $("#url").val().split("https://www.")[1];
  var uNoPath = u.substring(0, u.lastIndexOf("/") );

  var urlTemplate = '{swaggerJson}';
  var match = window.location.search.match(/^\?urlTemplate=(.*)$/);
  if (match)
    urlTemplate = decodeURIComponent(match[1]);
  var rootUrl = 'https://api.apis.guru/v2/';
  var xhttp = new XMLHttpRequest();
  xhttp.onload = function() {
    if (xhttp.status != 200)
      return;
    var specList = JSON.parse(xhttp.responseText)
    var links = '';
    for(var apiId in specList){
      var api = specList[apiId];
      for (var version in api.versions) {
        // var swaggerYaml = api.versions[version].swaggerYamlUrl;
        var swaggerJson = api.versions[version].swaggerUrl;
        var specName = swaggerJson.replace(rootUrl + 'specs/', '');
        var href = urlTemplate.replace('{swaggerJson}', swaggerJson);
        // links += '<p><a href="'+ href +'" target="_blank">'+ specName +'</a></p>';
         if(href.includes(uNoPath)){
           $.ajax({
             url: href,
             method: "GET",
             success: function (response) {
               optionalParam = [];
               var firstOptParam = true;
               var obj = response;
               var tmp = $("#url").val().split("/");
               var path = "/"+tmp.pop();
               var params = obj.paths[path].get.parameters;
               //console.log("Parames: ", params);
               for(var i=0; i<params.length; ++i){
                 //list of values
                 var enumSTR = '';
                 var enumSTRfirst = '';

                 if(params[i]['enum']){
                   for(var j=0; j< params[i]['enum'].length; ++j){
                     enumSTR+=params[i]['enum'][j];
                     if(j+1 < params[i]['enum'].length){
                       enumSTR+=",";
                     }
                   }
                   enumSTRfirst = params[i]['enum'][0];
                 }else{
                   //nothing
                 }

                 var maxNumRes = 0;
                 if(params[i]['maximum']){//if pagination parameter
                   maxNumRes = params[i]['maximum'];
                   console.log("max number",params[i]['maximum']);
                 }


                 //type
                 if(params[i]['type'] == 'string'){
                   var sub = '<option value="string" selected>String</option><option value="int">Integer</option><option value="date-time">Boolean</option><option value="date">Date</option><option value="date-time">DateTime</option>'
                 }else if(params[i]['type'] == 'boolean'){
                   var sub = '<option value="string">String</option><option value="int">Integer</option><option value="boolean" selected>Boolean</option><option value="date">Date</option><option value="date-time">DateTime</option>'
                 }else if(params[i]['type'] == 'integer'){
                   var sub = '<option value="string">String</option><option value="int" selected>Integer</option><option value="boolean">Boolean</option><option value="date">Date</option><option value="date-time">DateTime</option>'
                 }else{
                   var sub = '<option value="string" selected>String</option><option value="int">Integer</option><option value="date-time">Boolean</option><option value="date">Date</option><option value="date-time">DateTime</option>'
                 }

                 //required

                 var isRequired = false;
                 if(params[i]['required'] == true){
                   var required = '<input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/>';

                   isRequired = true;

                   // $("#requestTabel tbody").append('<tr id=""><td><input class="form-control" type="text" id="name" value="'+params[i]['name']+'" style="width:85px" onchange="urlBlur()"></td><td><input class="form-control" type="text" id="value" value="'+enumSTRfirst+'" style="width:85px" onchange="urlBlur()" ></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder="" rows="1" onchange="urlBlurNoCall()">'+enumSTR+'</textarea></td><td><input id="displayedName" class="form-control" type="text" placeholder="" onchange="urlBlurNoCall()" value="'+params[i]['name']+'"></td><td><textarea class="form-control" type="text" id="desc" rows="1" onchange="urlBlurNoCall()">'+params[i]['description']+'</textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()">'+sub+'</select></td><td>'+required+'</td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"/></td></tr>');

                 }else{
                   isRequired = false;

                    var required = '<input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off"/>';
                 }// else not required

                 optionalParam.push({
                   name: params[i]['name'],
                   descrip: params[i]['description'],
                   isReq: isRequired,
                   max: maxNumRes,
                   value: '<tr id="firstTR"><td><input class="form-control" type="text" id="name" value="'+params[i]['name']+'" style="width:85px" onchange="urlBlur()"></td><td><input class="form-control" type="text" id="value" value="'+enumSTRfirst+'" style="width:85px" onchange="urlBlur()" ></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder="" rows="1" onchange="urlBlurNoCall()">'+enumSTR+'</textarea></td><td><input id="displayedName" class="form-control" type="text" placeholder="" onchange="urlBlurNoCall()" value="'+params[i]['name']+'"></td><td><textarea class="form-control" type="text" id="desc" rows="1" onchange="urlBlurNoCall()">'+params[i]['description']+'</textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()">'+sub+'</select></td><td>'+required+'</td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"/></td></tr>'
                 });

               }

             }
           });


         }

      }
    }
    // document.getElementById('links').innerHTML = links;
  };
  xhttp.open('GET', rootUrl + 'list.json', true);
  xhttp.send(null);

  // console.log("optionalParam: ",optionalParam);
 }else{
   $("#pDiv").show();
   $("#jsoneditor2").show();
   // document.getElementById("reqDIV").scrollIntoView();
 }
}


function addReqRow(t){

  if(optionalParam.length > 0){
    for(var i=0; i < optionalParam.length; ++i){
      if(t.id == optionalParam[i].name){
        // console.log("id: ", t.id);
        // console.log("name: ", optionalParam[i].name);
        // console.log("vale: ", optionalParam[i].value);

        //remove it from optional parameters list
        document.getElementById(optionalParam[i].name).remove();

        //add it to request table
        $("#requestTabel tbody").append(optionalParam[i].value);
      }
    }
  }else if(duplicates.length > 0){
    for(var x=0; x < duplicates.length; ++x){
      if(t.id == duplicates[x]){
        //remove it from optional parameters list
        document.getElementById(duplicates[x]).remove();

        //add it to request table
        $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name"  style="width:85px" onchange="urlBlur()" placeholder="" value="'+duplicates[x]+'"></td><td><input class="form-control" type="text" id="value"  style="width:85px" onchange="urlBlur()" placeholder="" value=""></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder=""rows="1" onchange="urlBlurNoCall()"></textarea></td><td><div><input id="displayedName" class="form-control" type="text" onchange="urlBlurNoCall()"></div></td><td><textarea class="form-control" type="text" id="desc" rows="1" onchange="urlBlurNoCall()"></textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');
      }
    }
  }
}


function email_check(){
  console.log("popover!")

  //   $('input[name=nameParam]').parent().removeClass("has-error has-feedback").removeClass("has-success has-feedback");
  //   $('span.glyphicon').remove();
  //   var email = $('input[name=nameParam]').val()
	// if( !isValidEmailAddress( email ) ) {
  //setup before functions
  var typingTimer;                //timer identifier
  var doneTypingInterval = 1000;  //time in ms (5 seconds)

  //on keyup, start the countdown
  clearTimeout(typingTimer);
  if ($('input[name=nameParam]').val()) { //if value and exist in apis guru?
    typingTimer = setTimeout(doneTyping, doneTypingInterval);
  }

  //user is "finished typing," do something
  function doneTyping () {
      //do something
      $("input[name=nameParam]").popover({content: "<button>BUTTON</button>", placement:'right', title:'Autofill?', container:'body'});
      $("input[name=nameParam]").popover('show');
  }

}

function isValidEmailAddress() {
	return false;
}



function apiHasBeenChosen(select){
  var str = select.options[select.selectedIndex].getAttribute("id");
  var api_title = str.split('_').join(' ');

  console.log("selected: ", api_title);
  window.location.href='data-management.html?api='+str;
}




var tempOb = [];
var duplicates = [];

function callGitHub2(u){

  var objJSON = [];
  var pageGit = 5;
  duplicates = [];

  for(var i=0; i<pageGit; ++i) {
    var par = {
      "q" : u,
      // "access_token" : ' ',
      "page":i,
      "per_page" : 100 //maximum results we can get from github
      }

    var headerAccValue = "application/vnd.github.v3.text-match+json";
    var headerAuthValue = "";

    var objH = {headerKey:"Accept", headerAccVal:JSON.stringify(headerAccValue), headerAuthVal:JSON.stringify(headerAuthValue)};

    $.ajax({
      url: "https://api.github.com/search/code",
      data: par,
      method: "GET",
      headers: {
        "Accept": "application/vnd.github.v3.text-match+json",
        "Authorization": "token "
      },
      success: function (response) {
        for(var n=0; n<response.items.length; ++n){
          for(var m=0; m<response.items[n].text_matches.length; ++m){
            objJSON.push(response.items[n].text_matches[m].fragment);
          }
        }
      }
    });
  }


  setTimeout(function(){
    var r = $.Deferred();
    var c = 0;
    var arrParamVal = [];

      for(var i=0; i<objJSON.length; ++i){
        var str= JSON.stringify(objJSON[i], '', 7);
        if(str.includes(u+"?")){
          var urls = str.split(u+"?");
          var reqParameters = urls[1].split(/[^\=\&\dA-Z]/gi);
          var reqParam = reqParameters[0].split("&");
          for(var x=0; x<reqParam.length; ++x){
            arrParamVal.push(reqParam[x].split("=")[0]);
          }
        }
      }

      var map = arrParamVal.reduce(function (p, c) {
          p[c] = (p[c] || 0) + 1;
          return p;
      }, {});
      duplicates = Object.keys(map).sort(function (a, b) {
          return map[a] < map[b];
      });

      var existDup = false;
      var test=[];
      var githubNotOpenAPI=[];

      if(optionalParam.length>0){//OpenAPI specification exits
        $("#optionalP").append('<h5 style=" margin:0px; padding:0px">Add other parameters:</h5>');

        for(var x=0; x<optionalParam.length; ++x){
          if(optionalParam[x].isReq){
            $("#requestTabel tbody").append(optionalParam[x].value);
          }
        }


        for(var x=0; x<optionalParam.length; ++x){
          for(var j=0; j<5; ++j){
          if(optionalParam[x].name == duplicates[j] && !optionalParam[x].isReq){
              $("#requestTabel tbody").append(optionalParam[x].value);
              existDup = true;
              break;
            }else{
              existDup = false;
            }
          }


          if(!existDup && !optionalParam[x].isReq){
              $("#optionalP").append('<button id="'+optionalParam[x]['name']+'" class="button button-mini button-circle button-border button-teal" style="text-transform:none; padding: 0 6px; " data-tooltip="'+optionalParam[x]['descrip']+'" onclick="addReqRow(this)">'+optionalParam[x]['name']+'</button>');
           }
        }//for loop

        //add the ones in duplicates but not in optionalParam to request table

        for(var x=0; x<5; ++x){
          var existInOptional = false;
          for(var j=0; j<optionalParam.length; ++j){
            if(duplicates[x] == optionalParam[j].name){
              existInOptional = true;
            }
           }
           if(!existInOptional){
             $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name"  style="width:85px" onchange="urlBlur()" placeholder="" value="'+duplicates[x]+'"></td><td><input class="form-control" type="text" id="value"  style="width:85px" onchange="urlBlur()" placeholder="" value=""></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder=""rows="1" onchange="urlBlurNoCall()"></textarea></td><td><div><input id="displayedName" class="form-control" type="text" onchange="urlBlurNoCall()"></div></td><td><textarea class="form-control" type="text" id="desc" rows="1" onchange="urlBlurNoCall()"></textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');
           }
          }


      }else if(duplicates.length>0 && !hasParameters){//only GitHub and no OpenAPI
        $("#optionalP").append('<h5 style=" margin:0px; padding:0px">Add other parameters:</h5>');

        var j;
        for(j=0; j<5; ++j){
          if(duplicates[j]){
            $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name"  style="width:85px" onchange="urlBlur()" placeholder="" value="'+duplicates[j]+'"></td><td><input class="form-control" type="text" id="value"  style="width:85px" onchange="urlBlur()" placeholder="" value=""></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder=""rows="1" onchange="urlBlurNoCall()"></textarea></td><td><div><input id="displayedName" class="form-control" type="text" onchange="urlBlurNoCall()"></div></td><td><textarea class="form-control" type="text" id="desc" rows="1" onchange="urlBlurNoCall()"></textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');
          }
        }

        for(var x=j; x<duplicates.length; ++x){
          $("#optionalP").append('<button id="'+duplicates[x]+'" class="button button-mini button-circle button-border button-teal" style="text-transform:none; padding: 0 6px; " data-tooltip="" onclick="addReqRow(this)">'+duplicates[x]+'</button>');
        }
      }else{
        //do nothing
      }

      for(var x=0; x<optionalParam.length; ++x){
        $("#paramList").append('<option id="'+optionalParam[x]['max']+'" value="'+optionalParam[x]['name']+'"/>');
        $("#pageList").append('<option id="" value="'+optionalParam[x]['name']+'"/>');
      }

    $("#toggReq").show();

    $("#pDiv").show();
    $("#jsoneditor2").show();
    // document.getElementById("reqDIV").scrollIntoView();

  }, 2500);

}//callGithub2 function


function onInputMaxParam() {
    var val = document.getElementById("result_param").value;
    var opts = document.getElementById('paramList').childNodes;
    for (var i = 0; i < opts.length; i++) {
      if (opts[i].value === val) {
        document.getElementById('result_max').value = opts[i].id;
        break;
      }
    }
}


function callGitHub(u){
  //$("#requestTabel").empty();
  //console.log("URL: ", u);
  var objJSON = [];

  //for(var i=0; i<5; ++i){
  var pageGit = 3;
  //var i = 0;

  //getTheNextPageGitHub(pageGit, i)
  //function getTheNextPageGitHub(pageGit, i){
    //if(i<pageGit){

  for(var i=0; i<pageGit; ++i) {
    var par = {
      "q" : u,
      //"access_token" : ' ',
      "page":i,
      "per_page" : 100 //maximum results we can get from github
    }

    var headerAccValue = "application/vnd.github.v3.text-match+json";
    var headerAuthValue = "";

    var objH = {headerKey:"Accept", headerAccVal:JSON.stringify(headerAccValue), headerAuthVal:JSON.stringify(headerAuthValue)};

    $.ajax({
      url: "https://api.github.com/search/code",
      data: par,
      method: "GET",
      headers: {
        "Accept": "application/vnd.github.v3.text-match+json",
        "Authorization": "token "
      },

      success: function (response) {
        console.log("RESPONSE: ",response);
        for(var n=0; n<response.items.length; ++n){
          for(var m=0; m<response.items[n].text_matches.length; ++m){
            objJSON.push(response.items[n].text_matches[m].fragment);
          }
        }
      }
    });

      //  ++i;
    //getTheNextPageGitHub(pageGit, i);//call until it goes through the 5 pages
  }
  //else{


setTimeout(function(){

  var functionOne = function() {
   var r = $.Deferred();
   // Do your whiz bang jQuery stuff here
   //console.log('Function One');

    var c = 0;
    var arrParamVal = [];



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

      var ob = [];

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
       tempOb = [];
       //console.log(checkValues(ob1,tempOb));
       tempOb = checkValues(ob1,tempOb);
       //console.log("tempOb: ",tempOb)
      function checkValues(ob1, tempOb){
        //console.log("checkValues");
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


    return r;

  };

  var functionTwo = function() {

    // Do your whiz bang jQuery stuff here
    //console.log('Function Two');
    //console.log("list: ", tempOb);
    if(tempOb[0]){
    document.getElementById('name').value = tempOb[0]['p']
    document.getElementById('value').value =tempOb[0]['v']

    for(var i=1; i<tempOb.length; ++i){
      $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name"  style="width:85px" onchange="urlBlur()" placeholder="" value="'+tempOb[i]['p']+'"></td><td><input class="form-control" type="text" id="value"  style="width:85px" onchange="urlBlur()" placeholder="" value="'+tempOb[i]['v']+'"></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder=""rows="1" onchange="urlBlurNoCall()"></textarea></td><td><div><input id="displayedName" class="form-control" type="text" onchange="urlBlurNoCall()"></div></td><td><textarea class="form-control" type="text" id="desc" rows="1" onchange="urlBlurNoCall()"></textarea></td><td><select class="form-control" id="type" style="height:30px" onchange="urlBlurNoCall()"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');
    }
  }else{
    console.log("GitHub was too slow! Try to click the GitHub button again!");
  }

  };

  // Now call the functions one after the other using the done method
  functionOne().done( functionTwo() );
}, 5000);
  //f(objJSON);
  //populateRequestParam(tempOb);


        /* Gets called when all requests are ended */
      //$(document).ajaxStop(function(event,request,settings){
              //  count++;
              //  $("#stage4").html("<h1>Stops, Count :" + count + "</h1>");


        //appendJSON(objJSON,response);

        //}, 2000);
        //});//AJAX stop

        //populateRequestParam(tempOb);

      //}
  //  }//end of page loop

}//callGithub function


function googleIt(term){
  window.open("https://www.google.com/search?q="+term);
}


function mySandwich(param1, param2, callback) {
  alert('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);
  callback();
}



function f(objJSON){

  var c = 0;
  var arrParamVal = [];


  //setTimeout(function(){
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

    var ob = [];

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
     tempOb = [];
     //console.log(checkValues(ob1,tempOb));
     tempOb = checkValues(ob1,tempOb);
     //console.log("tempOb: ",tempOb)
    function checkValues(ob1, tempOb){
      //console.log("checkValues");
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


}


function populateRequestParam(list){
  console.log("list: ", list);

  document.getElementById('name').value = list[0]['p']
  document.getElementById('value').value =list[0]['v']

  for(var i=1; i<list.length; ++i){
    $("#requestTabel tbody").append('<tr><td><input class="form-control" type="text" id="name"  style="width:85px" onchange="urlBlur()" placeholder="" value="'+list[i]['p']+'"></td><td><input class="form-control" type="text" id="value" style="width:85px"  onchange="urlBlur()" placeholder="" value="'+list[i]['v']+'"></td><td><textarea class="form-control" type="text" id="listOfValues" placeholder=""rows="1" onchange="urlBlurNoCall()"></textarea></td><td><div><input id="displayedName" class="form-control" type="text" onchange="urlBlurNoCall()"></div></td><td><textarea class="form-control" type="text" id="desc" rows="1" onchange="urlBlurNoCall()"></textarea></td><td><select class="form-control" id="type" onchange="urlBlurNoCall()" style="height:30px"><option value="string">String</option><option value="int">Integer</option><option value="date">Date</option><option value="date-time">DateTime</option></select></td><td><input id="required"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input id="displayed"  value="" class="checkbox-style" name="" type="checkbox"  onchange="urlBlurNoCall()" autocomplete="off" checked/></td><td><input type="image" src="images/del.png" style="width:18px"onclick="deleteRow(this)"</td></tr>');
  }
}



function prettierURL(){
  var link = window.location.href;
  var url = link.split('.html');
  window.history.replaceState( null, null, url[0] );
}




function populateAPIDesc(){

  //prettierURL();
  registration();
  //Files Table
  firebase.database().ref('apis/').once('value').then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) { //for each saved data
      if(childSnapshot.val() != undefined){
        var urlTitle = childSnapshot.val().title;
        var name = urlTitle.split(' ').join('');
        $("#specs_table tbody").append('<tr><td><a href="https://superapi-52bc2.firebaseio.com/apis/'+urlTitle+'.json" target="_blank">'+childSnapshot.val().title+'</a></td><td></td></tr>');
      }else{
        //////////
      }
    });
  });

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
        $("#public_data_table tbody").append('<tr><td>'+file_title+'</td><td>'+file_desc+'</td><td style="min-width:150px">'+api_name+'</td><td style="text-align:center; background-color:#f4f9fa"><a href='+url+' download="'+file_desc+'.csv" data-placement="right" title="Download dataset in CSV format"><img src="images/csv-file.png" width="28px"></a> </td><td style="text-align:center; background-color:#f4f9fa"> <a href="data:'+ urlJ +'" download="'+file_desc+'.json" data-toggle="tooltip" data-placement="right" title="Download dataset in JSON format"><img src="images/json-file.png" width="25px"></a> </td><td style="text-align:center; background-color:#f4f9fa"> <a href="data-management.html?api='+api_name.replace(/ /g, "_")+'/#'+file_title.split(' ').join('_')+'" target="_blank" data-toggle="tooltip" data-placement="right" title="Edit this dataset"><img src="images/edit.png" width="25px"></a> </td><td style="text-align:center; background-color:#f4f9fa"> <a target="_blank" rel="noopener noreferrer" href="'+link+'" data-placement="right" title="Query URL: '+link+'"><img src="images/link.png" style="top:20px; width:18px" ></a> </td> </tr>');
        // <td><img src="images/eye.png" alt="" width="15px">aa &nbsp;  <img src="images/down.png" alt="" width="15px">aa </td>
      }else{
        //////////
      }
    });
  });

}


function covid19APIs(){
    registration();
    
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



function showIndex(){
  $("#indexDiv").show();
  $("#nextDiv").hide();
  $("#offsetDiv").hide();
}

function showOffset(){
  $("#indexDiv").hide();
  $("#nextDiv").hide();
  $("#offsetDiv").show();
}

function showNext(){
  $("#indexDiv").hide();
  $("#nextDiv").show();
  $("#offsetDiv").hide();
}



//////////////////// LOGIN



function callIT(){
  console.log("callIT");
  $.ajax({
    // The 'type' property sets the HTTP method.
    // A value of 'PUT' or 'DELETE' will trigger a preflight request.
    crossOrigin: true,
    type: 'GET',

    // The URL to make the request to.
    url: 'https://api.yelp.com/v3/businesses/search?term=burgers&location=boston',

    // The 'contentType' property sets the 'Content-Type' header.
    // The JQuery default for this property is
    // 'application/x-www-form-urlencoded; charset=UTF-8', which does not trigger
    // a preflight. If you set this value to anything other than
    // application/x-www-form-urlencoded, multipart/form-data, or text/plain,
    // you will trigger a preflight request.
    contentType: 'text/plain',

    xhrFields: {
      // The 'xhrFields' property sets additional fields on the XMLHttpRequest.
      // This can be used to set the 'withCredentials' property.
      // Set the value to 'true' if you'd like to pass cookies to the server.
      // If this is enabled, your server must respond with the header
      // 'Access-Control-Allow-Credentials: true'.
      withCredentials: false
    },

    headers: {
      // Set any custom headers here.
      // If you set any non-simple headers, your server must include these
      // headers in the 'Access-Control-Allow-Headers' response header.
      Authorization: "Bearer lFvvnoRne1-Od__tDTS_kC4w_ifGdXq7XeYGXhxj67FlTAWnZuwiD46hWe15i3ZQEz9c4zTsAES_MdSgzcHnDM2b1QvvaKzOB7KbBFJOrk5cCNdAxjfSB4R6VRFeXHYx"
    },

    success: function(response) {
      console.log("ressssss: ",response);
      // Here's where you handle a successful response.
    },

    error: function() {
      // Here's where you handle an error response.
      // Note that if the error was due to a CORS issue,
      // this function will still fire, but there won't be any additional
      // information about the error.
    }
  });

}

// Helper method to parse the title tag from the response.
function getTitle(text) {
  return text.match('<title>(.*)?</title>')[1];
}

// Make the actual CORS request.
function makeCorsRequest() {
  // This is a sample server that supports CORS.
  var url = 'http://html5rocks-cors.s3-website-us-east-1.amazonaws.com/index.html';

  var xhr = createCORSRequest('GET', url);
  if (!xhr) {
    alert('CORS not supported');
    return;
  }

  // Response handlers.
  xhr.onload = function() {
    var text = xhr.responseText;
    var title = getTitle(text);
    alert('Response from CORS request to ' + url + ': ' + title);
  };

  xhr.onerror = function() {
    alert('Woops, there was an error making the request.');
  };

  xhr.send();
}


