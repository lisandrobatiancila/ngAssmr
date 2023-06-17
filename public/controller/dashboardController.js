assmrAPP.controller("dashboardController", ["$scope", "$location", function($scope, $location) {
    $scope.url = $location.url().split("#");
    $scope.currURL = $scope.url.length === 1?$scope.url[0]:$scope.url[1]
    $scope.templateVIEW = ""
    
    switch($scope.currURL) {
        case "/dashboard":
            $scope.templateVIEW = "views/dashboard/dashboardData.html";
        break;
        case "my-property":
            $scope.templateVIEW = "views/dashboard/properties/jewelry.html";
        break;
        case "feedbacks":
            $scope.templateVIEW = "views/dashboard/feedbacks.html";
        break;
        default:
            console.log("Invalid route")
    }
}])
