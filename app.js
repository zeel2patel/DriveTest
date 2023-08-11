const express = require("express");
const app = express();
const port = 4050;
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressSession = require("express-session");
const authMiddleware = require("./middleware/authMiddleware");

// Import the User model
const User = require("./models/User");
const appointmentController = require("./controller/appointment_controller");
const {saveUserData} = require("./controller/user_controller");


const G_Controller = require("./controller/g_controller");
const G2_Controller = require("./controller/g2_controller");
const home_Controller = require("./controller/home_controller");
const Login_Controller = require("./controller/loginsignup_controller");

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  expressSession({
    secret: "zeel",
  })
);

global.loggedIn = null;
global.UserType = null;

app.use("*", (req, res, next) => {
  global.loggedIn = req.session.userId;
  global.UserType = req.session.UserType;
  next();
});

// Start the server
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

mongoose
  .connect(
    "mongodb+srv://zeelpatel2:89910120Mczd@fullstackcluster0.zs8sixn.mongodb.net/assignment4retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Routes
app.get("/", home_Controller.homePage);
app.get("/g", authMiddleware.checkLoginAtOtherPage, G_Controller.fetchGUserInfo);
app.post("/g", authMiddleware.checkLoginAtOtherPage, G_Controller.updateUserInfo);
app.get("/g2", authMiddleware.checkLoginAtOtherPage, G2_Controller.g2Info);
app.get("/g2/:LicenceNumber", authMiddleware.checkLoginAtOtherPage, G2_Controller.g2ByLicenceNumber);
app.post("/g2", authMiddleware.checkLoginAtOtherPage, G2_Controller.updatedUserInfo);
app.get("/login", authMiddleware.checkGetLogin, Login_Controller.loginInfo);
app.post("/AuthenticateUser", authMiddleware.checkGetLogin, Login_Controller.authenticateUser);
app.post("/SaveLogin", authMiddleware.checkGetLogin, Login_Controller.loginDetails);
app.get("/logout", Login_Controller.logout);
app.post("/saveUserData", saveUserData);

// Appointments Routes
app.get("/appointments", appointmentController.appointmentsPage);
app.post("/appointment-slot", appointmentController.createApt);
app.post("/slots", appointmentController.getAvailableSlots);
app.post("/appointment-slot-book", appointmentController.bookAppointmentSlot);

app.use(express.json());

module.exports = app;
