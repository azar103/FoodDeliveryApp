const Item = require('../models/item');

const asyncHanlder = require('express-async-handler');


//@desc Get Items
//@route POST /api/items
//@access Private

exports.getItems = asyncHanlder(async (req, res) => {
        const items = await Item.find();
        res.status(200).send(items);
})

//@desc add new item
//@route POST /api/items/new
//@access Private
exports.addItem = asyncHanlder(async (req, res) => {
        const {name, description , price} = req.body;
        const {path} = req.file;
        console.log({...req.body})
        if(!name || !description || !price) {
            res.status(500);
            throw new Error('empty field(s)')
        }
        let item = await Item.findOne({name});
        if(item) {
            res.status(201);
            throw new Error('the item already exist');
        }
 
        item = new Item({name, description, price, coverImg: path});
        await item.save();
        res.status(200).send('item added with success!');
})

//@desc update item
//@route PUT /api/items/:_id
//@access Private
exports.updateItem = asyncHanlder(async (req, res) => {
        const {_id} = req.params;
        const item = await Item.findById(_id);
        const {path} = req.file;
        if(!item) {
            res.status(404);
            throw new Error('the item does not exist');
        }
        await Item.updateOne({_id}, {$set: {...req.body, coverImg: path}});
        res.status(200).send('item updated with success!');
});

//@desc Delete Item
//@route POST /api/items/:_id
//@access Private
exports.deleteItem = asyncHanlder(async (req, res) => {
    
        const {_id} = req.params;
        const item = await Item.findById(_id);
        if(!item) {
            res.status(404);
            throw new Error('the item does not exist');
        }
        await Item.deleteOne({_id});
        res.status(200).send('item deleted with success!')

});