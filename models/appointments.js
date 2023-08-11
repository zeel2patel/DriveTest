const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    Date :{
        type:String
    },
    Time : {
        type : String
    },
    IsTimeSlotAvailable: {
        type : Boolean,
        default: true
    }
})

const appointment = mongoose.model("appointment", appointmentSchema );
module.exports = appointment;