Titanium.UI.setBackgroundColor('#ffffff');

var bh = {}; // 'bh' is our app's namespace
Ti.include(  // we'll be including all the files for our namespace in the root app context
	'library/ui.js',
	'library/db.js'
);

Ti.include('library/version.js');

//Use our custom UI constructors to build the app's UI
var tabs = bh.ui.createApplicationTabGroup();
tabs.open();

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