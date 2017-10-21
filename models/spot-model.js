const mongoose = require('mongoose');
const Schema   = mongoose.Schema();

const spotSchema = new Schema({
  name: {
    type: String,
    required: [true, 'What is the spot\'s name?']
  },
  workout: {
    type: String, enum: ['Cardio', 'Resistance', 'Cardion & Resistance']
  },
  address: {type: String},
  latitud: {type: Number},
  longitud: {type: Number},
  rating: {type: Number},
  image: {type: String}
})

const SpotSchema = mongoose.model('Spot', spotSchema);

module.exports = SpotSchema;
