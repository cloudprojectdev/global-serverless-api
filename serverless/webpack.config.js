const path = require('path');
const slsw = require('serverless-webpack');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const TerserPlugin = require('terser-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const weblog = require('webpack-log');
const log = weblog({ name: 'watcher' })

module.exports = {
	mode: "production",
	devtool: "false",
	entry: slsw.lib.entries,
	resolve: {
		extensions: [
			'.js',
			'.json',
			'.ts',
			'.tsx'
		],
		"modules": [path.resolve(__dirname, "src"), "node_modules"]
	},
	output: {
		devtoolModuleFilenameTemplate: '[absolute-resource-path]',
    	devtoolFallbackModuleFilenameTemplate: '[absolute-resource-path]?[hash]',
		libraryTarget: 'commonjs',
		path: path.join(__dirname, '.webpack'),
		filename: '[name].js'
	},
	target: 'node',
	module: {
		rules: [
			{
				test: /\.ts(x?)$/,
				use: [
					{ loader: 'cache-loader' },
					{
						loader: 'thread-loader',
						options: {
							workers: require('os').cpus().length - 1,
						},
					},
					{
						loader: 'ts-loader',
						options: {
							happyPackMode: true,
							transpileOnly: true
						}
					}
				],
				exclude: /(node_modules|bower_components)/
			}
		]
	},
	plugins: [
		new ForkTsCheckerWebpackPlugin(),
		new FilterWarningsPlugin({
			exclude: [/mongodb/, /mssql/, /mysql2/, /oracledb/, /pg/, /pg-native/, /pg-query-stream/, /redis/, /sqlite3/, /Critical\ dependency/, /react-native-sqlite-storage/]
		})
	],
	optimization: {
		minimizer: [
			new TerserPlugin({
				parallel: true,
				terserOptions: {
				  ecma: 6,
				},
			  })
		]
	}
};

