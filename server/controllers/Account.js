// gaining models to manipulate the database
const models = require('../models');
const AccountModel = require('../models/Account.js');

const { Account } = models;

// rendering the login page nad the signup page
const loginPage = (req, res) => res.render('login', { csrfToken: req.csrfToken() });
const signupPage = (req, res) => res.render('signup', { csrfToken: req.csrfToken() });
const notfound = (req, res) => res.render('notfound',{
  page: req.url
});
// logout function
const logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
};

/* function used to get the current account.
 utalized in areas where i need the account for react components */
const getAccount = (req, res) => AccountModel.find(
  { _id: req.session.account._id },
  (err, docs) => {
    if (err) {
      return res.status(500).json({ error: 'unable to find account' });
    }
    return res.json({ account: docs[0] });
  },
).lean();

/* for logging in the user and taking them to the post
page ensures that the username and password is correct before creating the session
*/
const login = (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;

  if (!username || !pass) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  return Account.authenticate(username, pass, (err, account) => {
    if (err || !account) {
      return res.status(401).json({ error: 'Wrong username or password' });
    }

    req.session.account = Account.toAPI(account);

    return res.json({ redirect: '/maker' });
  });
};

/* funcion used to sign the user up for the webpage
 takes the username and stores it within the server
*/
const signup = async (req, res) => {
  const username = `${req.body.username}`;
  const pass = `${req.body.pass}`;
  const pass2 = `${req.body.pass2}`;

  if (!username || !pass || !pass2) {
    return res.status(400).json({ error: 'All fields are required!' });
  }

  if (pass !== pass2) {
    return res.status(400).json({ error: 'Passwords do not match!' });
  }

  // attempts to generate hash from the password and stores it also checks if the username is in use
  try {
    const hash = await Account.generateHash(pass);
    const newAccount = new Account({ username, password: hash });

    await newAccount.save();

    req.session.account = Account.toAPI(newAccount);

    return res.json({ redirect: '/maker' });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Username already in use' });
    }
    return res.status(400).json({ error: 'An error occoured' });
  }
};

/* The function updates the password used in the profile page
it obtains the current account by ID than generates a new password */
const updatePass = async (req, res) => {
  const pass = await req.body.pass;
  const passConfirm = await req.body.pass2;

  if (!pass || !passConfirm) {
    return res.status(400).json({ error: 'Both Password fields must be filled!' });
  }

  if (pass !== passConfirm) {
    return res.status(400).json({ error: 'To change password both fields must match!' });
  }

  try {
    const hash = await Account.generateHash(pass);
    await AccountModel.findByIdAndUpdate(
      req.session.account._id,
      { password: hash },
    );

    // logout(res,req);
    req.session.destroy();
    return res.json({ redirect: '/login' });
  } catch (err) {
    return res.status(500).json({ message: 'Failed to update Password' });
  }
};

/* The following 2 functions obtains the current
member by its id than changes its membership status.
This is used with the membership to change buttons from activiation to deactivation
*/
const activateMemebership = async (req, res) => {
  try {
    await AccountModel.findByIdAndUpdate(
      req.session.account._id,
      { membership: true },
    );
  } catch (err) {
    return res.status(500).json({ message: 'Failed to change membership status' });
  }

  return res.status(200).json({});
};

const deActivateMemebership = async (req, res) => {
  try {
    await AccountModel.findByIdAndUpdate(
      req.session.account._id,
      { membership: false },
    );
  } catch (err) {
    return res.status(500).json({ message: 'Failed to change membership status' });
  }

  return res.status(200).json({});
};

// used to obtain the csrfToken and ensuring the current session is unique
const getToken = (req, res) => res.json({ csrfToken: req.csrfToken() });

module.exports = {
  loginPage,
  login,
  logout,
  signup,
  getToken,
  signupPage,
  getAccount,
  updatePass,
  activateMemebership,
  deActivateMemebership,
  notfound,
};
