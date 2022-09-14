<script>
	import { escape, onMount } from 'svelte/internal';
    import { showAlert } from '../../utils/errors';
    import { send_json_data } from '../../utils/get_cookie'
    import GanttDropdown from 'components/Dropdowns/GanttDropdown.svelte'
    import * as Highcharts from 'highcharts/highcharts-gantt.src';
    import * as  Exporting from 'highcharts/modules/exporting.src';
    import * as OfflineExporting from 'highcharts/modules/offline-exporting.src';
    import * as ExportData from 'highcharts/modules/export-data.src'
    import * as DraggablePoints  from 'highcharts/modules/draggable-points.src';
    import * as U from 'highcharts/es-modules/Core/Utilities';
    const addEvent = U.default.addEvent;
    const objectEach = U.default.objectEach;
    DraggablePoints.default(Highcharts);
    Exporting.default(Highcharts);
    OfflineExporting.default(Highcharts);
    ExportData.default(Highcharts);

    export let project_id;
    export let mode;
    export let selected_object;

    let gantt;
function get_all(project_id){
    const url=`/gantt/all/${project_id}/`;

    function normalizePlanningDate(obj){
        obj.planned_start_date = new Date(obj.planned_start_date).getTime();
        obj.planned_end_date = new Date(obj.planned_end_date).getTime();
        return obj;
    }

    fetch(url).then(res =>res.json())
    .then(data => {
        const getActivityId = ac_id => ac_id? 'activity_' + ac_id : null;
        let list=[];
        let min_start, max_end;

        function eachActivity(activity, parent_id){
            let start=activity.planned_start_date,
                end=activity.planned_end_date;

            min_start = (min_start < start ? min_start : start);
            max_end = (max_end > end ? max_end : end);
                
            return {
                name: activity.name,
                id: getActivityId(activity.id),
                start: start,
                end: end,
                parent: parent_id,
                description: activity.description,
                dependency: getActivityId(activity.dependency),
                assignees: activity.assignees.map(o => o.user.avatar),
            }     
        }

        data.tasks.map(task => normalizePlanningDate(task))
        .map(task => {
            const task_id = 'task_' + task.id;
            
            task.activities.map(activity => normalizePlanningDate(activity))
            .sort(
                (a, b) => a.planned_start_date - b.planned_start_date
            )
            .map(activity => {
                const activity_obj = eachActivity(activity, task_id);
                list.push(activity_obj);
            });
            
            list.push(
                {
                    name: task.name,
                    id: task_id,
                    start: task.planned_start_date,
                    end: task.planned_end_date,
                }
            )
        });

        gantt = show_gantt(data, list, min_start, max_end);
    })
}

const day = 1000 * 60 * 60 * 24;


function show_gantt(project, list, min_start, max_end) {
    let chart = Highcharts.ganttChart('gantt', {
        title: {
            text: project.name
        },
        yAxis: {
            uniqueNames: true,
        },

        xAxis: {
            currentDateIndicator: {
                width: 0.5,
                color: 'red',
                label: {
                    format: 'Now'
                }
            },
            min: min_start - 2 * day,
            max: max_end + 2 * day
        },
        series: [{
            name: project.name,
            data: list,
        }],

        exporting: { 
            width: 1920,
            printMaxWidth: 1920,
        },
        
        plotOptions: {
            gantt: {
                animation: true,
                dragDrop: {
                    draggableX: true,
                    draggableY: false,
                    dragPrecisionX: day / 24
                },
                
                point: {
                    events: {
                        drop: e => {
                            let obj = {};
                            let [type, id] = e.newPointId.split('_');
                            let {start:planned_start_date, end:planned_end_date} = e.newPoint;

                            if (planned_start_date)
                                obj.planned_start_date = new Date(planned_start_date).toISOString();

                            if(planned_end_date)
                                obj.planned_end_date = new Date(planned_end_date).toISOString();

                            send_json_data(`/gantt/${type}/${id}/`, 'PATCH', obj)
                            .then(data => showAlert('Updated', 'success', 700))
                            .catch(e => showAlert(e, 'error'))
                        },
                        mouseOver: showSide,
                        mouseOut: pointMouseOut,
                        click: e => {console.log(chart)
                            let id;
                            [mode, id] = e.point.options.id.split('_');
                            selected_object = {id: id}
                        },
                    }
                },
            },
        },

    });
    function pointMouseOut(e){
        let point = e.target, chart = point.series.chart;
        chart.selectedElementOptions = null;
    }
    // set events
    if (!chart.hasAddedConnectingEvents) {
        var container = chart.container
        
        chart.unbindConnectingMouseUp = addEvents(container, ['mouseup', 'touchend'], function (e) {
            if (chart.selectedElementOptions)
                addDependency(chart.selectedElementOptions)

            if (chart.selectedElement)
                chart.selectedElement = null;

            chart.hello['line'].css({display: 'none'})
            
        }, { passive: false });
        // // Add flag to avoid doing this again
        chart.hasAddedConnectingEvents = true;
        // // Add cleanup to make sure we don't pollute document
        addEvent(chart, 'destroy', function () {
            if (chart.unbindConnectingMouseUp) {
                chart.unbindConnectingMouseUp();
            }
        });
    }

    const points = chart.series[0].points;
    for (let i=0; i<points.length;i++){
        points[i].graphic.element.addEventListener('contextmenu', function(ev) {
            ev.preventDefault();

            selectedPointIndex = i;
            selectedActivityElement = ev.target;

            return false;
        }, false);
    }

    return chart;
}
let selectedPointIndex;
let selectedActivityElement;


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

