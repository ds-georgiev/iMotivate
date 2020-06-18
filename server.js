if(process.env.NODE_ENV !== 'production') {

    require('dotenv').config()
}

const express = require('express')
const app = express()
const bcrypt = require('bcrypt')
const flash = require('express-flash')
const session = require('express-session')
const methodOverride = require('method-override')
const general = require('./general')
const fs = require('fs')


let users = general.getUsers();
users = users.then(result =>{users=result})
const passport = require('passport')
const initPassport = require('./passport-config')
const e = require('express')
const { use } = require('passport')



initPassport(passport,
    email => {
        return users.find(user => user.email === email)
    },
    id => {
        return users.find(user => user.id === id)
    }
)

app.set('view-engine', 'ejs')

app.use(express.urlencoded({ extended: false }))
app.use("/public", express.static('public'))
app.use(flash()) 
app.use(session(
    {

        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    } 
))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))


/******************************************/ 
/******************************************/ 
/* Setup the routs for the different pages*/ 
/******************************************/ 
/******************************************/ 
app.get('/', (req, res) => {

    res.render('./pages/index.ejs', { loggedIn: req.isAuthenticated() })
})

app.get('/about', (req, res) => {

    res.render('./pages/about.ejs', { loggedIn: req.isAuthenticated() }) 
})

app.get('/contact', (req, res) => {

    res.render('./pages/contact.ejs', { loggedIn: req.isAuthenticated() }) 
})
app.get('/dashboard', checkAuthenticated, (req, res) => {
    // res.render('user', { anchor: 'signup' }, function (err, html) { ... });
    res.render('./pages/dashboard.ejs', { loggedIn: req.isAuthenticated(), user: req.user }) 
})
app.get('/stories', (req, res) => {

    res.render('./pages/stories.ejs', { loggedIn: req.isAuthenticated() })
})

app.get('/login', checkNotAuthenticated, (req, res) => {

    res.render('./auth/login.ejs', { loggedIn: req.isAuthenticated() }) 
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {

    successRedirect: '/dashboard',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/register', checkNotAuthenticated, (req, res) => {

    res.render('./auth/register.ejs', { loggedIn: req.isAuthenticated()}) 
})
app.post('/register', checkNotAuthenticated, async (req, res) => {

    try {
     
        users.push({
            
            id: Date.now().toString(), 
            first_name: req.body.user_first_name,
            last_name: req.body.user_last_name,
            email: req.body.user_email,
            password: req.body.user_password,
            availability: req.body.availability
        })
        const jsonString = JSON.stringify(users)
        fs.writeFile('./public/users.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
        res.redirect('/login')
    } catch (error) {

        res.redirect('/register')
    }

})
app.post('/edit-user', checkAuthenticated, async (req, res) => {

    try {
        let file = JSON.parse(fs.readFileSync('./public/users.json').toString());
        let users = []
        file.map(user =>{
            if(req.body.user_id == user.id){
                if(req.body.user_password !== ""){
                    user.first_name= req.body.user_first_name;
                    user.last_name= req.body.user_last_name;
                    user.password= req.body.user_password;
                    user.email= req.body.user_email;
                }else{
                    user.first_name= req.body.user_first_name;
                    user.last_name= req.body.user_last_name;
                    user.email= req.body.user_email;
                }
            }
            users.push(user);
        });
        const jsonString = JSON.stringify(users)
        fs.writeFile('./public/users.json', jsonString, err => {
            if (err) {
                console.log('Error writing file', err)
            } else {
                console.log('Successfully wrote file')
            }
        })
        req.session.destroy();
        res.redirect('/login');
    } catch (error) {
        res.redirect('/dashboard');
    }

})
app.post('/logout', (req, res) => {
    req.logOut()
    res.redirect('/login')
})

function checkAuthenticated(req, res, next) {

    if(req.isAuthenticated()){

        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next) {

    if(req.isAuthenticated()){

        return res.redirect('/dashboard')
    }

    next()
}

app.listen(3000) 