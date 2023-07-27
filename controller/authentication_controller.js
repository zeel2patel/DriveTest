const bcrypt = require("bcrypt");
const Auth = require("../models/authentication");
const validate = require("../middleware/validate_error");

const login_auth = async (req, res) => {
  const { Username, Password } = req.body;
  if (!Username || !Password) {
    return res.render("login.ejs", { errs: ["Enter Username and Password"] });
  }

  try {
    const user = await Auth.findOne({ Username: Username });
    if (!user) {
      return res.render("login.ejs", { errs: ["Invalid username or password"] });
    }

    const same = await bcrypt.compare(Password, user.Password);
    if (same) {
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

const signup_auth = async (req, res) => {
  const body = req.body;

  if (body.Password !== body.rePass) {
    return res.render("login.ejs", { errs: ["Both passwords don't match."] });
  }

  try {
    const hashedPassword = await bcrypt.hash(body.Password, 10);
    const user = {
      Username: body.Username,
      Password: hashedPassword,
      UserType: body.UserType,
    };

    const newUser = await Auth.create(user);
    return res.render("login.ejs", {
      success: ["Successfully Registered. Proceed to Login"],
    });
  } catch (error) {
    console.error(error);
    validate(req, error);
    return res.render("login.ejs", { errs: req.flash("Validation Errors") });
  }
};

const logout_auth = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect("/login");
  });
};

module.exports = { login_auth, logout_auth, signup_auth };
