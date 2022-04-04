
// 开发环境
const {resolve} = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");
module.exports = {
    entry: ["./src/js/index.js","./src/index.html"], // 指定入口文件(路径)和devServer的模块热更新范围
    output: {
        path: resolve(__dirname, "./dist"), // 指定出口路径，需要是一个绝对路径
        filename: "js/app.js",
        publicPath: "/"  // 用于解决服务器部署时，路径问题
    },

    // 所有的loader都要放在module对象的rules数组中
    // loader的运行顺序为 从右到左，从下到上
    module: {
        rules: [
            //此模块用于将Less编译为css文件
            {
                test: /\.less$/, // 匹配所有less结尾的文件
                use: [
                    "style-loader", // 用于在html文档中创建一个style标签将该样式进行载入
                    "css-loader", // 将less编译的css转换为Commonjs的一个模块
                    "less-loader" // 将 less 编译为css文件放到内存中
                ],
            },

            //此模块用于语法检查,再次只做loader引入，具体检查规则需写在package.json中(效率高)
            {
                test: /\.js$/,  // 设置此loader对什么文件生效
                exclude: /node_modules/, // 设置不匹配的文件或目录
                enforce: "pre",
                use: "eslint-loader"
            },

            // 语法兼容loader
            {
                test: /.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: [
                            ["@babel/preset-env",
                                {
                                    useBuiltIns: "usage",
                                    corejs: {version: 3}, // 解决webpack无法找到core-js
                                    targets: {
                                        "chrome": "60",
                                        "ie": "10"
                                    }
                                }]
                        ]
                    }
                }
            },

            // 处理css样式中引入的图片路径问题
            {
                test: /\.(png|jpg|gif)$/, // 匹配资源
                use: [
                    {
                        loader: "url-loader", //
                        options: {
                            limit: 8192, // 8kb 以上转base64(这样会占用更少体积)
                            publicPath: "/images", // 引入图片的位置(以当前图片文件夹位置为参考点)
                            outputPath: "images", // 输出文件夹
                            name: "[hash:5].[ext]", // 图片名改为 5位哈希值
                            esModule: false // 兼容 node和html引入
                        }
                    }
                ],

                type: 'javascript/auto' // 解决url-loader 的版本问题
            },

            // 处理html 中 img标签引入的图片路径问题
            {
                test: /\.(html)$/,
                use: 'html-loader'
            },

            // 匹配多媒体资源(包括字体)
            {
                test: /\.(eot|svg|woff|woff2|ttf|mp3|m4p|avi)$/,
                loader: 'file-loader',
                options: {
                    outputPath: 'media', // 输出的文件夹
                    name: '[hash:8].[ext]' // 限制文件名哈希值个数
                }
            }
        ]
    },


    plugins: [
        // 打包一个html到指定位置
        new HTMLWebpackPlugin({
            template: "./src/index.html", // 选择一个模板作为复制样本
            title:"test"  // 设置该html文件的标题
        })
    ],
    mode: "development" ,// 配置工作环境
    devServer: {
        open: true, // 自动打开浏览器
        compress: true, // 启动zip压缩
        port: 4000,//端口号
        hot: true // 模块热更新(会监听entry内的指定文件，当它们修改后，会自动无刷新更新页面)
    }
}
