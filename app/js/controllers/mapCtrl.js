function MapCtrl($scope, $location, MapService, AlertService) {
    "ngInject";
    let marker = null;
    const mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(43.471427, -80.544765),
        mapTypeId: google.maps.MapTypeId.MAP
    };
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);
    const infoWindow = new google.maps.InfoWindow();

    MapService.getAllPolygons((err, polygons) => {
        if (err) {
            AlertService.danger(err);
        } else {
            polygons.forEach(polygon => {
                const poly = new google.maps.Polygon({
                    paths: polygon.points,
                    strokeColor: "#000000",
                    strokeOpacity: 1,
                    strokeWeight: 1,
                    fillColor: polygon.colour,
                    fillOpacity: 0.2
                });
                poly.setMap(map);
                poly.addListener("click", showName(polygon.name));
            });
        }
    });

    function showName(text) {
        return function(event) {
            infoWindow.setContent(text);
            infoWindow.setPosition(event.latLng);
            infoWindow.open(map);
        };
    }

    $scope.$watch(() => $location.search(), newval => {
        const lat = Number(newval.lat);
        const lng = Number(newval.lng);
        const tit = String(newval.title);
        if (isNaN(lat) || isNaN(lng) || !tit) {
            return;
        }
        if (marker) {
            marker.setMap(null);
        }

        marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            title: tit
        });
        marker.setMap(map);
        map.setCenter(marker.getPosition());
    });
}

module.exports = {
    name: "MapCtrl",
    fn: MapCtrl
};
