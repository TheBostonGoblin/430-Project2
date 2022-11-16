const models = require('../models');
const DomoModel = require('../models/Domo');

const { Domo } = models;

const makerPage = (req, res) => res.render('app');

const getDomos = (req, res) => DomoModel.findByOwner(req.session.account._id, (err, docs) => {
  if (err) {
    console.log(err);
    return res.stauts(400).json({ error: 'An error occured!' });
  }

  const test = docs;

  console.log(test);
  return res.json({ domos: docs });
});

const makeDomo = async (req, res) => {
  if (!req.body.name || !req.body.age || !req.body.level) {
    return res.status(400).json({ error: 'Name, level, and age are required!' });
  }

  const domoData = {
    name: req.body.name,
    age: req.body.age,
    level: req.body.level,
    owner: req.session.account._id,
  };

  try {
    const newDomo = new Domo(domoData);
    await newDomo.save();
    return res.status(201).json({ name: newDomo.name, age: newDomo.age, level: newDomo.level });
  } catch (err) {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Domo already exists!' });
    }
    return res.status(400).json({ error: 'An error occured' });
  }
};

const levelUpDomo = async (req, res) => {
  try {
    await DomoModel.findByIdAndUpdate(req.body.domoID, { $inc: { level: 1 } }).exec();
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update Domo' });
  }

  return res.status(200).json({});// technically this is a 204 status
};

const removeDomo = async (req, res) => {
  try {
    await DomoModel.findByIdAndRemove(req.body.domoID).exec();
  } catch (err) {
    return res.status(500).json({ message: 'Failed to remove Domo' });
  }

  return res.status(200).json({});// technically this is a 204 status
};

module.exports = {
  makerPage,
  makeDomo,
  getDomos,
  levelUpDomo,
  removeDomo,
};
