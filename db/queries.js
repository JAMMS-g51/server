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

	getUserById(id){
		return knex('users').where('id', id);
	},

	getProjectsByUserId(id){
		return knex('project').where('users_id', id)
		.join('user_project', 'project_id', '=', 'project.id');
	},
	getGroupingsByProjectId(id){
		return knex('grouping').where('project_id', id );
	},
	getGroupingIdByProjectId(id){
		return knex('grouping').where('project_id', id )
		.select('grouping_id');
	},

	getUserProjectByProjectId(id){
		return knex('user_project').where('project_id', id);
	},
	getUserProjectById(id){
		return knex('user_project').where('id',id);
	},

	createItem(tableName, item){
		return knex(tableName).insert(item, '*');
	},

	getStoriesByGroupingId(id){
		return knex('story').where('grouping_id', id )
		.select('*');
	},

	deleteItem(tableName, id){
		return knex(tableName).where('id', id).del();
	},

	updateItem(tableName, id, item){
		return knex(tableName).where('id', id).update(item, '*');
	},

	getProjectById(id) {
		return knex('project')
			.where('id', id)
			.first()
			.then(project => {
				return knex('grouping')
					.where('project_id', id)
					.then(groupings => {
						project.groupings = groupings;
						return project;
					})
			}).then(project => {
				return Promise.all(
					project.groupings.map(grouping => {
						return knex('story')
							.where('grouping_id', grouping.id)
							.then(stories => {
								grouping.stories = stories;

								return Promise.all(
									stories.map(story => {
										return Promise.all([
											knex('link').where('story_id', story.id),
											knex('list').where('story_id', story.id),
											knex('comment').where('story_id', story.id)
										]).then(results => {
											story.links = results[0];
											story.lists = results[1];
											story.comments = results[2];

											return Promise.all(
												story.lists.map(list => {
													return knex('list_item')
														.where('list_id', list.id)
														.then(items => {
															list.items = items;
														});
												})

											)
										})
									})
								)
							})
					})
				).then(() => {
					return project;
				});
			})
	}

}
