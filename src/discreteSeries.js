import { formatDistanceStrict } from 'date-fns';
import { addMilliseconds } from 'date-fns';

/**
 * Return all configurations used to correctly show your discrete serie : 
 *     - tooltip : tooltip option with specific formatter to show, for each item, the current selected and the duration
 *     - data : data to set in your serie item
 * 
 * @param {Object}      params                      Function params
 * @param {Array[]}     params.data                 Data to manipulate and show in discrete panel, the serie is a timeSerie
 * @param {Array[]}     params.data[]               One data item
 * @param {string}      params.data[][0]            Date of item
 * @param {number}      params.data[][1]            Value of item
 * @param {string}      params.from                 From date in ISO string format
 * @param {string}      params.to                   To date in ISO string format
 * @param {number}      params.interval             Interval in ms between two values
 * @param {Object[]}    params.categories           Values categories
 * @param {sring}       params.categories[].label   Label of specific category
 * @param {string}      params.categories[].color   Color of specific category
 * @param {number}      params.categories[].value   Value of specific category
 */
export default (params) => {
    const finalData = [];

    params.data.forEach(function (item, index) {
        const prevItem = index === 0 ? null : params.data[index - 1];

        if (!prevItem || prevItem[1] !== item[1]) {
            finalData.push(item);
        }
    });

    const data = finalData.map(function (item, index, data) {
        const nextItem = index + 1 === data.length ? null : data[index + 1];
    
        return {
            name    : params.legend.find((l) => l.value === item[1])?.name,
            value   : [
                item[0], // start
                nextItem
                    ? nextItem[0]
                    : addMilliseconds(new Date(item[0]), params.interval).toISOString(), // end
                item[1] // value
            ],
            itemStyle : {
                color : params.legend.find((l) => l.value === item[1])?.color
            }
        };
    });

    // add N/A item on start if we don't have data
    if (data[0].value[0] !== params.from) {
        data.unshift({
            name    : "N/A",
            value   : [
                params.from, // start
                data[0].value[0], // end
                -1 // value
            ],
            visualMap   : false,
            itemStyle   : {
                color : "#E0E0E0"
            }
        });
    }

    // add N/A item on end if we don't have data
    if (data[data.length - 1].value[1] !== params.to) {
        data.unshift({
            name    : "N/A",
            value   : [
                data[data.length - 1].value[1], // start
                params.to, // end
                -1 // value
            ],
            visualMap   : false,
            itemStyle   : {
                color : "#E0E0E0"
            }
        });
    }

    const tooltip = {
        formatter(params) {
            const duration = formatDistanceStrict(
                new Date(params.value[1]),
                new Date(params.value[0])
            );
        
            return params.marker + params.name + ": " + duration;
        }
    };
    
    const visualMap = {
        pieces: params.legend,
        orient: "horizontal"
    };
    
    return {
        data,
        tooltip,
        visualMap
    };
};