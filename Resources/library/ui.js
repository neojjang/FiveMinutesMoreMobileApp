(function() {
    bh.ui = {};
    
    bh.ui.tabGroup = null;
    bh.ui.alarmsTab = null;
    bh.ui.mapView = null;
    
    bh.ui.createAlarmsWindow = function() {
        var win = Titanium.UI.createWindow({
            title: L('alarms'),
            barColor: '#000000'
        });

        var tableView = bh.ui.createAlarmsTableView();

        var about = Titanium.UI.createButton({
            title: L('about')
        });

        var edit = Titanium.UI.createButton({
            title: L('edit')
        });

        var cancel = Titanium.UI.createButton({
            title: L('done'),
            style: Titanium.UI.iPhone.SystemButtonStyle.DONE
        });

        about.addEventListener('click', function() {
            var modalWindow = bh.ui.createAboutWindow();
            modalWindow.open();
        });

        edit.addEventListener('click', function() {
            win.setLeftNavButton(cancel);
            tableView.editing = true;
        });

        cancel.addEventListener('click', function() {
            win.setLeftNavButton(edit);
            tableView.editing = false;
        });

        /*
        function updateEditButton() {
            Qpqp.Api.log(tableView.data);
            if (tableView.data.length > 0) {
                win.setLeftNavButton(edit);
            } else {
                win.setLeftNavButton(null);
                tableView.editing = false;
            }
        }
        */
        
        win.add(tableView);
        win.setRightNavButton(about);
        win.setLeftNavButton(edit);

        // updateEditButton();
        // Ti.App.addEventListener('alarmsWindowUpdated', updateEditButton);
        // Ti.App.addEventListener('browseWindowUpdated', updateEditButton);

        return win;
    };

    bh.ui.createMapWindow = function() {
        var win = Titanium.UI.createWindow({
            title: L('map'),
            barColor: '#000000'
        });

		var firstLoad = true;
		var mapView = Titanium.Map.createView({
			mapType: Titanium.Map.STANDARD_TYPE,
			userLocation: true,
			regionFit: true,
			animate: true
		});

		function populateAnnotations() {
			var data = bh.db.listAlarms();
			
			bh.ui.annotations = [];
			for (var i = 0; i < data.length; i++) {
				if (data[i].latitude && data[i].longitude) {
					var newAnnotation = Titanium.Map.createAnnotation({
						latitude: data[i].latitude,
						longitude: data[i].longitude,
						title: data[i].name,
						animate: true,
						leftButton: 'images/areas/fgc.png'
					});
					
					bh.ui.annotations.push(newAnnotation);
				}
			}

			mapView.removeAllAnnotations();
			mapView.addAnnotations(bh.ui.annotations);
		}
		populateAnnotations();

		function centerMap() {
			if (firstLoad) {
				if (bh.ui.annotations.length > 0) {
					mapView.setLocation(Qpqp.Map.getCenterRegion(bh.ui.annotations));
				} else {
					mapView.setLocation(Qpqp.Map.getCenterRegion(bh.gps.currentLocation));
				}

				firstLoad = false;
			}
		}


		mapView.addEventListener('complete', centerMap);
        Ti.App.addEventListener('alarmsWindowUpdated', populateAnnotations);
        Ti.App.addEventListener('browseWindowUpdated', populateAnnotations);
		
        var centerOnAlarms = Titanium.UI.createButton({
			title: L('center')
		});
        
        centerOnAlarms.addEventListener('click', function() {
			var location = Qpqp.Map.getCenterRegion(bh.ui.annotations);
        	if (location) {
	        	mapView.setLocation(location);
        	}
        });
        
        var centerOnLocation = Titanium.UI.createButton({
			title: L('location')
		});
        
        centerOnLocation.addEventListener('click', function() {
            Qpqp.Api.log('Centering on current location:');
            Qpqp.Api.log(bh.gps.currentLocation);
        	if (bh.gps.currentLocation) {
	        	mapView.setLocation(bh.gps.currentLocation);
        	}
        });

        win.setLeftNavButton(centerOnLocation);
        win.setRightNavButton(centerOnAlarms);
		win.add(mapView);
        return win;
    };

    bh.ui.createMapCustomAlarmsWindow = function() {
        var win = Titanium.UI.createWindow({
            title: L('custom'),
            barColor: '#000000'
        });

		var mapView = Titanium.Map.createView({
			mapType: Titanium.Map.STANDARD_TYPE,
			userLocation: true,
			regionFit: false,
			animate: false
		});
		
		win.add(mapView);
        return win;
    };

    bh.ui.createCategoriesWindow = function() {
        var win = Ti.UI.createWindow({
            title: L('lines'),
            barColor: '#000000'
        });
        
        win.add(bh.ui.createCategoriesTableView());
        return win;
    };

    bh.ui.createAreasWindow = function(_category) {
        var win = Ti.UI.createWindow({
            title: L('stops'),
            barColor: '#000000'
        });
        
        win.add(bh.ui.createAreasTableView(_category));
        return win;
    };

    bh.ui.createOptionsWindow = function() {
        var win = Ti.UI.createWindow({
            title: L('options'),
            barColor: '#000000',
            backgroundColor: '#CCCCCC'
        });
        
        // create table view
		var data = [
			{
				title: 'Cricket',
				hasCheck: true,
				file: Titanium.Media.createSound({sound:Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'sounds/cricket.wav')}),
				header: L('alarm sound')
			},
			{
				header: L('range'),
				title: '100 m.',
				hasCheck: true
			}
		];
		
		var tableViewOptions = {
			data: data,
			style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
			backgroundColor: 'transparent',
			rowBackgroundColor: 'white'
		};
		var tableview = Titanium.UI.createTableView(tableViewOptions);
        tableview.addEventListener('click', function(_e) {
            var rowSound = _e.rowData.file;
			if (rowSound) {
				rowSound.play();
			}
        });

		win.add(tableview);
        return win;
    };

    bh.ui.createAboutWindow = function() {
        var win = Ti.UI.createWindow({
            title : L('about'),
            barColor: '#000000',
			backgroundColor: '#000000',
            modal: true
        });
		
		var close = Titanium.UI.createButton({
            title : L('close')
        });

        close.addEventListener('click', function() {
            win.close();
        });

		win.setRightNavButton(close);

		var webview = Titanium.UI.createWebView({url:'/web/about.html'});
		win.add(webview);
        return win;
    };

    bh.ui.createAlarmsTableView = function() {
		var search = Titanium.UI.createSearchBar({
			backgroundColor: '#CCCCCC',
			barColor: '#CCCCCC'
		});
		
        var tv = Ti.UI.createTableView({
        	search: search,
            editable : true,
            allowsSelection : true,
            allowsSelectionDuringEditing : false
        });

        tv.addEventListener('delete', function(_e) {
            bh.db.deleteAlarm(_e.rowData.id);
            Ti.App.fireEvent('alarmsWindowUpdated');
        });

        tv.addEventListener('click', function(_e) {
        	if (_e.rowData.latitude && _e.rowData.longitude) {
		    	var eventObj = {
		    		success: true,
		    		latitude: _e.rowData.latitude,
		    		longitude: _e.rowData.longitude
		    	};
		    	Titanium.Geolocation.fireEvent('location', eventObj);
        	}
        });

        function populateData() {
            var results = bh.db.listAlarms();
            tv.setData(results);
        }
        
        Ti.App.addEventListener('browseWindowUpdated', populateData);
        populateData();
        return tv;
    };

    bh.ui.createCategoriesTableView = function() {
		var search = Titanium.UI.createSearchBar({
			backgroundColor: '#CCCCCC',
			barColor: '#CCCCCC'
		});

		// create table view
        var tv = Ti.UI.createTableView({
			search: search
		});

        tv.addEventListener('click', function(_e) {
            var rowId = _e.rowData.id;
			bh.ui.browseTab.open(bh.ui.createAreasWindow(rowId));
        });

        tv.setData(bh.db.listCategories());
        return tv;
    };

    bh.ui.createAreasTableView = function(_category) {
		var search = Titanium.UI.createSearchBar({
			backgroundColor: '#CCCCCC',
			barColor: '#CCCCCC'
		});

        var tv = Ti.UI.createTableView({
        	search: search
        });

        tv.addEventListener('click', function(_e) {
            var active = _e.row.hasCheck;
            if (active) {
                bh.db.deleteAlarm(_e.rowData.id);
            } else {
                bh.db.addAlarm(_e.rowData.id);
            }

            _e.row.hasCheck = !_e.row.hasCheck;            
			Ti.App.fireEvent('browseWindowUpdated');
        });

        function populateData() {
            var results = bh.db.listAreas(_category);
            tv.setData(results);
        }

		Ti.App.addEventListener('alarmsWindowUpdated', populateData);
        populateData();
        return tv;
    };

    bh.ui.createApplicationTabGroup = function() {
        var tabGroup = Titanium.UI.createTabGroup();
        bh.ui.tabGroup = tabGroup;

        var alarms = bh.ui.createAlarmsWindow();
        var browse = bh.ui.createCategoriesWindow();
        var options = bh.ui.createOptionsWindow();
        var map = bh.ui.createMapWindow();
        var custom = bh.ui.createMapCustomAlarmsWindow();

        bh.ui.alarmsTab = Titanium.UI.createTab({
            icon : 'images/icons/11-clock@2x.png',
            title : L('alarms'),
            window : alarms
        });

        bh.ui.browseTab = Titanium.UI.createTab({
            icon : 'images/icons/33-cabinet@2x.png',
            title : L('browse'),
            window : browse
        });

        bh.ui.optionsTab = Titanium.UI.createTab({
            icon : 'images/icons/106-sliders@2x.png',
            title : L('options'),
            window : options
        });

        bh.ui.mapTab = Titanium.UI.createTab({
            icon : 'images/icons/103-map@2x.png',
            title : L('map'),
            window : map
        });

        bh.ui.customTab = Titanium.UI.createTab({
            icon : 'images/icons/07-map-marker@2x.png',
            title : L('custom'),
            window : custom
        });

        tabGroup.addTab(bh.ui.alarmsTab);
        tabGroup.addTab(bh.ui.browseTab);
        // tabGroup.addTab(bh.ui.customTab);
        tabGroup.addTab(bh.ui.mapTab);
        tabGroup.addTab(bh.ui.optionsTab);

        return tabGroup;
    };
})();