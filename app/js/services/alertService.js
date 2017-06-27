function AlertService($rootScope) {
    "ngInject";

    $rootScope.alerts = [];

    const SERVICE = {};

    SERVICE.warn = function (text) {
        $rootScope.alerts.push({
            text: text,
            class: "alert alert-dismissible fade show alert-warning"
        });
    };

    SERVICE.success = function (text) {
        $rootScope.alerts.push({
            text: text,
            class: "alert alert-dismissible fade show alert-success"
        });
    };

    SERVICE.danger = function (text) {
        $rootScope.alerts.push({
            text: text,
            class: "alert alert-dismissible fade show alert-danger"
        });
    };

    SERVICE.info = function (text) {
        $rootScope.alerts.push({
            text: text,
            class: "alert alert-dismissible fade show alert-info"
        });
    };

    return SERVICE;
}

module.exports = {
    name: "AlertService",
    fn: AlertService
};
