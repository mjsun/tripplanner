function Day(dayCtrl){
	this.hotel = {};
	this.restaurants = [];
	this.activities = [];
	this.markers = [];
	this.dayCtrl = dayCtrl;
}

Day.prototype = {
    image: {
    	hotel: {
	        url: '../img/markers/free-map-marker-icon-blue-darker.png',
	        size: new google.maps.Size(40, 40),
	        origin: new google.maps.Point(0, 0),
	        anchor: new google.maps.Point(20, 40)
	    },
        restaurant: {
	        url: '../img/markers/free-map-marker-icon-orange.png',
	        size: new google.maps.Size(40, 40),
	        origin: new google.maps.Point(0, 0),
	        anchor: new google.maps.Point(20, 40)
	    },
        activity: {
	        url: '../img/markers/free-map-marker-icon-green.png',
	        size: new google.maps.Size(40, 40),
	        origin: new google.maps.Point(0, 0),
	        anchor: new google.maps.Point(20, 40)
	    }
    },
	createMarkers: function(loc){
       if(loc[3] === 'hotel'){ 
            this.deleteMarker(['category', 'hotel'])
        }
        var marker = new google.maps.Marker({
            position: {lat: loc[0], lng: loc[1]},
            //map: this.dayCtrl.map,
            icon: this.image[loc[3]],
            title: loc[2],
            zIndex: 3
        });
        marker.category = loc[3];
        marker._id = loc[4];
        this.markers.push(marker);
	},
	deleteMarker: function(arr){
		for(var i=0; i<this.markers.length; i++){
            if(this.markers[i][arr[0]] === arr[1]){
            	this.markers[i].setMap(null);
                this.markers.splice(i,1);
            }
        }
	},
	deleteMarkers: function() {
		this.clearMarkers();
        this.markers = [];
    },
    clearMarkers: function() {
        this._setMapOnAllMarkers(null);
    },
    _setMapOnAllMarkers: function(map) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    },
    showMarkers: function() {
        this._setMapOnAllMarkers(this.dayCtrl.map);
    },
	addHotel: function(){
		var hotelId = $('select#hotels').val();
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/api/hotel/"+hotelId
		}).done((function(data){
			this.hotel = data;
			this.renderHotel(data);
			var loc = $.extend([],data.place[0].location);
			loc.push(data.name);
			loc.push('hotel');
			loc.push(data._id);
			this.createMarkers(loc);
			this.dayCtrl.renderMap();
		}).bind(this));
	
	},
	addRestaurant: function(){
		var restaurantId = $('select#restaurants').val();

		$.ajax({
			method: "GET",
			url: "http://localhost:3000/api/restaurant/"+restaurantId
		}).done((function(data){
			if(this.restaurants.length === 3){
				alert('You have reach maximun restaurants for this day!')
			} else {

				var hasIt = false;
				for(var i = 0 ; i< this.restaurants.length; i++){
					if(this.restaurants[i]._id === data._id){
						alert('You have added restaurant '+ data.name);
						hasIt = true;
					}
				}
				if(!hasIt){
					this.restaurants.push(data);
					this.renderRestaurant(data);
					var loc = $.extend([],data.place[0].location);
					loc.push(data.name);
					loc.push('restaurant');
					loc.push(data._id);
					this.createMarkers(loc);
					this.dayCtrl.renderMap();
				}
			}
			
			
		}).bind(this));

	},
	addActivity: function(){
		var activityId = $('select#activities').val();

		$.ajax({
			method: "GET",
			url: "http://localhost:3000/api/activity/"+activityId
		}).done((function(data){
			var hasIt = false;
			for(var i = 0 ; i< this.activities.length; i++){
				if(this.activities[i]._id === data._id){
					alert('You have added activity '+data.name);
					hasIt = true;
				}
			}
			if(!hasIt){
				this.activities.push(data);
				this.renderActivity(data);
				var loc = $.extend([],data.place[0].location);
				loc.push(data.name);
				loc.push('activity');
				loc.push(data._id);
				this.createMarkers(loc);
				this.dayCtrl.renderMap();
			}
			
		}).bind(this));
	},
	renderHotel: function(){
		var hotel = $('#it-hotel');
		hotel.html('');
		if(this.hotel.name) {
			var hotelHtml = $('<li class="list-group-item">'+this.hotel.name+'</li>');
			var hotelDelBtn = $('<i class="fa fa-times-circle fa-lg pull-right sub-red"></i>');
			hotelDelBtn.click(this.delHotel());
			hotelHtml.append(hotelDelBtn);
			hotel.append(hotelHtml);
		}
		
	},
	delHotel: function(){
		return (function(){
			$('#it-hotel').html('');
			this.hotel={};
			this.deleteMarker(['category', 'hotel']);
			this.dayCtrl.renderMap();
		}).bind(this);
	},
	renderRestaurant: function(){
		var restaurants = $('#it-restaurants');
		restaurants.html('');
		var self = this;
		for(var i = 0; i< self.restaurants.length; i++){

			(function(restaurant){
				var restaurantsHtml = $('<li class="list-group-item" rest-id="'+restaurant._id+'">'+restaurant.name+'</li>');
				var restaurantDelBtn = $('<i class="fa fa-times-circle fa-lg pull-right sub-red"></i>');
				console.log(restaurant._id);
				restaurantDelBtn.click(this.delRestaurant(restaurant._id));
				restaurantsHtml.append(restaurantDelBtn);
				restaurants.append(restaurantsHtml);
			}).call(self, self.restaurants[i]);
		}
	},
	delRestaurant: function(id){
		return (function(){
			$('li[rest-id="'+id+'"]').remove();
			var newRestList = this.restaurants.filter(function(restaurant){
				return restaurant._id !== id;
			});
			this.restaurants = newRestList;
			this.deleteMarker(['_id', id]);
			this.dayCtrl.renderMap();
		}).bind(this);
	},
	renderActivity: function(){
		var activities = $('#it-activities');
		activities.html('');
		var self = this;
		for(var i = 0; i< self.activities.length; i++){

			(function(activity){
				var activitiesHtml = $('<li class="list-group-item" act-id="'+activity._id+'">'+activity.name+'</li>');
				var activityDelBtn = $('<i class="fa fa-times-circle fa-lg pull-right sub-red"></i>');
				activityDelBtn.click(this.delActivity(activity._id));
				console.log(activity._id);
				activitiesHtml.append(activityDelBtn);
				activities.append(activitiesHtml);
			}).call(self, self.activities[i]);
		}
	},
	delActivity: function(id){
		return (function(){
			$('li[act-id="'+id+'"]').remove();
			var newList = this.activities.filter(function(activity){
				return activity._id !== id;
			});
			this.activities = newList;
			this.deleteMarker(['_id', id]);
			this.dayCtrl.renderMap();
		}).bind(this);
	},
	renderAll: function(){
		this.renderHotel();
		this.renderRestaurant();
		this.renderActivity();
	}
};


