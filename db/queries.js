const knex = require('./knex');

module.exports = {
	getAll() {
		return knex('users');
	},
	createUser(user) {
		return knex('users').insert(user, '*');
	},
	getUserByEmail(email) {
		return knex('users').where('email', email).first();
	},
	getProjectsByUserId(id){
		return knex('user_project').where('users_id', id);
	}
}
