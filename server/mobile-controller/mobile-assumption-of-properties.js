const express = require("express");
const router = express.Router();
const commobLib = require("../common/commonFunction");
const serverResponse = require("../common/serverResonses");
const dbConn = require("../db/dbConnection");
const mysqlConn = require("../db/mysqlController");

const GLOBAL_FILE_NAME = "assumption-of-properties.js";

router.route("/vehicle-property-lists/:propStartID")
    .get((req, res) => {
        const GLOBAL_FUNCTION = "vehicleAssumptionPropertyLists()";
        var repsonseObj = {},
            lastAlgo = "@VAPL1";
        try{
            lastAlgo = "@VAPL2";
        
            let sql = "SELECT a.vehicleID, a.propertyID, a.vehicleOwner, a.vehicleBrand, a.vehicleModel, a.vehicleLocation, b.vehicleIMAGES, c.assumptionCount, c.propertyStatus FROM vehicles a INNER JOIN vehicle_images b ON a.vehicleID = b.vehicleID INNER JOIN properties c ON c.propertyID = a.propertyID AND c.propertyStatus = 'available'  WHERE a.vehicleID > ? LIMIT 10 \
                ";
            let { propStartID } = req.params;

            mysqlConn.selectQuery(dbConn.vehicles_table, sql, [propStartID], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response != "error") {
                    repsonseObj = {
                        code: 200,
                        status: 1,
                        message: "SUCCESS",
                        vehiclesList: response
                    };

                    return res.json(repsonseObj);
                }
                else {
                    repsonseObj = serverResponse.serverResponse(300);
                    return res.json(repsonseObj);
                }
            })
        }
        catch(error) {
            commobLib.errorLogs(GLOBAL_FILE_NAME, `${GLOBAL_FUNCTION}`, `${lastAlgo}-${error}`);
            repsonseObj = serverResponse.serverResponse(500);
            return res.json(repsonseObj);
        }
    });

router.route("/realestate-property-lists/:propStartID")
    .get((req, res) => {
        var GLOBAL_FUNCTION = "realestatePropertyLists()";
        var repsonseObj = {},
            lastAlgo = "@RPL1";
        try{
            lastAlgo = "@RPL2";
            let sql = "SELECT a.realestateID, c.propertyID, a.realestateOwner, a.realestateLocation, a.realestateType, c.assumptionCount, c.propertyStatus, b.realestateIMG FROM realestates a INNER JOIN realestate_images b ON a.realestateID = b.realestateID INNER JOIN properties c ON c.propertyID = a.propertyID WHERE c.propertyStatus = 'available' AND a.realestateID > ? LIMIT 10";

            const { propStartID } = req.params;

            mysqlConn.selectQuery(dbConn.realestates_table, sql, [propStartID], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response != "error") {
                    repsonseObj = {
                        status: 1,
                        code: 200,
                        message: serverResponse.serverResponse(200).message,
                        realestateLists: response
                    };
                    return res.json(repsonseObj);
                }
                else {
                    repsonseObj = serverResponse.serverResponse(500);
                    repsonseObj.realestateLists = [];
                    return res.json(repsonseObj);
                }
            })
        }
        catch(error) {
            commobLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error}`);
            repsonseObj = serverResponse.serverResponse(500);
            return res.json(repsonseObj);
        }
    });

router.route("/jewelries-properry-lists/:propStartID")
    .get((req, res) => {
        var GLOBAL_FUNCTION = "jewelryPropertyLists()";
        var repsonseObj = {},
            lastAlgo = "@JPL1";
        try{
            let sql = "SELECT a.jewelryID, c.propertyID, a.jewelryOwner, a.jewelryName, a.jewelryModel, a.jewelryLocation, c.assumptionCount, c.propertyStatus, b.jewelryIMG FROM jewelries a INNER JOIN jewelry_images b ON a.jewelryID = b.jewelryID INNER JOIN properties c ON a.propertyID = c.propertyID WHERE c.propertyStatus = 'available'";
            let { propStartID } = req.params,
                sqlData = [propStartID];
                
            mysqlConn.selectQuery(dbConn.jewelries_table, sql, sqlData, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response != "error") {
                    repsonseObj = serverResponse.serverResponse(200);
                    repsonseObj.jewelryLists = response;
                    return res.json(repsonseObj);
                }
                else {
                    repsonseObj = serverResponse.serverResponse;
                    repsonseObj.jewelryLists = [];
                    return res.json(repsonseObj);
                }
            })
        }
        catch(error) {
            commobLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error}`);
            repsonseObj = serverResponse.serverResponse(500);
            return res.json(repsonseObj);
        }
    });

router.post("/assumer-info", (req, res) => {

});

module.exports = router;