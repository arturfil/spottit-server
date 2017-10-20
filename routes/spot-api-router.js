const express   = require('express');
const m = require('../config/multer-config');
const SpotModel = require('../models/spot-model');

const router = express.Router();

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
router.post('/spots', m.uploader.single('itemImage') (req, res, next) => {
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
    theSpot.image = m.getUrl(req);
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
});

//PUT/api/items/ID
router.put('/spots/:spotsId', (req, res, next) => {
  SpotsModel.findById(
    req.params.spotsId,
    (err, spotsFromDb) => {
      if(err) {
        console.log('Spot details ERROR', err);
        res.status(500).json({errorMessage: "Item details went wrong"});
        return;
      }
      spotsFromDb.set({
        name: req.body.itemName,
        brand: req.body.itemBrand,
        image: req.body.itemImage,
        value: req.body.value
      });

      spotsFromDb.save((err) => {
        if (spotsFromDb.errors) {
          res.status(400).json({
            errorMessage: "Update validation failed",
            validationErrors: spotsFromDb.errors
          })
          return;
        }
        if (err) {
          console.log("Item update ERROR", err);
          res.status(500).json({ errorMessage: 'Item update went wrong'});
          return;
        }
        res.status(200).json(spotsFromDb);
      })
    }
  )
})

//DELETE/api/spots/ID
router.delete('/spots/:spotsId', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({errorMessage: 'Not logged in'});
    return;
  }
  SpotsModel.findById(
    req.params.itemId,
    (err, spotsFromDb) => {
      if (err) {
        console.log('Item owner confirm ERROR', err);
        res.status(500).json(
          {errorMessage: "Spot owner confirm went wrong 🥑"}
        );
        return;
      }
      if (spotsFromDb.user.toString() !== req.user._id.toString()) {
        res.status(403).json({ errorMessage: 'This spot is not yours. 😎'});
        return;
      }
      SpotsModel.findByIdAndRemove(
        req.params.itemId,
        (err, spotsFromDb) => {
          if (err) {
            console.log("Spots delete error", err);
            res.status(500).json({ errorMessage: "Spot delete went wrong"});
          }
          res.status(200).json(spotsFromDb);
        }
      );
    }
  );
});

//My spots Route
router.get('/myspots', (req, res, next) => {
  if (!req.user) {
    res.status(401).json({errorMessage: "Not logged in 💀"});
    return;
  }
  SpotsModel.find({user: req.user._id})
  .sort({_id: -1})
  .exec((err, myItemResults) => {
    if (err) {
      res.status(500).json(
        {errorMessage: 'My spots went wrong'}
      );
      return;
    }
    res.status(200).json(myItemResults);
  });
});

module.exports = router;
