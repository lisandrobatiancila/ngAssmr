assmrAPP.controller("uploadPropertyController", ["$scope", "$window", "$http", "Upload", "$cookies", "$uibModal", function($scope, $window, $http, Upload, $cookies, $uibModal) {
    $scope.fileInstance = {}
    $scope.errorObject = {}

    $scope.saveVehiclePropertyForm = function(uploadVehiclePropertyForm) {
        $scope.errorObject = {}
        let owner = uploadVehiclePropertyForm.$$element[0][0].value,
            contactno = uploadVehiclePropertyForm.$$element[0][1].value,
            brand = uploadVehiclePropertyForm.$$element[0][2].value,
            model = uploadVehiclePropertyForm.$$element[0][3].value,
            location = uploadVehiclePropertyForm.$$element[0][4].value,
            downpayment = uploadVehiclePropertyForm.$$element[0][5].value,
            installment_paid = uploadVehiclePropertyForm.$$element[0][6].value,
            installment_duration = uploadVehiclePropertyForm.$$element[0][7].value,
            delinquent = uploadVehiclePropertyForm.$$element[0][8].value,
            description = uploadVehiclePropertyForm.$$element[0][9].value

        let validateFields = [owner, contactno, brand, model, location, downpayment, installment_paid, installment_duration, delinquent];
        let VL = validateFields.length
        
        for(let idx = 0; idx < VL; idx++) {
            if(idx != 9 && !/[^\s]/.test(validateFields[idx])) {
                $scope.errorObject = {
                    errorInfo: {
                        message: idx === 0?!/[^\s]/.test(validateFields[idx])?"Empty owner":"":
                            idx === 1?!/[^\s]/.test(validateFields[idx])?"Empty contactno":"":
                            idx === 2?!/[^\s]/.test(validateFields[idx])?"Empty brand":"":
                            idx === 3?!/[^\s]/.test(validateFields[idx])?"Empty model":"":
                            idx === 4?!/[^\s]/.test(validateFields[idx])?"Empty location":"":
                            idx === 5?!/[^\s]/.test(validateFields[idx])?"Empty downpayment":"":
                            idx === 6?!/[^\s]/.test(validateFields[idx])?"Empty installmentpaid":"":
                            idx === 7?!/[^\s]/.test(validateFields[idx])?"Empty installment duration":"":
                            idx === 8?!/[^\s]/.test(validateFields[idx])?"Empty delinquent":"":
                            idx === 9?!/[^\s]/.test(validateFields[idx])?"NA description":"":validateFields[idx],
                        fields: idx === 0?!/[^\s]/.test(validateFields[idx])?"owner":"":
                            idx === 1?!/[^\s]/.test(validateFields[idx])?"contactno":"":
                            idx === 2?!/[^\s]/.test(validateFields[idx])?"brand":"":
                            idx === 3?!/[^\s]/.test(validateFields[idx])?"model":"":
                            idx === 4?!/[^\s]/.test(validateFields[idx])?"location":"":
                            idx === 5?!/[^\s]/.test(validateFields[idx])?"downpayment":"":
                            idx === 6?!/[^\s]/.test(validateFields[idx])?"installmentpaid":"":
                            idx === 7?!/[^\s]/.test(validateFields[idx])?"installmentduration":"":
                            idx === 8?!/[^\s]/.test(validateFields[idx])?"delinquent":"":
                            idx === 9?!/[^\s]/.test(validateFields[idx])?"NA description":"":validateFields[idx],
                        has_error: idx === 0?!/[^\s]/.test(validateFields[idx])?true:false:
                            idx === 1?!/[^\s]/.test(validateFields[idx])?true:false:
                            idx === 2?!/[^\s]/.test(validateFields[idx])?true:false:
                            idx === 3?!/[^\s]/.test(validateFields[idx])?true:false:
                            idx === 4?!/[^\s]/.test(validateFields[idx])?true:false:
                            idx === 5?!/[^\s]/.test(validateFields[idx])?true:false:
                            idx === 6?!/[^\s]/.test(validateFields[idx])?true:false:
                            idx === 7?!/[^\s]/.test(validateFields[idx])?true:false:
                            idx === 8?!/[^\s]/.test(validateFields[idx])?true:false:
                            idx === 9?!/[^\s]/.test(validateFields[idx])?true:false:false,
                        has_success: false
                    }
                }
                break
            }
        }
        
        try{
            if(Object.keys($scope.errorObject).length === 0 && Object.keys($scope.fileInstance.file).length > 0) {
                // let data = {
                //     owner, brand, model, location, downpayment, installment_paid, installment_duration, delinquent, description
                // }
                let config = {
                    headers: {
                        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                        "4ad0079e4029363452dd640ae4c2d812374b7d6f": $cookies.get("4ad0079e4029363452dd640ae4c2d812374b7d6f"),
                        "72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5": $cookies.get("72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5"),
                        withCredentials: true,
                    }
                }

                let data = $.param({
                    propType: "vehicles",
                    owner, contactno, brand, model, location, downpayment, installment_paid, installment_duration,
                    delinquent, description
                })

                submitVehicleForms($http, Upload, data, config, $uibModal, (response) => {
                    let vehicleID = response.vehicleID
                    uploadVehicleImage(Upload, $scope.fileInstance.file, "vehicles", vehicleID, (response) => {
                        modalMessages($uibModal, response.data)
                    })
                })
            }
            else if(typeof($scope.fileInstance.file) === 'undefined')
                $scope.fileInstance = {}
            else if(Object.keys($scope.fileInstance.file).length === 0)
                $scope.fileInstance = {}
        }
        catch(error) {
            console.log(error.message);
        }
    }
    $scope.resetVehiclePropertyForm = function(uploadVehiclePropertyForm) {
        $scope.fileInstance = {}
        $scope.errorObject = {}
        uploadVehiclePropertyForm.$$element[0][0].value = ""
        uploadVehiclePropertyForm.$$element[0][1].value = ""
        uploadVehiclePropertyForm.$$element[0][2].value = ""
        uploadVehiclePropertyForm.$$element[0][3].value = ""
        uploadVehiclePropertyForm.$$element[0][4].value = ""
        uploadVehiclePropertyForm.$$element[0][5].value = ""
        uploadVehiclePropertyForm.$$element[0][6].value = ""
        uploadVehiclePropertyForm.$$element[0][7].value = ""
        uploadVehiclePropertyForm.$$element[0][8].value = ""
    }
    $scope.saveJewelryPropertyForm = function(uploadJewelryPropertyForm) {
        $scope.errorObject = {}
        let jowner = uploadJewelryPropertyForm.$$element[0][0].value,
            jcontactno = uploadJewelryPropertyForm.$$element[0][1].value,
            jname = uploadJewelryPropertyForm.$$element[0][2].value,
            jmodel = uploadJewelryPropertyForm.$$element[0][3].value,
            jlocation = uploadJewelryPropertyForm.$$element[0][4].value,
            jdownpayment = uploadJewelryPropertyForm.$$element[0][5].value,
            jinstallmentpaid = uploadJewelryPropertyForm.$$element[0][6].value,
            jinstallmentduration = uploadJewelryPropertyForm.$$element[0][7].value,
            jdelinquent = uploadJewelryPropertyForm.$$element[0][8].value,
            jdescription = uploadJewelryPropertyForm.$$element[0][9].value

            let validateFields = [jowner, jcontactno, jname, jmodel, jlocation, jdownpayment, jinstallmentpaid, jinstallmentduration, jdelinquent, jdescription];
            let JL = validateFields.length

            for(let idx = 0; idx < JL; idx++) {
                if(idx != 9 && !/[^\s]/.test(validateFields[idx])) {
                    $scope.errorObject = {
                        errorInfo: {
                            message: idx === 0?!/[^\s]/.test(validateFields[idx])?"Empty owner":"":
                                idx === 1?!/[^\s]/.test(validateFields[idx])?"Empty contactno":"":
                                idx === 2?!/[^\s]/.test(validateFields[idx])?"Empty jewelry name":"":
                                idx === 3?!/[^\s]/.test(validateFields[idx])?"Empty jewelry model":"":
                                idx === 4?!/[^\s]/.test(validateFields[idx])?"Empty location":"":
                                idx === 5?!/[^\s]/.test(validateFields[idx])?"Empty downpayment":"":
                                idx === 6?!/[^\s]/.test(validateFields[idx])?"Empty installmentpaid":"":
                                idx === 7?!/[^\s]/.test(validateFields[idx])?"Empty installment duration":"":
                                idx === 8?!/[^\s]/.test(validateFields[idx])?"Empty delinquent":"":validateFields[idx],
                            fields: idx === 0?!/[^\s]/.test(validateFields[idx])?"j-owner":"":
                                idx === 1?!/[^\s]/.test(validateFields[idx])?"j-contactno":"":
                                idx === 2?!/[^\s]/.test(validateFields[idx])?"j-name":"":
                                idx === 3?!/[^\s]/.test(validateFields[idx])?"j-model":"":
                                idx === 4?!/[^\s]/.test(validateFields[idx])?"j-location":"":
                                idx === 5?!/[^\s]/.test(validateFields[idx])?"j-downpayment":"":
                                idx === 6?!/[^\s]/.test(validateFields[idx])?"j-installmentpaid":"":
                                idx === 7?!/[^\s]/.test(validateFields[idx])?"j-installmentduration":"":
                                idx === 8?!/[^\s]/.test(validateFields[idx])?"j-delinquent":"":validateFields[idx],
                            has_error: idx === 0?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 1?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 2?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 3?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 4?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 5?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 6?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 7?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 8?!/[^\s]/.test(validateFields[idx])?true:false:false,
                            has_success: false
                        }
                    }
                    break
                }
            }
            
            try{
                if(Object.keys($scope.errorObject).length === 0 && Object.keys($scope.fileInstance.file).length > 0) {
                    let config = {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                            "4ad0079e4029363452dd640ae4c2d812374b7d6f": $cookies.get("4ad0079e4029363452dd640ae4c2d812374b7d6f"),
                            "72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5": $cookies.get("72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5"),
                            withCredentials: true,
                        }
                    }
    
                    let data = $.param({
                        propType: "jewelries",
                        jowner, jcontactno, jname, jmodel, jlocation, jdownpayment, jinstallmentpaid, jinstallmentduration, jdelinquent,
                        jdescription
                    })
                    
                    submitJewelryForms($http, Upload, $scope.fileInstance.file, data, config, $uibModal, (response) => {
                        let jewelryID = response.jewelryID
                        uploadJewelryImage(Upload, $scope.fileInstance.file, "jewelries", jewelryID, (response) => {
                            modalMessages($uibModal, response.data)
                        })
                    })
                }
                else if(typeof($scope.fileInstance.file) === 'undefined')
                    $scope.fileInstance = {}
                else if(Object.keys($scope.fileInstance.file).length === 0)
                    $scope.fileInstance = {}
            }
            catch(error) {
                console.log(error.message);
            }
    }
    $scope.resetJewelryPropertyForm = function(uploadJewelryPropertyForm) {
        $scope.errorObject = {}
        $scope.fileInstance = {}
        uploadJewelryPropertyForm.$$element[0][0].value = ""
        uploadJewelryPropertyForm.$$element[0][1].value = ""
        uploadJewelryPropertyForm.$$element[0][2].value = ""
        uploadJewelryPropertyForm.$$element[0][3].value = ""
        uploadJewelryPropertyForm.$$element[0][4].value = ""
        uploadJewelryPropertyForm.$$element[0][5].value = ""
        uploadJewelryPropertyForm.$$element[0][6].value = ""
        uploadJewelryPropertyForm.$$element[0][7].value = ""
        uploadJewelryPropertyForm.$$element[0][8].value = ""
    }
    $scope.saveRealestatePropertyForm = function(uploadRealestatePropertyForm) {
        $scope.errorObject = {}
        let owner = uploadRealestatePropertyForm.$$element[0][0].value,
            contactno = uploadRealestatePropertyForm.$$element[0][1].value,
            estatelocation = uploadRealestatePropertyForm.$$element[0][2].value,
            estatedownpayment = uploadRealestatePropertyForm.$$element[0][3].value,
            estateinstallmentpaid = uploadRealestatePropertyForm.$$element[0][4].value,
            estateinstallmentduration = uploadRealestatePropertyForm.$$element[0][5].value,
            estatedelinquent = uploadRealestatePropertyForm.$$element[0][6].value,
            estatetype = uploadRealestatePropertyForm.$$element[0][7].value,
            estatedescription = uploadRealestatePropertyForm.$$element[0][8].value

            let validateFields = [owner, contactno, estatelocation, estatedownpayment, estateinstallmentpaid, estateinstallmentduration, estatedelinquent];
            let JL = validateFields.length

            for(let idx = 0; idx < 7; idx++) {
                if(!/[^\s]/.test(validateFields[idx])) {
                    $scope.errorObject = {
                        errorInfo: {
                            message: idx === 0?!/[^\s]/.test(validateFields[idx])?"Empty owner":"":
                                idx === 1?!/[^\s]/.test(validateFields[idx])?"Empty contactno":"":
                                idx === 2?!/[^\s]/.test(validateFields[idx])?"Empty location":"":
                                idx === 3?!/[^\s]/.test(validateFields[idx])?"Empty downpayment":"":
                                idx === 4?!/[^\s]/.test(validateFields[idx])?"Empty installmentpaid":"":
                                idx === 5?!/[^\s]/.test(validateFields[idx])?"Empty installment duration":"":
                                idx === 6?!/[^\s]/.test(validateFields[idx])?"Empty delinquent":"":validateFields[idx],
                            fields: idx === 0?!/[^\s]/.test(validateFields[idx])?"estate-owner":"":
                                idx === 1?!/[]/.test(validateFields[idx])?"estate-contactno":"":
                                idx === 2?!/[^\s]/.test(validateFields[idx])?"estate-location":"":
                                idx === 3?!/[^\s]/.test(validateFields[idx])?"estate-downpayment":"":
                                idx === 4?!/[^\s]/.test(validateFields[idx])?"estate-installmentpaid":"":
                                idx === 5?!/[^\s]/.test(validateFields[idx])?"estate-installmentduration":"":
                                idx === 6?!/[^\s]/.test(validateFields[idx])?"estate-delinquent":"":validateFields[idx],
                            has_error: idx === 0?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 1?/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 2?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 3?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 4?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 5?!/[^\s]/.test(validateFields[idx])?true:false:
                                idx === 6?!/[^\s]/.test(validateFields[idx])?true:false:false,
                            has_success: false
                        }
                    }
                    break
                }
            }
            
            try{
                if(Object.keys($scope.errorObject).length === 0 && Object.keys($scope.fileInstance.file).length > 0) {
                    let config = {
                        headers: {
                            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
                            "4ad0079e4029363452dd640ae4c2d812374b7d6f": $cookies.get("4ad0079e4029363452dd640ae4c2d812374b7d6f"),
                            "72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5": $cookies.get("72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5"),
                            withCredentials: true,
                        }
                    }
    
                    let data = $.param({
                        propType: "realestate",
                        owner, contactno, estatelocation, estatedownpayment, estateinstallmentpaid, estateinstallmentduration, estatedelinquent, estatetype, estatedescription
                    })
                    
                    submitRealestateForms($http, data, config, $uibModal, (response) => {
                        let propertyID = response.realestateID
                        uploadRealestateImage(Upload, $scope.fileInstance.file, propertyID, (response) => {
                            modalMessages($uibModal, response.data)
                        })
                    })
                }
                else if(typeof($scope.fileInstance.file) === 'undefined')
                    $scope.fileInstance = {}
                else if(Object.keys($scope.fileInstance.file).length === 0)
                    $scope.fileInstance = {}
            }
            catch(error) {
                console.log(error.message);
            }
    }
    $scope.resetRealestatePropertyForm = function(uploadRealestatePropertyForm) {
        $scope.errorObject = {}
        $scope.fileInstance = {}
        uploadRealestatePropertyForm.$$element[0][0].value = ""
        uploadRealestatePropertyForm.$$element[0][1].value = ""
        uploadRealestatePropertyForm.$$element[0][2].value = ""
        uploadRealestatePropertyForm.$$element[0][3].value = ""
        uploadRealestatePropertyForm.$$element[0][4].value = ""
        uploadRealestatePropertyForm.$$element[0][5].value = ""
        uploadRealestatePropertyForm.$$element[0][6].value = ""
        uploadRealestatePropertyForm.$$element[0][7].value = ""
        uploadRealestatePropertyForm.$$element[0][9].value = ""
    }
}])

