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

router.route("/update-realestate-property")
    .post((req, res) => {
        const GLOBAL_FUNCTION_NAME = "updateRealestateProperty()";
        var lastAlgo = "@URP1",
            responseObj = {};
        try{
            const { propertyID, owner, contactno, location, downpayment, paid, duration, delinquent, description } = req.body;
            const query = "UPDATE realestates SET realestateOwner =?, realestateContactno =?, realestateLocation =?, realestateDownpayment =?, realestateInstallmentpaid =?, realestateInstallmentduration =?, realestateDelinquent =?, realestateDescription =? WHERE propertyID =?",
                querydata = [owner, contactno, location, downpayment, paid, duration, delinquent, description, propertyID];
            mysqlController.updateQuery(mysqlConn.realestates_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (response) => {
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

router.route("/update-jewelry-property")
    .post((req, res) => {
        const GLOBAL_FUNCTION_NAME = "updateJewelryProperty()";
        var lastAlgo = "@UJP1",
            responseObj = {};
        try{
            lastAlgo = "@UJP2";
            const { owner, contactno, jname, jmodel, location, downpayment, installmentpaid, installmentduration, delinquent, description, propertyID } = req.body;
            
            const query = "UPDATE jewelries SET jewelryOwner =?, jewelryContactno =?, jewelryName =?, jewelryModel =?, jewelryLocation =?, jewelryDownpayment =?, jewelryInstallmentpaid =?, jewelryInstallmentduration =?, jewelryDelinquent =?, jewelryDescription = ? WHERE propertyID =?",
                querydata = [owner, contactno, jname, jmodel, location, downpayment, installmentpaid, installmentduration, delinquent, description, propertyID];
            mysqlController.updateQuery(mysqlConn.jewelries_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION_NAME, lastAlgo], (respones) => {
                if(respones != "error") {
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