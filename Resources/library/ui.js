(function() {
    bh.ui = {};
    bh.ui.categoriesWindow = null;
    bh.ui.areasWindow = null;
    bh.ui.alarmsWindow = null;
    
    bh.ui.tabGroup = null;
    bh.ui.alarmsTab = null;
    bh.ui.mapView = null;
    
    bh.ui.createAlarmsWindow = function() {
        var win = Titanium.UI.createWindow({
            title : L('alarms'),
            barColor: '#000000'
        });

        var tableView = bh.ui.createAlarmsTableView();

        var add = Titanium.UI.createButton({
            title : L('add'),
            style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        });

        var edit = Titanium.UI.createButton({
            title : L('edit')
        });

        var cancel = Titanium.UI.createButton({
            title : L('cancel'),
            style : Titanium.UI.iPhone.SystemButtonStyle.DONE
        });

        add.addEventListener('click', function() {
            bh.ui.categoriesWindow = bh.ui.createCategoriesWindow();
            bh.ui.categoriesWindow.open({modal:true});
        });

        edit.addEventListener('click', function() {
            win.setLeftNavButton(cancel);
            win.setRightNavButton(null);
            tableView.editing = true;
        });

        cancel.addEventListener('click', function() {
            win.setRightNavButton(add);
            win.setLeftNavButton(edit);
            tableView.editing = false;
        });

        win.add(tableView);
        win.setLeftNavButton(edit);
        win.setRightNavButton(add);

        return win;
    };

    bh.ui.createMapWindow = function() {
        var win = Titanium.UI.createWindow({
            title : L('map'),
            barColor: '#000000'
        });
		
		var userRegion = {
			latitude: bh.coords.latitude,
			longitude: bh.coords.longitude,
			latitudeDelta: 0.01,
			longitudeDelta: 0.01
		};

		// Creates map view
		bh.ui.mapView = Titanium.Map.createView({
			mapType: Titanium.Map.STANDARD_TYPE,
			region: userRegion,
			animate: false,
			regionFit: false,
			userLocation: false
		});
		
		bh.ui.annotations = [];
				
		function populateAnnotations() {
			var data = bh.db.listAlarms();
			
			// Remove annotations
			bh.ui.mapView.removeAllAnnotations();
			bh.ui.annotations = [];

			for (var i = 0; i < data.length; i++) {
				if (data[i].latitude && data[i].longitude) {
					Titanium.API.log(data[i].latitude + ', ' + data[i].longitude);
					var newAnnotation = Titanium.Map.createAnnotation({
						latitude: data[i].latitude,
						longitude: data[i].longitude,
						title: data[i].name,
						animate: false,
						leftButton: 'images/areas/fgc.png'
					});
					
					bh.ui.annotations.push(newAnnotation);
					bh.ui.mapView.addAnnotation(newAnnotation);
				}
			}
		}
		
        Ti.App.addEventListener('databaseUpdatedNew', populateAnnotations);
		populateAnnotations();

        var center = Titanium.UI.createButton({
            title : L('center'),
            style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        });
        center.addEventListener('click', function() {
        	var localAnnotations = bh.ui.annotations;
        	localAnnotations.push({
        		latitude: bh.coords.latitude,
        		longitude: bh.coords.longitude	
    		});
			bh.ui.mapView.setLocation(Qpqp.Map.getCenterRegion(localAnnotations));
        });
        win.setRightNavButton(center);
		
		// Map Toolbar
		var flexSpace = Titanium.UI.createButton({
			systemButton:Titanium.UI.iPhone.SystemButton.FLEXIBLE_SPACE
		});

		var centerOnUser = Titanium.UI.createButton({
			style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
			image: 'images/symbols/30-circle-in.png'
		});
		
        centerOnUser.addEventListener('click', function() {
			bh.ui.mapView.setLocation(bh.coords);
        });

		var centerOnAnnotations = Titanium.UI.createButton({
			style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
			image: 'images/symbols/29-circle-out.png'
		});
		
        centerOnAnnotations.addEventListener('click', function() {
        	var localAnnotations = bh.ui.annotations;
        	localAnnotations.push({
        		latitude: bh.coords.latitude,
        		longitude: bh.coords.longitude	
    		});
			bh.ui.mapView.setLocation(Qpqp.Map.getCenterRegion(localAnnotations));
        });
		
		win.setToolbar([centerOnUser, centerOnAnnotations, flexSpace]);
		win.add(bh.ui.mapView);

        return win;
    };

    bh.ui.createCategoriesWindow = function() {
        var win = Ti.UI.createWindow({
            title : L('lines'),
            barColor: '#000000'
        });
        
        var b = Titanium.UI.createButton({
            title : L('close'),
            style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        });
        b.addEventListener('click', function() {
            win.close();
        });
        win.setRightNavButton(b);

        win.add(bh.ui.createCategoriesTableView());
        return win;
    };

    bh.ui.createAlarmsTableView = function() {
        var tv = Ti.UI.createTableView({
            editable : true,
            allowsSelection : false,
            allowsSelectionDuringEditing : false
        });

        tv.addEventListener('delete', function(_e) {
            // Delete the alarm
            bh.db.deleteAlarm(_e.rowData.id, false);
        });

        function populateData() {
            var results = bh.db.listAlarms();
            tv.setData(results);
        }
        Ti.App.addEventListener('databaseUpdated', populateData);

        populateData();

        return tv;
    };

    bh.ui.createCategoriesTableView = function() {
		var search = Titanium.UI.createSearchBar();

		// create table view
        var tv = Ti.UI.createTableView({
			search:search
		});

        tv.addEventListener('click', function(_e) {
            // Execute delete or save
            var active = _e.row.hasCheck;
            if (active) {
                bh.db.deleteAlarm(_e.rowData.id, true);
            } else {
                bh.db.addAlarm(_e.rowData.id);
            }
			_e.row.hasCheck = !_e.row.hasCheck;
            
            var sections = tv.data;
            var rowId = _e.rowData.id;

            for (var i = 0; i < sections.length; i++) {
				var section = sections[i];
			 
			    for(var j = 0; j < section.rowCount; j++) {
					if (section.rows[j].id == rowId) {
						section.rows[j].hasCheck = !active;
					}
			    }
            }
        });

        function populateData() {
            var results = bh.db.listFullCategories();
            tv.setData(results);
        }

        // run initial query
        populateData();

        return tv;
    };

    bh.ui.createAreasTableView = function(_category) {
        var tv = Ti.UI.createTableView();

        tv.addEventListener('click', function(_e) {
            // Execute delete or save
            var active = _e.row.hasCheck;
            if (active) {
                bh.db.deleteAlarm(_e.rowData.id, true);
            } else {
                bh.db.addAlarm(_e.rowData.id);
            }
            _e.row.hasCheck = !_e.row.hasCheck;
        });

        function populateData() {
            var results = bh.db.listAreas(_category);
            tv.setData(results);
        }

        // run initial query
        populateData();

        return tv;
    };

    bh.ui.createApplicationTabGroup = function() {
        var tabGroup = Titanium.UI.createTabGroup();
        bh.ui.tabGroup = tabGroup;

        var alarms = bh.ui.createAlarmsWindow();
        var map = bh.ui.createMapWindow();
        // var options = bh.ui.createAlarmsWindow();

        bh.ui.alarmsTab = Titanium.UI.createTab({
            icon : 'images/icons/11-clock@2x.png',
            title : L('alarms'),
            window : alarms
        });

        bh.ui.mapTab = Titanium.UI.createTab({
            icon : 'images/icons/07-map-marker@2x.png',
            title : L('map'),
            window : map
        });

        tabGroup.addTab(bh.ui.alarmsTab);
        tabGroup.addTab(bh.ui.mapTab);

        return tabGroup;
    };
})();