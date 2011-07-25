var Qpqp = {};

(function() {
    Qpqp.Math = {};
    Qpqp.Math.max = function(a, b) {
        return (a > b) ? a : b;
    };

    Qpqp.Math.min = function(a, b) {
        return (a > b) ? b : a;
    };
})();

(function() {
    Qpqp.String = {};
    Qpqp.String.join = function(a, separator, lastSeparator) {
        var text = [];
        var n = a.length;

        if (n == 1) {
            return a[0];
        }
        
        for(var i = 0; i < n - 1; i++) {
            text.push(a[i]);
        }

        return text.join(separator) + lastSeparator + a[n - 1];
    };
})();

(function() {
    Qpqp.Solr = {};
    Qpqp.Solr.Query = function() {
		//this.url = 'http://172.20.1.41:8081/solr_slaves/1_slave/select';
		this.url = 'http://' + hostSolr + ':8081/solr_slaves/1_slave/select';
		this.wt = 'json';
		this.qt = 'web_defecto';
		this.uq = '*:*';
		this.q = '*:*';
		this.fq = null;
		//this.fl = '*,score';
		this.rows = 10;
		this.start = 0;
		this.where = 'Barcelona';
		this.latlng = null;
		this.proximity = 10;
		this.sort = null;
		this.core = constantsCores.coreCourses;
		this.extraOptions = '';
		this.returnedDataType = 'json';

		if (params) {
			this.setParams(params);
		}
	    	
		this.setParams = function(params) {
			if (params) {
				if (params.url) { this.url = params.url; }
				if (params.wt) { this.wt = params.wt; }
				if (typeof params.qt != 'undefined')  { this.qt = params.qt; }
				if (params.fl) { this.fl = params.fl; }
				if (params.rows) { this.rows = params.rows; }
				if (typeof params.start != 'undefined') { this.start = params.start; }
				if (params.uq) { this.uq = params.uq; }
				if (params.where) { this.where = params.where; }
				if (params.latlng || params.latlng == null) { this.latlng = params.latlng; }
				if (typeof params.proximity != 'undefined') { this.proximity = params.proximity; }
				if (params.fq) { this.fq = params.fq; }
				if (params.sort && (params.sort.length > 0)) { this.sort = params.sort; }
				if (params.extraOptions) { this.extraOptions = params.extraOptions; }
				if (params.returnedDataType) { this.returnedDataType = params.returnedDataType; }
				if (params.core) { this.core = params.core; }
			}
		};
	
		this.buildUrlParams = function() {
			var str = 'wt=' + this.wt;
			if (this.qt) {
				str += '&qt='+ this.qt;
			}
			if (this.fl) { str += '&fl=' + this.fl; }
			//else { str+= '&fl=' + defaultFL(); }
			if (this.fq && (this.fq.length > 0)) { str += '&fq=' + this.fq; }
			if (this.sort && (this.sort.length > 0)) { str += '&sort=' + this.sort; }
			str += '&rows=' + this.rows;
			str += '&start=' + this.start;
			if (this.uq) {
				str += '&uq=' + this.uq;
			}
			else if (this.q) {
				str += '&q=' + this.q;
			}
			// If we have the 'where' parameter we use it. If not, if we have some coordinates then we use them directly
			if (this.where && (this.where.length > 0) && (this.where != ' ')) {
				str += '&geo.where=' + this.where;
				if (this.proximity && (this.proximity > 0)) { str += '&geo.proximity=' + this.proximity; }
			}
			else if (this.latlng) {
				str += '&lat=' + this.latlng.lat;
				str += '&long=' + this.latlng.lng;
				if (this.proximity && (this.proximity > 0)) { str += '&geo.proximity=' + this.proximity; }
			}
			if (this.extraOptions) {
				str += '&' + this.extraOptions;
			}
			return str;
		};
	
		this.setUserQuery = function(userQuery) {
			if (userQuery && (userQuery.length > 0)) {
				this.uq = userQuery;
			}
			else {
				this.uq = '*:*';
			}
		};
	
		this.clear = function() {
			//this.numFound = 0;
			//this.courses = new EmagCourseList();
			//this.installations = new EmagInstallationList();
			this.fq = null;
			this.sort = null;
		};
		
		this.clearWhere = function() {
			this.where = null;
			this.latlng = null;
		};
	
		// Do the query to solr
		this.doQuery = function(params) {
			//if (gdata.debug) { alert('Searching what ' + this.uq + ' where ' + this.where); }
			this.setParams(params);
			gdata.coreLastSearch = this.core; 
			//this.numFound = 0;
			if (gdata.debug) { alert(this.url + '\n' + this.buildUrlParams()); }
			$.ajax({
		        url: this.url,
		        //dataType: 'json',
		        dataType: this.returnedDataType ? this.returnedDataType : 'json',
		        cache: 'false',
		        data: this.buildUrlParams(),
		        success: function(data) {
					//if (gdata.debug) { alert('Search completed found ' + data.response.numFound); }
					if (gdata.coreLastSearch == constantsCores.coreOpinions) {
						if (gdata.debug) { alert('Search completed '); }
						var course = gdata.courses.getCourseByIdPuente(gdata.searchOpinions.idPuente);
						/*var docs = data.response.docs;					
						if (course) {
							course.opinions = new Array();
							for (var i=0 ; i<docs.length ; i++) {
								course.opinions.push(docs.opinion);
							}
						}*/
						if (course) {
							loadOpinionesCurso(data, course);
						}
						gdata.searchOpinionsFinished(gdata.searchOpinions.idPuente);
					}
					else {
						if (gdata.debug) { alert('Search completed found ' + data.response.numFound); }
						gdata.numFound = data.response.numFound;
						var docs = data.response.docs;
						for (var i=0; i < docs.length; i++) {
							var course = gdata.courses.add(data.response.docs[i]);
							gdata.installations.addCourse(course);
						}
						gdata.searchFinished();
					}
		        }
		    });
		};
    };
})();

