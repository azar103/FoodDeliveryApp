const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/user');


const generateToken  = async (payload) => {
   const token = await jwt.sign(payload,process.env.SECRET_KEY, {expiresIn:'30d'});
   return token;
}
exports.register = asyncHandler(async(req, res) => {
   const {email, password, firstName, lastName} = req.body;
   const {path} = req.file;
   if(!email || !password || !firstName || !lastName) {
      res.status(500);
      throw new Error('empty field(s)');
   }
   let user = await User.findOne({email});
   if(user) {
        res.status(201);
        throw new Error('the user already exist')
   } 
   const hashPassword = await bcrypt.hash(password, 10);
   user = new User({email, password:hashPassword, firstName, lastName, profileImg: path});
   const payload = {
      _id: user.id
   }
   const token = await generateToken(payload);
   await user.save();
   res.status(200).send({message:'the user is registred with success',  user, token});
});

exports.login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    let user = await User.findOne({email});
    if(!user) {
      res.status(500);
      throw new Error('bad credentials');
    }
    const match = await bcrypt.compare(password, user.password);
    if(!match) {
      res.status(500);
      throw new Error('bad credentials');
    }
    const payload = {
      _id: user.id
   }
   const token = await generateToken(payload);
   await user.save();
   res.status(200).send({message:'the user is logged with success',  user, token});
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if(!user) {
      res.status(500);
      throw new Error('the user does not exist');
  }
  res.status(200).send(user);
});
