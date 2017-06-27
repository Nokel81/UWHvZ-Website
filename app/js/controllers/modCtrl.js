function ModCtrl($scope, $location, UserService) {
    "ngInject";
    UserService.getUserType(type => {
        if (type !== "Moderator") {
            $location.url("/");
        }
    });
}

module.exports = {
    name: "ModCtrl",
    fn: ModCtrl
};
