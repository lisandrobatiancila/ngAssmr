assmrAPP.controller("homeController", ["$scope", "$routeParams", "$route", "$rootScope", "$location", "$uibModal", "$http", "$timeout", function($scope, $routeParams, $route, $rootScope, $location, $uibModal, $http, $timeout) {
    $scope.headerTemplateURL = "/views/static/header.html"
    $scope.current_route_link = ""
    $scope.current_template = ""
    $scope.template_lists = [
        {
            key: "",
            templateUrl: "views/static/default_logo.html"
        },
        {
            key: "signup",
            templateUrl: "views/accounts/signup.html"
        },
        {
            key: "login",
            templateUrl: "views/accounts/login.html"
        },
        {
            key: "about",
            templateUrl: "views/information/about.html"
        },
        {
            key: "contact",
            templateUrl: "views/information/contact.html"
        },
        {
            key: "browse-property",
            templateUrl: "views/browse-property/browse-property.html"
        }
    ]
    $scope.signupUserForm = null
    $scope.errorObjects = {}
    $scope.pageActionMessage = {
        message: "signup form",
        has_error: false,
        has_success: false
    }

    $scope.submitUserForm = function(userForm) {
        $scope.errorObjects = {}

        let fname = userForm.$$element[0][0].value,
            mname = userForm.$$element[0][1].value,
            lname = userForm.$$element[0][2].value,
            gender = userForm.$$element[0][3].value,
            contactno = userForm.$$element[0][4].value,
            province = userForm.$$element[0][5].value,
            city = userForm.$$element[0][6].value,
            barangay = userForm.$$element[0][7].value,
            email = userForm.$$element[0][8].value,
            password = userForm.$$element[0][9].value

        let entryLists = [fname, mname, lname, contactno, email, password]
        let entryLen = entryLists.length

        for(let idx = 0; idx < entryLen; idx++) {
            if(!/[^\s]/.test(entryLists[idx]) && [0, 1, 2, 3, 4, 5].indexOf(idx) !== -1) { // means empty-fields
                $scope.errorObjects = {
                    errorInfo: {
                        fields: idx === 0?/[^\s]/.test(entryLists[idx])?"":"first name":
                            idx === 1?/[^\s]/.test(entryLists[idx])?"":"middle name":
                            idx === 2?/[^\s]/.test(entryLists[idx])?"":"last name":
                            idx === 3?/[^\s]/.test(entryLists[idx])?"":"contactno":
                            idx === 4?/[^\s]/.test(entryLists[idx])?"":"email":
                            idx === 5?/[^\s]/.test(entryLists[idx])?"":"password":"",
                        has_error: true,
                        has_success: false
                    }
                }
                $scope.pageActionMessage = {
                    message: "Invalid fields",
                    has_error: true,
                    has_success: false
                }
                break
            }
        }

        let data = $.param({
            fname,
            mname,
            lname,
            gender,
            contactno,
            province,
            city,
            barangay,
            email,
            password
        })

        if(Object.keys($scope.errorObjects).length === 0) //means validation-pass
            saveUserForm($http, data, null, (response) => {
                let data = response.data
                if(data.status === 1) {
                    $scope.pageActionMessage = {
                        message: "signing up was successfull",
                        has_error: false,
                        has_success: true
                    }
                    $timeout(function() {
                        resetFormFields($scope, userForm)
                    }, 1500)
                }
                else {
                    $scope.pageActionMessage = {
                        message: data.message,
                        has_error: true,
                        has_success: false
                    }
                }

            })
    }
    $scope.resetUserForm = function(userForm) {
        resetFormFields($scope, userForm)
    }
    $scope.$on('$routeChangeSuccess', function(evt, toState, toParams, fromState, fromParams) {
        try{
            $scope.current_route_link = $location.hash()
            $scope.current_template = $scope.template_lists.filter(tl => tl.key === $scope.current_route_link)[0].templateUrl

            if($scope.current_route_link === "login") {
                loginModal = $uibModal.open({
                    templateUrl: $scope.current_template,
                    controller: "loginController"
                })

                loginModal.result.then(function(response) {
                }, function() {
                    $location.url("/")
                })
            }
        }
        catch(error) {
            // $location.path("#information")
        }
    });
}])

assmrAPP.controller("loginController", ["$scope", "$location", "$uibModalInstance", "$http", "$cookies", function($scope, $location, $uibModalInstance, $http, $cookies) {
    $scope.submitLoginUserForm = function(loginUserForm) {
        $scope.errorObjects = {}
        let email = loginUserForm.$$element[0][0].value,
            password = loginUserForm.$$element[0][1].value

        let validateFields = [email, password]
        for(let idx = 0; idx < 2; idx++) {
            if(!/[^\s]/.test(validateFields[idx])) {
                $scope.errorObjects = {
                    errorInfo: {
                        fields: idx === 0?!/[^\s]/.test(validateFields[idx])?"email":"":
                            idx === 1?!/[^\s]/.test(validateFields[idx])?"password":"":"",
                        message: idx === 0?!/[^\s]/.test(validateFields[idx])?"Empty email":"":
                        idx === 1?!/[^\s]/.test(validateFields[idx])?"Empty password":"":"",
                        has_error: true,
                        has_success: false
                    }
                }
                break
            }
        }

        if(Object.keys($scope.errorObjects).length === 0) { //means validation-passed
            let config = {
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                    withCredentials: true
                }
            }
            let data = $.param({
                email,
                password
            })
            saveloginUserForm($http, data, config, (response) => {
                let data = response.data
                if(data.status === 1) {
                    $scope.errorObjects = {
                        errorInfo: {
                            message: data.message,
                            has_error: false,
                            has_success: true
                        }
                    }
                    $cookies.put("4ad0079e4029363452dd640ae4c2d812374b7d6f", data.sessionCookie)
                    $cookies.put("72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5", data.userEmail)
                    $location.url("/dashboard")
                    $uibModalInstance.close()
                }
                else if(data.status === 0)
                    $scope.errorObjects = {
                        errorInfo: {
                            message: data.message,
                            has_error: true,
                            has_success: false
                        }
                    }
            })
        }
    }
    $scope.signupUserForm = function() {
        $location.url("#signup")
        $uibModalInstance.close()
    }
}])

function saveUserForm($http, data, headers, cb) {
    let config = {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
        }
    }
    $http.post(HELPER.apiRoot('signupUser'), data, config)
        .then(response => {
            cb(response)
        })
        .catch(error => {
            console.log(error);
            if(error.status === -1)
                alert("Server is down")
            else
                alert("Something went wrong")
        })
}

function saveloginUserForm($http, data, headers, cb) {
    $http.post(HELPER.apiRoot('loginUser'), data, headers)
        .then(response => {
            cb(response)
        })
        .catch(error => {
            if(error.status === -1)
                alert("Server is down")
            else
                alert("Something went wrong")
        })
}

function resetFormFields($scope, userForm) {
    $scope.errorObjects = {
        errorInfo: null
    }
    $scope.pageActionMessage = {
        message: "signup form",
        has_error: false,
        has_success: false
    }

    userForm.$$element[0][0].value = ""
    userForm.$$element[0][1].value = ""
    userForm.$$element[0][2].value = ""
    userForm.$$element[0][3].value = "male"
    userForm.$$element[0][4].value = ""
    userForm.$$element[0][5].value = "province"
    userForm.$$element[0][6].value = "city"
    userForm.$$element[0][7].value = "barangay"
    userForm.$$element[0][8].value = ""
    userForm.$$element[0][9].value = ""
}