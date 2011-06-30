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

		/*
        var add = Titanium.UI.createButton({
            title : L('add'),
            style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        });
		*/

        var edit = Titanium.UI.createButton({
            title : L('edit')
        });

        var cancel = Titanium.UI.createButton({
            title : L('cancel'),
            style : Titanium.UI.iPhone.SystemButtonStyle.DONE
        });

		/*
        add.addEventListener('click', function() {
            bh.ui.categoriesWindow = bh.ui.createFullCategoriesWindow();
            bh.ui.categoriesWindow.open({modal:true});
        });
        */

        edit.addEventListener('click', function() {
            win.setRightNavButton(cancel);
            tableView.editing = true;
        });

        cancel.addEventListener('click', function() {
            win.setRightNavButton(edit);
            tableView.editing = false;
        });

        win.add(tableView);
        win.setRightNavButton(edit);

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
			animate: true,
			regionFit: true,
			userLocation: true
		});
		
		bh.ui.mapView.setLocation({
			latitude: bh.coords.latitude,
			longitude: bh.coords.longitude
		});
		
		bh.ui.annotations = [];
				
		function populateAnnotations() {
			var data = bh.db.listAlarms();
			
			// Remove annotations
			bh.ui.mapView.removeAllAnnotations();
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
					bh.ui.mapView.addAnnotation(newAnnotation);
				}
			}
		}
		
        Ti.App.addEventListener('databaseUpdatedNew', populateAnnotations);
		populateAnnotations();

		var locationCallback = function(e)
		{
			Ti.API.info("Location event raised: ");
			if (!e.success || e.error)
			{
				Ti.API.info("Code translation: ");
				return;
			}
			
			var region = {
	            latitude: e.coords.latitude,
	            longitude: e.coords.longitude,
	            animate: true,
	            latitudeDelta: 0.001,
	            longitudeDelta: 0.001
	        };
        
			bh.ui.mapView.setLocation(region);
		};
		Titanium.Geolocation.addEventListener('location', locationCallback);

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
			image: 'images/mini-icons/30-circle-in.png',
			width: 30,
			height: 30
		});
		
        centerOnUser.addEventListener('click', function() {
			bh.ui.mapView.setLocation(bh.coords);
        });

		var centerOnAnnotations = Titanium.UI.createButton({
			style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
			image: 'images/mini-icons/29-circle-out.png',
			width: 30,
			height: 30
		});
		
        centerOnAnnotations.addEventListener('click', function() {
        	var localAnnotations = bh.ui.annotations;
        	localAnnotations.push({
        		latitude: bh.coords.latitude,
        		longitude: bh.coords.longitude	
    		});
			bh.ui.mapView.setLocation(Qpqp.Map.getCenterRegion(localAnnotations));
        });
		
		win.setToolbar([centerOnUser, centerOnAnnotations]);
		win.add(bh.ui.mapView);

        return win;
    };

    bh.ui.createFullCategoriesWindow = function() {
        var win = Ti.UI.createWindow({
            title : L('stops'),
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

        win.add(bh.ui.createFullCategoriesTableView());
        return win;
    };

    bh.ui.createCategoriesWindow = function() {
        var win = Ti.UI.createWindow({
            title : L('lines'),
            barColor: '#000000'
        });
        
        win.add(bh.ui.createCategoriesTableView());
        return win;
    };

    bh.ui.createAreasWindow = function(_category) {
        var win = Ti.UI.createWindow({
            title : L('stops'),
            barColor: '#000000'
        });
        
        win.add(bh.ui.createAreasTableView(_category));
        return win;
    };

    bh.ui.createOptionsWindow = function() {
        var win = Ti.UI.createWindow({
            title : L('options'),
            barColor: '#000000',
            backgroundColor: '#CCCCCC'
        });
        
        // create table view
		var soundsData = [{
			title: 'Cricket',
			hasCheck: true
		}];
		
		var tableViewOptions = {
			data: soundsData,
			style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
			headerTitle: L('alarm sound'),
			backgroundColor:'transparent',
			rowBackgroundColor:'white'
		};
		var soundsTableview = Titanium.UI.createTableView(tableViewOptions);

		var rangeData = [{
			title: '100 m.',
			hasCheck: true
		}];
		tableViewOptions = {
			data: rangeData,
			style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
			headerTitle: L('range'),
			backgroundColor:'transparent',
			rowBackgroundColor:'white'
		};
		var rangeTableview = Titanium.UI.createTableView(tableViewOptions);

		win.add(soundsTableview);
		win.add(rangeTableview);
        return win;
    };

    bh.ui.createAlarmsTableView = function() {
		var search = Titanium.UI.createSearchBar({
			barColor: '#CCCCCC'
		});
        var tv = Ti.UI.createTableView({
        	search: search,
            editable : true,
            allowsSelection : false,
            allowsSelectionDuringEditing : false
        });

        tv.addEventListener('delete', function(_e) {
            bh.db.deleteAlarm(_e.rowData.id);
            Ti.App.fireEvent('alarmsWindowUpdated');
        });

        function populateData() {
            var results = bh.db.listAlarms();
            tv.setData(results);
        }
        Ti.App.addEventListener('browseWindowUpdated', populateData);

        populateData();

        return tv;
    };

	/*
    bh.ui.createFullCategoriesTableView = function() {
		var search = Titanium.UI.createSearchBar();

		// create table view
        var tv = Ti.UI.createTableView({
			search: search
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

        tv.setData(bh.db.listFullCategories());
        return tv;
    };
    */

    bh.ui.createCategoriesTableView = function() {
		var search = Titanium.UI.createSearchBar({
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
			barColor: '#CCCCCC'
		});

        var tv = Ti.UI.createTableView({
        	search: search
        });

        tv.addEventListener('click', function(_e) {
            // Execute delete or save
            var active = _e.row.hasCheck;
            if (active) {
                bh.db.deleteAlarm(_e.rowData.id);
            } else {
                bh.db.addAlarm(_e.rowData.id);
            }
			Ti.App.fireEvent('browseWindowUpdated');

            _e.row.hasCheck = !_e.row.hasCheck;            
            if (_e.row.hasCheck) {
	            _e.row.rightImage = 'images/mini-icons/03-clock.png';
            } else {
	            _e.row.rightImage = '';
            }
        });

        function populateData() {
            var results = bh.db.listAreas(_category);
            tv.setData(results);
        }


		Ti.App.addEventListener('alarmsWindowUpdated', populateData);
        // run initial query
        populateData();

        return tv;
    };

    bh.ui.createApplicationTabGroup = function() {
        var tabGroup = Titanium.UI.createTabGroup();
        bh.ui.tabGroup = tabGroup;

        var alarms = bh.ui.createAlarmsWindow();
        var browse = bh.ui.createCategoriesWindow();
        var options = bh.ui.createOptionsWindow();
        // var map = bh.ui.createMapWindow();

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

		/*
        bh.ui.mapTab = Titanium.UI.createTab({
            icon : 'images/icons/07-map-marker@2x.png',
            title : L('map'),
            window : map
        });
        */

        tabGroup.addTab(bh.ui.alarmsTab);
        tabGroup.addTab(bh.ui.browseTab);
        tabGroup.addTab(bh.ui.optionsTab);
        // tabGroup.addTab(bh.ui.mapTab);

        return tabGroup;
    };
})();