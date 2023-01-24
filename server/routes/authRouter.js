const express = require('express');
const router = express.Router();


const {validateForm} = require('../controllers/validateForm');
const {getLogin, postLogin, postSignup} = require('../controllers/authController');
const { rateLimiter } = require('../controllers/rateLimiter');



router.post("/signup", validateForm, rateLimiter(30, 4), postSignup);

router
    .route("/login").get(getLogin)
                    .post(validateForm, rateLimiter(60, 10), postLogin);


module.exports = router;