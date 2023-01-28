assmrAPP.controller("viewPropDetailsController", ["$scope", "$routeParams", "$http", function($scope, $routeParams, $http) {
    $scope.viewPropDetailsTemplate = "views/static/header.html"
    let { propertyType, propertyID } = $routeParams;
    $scope.object = {}
    $scope.propertyType = propertyType;

    getCertainProperty(propertyType, propertyID)

    function getCertainProperty (propertyType, propertyID) {
        let url = HELPER.apiRoot(`get-certain-property/${propertyType}/${propertyID}`);

        $http.get(url)
            .then(serverResponse => {
                let clientResponse = serverResponse.data;
                if(clientResponse.status === 0 || clientResponse.code === 500)
                    $scope.object = {
                        message: "No property to show.",
                        has_error: true,
                        has_success: false
                    };
                else {
                    $scope.object = {};
                    /*
                        * this only used to access some fields for cerntain property,
                        * just want it to be more dynamic
                    */
                    switch(propertyType) {
                        case "vehicle":
                            angular.forEach(clientResponse.data, (p, k) => {
                                p.vehicleIMAGES = JSON.parse(p.vehicleIMAGES)
                            })
                            $scope.certainPropDATA = clientResponse.data[0];
                        break;
                        case "jewelry":
                            angular.forEach(clientResponse.data, (j, k) => {
                                j.jewelryIMG = JSON.parse(j.jewelryIMG);
                            })
                            $scope.certainPropDATA = clientResponse.data[0];
                            console.log($scope.certainPropDATA);
                        break;
                        case "realestate":
                            angular.forEach(clientResponse.data, (r, k) => {
                                r.realestateIMG = JSON.parse(r.realestateIMG);
                            })
                            $scope.certainPropDATA = clientResponse.data[0];
                        break;
                        default:
                            console.log("no propertyType");
                    }
                }
            })
            .catch(error => {
                console.log(error);
            })
    }
}])