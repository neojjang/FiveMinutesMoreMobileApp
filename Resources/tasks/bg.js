var bh = {};

Ti.include('/library/db.js');
Ti.include('/library/qpqp.js');

/*
var locationCallback = function(e) {
    Qpqp.Api.log('GPS Event raised');
    if (!e.success || e.error) {
        Qpqp.Api.log('- No connection');
        return;
    }
    
    var activeAlarms = bh.db.listActiveAlarms(e.coords.latitude, e.coords.longitude);
    Qpqp.Api.log('Active alarms: ' + activeAlarms.length);
    
    if (activeAlarms.length > 0) {
        // var file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'sounds/cricket.wav');
        // var sound = Titanium.Media.createSound({sound:file});
        // sound.play();
        Titanium.Media.vibrate();

        var messages = [];
        for (var i = 0; i < activeAlarms.length; i++) {
            Qpqp.Api.log('- ' + activeAlarms[i].name + ' (' + activeAlarms[i].latitude + ', ' + activeAlarms[i].longitude + ')');
            messages.push(activeAlarms[i].name);
        }
        
        var message = L('Hey! You are around') + ' ' + Qpqp.String.join(messages, ', ', ' ' + L('and') + ' ');

        Qpqp.Api.log('Showing alert window...');
        var alarmDialog = Titanium.UI.createAlertDialog({
            title: 'GPS Alarm',
            message: message,
            cancel: 1,
            buttonNames: ['Remind me!', 'Stop it!']
        });
        alarmDialog.show();
        
        // On click, we disabled active alarms for 
        // 5 or 30 minutes
        alarmDialog.addEventListener('click', function(e) {
            var time = 300000; // 5 minutes
            if (e.index == 1) {
                // Stop it! button
                time = 1800000; // 30 minutes
            }
            
            // Disables active alarms
            Qpqp.Api.log('Disabling alarms...');
            for (var i = 0; i < activeAlarms.length; i++) {
                Qpqp.Api.log('- ' + activeAlarms[i].name);
                bh.db.editAlarm(activeAlarms[i].id, false);
            }
            
            // Schedules an event in order to re-enable the alarms
            Qpqp.Api.log('Alarms will be enabled in ' + time + ' seconds');
            setTimeout(
                function() {
                    Ti.App.fireEvent('enableAlarms', {alarms: activeAlarms});
                },
                time / 100
            );
        });
    }
};

Titanium.Geolocation.addEventListener('location', locationCallback);
*/

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

var notification = Ti.App.iOS.scheduleLocalNotification({
	alertBody: "Wake up, Neo...",
	alertAction: "Ok!",
	// date: new Date(new Date().getTime() + 3000) // 3 seconds after backgrounding
	date: new Date()
});
// notification.cancel();

/*
var count = 1;
var notificationActive = false;
setInterval(function()
{
	count++;
	if (count % 3 == 0 && !notificationActive) {
		notificationActive = true;
		notification = Ti.App.iOS.scheduleLocalNotification({
			alertBody: "Wake up, Neo...",
			alertAction: "Ok!",
			// date: new Date(new Date().getTime() + 3000) // 3 seconds after backgrounding
			date: new Date()
		});
	}
	
	Qpqp.Api.log(count);
}, 1000);
*/

// we cancel our notification if we don't want it to continue
// notification.cancel(); 
/*
Ti.App.iOS.addEventListener('notification', function(e) {
	notificationActive = false;
	Qpqp.Api.log(e);
});
*/
