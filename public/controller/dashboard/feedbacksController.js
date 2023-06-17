assmrAPP.controller("feedbacksController", ["$scope", "$http", "checkUserIsLoggedIn", "$cookies", function($scope, $http, checkUserIsLoggedIn, $cookies) {
    const $headers = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
            "4ad0079e4029363452dd640ae4c2d812374b7d6f": $cookies.get("4ad0079e4029363452dd640ae4c2d812374b7d6f")
        },
        withCredentials: true
    }
    const $body = $.param({
        userName: $cookies.get("72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5")
    })

    checkUserIsLoggedIn.isLoggedIn($http, $body, $headers)
        .then(response => {
            const respObj = response.data;
            if(respObj.code == 200) {
                // get feed-backs here...
                $http.get('api/web-feedbacks')
                    .then(response => {
                        console.log(response);
                    })
                    .catch(error => {
                        console.log(error);
                    })
            }
            else 
                console.log("Please login");
        })
        .catch(error => {
            console.log(error);
        })
}])