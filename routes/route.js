const express = require('express');
const app=express();

const date = require('date-and-time');
const router = express.Router();
const bodyparser = require('body-parser');
const common_functions = require("../utils/common_functions");

//MODAL
const SALES_TABLE = require('./../Models/salesTableSchema');

router.use(bodyparser.json());
router.use(bodyparser.urlencoded({extended: true}));


//api to add data into sales table
router.post('/insertData',async (req,res)=>{
  try {

    SALES_TABLE.create({
        username: req.body.username,
        amount: req.body.amount
    },
        (error,result)=>{
            if(error){
                return res.json({
                    status: false,
                    message: 'Unable to insert the data',
                    error: error
                });
            }

            return res.json({
                    status: true,
                    message: 'Data inserted successfully!',
                    result: result
            });
        });

  } catch (e) {
    console.log('Error : ' + e);
  } 
});

//api to fetch stats from the sales table
router.get('/fetch_stats/:query',async (req,res) =>{
    console.log(req.params);
    
    let totalAmount = 0;
    let today;
    let totalHours = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24];
    let totalHoursRepresentation = 
    ["00:00 to 01:00","01:00 to 02:00","02:00 to 03:00","03:00 to 04:00","04:00 to 05:00","05:00 to 06:00",
    "06:00 to 07:00","07:00 to 08:00","08:00 to 09:00","09:00 to 10:00","10:00 to 11:00","11:00 to 12:00",
    "12:00 to 13:00","13:00 to 14:00","14:00 to 15:00","15:00 to 16:00","16:00 to 17:00","17:00 to 18:00",
    "18:00 to 19:00","19:00 to 20:00","20:00 to 21:00","21:00 to 22:00","22:00 to 23:00","23:00 to 24:00"];
    let totalWeekDays = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    let totalMonths = ["January","Feburary","March","April","May","June","July","August","September","October","November","December"];

    var dataByHours = [];

    //On the basis of each hour 
    if(req.params.query == 'daily'){

       await SALES_TABLE.find({
        daily: req.body.amount,
        },{
            amount: 1,
            date:1,
            _id : 0
        },
        (error,result) => {
            if(error){
                return res.json({
                    status: false,
                    message: 'Unable to fetch the amount on daily basis',
                    error: error
                });
            }

            for (let i = 0; i < totalHours.length; i++) {
                totalAmount = 0;
                //For getting the amount based on hours
                result.forEach(element => {
                        today = common_functions.isToday(element.date);
                            if(today){
                                if(totalHours[i] == element.date.getHours()){
                                totalAmount += element.amount;
                            }
                        }
                        });

                        dataByHours.push({hour: totalHoursRepresentation[i],amount: totalAmount});
            }

            return res.json({
                    status: true,
                    message: 'Amount is successfully fetched',
                    result: dataByHours
                });
        });
    }else if(req.params.query == 'weekly'){
        await SALES_TABLE.find({
            weekly: req.body.amount,
        },{
            amount: 1,
            date:1,
            _id : 0
        },
        (error,result) => {
            if(error){
                return res.json({
                    status: false,
                    message: 'Unable to fetch the amount on weekly basis',
                    error: error
                });
            }

            for (let i = 0; i < totalWeekDays.length; i++) {
                totalAmount = 0;
                //For getting the amount based on weekdays
                result.forEach(element => {
                    if(totalWeekDays[i] == totalWeekDays[element.date.getDay()]){
                        totalAmount += element.amount;
                    }
                });

                dataByHours.push({weekday: totalWeekDays[i],amount: totalAmount});
            }

            return res.json({
                    status: true,
                    message: 'Amount is successfully fetched',
                    result: dataByHours
                });
        });
    }else if(req.params.query == 'monthly'){
        await SALES_TABLE.find({
            monthly: req.body.amount,
        },{
            amount: 1,
            date:1,
            _id : 0
        },
        (error,result) => {
            if(error){
                return res.json({
                    status: false,
                    message: 'Unable to fetch the amount on monthly basis',
                    error: error
                });
            }

            for (let i = 0; i < totalMonths.length; i++) {
                totalAmount = 0;
                //For getting the amount based on months
                result.forEach(element => {
                    if(totalMonths[i] == totalMonths[element.date.getMonth()]){
                        totalAmount += element.amount;
                    }
                });

                dataByHours.push({month: totalMonths[i],amount: totalAmount});
            }

            return res.json({
                    status: true,
                    message: 'Amount is successfully fetched',
                    result: dataByHours
                });
        });
    }


}); 

router.get('/fetchAll',async (req,res) => {
    await SALES_TABLE.find({},(error,result)=>{
        if(error){
            return res.json({
                status: false,
                message: "Unable to fetch the records",
                error: error
            });
        }

        return res.json({
            status: true,
            message:"Successfully fetched all the records",
            result: result
        });
    });
});

module.exports = router; 