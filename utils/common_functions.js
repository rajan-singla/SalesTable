const moment = require('moment');
//MODAL
const SALES_TABLE = require('./../Models/salesTableSchema');

const startOfWeek = moment().startOf('week').toDate();
const endOfWeek = moment().endOf('week').toDate();
const startOfMonth = moment().clone().startOf('month').toDate();
const endOfMonth = moment().clone().endOf('month').toDate();
const startOfYear = moment().clone().startOf('year').toDate();
const endOfYear = moment().clone().endOf('year').toDate();

//function to get the data based on hourly basis for the current
var daily_data = (req,res)=> {

    let totalAmount = 0;
    let totalHours = 24;

    //to store the final result 
    var data = [];
    const today = moment().startOf('day');

  return SALES_TABLE.find({
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

}

//function to get the data based on week days
var weekly_data = (req,res)=>{

    let totalAmount = 0;

    //to store the final result 
    var data = [];

  return SALES_TABLE.find({
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
}

//function to get the data based on the month which are present in the database
var monthly_data = (req,res) => {

    let totalAmount = 0;

    //to store the final result 
    var data = [];

  return SALES_TABLE.find({
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
}

//Function to get the data based on each month in a year 
var yearly_data = (req,res) =>{

    let totalAmount = 0;

    //to store the final result 
    var data = [];

  return SALES_TABLE.find({
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

//Checking the today's date
const isToday = (someDate) => {
  const today = new Date();
  return someDate.getDate()  == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
}

exports.isToday = isToday;
exports.dailyData = daily_data;
exports.weeklyData = weekly_data;
exports.monthlyData = monthly_data;
exports.yearlyData = yearly_data;