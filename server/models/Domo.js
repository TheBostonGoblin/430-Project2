const mongoose = require('mongoose');
const _ = require('underscore');

let DomoModel = {};

const setName = (dishName) => _.escape(dishName).trim();

const DomoSchema = new mongoose.Schema({
  dishName: {
    type: String,
    require: true,
    trim: true,
    set: setName,
  },
  nutri: {
    type: String,
    require: true,
  },
  ingre: {
    type: String,
    require: true,
  },
  image: {
    type: mongoose.Schema.ObjectId,
  },
  likes: {
    type: Number,
    require: true,
    min: 0,
    default: 0,
  },
  likedBy: {
    type: Array,
    require: true,
    default: [],
  },
  owner: {
    type: mongoose.Schema.ObjectId,
    require: true,
    ref: 'Account',
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});

DomoSchema.static.toAPI = (doc) => ({
  dishName: doc.dishName,
  nutri: doc.nutri,
  ingre: doc.ingre,
  image: doc.image,
  likes: doc.likes,
  likedBy: doc.likedBy,
  hasLiked: doc.hasLiked,
});

DomoSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return DomoModel.find(search).select('dishName nutri ingre image likes likedBy hasLiked').lean().exec(callback);
};

DomoModel = mongoose.model('Domo', DomoSchema);

module.exports = DomoModel;