function submitVehicleForms($http, Upload, data, config, uibModal, cb) {
    let url = HELPER.apiRoot('upload-vehicle-info')
    
    $http.post(url, data, config)
        .then(response => {
            if(response.data.code == 401) {
                modalMessages(uibModal, response.data)
            }
            else
                cb(response.data)
        })
        .catch(error => {
            if(error.status === -1)
                alert("Server is down")
            else 
                alert("Something went wrong")
        })
}

function submitJewelryForms($http, Upload, file, data, config, uibModal, cb) {
    let url = HELPER.apiRoot("upload-jewelry-info")
    
    $http.post(url, data, config)
        .then(response => {
            if(response.data.code == 401)
                modalMessages(uibModal, response.data)
            else
                cb(response.data)
        })
        .catch(error => cb(error))
    
}

function submitRealestateForms($http, data, config, uibModal, cb) {
    let url = HELPER.apiRoot("upload-realestate-info")

    $http.post(url, data, config)
        .then(response => {
            if(response.data.code == 401)
                modalMessages(uibModal, response.data)
            else if(response.data.code == 500)
                modalMessages(uibModal, response.data)
            else
                cb(response.data)
        })
        .catch(error => cb(error))
}

function uploadVehicleImage(Upload, file, propertyType, propertyID, cb) {
    let url = HELPER.apiRoot("upload-vehicle-images")
    Upload.upload({
        url,
        file,
        data: {propertyType, propertyID},
        headers: {
            "Content-Type": "application/form-data"
        }
    })
    .then(response => cb(response))
    .catch(error => cb(error))
}

function uploadJewelryImage(Upload, file, propertyType, propertyID, cb) {
    let url = HELPER.apiRoot("upload-jewelry-images")

    Upload.upload({
        url,
        file,
        data: { propertyType, propertyID },
    })
    .then(response => cb(response))
    .catch(error => cb(error))
}

function uploadRealestateImage(Upload, file, propertyID, cb) {
    let url = HELPER.apiRoot("upload-realestate-images")
    Upload.upload({
        url,
        file,
        data: { propertyID }
    })
    .then(response => cb(response))
    .catch(error => cb(error))
}