assmrAPP.controller("browseVehicleController", ["$scope", "$http", function($scope, $http) {
    getAllVehicleProperties()

    function getAllVehicleProperties() {
        let url = HELPER.apiRoot("BA-vehicle-properties")
        $http.get(url)
            .then(response => {
                let { data } = response.data
                angular.forEach(data, (v, k) => {
                    v.vehicleIMAGES = JSON.parse(v.vehicleIMAGES)
                })
                $scope.vehicleDATA = data
                console.log($scope.vehicleDATA);
            })
            .catch(error => console.log(error))
    }
}])