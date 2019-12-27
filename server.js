require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const {mongoose} = require('./db/mongoose');
const {User} = require('./models/users');
const {Login} = require('./models/login');
const {ObjectID} = require('mongodb');

const app = express();
const port = process.env.PORT;

app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send(database.users);
})

app.post('/signin', (req, res) => {
    const {email, password} = req.body;
    Login.findOne({
        email: email
    }).then((doc) => {
        if(doc && bcrypt.compareSync(password, doc.password)) {
            // res.json(doc);
            User.findOne({
                email: email
            }).then((user) => {
                res.json(user);
            })
        } else {
            res.status(400).json('Wrong credentials');
        }
    }, (e) => {
        res.status(400).json('Error logging in');
    })
    // if(req.body.email === database.users[0].email &&
    //     req.body.password === database.users[0].password) {
    //        res.json(database.users[0]); 
    //     } else {
    //         res.status(400).json('Error logging in');
    //     }
    // res.json('Signing in');
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    User.findById(id).then((user) => {
        res.json(user);
    })
    .catch((e) => {
        res.status(404).json("Not found");
    })
    // database.users.forEach(user => {
    //     if(user.id === id) {
    //         found = true;
    //         return res.json(user);
    //     }
    // }) 
    // if(!found) {
    //     res.status(404).json('Not found');
    // }
})

app.post('/register', (req, res) => {
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);
    var login = new Login({
        email: email,
        password: hash
    });

    login.save().then((doc) => {
        console.log('Login', doc);
        var user = new User({
            _id: new ObjectID(doc._id),
            name: name,
            email: email,
            joined: new Date()
        });
    
        user.save().then((doc) => {
            console.log('User', doc);
            res.json(doc);
        })
    }).catch((e) => {
        res.status(400).json(e);
    });
    // bcrypt.hash(password, null, null, function(err, hash) {
    //     // Store hash in your password DB.
    //     console.log(hash);
    // });
})

app.put('/image' ,(req, res) => {
    const {id} = req.body;
    User.findByIdAndUpdate(id, {
        $inc: {
            entries: 1
        }
    }, {
        new: true
    }).then((doc) => {
        res.json(doc.entries);
    }).catch((e) => {
        res.status(400).json(e);
    })
    // let found = false;
    // database.users.forEach(user => {
    //     if(user.id === id) {
    //         found = true;
    //         user.entries++;
    //         return res.json(user.entries);
    //     }
    // })
    // if(!found) {
    //     res.status(404).json('Not found');
    // }
})

app.listen(port, () => {
    console.log(`App running on port ${port}`);
})