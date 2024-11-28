//TEST WITH GOOGLE OAUTH
require('dotenv').config(); // Load environment variables
const express = require('express');
const mysql = require('mysql2');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const app = express();

// Database Connection
const connection = mysql.createConnection({
  host: 'webapps4-db.miserver.it.umich.edu',
  user: 'southasiandictionarydb',
  password: 'h8u@lce@EfXK6k!2',
  database: 'southasiandictionarydb',
  port: 3306,
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err.message);
    return;
  }
  console.log('Connected to the database');
});

// Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback',
    },
    function (accessToken, refreshToken, profile, done) {
      // Example: Save user info in session or database
      return done(null, profile);
    }
  )
);

// Serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Middleware Setup
app.use(session({ secret: 'secret', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Define Routers
const router = express.Router();
const authRouter = express.Router();

// Database Routes
router.get('/api/test-connection', (req, res) => {
  connection.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return res.status(500).send('Database connection error');
    }
    res.send(`Database test successful: ${results[0].solution}`);
  });
});

router.get('/api/words', (req, res) => {
  connection.query('SELECT * FROM words', (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).send('Database query error');
    }
    res.json(results);
  });
});

// Google Authentication Routes
router.get('/auth/google', passport.authenticate('google', {
  scope: ['email', 'profile'],
  prompt: 'select_account',
}));

router.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/node/welcome');
  }
);

router.get('/welcome', (req, res) => {
  if (!req.user) {
    return res.redirect('/');
  }
  res.send(`
    <h1>Welcome ${req.user.displayName}</h1>
    <p>Email: ${req.user.emails[0].value}</p>
    <a href="/logout">Logout</a>
  `);
});

router.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) return next(err);

    req.session.destroy(() => {
      const googleLogoutURL = `https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=${encodeURIComponent('http://localhost:3000')}`;
      res.redirect(googleLogoutURL);
    });
  });
});

router.get('/login', (req, res) => {
  res.send('<h1>Login with Google</h1><a href="/node/auth/google">Login</a>');
});

// Apply the `/node` prefix to the database routes
// app.use('/node', router);
app.use('/', router);

// Start the Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});