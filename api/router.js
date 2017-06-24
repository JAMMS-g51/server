const queries = require('../db/queries');
const express = require('express');
const bcrypt = require('bcrypt');
const valid = require('./validate');

const router = express.Router();

router.get('/users', (req,res,next) => {
	console.log(req.signedCookies);
	console.log(req.cookies);
	queries.getAll().then(users => {
		res.json(users);
	});
});

// function validateCookie(req,res,next) {
// 	console.log(req.signedCookies);
// 	req.params.id = req.signedCookies;
// 	next();
// }


// router.get('/users', (req,res,next) => {
// 	console.log(req.signedCookies);
// 	console.log(req.cookies);
// 	console.log('signed');
// });



router.post('/auth/login', (req,res,next) => {
	if(valid.user(req.body)){
		queries.getUserByEmail(req.body.email).then(user => {
			if(user) {
				bcrypt.compare(req.body.password, user.password).then(result => {
					if(result) {
						res.cookie('user_id', user.id, {
							httpOnly: true,
							secure: req.app.get('env') != 'development',
							signed: true
						});
						res.json({
							message: `Logged in as ${user.name}.`,
						});
					}
				});
			}
		});
	}
});

router.post('/users', (req,res,next) => {
	if(valid.user(req.body)) {
		queries.getUserByEmail(req.body.email).then(user => {
			if(!user) {
				bcrypt.hash(req.body.password, 10)
					.then((hash) => {
						let user = {
							name: req.body.name,
							email: req.body.email,
							password: hash
						};
						queries.createUser(user).then(user => {
							res.json({
								message: "Success",
								user
							});
						});
				});
			} else {
				next(new Error("Email in use"));
			}
		});
	} else {
		next(new Error("Invalid User"));
	}
});

module.exports = router;
