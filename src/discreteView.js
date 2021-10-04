import * as echarts from 'echarts/lib/echarts';

echarts.extendChartView({
    type    : 'discrete',
    render  : function (seriesModel, ecModel, api) {
        console.log('render');
        var self = this;

        var data = seriesModel.getData();

        console.log(data);
    }
});