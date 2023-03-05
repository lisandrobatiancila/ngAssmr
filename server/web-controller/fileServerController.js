const express = require("express")
const router = express.Router()
const bodyParser = require("body-parser")
const formidable = require("formidable")
const commonLib = require("../common/commonFunction")
const serverResponse = require("../common/serverResonses")
const mysqlDBConnection = require("../db/dbConnection")
const mysqlCRUDController = require("../db/mysqlController")
const multer = require("multer")

router
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({extended: true}))
    .use(bodyParser.json({type: "application/vnd.api+json"}))

const GLOBAL_FILE_NAME = 'fileServerController.js'
async function uploadVehiclesInfo(req, res) {
    const GLOBAL_FUNCTION = 'uploadVehiclesInfo()'
    let lastAlgo = '@UVF1',
        responseObject = {}

    try{
        lastAlgo = "@UVF2";
        let cookies = req.cookies
        let userEmail = typeof req.headers["72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5"] === "undefined"?".":req.headers["72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5"]
        let isAuthorizedToPost = cookies && userEmail != "."

        if(isAuthorizedToPost) {
            let userID = await new Promise((resolve, reject) => {
                lastAlgo = "@UVF3"
                let sql = "SELECT userID FROM accounts WHERE accountEmail=?";

                mysqlCRUDController.selectQuery(mysqlDBConnection.accounts_table, sql, userEmail, 
                    [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                        if(response.constructor === [].constructor && response.length > 0) {
                            resolve(response[0])
                        }
                    })
            })
            let { propType, owner, contactno, brand, model, location, downpayment, installment_paid,
                    installment_duration, delinquent, description } = req.body

            let propertyID = await new Promise((resolve, reject) => {
                lastAlgo = "@UV4"
                let sql = "INSERT INTO properties VALUES?"
                const propertyData = [["", userID['userID'], propType.replace("s", "")]]

                mysqlCRUDController.insertQuery(mysqlDBConnection.properties_table, sql, [propertyData], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo],
                    (response) => {
                        if(response === "success") {
                            lastAlgo = "@UV5"
                            sql = "SELECT MAX(propertyID) propertyID FROM properties"
                            mysqlCRUDController.selectQuery(mysqlDBConnection.properties_table, sql, "", [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo],
                                (response) => {
                                    resolve(response[0])
                                })
                        }
                        else {
                            responseObject = serverResponse.serverResponse(500)
                            res.json(responseObject)
                        }
                    })
            })
            lastAlgo = "@UV6"
            let vehicleID = await new Promise((resolve, reject) => {
                let sql = "INSERT INTO vehicles VALUES?"
                const vehicleData = [["", propertyID["propertyID"], owner, contactno, brand, model, location, downpayment, installment_paid,
                    installment_duration, delinquent, description]]
                mysqlCRUDController.insertQuery(mysqlDBConnection.vehicles_table, sql, [vehicleData], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo],
                    (response) => {
                        if(response === "success") {
                            sql = "SELECT MAX(vehicleID) vehicleID FROM vehicles"
                            mysqlCRUDController.selectQuery(mysqlDBConnection.vehicles_table, sql, "", [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], 
                                (response) => {
                                    resolve(response[0])
                                })
                        }
                        else {
                            responseObject = serverResponse.serverResponse(500)
                            res.json(responseObject)
                        }
                    })
            })
            
            responseObject = serverResponse.serverResponse(200)
            responseObject.vehicleID = vehicleID["vehicleID"]
            res.json(responseObject)
        }
        else {
            commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${serverResponse.serverResponse(401).message}`.toString())
            responseObject = serverResponse.serverResponse(401)
            res.json(responseObject)
        }
    }
    catch(error) {
        commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error.message}`)
        res.json({
            status: serverResponse.serverResponse(500),
            message: error.message
        })
    }
}

