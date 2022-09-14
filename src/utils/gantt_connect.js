// showDragHandles
'use strict';
import A from 'highcharts/Core/Animation/AnimationUtilities.js';
var animObject = A.animObject;
import Chart from 'highcharts/Core/Chart/Chart.js';
import H from 'highcharts/Core/Globals.js';
import Point from 'highcharts/Core/Series/Point.js';
import Series from 'highcharts/Core/Series/Series.js';
import SeriesRegistry from 'highcharts/Core/Series/SeriesRegistry.js';
var seriesTypes = SeriesRegistry.seriesTypes;
import U from 'highcharts/Core/Utilities.js';
var addEvent = U.addEvent, clamp = U.clamp, isNumber = U.isNumber, merge = U.merge, objectEach = U.objectEach, pick = U.pick;

/**
 * Render drag handles on a point - depending on which handles are enabled - and
 * attach events to them.
 *
 * @private
 * @function Highcharts.Point#showConnectorHandles
 * @return {void}
 */
Point.prototype.showConnectorHandles = function () {
    var point = this, series = point.series, chart = series.chart, renderer = chart.renderer, options = merge(series.options.dragDrop, point.options.dragDrop);
    // Go through each updateProp and see if we are supposed to create a handle
    // for it.
    objectEach(series.dragDropProps, function (val, key) {
        var handleOptions = merge(defaultDragHandleOptions, val.handleOptions, options.dragHandle), handleAttrs = {
            'class': handleOptions.className,
            'stroke-width': handleOptions.lineWidth,
            fill: handleOptions.color,
            stroke: handleOptions.lineColor
        }, pathFormatter = handleOptions.pathFormatter || val.handleFormatter, positioner = val.handlePositioner, pos, handle, path, 
        // Run validation function on whether or not we allow individual
        // updating of this prop.
        validate = val.validateIndividualDrag ?
            val.validateIndividualDrag(point) : true;
        if (val.resize &&
            validate &&
            val.resizeSide &&
            pathFormatter &&
            (options['draggable' + val.axis.toUpperCase()] ||
                options[val.optionName]) &&
            options[val.optionName] !== false) {
            // Create group if it doesn't exist
            if (!chart.dragHandles) {
                chart.dragHandles = {
                    group: renderer
                        .g('drag-drop-handles')
                        .add(series.markerGroup || series.group)
                };
            }
            // Store which point this is
            chart.dragHandles.point = point.id;
            // Find position and path of handle
            pos = positioner(point);
            handleAttrs.d = path = pathFormatter(point);
            // Correct left edge value depending on the xAxis' type, #16596
            var minEdge = point.series.xAxis.categories ? -0.5 : 0;
            if (!path || pos.x < minEdge || pos.y < 0) {
                return;
            }
            // If cursor is not set explicitly, use axis direction
            handleAttrs.cursor = handleOptions.cursor ||
                ((val.axis === 'x') !== !!chart.inverted ?
                    'ew-resize' : 'ns-resize');
            // Create and add the handle element if it doesn't exist
            handle = chart.dragHandles[val.optionName];
            if (!handle) {
                handle = chart.dragHandles[val.optionName] = renderer
                    .path()
                    .add(chart.dragHandles.group);
            }
            // Move and update handle
            handle.translate(pos.x, pos.y).attr(handleAttrs);
            // Add events
            addEvents(handle.element, ['touchstart', 'mousedown'], function (e) {
                onResizeHandleMouseDown(getNormalizedEvent(e, chart), point, key);
            }, { passive: false });
            addEvent(chart.dragHandles.group.element, 'mouseover', function () {
                chart.dragDropData = chart.dragDropData || {};
                chart.dragDropData.isHoveringHandle = point.id;
            });
            addEvents(chart.dragHandles.group.element, ['touchend', 'mouseout'], function () {
                onResizeHandleMouseOut(point);
            });
        }
    });
};

/**
 * Add multiple event listeners with the same handler to the same element.
 *
 * @private
 * @function addEvents
 * @param {T} el
 *        The element or object to add listeners to.
 * @param {Array<string>} types
 *        Array with the event types this handler should apply to.
 * @param {Function|Highcharts.EventCallbackFunction<T>} fn
 *        The function callback to execute when the events are fired.
 * @param {Highcharts.EventOptionsObject} [options]
 *        Event options:
 *        - `order`: The order the event handler should be called. This opens
 *          for having one handler be called before another, independent of in
 *          which order they were added.
 * @return {Function}
 *         A callback function to remove the added events.
 * @template T
 */
 function addEvents(el, types, fn, options) {
    var removeFuncs = types.map(function (type) {
        return addEvent(el, type, fn, options);
    });
    return function () {
        removeFuncs.forEach(function (fn) {
            fn();
        });
    };
}