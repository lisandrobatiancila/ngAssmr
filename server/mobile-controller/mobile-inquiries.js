const express = require("express");
const router = express.Router();
const commonLib = require("../common/commonFunction");
const serverResponse = require("../common/serverResonses");
const dbConn = require("../db/dbConnection");
const mysqlController = require("../db/mysqlController");

const GLOBAL_FILENAME = "mobile-inquiries.js";

router.route("/get-my-assumptions/:userID")
    .get((req, res) => {
        const GLOBAL_FUNCTIONNAME = "getMyAssumptions()";
        var lastAlgo = "@GMA1",
            resultObj = {};
        try{
            const { userID } = req.params;
            const sql = "SELECT v.vehicleOwner as info1, v.vehicleBrand as info2, v.vehicleModel as info3, vi.vehicleIMAGES as info4, 'vehicle' as info5, p.propertyStatus as info6 FROM vehicles v INNER JOIN vehicle_images vi ON v.vehicleID = vi.vehicleID INNER JOIN properties p ON p.propertyID = v.propertyID INNER JOIN assumptions a ON a.propertyID = p.propertyID AND a.userID =?\
            UNION ALL SELECT j.jewelryOwner as info1, j.jewelryName as info2, j.jewelryModel as info3, ji.jewelryIMG as info4, 'jewelry' as info5, p.propertyStatus as info6 FROM jewelries j INNER JOIN jewelry_images ji ON j.jewelryID = ji.jewelryID INNER JOIN properties p ON p.propertyID = j.propertyID INNER JOIN assumptions a ON a.propertyID = p.propertyID AND a.userID =?\
            UNION ALL SELECT r.realestateOwner as info1, r.realestateType as info2, '' as info3, ri.realestateIMG as info4, 'realestate' as info5, p.propertyStatus as info6 FROM realestates r INNER JOIN realestate_images ri ON r.realestateID = ri.realestateID INNER JOIN properties p ON p.propertyID = r.propertyID INNER JOIN assumptions a ON a.propertyID = p.propertyID AND a.userID =?",
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
    }); // this get the active user properties that was assumed by other users

module.exports = router;