async function uploadVehicleImages(req, res) {
    const GLOBAL_FUNCTION = "uploadVehicleImages()"
    let lastAlgo = "@UVI1",
        responseObject = {}
    try{
        lastAlgo = "@UVI2"
        var form = new formidable.IncomingForm()

        let execIMG = await new Promise((resolve, reject) => {
            let tempFields = {}
            let tempFiles = []
            form.parse(req, (error, fields, files) => {
                files['file[0]'].filepath = "uploads/vehicles/"+files['file[0]'].originalFilename
                tempFields = fields
            })
            form.on("fileBegin", (fk, fv) => {
                fv.filepath = "uploads/vehicles/"+fv.originalFilename

                tempFiles.push(fv.filepath)
            })
            setTimeout(() => {
                resolve({
                    tempFields,
                    tempFiles: tempFiles
                })
            }, 1500);
        })
        
        let saveVehicleIMGSResponse = await new Promise((resolve, reject) => {
            lastAlgo = "@UVI3"
            let sql = "INSERT INTO vehicle_images VALUES?"
            let { propertyType, propertyID } = execIMG.tempFields
            
            mysqlCRUDController.insertQuery(mysqlDBConnection.vehicle_images_table, sql, [[["", propertyID, JSON.stringify(execIMG.tempFiles)]]], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response === "success") {
                    responseObject = serverResponse.serverResponse(200)
                    res.json(responseObject)
                }
                else {
                    responseObject = serverResponse.serverResponse(500)
                    res.json(responseObject)
                }
            })
        })

        res.json(saveVehicleIMGSResponse)
    }
    catch(error) {
        responseObject = serverResponse.serverResponse(500)
        commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error.message}`)
        res.json(responseObject)
    }
}

async function uploadJewelryInfo(req, res) {
    var GLOBAL_FUNCTION = "uploadJewelryInfo()"
    var lastAlgo = "@UJI1",
        responseObject = {}
    try{
        lastAlgo = "@UJI2"
        var cookies = req.cookies
        var userEmail = typeof req.headers["72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5"] === "undefined"?".":req.headers["72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5"]
        var isAuthorizedToPost = cookies && userEmail != "."

        if(isAuthorizedToPost) {

            let userID = await new Promise((resolve, reject) => {
                lastAlgo = "@UJI3"
                let sql = "SELECT userID from accounts WHERE accountEmail =?"
                mysqlCRUDController.selectQuery(mysqlDBConnection.accounts_table, sql, [userEmail], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                    if(response.length > 0)
                        resolve(response[0])
                })
            })

            let propertyID = await new Promise((resolve, reject) => {
                lastAlgo = "@UJI4"
                let sql = "INSERT INTO properties VALUES?"
                let propertyDATA = [["", userID["userID"], "jewelry"]]
                mysqlCRUDController.insertQuery(mysqlDBConnection.properties_table, sql, [propertyDATA], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                    if(response === "success") {
                        lastAlgo = "@UIJ5"
                        sql = "SELECT max(propertyID) propertyID FROM properties"
                        mysqlCRUDController.selectQuery(mysqlDBConnection.properties_table, sql, "", [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                            if(response.length > 0)
                                resolve(response[0])
                        })
                    }
                })
            })
            
            let jewelryID = await new Promise((resolve, reject) => {
                lastAlgo = "@UJI6"
                let { jowner, jcontactno, jname, jmodel, jlocation, jdownpayment, jinstallmentpaid, jinstallmentduration, jdelinquent, jdescription } = req.body

                let sql = "INSERT INTO jewelries VALUES?"
                let jewelryDATA = [["", propertyID["propertyID"], jowner, jcontactno, jname, jmodel, jlocation, jdownpayment, jinstallmentpaid,
                    jinstallmentduration, jdelinquent, jdescription]]

                mysqlCRUDController.insertQuery(mysqlDBConnection.jewelries_table, sql, [jewelryDATA], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION,  lastAlgo], (response) => {
                    if(response === "success") {
                        lastAlgo = "@UJI7"
                        sql = "SELECT max(jewelryID) jewelryID FROM jewelries"
                        mysqlCRUDController.selectQuery(mysqlDBConnection.jewelries_table, sql, "", [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                            if(response.length > 0)
                                resolve(response[0])
                        })
                    }
                })
            })

            responseObject = serverResponse.serverResponse(200)
            responseObject.jewelryID = jewelryID["jewelryID"]
            res.json(responseObject)
        }
        else {
            responseObject = serverResponse.serverResponse(401)
            res.json(responseObject)
        }
    }
    catch(error) {
        commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error.message}`)
        responseObject = serverResponse.serverResponse(500)
        res.json(responseObject)
    }
}

