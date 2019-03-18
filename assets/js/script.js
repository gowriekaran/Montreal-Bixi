function notifyUser(t, e) {
    var o = "<div class=' alert alert-" + t + " alert-dismissable'><a href='#' class='close' data-dismiss='alert' aria-label='close'>&times;</a>" + e + "</div>";
    $("#notifications").prepend(o), window.scrollTo(0, 0)
}

function initMap() {
    var t = new google.maps.InfoWindow,
        e = {
            lat: 45.5017,
            lng: -73.5673
        },
        o = new google.maps.Map(document.getElementById("map"), {
            zoom: 18,
            center: e
        });
    navigator.geolocation ? navigator.geolocation.getCurrentPosition(function (e) {
        var i = {
            lat: e.coords.latitude,
            lng: e.coords.longitude
        };
        t.setPosition(i), t.setContent("Location found."), o.setCenter(i)
    }, function () {
        notifyUser("danger", "Setting to default location. Geolocation request blocked.")
    }) : notifyUser("danger", "Setting to default location. Browser does not support Geolocation."), $.getJSON("https://secure.bixi.com/data/stations.json", function (e) {
        for (item in e)
            for (subItem in e[item]) {
                var i = {
                        lat: e[item][subItem].la,
                        lng: e[item][subItem].lo
                    },
                    n = new google.maps.Marker({
                        position: i,
                        map: o,
                        icon: "./assets/img/bike.png",
                        title: "Station ID: " + e[item][subItem].n
                    }),
                    a = "<h4>Station ID: " + e[item][subItem].n + "</h4><br>Location: " + e[item][subItem].s + "<br>Available Bike(s): " + e[item][subItem].ba + "<br>Empty Slot(s): " + e[item][subItem].da + '<br><a href="https://maps.google.com?q=' + e[item][subItem].la + "," + e[item][subItem].lo + '">Get Directions</a>';
                ! function (e, i) {
                    google.maps.event.addListener(e, "click", function (n) {
                        t.setContent(i), t.open(o, e)
                    })
                }(n, a)
            }
    })
}
notifyUser("warning", "Bixi service is only available from April 15 to November 15");