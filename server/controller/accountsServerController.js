const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")
const mysqlCRUDController = require('../db/mysqlController')
const mysqlDBConnection = require("../db/dbConnection")
const serverResponse = require("../common/serverResonses")
const commonLib = require("../common/commonFunction")
const sha1 = require("sha1")
const cookieParser = require("cookie-parser")

router
    .use(cookieParser())
    .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json())
    .use(bodyParser.json({type: "application/vnd.api+json"}))

const GLOBAL_FILE_NAME = "accountsServerController.js"
async function signupUser(req, res) {
    let GLOBAL_FUNCTION = "signupUser()"
    let lastAlgo = "@SU1",
        responseObject = {}
    try{
        lastAlgo = "@SU2"
        let { fname, mname, lname, gender, contactno, province, city, barangay, email, password } = req.body
        let fieldsLists = [fname, mname, lname, gender, contactno, province, city, barangay, email, password]
        let fieldsLen = fieldsLists.length
        let isValid = true; //valid-by-default
        for(let idx = 0; idx < fieldsLen; idx++) {
            if(!/[^\s]/.test(fieldsLists[idx])) {
                isValid = false
                break
            }
        }
        
        let userAlreadExists = await new Promise((resolve, reject) => {
            let sql = "SELECT *FROM accounts WHERE accountEmail =?"
            commonLib.checkIfAccountsExists(mysqlDBConnection.accounts_table,
                sql, [email], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                    resolve(response)
                })
        })
        
        if(isValid && !userAlreadExists) {
            lastAlgo = "@SU3"
            let sql = "INSERT INTO users VALUES?";
            let date = new Date()

            let regDate = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
            password = sha1(password)

            let queryData = [["", email, password, "user", fname, mname, lname, `${barangay}, ${city}, ${province}`,
                gender, regDate, contactno]]

            mysqlCRUDController.insertQuery(mysqlDBConnection.users_table, sql, [queryData], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], async (response) => {
                if(response.constructor === ''.constructor) { // returned a success string
                    lastAlgo = "@SU4"
                    try{
                        let userID = await new Promise((resolve, reject) => {
                            mysqlCRUDController.selectQuery(mysqlDBConnection.users_table, "SELECT MAX(userID) userID FROM users",
                                "", [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                                    if(response.constructor === ''.constructor)
                                        resolve(response)
                                    else if(response.constructor === [].constructor)
                                        resolve(response)
                                    else
                                        reject(response)
                                })
                        })

                        sql = "INSERT INTO accounts VALUES?"
                        lastAlgo = "@SU5"
                        queryData = [["", userID[0]["userID"], email, password]]
                        
                        mysqlCRUDController.insertQuery(mysqlDBConnection.accounts_table, sql, [queryData], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                            if(response.constructor === ''.constructor)
                                responseObject = serverResponse.serverResponse(200)
                            else
                                responseObject = serverResponse.serverResponse(501)
                            res.json(responseObject)
                        })
                    }
                    catch(error) {
                        commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error.message}`.toString())
                    }
                }
            })
        }
        else {
            responseObject = {
                message: userAlreadExists?"email is taken":"empty fields",
                status: 0
            }
            res.json(responseObject)
        }
    }
    catch(error) {
        commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error}`.toString())
        res.json({e: error.toString()})
    }
}

function loginUser(req, res) {
    let GLOBAL_FUNCTION = "loginUser()"

    let lastAlgo = "@LU1",
        responseObject = {}
    try{
        lastAlgo = "@LU2"

        let { email, password } = req.body
        password = sha1(password)
        let sql = "SELECT accountEmail, accountPassword FROM accounts WHERE accountEmail =?",
            queryData = [email]

        mysqlCRUDController.selectQuery(mysqlDBConnection.accounts_table, sql, queryData, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
            if(response.constructor === [].constructor && response.length > 0) {
                let dbPassed = response[0]['accountPassword']

                if(dbPassed === password) {
                    let userSession = sha1(`${email}${dbPassed}`)
                    res.cookie("userSession", userSession, {
                        httpOnly: true,
                        secure: true,
                        sameSite: 'None',
                        maxAge: 24*60*60*100
                    })

                    responseObject = {
                        message: "credentials accepted",
                        sessionCookie: userSession,
                        userEmail: email,
                        status: serverResponse.serverResponse(200).status
                    }
                    res.json(responseObject)
                }
                else {
                    responseObject = serverResponse.serverResponse(401)
                    res.json(responseObject)
                }
            }
            else if(response.constructor === [].constructor && response.length === 0) {
                responseObject = serverResponse.serverResponse(401)
                res.json(responseObject)
            }
            else
                commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${response}`.toString())
        })
    }
    catch(error) {
        responseObject = serverResponse.serverResponse(500)
        commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error}`.toString())
        res.json(responseObject)
    }
}

router.post("/signupUser", (req, res) => {
    signupUser(req, res)
})

router.post("/loginUser", (req, res) => {
    loginUser(req, res)
})

module.exports = router