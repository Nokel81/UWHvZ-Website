function UserService($http) {
    "ngInject";

    const SERVICE = {};

    SERVICE.email = "";
    SERVICE.password = "";

    SERVICE.login = function (email, password, cb) {
        try {
            var body = {
                email: email.toString(),
                password: password.toString()
            };
        } catch (e) {
            cb({ body: "email or password is incorrect" });
        }
        $http.post(AppSettings.apiUrl +"/v1/api/user/login", body)
            .then(function (res) {
                
            })
            .catch(function (err) {

            });
    };

    return SERVICE;
}

module.exports = {
    name: "UserService",
    fn: UserService
};
