const express = require("express");
const router = express.Router();
const serverResponse = require("../common/serverResonses");
const commonLib = require("../common/commonFunction")
const mysqlController = require("../db/mysqlController");
const mysqlConn = require("../db/dbConnection");
const formidable = require("formidable");

const GLOBAL_FILENAME = "mobile-messages.js";

router.route("/mobile-send-message-TEXT")
    .post((req, res) => {
        const GLOBAL_FUNCTIONNAME = "mobileSendMessage()";
        var lastAlgo = "@MSM1",
            resultObj = {};
        try{
            const { message, messageType, message_receiver, message_sender, userID } = req.body;
            let sql = "INSERT INTO messages VALUES?";
            let querydata = [["", userID, message_sender, message_receiver, messageType, "N", message, 'NOW()']];

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
    }); // send message to other user; TEXT-only

router.route("/mobile-send-message-IMAGE")
    .post(async(req, res) => {
        const GLOBAL_FUNCTIONNAME = "mobileSendMessageIMAGE()";
        var lastAlgo = "@MSMI1",
            resultObj = {};

        try{
            lastAlgo = "@MSMI2";
            const form = formidable({multiples: true});
            
            const prom = await new Promise((resolve, reject) => {
                var fileIMG = [];
                var fileFields = {};
                
                form.parse(req, (err, fields, files) => {
                    fileFields = fields;
                })
    
                form.on("fileBegin", (fk, fv) => {
                    fv.filepath = "uploads/messages/"+fv.originalFilename;
                    fileIMG.push(fv.filepath);
                });
                
                setTimeout(() => {
                    resolve({fileFields, fileIMG});
                }, 1500);
            })
            lastAlgo = "@MSMI3";
            const { fileFields, fileIMG } = prom;
            const { userID, inboundUser, outboundUser } = fileFields;

            const sql = "INSERT INTO messages VALUES ?",
                querydata = [["", userID, inboundUser, outboundUser, "image-only", "N", JSON.stringify(fileIMG), "NOW()"]];

            mysqlController.insertQuery(mysqlConn.messages_table, sql, [querydata], [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                if(response != "") {
                    resultObj = serverResponse.serverResponse(200);
                    res.json(resultObj);
                }
                else {
                    commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo)
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
    }); // send message to other user; IMAGE-only

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
    }); // get the messages between 2 user; open the CHAT-ROOM

router.route("/mobile-get-list-messages")
    .post((req, res) => {
        const GLOBAL_FUNCTIONNAME = "mobileGetListMessages()";
        var resultObj = {},
            lastAlgo = "@MGLM1";
        try{
            const { message_reciever, userID } = req.body;
            let sql = "SELECT a.messageID, a.userID, a.message_sender, a.message_reciever, a.message_type, a.is_read, a.message, DATE_FORMAT(a.message_date, '%M %d, %Y') as message_date, CONCAT(CONCAT(UPPER(LEFT(b.userLname, 1)), RIGHT(b.userLname, LENGTH(b.userLname)-1)), ', ', CONCAT(UPPER(LEFT(b.userFname, 1)), RIGHT(b.userFname, LENGTH(b.userFname)-1)), ' ', UPPER(LEFT(b.userMname, 1)), '.') as fullName FROM messages a INNER JOIN users b ON a.userID = b.userID WHERE messageID IN (SELECT MAX(messageID) FROM messages WHERE message_reciever =? GROUP BY message_sender)",
                querydata = [message_reciever];
            
            mysqlController.selectQuery(mysqlConn.messages_table, sql, querydata, [GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, lastAlgo], (response) => {
                if(response != "error") {
                    resultObj = serverResponse.serverResponse(200);
                    resultObj.messagesModelList = response;
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
    }); // get the active users messages lists; DISPLAY IN RECYCLERVIEW

module.exports = router;