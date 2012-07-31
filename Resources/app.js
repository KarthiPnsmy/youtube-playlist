// this sets the background color of the master UIView (when there are no windows/tab groups on it)
Titanium.UI.setBackgroundColor('#000');

// create tab group
var tabGroup = Titanium.UI.createTabGroup();

//
// create base UI tab and root window
//
var win = Titanium.UI.createWindow({
	title : 'Youtube Playlist',
	backgroundColor : '#fff',
	tabBarHidden : true
});
var tab1 = Titanium.UI.createTab({
	title : 'Yourube Playlist',
	window : win
});

var platform = Ti.Platform.osname;
var channelName = "apple";
var videoList = require('youtubeVideolist');

// Empty array "rowData" for our tableview
var rowData = [];
// Create our HTTP Client and name it "loader"
var loader = Titanium.Network.createHTTPClient();
// Sets the HTTP request method, and the URL to get data from
loader.open("GET", "http://gdata.youtube.com/feeds/api/users/"+channelName+"/playlists?v=2");

// Runs the function when the data is ready for us to process
loader.onload = function() {

	var doc = this.responseXML.documentElement;
	var items = doc.getElementsByTagName("entry");
	for (var i = 0; i < items.length; i++) {
		var item = items.item(i);
		var al_title = item.getElementsByTagName("title").item(0).text;
		var vid_count = item.getElementsByTagName("yt:countHint").item(0).text;
		var pl_list_id = item.getElementsByTagName("yt:playlistId").item(0).text;

		var op_title = al_title + " (" + vid_count + ")";

		var row = Titanium.UI.createTableViewRow({
			height : 'auto',
			titleText : op_title,
			palaylist_id : pl_list_id,
			color : '#000',
			font : {
				fontSize : 15,
				fontWeight : 'bold',
				fontFamily : 'Helvetica Neue'
			}
		});

		var label = Ti.UI.createLabel({
			text : op_title,
			left : 5,
			top : 8,
			bottom : 8,
			right : 5,
			height : Ti.UI.SIZE,
			color : '#000',
			font : {
				dontSize : 14,
				fontWeight : 'bold'
			}
		});
		row.add(label);

		rowData[i] = row;

	}
	var tableView = Titanium.UI.createTableView({
		top : 0,
		backgroundColor : '#fff',
		data : rowData
	});
	//Add the table view to the window
	win.add(tableView);

	tableView.addEventListener('click', function(e) {
		var window = videoList.youtubeVideolist(e.rowData.titleText, e.rowData.palaylist_id);
		if (platform == "iphone") {
			tab1.open(window, {
				animated : true
			});
		} else {
			window.open();
		}
	});

};

loader.onerror = function(e) {
	Ti.API.debug(e.error);
	alert("Unable to connect to server");
	Ti.App.fireEvent('hide_indicator');
};

loader.timeout = 10000;
/* in milliseconds */

// Send the HTTP request
loader.send();

tabGroup.addTab(tab1);

// open tab group
tabGroup.open();
