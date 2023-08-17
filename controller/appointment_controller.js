const appointment = require('../models/appointments');

// Function to render the appointments page and display available slots
const appointmentsPage = async (req, res) => {
  try {
    const availableSlots = await appointment.find({ isTimeSlotAvailable: true }).select("Date Time");
    res.render("appointments.ejs", {
      availableSlot: availableSlots,
    });
  } catch (error) {
    console.error("Error:", error);
    res.render("appointments.ejs", { message: "An error occurred", color: "danger" });
  }
};

// Function to create a new appointment slot
const createApt = async (req, res) => {
  let { sdate, stime } = req.body;
  console.log("date :" + sdate + " time :" + stime);
  try {
    const existingAppointment = await appointment.findOne({ Date: sdate, Time: stime });

    if (existingAppointment) {
      // If the slot already exists, display the existing available slots for the date
      const availableSlots = await appointment.find({ Date: sdate, IsTimeSlotAvailable: true }).select('Time');
      res.render("appointments.ejs", {
        message: "Slot already added",
        color: "danger",
        availableSlot: availableSlots, // Pass the availableSlot data
        addedSlotDate: sdate, // Pass the added slot date
        addedSlotTime: stime, // Pass the added slot time
      });
    } else {
      // If the slot doesn't exist, create a new one and display the available slots for the date
      await appointment.create({
        Date: sdate,
        Time: stime,
        IsTimeSlotAvailable: true, // Set the IsTimeSlotAvailable property to true initially
      });
      const availableSlots = await appointment.find({ Date: sdate, IsTimeSlotAvailable: true }).select('Time');
      res.render("appointments.ejs", {
        message: "Slot Added.",
        color: "info",
        availableSlot: availableSlots, // Pass the availableSlot data
        addedSlotDate: sdate, // Pass the added slot date
        addedSlotTime: stime, // Pass the added slot time
      });
    }
  } catch (error) {
    console.error("Error:", error);
    res.render("appointments.ejs", { message: "An error occurred", color: "danger" });
  }
};

// Function to render the appointments page initially
const getAppointmentPage = (req, res) => {
  res.render('appointments.ejs', { message: "", color: "" });
};

// Function to get available time slots for the given date
const getAvailableSlots = async (req, res) => {
  appointment.find({ Date: req.body.Date, isTimeSlotAvailable: true },
    (error, slots) => {
      if (error) {
        return res.render("g2.ejs", { errs: req.flash("Validation Errors") });
      }
      const available = slots.map((sl) => sl.Time);
      if (available.length == 0) {
        return res.render("g2.ejs", {
          errs: ["There is no slots available for this date."],
        });
      }
      res.render("g2.ejs", { available, Date: req.body.Date });
    }
  );
};

// Function to book an available appointment slot
const bookAppointmentSlot = async (req, res) => {
  console.log("body :", req.body);
  let sdate = req.body.sdate;
  let sTime = req.body.sTime;

  try {
    const appointmentToUpdate = await appointment.findOne({
      sdate: sdate,
      sTime: sTime
    });

    if (appointmentToUpdate) {
      // If the appointment exists, mark the slot as booked and redirect to the appointments page
      appointmentToUpdate.IsTimeSlotAvailable = false;
      await appointmentToUpdate.save();
      res.redirect("/appointment");
    } else {
      res.render("appointments.ejs", { message: "Invalid Appointment", color: "danger" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.render("appointments.ejs", { message: "An error occurred", color: "danger" });
  }
};

module.exports = {
  createApt,
  getAppointmentPage,
  getAvailableSlots,
  bookAppointmentSlot,
  appointmentsPage
};
