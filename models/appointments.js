const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the appointment schema using Mongoose Schema
const appointmentSchema = new Schema({
    Date: {
        type: String,
    },
    Time: {
        type: String,
    },
    IsTimeSlotAvailable: {
        type: Boolean,
        default: true, // Default value set to true for IsTimeSlotAvailable
    },
    admin: { type: String },
    driverData: {
        type: Object,
        default: null,
      },
});

// Create a Mongoose model named "appointment" based on the appointmentSchema
const appointment = mongoose.model("appointment", appointmentSchema);


module.exports = appointment;
