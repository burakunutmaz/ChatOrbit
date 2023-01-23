const express = require('express');
const Yup = require('yup');
const router = express.Router();

const validateForm = require('../controllers/validateForm').i


router.post("/register", (req,res,next) => {
    validateForm(req, res);
});

router.post("/login", (req,res,next) => {
    validateForm(req, res);
});


module.exports = router;