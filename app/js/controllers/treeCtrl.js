function TreeCtrl($scope, GameService, $cookies, UserService, AlertService) {
    "ngInject";
    UserService.getBySession(user => {
        $scope.user = user;
        let userId = (user || {})._id;

        GameService.getTrees(userId, (err, trees) => {
            if (err) {
                return AlertService.danger(err);
            }
            $scope.trees = trees;
        });
    });

    $scope.$watch("currentTree", newval => {
        let index = Number(newval);
        if (isNaN(index) || !$scope.trees) {
            return;
        }
        let container = document.getElementById('zombieTree');
        let data = $scope.trees[index];
        let options = {
            height: "calc(100% - 100px)"
        };
        new vis.Network(container, data, options);
    });
}

module.exports = {
    name: "TreeCtrl",
    fn: TreeCtrl
};
