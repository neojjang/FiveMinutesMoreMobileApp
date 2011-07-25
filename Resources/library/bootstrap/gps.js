(function() {
    bh.gps = {};
    bh.gps._location = null;
    bh.gps._dialog = null;
    
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
            if (isIPhone3_2_Plus())
            {
                //NOTE: starting in 3.2+, you'll need to set the applications
                //purpose property for using Location services on iPhone
                Ti.Geolocation.purpose = "Current Position";
            }

            Titanium.Geolocation.accuracy = Titanium.Geolocation.ACCURACY_BEST;
            
            var messageWin = Titanium.UI.createWindow({
                height:30,
                width:250,
                bottom:70,
                borderRadius:10,
                touchEnabled:false,

                orientationModes : [
                Titanium.UI.PORTRAIT,
                Titanium.UI.UPSIDE_PORTRAIT,
                Titanium.UI.LANDSCAPE_LEFT,
                Titanium.UI.LANDSCAPE_RIGHT
                ]
            });
            
            var messageView = Titanium.UI.createView({
                id:'messageview',
                height:30,
                width:250,
                borderRadius:10,
                backgroundColor:'#000',
                opacity:0.7,
                touchEnabled:false
            });

            var messageLabel = Titanium.UI.createLabel({
                id:'messagelabel',
                text:'',
                color:'#fff',
                width:250,
                height:'auto',
                font:{
                    fontFamily:'Helvetica Neue',
                    fontSize:13
                },
                textAlign:'center'
            });
            messageWin.add(messageView);
            messageWin.add(messageLabel);

            var locationCallback = function(e) {
                Qpqp.Api.log('GPS Event raised');
                if (!e.success || e.error) {
                    Qpqp.Api.log('- No connection');
                    return;
                }
                
                var closestAlarms = bh.db.listClosestAlarms(e.coords.latitude, e.coords.longitude);
                Qpqp.Api.log('Closest alarms: ' + closestAlarms.length);
                if (closestAlarms.length > 0) {
                    messageLabel.text = closestAlarms[0].name + ' ' + L('is the closest alarm');
                    messageWin.open();
                    setTimeout(function()
                    {
                        messageWin.close({opacity:0, duration:1000});
                    },3000);
                }
                
                bh.gps._location = e.coords;
                
                var activeAlarms = bh.db.listActiveAlarms(e.coords.latitude, e.coords.longitude);
                Qpqp.Api.log('Active alarms: ' + activeAlarms.length);
                
                if (activeAlarms.length > 0) {
					// If there is an active dialog
					if (bh.gps._dialog == null) {
						return false;
					}

                    // var file = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'sounds/cricket.wav');
                    // var sound = Titanium.Media.createSound({sound:file});
                    // sound.play();
                    Titanium.Media.vibrate();
                    Titanium.Media.beep();

                    var messages = [];
                    for (var i = 0; i < activeAlarms.length; i++) {
                        Qpqp.Api.log('- ' + activeAlarms[i].name + ' (' + activeAlarms[i].latitude + ', ' + activeAlarms[i].longitude + ')');
                        messages.push(activeAlarms[i].name);
                    }
                    
                    var message = L('Hey! You are around') + ' ' + Qpqp.String.join(messages, ', ', ' ' + L('and') + ' ');

                    Qpqp.Api.log('Showing alert window...');
                    bh.gps._dialog = Titanium.UI.createAlertDialog({
                        title: 'GPS Alarm',
                        message: message,
                        cancel: 1,
                        buttonNames: ['Remind me!', 'Stop it!']
                    });
                    bh.gps._dialog.show();
                    
                    // On click, we disabled active alarms for 
                    // 5 or 30 minutes
                    bh.gps._dialog.addEventListener('click', function(e) {
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
        }
    }
    
    Ti.App.addEventListener('enableAlarms', function(e) {
        Ti.API.log('Let\'s enable some alarms');

        var alarms = e.alarms;
        for(var i = 0; i < alarms.length; i++) {
            bh.db.editAlarm(alarms[i].id, true);
            Ti.API.log('Alarm ' + alarms[i].id + ' has been enabled');
        }
    });
})();
