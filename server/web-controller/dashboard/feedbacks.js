const express = require("express");
const router = express.Router();
const mysqlCRUDController = require('../../db/mysqlController')
const mysqlDBConnection = require("../../db/dbConnection")
const serverResponse = require("../../common/serverResonses")
const commonLib = require("../../common/commonFunction")

const GLOBAL_FILE_NAME = "web-controller/dashboard/feedbacks.js";

router.route('/web-feedbacks')
    .get((req, res) => {
        const GLOBAL_FUNCTION = "get_feedbacks()";
        var lastAlgo = "@GF1",
            resultObj = {};
        try{
            const sql = "SELECT * FROM feedbacks";
            mysqlCRUDController.selectQuery(mysqlDBConnection.feedbacks_table, sql, [], [GLOBAL_FILE_NAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response != "error") {
                    resultObj = serverResponse.serverResponse(200);
                    resultObj.feedbacks = response;
                    res.json(resultObj);
                }
                else {
                    resultObj = serverResponse.serverResponse(500);
                    res.json(resultObj);
                }
            });
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILE_NAME, GLOBAL_FUNCTION, `${lastAlgo}-${error}`);
            resultObj = serverResponse.serverResponse(500);
            res.json(resultObj);
        }
    });

module.exports = router;