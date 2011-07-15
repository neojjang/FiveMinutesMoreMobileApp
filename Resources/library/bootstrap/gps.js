(function() {
    bh.gps = {};
    bh.gps.currentLocation = null;
    
    Ti.App.addEventListener('enableAlarms', function(e) {
        Ti.API.log('Let\'s enable some alarms');

        var alarms = e.alarms;
        for(var i = 0; i < alarms.length; i++) {
            bh.db.editAlarm(alarms[i].id, true);
            Ti.API.log('Alarm ' + alarms[i].id + ' has been enabled');
        }
    });
})();

if (Titanium.Geolocation.locationServicesEnabled === false) {
    Titanium.UI.createAlertDialog({
        title: 'GPS Alarm',
        message: 'Your device has geo turned off - turn it on.'
    }).show();
} else {
    var authorization = Titanium.Geolocation.locationServicesAuthorization;
    if (authorization == Titanium.Geolocation.AUTHORIZATION_DENIED) {
        Ti.UI.createAlertDialog({
            title:'GPS Alarm',
            message:'You have disallowed GPS Alarm from running geolocation services.'
        }).show();
    } else if (authorization == Titanium.Geolocation.AUTHORIZATION_RESTRICTED) {
        Ti.UI.createAlertDialog({
            title:'GPS Alarm',
            message:'Your system has disallowed GPS Alarm from running geolocation services.'
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
            // Ti.API.info('GPS Connection Attempt');
            if (!e.success || e.error) {
                // Ti.API.info('GPS Error:');
                // Qpqp.Api.log(e.error);
                return;
            }
            
            bh.gps.currentLocation = e;
            
            // Ti.API.info('GPS Success:');
            // Qpqp.Api.log(e);
            var activeAlarms = bh.db.listActiveAlarms(e.latitude, e.longitude);
            Qpqp.Api.log(activeAlarms);
            if (activeAlarms.length > 0) {
                Titanium.Media.vibrate();    

                var messages = [];
                for (var i = 0; i < activeAlarms.length; i++) {
                    messages.push(activeAlarms[i].name);
                }
                
                var message = L('Hey! You are around') + ' ' + Qpqp.String.join(messages, ', ', ' ' + L('and') + ' ');
                
                // var file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'sounds/cricket.wav');
                // var sound = Titanium.Media.createSound({sound:file});
                // sound.play();
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
                    for (var i = 0; i < activeAlarms.length; i++) {
                        bh.db.editAlarm(activeAlarms[i].id, false);
                    }
                    
                    // Schedules an event in order to re-enable the alarms
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
    }
}
