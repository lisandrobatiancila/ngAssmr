const assmrAPP = angular.module("assmrApp", ["ngRoute", "ui.bootstrap", "ngFileUpload", "ngCookies"])
assmrAPP.config(function($routeProvider, $locationProvider, $provide) {
    $locationProvider
        .html5Mode(false)
        // .hashPrefix("!")
        
    $routeProvider
        .when("/", {
            templateUrl: "views/home.html",
            controller: "homeController",
            data: {
                view: 'tests'
            }
        })
        .when("/information/:infotype", {
            templateUrl: "views/information/information.html",
            continue: "informationController"
        })
        .when("/dashboard", {
            templateUrl: "views/dashboard/dashboard.html",
            controller: "dashboardController"
        })
        .when("/upload-property", {
            templateUrl: "views/dashboard/uploadProperty.html",
            controller: "uploadPropertyController"
        })
        .when("/browse-property/vehicle", {
            templateUrl: "views/browse-property/vehicle.html",
            controller: "browseVehicleController"
        })
        .when("/browse-property/jewelry", {
            templateUrl: "views/browse-property/jewelry.html",
            controller: "browseJewelryController"
        })
        .when("/browse-property/realestate", {
            templateUrl: "views/browse-property/realestate.html",
            controller: "browseRealestateController"
        })
        .when("/browse-property/:propertyType/:propertyID", {
            templateUrl: "views/browse-property/viewCertPropDetails.html",
            controller: "viewPropDetailsController"
        })
        .otherwise("/")
})

function modalMessages(uibModal, response) {
    userMessages = uibModal.open({
        templateUrl: "views/modal/userMessagesModal.html",
        controller: "userMessagesModalController",
        resolve: {
            $userModalMessages: function() {
                return response
            }
        }
    })
    userMessages.result.then(function(response) {

    }, function() {

    })
}

assmrAPP.controller("userMessagesModalController", ["$scope", "$uibModalInstance", "$userModalMessages", "$route", "$location", function($scope, $uibModalInstance, $userModalMessages, $route, $location) {
    $scope.modal_header_title = "Modal Message"
    
    switch($userModalMessages.code) {
        case 401:
            $scope.modal_header_title = "Message"
            $scope.modal_body_title = "Please login first."
        break;
        case 500:
            $scope.modal_header_title = "Message"
            $scope.modal_body_title = "Please login first."
        break;
        case 200:
            $scope.modal_header_title = "Message"
            $scope.modal_body_title = "Request was successful."
        break;
        default:
            $scope.modal_header_title = "Modal Message"
    }
    $scope.buttonOk = function() {
        $uibModalInstance.close()
        window.location.href = "#login"
    }
    $scope.buttonCancel = function() {
        $uibModalInstance.close()
    }
}]);

assmrAPP.controller("headerController", ["$scope", "$location", function($scope, $location) {
    $scope.path = $location.path().split('/')[2];

}])