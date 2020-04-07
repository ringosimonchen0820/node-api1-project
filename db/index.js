// implement your API here
const express = require('express');
const Data = require('./data/db');
const port = 5000;

const server = express();

//! middleware
server.use(express.json()); // teaches the server to parse JSON from the body

//* endpoints

server.get("/", (req, res) => {
    res.json({ message: 'server is running' });
});

//* get <<<<<<<<<< get data for all users
server.get('/api/users', (req, res) => {
    Data.find()
    .then(users => {
        res.status(200).json(users);
    })
    .catch(err => {
        res.status(500).json({ success: false, errorMessage: 'users are not able to retrieved', err });
    })
});

//* post <<<<<<<<<< add new user
server.post('/api/users', (req, res) => {
    const newUser = req.body;

    if(newUser.name && newUser.bio) {
        Data.insert(newUser)
        .then(user => {
            res.status(201).json(user);
        })
        .catch(err => {
            console.log(err);
            res.status(409).json({ success: false, errorMessage: 'error adding data to the data, please try again', err });
        })
    } else {
        res.status(400).json({ success: false, errorMessage: 'please provide name and bio for the user' });
    }
});

//* get <<<<<<<<<< get user info with provided id
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    Data.findById(id)
    .then(found => {
        if(found) {
            res.status(200).json(found);
        } else {
            res.status(404).json({ success: false, errorMessage: 'the user with the id does not exist' });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({ success: false, errorMessage: 'server unable  to retrieved data from the database', err });
    })
});

//* delete <<<<<<<<<< delete user with provided id
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    Data.remove(id)
    .then(found => {
        if(found) {
            res.status(200).json(found);
        } else {
            res.status(404).json({ success: false, errorMessage: 'the user with the id does not exist' });
        }
    })
    .catch(err => {
        res.status(500).json({ success: false, errMessage: 'server unable to remove user from the database', err });
    })
});

//* put <<<<<<<<<< update user with provided id
server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const editUser = req.body;

    if(editUser.name && editUser.bio) {
        Data.update(id, editUser)
        .then(user => {
            if(user){
                res.status(201).json(user)
            } else {
                res.status(404).json({ errorMessage: 'The user with the specified ID does not exist' })
            }
        })
        .catch(err => {
            res.status(500).json({ success: false })
        })
    }
})

server.listen(port, () => {
    console.log(`server listening on port: ${port}`);
});
