const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const Account = require('../models/account');
const Item = require('../models/item');
const mongoose = require('mongoose');

const generateToken  = async (payload) => {
   const token = await jwt.sign(payload,process.env.SECRET_KEY, {expiresIn:'30d'});
   return token;
}
exports.register = asyncHandler(async(req, res) => {
   const {email, password, firstName, lastName, userRole} = req.body;
   const {path} = req.file;
   if(!email || !password || !firstName || !lastName || !userRole) {
      res.status(500);
      throw new Error('empty field(s)');
   }
   //check if the current account of the user exists
   let account = await Account.findOne({email});
   if(account) {
        res.status(201);
        throw new Error('the user already exist')
   } 
   //create the new account
   const hashPassword = await bcrypt.hash(password, 10);
   account = new Account({email, password: hashPassword, userRole});
   await account.save(); 
   //create the new user with the Id of his own account created
   const user = new User({firstName, lastName, profileImg: path, accountId: account});
   //generate the token of the user
   const payload = {
      _id: user.id
   }
   const token = await generateToken(payload);
   await user.save();
   res.status(200).send({message:'the user is registred with success',  user, token});
});

exports.login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    //check if the account exists
    let account = await Account.findOne({email});
    if(!account) {
      res.status(500);
      throw new Error('bad credentials');
    }
    //check if the password are matched
    const match = await bcrypt.compare(password, account.password);
    if(!match) {
      res.status(500);
      throw new Error('bad credentials');
    }
    let user = await User.findOne({accountId: account._id});
    const payload = {
      _id: user.id
   }
   const token = await generateToken(payload);
   res.status(200).send({message:'the user is logged with success',  user, token});
});

exports.addItemToCart = asyncHandler(async (req, res) => {
   const {quantity, itemId} = req.body;

   const objectId = mongoose.Types.ObjectId(itemId); 
   const user = await User.findOne({_id: req.user._id});
   const itemWithProductIdString = objectId; // Votre id de type string
   const id = mongoose.Types.ObjectId(itemWithProductIdString); // Convertit la chaîne en ObjectId

   const foundItem =  user.cart.items.find((item) => item.item.equals(id));
  if(!foundItem) {
     user.cart.items.push({item:itemId, quantity});
     res.status(200).send({message: 'a new item is added to your cart'});
     user.save();
  }else {
     res.status(500);
     throw new Error('the item exists');
  }
});

exports.removeItemsFromCart = asyncHandler(async (req, res) => {
   const user = await User.findById(req.user._id);
   const {_id} = req.params;
   const index = user.cart.items.indexOf(_id);
   user.cart.items.splice(index, 1);
   await user.save();
   res.status(200).send({message: 'the item is deleted from your cart'})
});

exports.updateCartItems = asyncHandler(async (req, res) => {
   const user  = await User.findById(req.user._id);
   const {quantity} = req.body;

   const {_id} = req.params;
   const index = user.cart.items.indexOf(_id);
   const itemWithProductIdString = req.params._id; // Votre id de type string
   const id = mongoose.Types.ObjectId(itemWithProductIdString); 
   const itemFound = user.cart.items.find(item => item.item.equals(id));
   if(!itemFound) {
      res.status(400)
      throw new Error('item not found')
   }
   const updatedItem = {_id: itemFound._id, item: itemFound.item, quantity}
   user.cart.items.splice(index, 1, updatedItem);
   
   await user.save();
   res.status(200).send({message:'item updated with success'});
});

exports.getCartItems = asyncHandler(async (req, res) => {
const user = await User.findById(req.user._id);
res.status(200).send(user.cart.items);
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if(!user) {
      res.status(500);
      throw new Error('the user does not exist');
  }
  res.status(200).send(user);
});