function DayCtrl(){
	var baseLatLng = {lat: 40.705137, lng: -74.007624};
	this.map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: baseLatLng,
        zoom: 12
    });
 	if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((function(position) {
            this.currentPos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            this.init();
        }).bind(this), function() {
            alert('Can find you location');
        });
    } else {
        alert('Browser doesn\'t support Geolocation');
    }

}

DayCtrl.prototype = {
	init: function(){
		this.map.setCenter(this.currentPos, 12);

		this.currentDay = {};
		this.currentNumber = 0;
		this.days = [];
		this.dayButtons = [];

	    if(this.days.length === 0 ){
			this.add();
		}
	},
	add: function(){

		var newDay = new Day(this);
		this.days.push(newDay);
		this.currentNumber = this.days.length;

		var newDayBtn = $('<li><a class="btn-round active" href="javascript:void(0);" day-number="'+this.days.length+'">'+ this.days.length +'</a></li>');
		newDayBtn.click(this._setAsCurrentDay(newDayBtn));
		this.dayButtons.push(newDayBtn);

		$('#add-day-btn').before(newDayBtn);
		this.setCurrent();

	},
	delete: function(self){
		return (function(){
			var toDelete = confirm('Are you sure to delete this day\'s plan?');
			if(toDelete){
				var num = $('#current-day-btn').attr('num');
				$('a[day-number="'+num+'"]').parent().remove();
				self.days[num-1].deleteMarkers();
				self.days.splice(num-1, 1);
				self.dayButtons.splice(num-1, 1);

				if(self.days.length === 0){
					self.init();
				}
				else {
					self.resetPager();
					self.currentDay = self.days[0];
					self.currentNumber = 1;
					self.setCurrent();
				}
			}
			
		});

	},
	resetPager: function(){
		$('day-ctrl').html('');
		for(var i=0; i<this.dayButtons.length; i++){
			if(i === 0){
				this.dayButtons[i].children('a').addClass('active');
			}
			this.dayButtons[i].children('a').attr('day-number', i+1);
			this.dayButtons[i].children('a').html(i+1);
			this.dayButtons[i].click(this._setAsCurrentDay(this.dayButtons[i]));
		}
	},
	_setAsCurrentDay: function(t){
		return (function(){
			this.currentNumber = $(t).find('a').attr('day-number');
			this.setCurrent();

		}).bind(this);
	},
	setCurrent: function(){
	  $('#day-ctrl .active').removeClass('active');
	  $('a[day-number="'+this.currentNumber+'"]').addClass('active');
	  this.setBanner();
	  this.setDayObject();
	},
	setDayObject: function(){
		if(!$.isEmptyObject(this.currentDay)){
			this.currentDay.clearMarkers();
		}
		this.currentDay = this.days[this.currentNumber-1];
		this.currentDay.renderAll();
		this.renderMap();
	},
	setBanner: function(){
		$('#current-day-btn').html('');
		$('#current-day-btn').attr('num', this.currentNumber);
		var currentDayInfo = $('<font>Day '+ this.currentNumber +'</font> ')
		$('#current-day-btn').append(currentDayInfo);
		var deleteBtn = $('<i class="fa fa-times-circle fa-lg sub-red"></i>');
		deleteBtn.click(this.delete(this));
		$('#current-day-btn').append(deleteBtn);
	},
	_setMapWithBounds: function(){
		var bounds = new google.maps.LatLngBounds();
		for (var i = 0; i < this.currentDay.markers.length; i++) {
            bounds.extend(this.currentDay.markers[i].getPosition());
        }
        this.map.fitBounds(bounds);
        this.currentDay.showMarkers();
	},
	_setMapDefault: function(){
		this.map.setCenter(this.currentPos, 12);
	},
	renderMap: function(){
		if(this.currentDay.markers.length === 0){
			this._setMapDefault();
		} else {
			this._setMapWithBounds();
		}
	}
};