function addDependency({point, dependencyId}){
    let series = gantt.series[0], chart= series.chart;
        
    let [, getActivityId] = point.id.split('_');
    let [, activity_dependency_id] = dependencyId.split('_')

    send_json_data(`/gantt/activity/${getActivityId}/`, 'PATCH', {
        dependency: activity_dependency_id
    })
    .then(data => showAlert('Updated', 'success'))
    .catch(e => showAlert(e))


    series.addPoint({
        name: point.name,
        id: point.id,
        start: point.start,
        end: point.end,
        parent: point.parent,
        description: point.description,
        dependency: dependencyId,
    });
}


    function showSide(e){
        let point = e.target, series = point.series, chart = series.chart, renderer = chart.renderer, handleAttrs={};
        var container = chart.container;

        // handle drop
        if (chart.selectedElement){
            chart.selectedElementOptions = {point: point, dependencyId: chart.hello.point}

            return;
        }

        if (!chart.hello){
            chart.hello = { 
                group: renderer
                    .g('connector-handles')
                    .add(series.markerGroup || series.group)
            }
        }
        function positioner(point) {
            var bBox = (point.shapeArgs ||
                (point.graphic && point.graphic.getBBox()) ||
                {}), reversed = series.yAxis.reversed, threshold =  series.options.threshold || 0, y = point.y || 0, bottom = (!reversed && y >= threshold) ||
                (reversed && y < threshold);
            return {
                x: bBox.x || 0,
                y: bottom ? (bBox.y || 0) : (bBox.y || 0) + (bBox.height || 0)
            };
        }
        
        // Store which point this is
        chart.hello.point = point.id;
        // Find position and path of handle
        let pos = positioner(point);

        // Create and add the handle element if it doesn't exist
        let handle = chart.hello['val.optionName'];
        let line = chart.hello['line'];
        if (!handle) {
            handle = chart.hello['val.optionName'] = renderer
                .path()
                .add(chart.hello.group);
            
            line = chart.hello['line'] = renderer.createElement('line').add(chart.hello.group)

            line.attr({
                style: 'stroke:rgb(255,0,0);stroke-width:2'
            })
        }
        
        handleAttrs = {
            // class: "",
            d: "M 0 3 L 0 7 A 1 1 0 0 0 0 17 A 1 1 0 0 0 0 7 M 0 17 L 0 21",
            // cursor: "select",
            fill: point.graphic.element.getAttribute('fill'),
            // draggable: true,
        };
        // Move and update handle
        handle
        .translate(pos.x, pos.y)
        .attr(handleAttrs);

        // Add events
        addEvents(handle.element, ['touchstart', 'mousedown'], function (e) {
            chart.currentX = e.layerX;
            chart.currentY = e.layerY;
            chart.selectedElement = e.target;
            
            const previousX = handle.translateX,
                previousY = handle.translateY;
            let dx = previousX + (e.layerX - chart.currentX),
                dy = previousY + (e.layerY - chart.currentY);
            line.attr({
                x1: dx,
                y1: dy,
                x2: dx,
                y2: dy
            }).css({display: 'inline'})
        }, { passive: false });
        addEvent(container, 'mousemove', function (e) {
            
            if (chart.selectedElement) {

                const previousX = handle.translateX,
                    previousY = handle.translateY;
                let dx = previousX + (e.layerX - chart.currentX),
                    dy = previousY + (e.layerY - chart.currentY);
                chart.currentX = e.layerX;
                chart.currentY = e.layerY;
                
                handle.translate(dx, dy);
                line.attr({x2: dx+3, y2: dy+10})

                handle.css({visibility: 'hidden'})
                let under = document.elementFromPoint(e.clientX, e.clientY);
                
                handle.css({visibility: 'visible'})

                let p = chart.pointer.getPointFromEvent({target: under});
                
                // undefined on graph in scatterchart
                if (typeof p !== 'undefined') {
                    chart.isDirectTouch = true;
                    p.onMouseOver(e);
                }

            }
        }, {passive: true});
        addEvents(chart.hello.group.element, ['touchend', 'mouseup'], function () {
            chart.selectedElement = null;
        });
        
    }
    

function removeDependency(){
    const series = gantt.series[0], point = series.points[selectedPointIndex];
    const id = point.id.split('_')[1];
    
    send_json_data(`/gantt/activity/${id}/`, 'PATCH', {dependency: null})
    .then(data => {
        series.addPoint({
            name: point.name,
            id: point.id,
            start: point.start,
            end: point.end,
            parent: point.parent,
            description: point.description,
            dependency: [],
        });
        showAlert('Updated', 'success', 700);
    })
    .catch(e => showAlert(e))
}

function deletePoint(){
    const series = gantt.series[0];
    const index = selectedPointIndex;
    const id = series.points[i].id.split('_')[1];

    send_json_data(`/gantt/activity/${id}/`, 'DELETE', '', true)
    .then(() => {
        showAlert('Deleted', 'error');
        series.removePoint(index);
    })
    .catch(e => showAlert(e))
}

onMount(()=>{
    get_all(project_id)
})
</script>

<div class="relative mt-4 shadow-lg">
    <div id="gantt" class="rounded-md px-1 pt-6 bg-white"></div>
</div>

<GanttDropdown 
    ref="{selectedActivityElement}" 
    on:click_remove_dep="{removeDependency}"
    on:click_delete="{deletePoint}"
/>