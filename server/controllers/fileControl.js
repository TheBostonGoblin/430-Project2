const { Post } = require('../models/index.js');
const FileModel = require('../models/storeFile.js');
const PostModel = require('../models/Post.js');

// inaddition to uploading the accompanying image file this is used to create each post
const uploadFile = async (req, res) => {
  // testing that an image does exist
  if (!req.files || !req.files.image) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }
  // ensuring that the uploaded file is an image
  if (req.files.image.mimetype !== 'image/png' && req.files.image.mimetype !== 'image/jpeg') {
    return res.status(400).json({ error: 'The Uploaded File Was Not an Image You Must Upload Either a PNG,JPG,or JPEG File' });
  }
  // making sure that all other fields have been filled out
  if (!req.body.dishName || !req.body.plus || !req.body.ingre) {
    return res.status(400).json({ error: 'All fields must be filled to create a post' });
  }

  /*
  attempts to create and save a food image the id of this
   image is than stored within every recipe post
  This is than retrieved everytime the user needs to make
  */
  try {
    const image = new FileModel(req.files.image);

    const doc = await image.save();

    const recipe = {
      image: doc._id,
      dishName: req.body.dishName,
      nutri: req.body.plus,
      ingre: req.body.ingre,
      whoCreated: req.session.account.username,
      owner: req.session.account._id,
    };

    const saveRecipe = new Post(recipe);

    await saveRecipe.save();

    return res.status(201).json({
      message: 'The Image & Recipe were sucessfully uploaded',
    });
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: 'Error occured while creating the post',
    });
  }
};

/* when editing an iamge we need to go through the same
 process as creating a post although their are some changes
*/
const editMyPost = async (req, res) => {
  // checking properties of the request to ensure it will work
  if (!req.files || !req.files.image) {
    return res.status(400).json({ error: 'No files were uploaded' });
  }
  if (req.files.image.mimetype !== 'image/png' && req.files.image.mimetype !== 'image/jpeg') {
    return res.status(400).json({ error: 'The Uploaded File Was Not an Image You Must Upload Either a PNG,JPG,or JPEG File' });
  }
  if (!req.body.name || !req.body.plus || !req.body.ingre) {
    return res.status(400).json({ error: 'All fields must be filled for update to work' });
  }

  // gets the current post than obtains the Id for the current image
  const currentPost = await PostModel.find({ _id: req.body.postID });

  const imageID = currentPost[0]._doc.image.toString();

  // the current image is than removed using the image id
  try {
    await FileModel.findByIdAndDelete(imageID);
  } catch (error) {
    return res.status(500).json({ error: 'Failed to remove current image' });
  }

  // The post is than recreated with the new image and image ID
  try {
    const image = new FileModel(req.files.image);
    const doc = await image.save();
    await PostModel.findByIdAndUpdate(req.body.postID, {
      $set:
      {
        dishName: `${req.body.name}`,
        nutri: `${req.body.plus}`,
        ingre: `${req.body.ingre}`,
        image: doc._id,
        likes: 0,
        likedBy: [],
        hasLiked: false,
      },
    }).exec();
  } catch (error) {
    return res.status(500).json({ error: 'Something has gone wrong while updating post' });
  }

  return res.status(200).json({});
};
/*
retieving files from the server exclusively used when loading
 post from the server to ensure they each have their appropate image
*/
const retrieveFile = async (req, res) => {
  if (!req.query._id) {
    return res.status(400).json({ error: 'Missing file id!' });
  }

  let doc;
  try {
    // First we attempt to find the file by the _id sent by the user.
    doc = await FileModel.findOne({ _id: req.query._id }).exec();
  } catch (err) {
    // If we have an error contacting the database, let the user know something happened.
    console.log(err);
    return res.status(400).json({ error: 'Something went wrong retrieving file!' });
  }

  if (!doc) {
    return res.status(404).json({ error: 'File not found!' });
  }

  res.set({
    'Content-Type': doc.mimetype,
    'Content-Length': doc.size,
    'Content-Disposition': `filename="${doc.name}"`,
  });

  return res.send(doc.data);
};

module.exports = {
  uploadFile,
  retrieveFile,
  editMyPost,
};
