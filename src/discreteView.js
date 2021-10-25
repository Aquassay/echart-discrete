import * as echarts from 'echarts/lib/echarts';

/**
 * Return render function for specific categoryIndex of your serie
 * The render function simply draw rectangles with the width of the value duration
 * 
 * @param {number} i        Category Index of your serie to render 
 * @returns                 Render function
 */
export default function (i) {
    return function (params, api) {
        const categoryIndex = i;
        const start         = api.coord([api.value(0), categoryIndex]);
        const end           = api.coord([api.value(1), categoryIndex]);
        const height        = api.size([0, 1])[1] * 0.6;
        const rectShape     = echarts.graphic.clipRectByRect(
            {
                x: start[0],
                y: start[1] - height / 2,
                width: end[0] - start[0],
                height: height
            },
            {
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
            }
        );

    return (
        rectShape && {
            type: "rect",
            transition: ["shape"],
            shape: rectShape,
            style: api.style()
        }
    );
  };
}
