const express = require("express");
const router = express.Router();
const serverResponse = require("../common/serverResonses");
const commonLib = require("../common/commonFunction")
const mysqlController = require("../db/mysqlController");
const mysqlConn = require("../db/dbConnection");

const GLOBAL_FILENAME = "mobile-messages.js";

router.route("/mobile-send-message")
    .post((req, res) => {
        const GLOBAL_FUNCTIONNAME = "mobileSendMessage()";
        var lastAlgo = "@MSM1",
            resultObj = {};
        try{
            const { message, messageType, message_receiver, message_sender, userID } = req.body;
            let sql = "INSERT INTO messages VALUES?";
            let querydata = [["", userID, message_sender, message_receiver, messageType, "N", message]];

            mysqlController.insertQuery(mysqlConn.messages_table, sql, [querydata], [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                if(response != "error") {
                    resultObj = serverResponse.serverResponse(200);
                    res.json(resultObj);
                }
                else {
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
    });

router.route("/mobile-get-messages")
    .post((req, res) => {
        const GLOBAL_FUNCTIONNAME = "mobileGetMessages()";
        var lastAlgo = "@MGM1",
            resultObj = {};

        try{
            lastAlgo = "@MGM2";
            const { inboundEmail, outboundEmail } = req.body;
            let sql = "SELECT * FROM messages WHERE (message_sender =? AND message_reciever =?) OR (message_sender =? AND message_reciever =?)";
            let querydata = [inboundEmail, outboundEmail, outboundEmail, inboundEmail];

            mysqlController.selectQuery(mysqlConn.messages_table, sql, querydata, [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                if(response != "error") {
                    resultObj = serverResponse.serverResponse(200);
                    resultObj.userMessages = response;
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
            commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, `${lastAlgo}-${error}`);
            resultObj = serverResponse.serverResponse(500);
            res.json(resultObj);
        }
    });

module.exports = router;