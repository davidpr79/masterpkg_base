/*jslint node: true */
/*global angular */
/*global document */

(function () {
    "use strict";

    var mod = angular.module('login',[]);
    mod.controller('LoginCtrl', function ($rootScope, $scope, $state, $location, GenericDialogs, masterApi, principal, clientConfig, $timeout, $window) {

        $('body').addClass('gray-bg');

        if(principal.isAuthenticated()){
            principal.logout().then(function() {
                $scope.$broadcast('logout');
                $timeout(function() {
                    $window.location.href = "/login";
                },100);
            });
        }

        $scope.credentials = {};
        $scope.clientConfig = clientConfig;
        $scope.loginIsEmail = clientConfig.loginIsEmail || false;
        $scope.login = function() {
            masterApi.post('/login',$scope.credentials, function(err, aIdentity) {
                if (err) {
                    return GenericDialogs.notification(err.toString());
                }
                $('body').removeClass('gray-bg');
                principal.authenticate(aIdentity);
                if ($rootScope.returnToState) {
                    $state.go($rootScope.returnToState, $rootScope.returnToStateParams);
                    delete $rootScope.returnToState;
                    delete $rootScope.returnToStateParams;
                } else if ((aIdentity)&&(aIdentity.homeUrl)) {
                    $location.path(aIdentity.homeUrl);
                } else {
                    $location.path(clientConfig.defaultUrl);
                }
            });
        };
    });
})();
