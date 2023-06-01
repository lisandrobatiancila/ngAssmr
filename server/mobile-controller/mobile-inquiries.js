const express = require("express");
const router = express.Router();
const commonLib = require("../common/commonFunction");
const serverResponse = require("../common/serverResonses");
const dbConn = require("../db/dbConnection");
const mysqlController = require("../db/mysqlController");
const connection = require("../db/dbConnection");

const GLOBAL_FILENAME = "mobile-inquiries.js";

router.route("/get-my-assumptions/:userID")
    .get((req, res) => {
        const GLOBAL_FUNCTIONNAME = "getMyAssumptions()";
        var lastAlgo = "@GMA1",
            resultObj = {};
        try{
            const { userID } = req.params;
            const sql = "SELECT u.userID, u.userEmail, v.vehicleID as ID, p.propertyID as propID, v.vehicleOwner as info1, v.vehicleBrand as info2, v.vehicleModel as info3, vi.vehicleIMAGES as info4, 'vehicle' as info5, p.propertyStatus as info6 FROM vehicles v INNER JOIN vehicle_images vi ON v.vehicleID = vi.vehicleID INNER JOIN properties p ON p.propertyID = v.propertyID INNER JOIN assumptions a ON a.propertyID = p.propertyID JOIN users u ON p.userID = u.userID AND a.userID =? AND a.assumption_status = 'ACTIVE'\
            UNION ALL SELECT u.userID, u.userEmail, j.jewelryID as ID, p.propertyID as propID, j.jewelryOwner as info1, j.jewelryName as info2, j.jewelryModel as info3, ji.jewelryIMG as info4, 'jewelry' as info5, p.propertyStatus as info6 FROM jewelries j INNER JOIN jewelry_images ji ON j.jewelryID = ji.jewelryID INNER JOIN properties p ON p.propertyID = j.propertyID INNER JOIN assumptions a ON a.propertyID = p.propertyID JOIN users u ON p.userID = u.userID AND a.userID =? AND a.assumption_status = 'ACTIVE'\
            UNION ALL SELECT u.userID, u.userEmail, r.realestateID as ID, p.propertyID as propID, r.realestateOwner as info1, r.realestateType as info2, '' as info3, ri.realestateIMG as info4, 'realestate' as info5, p.propertyStatus as info6 FROM realestates r INNER JOIN realestate_images ri ON r.realestateID = ri.realestateID INNER JOIN properties p ON p.propertyID = r.propertyID INNER JOIN assumptions a ON a.propertyID = p.propertyID JOIN users u ON p.userID = u.userID AND a.userID =? AND a.assumption_status = 'ACTIVE'",
                querydata = [userID, userID, userID];
            mysqlController.selectQuery(dbConn.assumptions_table, sql, querydata, [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                if(response != "error") {
                    resultObj = serverResponse.serverResponse(200);
                    resultObj.myassumptions = response;
                    res.json(resultObj);
                }
                else {
                    commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo);
                    resultObj = serverResponse.serverResponse(500);
                    res.json(resultObj);
                }
            });
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, `${lastAlgo}-${error}`)
            resultObj = serverResponse.serverResponse(500);
            res.json(resultObj);
        }
    }); // this get all the property that was assumed by active users

