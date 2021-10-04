import * as echarts from 'echarts/lib/echarts';

echarts.extendSeriesModel({
    type           : 'series.discrete',
    getInitialData : function (option, ecModel) {
        var globalOption = ecModel.getOption();

        // validate globalOptions only if xAxis is in time format and max is setted. 
        // Without this informations, discrete panel does not works
        if (!globalOption.xAxis) {
            throw new Error('Discrete series need one xAxis');
        }

        if (globalOption.xAxis[0].type !== 'time') {
            throw new Error('Discrete series only works with time axis');
        }

        if (!globalOption.xAxis[0].max) {
            throw new Error('Discrete series need max on xAxis');
        }

        var data = [];

        option.data.forEach(function (item, index) {
            var prevItem = index === 0 ? null : data[index - 1];
        
            if (!prevItem || prevItem[1] !== item[1]) {
                data.push(item);
            }
        });

        data = data.map(function (item, index, data) {
            var nextItem = index + 1 === data.length 
                ? [globalOption.xAxis[0].max] 
                : data[index + 1];
    
            var start       = new Date(item[0]);
            var end         = new Date(nextItem[0]);
            var duration    = end.getTime() - start.getTime();

            return [
                item[0],                        // start
                item[1],                        // value
                duration,
            ];
        });

        // en attente d'informations sur la ducumentation d'Echart pour savoir comment marche ces parties
        var dimensions = echarts.helper.createDimensions(data);

        var list = new echarts.List(dimensions, this);

        list.initData(data);

        return list;
    },
});