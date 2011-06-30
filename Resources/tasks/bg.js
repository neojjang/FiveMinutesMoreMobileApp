var bh = {};

Ti.include('/library/db.js');
Ti.include('/library/qpqp.js');

// GPS Configuration
/*
var locationCallback = function(e) {
	Ti.API.info('GPS Connection Attempt');
	if (!e.success || e.error) {
		Ti.API.info('GPS Error:');
		Qpqp.Api.log(e.error);
		return;
	} else {
		Ti.API.info('GPS Success:');
		Qpqp.Api.log(e);
		var activeAlarms = bh.db.listActiveAlarms(e.latitude, e.longitude);
		Qpqp.Api.log(activeAlarms);
		if (activeAlarms.rowCount > 0) {
			// Play the alarm sound
			// Get Sound from configurations
			var file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'sounds/cricket.wav');
			var sound = Titanium.Media.createSound({sound:file});
			sound.play();
		}
	}
};

// TODO: Add more Geolocation configurations
Titanium.Geolocation.addEventListener('location', locationCallback);
*/ 

var count = 1;
var notificationActive = false;
setInterval(function()
{
	count++;
	if (count % 3 == 0 && !notificationActive) {
		/*
		notificationActive = true;
		notification = Ti.App.iOS.scheduleLocalNotification({
			alertBody: "Wake up, Neo...",
			alertAction: "Ok!",
			// date: new Date(new Date().getTime() + 3000) // 3 seconds after backgrounding
			date: new Date()
		});
		*/
	}
	
	Qpqp.Api.log(count);
}, 1000);


// we cancel our notification if we don't want it to continue
// notification.cancel(); 
/*
Ti.App.iOS.addEventListener('notification', function(e) {
	notificationActive = false;
	Qpqp.Api.log(e);
});
*/

Ti.App.currentService.stop();
