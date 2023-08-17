const User = require('../models/User');


const viewPassFailCandidates = async (req, res) => {
    try {
      const passFailCandidates = await User.find({
        $or: [{ passFail: 'Pass' }, { passFail: 'Fail' }],
      });
      res.render('passfail.ejs', { passFailCandidates });
    } catch (error) {
      console.error(error);
      res.render('passfail.ejs', { error: 'An error occurred' });
    }
  };
const issueOrder = async (req, res) => {
  const userId = req.params.userId;
  try {
    // Implement logic to issue an order for creating a driver license to the external vendor
    // This might involve updating a 'licenseIssued' field in the User model
    // and other relevant steps.
    
    // Redirect back to the pass/fail candidates view
    res.redirect('passfail.ejs');
  } catch (error) {
    console.error(error);
    res.redirect('passfail.ejs');
  }
};

  
  
module.exports = { viewPassFailCandidates, issueOrder };
