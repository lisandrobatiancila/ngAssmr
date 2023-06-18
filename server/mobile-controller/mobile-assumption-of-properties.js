const express = require("express");
const router = express.Router();
const commobLib = require("../common/commonFunction");
const serverResponse = require("../common/serverResonses");
const dbConn = require("../db/dbConnection");
const mysqlConn = require("../db/mysqlController");
const addressLists = require("./address-lists");

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
    }); // get all vehicle properties

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
    }); // get all realestate properties

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
    }); // get all jewelry properties

router.post("/assumer-info", (req, res) => {

}); // get assumer info if they want to assume

router.route("/get-certain-vehicle/:propertyID")
    .get((req, res) => {
        const GLOBAL_FUNCTION = "getCertainVehicle()";
        var lastAlgo = "",
            repsonseObj = {};
            
        try{
            const { propertyID } = req.params;
            const query = "SELECT a.*, b.assumptionCount, b.propertyStatus, c.vehicleIMAGES FROM vehicles a INNER JOIN properties b ON a.propertyID = b.propertyID INNER JOIN vehicle_images c ON a.vehicleID = c.vehicleID AND a.propertyID = ?",
                querydata = [propertyID];

            mysqlConn.selectQuery(dbConn.vehicles_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response != "error") {
                    repsonseObj = serverResponse.serverResponse(200);
                    repsonseObj.vehicle = response;
                    res.json(repsonseObj);
                }
                else {
                    repsonseObj = serverResponse.serverResponse(500);
                    res.json(repsonseObj);
                }
            });
        }
        catch(error) {
            commobLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error}`);
            repsonseObj = serverResponse.serverResponse(500);
            res.json(repsonseObj);
        }
    }); // get a certain vehicle property

router.route("/get-certain-realestate/:propertyID")
    .get((req, res) => {
        const GLOBAL_FUNCTION ="getCertainRealestate()";
        var lastAlgo = "@GCR1",
            repsonseObj = {};
        try{
            lastAlgo = "@GCR2";
            const { propertyID } = req.params;
            const query = "SELECT a.*, b.assumptionCount, b.propertyStatus, c.realestateIMG FROM realestates a INNER JOIN properties b ON a.propertyID = b.propertyID INNER JOIN realestate_images c ON a.realestateID = c.realestateID AND b.propertyID = ?";
            const querydata = [propertyID];

            mysqlConn.selectQuery(dbConn.realestates_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response != "error") {
                    repsonseObj = serverResponse.serverResponse(200);
                    repsonseObj.realestate = response;
                    res.json(repsonseObj);
                }
                else {
                    repsonseObj = serverResponse.serverResponse(500);
                    res.json(repsonseObj);
                }
            });
        }
        catch(error) {
            commobLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error}`);
            repsonseObj = serverResponse.serverResponse(500);
            res.json(repsonseObj);
        }
    }); // get a certain realestate property

router.route("/get-certain-jewelry/:propertyID")
    .get((req, res) => {
        const GLOBAL_FUNCTION = "getCertainJewelry()";
        var lastAlgo = "",
            repsonseObj = {};
        try{
            const { propertyID } = req.params;
            const query = "SELECT a.*, b.assumptionCount, b.propertyStatus, c.jewelryIMG FROM jewelries a INNER JOIN properties b ON a.propertyID = b.propertyID INNER JOIN jewelry_images c ON a.jewelryID = c.jewelryID AND b.propertyID = ?";
            const querydata = [propertyID];

            mysqlConn.selectQuery(dbConn.jewelries_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response != "error") {
                    repsonseObj = serverResponse.serverResponse(200);
                    repsonseObj.jewelry = response;
                    res.json(repsonseObj);
                }
                else {
                    repsonseObj = serverResponse.serverResponse(500);
                    res.json(repsonseObj);
                }
            });
        }
        catch(error) {
            commobLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error}`);
            repsonseObj = serverResponse.serverResponse(500);
            res.json(repsonseObj);
        }
    }); // get a certain jewelry property

router.route("/get-assumer-information/:userID")
    .get((req, res) => {
        const GLOBAL_FUNCTION ="getAssumerInformation()";
        var lastAlgo = "",
            repsonseObj = {};
        try{
            const { userID } = req.params;
            const query = "SELECT userFname, userMname, userLname, userAddress, userContactno FROM users WHERE userID =?",
                querydata = [userID];
            mysqlConn.selectQuery(dbConn.users_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response != "error") {
                    repsonseObj = serverResponse.serverResponse(200);
                    repsonseObj.assumerInfoModels = response;
                    repsonseObj.addressInfoModels = addressLists;
                    res.json(repsonseObj);
                }
                else {
                    repsonseObj = serverResponse.serverResponse(500);
                    res.json(repsonseObj);
                }
            })
        }
        catch(error) {
            commobLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error}`);
            repsonseObj = serverResponse.serverResponse(500);
            res.json(repsonseObj);
        }
    }); // get assumer-information

