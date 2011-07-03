Titanium.UI.setBackgroundColor('#ffffff');

var bh = {};
bh.coords = null;
bh.service = null;

// Tools
Ti.include('/library/version.js');
Ti.include('/library/qpqp.js');

// UI Interface
Ti.include('/library/ui.js');

// Database 
Ti.include('/library/db.js');
Ti.include('/library/bootstrap/db.js');
Ti.include('/library/bootstrap/gps.js');
Ti.include('/library/packs/bcn.js');

var tabs = bh.ui.createApplicationTabGroup();
tabs.open();

/*
var locations = [];
locations.push({longitud: 11, latitude: 11});
locations.push({longitud: 12, latitude: 12});
locations.push({longitud: 13, latitude: 13});
locations.push({longitud: 14, latitude: 14});
locations.push({longitud: 15, latitude: 15});
locations.push({longitud: 16, latitude: 16});
var tracker = new Qpqp.Map.Player(locations, 1000);
Qpqp.Api.log(tracker);
tracker.start();
*/

/*
if (isiOS4Plus()) {
	// fired when an app resumes for suspension
	Ti.App.addEventListener('resume',function(e){
		Ti.API.info("app is resuming from the background");
	});

	Ti.App.addEventListener('resumed', function(e) {
		Ti.API.info("app has resumed from the background");

        // this will unregister the service if the user just opened the app
        // is: not via the notification 'OK' button..
        if (bh.service != null) {
            bh.service.stop();
            bh.service.unregister();
        }
    });

	Ti.App.addEventListener('pause',function(e){
		Ti.API.info("app was paused from the foreground");

        // START THE SERVICE NOW...
        // this could have a custom event listener in it waiting for events from other parts
        // of your app, like upload/download completion, gps data, etc.. 
        var service = Ti.App.iOS.registerBackgroundService({
        	url : '/tasks/bg.js'
    	});
    });
}
*/
