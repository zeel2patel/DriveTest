const User = require("../models/User");

const getGInfo = (req, res) => {
  res.render("g.ejs");
};

const fetchGUserInfo = async (req, res) => {
  const userInfo = await User.findById(loggedIn);
  if (userInfo) {
    res.render("g.ejs", { userData: userInfo });
  } else {
    res.render("g.ejs", {
      error: "No User Found",
    });
  }
};




const updateUserInfo = async (req, res) => {
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
  fatchG2UserInfo(req, res);
};

module.exports = { getGInfo, fetchGUserInfo, updateUserInfo };


