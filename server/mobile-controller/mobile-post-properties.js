const express = require("express");
const formidable = require("formidable");
const router = express.Router();
const commonLib = require("../common/commonFunction");
const serverResponse = require("../common/serverResonses");
const dbConn = require("../db/dbConnection");
const mysqlConn = require("../db/mysqlController");

const GLOBAL_FILE_NAME = "mobile-post-properties";

router.route("/mobile-upload-vehicle-info")
    .post(async (req, res) => {
        const GLOBAL_FUNCTION_NAME = "mobileUploadVehicleInfo()";
        let lastAlgo = "@MUVI1",
            responseObj = {};
        try{
            lastAlgo = "@MUVI2";
            let { form, userID } = req.body;
            form = JSON.parse(form);
            
            let { owner, mobileNo, brand, model, location, downpayment, installmentPaid, installmentDuration, delinquent, description } = form;
            const validateFields = [owner, mobileNo, brand, model, location, downpayment, installmentPaid, installmentDuration, delinquent];
            const VFLen = validateFields.length;
            let validationPass = true;

            for(let i = 0; i < VFLen; i++) {
                if(!/[^\s]/.test(validateFields[i])) {
                    validationPass = false;
                    break;
                }
            }
            if(validationPass) {
                const propertyID = await new Promise((resolve, reject) => {
                    lastAlgo = "@MUVI3";
                    let sql = "INSERT INTO properties VALUES?",
                        sqlData = [["", userID, "vehicle", 0, "available"]];
                    mysqlConn.insertQuery(dbConn.properties_table, sql, [sqlData], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                        if(response != "error") {
                            lastAlgo = "@MUVI3.1"
                            sql = "SELECT MAX(propertyID) propertyID FROM properties";
                            mysqlConn.selectQuery(dbConn.properties_table, sql, [], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                                if(response != "error") {
                                    responseObj = serverResponse.serverResponse(200);
                                    responseObj.response = response;
                                    responseObj.isSuccess = true;
                                    resolve(responseObj);
                                }
                                else {
                                    responseObj = serverResponse.serverResponse(500);
                                    responseObj.isSuccess = false;
                                    resolve(responseObj);
                                }
                            })
                        }
                        else {
                            responseObj = serverResponse.serverResponse(500);
                            responseObj.isSuccess = false;
                            resolve(responseObj);
                        }
                    })
                });
                
                const vehicleID = await new Promise((resolve, reject) => {
                    lastAlgo = "@MUVI4";
                    let sql = "INSERT INTO vehicles VALUES?",
                        sqlData = [["", propertyID.response[0].propertyID, owner, mobileNo, brand, model, location, downpayment, installmentPaid, installmentDuration, delinquent, description]];
                    mysqlConn.insertQuery(dbConn.vehicles_table, sql, [sqlData], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                        if(response != "error") {
                            lastAlgo = "@MUVI4.1";
                            sql = "SELECT MAX(vehicleID) vehicleID FROM vehicles";
                            mysqlConn.selectQuery(dbConn.vehicles_table, sql, [], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                                if(response != "error") {
                                    responseObj = serverResponse.serverResponse(200);
                                    responseObj.isSuccess = true;
                                    responseObj.response = response;
                                    resolve(responseObj);
                                }
                                else {
                                    responseObj = serverResponse.serverResponse(500);
                                    responseObj.isSuccess = false;
                                    resolve(responseObj);
                                }
                            })
                        }
                        else {
                            responseObj = serverResponse.serverResponse(500);
                            responseObj.isSuccess = false;
                            resolve(responseObj);
                        }
                    })
                });
                if(vehicleID.isSuccess) {
                    responseObj = serverResponse.serverResponse(200);
                    responseObj.message = "vehicle-info";
                    responseObj.propertyID = vehicleID.response[0].vehicleID;
                    res.json(responseObj);
                }
                else {
                    responseObj = serverResponse.serverResponse(500);
                    responseObj.message = "We can not process your request."
                    responseObj.vehicleID = 0;
                    res.json(responseObj);
                }
            }
            else {
                responseObj = {
                    code: 500,
                    status: 0,
                    message: "Some fields are missing.",
                    vehicleID: 0
                }
                res.json(responseObj);
            }
        }
        catch(erorr) {
            commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `${lastAlgo}-${erorr}`)
            responseObj = serverResponse.serverResponse(500);
            return res.json(responseObj);
        }
    });
