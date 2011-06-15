(function() {
	bh.db = {};

	// Bootstraps the database
	Ti.include('/library/bootstrap/db.js');

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
                leftImage: 'images/mini-icons/03-clock.png',
                //add actual db fields
                name: result.fieldByName('name')
            });
            result.next();
        }
        result.close(); //make sure to close the result set
        db.close();

        return alarmsList;
    };

    bh.db.addAlarm = function(_id) {
		var db = Ti.Database.open('FiveMinutesMoreDb');
		db.execute('INSERT INTO alarms(area_id) VALUES(?)', _id);
		db.close();

		//Dispatch a message to let others know the database has been updated
		Ti.App.fireEvent('databaseUpdated');
	};

	bh.db.deleteAlarm = function(_id, _notify) {
		var db = Ti.Database.open('FiveMinutesMoreDb');
		db.execute('DELETE FROM alarms WHERE area_id = ?', _id);
		db.close();

		//Dispatch a message to let others know the database has been updated
		if (_notify) {
			Ti.App.fireEvent('databaseUpdated');
		}
	};
	
	// Categories Package
    bh.db.listCategories = function() {
        var categoriesList = [];
        var db = Ti.Database.open('FiveMinutesMoreDb');
        var result = db.execute('SELECT * FROM categories');
        while (result.isValidRow()) {
            categoriesList.push({
                //add these attributes for the benefit of a table view
                title: result.fieldByName('name'),
                id: result.fieldByName('id'), //custom data attribute to pass to detail page
				leftImage: 'images/categories/' + result.fieldByName('logo'),
                hasChild: true,
                //add actual db fields
                name: result.fieldByName('name'),
                description: result.fieldByName('description'),
                logo: result.fieldByName('logo')
            });
            
            result.next();
        }
        result.close(); //make sure to close the result set
        db.close();
        
        return categoriesList;
    };

    bh.db.listFullCategories = function() {
        var categoriesList = [];
        var db = Ti.Database.open('FiveMinutesMoreDb');
        var result = db.execute('SELECT a.*, c.name as header, c.logo, c.description FROM categories c, area_category_link ac, areas a WHERE c.id = ac.category_id AND ac.area_id = a.id');
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
        
        // return categoriesList;
        return categoriesList;
    };

    // Areas Package
    bh.db.listAreas = function(_category) {
        var areasList = [];
        var db = Ti.Database.open('FiveMinutesMoreDb');
        var result = db.execute('SELECT * FROM areas a, area_category_link ac WHERE ac.area_id = a.id AND ac.category_id = ?', _category.id);
        while (result.isValidRow()) {
	        var checked = db.execute('SELECT COUNT(*) as num FROM alarms WHERE area_id = ?', result.fieldByName('id'));
	        var isChecked = checked.fieldByName('num');
	        
            areasList.push({
                //add these attributes for the benefit of a table view
                title: result.fieldByName('name'),
                id: result.fieldByName('id'), //custom data attribute to pass to detail page
                leftImage: 'images/categories/' + _category.logo,
                //add actual db fields
                name: result.fieldByName('name'),
                longitud: result.fieldByName('longitude'),
                latitude: result.fieldByName('latitude'),
                hasCheck: isChecked !== 0
                // Todo si está en el listado de alarmas hay que activarlo (hasCheck)
            });
            result.next();
        }
        result.close(); //make sure to close the result set
        db.close();
        
        return areasList;
    };

	// Options Package
})();