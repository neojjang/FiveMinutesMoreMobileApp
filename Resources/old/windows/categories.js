var win = Titanium.UI.currentWindow;
win.barColor = '#000000';

var tableView;
var data = [];

// create the rest of the rows
var db = Titanium.Database.open('FiveMinutesMoreDb');
var rows = db.execute('SELECT id, name, description, logo FROM categories');
while (rows.isValidRow())
{
    var row = Ti.UI.createTableViewRow();
    row.title = rows.fieldByName('name');
    row.category = rows.fieldByName('id');
    row.hasChild = true;
    data.push(row);
    rows.next();
}
rows.close();
db.close();

//
// create table view (
//
tableView = Titanium.UI.createTableView({
    data:data,
    backgroundColor:'white'
});

tableView.addEventListener('click', function(e)
{
    if (e.rowData.category)
    {
        var win = Titanium.UI.createWindow({
            url:'areas.js',
            title:'Stations'
        });
        win.category = e.rowData.category;
        Titanium.UI.currentTab.open(win,{animated:true});
    }
});

win.add(tableView);
