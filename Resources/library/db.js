(function() {
	bh.db = {};
	bh.db._alarmsCategories = null;

	// Alarms Package
    bh.db.listAlarms = function() {
        var alarmsList = [];
        var db = Ti.Database.open('FiveMinutesMoreDb');
        var result = db.execute('SELECT * FROM alarms a, areas ar WHERE ar.id = a.area_id');
        while (result.isValidRow()) {
            alarmsList.push({
                //add these attributes for the benefit of a table view
                title: result.fieldByName('name'),
                id: result.fieldByName('id'), //custom data attribute to pass to detail page
                leftImage: 'images/areas/fgc.png',
                //add actual db fields
                name: result.fieldByName('name'),
                latitude: result.fieldByName('latitude'),
                longitude: result.fieldByName('longitude')
            });
            result.next();
        }
        result.close(); //make sure to close the result set
        db.close();

        return alarmsList;
    };

    bh.db.listActiveAlarms = function(_latitude, _longitude) {
        var alarmsList = [];
        var db = Ti.Database.open('FiveMinutesMoreDb');
        var result = db.execute('SELECT ar.id, ar.name, ar.latitude, ar.longitude FROM alarms a, areas ar WHERE ar.id = a.area_id AND ar.latitude IS NOT NULL AND ar.longitude IS NOT NULL AND ABS(ar.latitude - ?) <= 0.001 AND ABS(ar.longitude - ?) <= 0.001', _latitude, _longitude);
        while (result.isValidRow()) {
            alarmsList.push({
                //add these attributes for the benefit of a table view
                title: result.fieldByName('name'),
                id: result.fieldByName('id'),
                leftImage: 'images/areas/fgc.png',
                //add actual db fields
                name: result.fieldByName('name'),
                latitude: result.fieldByName('latitude'),
                longitude: result.fieldByName('longitude')
            });
            result.next();
        }
        result.close();
        db.close();

        return alarmsList;
    };

    bh.db.addAlarm = function(_id) {
		var db = Ti.Database.open('FiveMinutesMoreDb');
		db.execute('INSERT INTO alarms(area_id) VALUES(?)', _id);
		db.close();
	};

	bh.db.deleteAlarm = function(_id) {
		var db = Ti.Database.open('FiveMinutesMoreDb');
		db.execute('DELETE FROM alarms WHERE area_id = ?', _id);
		db.close();
	};

    bh.db.listFullCategories = function() {
        var categoriesList = [];
        var db = Ti.Database.open('FiveMinutesMoreDb');
        var result = db.execute('SELECT a.id, a.name, a.latitude, a.longitude, c.name as header, c.logo, c.description FROM categories c, area_category_link ac, areas a WHERE c.id = ac.category_id AND ac.area_id = a.id');
		var previousHeader = '';
		var currentHeader = '';
        while (result.isValidRow()) {
        	currentHeader = result.fieldByName('header');
        	var addHeader = currentHeader != previousHeader;
        	
	        var checked = db.execute('SELECT area_id FROM alarms WHERE area_id = ?', result.fieldByName('id'));
	        var isChecked = checked.isValidRow();
        	
        	var newObject = {
                //add these attributes for the benefit of a table view
                title: result.fieldByName('name'),
                id: result.fieldByName('id'), //custom data attribute to pass to detail page
				leftImage: 'images/categories/' + result.fieldByName('logo'),
                //add actual db fields
                name: result.fieldByName('name'),
                description: result.fieldByName('description'),
                logo: result.fieldByName('logo'),
                longitud: result.fieldByName('longitude'),
                latitude: result.fieldByName('latitude'),
                hasCheck: isChecked
            };

        	if (addHeader) {
        		newObject.header = currentHeader;
        		previousHeader = currentHeader;
        	}
            
            categoriesList.push(newObject);
            
            result.next();
        }
        result.close(); //make sure to close the result set
        db.close();
        
        return categoriesList;
    };
    
    bh.db.listCategories = function() {
        var categoriesList = [];
        var db = Ti.Database.open('FiveMinutesMoreDb');
        var result = db.execute('SELECT c.id, c.name, c.logo, c.description FROM categories c');
        while (result.isValidRow()) {
        	var newObject = {
                //add these attributes for the benefit of a table view
                title: result.fieldByName('name'),
                id: result.fieldByName('id'), //custom data attribute to pass to detail page
				leftImage: 'images/categories/' + result.fieldByName('logo'),
                //add actual db fields
                name: result.fieldByName('name'),
                description: result.fieldByName('description'),
                logo: result.fieldByName('logo'),
                hasChild: true
            };

            categoriesList.push(newObject);
            
            result.next();
        }
        result.close(); //make sure to close the result set
        db.close();
        
        // return categoriesList;
        return categoriesList;
    };

    bh.db.listAreas = function(_category) {
        var areasList = [];
        var db = Ti.Database.open('FiveMinutesMoreDb');
        var result = db.execute('SELECT a.name, c.logo, a.id FROM areas a, area_category_link ac, categories c WHERE ac.area_id = a.id AND ac.category_id = c.id AND c.id = ?', _category);
        while (result.isValidRow()) {
	        var checked = db.execute('SELECT area_id FROM alarms WHERE area_id = ?', result.fieldByName('id'));
	        var isChecked = checked.isValidRow();

        	var newObject = {
                //add these attributes for the benefit of a table view
                title: result.fieldByName('name'),
                id: result.fieldByName('id'), //custom data attribute to pass to detail page
				leftImage: 'images/categories/' + result.fieldByName('logo'),
                //add actual db fields
                name: result.fieldByName('name'),
                logo: result.fieldByName('logo'),
                hasCheck: isChecked,
                rightImage: isChecked ? 'images/mini-icons/03-clock.png' : ''
            };

            areasList.push(newObject);
            
            result.next();
        }
        result.close(); //make sure to close the result set
        db.close();
        
        return areasList;
    };
})();