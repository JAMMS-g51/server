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
