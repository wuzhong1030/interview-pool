module.exports = {
	mode: 'development',

	entry: {
		app: './src/app.js'
	},

	devServer: {
		// publicPath: './src',
		// open: true,
		hot: true,
		port: 8080,
		overlay: true
	}
}