const express = require("express")
const router = express.Router()
const commonLib = require("../common/commonFunction")
const serverResponse = require("../common/serverResonses");
const dbConn = require("../db/dbConnection");
const mysqlController = require("../db/mysqlController");
const addressLists = require("./address-lists");
const sha1 = require("sha1");

const GLOBAL_FILE_NAME = "mobile-settings.js";
router.route("/mobile-settings/:userID")
    .get((req, res) => {
        const GLOBAL_FUNCTIONAME = "mobileSettings()"
        var lastAlgo = "@MS1",
            resultObj = {}
        try{
            lastAlgo = "@MS1.1"
            const { userID } = req.params;
            const sql = "SELECT a.userEmail, a.userFname, a.userMname, a.userLname, a.userAddress, a.userContactno, b.accountEmail, b.account_key FROM users a INNER JOIN accounts b ON a.userID = b.userID AND a.userID =?";
            const querydata = [userID]
            
            mysqlController.selectQuery(dbConn.users_table, sql, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTIONAME, lastAlgo], (response) => {
                if(response != "error") {
                    resultObj.userSettingsInformation = response;
                    resultObj.response = serverResponse.serverResponse(200);
                    resultObj.address = addressLists;
                    res.json(resultObj);
                }
                else {
                    commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTIONAME, lastAlgo)
                    resultObj = serverResponse.serverResponse(500);
                    res.json(resultObj);
                }
            })
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTIONAME, `${lastAlgo}-${error}`);
            resultObj = serverResponse.serverResponse(500);
            res.json(resultObj);
        }
    });

router.route("/mobile-settings/updatePI")
    .post((req, res) => {
        const GLOBAL_FUNCTIONAME = "mobileSettingsUpdatePersonalInformation()";
        var lastAlgo = "@MSUPI1",
            resultObj = {};

        try{
            const { userID, firstname, middlename, lastname, contactno, address } = req.body;
            const sql = "UPDATE users set userFname =?, userMname =?, userLname =?, userAddress =?, userContactno =? WHERE userID =?";
            const querydata = [firstname, middlename, lastname, address, contactno, userID ];
            mysqlController.updateQuery(dbConn.users_table, sql, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTIONAME, lastAlgo], (response) => {
                if(response != "error") {
                    resultObj = serverResponse.serverResponse(200);
                    resultObj.message = "Personal Information was updated.";
                    res.json(resultObj);
                }
                else {
                    resultObj = serverResponse.serverResponse(500);
                    res.json(resultObj);
                }
            })
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILE_NAME, )
        }
    });

router.route("/mobile-settings/updateAI")
    .post((req, res) => {
        const GLOBAL_FUNCTIONAME = "mobileSettingsUpdateAccountInformation()";
        var lastAlgo = "@MSUAI1",
            resultObj = {};
        try{
            lastAlgo = "@MSUAI1.1";
            const { userID, email, password } = req.body;
            const hashedPass = sha1(password);
            const sql = "UPDATE accounts SET accountPassword =?, account_key =? WHERE userID =? AND accountEmail =?",
                querydata = [hashedPass, password, userID, email];
            mysqlController.updateQuery(dbConn.accounts_table, sql, querydata, [GLOBAL_FILE_NAME, GLOBAL_FUNCTIONAME, lastAlgo], (response) => {
                if(response != "error") {
                    resultObj = serverResponse.serverResponse(200);
                    resultObj.message = "Account Information was updated.";
                    res.json(resultObj);
                }
                else {
                    commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTIONAME, lastAlgo);
                    resultObj = serverResponse.serverResponse(500);
                    res.json(resultObj);
                }
            });
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTIONAME, `${lastAlgo}-${error}`);
            resultObj = serverResponse.serverResponse(500);
            res.json(resultObj);
        }
    });

module.exports = router