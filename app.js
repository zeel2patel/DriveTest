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
const { saveUserData } = require("./controller/user_controller");
const G_Controller = require("./controller/g_controller");
const G2_Controller = require("./controller/g2_controller");
const home_Controller = require("./controller/home_controller");
const Login_Controller = require("./controller/loginsignup_controller");
// routes/examiner.js





// Set the view engine to EJS
app.set("view engine", "ejs");

// Serve static files from the "public" directory
app.use(express.static("public"));

// Parse JSON and URL-encoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use express-session middleware for managing user sessions
app.use(
  expressSession({
    secret: "zeel", // Session secret used for session data encryption
  })
);

// Set global variables for user authentication status (loggedIn) and user type (UserType)
global.loggedIn = null;
global.UserType = null;

// Middleware to set global variables for loggedIn and UserType
app.use("*", (req, res, next) => {
  global.loggedIn = req.session.userId; // Set loggedIn to the userId stored in the session
  global.UserType = req.session.UserType; // Set UserType to the UserType stored in the session
  next();
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});

// Connect to the MongoDB database
mongoose
  .connect(
    "mongodb+srv://zeelpatel2:89910120Mczd@fullstackcluster0.zs8sixn.mongodb.net/gp2?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// Define routes and their corresponding controllers
app.get("/", home_Controller.homePage); // Home page route
app.get("/g", authMiddleware.checkLoginAtOtherPage, G_Controller.fetchGUserInfo); // Route for "g" page with user info
app.post("/g", authMiddleware.checkLoginAtOtherPage, G_Controller.updateUserInfo); // Update user info route for "g" page
app.get("/g2", authMiddleware.checkLoginAtOtherPage, G2_Controller.g2Info); // Route for "g2" page with user info
app.get("/g2/:LicenceNumber", authMiddleware.checkLoginAtOtherPage, G2_Controller.g2ByLicenceNumber); // Route to get user info by license number for "g2" page
app.post("/g2", authMiddleware.checkLoginAtOtherPage, G2_Controller.updatedUserInfo); // Update user info route for "g2" page
app.get("/login", authMiddleware.checkGetLogin, Login_Controller.loginInfo); // Login page route
app.post("/AuthenticateUser", authMiddleware.checkGetLogin, Login_Controller.authenticateUser); // Authenticate user during login
app.post("/SaveLogin", authMiddleware.checkGetLogin, Login_Controller.loginDetails); // Save user details during signup
app.get("/logout", Login_Controller.logout); // Logout route
app.post("/saveUserData", saveUserData); // Save user data to the database

// Appointments Routes
app.get("/appointments", authMiddleware.checkLoginAtOtherPage, appointmentController.appointmentsPage); // Route to display appointments page
app.post("/appointment-slot", authMiddleware.checkLoginAtOtherPage, appointmentController.createApt); // Route to create a new appointment slot
app.post("/slots", authMiddleware.checkLoginAtOtherPage, appointmentController.getAvailableSlots); // Route to get available time slots for a specific date
app.post("/appointment-slot-book", authMiddleware.checkLoginAtOtherPage, appointmentController.bookAppointmentSlot); // Route to book an appointment slot


//examiner 

// routes/examiner.js


const examinerController = require('./controller/examiner_controller');




// Routes for examiner interface
app.get('/examiner',authMiddleware.checkLoginAtOtherPage, examinerController.dashboard);
app.get('/examiner/appointments',authMiddleware.checkLoginAtOtherPage, examinerController.viewAppointments);
app.get('/appointments',authMiddleware.checkLoginAtOtherPage, examinerController.viewAppointments);
app.post('/examiner/markPassFail/:userId',authMiddleware.checkLoginAtOtherPage, examinerController.markPassFail);
app.post('/examiner/addComment/:userId',authMiddleware.checkLoginAtOtherPage, examinerController.addComment);

const adminController = require('./controller/adminController');

// Define routes for the Admin
app.get('/passfail',authMiddleware.checkLoginAtOtherPage, adminController.viewPassFailCandidates);
app.post('/issue-order/:userId',authMiddleware.checkLoginAtOtherPage, adminController.issueOrder);



module.exports = app;
