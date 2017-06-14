function SessionService($http) {
    "ngInject";

    const service = {};

    service.get = function (cb) {
        $http.get("apiPath")
            .success(data => {
                cb(data);
            })
            .error((err, status) => {
                cb(err, status);
            });
    };

    return service;
}

module.exports = {
    name: "SessionService",
    fn: SessionService
};
