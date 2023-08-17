const bcrypt = require("bcrypt");
const Auth = require("../models/authentication");
const validate = require("../middleware/validate_error");

// Function to authenticate user login
const login_auth = async (req, res) => {
  const { Username, Password } = req.body;
  if (!Username || !Password) {
    return res.render("login.ejs", { errs: ["Enter Username and Password"] });
  }

  try {
    // Find the user in the database using the provided username
    const user = await Auth.findOne({ Username: Username });
    if (!user) {
      return res.render("login.ejs", { errs: ["Invalid username or password"] });
    }

    // Compare the provided password with the hashed password in the database
    const same = await bcrypt.compare(Password, user.Password);
    if (same) {
      // If the passwords match, create a session for the user and redirect to the home page
      req.session.userId = user._id;
      req.session.UserType = user.UserType;
      return res.redirect("/");
    } else {
      return res.render("login.ejs", { errs: ["Invalid username or password"] });
    }
  } catch (error) {
    console.error(error);
    return res.render("error.ejs", { errs: ["An error occurred"] });
  }
};

// Function to handle user signup
const signup_auth = async (req, res) => {
  const body = req.body;

  // Check if the provided passwords match
  if (body.Password !== body.rePass) {
    return res.render("login.ejs", { errs: ["Both passwords don't match."] });
  }

  try {
    // Hash the user's password before storing it in the database
    const hashedPassword = await bcrypt.hash(body.Password, 10);
    const user = {
      Username: body.Username,
      Password: hashedPassword,
      UserType: body.UserType,
    };

    // Create a new user in the database with the hashed password
    const newUser = await Auth.create(user);
    return res.render("login.ejs", {
      success: ["Successfully Registered. Proceed to Login"],
    });
  } catch (error) {
    console.error(error);
    // If there's an error during signup, display validation errors if any
    validate(req, error);
    return res.render("login.ejs", { errs: req.flash("Validation Errors") });
  }
};

// Function to handle user logout and destroy the session
const logout_auth = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    // Redirect the user to the login page after destroying the session
    res.redirect("/login");
  });
};

module.exports = { login_auth, logout_auth, signup_auth };
