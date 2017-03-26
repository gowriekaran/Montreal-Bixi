notifyUser("warning","Bixi service is only available from April 15 to November 15");

function notifyUser(notificationType, notificationMessage){
    var notification = "<div class=' alert alert-" + notificationType + " alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" + notificationMessage + "</div>";
    $("#notifications").prepend(notification);
    window.scrollTo(0, 0);
}

function initMap() {
    var infoWindow = new google.maps.InfoWindow();

    var uluru = {
        lat: 45.5017,
        lng: -73.5673
    };

    var map = new google.maps.Map(document.getElementById('map'), {
        zoom: 16,
        center: uluru
    });

    /**
     * Try Geolocating
     */
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            map.setCenter(pos);
        }, function () {
            notifyUser("danger","Setting to default location. Geolocation request blocked.");
        });
    } else {
        /**
         * Browser does not support Geolocation
         */
        notifyUser("danger","Setting to default location. Browser does not support Geolocation.");
    }

    $.getJSON("https://secure.bixi.com/data/stations.json", function (data) {
        for (item in data) {
            for (subItem in data[item]) {
                var uluru = {
                    lat: data[item][subItem].la,
                    lng: data[item][subItem].lo
                };

                var marker = new google.maps.Marker({
                    position: uluru,
                    map: map,
                    icon: './assets/img/bike.png',
                    title: 'Station ID: ' + data[item][subItem].n
                });

                var context = "<h4>Station ID: " + data[item][subItem].n + "</h4><br>" +
                    "Station Location: " + data[item][subItem].s + "<br>" +
                    "Available Bike(s): " + data[item][subItem].ba + "<br>" +
                    "Empty Slot(s): " + data[item][subItem].da + "<br>" +
                    '<a href="https://maps.google.com?q=' + data[item][subItem].la + ',' + data[item][subItem].lo +
                    '">Get Directions</a>';

                (function (marker, context) {
                    google.maps.event.addListener(marker, "click", function (e) {
                        infoWindow.setContent(context);
                        infoWindow.open(map, marker);
                    });
                })(marker, context);
            }
        }
    });
}