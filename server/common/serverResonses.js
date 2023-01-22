module.exports = {
    serverResponse: function(server_code) {
        let message = "",
            status = 0

        switch(server_code) {
            case 200:
                message = "SUCCESS"
                status = 1
            break;
            case 400:
                message = "FILE_NOT_FOUND"
                status = 0
            break;
            case 401:
                message = "INVALID_CREDENTIALS"
                status = 0
            break;
            case 500:
                message = "SERVER_ERROR"
                status = 0
            break;
            default:
                message = "NO_SERVER_CODE"
                status = 0
        }

        return {
            message: message,
            code: server_code,
            status
        }
    }
}