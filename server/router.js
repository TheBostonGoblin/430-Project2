const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
  app.get('/getMyPost', mid.requiresLogin, controllers.Domo.getMyPost);
  app.get('/getAllPosts', mid.requiresLogin, controllers.Domo.getAllPost);
  app.get('/retrieve', controllers.fileControl.retrieveFile)

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Domo.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Domo.makePost);

  app.get('/profile', mid.requiresLogin, controllers.Domo.profilePage);

  app.post('/upload', mid.requiresLogin, controllers.fileControl.uploadFile);

  app.post('/like', mid.requiresLogin, controllers.Domo.likePost);
  app.post('/unlike', mid.requiresLogin, controllers.Domo.unlikePost);

  app.post('/delete', mid.requiresLogin, controllers.Domo.removePost);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