async function uploadJewelryImages(req, res) {
    const GLOBAL_FUNCTION = "uploadJewelryImages()"
    var lastAlgo = "@UJInfo1",
        responseObject = {}
    
    try {
        lastAlgo = "@UJInfo2"
        var form = new formidable.IncomingForm()
        var tempFields = {},
            tempFiles  =[]

        let execIMG = await new Promise((resolve, reject) => {
            form.parse(req, (error, fields, file) => {
                tempFields = fields
            })
    
            form.on("fileBegin", (fk, fv) => {
                fv.filepath = `uploads/jewelries/${fv.originalFilename}`
                tempFiles.push(fv.filepath)
            })
            setTimeout(() => {
                resolve({
                    tempFields,
                    tempFiles: tempFiles
                })
            }, 1500)
        })
        
        let saveJewelryIMGResponse = await new Promise((resolve, reject) => {
            let sql = "INSERT INTO jewelry_images VALUES?"
            let { propertyType, propertyID } = execIMG.tempFields

            let jewelryIMGDATA = [["", propertyID, JSON.stringify(execIMG.tempFiles)]]
            mysqlCRUDController.insertQuery(mysqlDBConnection.jewelries_images_table, sql, [jewelryIMGDATA], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response === "success")
                    resolve(serverResponse.serverResponse(200))
            })
        })

        res.json(saveJewelryIMGResponse)
    }
    catch(error) {
        commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error.message}`)
        responseObject = serverResponse.serverResponse(500)
        res.json(responseObject)
    }
}

async function uploadRealesteInfo(req, res) {
    const GLOBAL_FUNCTION = "uploadRealestateInfo()"
    var lastAlgo = "@URI1",
        responseObject = {}
    try{
        lastAlgo = "@URI2"
        const cookies = req.cookies
        const userEmail = typeof req.headers["72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5"] === "undefined"?".":req.headers["72cebfd3ca216eaf5a69a7d20ecbf92040fee5e5"]

        const isAuthorizedToPost = cookies && userEmail != "."

        if(isAuthorizedToPost) {
            lastAlgo = "@URI3"
            let userID = await new Promise((resolve, reject) => {
                lastAlgo = "@URI3"
                let sql = "SELECT userID FROM accounts WHERE accountEmail =?"
                mysqlCRUDController.selectQuery(mysqlDBConnection.accounts_table, sql, [userEmail], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                    if(response.length > 0)
                        resolve(response[0])
                })
            })

            let propertyID = await new Promise((resolve, reject) => {
                lastAlgo = "@URI4"
                let sql = "INSERT INTO properties VALUES?"
                let propertyDATA = [["", userID["userID"], "realestate"]]
                mysqlCRUDController.insertQuery(mysqlDBConnection.properties_table, sql, [propertyDATA], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION ,lastAlgo], (response) => {
                    if(response === "success") {
                        sql = "SELECT max(propertyID) propertyID FROM properties"
                        mysqlCRUDController.selectQuery(mysqlDBConnection.properties_table, sql, "",[GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                            resolve(response[0])
                        })
                    }
                })
            })

            let realestateID = await new Promise((resolve, reject) => {
                lastAlgo = "@URI5"
                let { owner, contactno, estatelocation, estatedownpayment, estateinstallmentpaid, estateinstallmentduration, estatedelinquent, estatetype, estatedescription } = req.body

                let sql = "INSERT INTO realestates VALUES?"
                let realestateDATA = [["", propertyID["propertyID"], owner, contactno, estatelocation, estatedownpayment, estateinstallmentpaid, estateinstallmentduration, estatedelinquent, estatetype, estatedescription]]

                mysqlCRUDController.insertQuery(mysqlDBConnection.realestates_table, sql, [realestateDATA], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                    lastAlgo = "@URI6"
                    if(response === "success") {
                        sql = "SELECT max(realestateID) realestateID FROM realestates"
                        mysqlCRUDController.selectQuery(mysqlDBConnection.realestates_table, sql, "", [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                            if(response.length > 0)
                                resolve(response[0])
                        })
                    }
                })
            })
            responseObject = serverResponse.serverResponse(200)
            responseObject.realestateID = realestateID["realestateID"]
            res.json(responseObject)
        }
        else {
            commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-unAuthorized`)
            res.json(serverResponse.serverResponse(500))
        }
    }
    catch(error) {
        commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error.message}`)
        responseObject = serverResponse.serverResponse(500)
        res.json(responseObject)
    }
}

async function uploadRealestateImages(req, res) {
    var GLOBAL_FUNCTION = "uploadRealestateImages()"
    var lastAlgo = "@URIMG1",
        responseObject = {}
    try{
        lastAlgo = "@URIMG2"
        let execIMG = await new Promise((resolve, reject) => {
            var form = new formidable.IncomingForm()
            let tempFields = {},
                tempFiles = []
            form.parse(req, (error, fields, file) => {
                tempFields = fields
            })
            form.on("fileBegin", (fk, fv) => {
                fv.filepath = `uploads/realestates/${fv.originalFilename}`
                tempFiles.push(fv.filepath)
            })

            setTimeout(() => {
                resolve({
                    tempFields,
                    tempFiles
                })
            }, 1500);
        })

        let saveRealestateIMGResponse = await new Promise((resolve, reject) => {
            let { propertyID } = execIMG.tempFields
            lastAlgo = "@URIIMG3"
            let sql = "INSERT INTO realestate_images VALUES?"
            let realestateIMGDATA = [["", propertyID, JSON.stringify(execIMG.tempFiles)]]
            mysqlCRUDController.insertQuery(mysqlDBConnection.realestates_images_table, sql, [realestateIMGDATA], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response === "success")
                    resolve(serverResponse.serverResponse(200))
            })
        })

        res.json(saveRealestateIMGResponse)
    }
    catch(error) {
        commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error.message}`)
        responseObject = serverResponse.serverResponse(500)
        res.json(responseObject)
    }
}

router.post("/upload-vehicle-info", (req, res, next) => {
    uploadVehiclesInfo(req, res)
})

router.post("/upload-vehicle-images", (req, res) => {
    uploadVehicleImages(req, res)
})

router.post("/upload-jewelry-info", (req, res) => {
    uploadJewelryInfo(req, res)
})

router.post("/upload-jewelry-images", (req, res) => {
    uploadJewelryImages(req, res)
})

router.post("/upload-realestate-info", (req, res) => {
    uploadRealesteInfo(req, res)
})
router.post("/upload-realestate-images", (req, res) => {
    uploadRealestateImages(req, res)
})
module.exports = router