const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const passport = require('./passportConfig')
const app = express();
const port = 5000;
const corsOptions = {
  origin: 'http://localhost:3000', 
  credentials: true, 
};
const sessionStore = new MySqlStore({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root',
  database: 'ticket_management',
  clearExpired: true,
  checkExpirationInterval: 900000,
  expiration: 86400000,
});
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors(corsOptions))
app.use(
  session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 },
    store: sessionStore
  })
);

app.use(passport.initialize());
app.use(passport.session());

const usersRouter = require('./routes/users');
const ticketsRouter = require('./routes/tickets');

app.use('/users', usersRouter);
app.use('/tickets', ticketsRouter);




app.listen(port, () => { console.log(`Server started on port ${port}`) })
