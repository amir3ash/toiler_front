const a=1
export default a
// import type * as Highcharts from 'highcharts/highcharts-gantt.src';
// import * as  Exporting from 'highcharts/modules/exporting.src';
// import * as OfflineExporting from 'highcharts/modules/offline-exporting.src';
// import * as ExportData from 'highcharts/modules/export-data.src'
// import * as DraggablePoints  from 'highcharts/modules/draggable-points.src';
// // import * as U from 'highcharts/es-modules/Core/Utilities';

// // const addEvent = U.default.addEvent;
// // const objectEach = U.default.objectEach;
// // DraggablePoints.default(Highcharts);
// // Exporting.default(Highcharts);
// // OfflineExporting.default(Highcharts);
// // ExportData.default(Highcharts);


// import H from 'highcharts/es-modules/Core/Globals.js';
// import D from 'highcharts/es-modules/Core/DefaultOptions.js'
// import Connection from 'highcharts/es-modules/Gantt/Connection.js';
// import Chart from 'highcharts/es-modules/Core/Chart/Chart.js';
// import U from 'highcharts/es-modules/Core/Utilities.js';
// const {addEvent, expand} = U
// var defaultOptions = D.defaultOptions;

// expand(defaultOptions, {
//     customChartOPtions: {
//         events: {
//             onAddDependency: () => false,
//             onRemoveDependency: () => false
//         }
//     }
// })

    
  

// class CustomChart {
//     chart: Highcharts.Chart
//     hasAddedConnectingEvents: boolean
//     unbindConnectingMouseUp
//     selectedElementOptions
//     selectedElement
//     hello
//     selectedPointIndex
//     selectedActivityElement
//     currentX
//     currentY

//     onAddDependency
//     onRemoveDependency

//     constructor (chart: Highcharts.Chart, 
//                 onAddDependency = () => true,
//                 onRemoveDependency = () => true
//                 ){
//         this.chart = chart
//         this.onAddDependency = onAddDependency
//         this.onRemoveDependency = onRemoveDependency

//         // set events
//         if (!this.hasAddedConnectingEvents) {
//             var container = chart.container
            
//             this.unbindConnectingMouseUp = this.addEvents(container, ['mouseup', 'touchend'], this.setEnve, { passive: false });
//             // // Add flag to avoid doing this again
//             this.hasAddedConnectingEvents = true;
//             // // Add cleanup to make sure we don't pollute document
//             addEvent(chart, 'destroy', function () {
//                 if (this.unbindConnectingMouseUp) {
//                     this.unbindConnectingMouseUp();
//                 }
//             });
//         }

//         const points = chart.series[0].points;

//         for (let i=0 ; i < points.length; i++){
//             points[i].graphic.element.addEventListener('contextmenu', function(ev) {
//                 ev.preventDefault();

//                 this.selectedPointIndex = i;
//                 this.selectedActivityElement = ev.target;

//                 return false;
//             }, false);
//         }

//     }

//     setEnve (event) {
//         if (this.selectedElementOptions)
//             this.addDependency(this.selectedElementOptions)

//         if (this.selectedElement)
//             this.selectedElement = null;

//         this.hello['line'].css({display: 'none'})
        
//     }

//     pointMouseOut(e){
//         let point = e.target
//         this.selectedElementOptions = null;
//     } 

//     addEvents(el, types, fn, options) {
//         var removeFuncs = types.map(function (type) {
//             return addEvent(el, type, fn, options);
//         });
//         return function () {
//             removeFuncs.forEach(function (fn) {
//                 fn();
//             });
//         };
//     }

//     addDependency({point, dependencyId}){
//         let series = this.chart.series[0]
            
//         // let [, getActivityId] = point.id.split('_');
//         // let [, activity_dependency_id] = dependencyId.split('_')

//         // send_json_data(`/gantt/activity/${getActivityId}/`, 'PATCH', {
//         //     dependency: activity_dependency_id
//         // })
//         // .then(data => showAlert('Updated', 'success'))
//         // .catch(e => showAlert(e))
//         if (!this.onAddDependency(point, dependencyId))
//             return

//         series.addPoint({
//             name: point.name,
//             id: point.id,
//             start: point.start,
//             end: point.end,
//             parent: point.parent,
//             description: point.description,
//             dependency: dependencyId,
//         });
//     }


//     showSide(e){
//         let point = e.target, series = point.series, chart = this.chart, renderer = chart.renderer, handleAttrs={};
//         var container = chart.container;

//         // handle drop
//         if (this.selectedElement){
//             this.selectedElementOptions = {point: point, dependencyId: this.hello.point}

