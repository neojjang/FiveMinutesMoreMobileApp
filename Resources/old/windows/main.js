// Background
Titanium.UI.setBackgroundColor('#000');

// Tabs
var tabGroup = Titanium.UI.createTabGroup();

// Alarms tab
var win1 = Titanium.UI.createWindow({  
    url:'windows/alarms.js',
    title:'Alarms',
    backgroundColor:'#fff',
    barColor:'#000'
});

var tab1 = Titanium.UI.createTab({  
    icon:'images/icons/11-clock.png',
    title:'Alarms',
    window:win1
});

// Map Tab
var win2 = Titanium.UI.createWindow({  
    url:'windows/map.js',
    title:'Map',
    backgroundColor:'#fff'
});
var tab2 = Titanium.UI.createTab({  
    icon:'images/icons/07-map-marker.png',
    title:'Map',
    window:win2
});

// Options Tab
var win3 = Titanium.UI.createWindow({  
    url:'windows/options.js',
    title:'Options',
    backgroundColor:'#fff'
});

var tab3 = Titanium.UI.createTab({  
    icon:'images/icons/20-gear2.png',
    title:'Options',
    window:win2
});

// Manage Tabs
tabGroup.addTab(tab1);  
tabGroup.addTab(tab2);  
tabGroup.addTab(tab3);  

// open tab group
tabGroup.open();