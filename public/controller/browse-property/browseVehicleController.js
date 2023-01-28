assmrAPP.controller("browseVehicleController", ["$scope", "$http", "$location", function($scope, $http, $location) {
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
}])