const express = require('express');
const viewsController = require('../controllers/viewsController');
const authContoller = require('../controllers/authController');

const router = express.Router();

router.use(authContoller.isLoggedIn);

router.get('/login', viewsController.getLoginFrom);

router.get('/', viewsController.getOverview);

router.get('/tour/:slug', viewsController.getTour);

router.get('/me', authContoller.protect, viewsController.getAccount);

router.post(
  '/submit-user-data',
  authContoller.protect,
  viewsController.updateUserDate,
);

module.exports = router;
