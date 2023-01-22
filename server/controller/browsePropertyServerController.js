const express = require("express")
const router = express.Router()
const commoblib = require("../common/commonFunction")
const serverResponse = require("../common/serverResonses")
const mysqlCRUDController = require("../db/mysqlController")
const mysqlDBConnection = require("../db/dbConnection")

const GLOBAL_FILE_NAME = "browsePropertyServerController.js"
function BAVehicleProperties(req, res) {
    var GLOBAL_FUNCTION = "BAVehicleProperties()"
    var lastAlgo = "@BAVP1",
        responseObject = {}
    try{
        lastAlgo = "@BAVP2"
        let sql = "SELECT v.*, vi.* FROM vehicles v JOIN vehicle_images vi \
            ON vi.vehicleID = v.vehicleID"
        mysqlCRUDController.selectQuery(mysqlDBConnection.vehicles_table, sql, "", [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
            if(response.length > 0) {
                responseObject = serverResponse.serverResponse(200)
                responseObject.data = response
                res.json(responseObject)
            }
            else {
                responseObject = serverResponse.serverResponse(200)
                responseObject.data = response
                res.json(responseObject)
            }
        })
    }
    catch(error) {
        commoblib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error.message}`)
        responseObject = serverResponse.serverResponse(500)

        res.json(responseObject)
    }
} //Browse All Vehicle-Properties

router.get("/BA-vehicle-properties", (req, res) => {
    BAVehicleProperties(req, res)
})

module.exports = router