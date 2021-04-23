const express = require('express');
const app=express();
const moment = require('moment');
const router = express.Router();
const bodyparser = require('body-parser');

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

    const startOfWeek = moment().startOf('week').toDate();
    const endOfWeek = moment().endOf('week').toDate();
    const startOfMonth = moment().clone().startOf('month').toDate();
    const endOfMonth = moment().clone().endOf('month').toDate();
    const startOfYear = moment().clone().startOf('year').toDate();
    const endOfYear = moment().clone().endOf('year').toDate();
    
    let totalAmount = 0;
    let totalHours = 24;

    //to store the final result 
    var data = [];
    const today = moment().startOf('day');

    //On the basis of each hour 
    if(req.params.query == 'daily'){

       await SALES_TABLE.find({
        daily: req.body.amount,
        date:{
                $gte: today.toDate(),
                $lte: moment(today).endOf('day').toDate()
            },
        },{
            amount: 1,
            date: 1,
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

            for (let i = 0; i < totalHours; i++) {
                totalAmount = 0;
                //For getting the amount based on hours
                result.forEach(element => {
                    if(i == element.date.getHours()){
                        totalAmount += element.amount;
                    }
                });

                data.push({hour: i + ":00 to " + (i+1)+ ":00",amount: totalAmount});
            }

            return res.json({
                    status: true,
                    message: 'Amount is successfully fetched',
                    result: data
                });
        });
    }else if(req.params.query == 'weekly'){
        await SALES_TABLE.find({
            weekly: req.body.amount,
            date:{ 
                $gte: startOfWeek,
                $lte: endOfWeek
            },
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

            

            for (var m = moment(startOfWeek); m.isBefore(endOfWeek); m.add(1, 'days')) {
                totalAmount = 0;
                //For getting the amount based on weekdays
                result.forEach(element => {
                    if(m.day() == element.date.getDay()){
                        totalAmount += element.amount;
                    }
                });

                data.push({weekday: m.format('dddd'),amount: totalAmount});
            }

            return res.json({
                    status: true,
                    message: 'Amount is successfully fetched',
                    result: data
                });
        });
    }else if(req.params.query == 'monthly'){
        await SALES_TABLE.find({
            monthly: req.body.amount,
            date:{ 
                $gte: startOfMonth,
                $lte: endOfMonth
            },
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

            for (var m = moment(startOfMonth); m.isBefore(endOfMonth); m.add(1, 'months')) {
                totalAmount = 0;

                //For getting the amount based on weekdays
                result.forEach(element => {
                    if(m.month() == element.date.getMonth()){
                        totalAmount += element.amount;
                    }
                });

                data.push({month: m.format('MMMM'),amount: totalAmount});
            }
            return res.json({
                    status: true,
                    message: 'Amount is successfully fetched',
                    result: data
                });
        });
    }else if(req.params.query == 'yearly'){
        await SALES_TABLE.find({
            monthly: req.body.amount,
            date:{ 
                $gte: startOfYear,
                $lte: endOfYear
            },
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

            for (var m = moment(startOfYear); m.isBefore(endOfYear); m.add(1, 'months')) {
                totalAmount = 0;
                console.log(m.year());

                //For getting the amount based on weekdays
                result.forEach(element => {
                    if(m.month() == element.date.getMonth()){
                        totalAmount += element.amount;
                    }
                });

                data.push({month: m.format('MMMM'),amount: totalAmount});
            }
            return res.json({
                    status: true,
                    message: 'Amount is successfully fetched',
                    result: data
                });
        });
    }
}); 


//To fetch all the records
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