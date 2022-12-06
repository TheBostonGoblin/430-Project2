const PostModel = require('../models/Post');
const FileModel = require('../models/storeFile.js');

// renders the post page/maker page
const makerPage = (req, res) => res.render('app');

// renders the profile page
const profilePage = (req, res) => res.render('profile');

// ill get all owners that have been created using the currently
//  loggedin account, used in the profile page
const getMyPost = (req, res) => PostModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.stauts(400).json({ error: 'An error occured!' });
  }
  console.log(req.session.account);
  const test = docs;

  console.log(test);
  return res.json({ posts: docs });
});

// simply gets every post ever created, used in the maker page.
const getAllPost = (req, res) => PostModel.find({}, (err, docs) => {
  if (err) {
    console.log(err);
    return res.stauts(400).json({ error: 'An error occured!' });
  }

  const posts = docs;
  for (let x = 0; x < posts.length; x++) {
    posts[x].hasLiked = posts[x].likedBy.includes(req.session.account.username);
  }

  return res.json({ posts });
}).lean();

// function used to unlike a post nessary for the liking and unliking button
const unlikePost = async (req, res) => {
  try {
    // first the current user is pulled by from the array of users who have liked the current post
    await PostModel.findByIdAndUpdate(req.body.postID, { $pull: { likedBy: `${req.session.account.username}` } }).exec();
    let likedByArray;

    const recipes = await PostModel.find({});

    /*
    we thank get the current recipe and
    ensure that other properties such as likes, and hasliked are updated also
    */
    recipes.forEach((recipe) => {
      if (recipe._doc._id.toString() === req.body.postID) {
        likedByArray = recipe._doc.likedBy;
      }
    });

    // hasliked and likes are controlled by the likedby array and so need to be also updated
    await PostModel.findByIdAndUpdate(
      req.body.postID,
      { $set: { likes: likedByArray.length } },
    ).exec();

    await PostModel.findByIdAndUpdate(
      req.body.postID,

      { $set: { hasLiked: likedByArray.includes(req.session.account.username) } },

    ).exec();
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update Post' });
  }

  return res.status(200).json({});// technically this is a 204 status
};

/*
this is similar to the unlike function in everyway except
 the current used to pushed to the likedBy array
*/
const likePost = async (req, res) => {
  try {
    await PostModel.findByIdAndUpdate(req.body.postID, { $push: { likedBy: `${req.session.account.username}` } }).exec();
    let likedByArray;

    const recipes = await PostModel.find({});

    let testText;

    recipes.forEach((recipe) => {
      if (recipe._doc._id.toString() === req.body.postID) {
        likedByArray = recipe._doc.likedBy;
        testText = 'id found';
      }
    });

    console.log(testText);
    await PostModel.findByIdAndUpdate(
      req.body.postID,
      { $set: { likes: likedByArray.length } },
    ).exec();
    await PostModel.findByIdAndUpdate(
      req.body.postID,
      { $set: { hasLiked: likedByArray.includes(req.session.account.username) } },
    ).exec();
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update Post' });
  }

  return res.status(200).json({});// technically this is a 204 status
};

// function used to delete post
const removePost = async (req, res) => {
  const currentPost = await PostModel.find({ _id: req.body.postID });

  const imageID = currentPost[0]._doc.image.toString();

  // to delete post we must first use the iamgeID to delete the assoiated image
  try {
    await FileModel.findByIdAndDelete(imageID);
  } catch (error) {
    return res.status(400).json({ error: 'Failed to remove current post image' });
  }

  // than the image itself is removed from the database
  try {
    await PostModel.findByIdAndRemove(req.body.postID).exec();
  } catch (err) {
    return res.status(500).json({ message: 'Failed to remove Post' });
  }

  return res.status(200).json({});// technically this is a 204 status
};

module.exports = {
  makerPage,
  getMyPost,
  likePost,
  unlikePost,
  removePost,
  getAllPost,
  profilePage,
};
