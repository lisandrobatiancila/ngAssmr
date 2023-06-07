const express = require("express");
const router = express.Router();
const commonLib = require("../common/commonFunction");
const serverResponse = require("../common/serverResonses");
const mysqlController = require("../db/mysqlController");
const dbConn = require("../db/dbConnection");

const GLOBAL_FILENAME = "mobile-push-notifications.js";

router.route("/get-active-user-notifications")
    .post((req, res) => {
        const GLOBAL_FUNCTIONNAME = "getActiveUserNotifications()";
        var lastAlgo = "",
            resultObj = {};
        try{
            const { userID, userEmail } = req.body;

            const sql = "SELECT userfname, 'ASSMPTN' NOTIF_TYP, 'Assumed your property.' info3, u.userEmail email FROM users u JOIN assumptions a ON u.userID = a.userID \
            JOIN properties p ON p.propertyID = a.propertyID\
            AND a.notification_read = 'unread' AND p.userID = ?\
            \
            UNION ALL SELECT userfname, 'MSSGE' NOTIF_TYP, m.message info3, u.userEmail email FROM messages m JOIN users u ON u.userID = m.userID \
             AND m.is_read = 'N' AND m.message_reciever = ?"
            const querydata = [userID, userEmail];
            
            mysqlController.selectQuery(dbConn.assumptions_table, sql, querydata, [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                if(response != "error") {
                    if(response.length > 0) {
                        resultObj = serverResponse.serverResponse(200);
                        resultObj.notificationServiceModelList = response;
                        res.json(resultObj);
                    }
                    else {
                        resultObj = serverResponse.serverResponse(201);
                        resultObj.notificationServiceModelList = []
                        res.json(resultObj);
                    }
                }
                else {
                    commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo);
                    resultObj = serverResponse.serverResponse(500);
                    res.json(resultObj);
                }
            });
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, `${lastAlgo}-${error}`);
            resultObj = serverResponse.serverResponse(500);
            res.json(resultObj);
        }
    });

module.exports = router;