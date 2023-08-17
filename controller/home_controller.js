// Function to render the home page (index.ejs view)
const homePage = (req, res) => {
  res.render("index.ejs");
};

module.exports = { homePage };
