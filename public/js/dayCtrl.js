function Day(obj){
	if(obj){

	}else {
		this.hotel = {};
		this.restaurants = [];
		this.activities = [];
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
		}).bind(this));
	
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
			//console.log(data);
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
			}
			
		}).bind(this));
	},
	renderHotel: function(){
		var hotel = $('#it-hotel');
		hotel.html('');
		if(this.hotel.name) {
			var hotelHtml = $('<li class="list-group-item">'+this.hotel.name+'</li>');
			var hotelDelBtn = $('<i class="fa fa-times-circle fa-lg pull-right sub-red"></i>');
			hotelDelBtn.click(this.delHotel);
			hotelHtml.append(hotelDelBtn);
			hotel.append(hotelHtml);
		}
		
	},
	delHotel: function(){
		$('#it-hotel').html('');
		this.hotel={};
	},
	renderRestaurant: function(){
		var restaurants = $('#it-restaurants');
		restaurants.html('');
		var self = this;
		for(var i = 0; i< self.restaurants.length; i++){

			(function(restaurant){
				var restaurantsHtml = $('<li class="list-group-item" rest-name="'+restaurant.name+'">'+restaurant.name+'</li>');
				var restaurantDelBtn = $('<i class="fa fa-times-circle fa-lg pull-right sub-red"></i>');
				restaurantDelBtn.click(this.delRestaurant(restaurant.name));
				restaurantsHtml.append(restaurantDelBtn);
				restaurants.append(restaurantsHtml);
			}).call(self, self.restaurants[i]);
		}
	},
	delRestaurant: function(name){
		return (function(){
			$('li[rest-name="'+name+'"]').remove();
			var newRestList = this.restaurants.filter(function(restaurant){
				return restaurant.name !== name;
			});
			this.restaurants = newRestList;
			console.log(this);
		}).bind(this);
	},
	renderActivity: function(){
		var activities = $('#it-activities');
		activities.html('');
		var self = this;
		for(var i = 0; i< self.activities.length; i++){

			(function(activity){
				var activitiesHtml = $('<li class="list-group-item" act-name="'+activity.name+'">'+activity.name+'</li>');
				var activityDelBtn = $('<i class="fa fa-times-circle fa-lg pull-right sub-red"></i>');
				activityDelBtn.click(this.delActivity(activity.name));
				activitiesHtml.append(activityDelBtn);
				activities.append(activitiesHtml);
			}).call(self, self.activities[i]);
		}
	},
	delActivity: function(name){
		return (function(){
			$('li[act-name="'+name+'"]').remove();
			var newList = this.activities.filter(function(activity){
				return activity.name !== name;
			});
			this.activities = newList;
			console.log(this);
		}).bind(this);
	},
	renderAll: function(){
		this.renderHotel();
		this.renderRestaurant();
		this.renderActivity();
	}
};


function DayCtrl(){
	this.currentDay = {};
	this.currentNumber = 0;
	this.days = [];
	this.btns = [];
}

DayCtrl.prototype = {
	add: function(t){
		//remove existing active btn
		$('#day-ctrl .active').removeClass('active');
		//create current day object and push it to the list
		var newDay = new Day;
		this.days.push(newDay);

		//set current day to the new object
		this.currentDay = newDay;
		this.currentNumber = this.days.length;

		//calculate current day create current day btn and make it active
		var newBtn = $('<li><a class="btn-round active" href="javascript:void(0);" day-number="'+this.days.length+'">'+ this.days.length +'</a></li>');

		//add listening event to the button for setting current day object
		newBtn.click(this.getCurrent(newBtn));
		this.btns.push(newBtn);

		//prepend the new btn in front of the add btn
		$(t).parent().before(newBtn);

		//change current day sign
		this.setCurrent();

	},
	delete: function(){
		alert('Delete current day itinerary!');
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
		this.currentDay = this.days[num-1];
		this.currentDay.renderAll();

	},
	setBanner: function(num){
		$('#current-day-btn').html('');
		var currentDayInfo = $('<font>Day '+ num +'</font> ')
		$('#current-day-btn').append(currentDayInfo);
		var deleteBtn = $('<i class="fa fa-times-circle fa-lg sub-red"></i>');
		deleteBtn.click(this.delete);
		$('#current-day-btn').append(deleteBtn);
	}

};




