module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		{
			name: 'space-ghost-train-5',
			script: 'server.js',
			env: {
				SGT_PORT: 3000
			},
			env_production: {
				SGT_PORT: 80,
				NODE_ENV: 'production'
			}
		}
	],

	/**
	 * Deployment section
	 * http://pm2.keymetrics.io/docs/usage/deployment/
	 */
	deploy: {
		production: {
			user: 'node',
			host: 'spaceghosttrain',
			ref: 'origin/master',
			repo: 'https://github.com/seannyD/SpaceGhostTrain5.git',
			path: '/home/node/sgt5',
			'post-deploy': 'npm install && pm2 reload ecosystem.config.js --env production'
		}
	}
};
