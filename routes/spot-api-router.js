const express   = require('express');
const multer    = require('multer');
const SpotModel = require('../models/spot-modle');

const router = express.Router();

const myUploader =
multer(
  {
    dest: __dirname + '/../public/uploads'
  }
);

// GET/api/items
router.get('/spots', (req, res, next) => {
  SpotModel.find()
    .limit(20)
    .sort({_id: -1})
    .exec((err, recentSpots) => {
      if (err) {
        console.log('Error finding the items', err);
        res.status(500).json({errorMessage: 'Finding items went wrong 💩'});
        return;
      }
      res.status(200).json(recentSpots)
    });
});

// POST/api/spots
router.post('/spots', myUploader.single('itemImage') (req, res, next) => {
  if(!req.user) {
    res.status(401).json({ errorMessage: 'Not logged in'});
    return;
  }

  const theSpot = new SpotModel({
    name: req.body.itemName,
    brand: req.body.itemBrand,
    value: req.body.itemValue,
    user: req.user._id
  })
  if(req.file) {
    theSpot.image = '/uploads/' + req.file.filename;
  }
  theSpot.save((err) => {
    if (theItem.errors) {
      res.status(400).json({
        errorMessage: 'Validation failed 😂',
        validationErrors: theSpot.errors
      });
      return;
    }
    if(err) {
      console.log('Error Posting item', err);
      res.status(500).json({errorMessage: 'New phone went wrong 💩'});
      return;
    }
    res.status(200).json(theSpot);
  })
});

// GET/api/spots/ID
router.get('/spots/:spotsId', (req, res, next) => {
  SpotsModel.findById(
    req.params.itemId,
    (err, spotsFromDb) => {
      if (err) {
        console.log("Spot details error");
        res.status(500).json({errorMessage: 'Item details went wrong ☠️'});
        return;
      }
      res.status(200).json(spotsFromDb);
    }
  )
})
