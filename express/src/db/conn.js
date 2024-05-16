const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/traveldb")
    .then(() => {
        console.log(`Connection succeeded`);
    })
    .catch((e) => {
        console.log(`Connection failed: ${e}`);
    });
