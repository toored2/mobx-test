const path =require('path')

const config={
    mode:'development',
    entry:path.resolve(__dirname,'src/index5.jsx'),
    output:{
        path:path.resolve(__dirname,'dist'),
        filename:'main.js'
    },
    module:{
        rules:[{
            test:/\.jsx?$/,
            exclude:/node_modules/,
            use:{
                loader:'babel-loader',
                options:{
                    presets:['@babel/preset-env','@babel/react'],
                    plugins:[
                        ['@babel/proposal-decorators', {"legacy": true}],
                        ['@babel/proposal-class-properties', {"loose": true}],
                    ]
                }
            }
        }]
    },
    devtool:'inline-source-map'
}

module.exports=config;
