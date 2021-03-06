var webpack = require( 'webpack' ),
    merge = require( 'lodash/merge' ),
    ExtractTextPlugin = require( 'extract-text-webpack-plugin' ),
    hotModuleReplacement = new webpack.HotModuleReplacementPlugin(),
    constants = {
            process:{
                env: {
                    NODE_ENV: JSON.stringify( 'development' )
                }
            }
        },
    extractSass = new ExtractTextPlugin({
            allChunks: true,
            disable: constants.process.env.NODE_ENV !== 'development',
            filename: 'main.css'
        }),
    getStylesheets = function( ...names ){
            const options = {
                    data: '$env: ' + constants.process.env.NODE_ENV + ';',
                    includePaths: [ 'main', 'node_modules' ],
                    sourceMap: true
                  },
                  specifics = {
                    css: {
                        modules: true,
                        importLoaders: 1,
                        localIdentName: '[name]__[local]___[hash:base64:5]',
                    },
                    postcss: {
                        postcss: () => [ 
                            require( 'postcss-import' )({ 
                                    addDependencyTo: webpack 
                                }),
                            require( 'postcss-url' )(),
                            require( 'postcss-cssnext' )(),
                                  // add your <plugins> here
                                  // ...
                                  // and if you want to compress,
                                  // just use css-loader option that already use cssnano under the hood
                            require( 'postcss-browser-reporter' )(),
                            require( 'postcss-reporter' )()
                        ]
                    },
                  };
            return names.map( 
                    constants.process.env.NODE_ENV ?
                    n => ({ loader: n + '-loader' }) : 
                    n => ({ loader: n + '-loader', options: merge( {}, options, ( specifics[ n ] | {} ))}));
        },
    getJSX = ( ...names ) => 
        names.map( n => ({
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: n + '-loader',
            query: {
                plugins: [ 'transform-decorators-legacy', 'transform-runtime' ],
                presets: [ 'latest', 'react', 'airbnb' ]
            }
        }));

module.exports = {
    entry: [
        'babel-polyfill',
        'webpack-dev-server/client?http://localhost:8080',
        'webpack/hot/only-dev-server',
        './src/main.js'
    ],
    devtool: 'source-map',
    module: {
        rules:[ 
            ...getJSX( 'react-hot', 'babel' ),
            {
                test: /\.css$/,
                use: extractSass.extract({ 
                    use: getStylesheets( 'style', 'css', 'postcss' ),
                    fallback: 'style-loader'
                })
            }
        ],
    },
    resolve: {
        extensions: ['.jsx', '.js', '.json', 'css']
    },
    output: {
        path: __dirname,
        publicPath: '/',
        filename: 'main.js'
    },
    devServer: {
        historyApiFallback: {
            index: 'main.html'
        },
        contentBase: './public_html',
        hot: true
    },
    plugins: [ hotModuleReplacement, extractSass, new webpack.DefinePlugin( constants )]
};