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

            const sql = "SELECT a.assumptionID as ID, userfname, 'ASSMPTN' NOTIF_TYP, 'Assumed your property.' info3, u.userEmail email FROM users u JOIN assumptions a ON u.userID = a.userID \
            JOIN properties p ON p.propertyID = a.propertyID\
            AND a.notification_read = 'unread' AND p.userID = ?\
            \
            UNION ALL SELECT m.messageID as ID, userfname, 'MSSGE' NOTIF_TYP, m.message info3, u.userEmail email FROM messages m JOIN users u ON u.userID = m.userID \
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
    }); // get all notifications for active user

router.route("/update-notification-status")
    .patch((req, res) => {
        const { notificationID, notificationType } = req.body;
        const GLOBAL_FUNCTIONNAME = "updateNotificationStatus()";
        var lastAlgo = "@UNS1";
        var resultObj = {};
        let sql = "", 
            data = [];

        switch(notificationType) {
            case "ASSMPTN":
                sql = "UPDATE assumptions SET notification_read =? WHERE assumptionID =?";
                data = ['read', notificationID];
                mysqlController.updateQuery(dbConn.assumptions_table, sql, data, [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                    if(response != "error") {
                        resultObj = serverResponse.serverResponse(200);
                        res.json(resultObj);
                    }
                    else {
                        resultObj = serverResponse.serverResponse(500);
                        resultObj.message = "Something went wrong";
                        res.json(resultObj);
                    }
                });
            break;
            case "MSSGE":
                sql = "UPDATE messages SET is_read =? WHERE messageID =?";
                lastAlgo = "@UNS2"
                data = ['Y', notificationID];
                mysqlController.updateQuery(dbConn.messages_table, sql, data, [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                    if(response != "error") {
                        resultObj = serverResponse.serverResponse(200);
                        res.json(resultObj);
                    }
                    else {
                        resultObj = serverResponse.serverResponse(500);
                        resultObj.message = "Something went wrong.";
                        res.json(resultObj);
                    }
                })
            break;
            default:
                console.log("No notificationType");
        }
    }); // update certain notification; based on user notification-clicked

module.exports = router;