const User = require("../models/User");
const bcrypt = require("bcrypt");

// Function to render the login page (login.ejs view)
const loginInfo = (req, res) => {
  res.render("login.ejs");
};

// Function to handle user registration and create a new user in the database
const loginDetails = async (req, res) => {
  const { username, password, cpassword } = req.body;

  try {
    const existingUser = await User.findOne({ username: username });

    if (password === cpassword) {
      if (!existingUser) {
        // If the passwords match and the user doesn't already exist, create a new user in the database
        await User.create(req.body);
        res.redirect("/");
      } else {
        // If the user with the provided username already exists, render the login page with an error message
        console.log("Already Exists");
        res.render("login.ejs", {
          error: "User Name already Exists.",
        });
      }
    } else {
      // If the provided passwords don't match, render the login page with an error message
      console.log("Password doesn't Match");
      res.render("login.ejs", { error: "Password doesn't Match" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.render("login.ejs", { error: "An error occurred" });
  }
};

// Function to authenticate user login and create a session for the authenticated user
const authenticateUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username: username });

    if (user) {
      const isPasswordMatch = bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        // If the provided password matches the hashed password in the database, create a session for the user and redirect to the home page
        req.session.userId = user._id;
        req.session.userType = user.userType;
        global.loggedIn = req.session.userId;
        global.userType = req.session.userType;
        console.log("User logged in successfully!");
        res.redirect("/");
      } else {
        // If the provided password is incorrect, render the login page with an error message
        res.render("login.ejs", {
          error: "Please Check Your Password",
        });
      }
    } else {
      // If the user with the provided username doesn't exist, render the login page with an error message
      res.render("login.ejs", {
        error: "Invalid Credentials",
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.render("login.ejs", { error: "An error occurred" });
  }
};

// Function to handle user logout and destroy the session
const logout = (req, res) => {
  req.session.destroy(() => {
    // After destroying the session, redirect the user to the home page
    res.redirect("/");
  });
};

module.exports = { loginInfo, loginDetails, authenticateUser, logout };
