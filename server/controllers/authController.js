const bcrypt = require('bcrypt');
const pool = require('../db');
const {v4: uuidv4} = require('uuid');

exports.getLogin = (req,res,next) => {

    if (req.session.user && req.session.user.username){
        res.json({loggedIn: true, username: req.session.user.username})
    } else {
        res.json({loggedIn: false});
    }
};

exports.postLogin = async (req,res,next) => {   

    const potentialLogin = await pool.query('SELECT username, passhash, userid FROM users u WHERE u.username = $1',
        [req.body.username]);

    if (potentialLogin.rowCount > 0){
        const isSamePass = await bcrypt.compare(req.body.password, potentialLogin.rows[0].passhash);

        if (isSamePass){
            //login
            req.session.user = {
                username: req.body.username,
                id: potentialLogin.rows[0].id,
                userid: potentialLogin.rows[0].userid
            }
            res.json({loggedIn: true, username: req.body.username, status: "Successfully logged in."});

        } else {
            res.json({loggedIn: false, status: "Wrong username or password."});
        }
    } else {
        res.json({loggedIn: false, status: "Wrong username or password."});
    }
};

exports.postSignup = async (req,res,next) => {

    const existingUser = await pool.query('SELECT username from users WHERE username=$1',
        [req.body.username]);

    if (existingUser.rowCount === 0){
        //register
        const hashedPass = await bcrypt.hash(req.body.password, 10);
        const newUserQuery = await pool.query('INSERT INTO users(username, passhash, userid) values($1, $2, $3) RETURNING id, username, userId',
            [req.body.username, hashedPass, uuidv4()]);
        
        
        req.session.user = {
            username: req.body.username,
            id: newUserQuery.rows[0].id,
            userid: newUserQuery.rows[0].userid
        }
        res.json({loggedIn: true, username: req.body.username, status:"Successfully created an account."});


    } else {
        res.json({loggedIn: false, status: "Username taken"});
    }
};