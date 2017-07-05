function AlertService($rootScope) {
    "ngInject";

    $rootScope.alerts = [];

    const SERVICE = {};

    SERVICE.warn = function (text) {
        $rootScope.alerts.push({
            text,
            class: "alert alert-dismissible fade in show alert-warning"
        });
    };

    SERVICE.success = function (text) {
        $rootScope.alerts.push({
            text,
            class: "alert alert-dismissible fade in show alert-success"
        });
    };

    SERVICE.danger = function (text) {
        $rootScope.alerts.push({
            text,
            class: "alert alert-dismissible fade in show alert-danger"
        });
    };

    SERVICE.info = function (text) {
        $rootScope.alerts.push({
            text,
            class: "alert alert-dismissible fade in show alert-info"
        });
    };

    return SERVICE;
}

module.exports = {
    name: "AlertService",
    fn: AlertService
};
