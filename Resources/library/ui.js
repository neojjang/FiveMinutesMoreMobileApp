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

        var about = Titanium.UI.createButton({
            title : L('about'),
            style : Titanium.UI.iPhone.SystemButtonStyle.PLAIN
        });

        var edit = Titanium.UI.createButton({
            title : L('edit')
        });

        var cancel = Titanium.UI.createButton({
            title : L('cancel'),
            style : Titanium.UI.iPhone.SystemButtonStyle.DONE
        });

        edit.addEventListener('click', function() {
            win.setRightNavButton(cancel);
            tableView.editing = true;
        });

        cancel.addEventListener('click', function() {
            win.setRightNavButton(edit);
            tableView.editing = false;
        });

        win.add(tableView);
        win.setLeftNavButton(about);
        win.setRightNavButton(edit);

        return win;
    };

    bh.ui.createMapWindow = function() {
        var win = Titanium.UI.createWindow({
            title : L('map'),
            barColor: '#000000'
        });

		// Creates map view
		var mapView = Titanium.Map.createView({
			mapType: Titanium.Map.STANDARD_TYPE
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
						animate: false,
						leftButton: 'images/areas/fgc.png'
					});
					
					bh.ui.annotations.push(newAnnotation);
					mapView.addAnnotation(newAnnotation);
				}
			}
		}
		
        Ti.App.addEventListener('alarmsWindowUpdated', populateAnnotations);
        Ti.App.addEventListener('browseWindowUpdated', populateAnnotations);
		populateAnnotations();

        var center = Titanium.UI.createButton({
			style: Titanium.UI.iPhone.SystemButtonStyle.BORDERED,
			image: 'images/mini-icons/29-circle-out.png',
			width: 30,
			height: 30
		});
        
        center.addEventListener('click', function() {
			mapView.setLocation(Qpqp.Map.getCenterRegion(bh.ui.annotations));
        });
        
        win.setRightNavButton(center);
		win.add(mapView);
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
		var data = [
			{header: L('alarm sound'), title: 'Cricket', hasCheck: true},
			{header: L('range'), title: '100 m.', hasCheck: true}
		];
		
		var tableViewOptions = {
			data: data,
			style: Titanium.UI.iPhone.TableViewStyle.GROUPED,
			backgroundColor:'transparent',
			rowBackgroundColor:'white'
		};
		var tableview = Titanium.UI.createTableView(tableViewOptions);

		win.add(tableview);
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
            icon : 'images/icons/07-map-marker@2x.png',
            title : L('map'),
            window : map
        });

        tabGroup.addTab(bh.ui.alarmsTab);
        tabGroup.addTab(bh.ui.browseTab);
        tabGroup.addTab(bh.ui.mapTab);
        tabGroup.addTab(bh.ui.optionsTab);

        return tabGroup;
    };
})();