/*
    - the top is My Properties
*/
router.route("/get-my-inquired-properties/:userID")
    .get((req, res) => {
        const GLOBAL_FUNCTIONNAME = "getMyInquiredProperty()";
        var lastAlgo = "@GMIP1",
            resultObj = {};
        try{
            lastAlgo = "@GMIP2";
            const { userID } = req.params;
            const sql = "SELECT a.assumerID, c.userFname, c.userMname, c.userLname, c.userContactno, c.userEmail, b.assumptionCount, b.propertyStatus, vi.vehicleIMAGES as image FROM assumptions a JOIN properties b ON a.propertyID = b.propertyID JOIN users c ON a.userID = c.userID JOIN vehicles v ON v.propertyID = a.propertyID JOIN vehicle_images vi ON v.vehicleID = vi.vehicleID WHERE b.userID = ? AND a.assumption_status = 'ACTIVE' AND b.userID != c.userID UNION ALL SELECT a.assumerID, c.userFname, c.userMname, c.userLname, c.userContactno, c.userEmail, b.assumptionCount, b.propertyStatus, ji.jewelryIMG as image FROM assumptions a JOIN properties b ON a.propertyID = b.propertyID JOIN users c ON a.userID = c.userID JOIN jewelries j ON j.propertyID = a.propertyID JOIN jewelry_images ji ON j.jewelryID = ji.jewelryID WHERE b.userID = ? AND a.assumption_status = 'ACTIVE' AND b.userID != c.userID UNION ALL SELECT a.assumerID, c.userFname, c.userMname, c.userLname, c.userContactno, c.userEmail, b.assumptionCount, b.propertyStatus, ri.realestateIMG as image FROM assumptions a JOIN properties b ON a.propertyID = b.propertyID JOIN users c ON a.userID = c.userID JOIN realestates r ON r.propertyID = a.propertyID JOIN realestate_images ri ON r.realestateID = ri.realestateID WHERE b.userID = ? AND a.assumption_status = 'ACTIVE' AND b.userID != c.userID";
            const querydata = [userID, userID, userID];

            mysqlController.selectQuery(dbConn.users_table, sql, querydata, [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], function(response) {
                if(response != "error") {
                    resultObj = serverResponse.serverResponse(200);
                    resultObj.inquiries = response;
                    
                    res.json(resultObj);
                }
                else {
                    commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, `${lastAlgo}-${error}`)
                    resultObj = serverResponse.serverResponse(500);
                    res.json(resultObj);
                }
            })
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, `${lastAlgo}-${error}`)
            resultObj = serverResponse.serverResponse(500);
            res.json(resultObj);
        }
    }); // this get the active user posted properties that was assumed by other users

/*
    - The top is Inquired Property
*/

router.route("/get-my-certain-assumed-property/:propertyType/:propertyID/:itemID")
    .get((req, res) => {
        const GLOBAL_FUNCTIONNAME = "getCertainAssumedProperty()";
        var lastAlgo = "@GCAP1",
            resultObj = {}
        try {
            const { propertyType, propertyID, itemID } = req.params;
            let sql = "",
                querydata = [];

            switch(propertyType) {
                case "vehicle":
                    sql = "SELECT d.userEmail, e.assumptionID, a.propertyID as propertyID, a.vehicleID  as itemID, a.vehicleOwner as owner, a.vehicleContactno as contactno, a.vehicleLocation as location, a.vehicleDownpayment as downpayment, a.vehicleInstallmentDuration as duration, a.vehicleDelinquent as delinquent, 'vehicle' as propertyType, '' as type, a.description as description, b.vehicleIMAGES as img, c.assumptionCount FROM vehicles a JOIN vehicle_images b ON a.vehicleID = b.vehicleID JOIN properties c ON c.propertyID = a.propertyID JOIN users d ON (d.userID = c.userID) JOIN assumptions e ON (e.propertyID = c.propertyID AND e.propertyID =? AND e.assumption_status = 'ACTIVE') AND a.propertyID = ? AND a.vehicleID = ?";
                    querydata = [propertyID, propertyID, itemID];

                    mysqlController.selectQuery(dbConn.realestates_table, sql, querydata, [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                        if(response != "error") {
                            resultObj = serverResponse.serverResponse(200);
                            resultObj.certainProperty = response;
                            res.json(resultObj);
                        }
                        else {
                            resultObj = serverResponse.serverResponse(500);
                            res.json(resultObj);
                        }
                    });
                break;
                case "realestate":
                    sql = "SELECT d.userEmail, e.assumptionID, a.propertyID as propertyID, a.realestateID  as itemID, a.realestateOwner as owner, a.realestateContactno as contactno, a.realestateLocation as location, a.realestateDownpayment as downpayment, a.realestateInstallmentduration as duration, a.realestateDelinquent as delinquent, 'realestate' as propertyType, a.realestateType as type, a.realestateDescription as description, b.realestateIMG as img, c.assumptionCount FROM realestates a JOIN realestate_images b ON a.realestateID = b.realestateID JOIN properties c ON c.propertyID = a.propertyID JOIN users d ON (d.userID = c.userID) JOIN assumptions e ON (e.propertyID = c.propertyID AND e.propertyID =? AND e.assumption_status = 'ACTIVE') AND a.propertyID = ? AND a.realestateID = ? AND c.propertyStatus = 'available'";
                    querydata = [propertyID, propertyID, itemID];

                    mysqlController.selectQuery(dbConn.realestates_table, sql, querydata, [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                        if(response != "error") {
                            resultObj = serverResponse.serverResponse(200);
                            resultObj.certainProperty = response;
                            res.json(resultObj);
                        }
                        else {
                            resultObj = serverResponse.serverResponse(500);
                            res.json(resultObj);
                        }
                    });
                break;
                case "jewelry":
                    sql = "SELECT d.userEmail, e.assumptionID, a.propertyID as propertyID, a.jewelryID  as itemID, a.jewelryOwner as owner, a.jewelryContactno as contactno, a.jewelryLocation as location, a.jewelryDownpayment as downpayment, a.jewelryInstallmentduration as duration, a.jewelryDelinquent as delinquent, 'jewelries' as propertyType, '' as type, a.jewelryDescription as description, b.jewelryIMG as img, c.assumptionCount FROM jewelries a JOIN jewelry_images b ON a.jewelryID = b.jewelryID JOIN properties c ON c.propertyID = a.propertyID JOIN users d ON (d.userID = c.userID) JOIN assumptions e ON (e.propertyID = c.propertyID AND e.propertyID =? AND e.assumption_status = 'ACTIVE') AND a.propertyID = ? AND a.jewelryID = ? AND c.propertyStatus = 'available'";
                    querydata = [propertyID, propertyID, itemID];

                    mysqlController.selectQuery(dbConn.jewelries_table, sql, querydata, [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                        if(response != "error") {
                            if(response.length > 0) {
                                resultObj = serverResponse.serverResponse(200);
                                resultObj.certainProperty = response;
                                res.json(resultObj);
                            }
                            else {
                                resultObj = serverResponse.serverResponse(300);
                                resultObj.certainProperty = response;
                                res.json(resultObj);
                            }
                        }
                        else {
                            resultObj = serverResponse.serverResponse(500);
                            res.json(resultObj);
                        }
                    });
                break;
                default:
                    commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, `${lastAlgo} - no propertyType`);
                    resultObj = serverResponse.serverResponse(500);
                    res.json(resultObj);
            }
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, `${lastAlgo}-${error}`);
            resultObj = serverResponse.serverResponse(500);
            res.json(resultObj);
        }
    });

