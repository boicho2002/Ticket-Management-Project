const passport = require('../passportConfig');
const express = require('express');
const router = express.Router();
const connection = require('../DB/connection');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');


// User Login
router.post('/login', (req, res, next) => {
    console.log("from login page")
    console.log(req.body);
    if (!req.session.user) {
        try {
            passport.authenticate('local', (err, user, info) => {

                if (err) {
                    console.error('Authentication error:', err);
                    return next(err)
                };
                if (!user) {
                    return res.status(401).json({ message: info.message });
                }
                req.logIn(user, (err) => {
                    if (err) {
                        console.error('Login error:', err);
                        return next(err);
                    }

                    req.session.user = user;

                    console.log("Stored session:" + JSON.stringify(req.session.user.role))
                    return res.status(200).json({ message: 'Login successful', user: user });

                });
            })(req, res, next);
            // req.session.user=user;
        } catch (error) {
            console.error('Unhandled error:', error);
            res.status(500).json({ message: 'Internal Server Error' });

        }
    } else res.send("Already logged")

});
// router.get('/profile', (req, res) => {
//     console.log('Received GET request to /profile');

//     if (req.isAuthenticated()) {
//         console.log('User is authenticated');
//         const user = req.user;
//         console.log('Logged user:', user);
//         res.status(200).json({ message: 'User is logged in', user: user });
//     } else {
//         console.log('User is not authenticated');
//         res.status(401).json({ message: 'User not logged in' });
//     }
// });

//Protected route
router.get("/profile", (req, res) => {
    console.log('Getting req')
    console.log(req.session.user);
    if (req.session.user) {
        console.log('Oh yes')
        res.send({ login: true, user: req.session.user });
    }
    else {
        res.send({ login: false });
    }

})
// User Registration
router.post('/register', (req, res) => {
    const { fName, lName, Username, PassWord, role } = req.body;
    console.log(fName, lName, Username, PassWord, role)
    const FullName = fName + ' ' + lName;
    if (fName.trim() === '' || lName.trim() === '' || Username.trim() === '' || hashedPassword.trim() === '') {
        return res.status(401).send({ message: 'All fields are required' })
    }
    bcrypt.hash(PassWord, 10, (err, hashedPassword) => {
        console.log(hashedPassword)
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Registration failed' });
        }

        const sql = `INSERT INTO Users (fName, lName, FullName, Username, PassWord, role) 
                 VALUES (?, ?, ?, ?, ?, ?)`;

        connection.query(sql, [fName, lName, FullName, Username, hashedPassword, role], (err) => {
            if (err) {
                console.error('Error registering user:', err);
                return res.status(400).json({ message: 'Registration failed' });
            }


            return res.status(200).json({ message: 'Registration successful' });
        });
    });
});

// hash all existing passwords
router.post('/updatePasswords', async (req, res) => {
    connection.query("SELECT * FROM Users", (error, users) => {
        if (error) {
            console.error('Error fetching users:', error);
            return res.status(500).json({ message: 'Error fetching users' });
        }

        const updatePassword = (user) => {
            bcrypt.hash(user.PassWord, 10, (hashError, hashedPassword) => {
                if (hashError) {
                    console.error('Error hashing password:', hashError);
                    return res.status(500).json({ message: 'Error hashing password' });
                }

                connection.query("UPDATE Users SET PassWord = ? WHERE id = ?", [hashedPassword, user.id], (updateError) => {
                    if (updateError) {
                        console.error('Error updating password:', updateError);
                        return res.status(500).json({ message: 'Error updating password' });
                    }
                    if (users.length > 0) {
                        updatePassword(users.shift());
                    } else {
                        res.status(200).json({ message: 'Passwords updated successfully' });
                    }
                });
            });
        };
        if (users.length > 0) {
            updatePassword(users.shift());
        } else {
            res.status(200).json({ message: 'No users to update' });
        }
    });
});




// router.get('/protected', (req, res) => {
//     if (req.isAuthenticated() && req.session.user_id) {
//       // User is authenticated
//       res.status(200).json({ message: 'Protected route accessed successfully' });
//     } else {
//       res.status(401).json({ message: 'Unauthorized' });
//     }
//   });
// get all users
router.get('/', (req, res) => {
    connection.query("select * from users", function (err, results) {
        if (err) throw err;
        res.send(results);
    })
})

// user logout
router.get('/logout', function (req, res) {

    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                console.error('Error destroying session:', err);
            } else {
                res.clearCookie('session-id');
                res.redirect('/users');
            }
        });
    } else {
        res.redirect('/users');
    }
    // if (req.user) {
    //     req.session.destroy();
    //     res.redirect('/users');
    // } else {
    //     res.redirect('/users');
    // }

});

module.exports = router
