const models = require('../models');
const DomoModel = require('../models/Domo');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const profilePage = (req, res) => res.render('profile');

const getMyPost = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.stauts(400).json({ error: 'An error occured!' });
  }
  console.log(req.session.account);
  const test = docs;

  console.log(test);
  return res.json({ domos: docs });
});
const getAllPost = (req, res) => DomoModel.find({}, (err, docs) => {
  if (err) {
    console.log(err);
    return res.stauts(400).json({ error: 'An error occured!' });
  }

  const posts = docs;
  for (let x = 0; x < posts.length; x++) {
    posts[x].hasLiked = posts[x].likedBy.includes(req.session.account.username);
  }

  return res.json({ domos: posts });
}).lean();

const makePost = async (req, res) => {
  if (!req.body.dishName
    || !req.body.nutri
    || !req.body.ingre
    || !req.body.image
    || !req.body.likes) {
    return res.status(400).json({ error: 'Name, level, and age are required!' });
  }

  const domoData = {
    dishName: req.body.dishName,
    nutri: req.body.nutri,
    ingre: req.body.ingre,
    image: req.body.image,
    owner: req.session.account._id,
  };

  // try {
  //   const newFile = new File(sampleFile);
  //   const doc = await newFile.save();
  //   return res.status(201).json({
  //     message: 'The Image/Recipe was sucessfully uploaded',
  //     fileId: doc._id
  //   });
  // } catch (err) {
  //   console.log(err);
  //   return res.status(400).json({
  //     error: 'Error occured while uploaded file',
  //   });
  // }

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({
      dishName: newDomo.dishName,
      nutri: newDomo.nutri,
      ingre: newDomo.ingre,
      image: newDomo.image,
      likes: newDomo.likes,
      likedBy: newDomo.likedBy,
      hasLiked: newDomo.hasLiked,
    });
  } catch (err) {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const unlikePost = async (req, res) => {
  try {
    await DomoModel.findByIdAndUpdate(req.body.domoID, { $pull: { likedBy: `${req.session.account.username}` } }).exec();
    let likedByArray;

    const recipes = await DomoModel.find({});
    let testText;

    recipes.forEach((recipe) => {
      if (recipe._doc._id.toString() === req.body.domoID) {
        likedByArray = recipe._doc.likedBy;
        testText = 'id found';
      }
    });

    console.log(testText);
    await DomoModel.findByIdAndUpdate(
      req.body.domoID,
      { $set: { likes: likedByArray.length } },
    ).exec();

    await DomoModel.findByIdAndUpdate(
      req.body.domoID,

      { $set: { hasLiked: likedByArray.includes(req.session.account.username) } },

    ).exec();
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update Domo' });
  }

  return res.status(200).json({});// technically this is a 204 status
};
const likePost = async (req, res) => {
  try {
    await DomoModel.findByIdAndUpdate(req.body.domoID, { $push: { likedBy: `${req.session.account.username}` } }).exec();
    let likedByArray;

    const recipes = await DomoModel.find({});

    let testText;

    recipes.forEach((recipe) => {
      if (recipe._doc._id.toString() === req.body.domoID) {
        likedByArray = recipe._doc.likedBy;
        testText = 'id found';
      }
    });

    console.log(testText);
    await DomoModel.findByIdAndUpdate(
      req.body.domoID,
      { $set: { likes: likedByArray.length } },
    ).exec();
    await DomoModel.findByIdAndUpdate(
      req.body.domoID,
      { $set: { hasLiked: likedByArray.includes(req.session.account.username) } },
    ).exec();
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update Domo' });
  }

  return res.status(200).json({});// technically this is a 204 status
};

const removePost = async (req, res) => {
  try {
    await DomoModel.findByIdAndRemove(req.body.domoID).exec();
  } catch (err) {
    return res.status(500).json({ message: 'Failed to remove Domo' });
  }

  return res.status(200).json({});// technically this is a 204 status
};

module.exports = {
  makerPage,
  makePost,
  getMyPost,
  likePost,
  unlikePost,
  removePost,
  getAllPost,
  profilePage,
};
