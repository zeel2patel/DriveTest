const User = require("../models/User");
const bcrypt = require("bcrypt");
const { default: mongoose } = require("mongoose");
const appointment = require("../models/appointments");
const { log } = require("console");

const saveUserData = (req, res) => {
    const data = req.body;
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
  
    appointment.findOneAndUpdate(
      { Date: req.body.Date, Time: req.body.Time },
      { isTimeSlotAvailable: false },
      { new: true },
      (error, appoint) => {
        if (error) {
          return res.render("g2.ejs", { errs: req.flash("Validation Errors") });
        }
        formatedData.appointmentId = appoint._id;
  
        bcrypt.hash(formatedData.licenseNumber, 10, (error, hash) => {
          formatedData.licenseNumber = hash;
          formatedData.authId = new mongoose.Types.ObjectId(req.session.userId);
          User.create(formatedData, (error, sucess) => {
            if (error) {
              return res.render("g2.ejs", { errs: req.flash("Validation Errors") });
            }
            res.redirect("/g");
          });
        });
      }
    );
  };


module.exports = { saveUserData };
