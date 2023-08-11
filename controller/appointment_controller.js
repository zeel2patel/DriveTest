const appointment = require('../models/appointments');

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

const createApt = async (req, res) => {
  let { sdate, stime } = req.body;
  console.log(sdate + " time :" + stime);
  try {
    const existingAppointment = await appointment.findOne({ Date: sdate, Time: stime });

    if (existingAppointment) {
      const availableSlots = await appointment.find({ Date: sdate, IsTimeSlotAvailable: true }).select('Time');
      res.render("appointments.ejs", {
        message: "Slot already added",
        color: "danger",
        availableSlot: availableSlots, // Pass the availableSlot data
        addedSlotDate: sdate, // Pass the added slot date
        addedSlotTime: stime, // Pass the added slot time
      });
    } else {
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

const getAppointmentPage = (req, res) => {
  res.render('appointments.ejs', { message: "", color: "" });
};

const getAvailableSlots = async (req, res) => {
  // console.log("query : ", req.query.date);
  // try {
  //   const availableSlot = await appointment.find({ Date: req.query.date, IsTimeSlotAvailable: true }).select('Time');
  //   console.log("avail : ", availableSlot);
  //   return res.send({ availableSlot });
  // } catch (error) {
  //   console.error("Error:", error);
  //   res.status(500).json({ message: "An error occurred" });
  // }

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

const bookAppointmentSlot = async (req, res) => {
  console.log("body :", req.body);
  let date = req.body.date;
  let sTime = req.body.sTime;

  try {
    const appointmentToUpdate = await appointment.findById(sTime);

    if (appointmentToUpdate) {
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
