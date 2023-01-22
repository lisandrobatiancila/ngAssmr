assmrAPP.controller("dashboardController", ["$scope", function($scope) {
    $scope.toggle = false
    $scope.toggleBurgerMenu = function() {
        let burgerContainer = document.getElementsByClassName("burger-container")
        if(!$scope.toggle) {
            let burgerCChildren = burgerContainer[0].children
            burgerCChildren[0].classList.add("burger-one-transform")
            burgerCChildren[1].classList.add("burger-two-transform")
            burgerCChildren[2].classList.add("burger-three-hide")
            $scope.toggle = !$scope.toggle
        }
        else {
            let burgerCChildren = burgerContainer[0].children
            burgerCChildren[0].classList.remove("burger-one-transform")
            burgerCChildren[1].classList.remove("burger-two-transform")
            burgerCChildren[2].classList.remove("burger-three-hide")
            $scope.toggle = !$scope.toggle
        }
    }
}])
