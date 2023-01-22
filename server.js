const express = require("express")
const cors = require("cors")
const server = express()
require("dotenv").config()

const assmrAPP = require("./app-server")

const PORT = process.env.PORT

server.use(assmrAPP)

server.listen(PORT, () => {
    console.log(`Listening to port: ${PORT}`);
})