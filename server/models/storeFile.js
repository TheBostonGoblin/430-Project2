const mongoose = require('mongoose');
// seperate model used in storing images but used in tendem with post model to create recipe post
const FileSchema = new mongoose.Schema({

  name: {
    type: String,
  },
  data: {
    type: Buffer,
  },
  size: {
    type: Number,
  },
  mimetype: {
    type: String,
  },

});

const FileModel = mongoose.model('FileModel', FileSchema);

module.exports = FileModel;
