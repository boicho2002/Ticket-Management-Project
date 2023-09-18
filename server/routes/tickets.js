const express = require('express');
const passport = require('../passportConfig');
const router = express.Router();
const connection = require('../DB/connection');

// Create Ticket
router.post('/create', (req, res) => {
    if (req.session.user) {

        const { ShortDesc, description, State, Priority, created_on } = req.body; 
        if (ShortDesc.trim() === '' || description.trim() === '' || State.trim() === '' || Priority.trim() === '') {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const user_id = req.session.user.id;
        console.log("User ID: " + user_id);
        const query = 'INSERT INTO Tickets (user_id,ShortDesc,description,State,Priority,created_on) VALUES (?,?, ?, ?, ?,CURRENT_TIMESTAMP())';
        const values = [user_id, ShortDesc, description, State, Priority, created_on];
        
       
        connection.query(query, values, (err, result) => {
            if (err) {
                res.status(500).send(err);
            } else {
                res.send(result);
            }
        });
    }

});


router.get('/all', (req, res) => {
    connection.query("SELECT * FROM tickets", function (err, results) {
        if (err) throw err;
        res.send(results);

    })
});
router.get('/', (req, res) => {
    const page = req.query.page || 1;
    const pageSize = 5;
    const offset = (page - 1) * pageSize;

    const query = `SELECT * FROM tickets ORDER BY id LIMIT ${pageSize} OFFSET ${offset}`;

    connection.query(query, function (err, results) {
        if (err) throw err;
        res.send(results);
    });
});
//load additional tickets
// router.get('/', (req, res) => {
//     const { page, itemsPerPage } = req.query;
//     const offset = (page - 1) * itemsPerPage;

//     const sql = `
//       SELECT * FROM tickets
//       ORDER BY id
//       LIMIT 5 OFFSET 10
//     `;

//     db.query(sql, [parseInt(itemsPerPage), parseInt(offset)], (err, results) => {
//       if (err) {
//         console.error('Error fetching tickets: ', err);
//         res.status(500).json({ error: 'Error fetching tickets' });
//       } else {
//         res.status(200).json(results);
//       }
//     });
//   });

// Get Ticket by ID
router.get('/:id', (req, res) => {
    connection.query("select * from tickets WHERE id= ?", [req.params.id], function (err, results) {
        if (err) throw err;
        res.send(results);
        console.log(results)
    })
});

// Update Ticket by ID
router.put('/:id', (req, res) => {
    const { user_id, ShortDesc, description, State, Priority } = req.body;

    if (!ShortDesc || ShortDesc.trim() === '') {
        console.log(ShortDesc)
        return res.status(400).json({ message: 'ShortDesc is required' });

    }
    const sql = 'UPDATE tickets SET user_id= ?, ShortDesc = ?, description = ?, State=?, Priority=? WHERE id = ?';
    connection.query(sql, [user_id, ShortDesc, description, State, Priority, req.params.id], (err) => {
        if (err) {
            console.error('Error updating ticket:', err);
            return res.status(500).json({ message: 'Error updating ticket' });
        }

        res.json({ message: 'Ticket updated' });
    });
});

// Delete Ticket by ID
router.delete('/:id', (req, res) => {
    if (req.session.user.role === 'Admin') {
        const sql = 'DELETE FROM Tickets WHERE id = ?';
        connection.query(sql, [req.params.id], (err) => {
            if (err) {
                console.error('Error deleting ticket:', err);
                return res.status(500).json({ message: 'Error deleting ticket' });
            }
            res.json({ message: 'Ticket deleted' });
        });

    }
    else {
        res.send({ message: 'You are not admin' })
    }

});

module.exports = router;
