const mongoose = require('mongoose');
const _ = require('underscore');

let PostModel = {};

const setName = (dishName) => _.escape(dishName).trim();

// below is all the data nessary to create a post
const PostSchema = new mongoose.Schema({
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
  whoCreated: {
    type: String,
    require: true,
    default: 'no owner',
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

PostSchema.static.toAPI = (doc) => ({
  dishName: doc.dishName,
  nutri: doc.nutri,
  ingre: doc.ingre,
  image: doc.image,
  likes: doc.likes,
  likedBy: doc.likedBy,
  hasLiked: doc.hasLiked,
  whoCreated: doc.whoCreated,
});

PostSchema.statics.findByOwner = (ownerId, callback) => {
  const search = {
    owner: mongoose.Types.ObjectId(ownerId),
  };

  return PostModel.find(search).select('whoCreated dishName nutri ingre image likes likedBy hasLiked').lean().exec(callback);
};

PostModel = mongoose.model('Post', PostSchema);

module.exports = PostModel;
