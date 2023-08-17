const User = require("../models/User");

// Function to render the g.ejs view (assumed to be a page related to user info)
const getGInfo = (req, res) => {
  res.render("g.ejs");
};

// Function to fetch and render the user info on the g.ejs view
const fetchGUserInfo = async (req, res) => {
  // Fetch the user info from the User model by using the logged-in user's ID
  const userInfo = await User.findById(loggedIn);
  if (userInfo) {
    // If user info is found, render the g.ejs view with the user data
    res.render("g.ejs", { userData: userInfo });
  } else {
    // If no user is found with the logged-in ID, render the g.ejs view with an error message
    res.render("g.ejs", {
      error: "No User Found",
    });
  }
};

// Function to update the user's car information in the database and then fetch and render the updated user info on the g.ejs view
const updateUserInfo = async (req, res) => {
  // Update the user's car details based on the provided licenseNumber
  await User.findOneAndUpdate(
    { licenseNumber: req.body.licenseNumber },
    {
      carDetails: {
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        plateNumber: req.body.plateNumber,
      },
    }
  );
  // After updating, fetch and render the updated user info on the g.ejs view
  fetchG2UserInfo(req, res);
};

module.exports = { getGInfo, fetchGUserInfo, updateUserInfo };
