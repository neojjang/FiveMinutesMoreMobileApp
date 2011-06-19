var bh = {};

// Database 
Ti.include('/library/db.js');

// Tools
Ti.include('library/qpqp.js');

var count = 0;
setInterval(function()
{
	Ti.API.log('Hello: ' + count);
	count++;

	Qpqp.Api.log(bh.db.listAlarms());
	// Access to 
}, 100);

