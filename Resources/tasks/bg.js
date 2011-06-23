var bh = {};

Ti.include('/library/db.js');
Ti.include('/library/qpqp.js');

// GPS Configuration
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

