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
    row.selectedBackgroundColor = '#fff';
    row.height = 75;
    row.className = 'datarow';
    row.clickName = 'row';
    row.hasChild = true;
    row.category = rows.fieldByName('id');
    
    var photo = Ti.UI.createView({
        backgroundImage:'../images/categories/' + rows.fieldByName('logo'),
        top:15,
        left:15,
        width:24,
        height:24,
        clickName:'photo'
    });
    row.add(photo);

    var user = Ti.UI.createLabel({
        color:'#576996',
        font:{fontSize:24,fontWeight:'bold', fontFamily:'Helvetica Neue'},
        left:43,
        top:16,
        height:24,
        width:200,
        clickName:'user',
        text:rows.fieldByName('name')
    });

    row.filter = user.text;
    row.add(user);

    var comment = Ti.UI.createLabel({
        color:'#222',
        font:{fontSize:16,fontWeight:'normal', fontFamily:'Helvetica Neue'},
        left:15,
        top:25,
        height:50,
        width:300,
        clickName:'comment',
        text:rows.fieldByName('description')
    });
    row.add(comment);
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
