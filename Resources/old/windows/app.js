Titanium.UI.setBackgroundColor('#ffffff');

var bh = {}; //`bh` is our app's namespace
Ti.include( //we'll be including all the files for our namespace in the root app context
	'ui.js',
	'db.js'
);

//Use our custom UI constructors to build the app's UI
var tabs = bh.ui.createApplicationTabGroup();
tabs.open();

//Log our current platform to the console
Ti.API.info('Welcome to TiBountyHunter for '+Ti.Platform.osname);