// bootstrap database
var db = Titanium.Database.open('FiveMinutesMoreDb');

// Categories Table
db.execute('CREATE TABLE IF NOT EXISTS categories (id INTEGER, name TEXT, description TEXT, logo TEXT)');
db.execute('DELETE FROM categories');

// Areas Table
db.execute('CREATE TABLE IF NOT EXISTS areas (id INTEGER, name TEXT, latitude REAL, longitude REAL)');
db.execute('DELETE FROM areas');

// Link Table
db.execute('CREATE TABLE IF NOT EXISTS area_category_link (category_id INTEGER, area_id INTEGER)');
db.execute('DELETE FROM area_category_link');

// Alarms Table
db.execute('CREATE TABLE IF NOT EXISTS alarms (area_id INTEGER)');

// Close connection
db.close();