router.route("/mobile-upload-vehicle-image")
    .post(async (req, res) => {
        const GLOBAL_FUNCTION_NAME = "mobileUploadVehicleImage()";
        var lastAlgo = "@MUVI1",
            responseObj = {};
        try{
            var form = new formidable.IncomingForm();
            
            let execIMG = await new Promise((resolve, reject) => {
                lastAlgo = "@MUVI2";
                let fileIMG = [],
                    fileFields = {};

                form.parse(req, (error, fields, files) => {
                    fileFields = fields;
                });
                form.on("fileBegin", (fk, fv) => {
                    fv.filepath = "uploads/vehicles/"+fv.originalFilename;
                      fileIMG.push(fv.filepath);
                });
                setTimeout(() => {
                    resolve({fileIMG, fileFields});
                }, 1500);
            });
            
            let saveVehicleIMGSResponse = await new Promise((resolve, reject) => {
                lastAlgo = "@MUVI4";
                let sql = "INSERT INTO vehicle_images VALUES?";
                const { fileFields } = execIMG;
                
                mysqlConn.insertQuery(dbConn.vehicle_images_table, sql, [[["", fileFields.propertyID, JSON.stringify(execIMG.fileIMG)]]], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                    if(response === "success") {
                        responseObj = serverResponse.serverResponse(200);
                        responseObj.message = "Property was uploaded successfully."
                        responseObj.isSuccess = true;
                        responseObj.propertyID = 0;
                        resolve(responseObj);
                    }
                    else {
                        responseObj = serverResponse.serverResponse(500);
                        responseObj.message = "Uploading has fail.";
                        responseObj.isSuccess = false;
                        responseObj.propertyID = 0;
                        resolve(responseObj);
                    }
                })
            });
            res.json(saveVehicleIMGSResponse);
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `${lastAlgo}-${error}`);
            responseObj = serverResponse.serverResponse(500);
            res.json(responseObj);
        }
    });
/* END OF ADDING VEHICLE INFO */
router.route("/mobile-upload-realestate-info")
    .post(async (req, res) => {
        const GLOBAL_FUNCTION_NAME = "mobileUploadRealestateInfo()";
        var lastAlgo = "@MURI1",
            responseObj = {};
        try{
            var { realForm, userID } = req.body;
            realForm = JSON.parse(realForm);
            const { owner, mobileNo, location, downpayment, installmentpaid, installmentduration, delinquent, realestateType, description } = realForm;
            const validateFields = [owner, mobileNo, location, downpayment, installmentpaid, installmentduration, delinquent],
                validationLen = validateFields.length;
            var validationPass = true;
                
            for(let i = 0; i < validationLen; i++) {
                if(!/[^\s]/.test(validateFields[i])) {
                    validationPass = false;
                    break;
                }
            }

            if(validationPass) {
                const propertyID = await new Promise((resolve, reject) => {
                    lastAlgo = "@MURI2";
                    let sql = "INSERT INTO properties VALUES?",
                        sqlData = [["", userID, "realestate", 0, "available"]];

                    mysqlConn.insertQuery(dbConn.properties_table, sql, [sqlData], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                        if(response != "error") {
                            lastAlgo = "@MURI2.1";
                            sql = "SELECT MAX(propertyID) propertyID FROM properties";
                            mysqlConn.selectQuery(dbConn.properties_table, sql, [], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                                if(response != "error") {
                                    responseObj = serverResponse.serverResponse(200);
                                    responseObj.response = response;
                                    responseObj.isSuccess = true;
                                    resolve(responseObj);
                                }
                                else {
                                    responseObj = serverResponse.serverResponse(500);
                                    responseObj.propertyID = 0;
                                    responseObj.isSuccess = false;
                                    resolve(responseObj);
                                }
                            });
                        }
                        else {
                            responseObj = serverResponse.serverResponse(500);
                            responseObj.isSuccess = false;
                            responseObj.propertyID = 0;
                            resolve(responseObj);
                        }
                    })
                });
                const realestateID = await new Promise((resolve, reject) => {
                    lastAlgo = "@MURI3";
                    let sql = "INSERT INTO realestates VALUES?",
                        sqlData = [["", propertyID.response[0].propertyID, owner, mobileNo, location, downpayment, installmentpaid, installmentduration, delinquent, realestateType, description]];
                    mysqlConn.insertQuery(dbConn.realestates_table, sql, [sqlData], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                        if(response != "error") {
                            lastAlgo = "@MURI3.1";
                            sql = "SELECT MAX(realestateID) realestateID FROM realestates";
                            mysqlConn.selectQuery(dbConn.realestates_table, sql, [], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                                if(response != "error") {
                                    responseObj = serverResponse.serverResponse(200);
                                    responseObj.isSuccess = true;
                                    responseObj.realestateID = response[0].realestateID;
                                    resolve(responseObj);
                                }
                                else {
                                    responseObj = serverResponse.serverResponse(500);
                                    responseObj.isSuccess = false;
                                    responseObj.realestateID = 0;
                                    resolve(responseObj);
                                }
                            });
                        }
                        else {
                            responseObj = serverResponse.serverResponse(500);
                            responseObj.isSuccess = false;
                            responseObj.realestateID = 0;
                            resolve(responseObj);
                        }
                    });
                });
                if(realestateID.isSuccess) {
                    responseObj = serverResponse.serverResponse(200);
                    responseObj.message = "realestate-info";
                    responseObj.propertyID = realestateID.realestateID;
                    res.json(responseObj);
                }
                else {
                    responseObj = serverResponse.serverResponse(500);
                    responseObj.message = "We can not process your request."
                    responseObj.propertyID = 0;
                    res.json(responseObj);
                }
            }
            else {
                responseObj = serverResponse.serverResponse(500);
                responseObj.message = "Some fields are missing.";
                responseObj.propertyID = 0;
                res.json(responseObj);
            }
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `${lastAlgo}-${error}`);
            responseObj = serverResponse.serverResponse(500);
            res.json(responseObj);
        }
    });
