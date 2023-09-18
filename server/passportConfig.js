const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const connection = require('./DB/connection');

passport.use(
  new LocalStrategy({ usernameField: 'username', passwordField: 'password' }, (username, password, done) => {
    connection.query('SELECT * FROM Users WHERE Username = ?', [username], (err, results) => {
      if (err) {
        return done(err);
      }

      if (results.length === 0) {
        return done(null, false, { message: 'Incorrect username or password' });
      }

      const user = results[0];

      bcrypt.compare(password, user.PassWord, (bcryptErr, isMatch) => {
        if (bcryptErr) {
          return done(bcryptErr);
        }

        if (!isMatch) {
          return done(null, false, { message: 'Incorrect username or password' });
        }

        return done(null, user);
      });
    });
  }
  ));
passport.serializeUser((user, done) => {
  console.log('Serializing user:', user);
  done(null, user.id);
});

passport.deserializeUser( (id, done)=> {
  console.log(`Deserializing user with id: ${id}`);
  connection.query('SELECT * FROM Users WHERE id = ?', [id], (err, results) => {
    if (err) {
      return done(err);
    }

    if (results.length === 0) {
      return done(new Error('User not found'));
    }

    const user = results[0];
    done(null, user);
  });
});
module.exports = passport;