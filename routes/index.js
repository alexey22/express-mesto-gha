const router = require('express').Router();

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const notFoundRoute = require('./notFound');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', notFoundRoute);

module.exports = router;
