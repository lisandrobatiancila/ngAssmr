const express = require("express");
const router = express.Router();
const commonLib = require("../common/commonFunction");
const serverResponse = require("../common/serverResonses");
const mysqlConn = require("../db/mysqlController");
const dbConn = require("../db/dbConnection");
const date_fn = require("date-fns");

const GLOBAL_FILENAME = "mobile-feedback.js";

router.route("/add-new-feedbacks")
    .post((req, res) => {
        const GLOBAL_FUNCTION = "addNewFeedBacks()";
        var lastAlgo = "@ANFB1",
            responseObj = {};
        try{
            lastAlgo = "@ANFB2"
            const { userID, feedback, rating } = req.body;
            const now = date_fn.format(Date.now(), "yyyy-MM-dd'T'HH:mm:ss");
            const query = "INSERT INTO feedbacks(userID, user_feedback, feedback_rating, feedback_date) VALUES?",
                querydata = [[userID, feedback, rating, now]];
                
            mysqlConn.insertQuery(dbConn.feedbacks_table, query, [querydata], [GLOBAL_FILENAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response != "error") {
                    responseObj = serverResponse.serverResponse(200);
                    responseObj.message = "Your feedback was accepted.";
                    res.json(responseObj);
                }
                else {
                    responseObj = serverResponse.serverResponse(500);
                    res.json(responseObj);
                }
            });
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTION, `${lastAlgo}-${error}`);
            responseObj = serverResponse.serverResponse(500);
            res.json(responseObj);
        }
    }); // user add new feedbacks

router.route("/get-all-feedbacks")
    .get((req, res) => {
        const GLOBAL_FUNCTION = "getAllFeedBacks()";
        var lastAlgo = "@GAFB1",
            responseObj = {};
        try{
            lastAlgo = "@GAFB2";
            const query = "SELECT a.*, CONCAT(b.userLname, ', ', b.userFname, ' ', LEFT(b.userMname, 1)) as user_full_name FROM feedbacks a INNER JOIN users b ON b.userID = a.userID";
            mysqlConn.selectQuery(dbConn.feedbacks_table, query, [], [GLOBAL_FILENAME, GLOBAL_FUNCTION, lastAlgo], (response) => {
                if(response != "error") {
                    responseObj = serverResponse.serverResponse(200);
                    responseObj.userFeedBacks = response;
                    res.json(responseObj);
                }
                else {
                    responseObj = serverResponse.serverResponse(500);
                    responseObj.message = "Something went wrong, getting feedbacks!";
                    res.json(responseObj);
                }
            }) ;
        }
        catch(error) {

        }
    }); // get all feedbacks

module.exports = router;