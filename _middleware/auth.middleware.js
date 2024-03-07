module.exports = authenticate;

function authenticate(req, res, next) {
  // Check if the user is logged in
  if (!req.session.user) {
    // If not logged in, you can either redirect to the login page or send an error response
    return res.status(401).json({ message: 'Unauthorized: Please log-in before accessing this route.' });
    // Or redirect to login page
    // res.redirect('/login');
  }

  // If logged in, proceed to the next middleware or route handler
  next();
}