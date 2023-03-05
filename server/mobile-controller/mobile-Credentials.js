const express = require("express");
const router = express.Router();
const commobLib = require("../common/commonFunction");
const serverResponse = require("../common/serverResonses");
const mysqlCRUD = require("../db/mysqlController"); 
const mysqlDBConn = require("../db/dbConnection");
const sha1 = require("sha1");

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
                                        responseObj = serverResponse.serverResponse(200);
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
        const addresess = [
            {
                provinces: [
                    {
                        barangay: [
                            "alboquerque",
                            "ivisan"
                        ],
                        name: "bohol"
                    },
                    {
                        barangay: ["mojon", "baigad"],
                        name: "bantayan"
                    }
                ],
                city: "cebu"
            }, // ceub
            {
                provinces: [
                    {
                        barangay: [
                            "concepcion",
                            "duran",
                            "poblacion norte",
                            "santa cruz",
                            "santa rita",
                            "santa monica"
                        ],
                        name: "dumalag"
                    },
                    {
                        barangay: [
                            "balogo",
                            "blasco",
                            "natividad",
                            "poblacion",
                            "san antonio"
                        ],
                        name: "pilar"
                    },
                    {
                        barangay: [
                            "agbalo",
                            "bago grande",
                            "bato",
                            "cogon"
                        ],
                        name: "panay"
                    }
                ],
                city: "capiz"
            }, // capiz
            {
                provinces: [
                    {
                        barangay: [
                            "alguisoc",
                            "rizal",
                            "balcon maravilla",
                            "poblacion"
                        ],
                        name: "jordan"
                    },
                    {
                        barangay: [
                            "la paz",
                            "magamay",
                            "lucmayan",
                            "calaya"
                        ],
                        name: "nueva valencia"
                    },
                    {
                        barangay: [
                            "alegria",
                            "ayangan",
                            "milan",
                            "orocan"
                        ],
                        name: "sibunag"
                    }
                ],
                city: "guimaras"
            }, // guimaras
        ];

        res.json(addresess);
    })
module.exports = router;