//             return;
//         }

//         if (!this.hello){
//             this.hello = { 
//                 group: renderer
//                     .g('connector-handles')
//                     .add(series.markerGroup || series.group)
//             }
//         }
//         function positioner(point: Highcharts.Point) {
//             var bBox = (point.shapeArgs ||
//                 (point.graphic && point.graphic.getBBox()) ||
//                 {}), reversed = series.yAxis.reversed, threshold =  series.options.threshold || 0, y = point.y || 0, bottom = (!reversed && y >= threshold) ||
//                 (reversed && y < threshold);
//             return {
//                 x: bBox.x || 0,
//                 y: bottom ? (bBox.y || 0) : (bBox.y || 0) + (bBox.height || 0)
//             };
//         }
        
//         // Store which point this is
//         this.hello.point = point.id;
//         // Find position and path of handle
//         let pos = positioner(point);

//         // Create and add the handle element if it doesn't exist
//         let handle = this.hello['val.optionName'];
//         let line = this.hello['line'];
//         if (!handle) {
//             handle = this.hello['val.optionName'] = renderer
//                 .path()
//                 .add(this.hello.group);
            
//             line = this.hello['line'] = renderer.createElement('line').add(this.hello.group)

//             line.attr({
//                 style: 'stroke:rgb(255,0,0);stroke-width:2'
//             })
//         }
        
//         handleAttrs = {
//             // class: "",
//             d: "M 0 3 L 0 7 A 1 1 0 0 0 0 17 A 1 1 0 0 0 0 7 M 0 17 L 0 21",
//             // cursor: "select",
//             fill: point.graphic.element.getAttribute('fill'),
//             // draggable: true,
//         };
//         // Move and update handle
//         handle
//         .translate(pos.x, pos.y)
//         .attr(handleAttrs);

//         // Add events
//         this.addEvents(handle.element, ['touchstart', 'mousedown'], function (e) {
//             this.currentX = e.layerX;
//             this.currentY = e.layerY;
//             this.selectedElement = e.target;
            
//             const previousX = handle.translateX,
//                 previousY = handle.translateY;
//             let dx = previousX + (e.layerX - this.currentX),
//                 dy = previousY + (e.layerY - this.currentY);
//             line.attr({
//                 x1: dx,
//                 y1: dy,
//                 x2: dx,
//                 y2: dy
//             }).css({display: 'inline'})
//         }, { passive: false });
//         addEvent(container, 'mousemove', function (e) {
            
//             if (this.selectedElement) {

//                 const previousX = handle.translateX,
//                     previousY = handle.translateY;
//                 let dx = previousX + (e.layerX - this.currentX),
//                     dy = previousY + (e.layerY - this.currentY);
//                 this.currentX = e.layerX;
//                 this.currentY = e.layerY;
                
//                 handle.translate(dx, dy);
//                 line.attr({x2: dx+3, y2: dy+10})

//                 handle.css({visibility: 'hidden'})
//                 let under = document.elementFromPoint(e.clientX, e.clientY);
                
//                 handle.css({visibility: 'visible'})

//                 let p = chart.pointer.getPointFromEvent({target: under});
                
//                 // undefined on graph in scatterchart
//                 if (typeof p !== 'undefined') {
//                     chart.isDirectTouch = true;
//                     p.onMouseOver(e);
//                 }

//             }
//         }, {passive: true});
//         this.addEvents(this.hello.group.element, ['touchend', 'mouseup'], function () {
//             this.selectedElement = null;
//         }, {});
        
//     }
        

//     removeDependency(){
//         const series = this.chart.series[0], point = series.points[this.selectedPointIndex];
//         // const id = point.id.split('_')[1];

//         if (!this.onRemoveDependency(point))
//             return

//         series.addPoint({
//             name: point.name,
//             id: point.id,
//             start: point.start,
//             end: point.end,
//             parent: point.parent,
//             description: point.description,
//             dependency: [],
//         });

//         // send_json_data(`/gantt/activity/${id}/`, 'PATCH', {dependency: null})
//         // .then(data => {
            
//         //     showAlert('Updated', 'success', 700);
//         // })
//         // .catch(e => showAlert(e))
//     }

//     deletePoint(){
//         const series = this.chart.series[0];
//         const index = this.selectedPointIndex;
//         const id = series.points[i].id.split('_')[1];

//         send_json_data(`/gantt/activity/${id}/`, 'DELETE', '', true)
//         .then(() => {
//             showAlert('Deleted', 'error');
//             series.removePoint(index);
//         })
//         .catch(e => showAlert(e))
//     }
// }

// export default CustomChart