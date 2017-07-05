function WaiverCtrl($scope, $uibModalInstance) {
    "ngInject";

    $scope.accept = function () {
        $uibModalInstance.close();
    };

    $scope.decline = function () {
        $uibModalInstance.dismiss();
    };
}

module.exports = {
    name: "WaiverCtrl",
    fn: WaiverCtrl
};
