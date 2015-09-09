
    // function initialize_gmaps() {
    //     // initialize new google maps LatLng object
    //     var myLatlng = new google.maps.LatLng(40.705189,-74.009209);
    //     // set the map options hash
    //     var mapOptions = {
    //         center: myLatlng,
    //         zoom: 16,
    //         mapTypeId: google.maps.MapTypeId.ROADMAP
    //     };
    //     // get the maps div's HTML obj
    //     var map_canvas_obj = document.getElementById("map-canvas");
    //     // initialize a new Google Map with the options
    //     var map = new google.maps.Map(map_canvas_obj, mapOptions);
    //     // Add the marker to the map
    //     var marker = new google.maps.Marker({
    //         position: myLatlng,
    //         title:"Hello World!"
    //     });
    //     // Add the marker to the map by calling setMap()
    //     //marker.setMap(map);
    //     setMarkers(map);
    // }

    function initMap(locations) {
        var map = new google.maps.Map(document.getElementById('map-canvas'), {
            zoom: 13,
            center: {lat: 40.705137, lng: -74.007624}
        });

        setMarkers(map, locations);
    }


    function setMarkers(map, locations) {

    
        var hotels = {
            url: '../img/markers/free-map-marker-icon-blue-darker.png',
            size: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(20, 40)
        };

        var restaurants = {
            url: '../img/markers/free-map-marker-icon-orange.png',
            size: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(20, 40)
        };

        var activities = {
            url: '../img/markers/free-map-marker-icon-green.png',
            size: new google.maps.Size(40, 40),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(20, 40)
        };

        var image = {
            hotels: hotels,
            restaurants: restaurants,
            activities: activities
        }

        var shape = {
            coords: [1, 1, 1, 20, 18, 20, 18, 1],
            type: 'poly'
        };

        for (var i = 0; i < locations.length; i++) {
            var loc = locations[i];
            console.log(image);
            var marker = new google.maps.Marker({
                position: {lat: loc[2], lng: loc[3]},
                map: map,
                icon: image[loc[0]],
                shape: shape,
                title: loc[1],
                zIndex: 3
            });
        }
    }



    (function($){
        $(document).ready(function() {
            //initialize_gmaps();
            $.ajax({
              method: "GET",
              url: "http://localhost:3000/api/all"
            }).done(function(data){
                
                var locations = [];
                for(var key in data){
                    for(var i=0 ; i< data[key].length; i++){
                       data[key][i].place[0].location.unshift(data[key][i].name);
                       data[key][i].place[0].location.unshift(key);
                       locations.push(data[key][i].place[0].location);  
                    }
                }
                //console.log(locations);
                initMap(locations);

            });
            //console.log(tpHotels[0]);
            //initMap();
        });
    }(jQuery)); 

