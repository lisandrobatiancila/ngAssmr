const express = require("express");
const router = express.Router();
const mysqlController = require("../db/mysqlController");
const mysqlConn = require("../db/dbConnection");
const serverResonses = require("../common/serverResonses");
const commonlib = require("../common/commonFunction");

const GLOBAL_FILE_NAME = "mobile-update-property.js";
router.route("/update-vehicle-property")
    .post((req, res) => {
        const GLOBAL_FUNCTION_NAME = "updateVehicleProperty()";
        var lastAlgo = "@MUP1",
            responseObj = {};
        try{
            lastAlgo = "@MUP2";
            const { propertyID, owner, contactno, brand, model, location, downpayment, installmentpaid, 
                installmentduration, delinquent, description } = req.body;

            const query = "UPDATE vehicles SET vehicleOwner =?, vehicleContactno =?, vehicleBrand =?, vehicleModel =?, vehicleLocation =?, vehicleDownpayment =?, vehicleInstallmentpaid =?, vehicleInstallmentDuration =?, vehicleDelinquent =?, description =? WHERE propertyID =?",
                querydata = [owner, contactno, brand, model, location, downpayment, installmentpaid, installmentduration, delinquent, description, String(propertyID)];
                
            mysqlController.updateQuery(mysqlConn.vehicles_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
                if(response != "error") {
                    responseObj = serverResonses.serverResponse(200);
                    res.json(responseObj);
                }
                else {
                    responseObj = serverResonses.serverResponse(500);
                    res.json(responseObj);
                }
            });
        }
        catch(error) {
            commonlib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, `${lastAlgo}-${error}`);
            responseObj = serverResonses.serverResponse(500);
            res.json(responseObj);
        }
    });

module.exports = router;