const User = require("../models/User");
const bcrypt = require("bcrypt");

const loginInfo = (req, res) => {
  res.render("login.ejs");
};

const loginDetails = async (req, res) => {
  const { username, password, cpassword } = req.body;
  // console.log("user", Username, Password);

  try {
    const existingUser = await User.findOne({ username: username });

    if (password === cpassword) {
      if (!existingUser) {
        await User.create(req.body);
        res.redirect("/");
      } else {
        console.log("Already Exists");
        res.render("login.ejs", {
          error: "User Name already Exists.",
        });
      }
    } else {
      console.log("Password doesn't Match");
      res.render("login.ejs", { error: "Password doesn't Match" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.render("login.ejs", { error: "An error occurred" });
  }
};

const authenticateUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (user) {
      const isPasswordMatch = bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        req.session.userId = user._id;
        req.session.userType = user.userType;
        global.loggedIn = req.session.userId;
        global.userType = req.session.userType;
        console.log("User logged in successfully!");
        res.redirect("/");
      } else {
        res.render("login.ejs", {
          error: "Please Check Your Password",
        });
      }
    } else {
      res.render("login.ejs", {
        error: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.render("login.ejs", { error: "An error occurred" });
  }
};


const logout = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};

module.exports = { loginInfo, loginDetails, authenticateUser, logout };