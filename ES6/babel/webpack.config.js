module.exports = {
	mode: 'development',

	entry: './index.js',

	module: {
		rules: [
			{
				test: /\.js$/,
				exclude: /node_modules/,
				use: 'babel-loader'
			}
		]
	}
}