router.route("/process-assumption-request")
    .post((req, res) => {
        const GLOBAL_FUNCTION = "processAssumptionRequest()";
        var repsonseObj = {},
            lastAlgo = "@PAR1";
        try{
            const { userID, propertyID, firstname, middlename, lastname, contactno, address, salary, work } = req.body;
            const fields = [firstname, middlename, lastname, contactno, address, salary, work],
                fieldsLen = fields.length;
            const is_passed = true;
            for(let i = 0; i < fieldsLen; i++) {
                if(!/[^\s]/.test(fields[i])) {
                    is_passed = false;
                    break;
                }
            } // end of for loop
            if(is_passed) {
                lastAlgo = "@PAR2";
                let query = "SELECT userID, propertyID FROM properties WHERE propertyID =? AND userID =?",
                    querydata = [propertyID, userID];
                mysqlConn.selectQuery(dbConn.properties_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], async (response) => {
                    if(response != "error") {
                        if(response.length == 0) {
                            // check if the user assumed this property already; we need to refraint it from assuming again
                            const checkAssumption = await new Promise((resolve, reject) => {
                                lastAlgo = "@PAR3";
                                const sql = "SELECT assumptionID FROM assumptions WHERE propertyID =? AND userID =?";
                                mysqlConn.selectQuery(dbConn.assumptions_table, sql, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                                    if(response != "error") {
                                        if(response.length == 0) {
                                            resolve({server_error: false, should_assume: true})
                                        }
                                        else {
                                            resolve({server_error: false, should_assume: false})
                                        }
                                    }
                                    else {
                                        commobLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo);
                                        resolve({server_error: true, should_assume: false})
                                    }
                                })
                            }); // end of promise
                            // end check if the user assumed this property already; we need to refraint it from assuming again

                            if(!checkAssumption.server_error) {
                                if(checkAssumption.should_assume) {
                                    lastAlgo = "@PAR4";
                                    query = "INSERT INTO assumers (userID, assumer_address, assumer_income, assumer_work) VALUES?";
                                    querydata = [[userID, address, salary, work]];
                                    mysqlConn.insertQuery(dbConn.assumers_table, query, [querydata], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                                        if(response != "error") {
                                            lastAlgo = "@PAR4";
                                            query = "SELECT NOW() as now, MAX(assumerID) as assumerID FROM assumers LIMIT 1";
                                            querydata = [[userID, propertyID]];
                                            
                                            mysqlConn.selectQuery(dbConn.assumers_table, query, [], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                                                if(response != "error") {
                                                    lastAlgo = "@PAR5";
                                                    query = "INSERT INTO assumptions(userID, propertyID, assumerID, assumption_status, notification_read, transaction_date) VALUES?";
                                                    
                                                    const { assumerID, now } = response[0];
                                                    querydata = [[userID, propertyID, assumerID, 'ACTIVE', 'unread', now]];

                                                    mysqlConn.insertQuery(dbConn.assumptions_table, query, [querydata], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                                                        if(response != "error") {
                                                            query=  "UPDATE properties SET assumptionCount = (assumptionCount+1) WHERE propertyID =?";
                                                            querydata = [propertyID]
                                                            
                                                            mysqlConn.updateQuery(dbConn.properties_table, query, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], function(response) {
                                                                if(response != "error") {
                                                                    repsonseObj = serverResponse.serverResponse(200);
                                                                    repsonseObj.message = "Property assumption was successfull!"
                                                                    res.json(repsonseObj);
                                                                }
                                                                else {
                                                                    repsonseObj = serverResponse.serverResponse(500);
                                                                    response.message = "We can not process your request at a moment!"
                                                                    res.json(repsonseObj);
                                                                }
                                                            })
                                                        }
                                                        else {
                                                            repsonseObj = serverResponse.serverResponse(500);
                                                            response.message = "We can not process your request at a moment!"
                                                            res.json(repsonseObj);
                                                        }
                                                    });
                                                }
                                                else {
                                                    repsonseObj = serverResponse.serverResponse(500);
                                                    response.message = "We can not process your request at a moment!"
                                                    res.json(repsonseObj);
                                                }
                                            });
                                        }
                                        else {
                                            repsonseObj = serverResponse.serverResponse(500);
                                            response.message = "We can not process your request at a moment!"
                                            res.json(repsonseObj);
                                        }
                                    });
                                }
                                else {
                                    repsonseObj = serverResponse.serverResponse(400);
                                    repsonseObj.message = "You can not assume a property twice!"
                                    res.json(repsonseObj);
                                }
                            }
                            else {
                                repsonseObj = serverResponse.serverResponse(500);
                                repsonseObj.message = "Sorry we can not process your request, at this time!"
                                res.json(repsonseObj);
                            }
                            
                        } // check if assumer is the property owner
                        else {
                            repsonseObj = serverResponse.serverResponse(400);
                            repsonseObj.message = "You can not assume your own property!"
                            res.json(repsonseObj);
                        }
                    }
                    else {
                        repsonseObj = serverResponse.serverResponse(500);
                        repsonseObj.message = "You can not assume your own property!"
                        res.json(repsonseObj);
                    }
                });
            }
            else {
                repsonseObj = serverResponse.serverResponse(400); // a bad request
                res.json(repsonseObj);
            }
        }
        catch(error) {
            commobLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error}`);
            repsonseObj = serverResponse.serverResponse(500);
            res.json(repsonseObj);
        }
    }); // user assume a property

module.exports = router;