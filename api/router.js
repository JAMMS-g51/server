const queries = require('../db/queries');
const express = require('express');
const bcrypt = require('bcrypt');
const valid = require('./validate');

const router = express.Router();

router.get('/users', (req,res,next) => {
	queries.getAll().then(users => {
		res.json(users);
	});
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
			}
		});
	}
});

module.exports = router;
