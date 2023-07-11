const router = require('express').Router();
const auth = require('../middlewares/auth');

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const notFoundRoute = require('./notFound');

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', notFoundRoute);

module.exports = router;
