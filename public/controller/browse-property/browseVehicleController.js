assmrAPP.controller("browseVehicleController", ["$scope", "$http", "$location", "$uibModal", function($scope, $http, $location, $uibModal) {
    getAllVehicleProperties()

    function getAllVehicleProperties() {
        let url = HELPER.apiRoot("BA-vehicle-properties")
        $http.get(url)
            .then(response => {
                let { data } = response.data
                angular.forEach(data, (v, k) => {
                    v.vehicleIMAGES = JSON.parse(v.vehicleIMAGES)
                })
                $scope.vehicleDATA = data;
            })
            .catch(error => {
                if(error.status == -1)
                    alert("Server is donw")
                else
                    alert("Something went wrong")
            })
    }
    $scope.viewCertainVehicleDetails = function(propertyID) {
        $location.path(`browse-property/vehicle/${propertyID}`)
    }
    $scope.assumeProperty = function(vehicleInfo) {
        $uibModal.open({
            templateUrl: "views/modal/assumePropertyModal.html",
            controller: "vehicleAssumePropertyModal",
            backdrop: "static",
        })
    }
}]);

assmrAPP.controller("vehicleAssumePropertyModal", ["$scope", "checkUserIsLoggedIn", "$http", "$cookies", "$uibModalInstance", function($scope, checkUserIsLoggedIn, $http, $cookies, $uibModalInstance) {
    $scope.title = "vehicle";
    $scope.assumptionTemplate = "views/forms/assumeVehicleForm.html";

    let headers = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "4ad0079e4029363452dd640ae4c2d812374b7d6f": $cookies.get("4ad0079e4029363452dd640ae4c2d812374b7d6f"),
        },
        withCredentials: true
    }
    let body = $.param({
        userName: $cookies.get(userEmail)??"undefined",
    })
    console.log(headers);
    console.log(body);
    checkUserIsLoggedIn.isLoggedIn($http, body, headers)
        .then(response => {
            console.log(response);
        })
        .catch(error => console.log(error))

    $scope.closeModal = function() {
        $uibModalInstance.close()
    }
}]);
