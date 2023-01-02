<script lang="ts">
  import { escape, onMount } from 'svelte/internal';
  import { showAlert } from '../../utils/errors';
  import { send_json_data } from '../../utils/get_cookie'
  import * as Highcharts from '../../../node_modules/highcharts/highcharts-gantt.src';
  import * as  Exporting from '../../../node_modules/highcharts/modules/exporting.src';
  import * as OfflineExporting from '../../../node_modules/highcharts/modules/offline-exporting.src';
  import * as ExportData from '../../../node_modules/highcharts/modules/export-data.src'
  import * as DraggablePoints  from '../../../node_modules/highcharts/modules/draggable-points.src';
  import * as Dark from '../../../node_modules/highcharts/themes/high-contrast-dark.src';
  import type { GetProjectQuery, UserUser } from '../../gql/graphql';
  import { darkTheme } from '../../stores'

  type ProjectType = GetProjectQuery['project']
  type TaskType = ProjectType['tasks'][0]
  type ActivityType = TaskType['activities'][0]
  DraggablePoints.default(Highcharts);
  Exporting.default(Highcharts);
  OfflineExporting.default(Highcharts);
  ExportData.default(Highcharts);

  if ($darkTheme)
      Dark.default(Highcharts)

  export let project_data: ProjectType;
  export let mode: 'activity' | 'task';
  export let selected_object: TaskType | ActivityType;

  const day = 1000 * 60 * 60 * 24;

function generateSeries(){
  type UsersWithAssignee = {user: UserUser, activities: ActivityType[]};
  let usersWithAssignees: UsersWithAssignee[];

  const items = project_data.tasks.map(task => task.activities).flat()
  .map(activity => activity.assignees.map(assignee=>({user:assignee.user, activity: activity}))).flat()

  const map = new Map<number, UsersWithAssignee>();
  items.forEach(item => {
    let uWAssignee: UsersWithAssignee = map.get(item.user.id);
    if (uWAssignee)
      map.set(item.user.id, {user: uWAssignee.user, activities: [...uWAssignee.activities, item.activity]})
    else
      map.set(item.user.id, {user: item.user, activities: [item.activity]})
  });

  usersWithAssignees = Array.from(map.values());


  let series = usersWithAssignees.map(function (usersWithAssignee, i) {
    var data = usersWithAssignee.activities.map(function (activity) {
      return {
        id: 'activity_' + activity.id,
        taskName: 'aa',
        start: new Date(activity.plannedStartDate).getTime(),
        end: new Date(activity.plannedEndDate).getTime(),
        y: i,
        name: activity.name
      };
    });
    return {
      user: usersWithAssignee.user,
      data: data,
      // current: car.deals[car.current]
    };
  });

  return series
}

function show_employees() {
  const series = generateSeries();
  const chart = Highcharts.ganttChart('chart', {
    // @ts-ignore   
    series: series,
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          format: '{point.name}',
          style: {
              fontWeight: 'bold'
          }
        }
      },
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
              let obj: Partial<Pick<ActivityType, 'plannedStartDate'|'plannedEndDate'>> = {};
              let [type, id] = e.newPointId.split('_');
              let {start:plannedStartDate, end:plannedEndDate} = e.newPoint as any;

              if (plannedStartDate)
                  obj.plannedStartDate = new Date(plannedStartDate).toISOString();

              if(plannedEndDate)
                  obj.plannedEndDate = new Date(plannedEndDate).toISOString();

              send_json_data(`/gantt/${type}/${id}/`, 'PATCH', obj)
              .then(data => showAlert('Updated', 'success', 700))
              .catch(e => showAlert(e, 'error'))
            },
            click: e => {
              const [type, strid] = e.point.options.id.split('_');
              const id = parseInt(strid)

              if (type == 'activity' || type == 'task')
                  mode = type

              selected_object = project_data.tasks.map(task => task.activities)
              .flatMap(a => a).find(activity => activity.id === id)
            },
          }
        }
      }
    },
    title: {
        text: "Employees' Activities"
    },
    tooltip: {
        pointFormat: '<span>Task: {point.taskName}</span><br/><span>From: {point.start:%e. %b}</span><br/><span>To: {point.end:%e. %b}</span>'
    },
    xAxis: {
        currentDateIndicator: true
    },
    yAxis: {
      type: 'category',
      grid: {
        columns: [{
          title: {
            text: 'Employees'
          },
          categories: series.map(s => s.user.username)
        }]
      }
    }
  });
}

onMount(() => {
  show_employees();
})
</script>


<div class="relative mt-4 shadow-lg">
  <div id="chart" class="rounded-md px-1 pt-6 bg-white dark:bg-[#1f1f20]"></div>
</div>