router.route("/get-owner-information/:ownerID")
    .get((req, res) => {
        const GLOBAL_FUNCTIONNAME ="getOwnerInformation()";
        var lastAlgo = "",
            resultObj = {};
        try{
            const { ownerID } = req.params;
            let sql = "SELECT userEmail as ownerEmail, CONCAT(CONCAT(UPPER(LEFT(userLname, 1)), RIGHT(userLname, LENGTH(userLname)-1)), ', ', \
            CONCAT(UPPER(LEFT(userFname, 1)), RIGHT(userFname, LENGTH(userFname)-1))\
            , ' ', UPPER(LEFT(userMname, 1)), '.') as ownerName, userAddress as ownerAddress, userContactno \ownerContactno FROM users\ WHERE userID =?";
            let querydata = [ownerID]

            mysqlController.selectQuery(connection.users_table, sql, querydata, [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                if(response != "error") {
                    resultObj = serverResponse.serverResponse(200);
                    resultObj.ownerInformation = response;
                    res.json(resultObj);
                }
                else {
                    resultObj = serverResponse.serverResponse(500);
                    res.json(resultObj);
                }
            })
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, `${lastAlgo}-${error}`);
            resultObj = serverResponse.serverResponse(500);
            res.json(resultObj);
        }
    })

router.route("/assumer-cancel-assumption")
    .post((req, res) => {
        const GLOBAL_FUNCTIONNAME = "assumerCancelAssumption()";
        var lastAlgo = "@ACA1",
            resultObj = {};
        try{
            const { userID, assumptionID, propertyID } = req.body;
            const sql = "UPDATE assumptions SET assumption_status = 'INACTIVE' WHERE assumptionID =? AND userID =? AND propertyID =?",
                querydata = [assumptionID, userID, propertyID];
            mysqlController.updateQuery(dbConn.assumptions_table, sql, querydata, [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                if(response != "error") {
                    resultObj = serverResponse.serverResponse(200);
                    resultObj.message = "Your assumption was cancelled successfully.";
                    res.json(resultObj);
                }
                else {
                    resultObj = serverResponse.serverResponse(500);
                    resultObj.message = "Something went wrong cancelling your request.";
                    res.json(resultObj);
                }
            });
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, `${lastAlgo}-${error}`);
            resultObj = serverResponse.serverResponse(500);
            res.json(resultObj);
        }
    }); // this cancel the user assumptions;

module.exports = router;