function Day(obj, map){
	this.map = new MapCtrl(map);
	if(obj){

	}else {
		this.hotel = {};
		this.restaurants = [];
		this.activities = [];
		this.allLocations = [];
	}


}

Day.prototype = {
	addHotel: function(){
		var hotelId = $('select#hotels').val();
		
		$.ajax({
			method: "GET",
			url: "http://localhost:3000/api/hotel/"+hotelId
		}).done((function(data){
			this.hotel = data;
			this.renderHotel(data);
			//have to remove existing marker first
			this.launchMap(data, 'hotel');
		}).bind(this));
	
	},
	launchMap: function(data, cat){
		var loc = $.extend([], data.place[0].location);
		loc.push(data.name);
		loc.push(cat);
		loc.push(data._id);
		this.map.createMarker(loc);
		this.map.showMarkers(loc);
	},
	addRestaurant: function(){
		var restaurantId = $('select#restaurants').val();

		$.ajax({
			method: "GET",
			url: "http://localhost:3000/api/restaurant/"+restaurantId
		}).done((function(data){
			//console.log(data);
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
					this.launchMap(data, 'restaurant');
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
				this.launchMap(data, 'activity');
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
			this.map.deleteMarker(['category', 'hotel']);
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
			this.map.deleteMarker(['_id', id]);
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
			this.map.deleteMarker(['_id', id])
		}).bind(this);
	},
	renderMap: function(){
		this.map.showMarkers();
	},
	renderAll: function(){
		this.renderHotel();
		this.renderRestaurant();
		this.renderActivity();
		this.renderMap();
	}
};


function DayCtrl(){
	this.currentDay = {};
	this.currentNumber = 0;
	//here you have to get data from the database, get all the days
	this.days = [];
	this.btns = [];

	var baseLatLng = {lat: 40.705137, lng: -74.007624};
	this.map = new google.maps.Map(document.getElementById('map-canvas'), {
        center: baseLatLng,
        zoom: 12
    });
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((function(position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            this.map.setCenter(pos);
            //var infoWindow = new google.maps.InfoWindow({map: map});
            //infoWindow.setPosition(pos);
            //infoWindow.setContent('Location found.');
        }).bind(this), function() {
            alert('Can find you location');
        });
    } else {
        alert('Browser doesn\'t support Geolocation');
    }

    if(this.days.length === 0 ){
		this.add();
	}
	
}

DayCtrl.prototype = {
	init: function(){
		this.currentDay = {};
		this.currentNumber = 0;
		//here you have to get data from the database, get all the days
		this.days = [];
		this.btns = [];
		if(this.days.length === 0 ){
			this.add();
		}
	},
	add: function(){
		
		//remove existing active btn
		$('#day-ctrl .active').removeClass('active');

		//create current day object and push it to the list
		var newDay = new Day(null, this.map);
		this.days.push(newDay);

		//set current day to the new object
		if(!$.isEmptyObject(this.currentDay)){
			this.currentDay.map.clearMarkers();
		}
		this.currentDay = newDay;
		this.currentNumber = this.days.length;

		//calculate current day create current day btn and make it active
		var newBtn = $('<li><a class="btn-round active" href="javascript:void(0);" day-number="'+this.days.length+'">'+ this.days.length +'</a></li>');

		//add listening event to the button for setting current day object
		newBtn.click(this.getCurrent(newBtn));

		this.btns.push(newBtn);

		//prepend the new btn in front of the add btn
		$('#add-day-btn').before(newBtn);

		//change current day sign
		this.setCurrent();

	},
	delete: function(self){
		return (function(){
			var toDelete = confirm('Are you sure to delete this day\'s plan?');
			if(toDelete){
				var num = $('#current-day-btn').attr('num');
				$('a[day-number="'+num+'"]').parent().remove();
				self.days[num-1].map.deleteMarkers();
				self.days.splice(num-1, 1);
				//console.log(self.days);
				self.btns.splice(num-1, 1);
				if(self.days.length === 0){
					self.init();
				}
				else {
					//reset the pagination
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
		for(var i=0; i<this.btns.length; i++){
			if(i === 0){
				this.btns[i].children('a').addClass('active');
			}
			this.btns[i].children('a').attr('day-number', i+1);
			this.btns[i].children('a').html(i+1);
			this.btns[i].click(this.getCurrent(this.btns[i]));
		}
	},
	sortBtns: function(){

	},
	getCurrent: function(t){
		return (function(){
			//this.setCurrent();
			this.currentNumber = $(t).find('a').attr('day-number');
			this.setCurrent();

		}).bind(this);
	},
	setCurrent: function(){
	  //alert(this.currentNumber);
	  $('#day-ctrl .active').removeClass('active');
	  $('a[day-number="'+this.currentNumber+'"]').addClass('active');
	  this.setBanner(this.currentNumber);
	  this.setDayObject(this.currentNumber);

	},
	setDayObject: function(num){
		//the previous day's markers need to be cleared
		this.currentDay.map.clearMarkers();
		//switch to the chosen day as current day
		this.currentDay = this.days[num-1];
		this.currentDay.renderAll();
	},
	setBanner: function(num){
		$('#current-day-btn').html('');
		$('#current-day-btn').attr('num', num);
		var currentDayInfo = $('<font>Day '+ num +'</font> ')
		$('#current-day-btn').append(currentDayInfo);
		var deleteBtn = $('<i class="fa fa-times-circle fa-lg sub-red"></i>');
		deleteBtn.click(this.delete(this));
		$('#current-day-btn').append(deleteBtn);
	}

};




