// implement your API here
const express = require('express');

const Data = require('./data/db');

const server = express();

server.use(express.json());

// endpoints
server.get("/", (req, res) => {
    res.json({ api: "running....." });
});

// get <<<<< all users
server.get('/api/users', (req, res) => {
    Data.find()
        .then(users => {
            res.status(200).json({ success: true, users });
        })
        .catch(err => {
            res.status(500).json({ success: false, errorMessage: err });
        })
});

// post <<<<< add new user
server.post('/api/users', (req, res) => {
    const newUser = req.body;

    Data.insert(newUser)
        .then(user => {
            if (!newUser.name || !newUser.bio) {
                res.status(400).json({ success: false, errorMessage: 'please provide name or bio for the user' });
            } else {
                res.status(201).json({ success: true, message: `user created, id: ${user.id}`, newUser });
            }
        })
        .catch(err => {
            res.status(500).json({ success: false, errorMessage: 'error adding data, please try again later', err });
        })
});

// get <<<<< get user with id 
server.get('/api/users/:id', (req, res) => {
    const { id } = req.params;

    Data.findById(id)
        .then(user => {
            if (user) {
                res.status(200).json({ success: true, user});
            } else {
                res.status(404).json({ success: false, errorMessage: 'the user id does not exist' });
            }
        })
        .catch(err => {
            res.status(500).json({ success: false, errorMessage: 'server unable to retrieved data from the database, please try again later', err });
        })
});

// delete <<<<< delete user
server.delete('/api/users/:id', (req, res) => {
    const { id } = req.params;

    Data.remove(id)
        .then(foundId => {
            if (foundId) {
                res.status(200).json({ success: true, message: `user ${id} has been deleted` });
            } else {
                res.status(404).json({ success: false, errorMessage: 'the user id does not exist' });
            }
        })
        .catch(err => {
            res.status(500).json({ success: false, errorMessage: 'server unable to remove the user from the database, please try again later', err });
        })
});

// put <<<<< update user info with provided id
server.put('/api/users/:id', (req, res) => {
    const { id } = req.params;
    const updatedInfo = req.body;

    if (!(updatedInfo.name && updatedInfo.bio)) {
        res.status(500).json({ success: false, errorMessage: 'Please updated the name and bio' });
    } else {
        Data.update(id, updatedInfo)
            .then(user => {
                if (user) {
                    res.status(200).json({ success: true, message: `user ${id} updated`, updatedInfo });
                } else {
                    res.status(404).json({ success: false, errorMessage: 'the user with the id does not exist' });
                }
            })
            .catch(err => {
                res.status(500).json({ success: false, errorMessage: 'the user infomation can not be retrieved', err });
            })
    }
});


const port = 5000;
server.listen(port, () => {
    console.log(`api on port ${port}`);
});

