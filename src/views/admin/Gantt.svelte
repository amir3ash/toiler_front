<script lang="ts">
	import { escape, onMount } from 'svelte/internal';
    import { showAlert } from '../../utils/errors';
    import { send_json_data } from '../../utils/get_cookie'
    import GanttDropdown from '../../components/Dropdowns/GanttDropdown.svelte'
    import * as Highcharts from '../../../node_modules/highcharts/highcharts-gantt.src';
    import * as  Exporting from '../../../node_modules/highcharts/modules/exporting.src';
    import * as OfflineExporting from '../../../node_modules/highcharts/modules/offline-exporting.src';
    import * as ExportData from '../../../node_modules/highcharts/modules/export-data.src'
    import * as DraggablePoints  from '../../../node_modules/highcharts/modules/draggable-points.src';
    import * as U from '../../../node_modules/highcharts/es-modules/Core/Utilities';
    import * as Dark from '../../../node_modules/highcharts/themes/high-contrast-dark.src';
    import type { GetProjectQuery } from '../../gql/graphql';
    import { darkTheme } from '../../stores'

    type ProjectType = GetProjectQuery['project']
    type TaskType = ProjectType['tasks'][0]
    type ActivityType = TaskType['activities'][0]

    const addEvent = U.default.addEvent;
    const objectEach = U.default.objectEach;
    DraggablePoints.default(Highcharts);
    Exporting.default(Highcharts);
    OfflineExporting.default(Highcharts);
    ExportData.default(Highcharts);

    if ($darkTheme)
        Dark.default(Highcharts)

    export let project_data: ProjectType;
    export let mode: 'activity' | 'task';
    export let selected_object: TaskType | ActivityType;

    let gantt;
    
