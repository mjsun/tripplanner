function MapCtrl(map){
    
    this.map = map;

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
    this.image = {
        hotel: hotels,
        restaurant: restaurants,
        activity: activities
    }
    this.markers = [];
}

MapCtrl.prototype = {
    createMarker: function(loc){
        //console.log(loc);
        if(loc[3] === 'hotel'){ 
            this.deleteMarker(['category', 'hotel'])
        }
        var marker = new google.maps.Marker({
            position: {lat: loc[0], lng: loc[1]},
            map: this.map,
            icon: this.image[loc[3]],
            title: loc[2],
            zIndex: 3
        });
        marker.category = loc[3];
        marker._id = loc[4];
        this.markers.push(marker);
    },
    _setMapOnAll: function(map) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    },
    showMarkers: function() {
        //console.log(this.map);
        this._setMapOnAll(this.map);
    },
    deleteMarker: function(arr){
        for(var i=0; i<this.markers.length; i++){
            if(this.markers[i][arr[0]] === arr[1]){
                this.markers[i].setMap(null);
                this.markers.splice(i,1);
            }
        }
    },
    clearMarkers: function() {
        this._setMapOnAll(null);
    },
    deleteMarkers: function() {
        this.clearMarkers();
        this.markers = [];
    }
    // refreshMap: function(){
        
    //     var bounds = new google.maps.LatLngBounds ();
    //     for (var i = 0; i < this.markers.length; i++) {
    //         bounds.extend(this.markers[i].getPosition());
    //     }
    //     this.map.fitBounds(bounds);
    // }

}