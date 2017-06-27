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
		return knex('user_project').where('users_id', id)
		.join('project', 'project_id', '=', 'project.id');
	},
	getGroupingsByProjectId(id){
		return knex('grouping').where('project_id', id );
	},
	getGroupingIdByProjectId(id){
		return knex('grouping').where('project_id', id )
		.select('grouping_id');
	},
	getStoriesByGroupingId(id){
		return knex('story').where('grouping_id', id )
		.select('*');
	}

}
