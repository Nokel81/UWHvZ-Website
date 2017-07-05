function OnRun($rootScope, AppSettings, $transitions) {
    "ngInject";

    // change page title based on state
    $transitions.onSuccess({}, transition => {
        $rootScope.pageTitle = AppSettings.appTitle;

        if (transition.$to().name) {
            $rootScope.pageTitle += " \u2014 " + transition.$to().name;
        }
    });
}

module.exports = OnRun;
