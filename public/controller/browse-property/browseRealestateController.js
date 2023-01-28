assmrAPP.controller("browseRealestateController", ["$scope", "$http", "$location", function ($scope, $http, $location) {
    $scope.realestateHeaderTemplate = "views/static/header.html"
    getAllRealestate();

    function getAllRealestate() {
        const url = HELPER.apiRoot("BA-realestate-properties")
        $http.get(url)
            .then(response => {
                let { status, code } = response.data
                if(status === 1 && code === 200) {
                    let { data } = response.data
                    angular.forEach(data, (r, k) => {
                        r.realestateIMG = JSON.parse(r.realestateIMG)
                    })
                    $scope.realestateDATA = data
                }
            })
            .catch(error => {
                if (error.status == -1)
                    alert("Server is donw")
                else
                    alert("Something went wrong")
            })
    }
    $scope.viewCertainRealestateDetails = function(propertyID) {
        $location.path(`browse-property/realestate/${propertyID}`)
    }
}])