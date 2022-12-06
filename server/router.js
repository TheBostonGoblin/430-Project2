const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  /*
    URL: /getToken
    Supported Methods: GET
    Middleware: Requires Secure
    Query Params: CSRF token
    Description: Gets the CSRF token to verify the current session is unique
    Return Type(s): JSON
  */
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);

  /*
    URL: /getMyPost
    Supported Methods: GET
    Middleware: Requires Login
    Query Params: None needed
    Description: Gets the post of the current user
    Return Type(s): JSON
  */
  app.get('/getMyPost', mid.requiresLogin, controllers.Post.getMyPost);

  /*
    URL: /getAllPost
    Supported Methods: GET
    Middleware: Requires Login
    Query Params: None needed
    Description: Gets all posts from the server
    Return Type(s): JSON
  */
  app.get('/getAllPosts', mid.requiresLogin, controllers.Post.getAllPost);

  /*
    URL: /getAccount
    Supported Methods: GET
    Middleware: Requires Login
    Query Params: None needed
    Description: Gets all posts from the server
    Return Type(s): JSON
  */
  app.get('/getAccount', mid.requiresLogin, controllers.Account.getAccount);

  /*
    URL: /getAccount
    Supported Methods: POST
    Middleware: Requires Login
    Query Params: pass, pass2
    Description: Gets all posts from the server
    Return Type(s): JSON
  */
  app.post('/updatePass', mid.requiresLogin, controllers.Account.updatePass);

  /*
      URL: /retrieve
      Supported Methods: GET
      Middleware: Requires Login
      Query Params: imageID
      Description: retieves images form the server specifically
      for post using the imageID to find them.
      Return Type(s): JSON
    */
  app.get('/retrieve', mid.requiresLogin, controllers.fileControl.retrieveFile);

  /*
    URL: /login
    Supported Methods: GET
    Middleware: Requires Logout & requires secure
    Query Params: CSRF token
    Description: takes the user to the login page
    Return Type(s): JSON
  */
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  /*
    URL: /login
    Supported Methods: POST
    Middleware: Requires Logout & requires secure
    Query Params: CSRF token, username,password
    Description: lets the user login to their account if credientials
     are correct and takes the user to the maker page
    Return Type(s): JSON
  */
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  /*
    URL: /signup
    Supported Methods: GET
    Middleware: Requires Logout & requires secure
    Query Params: CSRF token
    Description: takes the user to the signup page
    Return Type(s): JSON
  */
  app.get('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signupPage);

  /*
   URL: /signup
   Supported Methods: POST
   Middleware: Requires Logout & requires secure
   Query Params: CSRF token, username,password,password2
   Description: creates an account and session and take the user to the maker page
   Return Type(s): JSON
 */
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  /*
      URL: /logout
      Supported Methods: GET
      Middleware: Requires Login
      Query Params: None
      Description: destroys the current session and takes the user to the login page
      Return Type(s): JSON
    */
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  /*
      URL: /maker
      Supported Methods: GET
      Middleware: Requires Login
      Query Params: None
      Description: creates the makerpage
      Return Type(s): JSON
    */
  app.get('/maker', mid.requiresLogin, controllers.Post.makerPage);

  /*
    URL: /editPost
    Supported Methods: POST
    Middleware: Requires Login
    Query Params: files,name,plus,ingre,image,csrfToken,postID
    Description: to find the current post being edited and
     update it with the user specified numbers, this will remove out all likes however
    Return Type(s): JSON
  */
  app.post('/editPost', mid.requiresLogin, controllers.fileControl.editMyPost);

  /*
    URL: /aMember
    Supported Methods: POST
    Middleware: Requires Login
    Query Params: None
    Description: will set the membership of the current account to true
    Return Type(s): JSON
  */
  app.post('/aMember', mid.requiresLogin, controllers.Account.activateMemebership);

  /*
    URL: /aMember
    Supported Methods: POST
    Middleware: Requires Login
    Query Params: None
    Description: will set the membership of the current account to false
    Return Type(s): JSON
  */
  app.post('/deMember', mid.requiresLogin, controllers.Account.deActivateMemebership);

  /*
    URL: /aMember
    Supported Methods: GET
    Middleware: Requires Login
    Query Params: None
    Description: loads the profile page
    Return Type(s): JSON
  */
  app.get('/profile', mid.requiresLogin, controllers.Post.profilePage);

  /*
    URL: /upload
    Supported Methods: POST
    Middleware: Requires Login
    Query Params: files,name,plus,ingre,image,csrfToken
    Description: used to create and store the recipe and associated image
    Return Type(s): JSON
  */
  app.post('/upload', mid.requiresLogin, controllers.fileControl.uploadFile);

  /*
      URL: /like
      Supported Methods: POST
      Middleware: Requires Login
      Query Params: csrfToken,PostID
      Description: used to like a psot
      Return Type(s): JSON
    */
  app.post('/like', mid.requiresLogin, controllers.Post.likePost);

  /*
      URL: /unlike
      Supported Methods: POST
      Middleware: Requires Login
      Query Params: csrfToken,PostID
      Description: used to unlike a post
      Return Type(s): JSON
    */
  app.post('/unlike', mid.requiresLogin, controllers.Post.unlikePost);

  /*
      URL: /delete
      Supported Methods: POST
      Middleware: Requires Login
      Query Params: csrfToken,PostID
      Description: used to delete a post and its associated image
      Return Type(s): JSON
    */
  app.post('/delete', mid.requiresLogin, controllers.Post.removePost);

  /*
      URL: /
      Supported Methods: GET
      Middleware: Requires Login & Requires Secure
      Query Params: None
      Description: logs the user our ends the session and takes the user back to the login page
      Return Type(s): JSON
    */
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);

  /*
      URL: /*
      Supported Methods: Get
      Middleware: None
      Query Params: None
      Description: Handles if the user attempts to go to a place that does not exist.
      Return Type(s): JSON
    */
  app.get('/*',mid.requiresSecure, controllers.Account.notfound);
};

module.exports = router;
