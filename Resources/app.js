Titanium.UI.setBackgroundColor('#ffffff');

var bh = {}; // 'bh' is our app's namespace
bh.coords = null; // 'bh' is our app's namespace
bh.service = null;

// UI Interface
Ti.include('/library/ui.js');

// Database 
Ti.include('/library/db.js');
Ti.include('/library/bootstrap/db.js');
Ti.include('/library/packs/bcn.js');

// Tools
Ti.include('/library/version.js');
Ti.include('/library/qpqp.js');

// bh.db.listActiveAlarms();

if (Titanium.Geolocation.locationServicesEnabled === false)
{
	Titanium.UI.createAlertDialog({
		title: 'FiveMinutesMore',
		message: 'Your device has geo turned off - turn it on.'
	}).show();
}
else
{
	var authorization = Titanium.Geolocation.locationServicesAuthorization;
	Ti.API.info('Authorization: ' + authorization);
	if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
		Ti.UI.createAlertDialog({
			title:'FiveMinutesMore',
			message:'You have disallowed FiveMinutesMore from running geolocation services.'
		}).show();
	}
	else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
		Ti.UI.createAlertDialog({
			title:'FiveMinutesMore',
			message:'Your system has disallowed FiveMinutesMore from running geolocation services.'
		}).show();
	} else {
		Ti.Geolocation.preferredProvider = "gps";
		
		if (isIPhone3_2_Plus())
		{
			//NOTE: starting in 3.2+, you'll need to set the applications
			//purpose property for using Location services on iPhone
			Ti.Geolocation.purpose = "Current Position";
		}
		
		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	
		//
		//  SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVES
		//  THIS VALUE IS IN METERS
		//
		Titanium.Geolocation.distanceFilter = 10;

		/*		
		var areasToFill = bh.db.listFullCategories();
		var n = areasToFill.length;
		for (var k = 0; k < n; k++) {
			var nameToResolve = ;
			Ti.API.log(nameToResolve);
			Titanium.Geolocation.forwardGeocoder('"' + areasToFill[k].name + '" FGC Station, Spain', function(evt) {
				evt.place = nameToResolve;
				Qpqp.Api.log(evt);
			});
		}
		*/

		//
		// GET CURRENT POSITION - THIS FIRES ONCE
		//
		Titanium.Geolocation.getCurrentPosition(function(e)
		{
			if (!e.success || e.error)
			{
				currentLocation.text = 'error: ' + JSON.stringify(e.error);
				Ti.API.info("Code translation: "+translateErrorCode(e.code));
				alert('error ' + JSON.stringify(e.error));
				return;
			}

			bh.coords = e.coords;
			// Titanium.API.log(JSON.stringify(bh.coords));
			//Use our custom UI constructors to build the app's UI
			var tabs = bh.ui.createApplicationTabGroup();
			tabs.open();
		});
	}
}

if (isiOS4Plus()) {
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
        bh.service = Ti.App.iOS.registerBackgroundService({
        	url : '/tasks/bg.js'
    	});
    });
}
