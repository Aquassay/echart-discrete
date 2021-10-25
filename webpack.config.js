module.exports = (env, options) => {
    return {
        entry: {
            'echarts-discrete' : __dirname + '/index.js'
        },
        output: {
            libraryTarget   : 'global',
            library         : ['echarts-discrete'],
            path            : __dirname + '/dist',
            filename        : options.mode === 'production' ? '[name].min.js' : '[name].js'
        },
        optimization : {
            concatenateModules : true
        },
        externals : {
            'echarts/lib/echarts': 'echarts',
            'date-fns' : 'date-fns',
        },
        devtool : 'source-map',
        resolve : {
            alias: {
                'echarts/lib/echarts': 'echarts'
            },
        },
    };
};