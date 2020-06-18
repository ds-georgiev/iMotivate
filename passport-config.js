const LocalStategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

function init(passport, getUserByEmail, getUserById){

    const authenticateUser = async (email, password, done) => {

        const user = getUserByEmail(email)

        if(user == null){

            return done(null, false, { message: 'No user found with that email!' })
        }

        try {
            
            if(user.password == password) {

                return done(null, user)
            } else {

                return done(null, false, { message: 'Password incorrect!' })
            }
        } catch (error) {
            
            return done(error)
        }
    }

    passport.use(new LocalStategy({ usernameField: 'user_email', passwordField: 'user_password' },authenticateUser))

    passport.serializeUser((user, done) => done(null,user.id))
    passport.deserializeUser((id, done) => {
        
        return done(null, getUserById(id))
    })
}

module.exports = init