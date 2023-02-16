const express = require('express');
const router = express.Router();
const itemCtrl = require('../controllers/item');
const passport = require('passport');
require('../config/passport')(passport);
const storage = require('../config/multer');
const multer = require('multer');

const upload = multer({storage}).single('coverImg');
router.get('/',passport.authenticate('jwt', {session:false}), itemCtrl.getItems);

router.post('/new',passport.authenticate('jwt', {session:false}),upload, itemCtrl.addItem);

router.route('/:_id')
      .put(passport.authenticate('jwt', {session:false}),upload, itemCtrl.updateItem)
      .delete(passport.authenticate('jwt', {session:false}), itemCtrl.deleteItem);


module.exports = router;