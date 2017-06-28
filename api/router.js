const queries = require('../db/queries');
const express = require('express');
const bcrypt = require('bcrypt');
const valid = require('./validate');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../auth/middleware');

const router = express.Router();

router.get('/users', (req,res,next) => {
	// console.log(req.signedCookies);
	// console.log(req.cookies);
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
	if(valid.user(req.body) && req.body.password >= 6){
		queries.getUserByEmail(req.body.email).then(user => {
			if(user) {
				bcrypt.compare(req.body.password, user.password).then(result => {
					if(result) {
						jwt.sign({id: user.id}, process.env.TOKEN_SECRET, (err, token) => {
							console.log(err, token);
							res.json({
								//message: `Logged in as ${user.name}.`,
								token,
								id: user.id
							});
						});
					} else {
						next(new Error("Invalid Email/Password"))
					}
				});
			} else {
				next(new Error("Invalid Email/Password"))
			}
		});
	} else {
		next(new Error("Invalid Email/Password"))
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
		next(new Error("Invalid Password"));
	}
});

router.get('/users/:id/project', authMiddleware.allowAccess, (req, res) => {
	if (!isNaN(req.params.id)) {
		queries.getProjectsByUserId(req.params.id).then(projects => {
		res.json(projects);
	});
	} else {
		res.Error(res, 500, "Invalid ID");
	}
});


router.get('/project/:id/groupings', (req, res) => {
	queries.getGroupingsByProjectId(req.params.id).then(groupingId => {
		res.json(groupingId)
	})
})
// router.get('/grouping/:id/stories', (req, res) => {
// 	queries.getStoriesByGroupingId(req.params.id).then(storyId => {
// 		res.json(storyId)
// 	});
// });

router.get('/user_project/:id', (req, res) => {
	queries.getUserProjectById(req.params.id).then(user_project => {
		res.json(user_project)
	})
})

router.get('/user/:userId/project/:id', authMiddleware.allowProjectAccess, (req,res,next) => {

	queries.getProjectById(req.params.id).then(project => {
		res.json(project);
	});
});

router.delete('/project/:id', (req, res, next) => {
	queries.deleteItem('project', req.params.id).then(response => {
		res.json(response);
	});
});

router.delete('/grouping/:id', (req, res, next) => {
	queries.deleteItem('grouping', req.params.id).then(response => {
		res.json(response);
	});
});

router.delete('/story/:id', (req, res, next) => {
	queries.deleteItem('story', req.params.id).then(response => {
		res.json(response);
	});
});

router.delete('/list/:id', (req, res, next) => {
	queries.deleteItem('list', req.params.id).then(response => {
		res.json(response);
	});
});

router.delete('/list_item/:id', (req, res, next) => {
	queries.deleteItem('list_item', req.params.id).then(response => {
		res.json(response);
	});
});

router.delete('/link/:id', (req, res, next) => {
	queries.deleteItem('link', req.params.id).then(response => {
		res.json(response);
	});
});

router.delete('/comment/:id', (req, res, next) => {
	queries.deleteItem('comment', req.params.id).then(response => {
		res.json(response);
	});
});

router.post('/project', (req, res, next) => {
	if(valid.project(req.body)){
	queries.createItem('project', req.body).then(response =>{
		res.json(response);
	});
} else {
	next(new Error("Invalid Project Name"));
}
});

router.post('/user_project', (req, res, next) => {
	queries.createItem('user_project', req.body).then(response =>{
		res.json(response);
	});
});

router.post('/grouping', (req, res, next) => {
	queries.createItem('grouping', req.body).then(response =>{
		res.json(response);
	});
});

router.post('/story', (req, res, next) => {
	queries.createItem('story', req.body).then(response =>{
		res.json(response);
	});
});

router.post('/link', (req, res, next) => {
	queries.createItem('link', req.body).then(response =>{
		res.json(response);
	});
});

router.post('/comment', (req, res, next) => {
	queries.createItem('comment', req.body).then(response =>{
		res.json(response);
	});
});

router.post('/list', (req, res, next) => {
	queries.createItem('list', req.body).then(response =>{
		res.json(response);
	});
});

router.post('/list_item', (req, res, next) => {
	queries.createItem('list_item', req.body).then(response =>{
		res.json(response);
	});
});

router.put('/project/:id', (req, res, next) => {
	queries.updateItem('project', req.params.id, req.body).then(response => {
		res.json(response);
	});
});

router.put('/grouping/:id', (req, res, next) => {
	queries.updateItem('grouping', req.params.id, req.body).then(response => {
		res.json(response);
	});
});

router.put('/story/:id', (req, res, next) => {
	queries.updateItem('story', req.params.id, req.body).then(response => {
		res.json(response);
	});
});

router.put('/link/:id', (req, res, next) => {
	queries.updateItem('link', req.params.id, req.body).then(response => {
		res.json(response);
	});
});

router.put('/comment/:id', (req, res, next) => {
	queries.updateItem('comment', req.params.id, req.body).then(response => {
		res.json(response);
	});
});

router.put('/list/:id', (req, res, next) => {
	queries.updateItem('list', req.params.id, req.body).then(response => {
		res.json(response);
	});
});

router.put('/list_item/:id', (req, res, next) => {
	queries.updateItem('list_item', req.params.id, req.body).then(response => {
		res.json(response);
	});
});

module.exports = router;
