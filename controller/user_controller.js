const User = require("../models/User");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const appointment = require("../models/appointments");
const { log } = require("console");

// Function to save user data to the database
const saveUserData = (req, res) => {
    const data = req.body;
    // Format the data to create a new user object with relevant information
    const formatedData = {
        firstName: data.firstName,
        licenseNumber: data.licenseNumber,
        lastName: data.lastName,
        age: data.age,
        dob: data.dob,
        carDetails: {
            make: data.make,
            model: data.model,
            year: data.year,
            plateNumber: data.plateNumber,
        },
    };
  
    // Find and update an appointment slot in the database to mark it as unavailable
    appointment.findOneAndUpdate(
      { Date: req.body.Date, Time: req.body.Time },
      { isTimeSlotAvailable: false },
      { new: true },
      (error, appoint) => {
        if (error) {
          // If there's an error while updating the appointment, render the g2.ejs view with validation errors
          return res.render("g2.ejs", { errs: req.flash("Validation Errors") });
        }
        // Once the appointment slot is updated, assign the appointmentId to the user data
        formatedData.appointmentId = appoint._id;
  
        // Hash the licenseNumber using bcrypt before saving it to the database
        bcrypt.hash(formatedData.licenseNumber, 10, (error, hash) => {
          formatedData.licenseNumber = hash;
          formatedData.authId = new mongoose.Types.ObjectId(req.session.userId);
          
          // Create a new user in the database with the formatted user data
          User.create(formatedData, (error, success) => {
            if (error) {
              // If there's an error while creating the user, render the g2.ejs view with validation errors
              return res.render("g2.ejs", { errs: req.flash("Validation Errors") });
            }
            // After successful user creation, redirect to the "/g" route
            res.redirect("/g");
          });
        });
      }
    );
};

module.exports = { saveUserData };
