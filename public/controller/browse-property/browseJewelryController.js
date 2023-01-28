assmrAPP.controller("browseJewelryController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $scope.jewelryHeaderTemplates = "views/static/header.html";

    getAllJewelryProperties();
    function getAllJewelryProperties() {
        const url = HELPER.apiRoot("BA-jewelry-properties");
        $http.get(url)
            .then(response => {
                let { data } = response.data;

                angular.forEach(data, (j, k) => {
                    j.jewelryIMG = JSON.parse(j.jewelryIMG);
                })

                $scope.jewelryDATA = data;
            })
            .catch(error => {
                console.log(error);
                if (error.status == -1)
                    alert("Serve is down");
                else
                    alert("Something went wrong");
            })
    }
    $scope.viewCertainJewelryDetails = function(propertyID) {
        $location.path(`browse-property/jewelry/${propertyID}`)
    }
}]);