const express = require("express")
const app = express()

app.use(express.static(`${__dirname}/public`))
    .get("/", (req, res) => {
        res.sendFile(`${__dirname}/public/views/index.html`)
    })

let controllerLists = [
    "./server/controller/accountsServerController.js",
    "./server/controller/fileServerController.js",
    "./server/controller/browsePropertyServerController.js"
]

app.use(express.static("public"))
app.use("/uploads", express.static("uploads"))

controllerLists.map(cl => {
    app.use("/api", require(cl))
})
    
module.exports = app