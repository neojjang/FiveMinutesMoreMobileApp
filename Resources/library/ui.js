(function() {
    bh.ui = {};
    bh.ui.categoriesWindow = null;
    bh.ui.areasWindow = null;
    bh.ui.alarmsWindow = null;
    
    bh.ui.tabGroup = null;
    bh.ui.alarmsTab = null;
    
    bh.ui.createAlarmsWindow = function() {
        var win = Titanium.UI.createWindow({
            title : L('alarms')
        });

        var tableView = bh.ui.createAlarmsTableView();

        var add = Titanium.UI.createButton({
            title : L('add'),
            style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        });

        var edit = Titanium.UI.createButton({
            title : 'Edit'
        });

        var cancel = Titanium.UI.createButton({
            title : 'Cancel',
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
            title : L('map')
        });

		var annotations = [];
		var data = bh.db.listAlarms();
		for (var i = 0; i < data.length; i++) {
			Titanium.API.log(data[i].latitude);
			Titanium.API.log(data[i].longitude);
			
			annotations.push(Titanium.Map.createAnnotation({
				latitude: data[i].latitude,
				longitude: data[i].longitude,
				title: data[i].name,
				subtitle: 'Newton Campus, Chestnut Hill, MA',
				animate: true,
				leftButton: '../images/atlanta.jpg',
				image: '../images/boston_college.png'
			}));
		}
		
		var boston = {
			latitude: 41.3992,
			longitude: 2.1224,
			latitudeDelta: 0.010,
			longitudeDelta: 0.018
		};
		
		// Creates map view
		var mapview = Titanium.Map.createView({
			mapType: Titanium.Map.STANDARD_TYPE,
			region: boston,
			animate: true,
			regionFit: true,
			userLocation: false,
			annotations: annotations
		});
		
		win.add(mapview);
        return win;
    };

    bh.ui.createCategoriesWindow = function() {
        var win = Ti.UI.createWindow({
            title : L('lines')
        });
        
        var b = Titanium.UI.createButton({
            title : 'Close',
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

        // run initial query
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

		/*
        bh.ui.optionsTab = Titanium.UI.createTab({
            icon : 'images/icons/20-gear2@2x.png',
            title : L('options'),
            window : options
        });
        */
        
        tabGroup.addTab(bh.ui.alarmsTab);
        tabGroup.addTab(bh.ui.mapTab);
        // tabGroup.addTab(bh.ui.optionsTab);

        return tabGroup;
    };
})();