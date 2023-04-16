const express = require("express");
const router = express.Router();
const commobLib = require("../common/commonFunction");
const serverResponse = require("../common/serverResonses");
const mysqlCRUD = require("../db/mysqlController"); 
const mysqlDBConn = require("../db/dbConnection");
const sha1 = require("sha1");
const addressLists = require("./address-lists");

const GLOBAL_FILE_NAME = "mobile-Credentials.js";
router.route("/mobile-signup")
    .post((req, res) => {
        const GLOBAL_ACTION_NAME = "POST-/mobile-signup";
        var responseObj = {},
            lastAlgo = "";

        try{
            let { firstname, middlename, lastname, gender, phoneNo, 
                city, province, barangay, email, password } = req.body;
                
            const validateFields = [firstname, middlename, lastname, gender, phoneNo, city, province, barangay, email, password];
            const vfLen = validateFields.length;
            var validationPass = true;

            for(let i = 0; i < vfLen; i++) {
                if(!/[^\s]/.test(validateFields[i])) {
                    validationPass = false;
                    break;
                }
            }

            if(validationPass) {
                let sql = "INSERT INTO users(userEmail, password, userType, userFname, userMname, userLname, userAddress, \
                    userGender, regDate, userContactno) VALUES?";
                const address = `${barangay}, ${province}, ${city}`;
                password = sha1(password);
                const date = new Date(),
                    now = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
                    
                let sqlData = [[email, password, "user", firstname, middlename, lastname, address, gender, now, phoneNo]]
                mysqlCRUD.insertQuery(mysqlDBConn.accounts_table, sql, [sqlData], [GLOBAL_FILE_NAME, `${GLOBAL_ACTION_NAME}-${lastAlgo}`], (response) => {
                    if(response != "error") {
                        sql = "SELECT max(userID) userID FROM users";
                        mysqlCRUD.selectQuery(mysqlDBConn.users_table, sql, null, [GLOBAL_FILE_NAME, `${GLOBAL_ACTION_NAME}-${lastAlgo}`], (response) => {
                            if(response != "error") {
                                const userID = response[0].userID;
                                sql = "INSERT INTO accounts (userID, accountEmail, accountPassword) VALUES?"
                                sqlData = [[userID, email, password]]
                                mysqlCRUD.insertQuery(mysqlDBConn.accounts_table, sql, [sqlData], [GLOBAL_FILE_NAME, `${GLOBAL_ACTION_NAME}-${lastAlgo}`], (response) => {
                                    if(response != "error") {
                                        responseObj = {
                                            status: 1,
                                            code: serverResponse.serverResponse(200),
                                            message: "Creating account was successfull."
                                        };
                                        res.json(responseObj);
                                    }
                                    else {
                                        responseObj = serverResponse.serverResponse(500);
                                        res.json(responseObj);
                                    }
                                });
                            }
                            else {
                                responseObj = serverResponse.serverResponse(500);
                                res.json(responseObj);
                            }
                        })
                    }
                    else {
                        responseObj = serverResponse.serverResponse(500);
                        res.json(responseObj);
                    }
                })
            }
            else {
                responseObj = {
                    message: "Empty fields",
                    code: 0,
                    status: serverResponse.serverResponse(500).status
                }
                res.json(responseObj)
            }
        }
        catch(error) {
            commobLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_ACTION_NAME, `${lastAlgo}-${error}`)
            responseObj = serverResponse.serverResponse(500)

            res.json(responseObj)
        }

        
    })
    .get((req, res) => {
        
        res.json(addressLists);
    })

router.route("/mobile-signin")
    .post((req, res) => {
        const GLOBAL_ACTION_NAME = "mobile-signin";
        var resultObj = {},
            lastAlgo = "";

        try{
            lastAlgo = "@MS1"
            let {email, password } = req.body;
            const validateFields = [email, password];
            const vfLen = validateFields.length;
            var validationPass = true;
            for(let i = 0; i < vfLen; i++) {
                if(!/[^\s]/.test(validateFields[i])) {
                    validationPass = false;
                    break;
                }
            }
            if(validationPass) {
                lastAlgo = "@MS2";
                password = sha1(password);
                let sql = "SELECT a.userID, a.accountEmail, a.accountPassword, CONCAT(CONCAT(UCASE(LEFT(b.userLname, 1))), CONCAT(RIGHT(b.userLname, LENGTH(b.userLname)-1)), ', ', CONCAT(LEFT(b.userFname, 1), RIGHT(b.userFname, LENGTH(b.userFname)-1)), ' ', UCASE(LEFT(b.userMname, 1)), '.') as fullName FROM accounts a JOIN users b ON b.userID = a.userID WHERE accountEmail =?";
                const sqlData = [email];

                mysqlCRUD.selectQuery(mysqlDBConn.accounts_table, sql, sqlData, [GLOBAL_FILE_NAME, `${GLOBAL_ACTION_NAME}-${lastAlgo}`], (response) => {
                    if(response != "error" && response.constructor == [].constructor && response.length > 0) {
                        lastAlgo = "@MS3";
                        const dbPassword = response[0].accountPassword;
                        if(dbPassword == password) {
                            
                            resultObj = {
                                status: 1,
                                code: serverResponse.serverResponse(200).code,
                                message: serverResponse.serverResponse(200).message,
                                activeUser: [
                                    {
                                        userID: response[0].userID,
                                        email,
                                        fullName: response[0].fullName
                                    }
                                ]
                            };
                            return res.json(resultObj);
                        }
                        else {
                            lastAlgo = "@MS4";
                            commobLib.errorLogs(GLOBAL_FILE_NAME, `${GLOBAL_ACTION_NAME}`, `${lastAlgo}`);
                            resultObj = {
                                status: 0,
                                message: "Invalid credentials",
                                code: serverResponse.serverResponse(401).code,
                                activeUser: []
                            };
                            return res.json(resultObj);
                        }
                    }
                    else if(response.constructor == [].constructor && response.length == 0) {
                        lastAlgo = "@MS4.1";
                        commobLib.errorLogs(GLOBAL_FILE_NAME, `${GLOBAL_ACTION_NAME}`, `${lastAlgo}`);
                        resultObj = {
                            status: 0,
                            message: "Invalid credentials",
                            code: serverResponse.serverResponse(401).code,
                            activeUser: []
                        };
                        return res.json(resultObj);
                    }
                    else {
                        lastAlgo = "@MS5";
                        commobLib.errorLogs(GLOBAL_FILE_NAME, `${GLOBAL_ACTION_NAME}`, `${lastAlgo}`);
                        resultObj = {
                            status: 0,
                            message: serverResponse.serverResponse(500).message,
                            code: serverResponse.serverResponse(500).code,
                            activeUser: []
                        };
                        return res.json(resultObj);
                    }
                })
            }
            else {
                lastAlgo = "@MS6";
                commobLib.errorLogs(GLOBAL_FILE_NAME, `${GLOBAL_ACTION_NAME}`, `${lastAlgo}`);
                resultObj = {
                    status: 0,
                    message: "Empty fields",
                    code: serverResponse.serverResponse(406).code,
                    activeUser: []
                };
                return res.json(resultObj);
            }
        }
        catch(error) {
            commobLib.errorLogs(GLOBAL_FILE_NAME, `${GLOBAL_ACTION_NAME}`, `${lastAlgo}-${error}`);
            resultObj = serverResponse.serverResponse(500);
            return res.json(resultObj);
        }
    });

module.exports = router;