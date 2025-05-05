require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const session = require('express-session');
const User = require('./models/user'); 


const app = express(); // ✅ Initialize app first

// ✅ Set up view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views'); // Optional if 'views' is in root

// ✅ Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'secretKey',
    resave: false,
    saveUninitialized: false
}));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("MongoDB connection error: " + err));


// ✅ Static files
app.use(express.static('public'));

// ✅ GET: Home Page
app.get('/', (req, res) => {
    res.render('home'); // views/home.ejs
});

// ✅ GET: Register Page
app.get('/register', (req, res) => {
    res.render('register'); // views/register.ejs
});

// ✅ GET: Login Page
app.get('/login', (req, res) => {
    res.render('login'); // views/login.ejs
});

// ✅ POST: Register User
app.post("/register", (req, res) => {
    const { email, password } = req.body;

    User.findOne({ email: email }).then((found) => {
        if (found) {
            return res.status(400).send("User already exists");
        }

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) {
                return res.status(500).send("Error hashing password");
            }

            const newUser = new User({
                email: email,
                password: hashedPassword
            });

            newUser.save().then(() => {
                res.redirect("/login");
            }).catch(err => {
                res.status(500).send("Error while saving the user");
            });
        });
    }).catch(err => {
        res.status(500).send("Internal server error");
    });
});

// ✅ POST: Login
app.post('/login', (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }).then(userFound => {
        if (!userFound) {
            return res.status(400).send("User not found");
        }

        bcrypt.compare(password, userFound.password, (err, result) => {
            if (err) return res.status(500).send("Error comparing passwords");

            if (result) {
                req.session.userId = userFound._id;
                res.render("secret"); // views/secret.ejs
            } else {
                res.status(400).send("Incorrect password");
            }
        });
    }).catch(err => {
        res.status(500).send("Internal server error");
    });
});

// ✅ GET: Secret Page (Protected)
app.get('/secret', (req, res) => {
    if (!req.session.userId) {
        return res.redirect('/login');
    }

    res.render('secret');
});

// ✅ GET: Logout
app.get('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

// ✅ Start Server
app.listen(3000, () => {
    console.log("Server started on http://localhost:3000");
});
