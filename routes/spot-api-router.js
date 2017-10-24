const express   = require('express');
const m = require('../config/multer-config');
const SpotModel = require('../models/spot-model');

const router = express.Router();

// GET/api/spots
router.get('/spots', (req, res, next) => {
  SpotModel.find()
    .limit(20)
    .sort({_id: -1})
    .exec((err, recentSpots) => {
      if (err) {
        console.log('Error finding the spots', err);
        res.status(500).json({errorMessage: 'Finding spots went wrong 💩'});
        return;
      }
      res.status(200).json(recentSpots)
    });
});

// POST/api/spots
router.post('/spots', m.uploader.single('spotImage'), (req, res, next) => {
  if(!req.user) {
    res.status(401).json({ errorMessage: 'Not logged in'});
    return;
  }

  const theSpot = new SpotModel({
    name: req.body.spotName,
    workout: req.body.spotWorkout,
    address: req.body.spotAddress,
    user: req.user._id
  })
  if(req.file) {
    theSpot.image = m.getUrl(req);
  }
  theSpot.save((err) => {
    if (theSpot.errors) {
      res.status(400).json({
        errorMessage: 'Validation failed 😂',
        validationErrors: theSpot.errors
      });
      return;
    }
    if(err) {
      console.log('Error Posting spot', err);
      res.status(500).json({errorMessage: 'New spot went wrong 💩'});
      return;
    }
    res.status(200).json(theSpot);
  })
});

// GET/api/spots/ID
router.get('/spots/:spotsId', (req, res, next) => {
  SpotModel.findById(
    req.params.spotsId,
    (err, spotsFromDb) => {
      if (err) {
        console.log("Spot details error");
        res.status(500).json({errorMessage: 'Spot details went wrong ☠️'});
        return;
      }
      res.status(200).json(spotsFromDb);
    }
  )
});

//PUT/api/spots/ID
router.put('/spots/:spotsId', (req, res, next) => {
  SpotModel.findById(
    req.params.spotsId,
    (err, spotsFromDb) => {
      if(err) {
        console.log('Spot details ERROR', err);
        res.status(500).json({errorMessage: "Spot details went wrong"});
        return;
      }
      spotsFromDb.set({
        name: req.body.spotName,
        workout: req.body.spotWorkout,
        image: req.body.spotImage,
        address: req.body.spotAddress
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
          console.log("Spot update ERROR", err);
          res.status(500).json({ errorMessage: 'Spot update went wrong'});
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
  SpotModel.findById(
    req.params.spotsId,
    (err, spotsFromDb) => {
      if (err) {
        console.log('Spot\'s owner confirm ERROR', err);
        res.status(500).json(
          {errorMessage: "Spot owner confirm went wrong 🥑"}
        );
        return;
      }
      if (spotsFromDb.user.toString() !== req.user._id.toString()) {
        res.status(403).json({ errorMessage: 'This spot is not yours. 😎'});
        return;
      }
      SpotModel.findByIdAndRemove(
        req.params.spotsId,
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
  SpotModel.find({user: req.user._id})
  .sort({_id: -1})
  .exec((err, mySpotsResults) => {
    if (err) {
      res.status(500).json(
        {errorMessage: 'My spots went wrong'}
      );
      return;
    }
    res.status(200).json(mySpotsResults);
  });
});

module.exports = router;
