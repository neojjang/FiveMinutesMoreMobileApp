var bh = {};

// Database 
Ti.include('/library/db.js');

// Tools
Ti.include('/library/qpqp.js');

// GPS Configuration
Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
Titanium.Geolocation.distanceFilter = 10;

setInterval(function()
{
	// GET CURRENT POSITION - THIS FIRES ONCE
	Titanium.Geolocation.getCurrentPosition(function(e)
	{
		if (e.success) {
			Qpqp.Api.log(bh.db.listActiveAlarms(e.latitude, e.longitude));
		}
	});
}, 500);

