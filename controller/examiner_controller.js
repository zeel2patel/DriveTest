// controllers/examinerController.js

const User = require('../models/User');
const appointment = require("../models/appointments");



  const dashboard = async (req, res) => {
    try {
      // Fetch user data for both G and G2 tests
      const gPageUserData = await User.find({ UserType: 'Driver', TestType: 'G' });
      const g2PageUserData = await User.find({ UserType: 'Driver', TestType: 'G2' });
  
      res.render('examiner.ejs', {
        gPageUserData,
        g2PageUserData,
      });
    } catch (error) {
      console.error(error);
      res.render('examiner.ejs', { error: 'An error occurred' });
    }
  };
  const viewAppointments = async (req, res) => {
    try {
      const userId = req.session.userId; // Get the examiner's user ID from the session
      const appointment = await Appointment.find({ examinerId: userId }); // Fetch actual appointment data from the database
      res.render('examiner/appointments', { appointment }); // Render the view with fetched appointment data
    } catch (error) {
      console.error(error);
      res.redirect('/examiner'); // Redirect to dashboard on error
    }
  };

  const markPassFail = async (req, res) => {
    const userId = req.params.userId; // Change to the appropriate parameter name
    const { passFail } = req.body;
  
    try {
      // Update user's pass/fail status
      await User.findByIdAndUpdate(userId, { passFail });
  
      // Redirect back to the examiner appointments page
      res.redirect('/appointments');
    } catch (error) {
      console.error(error);
      res.redirect('/appointments'); // Handle error and redirect
    }
  };
  
  const addComment = async (req, res) => {
    const userId = req.params.userId; // Change to the appropriate parameter name
    const { comment } = req.body;
  
    try {
      // Update user's comment
      await User.findByIdAndUpdate(userId, { comment });
  
      // Redirect back to the examiner appointments page
      res.redirect('/appointments');
    } catch (error) {
      console.error(error);
      res.redirect('/appointments'); // Handle error and redirect
    }
  };

  module.exports = { dashboard, viewAppointments, addComment, markPassFail };
