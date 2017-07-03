function MapService($http, AppSettings) {
    "ngInject";

    const SERVICE = {};

    SERVICE.getAllMarkers = function (cb) {
        $http.get(AppSettings.apiUrl + "/map/buildingLocation/all")
            .then(res => {
                cb(null, res.data)
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.createMarker = function (marker, cb) {
        $http.post(AppSettings.apiUrl + "/map/buildingLocation", marker)
            .then(res => {
                cb(null, res.data)
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.updatedMarker = function (marker, cb) {
        $http.put(AppSettings.apiUrl + "/map/buildingLocation", marker)
            .then(res => {
                cb(null, res.data)
            }, err => {
                cb(err.data);
            });
    };

    SERVICE.removedMarker = function (id, cb) {
        $http.delete(AppSettings.apiUrl + "/map/buildingLocation?id=" + id)
            .then(res => {
                cb(null, res.data)
            }, err => {
                cb(err.data);
            });
    };

    return SERVICE;
}

module.exports = {
    name: "MapService",
    fn: MapService
};
