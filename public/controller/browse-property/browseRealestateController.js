assmrAPP.controller("browseRealestateController", ["$scope", "$http", "$location", "$uibModal", function ($scope, $http, $location, $uibModal) {
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
    $scope.assumeProperty = function(realestateInfo) {
        $uibModal.open({
            templateUrl: "views/modal/assumePropertyModal.html",
            controller: "realestateAssumePropertyModal",
            backdrop: "static",
        });
    }

    $scope.viewCertainRealestateDetails = function(propertyID) {
        $location.path(`browse-property/realestate/${propertyID}`);
    }
}])

assmrAPP.controller("realestateAssumePropertyModal", ["$scope", "$uibModalInstance", "$cookies", "checkUserIsLoggedIn", "$http", function($scope, $uibModalInstance, $cookies, checkUserIsLoggedIn, $http) {
    $scope.title = "realestate";
    $scope.assumptionTemplate = "views/forms/assumeRealestateForm.html";
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