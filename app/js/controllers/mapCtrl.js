const polygons = require("../../json/mapCoords.json");
const colours = require("../../json/colours.json");

function MapCtrl($scope, SessionService, $location) {
    "ngInject";
    var marker = null;
    const mapOptions = {
        zoom: 16,
        center: new google.maps.LatLng(43.471427, -80.544765),
        mapTypeId: google.maps.MapTypeId.MAP
    };
    const map = new google.maps.Map(document.getElementById("map"), mapOptions);

    Object.keys(polygons).forEach(polygon => {
        const poly = new google.maps.Polygon({
            paths: polygons[polygon].points,
            strokeColor: colours.game,
            strokeOpacity: 1,
            strokeWeight: 1,
            fillColor: colours[polygons[polygon].colour],
            fillOpacity: 0.2
        });
        poly.setMap(map);
        poly.addListener("click", showName(polygons[polygon].text));
    });

    const infoWindow = new google.maps.InfoWindow();

    function showName(text) {
        return function (event) {
            infoWindow.setContent(text);
            infoWindow.setPosition(event.latLng);
            infoWindow.open(map);
        };
    }

    $scope.$watch(() => $location.search(), function (newval) {
        let lat = Number(newval.lat);
        let lng = Number(newval.lng);
        let tit = String(newval.title);
        if (lat === NaN || lng === NaN || !tit) {
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
    });

}

module.exports = {
    name: "MapCtrl",
    fn: MapCtrl
};
