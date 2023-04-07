const express = require("express");
const router = express.Router();
const common = require("../common/commonFunction");
const serverResonses = require("../common/serverResonses");
const mysqlController = require("../db/mysqlController");
const mysqlConn = require("../db/dbConnection");

const GLOBAL_FILE_NAME = "mobile-my-property.js";

router.route("/mobile-my-vehicle-properties")
    .post((req, res) => {
        const GLOBAL_FUNCTION_NAME = "mobileMyVehicleProperties()";
        var lastAlgo = "@MVP1",
            responseObj = {};
        try{
            lastAlgo = "@MVP2";
            const { userID } = req.body;
            const query = "SELECT a.*, c.assumptionCount, c.propertyStatus, b.vehicleIMAGES FROM vehicles a INNER JOIN vehicle_images b ON a.vehicleID = b.vehicleID INNER JOIN properties c ON a.propertyID = c.propertyID \
            AND c.userID =? AND c.propertyType = 'vehicle' AND c.propertyStatus <> 'removed'",
                querydata = [userID];

            mysqlController.selectQuery(mysqlConn.vehicles_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                lastAlgo = "@MVP3";
                if(response != "error") {
                    responseObj = serverResonses.serverResponse(200);
                    responseObj.myVehicleLists = response;

                    res.json(responseObj);
                }
                else {
                    common.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `Error getting vehicle recrods-> ${lastAlgo}`);
                    responseObj = serverResonses.serverResponse(500);
                    responseObj.myVehicleLists = [];
                    res.json(responseObj);
                }
            })
        }
        catch(error) {
            common.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `${lastAlgo}-${error}`);
            responseObj = serverResonses.serverResponse(500);
            res.json(responseObj);
        }
    });


router.route("/mobile-my-jewelry-properties")
    .post((req, res) => {
        const GLOBAL_FUNCTION_NAME = "mobileMyJewelryProperties()";
        var lastAlgo = "",
            responseObj = {};
        try{
            const { userID } = req.body;
            const query = "SELECT a.*, b.jewelryIMG, c.assumptionCount, c.propertyStatus FROM jewelries a INNER JOIN jewelry_images b ON a.jewelryID = b.jewelryID INNER JOIN properties c ON c.propertyID = a.propertyID AND c.propertyType = 'jewelry' AND c.userID = ? AND c.propertyStatus <> 'removed'",
                querydata = [userID];
            
            mysqlController.selectQuery(mysqlConn.jewelries_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                if(response != "error") {
                    responseObj = serverResonses.serverResponse(200);
                    responseObj.myJewelryLists = response;

                    res.json(responseObj);
                }
                else {
                    responseObj = serverResonses.serverResponse(500);
                    responseObj.myJewelryLists = [];
                    res.json(responseObj);
                }
            })
        }
        catch(error) {
            common.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `${lastAlgo}-> ${error}`);
            responseObj = serverResonses.serverResponse(500);
            res.json(responseObj);
        }
    });

router.route("/mobile-my-realestate-properties")
    .post((req, res) => {
        const GLOBAL_FUNCTION_NAME = "mobileMyRealestateProperties()";
        var responseObj = {},
            lastAlgo = "@MMRP1";
        try{
            lastAlgo = "@MMRP2";
            const { userID } = req.body;
            
            var query = "SELECT a.*, b.realestateIMG, c.assumptionCount, c.propertyStatus FROM realestates a INNER JOIN realestate_images b ON a.realestateID = b.realestateID INNER JOIN properties c ON a.propertyID = c.propertyID WHERE c.userID = ? AND c.propertyStatus <> 'removed' AND c.propertyType = 'realestate'",
                querydata = [userID];

            mysqlController.selectQuery(mysqlConn.realestates_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                if(response != "error") {
                    responseObj = serverResonses.serverResponse(200);
                    responseObj.myRealestateLists = response;
                    res.json(responseObj);
                }
                else {
                    responseObj = serverResonses.serverResponse(500);
                    responseObj.myRealestateLists = [];

                    res.json(responseObj);
                }
            })
        }
        catch(error) {
            common.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `${lastAlgo}-${error}`);
            responseObj = serverResonses.serverResponse(500);
            res.json(responseObj);
        }
    });

module.exports = router;