const commonLib = require("../common/commonFunction")

const GLOBAL_FILE_NAME = "mysqlController.js"
const crud = {
    insertQuery: function(pool, queryString, queryData, queryTag, callback) {
        pool.getConnection((error, connection) => {
            if(error) {
                commonLib.errorLogs(queryTag[0], queryData[1], `${queryTag[2]}-${error}`.toString())
            }
            connection.query(queryString, queryData, (error, result) => {
                connection.release()
                connection.destroy()
                if(error)
                    commonLib.errorLogs(queryTag[0], queryData[1], `${queryTag[2]}-${error}`.toString())
                else
                    callback("success")
            })

            connection.on("error", (error) => {
                connection.release()
                connection.destroy()

                callback("error")
            })
        })
    },
    selectQuery: function(pool, queryString, queryData, queryTag, callback) {
        pool.getConnection((error, connection) => {
            if(error) {
                commonLib.errorLogs(queryTag[0], queryTag[1], `${queryTag[2]}-${error}`.toString())
            }
            
            connection.query(queryString, queryData, (error, response) => {
                if(error)
                    commonLib.errorLogs(queryTag[0], queryTag[1], `${queryTag[2]}-${error}`.toString())
                else
                    callback(response)
            })
            
            connection.on("error", (error) => {
                connection.release()
                connection.destroy()

                callback("error")
            })
        })
    },
    updateQuery: function() {

    },
    deleteQuery: function() {

    }
}

module.exports = crud