Titanium.UI.setBackgroundColor('#ffffff');

var bh = {}; // 'bh' is our app's namespace
bh.coords = null; // 'bh' is our app's namespace

Ti.include(  // we'll be including all the files for our namespace in the root app context
	'library/ui.js',
	'library/db.js'
);

Ti.include('library/version.js');
Ti.include('library/qpqp.js');

if (Titanium.Geolocation.locationServicesEnabled === false)
{
	Titanium.UI.createAlertDialog({title:'FiveMinutesMore', message:'Your device has geo turned off - turn it on.'}).show();
}
else
{
	var authorization = Titanium.Geolocation.locationServicesAuthorization;
	Ti.API.info('Authorization: '+authorization);
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
			Ti.Geolocation.purpose = "GPS demo";
		}
		
		Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
	
		//
		//  SET DISTANCE FILTER.  THIS DICTATES HOW OFTEN AN EVENT FIRES BASED ON THE DISTANCE THE DEVICE MOVES
		//  THIS VALUE IS IN METERS
		//
		Titanium.Geolocation.distanceFilter = 10;
	
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
			Titanium.API.log(JSON.stringify(bh.coords));
			//Use our custom UI constructors to build the app's UI
			var tabs = bh.ui.createApplicationTabGroup();
			tabs.open();
		});
	}
}

/*
if (isiOS4Plus())
{
	// register a background service. this JS will run when the app is backgrounded
	var service = Ti.App.iOS.registerBackgroundService({url:'tasks/bg.js'});
	
	Ti.API.info("registered background service = " + service);

	// listen for a local notification event
	Ti.App.iOS.addEventListener('notification',function(e)
	{
		Ti.API.info("local notification received: "+JSON.stringify(e));
	});

	// fired when an app resumes for suspension
	Ti.App.addEventListener('resume',function(e){
		Ti.API.info("app is resuming from the background");
	});
	Ti.App.addEventListener('resumed',function(e){
		Ti.API.info("app has resumed from the background");
	});

	Ti.App.addEventListener('pause',function(e){
		Ti.API.info("app was paused from the foreground");
	});
}
*/

//Log our current platform to the console
Ti.API.info('Welcome to FiveMinutesMore for ' + Ti.Platform.osname);