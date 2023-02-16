const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;
const User = require('../models/user');


const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.SECRET_KEY
}

const strategy = new JWTStrategy(options, async function (jwt_payload, done) {
    try {
        const user = await User.findById(jwt_payload._id).select("-password");
        if (user) {
            return done(null, user);
        } else {
            return done(null, error);
        }    
    } catch (error) {
    }
      })


module.exports = (passport) => {
    passport.use(strategy);
}