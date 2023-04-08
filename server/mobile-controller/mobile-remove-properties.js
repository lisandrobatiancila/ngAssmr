const express = require("express");
const router = express.Router();
const mysqlController = require("../db/mysqlController");
const mysqlConn = require("../db/dbConnection");
const serverResponse = require("../common/serverResonses");
const commonLib = require("../common/commonFunction");

const GLOBAL_FILE_NAME = "mobile-remove-properties.js";
router.route("/mobile-remove-vehicle")
    .post((req, res) => {
        const GLOBAL_FUNCTION_NAME = "mobileRemoveVehicle()";
        var lastAlgo = "@MRV1",
            responseObj = {};
        try{
            const { propertyID, propertyType } = req.body;
            let query = "";
            let querydata = [];

            switch(propertyType) {
                case "vehicle":
                    lastAlgo = "@MRV2";
                    query = "UPDATE properties set propertyStatus = 'removed' WHERE propertyID =?";
                    querydata = [propertyID];
                    mysqlController.updateQuery(mysqlConn.properties_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                        if(response != "error") {
                            responseObj = serverResponse.serverResponse(200);
                            res.json(responseObj);
                        }
                        else {
                            responseObj = serverResponse.serverResponse(500);
                            res.json(responseObj);
                        }
                    });
                break;
                case "realestate":
                break;
                case "jewelry":
                break;
                default:
                    console.log("no propertyType");
            }
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `${lastAlgo}-${error}`);
            responseObj = serverResponse.serverResponse(500);
            res.json(responseObj);
        }
    })

router.route("/mobile-remove-realestates")
    .post((req, res) => {
        const GLOBAL_FUNCTION_NAME = "mobileRemoveRealestates()";
        var lastAlgo = "@MRR1",
            responseObj = {};
        try{
            const { propertyID } = req.body;
            const query = "UPDATE properties set propertyStatus = 'removed' WHERE propertyID =?",
                querydata = [propertyID];

            mysqlController.updateQuery(mysqlConn.properties_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                if(response != "error") {
                    responseObj = serverResponse.serverResponse(200);
                    res.json(responseObj);
                }
                else {
                    responseObj = serverResponse.serverResponse(500);
                    res.json(responseObj);
                }
            });
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `${lastAlgo}-${error}`);
            responseObj = serverResponse.serverResponse(500);
            res.json(responseObj);
        }
    });

router.route("/mobile-remove-jewelry")
    .post((req, res) => {
        const GLOBAL_FUNCTION_NAME = "mobileRemoveJewelry()";
        var lastAlgo = "@MRJ1",
            responseObj = {};
        try{
            const { propertyID } = req.body;
            const query = "UPDATE properties SET propertyStatus ='removed' WHERE propertyID =?",
                querydata = [propertyID];
            mysqlController.updateQuery(mysqlConn.properties_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                if(response != "error") {
                    responseObj = serverResponse.serverResponse(200);
                    res.json(responseObj);
                }
                else {
                    responseObj = serverResponse.serverResponse(500);
                    res.json(responseObj);
                }
            })
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `${lastAlgo}-${error}`);
            responseObj = serverResponse.serverResponse(500);
            res.json(responseObj);
        }
    });

module.exports = router;