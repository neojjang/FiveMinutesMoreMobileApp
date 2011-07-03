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
		var _mthis = this;
		var _locationIndex = 0;
		var _locationsNumber = locations.length;
		
		this.start = function() {
			_mthis._interval = setInterval(function() {
				var index = _mthis._locationIndex;
				var location = _locations[index];
				var eventObject = {
					longitude: location.longitude,
					latitude: location.latitude,
					longitudeDelta: 0.01,
					latitudeDelta: 0.01
				};
				_mthis.locationIndex = (_mthis.locationIndex + 1) % _mthis.locationsNumber;
				Qpqp.Api.log(eventObject);
				
				Titanium.Geolocation.fireEvent('location', eventObject);				
			}, _mthis._time);
		};
		
		this.stop = function() {
			if (_mthis._interval != null) {
				clearInterval(_mthis._interval);
			}
		};

		this.reset = function() {
			 _mthis.locationIndex = 0;
		};
		
		return _mthis;
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
