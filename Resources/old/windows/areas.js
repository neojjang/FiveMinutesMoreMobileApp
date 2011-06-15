var win = Titanium.UI.currentWindow;
win.barColor = '#000000';

var tableView;
var data = [];

var db = Titanium.Database.open('FiveMinutesMoreDb');
var rows = db.execute('SELECT id, name, description, logo FROM areas a, area_category_link ac WHERE ac.area_id = a.id AND ac.category_id = ?', win.category);

while (rows.isValidRow())
{
    var row = Ti.UI.createTableViewRow();
    row.title = rows.fieldByName('name');
    row.hasCheck = false;
    row.area_id = rows.fieldByName('id');
    
    data.push(row);
    rows.next();
}

rows.close();
db.close();

// Create table view
tableView = Titanium.UI.createTableView({
    data:data
});

tableView.addEventListener('click', function(e)
{
    var db = Titanium.Database.open('FiveMinutesMoreDb');
    Ti.API.info(e.rowData.area_id);

    if (e.row.hasCheck) {
        db.execute('DELETE FROM alarms WHERE area_id = ?', e.rowData.area_id);
    } else {
        db.execute('INSERT INTO alarms(area_id) VALUES (?)', e.rowData.area_id);
    }
    e.row.hasCheck = !e.row.hasCheck;
});

win.add(tableView);
