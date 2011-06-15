var win = Titanium.UI.currentWindow;

// create table view data object
var data = [];

var db = Titanium.Database.open('FiveMinutesMoreDb');
var rows = db.execute('SELECT id, name, description, logo, longitude, latitude FROM alarms a, areas ar WHERE a.area_id = ar.id');

while (rows.isValidRow())
{
    var row = Ti.UI.createTableViewRow();
    row.title = rows.fieldByName('name');

    data.push(row);
    rows.next();
}

rows.close();
db.close();

// create table view
var tableview = Titanium.UI.createTableView({
    data:data, 
    editable:true,
    moveable:true
});

// add table view to the window
Titanium.UI.currentWindow.add(tableview);

//
//create edit/cancel buttons for nav bar
//
var edit = Titanium.UI.createButton({
    title:'Edit'
});

var cancel = Titanium.UI.createButton({
    title:'Cancel',
    style:Titanium.UI.iPhone.SystemButtonStyle.DONE
});

var add = Titanium.UI.createButton({
    title:'Add'
});

edit.addEventListener('click', function()
{
    win.setLeftNavButton(cancel);
    tableview.editing = true;
});

cancel.addEventListener('click', function()
{
    win.setLeftNavButton(edit);
    tableview.editing = false;
});


add.addEventListener('click', function()
{
    var win = Titanium.UI.createWindow({
        url:'categories.js',
        title:'Lines'
    });
    Titanium.UI.currentTab.open(win,{animated:true});
});

win.setLeftNavButton(edit);
win.setRightNavButton(add);