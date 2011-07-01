if (Titanium.Geolocation.locationServicesEnabled === false) {
	Titanium.UI.createAlertDialog({
		title: 'FiveMinutesMore',
		message: 'Your device has geo turned off - turn it on.'
	}).show();
} else {
	var authorization = Titanium.Geolocation.locationServicesAuthorization;
	if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
		Ti.UI.createAlertDialog({
			title:'FiveMinutesMore',
			message:'You have disallowed FiveMinutesMore from running geolocation services.'
		}).show();
	} else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
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
		Titanium.Geolocation.distanceFilter = 10;
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
		Titanium.Geolocation.addEventListener('location', locationCallback);

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
		/*
		Titanium.Geolocation.getCurrentPosition(function(e) {
			if (!e.success || e.error) {
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
		*/
	}
}
