const User = require("../models/User");

// Function to fetch and render user information on the g2.ejs view
const g2Info = async (req, res) => {
  const userData = await User.findById(loggedIn);
  if (userData && userData.licenseNumber !== "undefined") {
    // If user data exists and the licenseNumber is not "undefined", render the g2.ejs view with user data
    res.render("g2.ejs", { userData: userData });
  } else {
    // If no user data found or licenseNumber is "undefined", render the g2.ejs view with a new User instance
    res.render("g2.ejs", { userData: new User() });
  }
};

// Function to fetch and render user information based on their license number on the g2.ejs view
const g2ByLicenceNumber = async (req, res) => {
  const userData = await User.find({
    licenseNumber: req.params.licenseNumber,
  });
  res.render("g2.ejs", {
    userData,
  });
};

// Function to update the user's information in the database and redirect to the home page
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

// Function to get available time slots for the selected date and return as JSON
const getAvailableSlots = async (req, res) => {
  const selectedDate = req.body.selectedDate;
  // Assuming you have an "Appointment" model to store appointment slots
  const availableSlots = await Appointment.find({ Date: selectedDate, isTimeSlotAvailable: true });

  res.json(availableSlots);
};

module.exports = { g2Info, g2ByLicenceNumber, updatedUserInfo, getAvailableSlots };
