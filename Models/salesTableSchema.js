const mongoose = require('mongoose');

const salesTableSchema = mongoose.Schema({
  username:{
    type:String,
    required: true
  },
   amount:{
    type:Number,
    required: true
  },
  date:{
    type:Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('salesTableSchema',salesTableSchema);