function get_all(){
    let allActivities: Record<number, ActivityType> = {}; // activity_id => activity
    let overloadedUsernames: Record<number, string[]> = {}; // activity_id => usernames[]

    project_data.tasks.map(task => task.activities)
    .flat()
    .map(o => allActivities[o.id] = o);

    function generateAssigneesWarnings(){

        function addAssigneeError(username: string, activityId: number){
            if (overloadedUsernames[activityId] && -1 !== overloadedUsernames[activityId].findIndex(o => o===username)){
                overloadedUsernames[activityId].push(username)
            }
            else
                overloadedUsernames[activityId] = [username]
        }
        const assignees = Object.values(allActivities).map(activity => activity.assignees).flat()
        
        if (assignees.length === 0)
            return

        const uidToActivityIds = assignees
        .map(assigned => ({[assigned.user.id]: [assigned.activityId]}))
        .reduce((a,b) => {
            let [user_id, activity_ids] = Object.entries(b)[0];
            if (a[user_id])
                a[user_id].push(...activity_ids);
            else 
                a[user_id] = [...activity_ids];
            return a
        });

        Object.entries(uidToActivityIds)
        .map(([userId, acIds]) => ({userID:userId, activities:acIds.map(id => allActivities[id])}))
        .map(({userID, activities}) => ({userID:userID, activities:activities.sort((a, b) => a.plannedStartDate - b.plannedStartDate)}))
        .map(({userID, activities}) => {
            let username: string
            let lastActivity = activities[0];

            activities.slice(1).forEach(activity => {
                if (activity.plannedStartDate < lastActivity.plannedEndDate){
                    if (!username)
                        username = activity.assignees.map(o => o.user).find(u => u.id===parseInt(userID)).username;
                    
                    addAssigneeError(username, activity.id) 
                    addAssigneeError(username, lastActivity.id)
                }
                
                lastActivity = activity;
            });
        })
    }

    generateAssigneesWarnings();
    
    function generateTaskWarnings(task: TaskType){
        let errors: string[] = [];
        if (task.plannedStartDate < project_data.plannedStartDate)
            errors.push("task is planned before project start-date")
        if (task.plannedEndDate > project_data.plannedEndDate)
            errors.push("task is planned after project end-date")
        
        if (errors.length === 0)
            return ''
        return '</br>' + errors.join('</br>')
    }

    function generateActivityWarnings(activity: ActivityType, parentTask: TaskType){
        let errors: string[] = [];
        if (activity.plannedStartDate < parentTask.plannedStartDate)
            errors.push("activity is planned before task start-date")
        if (activity.plannedEndDate > parentTask.plannedEndDate)
            errors.push("activity is planned after task end-date")
        
        if (activity.dependencyId){
            let dependencyActivity = allActivities[activity.dependencyId];
            if (activity.plannedStartDate < dependencyActivity.plannedEndDate)
                errors.push("activity is planned before dependency end-date")
        }
        
        const usernames = overloadedUsernames[activity.id]
        if (usernames)
            errors.push(...usernames.map(username => 'user "' + username + '" is overloaded'))

        if (errors.length === 0)
            return ''
        return '</br>' + errors.join('</br>')
    }

    function normalizePlanningDate(obj: ActivityType | TaskType): ActivityType|TaskType{
        obj.plannedStartDate = new Date(obj.plannedStartDate).getTime();
        obj.plannedEndDate = new Date(obj.plannedEndDate).getTime();
        return obj;
    }

    function convertDescription(description: string){
        if (!description || description === '')
            return ''

        return '</br>' + description.split('\n').join('</br>')
    }

    
    const getActivityId = (ac_id: number) => ac_id? 'activity_' + ac_id : null;
    let min_start:number, max_end: number;

    function eachActivity(activity: ActivityType, parent_id: string, task: TaskType){
        let start=activity.plannedStartDate,
            end=activity.plannedEndDate;

        min_start = (min_start < start ? min_start : start);
        max_end = (max_end > end ? max_end : end);
        
        const warnings = generateActivityWarnings(activity, task);
        return {
            name: activity.name,
            id: getActivityId(activity.id),
            start: start,
            end: end,
            parent: parent_id,
            description: convertDescription(activity.description),
            dependency: getActivityId(activity.dependencyId),
            assignees: activity.assignees.map(o => o.user.username).join(' & '),
            warnings: warnings,
            fontSymbol: warnings.length == 0 ? null : 'fa-exclamation',
        }     
    }

    let list: GanttData[] = [];

    project_data.tasks.map(task => normalizePlanningDate(task))
    .map((task: TaskType) => {
        const task_id = 'task_' + task.id;
        
        task.activities.map(activity => normalizePlanningDate(activity))
        .sort(
            (a, b) => a.plannedStartDate - b.plannedStartDate
        )
        .map((activity: ActivityType) => {
            const activity_obj = eachActivity(activity, task_id, task);
            list.push(activity_obj);
        });
        
        const warnings = generateTaskWarnings(task)
        list.push(
            {
                name: task.name,
                id: task_id,
                start: task.plannedStartDate,
                end: task.plannedEndDate,
                description: convertDescription(task.description),
                warnings: warnings,
                fontSymbol: warnings.length == 0 ? null : 'fa-exclamation',
            }
        )
    });

    gantt = show_gantt(project_data, list, min_start, max_end);

}

type GanttData = {id:string, name: string, start:number, end:number, description: string, warnings: string, fontSymbol?: string}

const day = 1000 * 60 * 60 * 24;


