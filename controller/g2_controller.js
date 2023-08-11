const User = require("../models/User");

const g2Info = async (req, res) => {
  const userData = await User.findById(loggedIn);
  if (userData && userData.licenseNumber != "undefine") {
    res.render("g2.ejs", { userData: userData });
  } else {
    res.render("g2.ejs", { userData: new User() });
  }
};

const g2ByLicenceNumber = async (req, res) => {
  const userData = await User.find({
    licenseNumber: req.params.licenseNumber,
  });
  res.render("g2.ejs", {
    userData,
  });
};

const updatedUserInfo = async (req, res) => {

  await User.findByIdAndUpdate(
    loggedIn,
    {
      ...req.body,
      carDetails: {
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        plateNumber: req.body.plateNumber,
      },
    }
  );
  res.redirect("/");
};

const getAvailableSlots = async (req, res) => {
  const selectedDate = req.body.selectedDate;
  // Assuming you have an "Appointment" model to store appointment slots
  const availableSlots = await Appointment.find({ Date: selectedDate, isTimeSlotAvailable: true });

  res.json(availableSlots);
};

module.exports = { g2Info, g2ByLicenceNumber, updatedUserInfo, getAvailableSlots };
