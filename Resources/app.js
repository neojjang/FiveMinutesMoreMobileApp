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

	Ti.App.iOS.addEventListener('notification',function(e)
	{
		Ti.API.info("local notification received: " + JSON.stringify(e));
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
