function SupplyCtrl($scope, $uibModalInstance, GameId, DefaultValue, AlertService) {
    "ngInject";
    $scope.codeValue = DefaultValue;
    $scope.codes = [];
    $scope.numberOfCodes = 1;

    const allowCharacters = "abcdefghjkmnpqrtuvwxyz2346789";

    function supplyCode(length) {
        let res = "";
        while (res.length < length) {
            res += allowCharacters[Math.floor(Math.random() * allowCharacters.length)];
        }
        return res;
    }

    $scope.generate = function () {
        if ($scope.numberOfCodes <= 0) {
            return AlertService.danger("You need to generate at least some codes");
        }
        if ($scope.codeValue <= 0) {
            return AlertService.danger("The codes have to have at least some value");
        }
        $scope.numberOfCodes = Math.ceil($scope.numberOfCodes);
        $scope.codeValue = Math.ceil($scope.codeValue);

        for (let i = 0; i < $scope.numberOfCodes; i++) {
            $scope.codes.push({
                code: supplyCode(6),
                value: $scope.codeValue,
                forGame: GameId
            });
        }
    };

    $scope.save = function () {
        $uibModalInstance.close($scope.codes);
    }

    $scope.cancel = function () {
        $uibModalInstance.dismiss($scope.codes.length ? "Those supply codes were not saved and are invalid" : "");
    }
}

module.exports = {
    name: "SupplyCtrl",
    fn: SupplyCtrl
};
