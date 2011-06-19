// bootstrap database
var db = Titanium.Database.open('FiveMinutesMoreDb');

// Categories Table
db.execute('INSERT INTO categories (id, name, description, logo) VALUES (?, ?, ?, ?)', 1, 'S1', 'Pl. Catalunya - Terrassa', 's1.gif');
db.execute('INSERT INTO categories (id, name, description, logo) VALUES (?, ?, ?, ?)', 2, 'S2', 'Pl. Catalunya  - Sabadell Rambla', 's2.gif');
db.execute('INSERT INTO categories (id, name, description, logo) VALUES (?, ?, ?, ?)', 5, 'S5', 'Pl. Catalunya - Sant Cugat / Rubí', 's5.gif');
db.execute('INSERT INTO categories (id, name, description, logo) VALUES (?, ?, ?, ?)', 6, 'S55', 'Pl. Catalunya - Universitat Autonoma', 's55.gif');
db.execute('INSERT INTO categories (id, name, description, logo) VALUES (?, ?, ?, ?)', 8, 'L6', 'Pl. Catalunya - Reina Elisenda', 'l6.gif');
db.execute('INSERT INTO categories (id, name, description, logo) VALUES (?, ?, ?, ?)', 9, 'L7', 'Pl. Catalunya - Av. Tibidabo', 'l7.gif');

// Areas Table
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)',  1, 'Pl. Catalunya', 41.3856, 2.1687);
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)',  2, 'Provença', 41.3928, 2.1580);
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)',  3, 'Gràcia', 41.3991, 2.1526);
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)',  4, 'Muntaner', 41.3985, 2.1424);
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)',  5, 'Sarrià', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)',  6, 'Peu del Funicular', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)',  7, 'Baixador de Vallvidrera', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)',  8, 'Les Planes', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)',  9, 'La Floresta', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 10, 'Valldoreix', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 11, 'Sant Cugat', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 12, 'Mira-sol', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 13, 'Hospital General', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 14, 'Rubí', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 15, 'Les Fonts', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 16, 'Terrassa - Rambla', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 17, 'Volpelleres', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 18, 'Sant Joan', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 19, 'Bellaterra', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 20, 'Universitat Autònoma', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 21, 'Sant Quirze', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 22, 'Sabadell - Estació', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 23, 'Sabadell - Rambla', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 24, 'Sant Gervasi', 41.4011, 2.1471);
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 25, 'La Bonanova', 41.3980, 2.1365);
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 26, 'Les Tres Torres', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 27, 'Reina Elisenda', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 28, 'Pl. Molina', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 29, 'Pàdua', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 30, 'El Putxet', '', '');
db.execute('INSERT INTO areas (id, name, latitude, longitude) VALUES (?, ?, ?, ?)', 31, 'Av. Tibidabo', '', '');

// S1
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1,  1);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1,  2);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1,  3);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1,  4);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1,  5);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1,  6);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1,  7);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1,  8);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1,  9);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1, 10);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1, 11);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1, 12);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1, 13);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1, 14);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1, 15);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 1, 16);

// S2
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2,  1);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2,  2);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2,  3);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2,  4);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2,  5);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2,  6);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2,  7);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2,  8);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2,  9);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2, 10);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2, 11);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2, 17);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2, 18);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2, 19);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2, 20);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2, 21);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2, 22);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 2, 23);

// S55
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6,  1);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6,  2);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6,  3);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6, 24);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6,  4);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6, 25);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6, 26);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6,  5);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6,  9);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6, 10);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6, 11);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6, 17);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6, 18);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6, 19);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 6, 20);

// S5
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5,  1);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5,  2);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5,  3);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5, 24);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5,  4);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5, 25);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5, 26);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5,  5);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5,  9);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5, 10);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5, 11);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5, 12);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5, 13);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 5, 14);

// L6
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 8,  1);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 8,  2);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 8,  3);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 8,  4);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 8,  5);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 8,  6);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 8,  7);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 8,  8);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 8,  27);

// L7
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 9,  1);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 9,  2);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 9,  3);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 9,  28);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 9,  29);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 9,  30);
db.execute('INSERT INTO area_category_link (category_id, area_id) VALUES(?,?)', 9,  31);

// Close connection
db.close();