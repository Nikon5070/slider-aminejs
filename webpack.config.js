//basic vars
const path = require('path')
const webpack = require('webpack')

//additional plugins
const CleanWebpackPlugin = require('clean-webpack-plugin')
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ImageminPlugin = require('imagemin-webpack-plugin').default
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')


let conf = {
    //базовый путь к проекту
    context: path.resolve(__dirname, 'src'),
    //точки входа JS
    entry: {
        app: [
            './js/app.js',
            './scss/style.scss'
        ],
    },

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].js',
    },

    module: {
        rules: [{
                test: /\.js$/,
                loader: 'babel-loader'
            },
            {
                test: /\.(sass|scss)$/,
                include: path.resolve(__dirname, 'src/scss'),
                use: ExtractTextPlugin.extract({
                    use: [{
                            loader: "css-loader",
                            options: {
                                sourceMap: true,
                            }
                        },
                        {
                            loader: "postcss-loader",
                            options: {
                                sourceMap: true
                            }
                        },
                        {
                            loader: "sass-loader",
                            options: {
                                sourceMap: true
                            }
                        },

                    ],
                    fallback: 'style-loader'
                })
            },
            {
                test: /\.(png|gif|jpe?g)$/,
                loaders: [{
                        loader: 'file-loader',
                        options: {
                            name: '[path][name].[ext]',
                        },
                    },
                    'img-loader',
                ]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].ext',
                    }
                }]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            inject: false,
            hash: true,
            template: './index.html',
            filename: 'index.html'
        }),
        new ExtractTextPlugin(
            './css/[name].css'
        ),
        new CleanWebpackPlugin(['dist']),
        new CopyWebpackPlugin(
            [{
                from: './img',
                to: 'img'
            }], {
                ignore: [{
                    glob: 'svg/*'
                }, ]
            }

        )
    ],

}

module.exports = (env, options) => {
    let production = options.mode === 'production';


    //PRODUCTION ONLY
    if (production) {
        conf.devtool = 'eval-source-map';

        conf.plugins.push(
            new UglifyJSPlugin({
                sourceMap: true
            })
        );

        conf.plugins.push(
            new ImageminPlugin({
                test: /\.(jpe?g|png|gif|svg)$/i
            })
        );

        conf.plugins.push(
            new webpack.LoaderOptionsPlugin({
                minimize: true
            })
        );
    }

    return conf;
};