router.route("/mobile-upload-realestate-image")
    .post(async (req, res) => {
        const GLOBAL_FUNCTION_NAME = "mobileUploadRealestateImage()";
        var lastAlgo = "@MURIMG1",
            responseObj = {};

        var form = new formidable.IncomingForm();
        const execIMG = await new Promise((resolve, reject) => {
            var fileIMG = [],
                fileFields = {};

            form.parse(req, (error, fields, files) => {
                fileFields = fields;
            });
            form.on("fileBegin", (fk, fv) => {
                fv.filepath = "uploads/realestates/"+fv.originalFilename;
                fileIMG.push(fv.filepath);
            });
            setTimeout(() => {
                resolve({
                    fileFields,
                    fileIMG
                });
            }, 1000);
        });
        const { fileFields, fileIMG } = execIMG;
        let sql = "INSERT INTO realestate_images VALUES?",
            sqlData = [["", fileFields.propertyID, JSON.stringify(fileIMG)]];
        mysqlConn.insertQuery(dbConn.realestates_images_table, sql, [sqlData], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
            if(response != "error") {
                responseObj = serverResponse.serverResponse(200);
                responseObj.message = "Property was uploaded successfully."
                responseObj.isSuccess = true;
                responseObj.propertyID = 0;
                res.json(responseObj);
            }
            else {
                responseObj = serverResponse.serverResponse(500);
                responseObj.message = "Uploading has fail.";
                responseObj.isSuccess = false;
                responseObj.propertyID = 0;
                res.json(responseObj);
            }
        })
    });
/* END OF ADDING REALESTATE */

