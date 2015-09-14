
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