(function() {
    Qpqp.Api = {};
    Qpqp.Api.log = function(object) {
        Titanium.API.log(JSON.stringify(object));
    };
})();

(function() {
    Qpqp.Map = {};

    Qpqp.Map.Player = function(locations, time) {
        var _locations = locations;
        var _time = time;
        var _internal = null;
        var _locationIndex = 0;
        var _locationsNumber = locations.length;
        
        this.start = function() {
            _interval = setInterval(function() {
                var location = _locations[_locationIndex];
                var eventObject = {
                    success: true,
                    coords: {
	                    longitude: location.longitude,
	                    latitude: location.latitude
                    }
                };
                
                _locationIndex = (_locationIndex + 1) % _locationsNumber;
                Qpqp.Api.log(eventObject);
                
                Titanium.Geolocation.fireEvent('location', eventObject);
            }, _time);
        };
        
        this.stop = function() {
            if (_interval != null) {
                clearInterval(_interval);
            }
        };

        this.reset = function() {
             _locationIndex = 0;
        };
    };
    
    Qpqp.Map.clickToCoordinates = function(x, y, zoom) {
        var efactor = Math.exp((0.5 - y / 256 / Math.pow(2, zoom)) * 4 * Math.PI);
        var latitude = Math.asin((efactor - 1) / (efactor + 1)) * 180 / Math.PI;
        if (latitude < -90.0) {
            latitude = -90.0;
        } else if (latitude > 90.0) {
            latitude = 90.0;
        }

        var longitude = ((x * 360) / (256 * Math.pow(2, zoom))) - 180;
        while (longitude > 180.0) { longitude -= 360.0; }
        while (longitude < -180.0) { longitude += 360.0; }

        return {
            latitude: latitude,
            longitude: longitude
        };
    };
    
    Qpqp.Map.getCenterRegion = function(locations) {
        var n = locations.length;
        
        if (n == 0) {
            return false;
        }
        
        var longitude = {
            max: parseFloat(locations[0].longitude),
            min: parseFloat(locations[0].longitude)
        };
        
        var latitude = {
            max: parseFloat(locations[0].latitude),
            min: parseFloat(locations[0].latitude)
        };
        
        for (var i = 0; i < n; i++) {
            if (locations[i].longitude && locations[i].latitude) {
                longitude.max = Qpqp.Math.max(longitude.max, parseFloat(locations[i].longitude));
                longitude.min = Qpqp.Math.min(longitude.min, parseFloat(locations[i].longitude));
                latitude.max = Qpqp.Math.max(latitude.max, parseFloat(locations[i].latitude));
                latitude.min = Qpqp.Math.min(latitude.min, parseFloat(locations[i].latitude));
            }
        }

        return {
            longitude: (longitude.max + longitude.min) / 2.0,
            latitude: (latitude.max + latitude.min) / 2.0,
            longitudeDelta: longitude.max - longitude.min + 0.001,
            latitudeDelta: latitude.max - latitude.min + 0.001
        };
    };
})();