router.route("/mobile-upload-jewelry-info")
    .post(async (req, res) => {
        const GLOBAL_FUNCTION_NAME = "mobileUploadJewelryInfo()";
        var lastAlgo = "@MUJI1",
            responseObj = {};
        try{
            lastAlgo = "@MUJI2";
            let { jewelryForm, userID } = req.body;
            jewelryForm = JSON.parse(jewelryForm);
            const { owner, cellNo, jewelryName, jewelryModel, location, downpayment, installmentpaid, installmentduration, delinquent, description } = jewelryForm;
            const propertyID = await new Promise((resolve, reject) => {
                let sql = "INSERT INTO properties VALUES?",
                sqlData = [["", userID, "jewelry", 0, "available"]];

                mysqlConn.insertQuery(dbConn.properties_table, sql, [sqlData], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                    if(response != "error") {
                        lastAlgo = "@MUJI2.1";
                        sql = "SELECT MAX(propertyID) propertyID FROM properties";
                        mysqlConn.selectQuery(dbConn.properties_table, sql, [], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                            if(response != "error") {
                                responseObj = serverResponse.serverResponse(200);
                                responseObj.isSuccess = true;
                                responseObj.propertyID = response[0].propertyID;
                                resolve(responseObj);
                            }
                            else {
                                responseObj = serverResponse.serverResponse(500);
                                responseObj.isSuccess = false;
                                responseObj.propertyID = 0;
                                resolve(responseObj);
                            }
                        });
                    }
                    else {
                        responseObj = serverResponse.serverResponse(500);
                        responseObj.isSuccess = false;
                        responseObj.propertyID = 0;
                        resolve(responseObj);
                    }
                });
            });

            const jewelryID = await new Promise((resolve, reject) => {
                lastAlgo = "@MUJI3";
                let sql = "INSERT INTO jewelries VALUES?",
                    sqlData = [["", propertyID.propertyID, owner, cellNo, jewelryName, jewelryModel, location, downpayment, installmentpaid, installmentduration, delinquent, description]];
                mysqlConn.insertQuery(dbConn.jewelries_table, sql, [sqlData], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                    if(response != "error") {
                        lastAlgo = "@MUJI3.1";
                        sql = "SELECT MAX(jewelryID) jewelryID FROM jewelries";
                        mysqlConn.selectQuery(dbConn.jewelries_table, sql, [], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                            if(response != "error") {
                                responseObj = serverResponse.serverResponse(200);
                                responseObj.isSuccess = true;
                                responseObj.propertyID = response[0].jewelryID;
                                resolve(responseObj);
                            }
                            else {
                                responseObj = serverResponse.serverResponse(500);
                                responseObj.isSuccess = false;
                                responseObj.propertyID = 0;
                                resolve(responseObj);
                            }
                        })
                    }
                    else {
                        responseObj = serverResponse.serverResponse(500);
                        responseObj.isSuccess = false;
                        responseObj.propertyID = 0;
                        resolve(responseObj);
                    }
                })
            });
            
            if(jewelryID.isSuccess) {
                jewelryID.message = "jewelry-info";
                res.json(jewelryID); // jewelryID should be name into jewelryInformationResponse; -_-
            }
            else {
                jewelryID.message = "We can not process your request.";
                res.json(jewelryID); // jewelryID holds all the object information;
            }
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `${lastAlgo}-${error}`);
            responseObj = serverResponse.serverResponse(500);
            res.json(responseObj);
        }
    });

router.route("/mobile-upload-jewelry-image")
    .post(async (req, res) => {
        const GLOBAL_FUNCTION_NAME = "mobileUploadJewelryImage()";
        var lastAlgo = "@MUJI1",
            responseObj = {};

        var form = new formidable.IncomingForm();
        var fileIMG = [],
            fileFields = {};

        const execIMG = await new Promise((resolve, reject) => {
            form.parse(req, (error, fields, files) => {
                fileFields = fields;
            });
            form.on("fileBegin", (fk, fv) => {
                fv.filepath = "uploads/jewelries/"+fv.originalFilename;
                fileIMG.push(fv.filepath);
            });

            setTimeout(() => {
                resolve({
                    fileIMG,
                    fileFields
                })
            }, 1000);
        });
        
        var { fileIMG, fileFields } = execIMG;
        let sql = "INSERT INTO jewelry_images VALUES?",
            sqlData = [["", fileFields.propertyID, JSON.stringify(fileIMG)]];
        mysqlConn.insertQuery(dbConn.jewelries_images_table, sql, [sqlData], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
            if(response != "error") {
                responseObj = serverResponse.serverResponse(200);
                responseObj.message = "Property was uploaded successfully."
                responseObj.isSuccess = true;
                responseObj.propertyID = 0;
                res.json(responseObj);
            }
            else {
                responseObj = serverResponse.serverResponse(500);
                responseObj.message = "Uploading has fail.";
                responseObj.isSuccess = false;
                responseObj.propertyID = 0;
                res.json(responseObj);
            }
        });
    })
/* END OF ADDING JEWELRY */
module.exports = router;