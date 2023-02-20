const express = require('express');
const router = express.Router();
const userCtrl = require('../controllers/user');
const passport = require('passport');
const storage = require('../config/multer');
const multer = require('multer');

const upload = multer({storage}).single('profileImg');
router.post('/login', userCtrl.login);

router.post('/register',upload, userCtrl.register);

router.get('/me', passport.authenticate('jwt', {session:false}), userCtrl.getCurrentUser);

router.post('/addtocart',passport.authenticate('jwt', {session:false}),userCtrl.addItemToCart);

router.delete('/deletefromcart/:_id', passport.authenticate('jwt', {session:false}),userCtrl.removeItemsFromCart);
router.put('/cartItem/:_id', passport.authenticate('jwt', {session:false}),userCtrl.updateCartItems);
router.get('/cartItems', passport.authenticate('jwt', {session:false}),userCtrl.getCartItems);

module.exports = router;

