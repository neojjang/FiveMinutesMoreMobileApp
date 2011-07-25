(function() {
    bh.db = {};
    bh.db.LIST_ALL     = 0;
    bh.db.LIST_CLOSEST = 1;
    bh.db.LIST_ACTIVE  = 2;

    // Alarms Package
    bh.db.listAlarms = function() {
        return bh.db._iListAlarms(bh.db.LIST_ALL);
    };

    bh.db.listActiveAlarms = function(_latitude, _longitude) {
        return bh.db._iListAlarms(bh.db.LIST_ACTIVE, _latitude, _longitude);
    };

    bh.db.listClosestAlarms = function(_latitude, _longitude) {
        return bh.db._iListAlarms(bh.db.LIST_CLOSEST, _latitude, _longitude);
    };

    bh.db._iListAlarms = function(_mode, _latitude, _longitude) {
        var alarmsList = [];
        var db = Ti.Database.open('FiveMinutesMoreDb');
        var result = null;
        
        switch(_mode) {
            case bh.db.LIST_ALL:
                result = db.execute('SELECT ar.id, ar.name, ar.latitude, ar.longitude FROM alarms a, areas ar WHERE ar.id = a.area_id');
                break;
            case bh.db.LIST_CLOSEST:
                result = db.execute('SELECT ar.id, ar.name, ar.latitude, ar.longitude FROM alarms a, areas ar WHERE ar.id = a.area_id AND ar.latitude IS NOT NULL AND ar.longitude IS NOT NULL AND a.active = 1 ORDER BY ABS(ar.latitude - ?) ASC, ABS(ar.longitude - ?) ASC', _latitude, _longitude);
                break;
            case bh.db.LIST_ACTIVE:
                result = db.execute('SELECT ar.id, ar.name, ar.latitude, ar.longitude FROM alarms a, areas ar WHERE ar.id = a.area_id AND ar.latitude IS NOT NULL AND ar.longitude IS NOT NULL AND a.active = 1 AND ABS(ar.latitude - ?) <= 0.01 AND ABS(ar.longitude - ?) <= 0.01', _latitude, _longitude);
                break;
            default:
                return [];
        }
        
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
        result.close();
        db.close();

        return alarmsList;
    };

    bh.db.addAlarm = function(_id) {
        var db = Ti.Database.open('FiveMinutesMoreDb');
        db.execute('INSERT INTO alarms(area_id, active) VALUES(?, ?)', _id, 1);
        db.close();
    };

    bh.db.editAlarm = function(_id, _active) {
        var db = Ti.Database.open('FiveMinutesMoreDb');
        db.execute('UPDATE alarms SET active = ? WHERE area_id = ?', _active, _id);
        db.close();
    };

    bh.db.deleteAlarm = function(_id) {
        var db = Ti.Database.open('FiveMinutesMoreDb');
        db.execute('DELETE FROM alarms WHERE area_id = ?', _id);
        db.close();
    };

    bh.db._iListCategories = function(_categoryId) {
        var categoriesList = [];
        var db = Ti.Database.open('FiveMinutesMoreDb');
        var result = null;
        
        if (_categoryId == null) {
            result = db.execute('SELECT c.id, c.name, c.logo, c.description, c.parent_id FROM categories c WHERE c.id = c.parent_id');
        } else {
            result = db.execute('SELECT c.id, c.name, c.logo, c.description, c.parent_id FROM categories c WHERE c.parent_id = ?', _categoryId);
        }     
        
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
                parentId: result.fieldByName('parent_id'),
                hasChild: true
            };

            categoriesList.push(newObject);
            result.next();
        }
        result.close();
        db.close();
        
        return categoriesList;
    };

    bh.db.listCategories = function(_categoryId) {
    	if (_categoryId == null) {
    		_categoryId = 0;
    	}
        return bh.db._iListCategories(_categoryId);
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
                hasCheck: isChecked
            };

            areasList.push(newObject);
            result.next();
        }
        result.close();
        db.close();
        
        return areasList;
    };
})();