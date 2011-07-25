(function() {
    bh.ui = {};
    
    bh.ui.browseTab = null;
    bh.ui._annotations = [];
    
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

        function updateEditButton() {
            Qpqp.Api.log(tableView);
            if (tableView.data.length > 0) {
                win.setLeftNavButton(edit);
            } else {
                win.setLeftNavButton(null);
                tableView.editing = false;
            }
        }
        
        win.add(tableView);
        win.setRightNavButton(about);
        win.setLeftNavButton(edit);

        updateEditButton();
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
        
        function getAnnotations() {
            var annotations = [];
            var data = bh.db.listAlarms();
            for (var i = 0; i < data.length; i++) {
                if (data[i].latitude && data[i].longitude) {
                    var newAnnotation = Titanium.Map.createAnnotation({
                        latitude: data[i].latitude,
                        longitude: data[i].longitude,
                        title: data[i].name,
                        animate: true,
                        leftButton: 'images/areas/fgc.png'
                    });
                    annotations.push(newAnnotation);
                }
            }
            return annotations;
        }
        
        bh.ui._annotations = getAnnotations();
        
        var mapView = Titanium.Map.createView({
            mapType: Titanium.Map.STANDARD_TYPE,
            userLocation: true,
            regionFit: false,
            animate: true
        });

        function centerMap(e) {
            Qpqp.Api.log(e);
            if (e && !firstLoad) {
                return;
            }
            firstLoad = false;
            
            if (bh.ui._annotations.length > 0) {
                mapView.setLocation(Qpqp.Map.getCenterRegion(bh.ui._annotations));
            } else {
                mapView.setLocation({
                    latitude: bh.gps._location.latitude,
                    longitude: bh.gps._location.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                    animate: true
                });
            }
        }
        
        function populateAnnotations() {
            var annotations = getAnnotations();
            mapView.removeAllAnnotations();
            Qpqp.Api.log('Annotations removed');
            mapView.addAnnotations(annotations);
        }
        populateAnnotations();
        
        mapView.addEventListener('regionChanged', centerMap);

        Ti.App.addEventListener('alarmsWindowUpdated', populateAnnotations);
        Ti.App.addEventListener('browseWindowUpdated', populateAnnotations);
        
        var centerOnAlarms = Titanium.UI.createButton({
            title: L('center')
        });
        
        centerOnAlarms.addEventListener('click', function() {
            var location = Qpqp.Map.getCenterRegion(bh.ui._annotations);
            if (location) {
                mapView.setLocation(location);
            }
        });

        var centerOnLocation = Titanium.UI.createButton({
            title: L('location')
        });
        
        centerOnLocation.addEventListener('click', function() {
            Qpqp.Api.log('Centering on current location...');
            Qpqp.Api.log(bh.gps._location);
            if (bh.gps._location) {
                mapView.setLocation({
                    latitude: bh.gps._location.latitude,
                    longitude: bh.gps._location.longitude,
                    animate: true,
                    latitudeDelta:0.04,
                    longitudeDelta:0.04
                });
            }
        });

        /*
        mapView.addEventListener('click', function(e) {
            Qpqp.Api.log(Qpqp.Map.clickToCoordinates(e.));
        });
        */

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
            userLocation: false,
            region:{
                latitude:33.74511, longitude:-84.38993,
                latitudeDelta:0.5, longitudeDelta:0.5
            },
            regionFit: true,
            animate: true
        });
        
        win.add(mapView);
        return win;
    };

    bh.ui.createBrowseWindow = function(_category, _title) {
        var win = Ti.UI.createWindow({
            title: _title == null ? L('lines') : _title,
            barColor: '#000000'
        });
        
        win.add(bh.ui.createBrowseTableView(_category));
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
                file: Titanium.Media.createSound({
                    sound: Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, 'sounds/cricket.wav')
                }),
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
                    coords: {
                        latitude: _e.rowData.latitude,
                        longitude: _e.rowData.longitude
                    }
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

    bh.ui.createBrowseTableView = function(_category) {
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
            var rowCategoryId = _e.rowData.parentId;
            if (rowCategoryId != null) {
                // Clicked on a category
                 bh.ui.browseTab.open(bh.ui.createBrowseWindow(rowId, _e.rowData.title));
            } else {
                // Code for check and uncheck alarms
                // Clicked on an alarm
                 var active = _e.row.hasCheck;
                 if (active) {
                     bh.db.deleteAlarm(_e.rowData.id);
                 } else {
                     bh.db.addAlarm(_e.rowData.id);
                 }
     
                 _e.row.hasCheck = !_e.row.hasCheck;
                 Ti.App.fireEvent('browseWindowUpdated');
            }
        });

        function populateData() {
            var data = bh.db.listCategories(_category);
            var alarms = bh.db.listAreas(_category);
            for (var i = 0; i < alarms.length; i++) {
                data.push(alarms[i]);
            }
            tv.setData(data);
        }

        Ti.App.addEventListener('alarmsWindowUpdated', populateData);
        populateData();

        return tv;
    };

    bh.ui.createApplicationTabGroup = function() {
        var tabGroup = Titanium.UI.createTabGroup();

        var alarms = bh.ui.createAlarmsWindow();
        var browse = bh.ui.createBrowseWindow();
        var options = bh.ui.createOptionsWindow();
        var map = bh.ui.createMapWindow();
        var custom = bh.ui.createMapCustomAlarmsWindow();

        var alarmsTab = Titanium.UI.createTab({
            icon : 'images/icons/11-clock@2x.png',
            title : L('alarms'),
            window : alarms
        });

        bh.ui.browseTab = Titanium.UI.createTab({
            icon : 'images/icons/33-cabinet@2x.png',
            title : L('browse'),
            window : browse
        });

        var optionsTab = Titanium.UI.createTab({
            icon : 'images/icons/106-sliders@2x.png',
            title : L('options'),
            window : options
        });

        var mapTab = Titanium.UI.createTab({
            icon : 'images/icons/103-map@2x.png',
            title : L('map'),
            window : map
        });

        var customTab = Titanium.UI.createTab({
            icon : 'images/icons/07-map-marker@2x.png',
            title : L('custom'),
            window : custom
        });

        tabGroup.addTab(alarmsTab);
        tabGroup.addTab(bh.ui.browseTab);
        tabGroup.addTab(bh.ui.customTab);
        tabGroup.addTab(mapTab);
        tabGroup.addTab(optionsTab);

        return tabGroup;
    };
})();