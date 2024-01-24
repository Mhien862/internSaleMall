var express = require('express');
var router = express.Router();
import authRoute from './Auth';
import userRoute from './Users'
import coursesRoute from './Courses'

/* GET home page. */
const indexRoute = (app) => {
  router.get('/', function (req, res, next) {
    res.render('index', { title: 'Express' });
  });
  authRoute(app)
  userRoute(app)
  coursesRoute(app)

 
  return app.use('/', router)
}

module.exports = indexRoute;
