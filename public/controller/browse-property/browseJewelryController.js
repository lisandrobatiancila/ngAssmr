assmrAPP.controller("browseJewelryController", ["$scope", "$http", "$location", "$uibModal", function ($scope, $http, $location, $uibModal) {
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
    $scope.assumeProperty = function(jewelryInfo) {
        $uibModal.open({
            templateUrl: "views/modal/assumePropertyModal.html",
            controller: "jewelryAssumePropertyModal"
        })
    }
}]);

assmrAPP.controller("jewelryAssumePropertyModal", ["$scope", "$uibModalInstance", "$cookies", "checkUserIsLoggedIn", "$http", function($scope, $uibModalInstance, $cookies, checkUserIsLoggedIn, $http) {
    $scope.title = "jewelry";
    $scope.assumptionTemplate = "views/forms/assumeJewelryForm.html";
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
        $uibModalInstance.close();
    }
}])