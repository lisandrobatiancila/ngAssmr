const express = require("express");
const router = express.Router();
const commonLib = require("../common/commonFunction");
const serverResponse = require("../common/serverResonses");

const GLOBAL_FILENAME = "mobile-push-notifications.js";

router.route("/get-active-user-notifications")
    .post((req, res) => {
        const GLOBAL_FUNCTIONNAME = "getActiveUserNotifications()";
        var lastAlgo = "",
            resultObj = {};
        try{
            const { userID, userEmail } = req.body;
        }
        catch(error) {
            commonLib.errorLogs(GLOBAL_FILENAME, GLOBAL_FUNCTIONNAME, `${lastAlgo}-${error}`);
            resultObj = serverResponse.serverResponse(500);
            res.json(resultObj);
        }
    });

module.exports = router;