const express = require('express');
const app=express();
const moment = require('moment');
const router = express.Router();
const bodyparser = require('body-parser');

//MODAL
const SALES_TABLE = require('./../Models/salesTableSchema');
const common_functions = require('./../utils/common_functions');

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

//api to fetch stats from the sales table based on the query 
router.get('/fetch_stats/:query',async (req,res) =>{
    console.log(req.params);

    switch(req.params.query) {
        case 'daily':
                common_functions.dailyData(req,res);
            break;
        case 'weekly':
                common_functions.weeklyData(req,res);
            break;
        case 'monthly':
                common_functions.monthlyData(req,res);
            break;
        case 'yearly':
                common_functions.yearlyData(req,res);
            break;
        default:
            res.json({
                status: false,
                message: "Searching for the wrong query - Supported queries are /user/fetch_stats/daily or weekly or monthly or yearly"
            });
        // code block
    }
}); 


//api to fetch all the records
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