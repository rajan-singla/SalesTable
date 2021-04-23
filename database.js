//init code
var mongoose = require("mongoose");
const assert = require("assert");
require('dotenv').config();

//Accessing the mongodb URL
const db_url = process.env.DB_URL;

//Mongoose connection 
mongoose.connect(
    db_url,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    function(error,link) {
        //check error
        assert.strictEqual(error,null,"DB connect fail...");

        console.log('DB connect success...');
        //console.log(link);
    }
);