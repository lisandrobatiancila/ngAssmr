const fs = require("fs")

module.exports = {
    errorLogs: function(fileName, functionName, errorMessage) {
        let errorObj = {
            fileName,
            functionName,
            errorMessage,
            log_date: `${new Date().getFullYear()}_${new Date().getMonth()+1}_${new Date().getDate()}`
        }

        fs.appendFileSync("logs/error_logs.xt", "\n"+JSON.stringify(errorObj, 2))
    },
    checkIfAccountsExists(pool, queryString, queryData, queryTag, callback) {
        pool.getConnection((error, connection) => {
            if(error)
                this.errorLogs(queryTag[0], queryTag[1], `${queryTag[2]}-${error}`.toString())
            
            connection.query(queryString, queryData, (error, response) => {
                if(error)
                    this.errorLogs(queryTag[0], queryTag[1], `${queryTag[2]}-${error}`.toString())

                if(response.length > 0)
                    callback(true) // means-we-can't-create that user
                else
                    callback(false) //mean-we-can-create that user
            })
        })
    },
    checkIfUserLoggedIn(pool, queryString, queryData, queryTag, callback) {
        pool.getConnection((error, connection) => {
            if(error)
                this.errorLogs(queryTag[0], queryTag[1], `${queryTag[2]}-${error}`.toString())
            connection.query(queryString, queryData, (error, response) => {
                if(error)
                    this.errorLogs(queryTag[0], queryTag[1], `${queryTag[2]}-${error}`.toString())
                if(response.length > 0)
                    callback(true)
                else
                    callback(false)
            })
        })
    }
}