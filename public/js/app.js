$(document).ready(function() {

	$.ajax({
		method: "GET",
		url: "http://localhost:3000/api/all"
	}).done(function(data){

		// var locations = [];
		// for(var key in data){
		// 	for(var i=0 ; i< data[key].length; i++){
		// 		data[key][i].place[0].location.unshift(data[key][i].name);
		// 		data[key][i].place[0].location.unshift(key);
		// 		locations.push(data[key][i].place[0].location);  
		// 	}
		// }

		// initMap(locations);


	});
	//var map = new MapCtrl();


});
//var map = new MapCtrl();
var dayCtrl = new DayCtrl();

