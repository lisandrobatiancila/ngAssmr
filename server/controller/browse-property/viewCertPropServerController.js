const express = require("express")
const router = express.Router()
const commonlib = require("../../common/commonFunction");
const mysqlCRUDController = require("../../db/mysqlController");
const mysqlDBConnection = require("../../db/dbConnection");
const serverResponse = require("../../common/serverResonses");

const GLOBAL_FILE_NAME = "viewCertPropServerController.js"
function getCertainProperty (req, res) {
    const GLOBAL_FUNCTION = "getCertainProperty()";
    var lastAlgo = "@GCP1",
        responseObject = {}
    try{
        lastAlgo = "@GCP2";
        var sql = "";
        var queryDATA = []
        let { propertyType, propertyID } = req.params;
        switch(propertyType) {
            case "vehicle":
                sql = "SELECT vi.*, v.* FROM properties p JOIN vehicles v JOIN vehicle_images vi ON \
                    p.propertyID = v.propertyID AND v.vehicleID = vi.vehicleID AND v.propertyID = ?"
                queryDATA = [propertyID]
                mysqlCRUDController.selectQuery(mysqlDBConnection.vehicles_table, sql, queryDATA, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                    if(response != "error" && response.length > 0) {
                        responseObject = serverResponse.serverResponse(200)
                        responseObject.data = response
                        res.json(responseObject)
                    }
                    else {
                        commonlib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-User modified some info::vehicle`)
                        responseObject = serverResponse.serverResponse(500)
                        res.json(responseObject)
                    }
                })
            break;
            case "jewelry":
                sql = "SELECT j.*, ji.* FROM jewelries j JOIN jewelry_images ji JOIN properties p ON \
                    p.propertyID = j.propertyID AND j.jewelryID = ji.jewelryID AND p.propertyID =?"
                queryDATA = [propertyID]
                mysqlCRUDController.selectQuery(mysqlDBConnection.jewelries_table, sql, queryDATA, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                    if(response != "error" && response.length > 0) {
                        responseObject = serverResponse.serverResponse(200)
                        responseObject.data = response
                        res.json(responseObject)
                    }
                    else {
                        commonlib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-User modified some info::jewelry`)
                        responseObject = serverResponse.serverResponse(500)
                        responseObject.data = response
                        res.json(responseObject)
                    }
                })
            break;
            case "realestate":
                sql = "SELECT r.*, ri.* FROM realestates r JOIN realestate_images ri JOIN properties p ON \
                    p.propertyID = r.propertyID AND ri.realestateID = r.realestateID AND r.propertyID =?"
                queryDATA = [propertyID]
                mysqlCRUDController.selectQuery(mysqlDBConnection.realestates_table, sql, queryDATA, [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                    if(response != "error" && response.length > 0) {
                        responseObject = serverResponse.serverResponse(200)
                        responseObject.data = response
                        res.json(responseObject)
                    }
                    else {
                        commonlib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-User modified some info::realestate`)
                        responseObject = serverResponse.serverResponse(500)
                        res.json(responseObject)
                    }
                })
            break;
            default:
                commonlib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-no propertyType`)
                responseObject = serverResponse.serverResponse(500);
                res.json(responseObject)
        }
    }
    catch(error) {

    }
}

router.get("/get-certain-property/:propertyType/:propertyID", (req, res) => {
    getCertainProperty(req, res)
})

module.exports = router