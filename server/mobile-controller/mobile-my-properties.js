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
            AND c.userID =? AND c.propertyType = 'vehicle'",
                querydata = [userID];

            mysqlController.selectQuery(mysqlConn.vehicles_table, query, querydata, `${GLOBAL_FILE_NAME}-> ${GLOBAL_FUNCTION_NAME}-> ${lastAlgo}`, (response) => {
                lastAlgo = "@MVP3";
                if(response != "error") {
                    responseObj = serverResonses.serverResponse(200);
                    responseObj.myVehicleLists = response;

                    res.json(responseObj);
                }
                else {
                    common.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `Error getting vehicle recrods-> ${lastAlgo}`);
                    responseObj = serverResonses.serverResponse(500);
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