function show_gantt(project: ProjectType, list: GanttData[], min_start:number, max_end:number) {
    let chart: any = Highcharts.ganttChart('gantt', {
        title: {
            text: project.name
        },
        tooltip: {
            pointFormat: '<span>Name: {point.name}</span><br/><span>From: {point.start:%e. %b}</span><br/><span>To: {point.end:%e. %b}</span><span>{point.description}</span><br/><span style="color: yellow;">{point.warnings}</span>'
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
            type: 'gantt',
            name: project.name,
            data: list,
        }],

        exporting: { 
            width: 1920,
            printMaxWidth: 1920,
        },
        
        plotOptions: {
            gantt: {
                dataLabels: [
                    {
                        enabled: true,
                        format: '{point.assignees}',
                        style: {
                            fontWeight: 'bold',
                            height: 10,
                            textOverflow: 'hidden'
                        },
                        align: 'left',
                    },
                    {
                        enabled: true,
                        format: '<i class="fa {point.fontSymbol}"></i>',
                        useHTML: true,
                        align: 'right',
                        style: {
                            height: 10,
                            textOverflow: 'hidden'
                        }
                    }
                ],
                animation: true,
                dragDrop: {
                    draggableX: true,
                    draggableY: false,
                    dragPrecisionX: day / 24
                },
                
                point: {
                    events: {
                        drop: e => {
                            let obj: Partial<Pick<ActivityType, 'plannedStartDate'|'plannedEndDate'>> = {};
                            let [type, id] = e.newPointId.split('_');
                            let {start:plannedStartDate, end:plannedEndDate} = e.newPoint as any;

                            if (plannedStartDate)
                                obj.plannedStartDate = new Date(plannedStartDate).toISOString();

                            if(plannedEndDate)
                                obj.plannedEndDate = new Date(plannedEndDate).toISOString();

                            send_json_data(`/gantt/${type}/${id}/`, 'PATCH', obj)
                            .then(data => {
                                showAlert('Updated', 'success', 700)
                                
                                const start = new Date(data.plannedStartDate);
                                const end = new Date(data.plannedEndDate);
                                const objId = parseInt(id);
                                
                                if (type === 'task'){
                                    let index = project_data.tasks.findIndex(t => t.id === objId);
                                    if (index < 0) return;
                                    project_data.tasks[index].plannedStartDate = start;
                                    project_data.tasks[index].plannedEndDate = end;
                                }

                                if (type !== 'activity')
                                    return

                                for (const task of project_data.tasks) {
                                    let index = task.activities.findIndex(a => a.id === objId);
                                    if (index < 0) continue;
                                    task.activities[index].plannedStartDate = start;
                                    task.activities[index].plannedEndDate = end;
                                    break;
                                }
                            })
                            .catch(e => showAlert(e, 'error'))
                        },
                        mouseOver: showSide,
                        mouseOut: pointMouseOut,
                        click: e => {
                            const [type, strid] = e.point.options.id.split('_');
                            const id = parseInt(strid)

                            if (type == 'activity')
                                selected_object = project_data.tasks.map(task => task.activities)
                                .flatMap(a => a).find(activity => activity.id === id)
                            
                            else if (type == 'task')
                                selected_object = project_data.tasks.find(task => task.id === id)
                            
                            else return;
                            
                            mode=type
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
    let series = gantt.series[0];
        
    let [type, activityId] = point.id.split('_');
    let [dependencyType, activityDependencyId] = dependencyId.split('_')
    
    if (type !== dependencyType || dependencyType !== 'activity'){
        showAlert('Can not create dependency on Task.', 'error')
        return
    }


    send_json_data(`/gantt/activity/${activityId}/`, 'PATCH', {
        dependency: activityDependencyId
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
        }, {});
        
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
    const id = series.points[index].id.split('_')[1];

    send_json_data(`/gantt/activity/${id}/`, 'DELETE', '', true)
    .then(() => {
        showAlert('Deleted', 'error');
        series.removePoint(index);
    })
    .catch(e => showAlert(e))
}

onMount(()=>{
    get_all()
})
</script>

<div class="relative mt-4 shadow-lg">
    <div id="gantt" class="rounded-md px-1 pt-6 bg-white dark:bg-[#1f1f20]"></div>
</div>

<GanttDropdown 
    ref="{selectedActivityElement}" 
    on:click_remove_dep="{removeDependency}"
    on:click_delete="{deletePoint}"
/>