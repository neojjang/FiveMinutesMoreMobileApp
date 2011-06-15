Titanium.UI.setBackgroundColor('#ffffff');

var Qpqp = {}; // 'Qpqp' is our app's namespace
Ti.include( //we'll be including all the files for our namespace in the root app context
    'library/ui.js',
    'library/db.js'
);

//Use our custom UI constructors to build the app's UI
var tabs = Qpqp.Ui.createApplicationTabGroup();
tabs.open();

//Log our current platform to the console
Ti.API.info('Welcome to FiveMinutesMore for ' + Ti.Platform.osname);

// Ti.include('library/bootstrap/db.js');
// Ti.include('windows/main.js');
// Ti.include('library/ui.js');
