const express = require("express");
const app = express();

app.use(express.static(`${__dirname}/public`))
    .get("/", (req, res) => {
        res.sendFile(`${__dirname}/public/views/index.html`);
    });

let controllerLists = [
    "./server/web-controller/accountsServerController.js",
    "./server/web-controller/fileServerController.js",
    "./server/web-controller/browse-property/browsePropertyServerController.js",
    "./server/web-controller/browse-property/viewCertPropServerController.js",

    // MOBILE CONTROLLER
    "./server/mobile-controller/mobile-Credentials.js",
    "./server/mobile-controller/mobile-assumption-of-properties.js",
    "./server/mobile-controller/mobile-post-properties.js",
    "./server/mobile-controller/mobile-my-properties.js",
    "./server/mobile-controller/mobile-update-property.js",
    "./server/mobile-controller/mobile-remove-properties.js",
    "./server/mobile-controller/mobile-feedbacks.js"
];

app.use(express.static("public"));
app.use("/uploads", express.static("uploads"));

controllerLists.map(cl => {
    app.use("/api", require(cl));
});
    
module.exports = app