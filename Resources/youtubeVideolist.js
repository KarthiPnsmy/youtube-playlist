exports.youtubeVideolist = function(title_name, playlist_id) {
	var platform = Ti.Platform.osname;
	var win = Ti.UI.createWindow({
		backgroundColor : '#fff',
		title : 'Video List'
	});

	// Empty array "rowData" for our tableview
	var data = [];
	// Create our HTTP Client and name it "loader"
	var loader = Titanium.Network.createHTTPClient();
	// Sets the HTTP request method, and the URL to get data from
	loader.open("GET", "http://gdata.youtube.com/feeds/api/playlists/" + playlist_id + "?v=2");

	// Runs the function when the data is ready for us to process
	loader.onload = function() {

		var doc = this.responseXML.documentElement;
		var items = doc.getElementsByTagName("entry");

		for (var c = 0; c < items.length; c++) {
			var item = items.item(c);
			var thumbnails = item.getElementsByTagName("media:thumbnail");
			if (thumbnails && thumbnails.length > 0) {
				var media = thumbnails.item(0).getAttribute("url");
				var title = item.getElementsByTagName("title").item(0).text;
				var videoId = item.getElementsByTagName("yt:videoid").item(0).text;
				var row = Ti.UI.createTableViewRow({
					video_id : videoId,
					video_title : title,
					height : Ti.UI.SIZE,
				});
				var label = Ti.UI.createLabel({
					text : title,
					left : 92,
					top : 5,
					bottom : 5,
					right : 5,
					height : Ti.UI.SIZE,
					color : '#000',
					font : {
						dontSize : 14,
						fontWeight : 'bold'
					}
				});
				row.add(label);

				var img = Ti.UI.createImageView({
					image : media,
					left : 5,
					height : 60,
					width : 80,
					top : 5,
					bottom : 5
				});

				row.add(img);
				data.push(row);
			}
		}
		var tableView = Titanium.UI.createTableView({
			top : 0,
			backgroundColor : '#fff',
			data : data
		});
		//Add the table view to the window
		win.add(tableView);

		tableView.addEventListener('click', function(e) {
			if (platform == 'android') {
				Titanium.Platform.openURL('http://www.youtube.com/watch?v=' + e.rowData.video_id);
			} else {
				var ytVideoSrc = "http://www.youtube.com/v/" + e.rowData.video_id;

				var playerWin = Ti.UI.createWindow({
					backgroundColor : '#ccc'
				});
				playThisVid(playerWin, ytVideoSrc)

			}
		});

		function playThisVid(view, video) {
			// Set the window orientation
			view.orientationModes = [Ti.UI.LANDSCAPE_RIGHT];

			var videoUrl = video;
			var htmlheader = "<html><head></head><body style='margin:0'><embed id='yt' src='";
			var htmlfooter = "' type='application/x-shockwave-flash' width='640' height='280'></embed></body></html>";
			var htmlmash = htmlheader + videoUrl + htmlfooter;

			var flexSpace = Titanium.UI.createButton({
				systemButton : Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
			});

			var done = Titanium.UI.createButton({
				title : 'Done',
				style : Titanium.UI.iPhone.SystemButtonStyle.BORDERED
			});

			var navBar = Titanium.UI.iOS.createToolbar({
				items : [done, flexSpace, flexSpace],
				top : 0,
				borderTop : true,
				borderBottom : true,
				barColor : '#000',
				translucent : true
			});
			view.add(navBar);

			done.addEventListener('click', function(e) {
				view.close();
			});

			webview = Ti.UI.createWebView({
				top : 34,
				html : htmlmash,
				width : 640,
				height : 280
			});

			view.add(webview);
			view.open();
		}

	};

	loader.onerror = function(e) {
		Ti.API.debug(e.error);
		alert("Unable to connect to server");
	};

	loader.timeout = 5000;
	/* in milliseconds */

	// Send the HTTP request
	loader.send();

	return win;
}
