//This method will check all routes
const checkLoginAtOtherPage = (req, res, next) => {
  console.log("Session userId:", req.session.userId);
  console.log("Session userType:", req.session.userType);

  if (!loggedIn) {
    return res.redirect("/login"); // Redirect to login page if not logged in
  } else if (req.path === "g2.ejs" || req.path === "g.ejs") {
    if (UserType === "Driver") {
      return res.redirect("/"); // Redirect to root page if user type is not "Driver"
    }
  } else if (req.path === "appointments.ejs") {
    if (UserType === "Admin") {
      return res.redirect("/"); // Redirect to root page if user type is not "Driver"
    }
  }
    else if (req.path === "examiner.ejs") {
      if (UserType === "Examiner") {
        return res.redirect("/"); // Redirect to root page if user type is not "Driver"
      }
  }
  else {
    // For all other cases, allow access to the route
    next();
  }
};


// Authorization Middleware for Driver
const authDriver = async (req, res, next) => {
  console.log("Authorizing driver");
  if (req.session.userType == "Driver") {
    next();
  } else {
    res.redirect("/");
  }
};

// Authorization Middleware for Admin
const authAdmin = async (req, res, next) => {
  console.log("Authorizing admin");
  if (req.session.userType == "Admin") {
    next();
  } else {
    res.redirect("/");
  }
};

const authExaminer = async (req, res, next) => {
  console.log("Authorizing Examiner");
  if (req.session.userType == "Examiner") {
    next();
  } else {
    res.redirect("/");
  }
};

//This middleware is just for the login and signup page
//If user is already logged in redirect them to Dashboard
const checkGetLogin = (req, res, next) => {
  if (loggedIn) {
    return res.redirect("/");
  }
  next();
};

// middleware/examinerMiddleware.js


const  checkExaminerAccess = (req, res, next) => {
    if (req.session.UserType === 'Examiner') {
      // User is an examiner, allow access
      next();
    } else {
      // User is not an examiner, redirect to unauthorized page
      res.redirect('/unauthorized');
    }
  };



module.exports = { checkLoginAtOtherPage, authDriver, authAdmin,authExaminer, checkGetLogin, checkExaminerAccess };
