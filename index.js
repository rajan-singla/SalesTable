const express = require("express");
const app = express();

const bodyParser = require('body-parser');
const cors=require("cors");
const morgon=require("morgan");

var database = require('./database');
require('dotenv').config();
//IMPORT ROUTES
const userRoutes = require('./routes/route');

//use routes here
app.use('/user',userRoutes); //route for user

app.all('/',(req,res)=>{
    res.json({
        status: true,
        message:"Index/page running..."
    });
});


//Listens to the port
app.listen(
    process.env.PORT,
    () =>{
        console.log(`The port is listening on ${process.env.PORT}`);
    }
);
