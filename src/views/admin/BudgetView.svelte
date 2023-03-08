<script lang="ts">
  import { escape, onMount } from 'svelte/internal';
  import * as Highcharts from '../../../node_modules/highcharts/highcharts-gantt.src';
  import * as  Exporting from '../../../node_modules/highcharts/modules/exporting.src';
  import * as OfflineExporting from '../../../node_modules/highcharts/modules/offline-exporting.src';
  import * as ExportData from '../../../node_modules/highcharts/modules/export-data.src'
  import * as DraggablePoints  from '../../../node_modules/highcharts/modules/draggable-points.src';
  import * as Drilldown from '../../../node_modules/highcharts/modules/drilldown.src';
  import * as Data from '../../../node_modules/highcharts/modules/data.src';
  import * as Dark from '../../../node_modules/highcharts/themes/high-contrast-dark.src';
  import type { GetProjectQuery } from '../../gql/graphql';
  import { darkTheme } from '../../stores'
  import { deepCopy } from '../../utils/copy_util';

  DraggablePoints.default(Highcharts);
  Exporting.default(Highcharts);
  OfflineExporting.default(Highcharts);
  ExportData.default(Highcharts);
  Drilldown.default(Highcharts);
  Data.default(Highcharts);

  if ($darkTheme)
    Dark.default(Highcharts)

  type ProjectType = GetProjectQuery['project']
  type ActivityData = {name: string, plannedBudget: number, actualBudget: number}
  type BudgetData = {name: string, y: number, drilldown: string, activities: ActivityData[]}

  export let project_data: ProjectType;

  function normalizeTaskData(project: ProjectType){
    let plannedData: BudgetData[] = [];
    let actualData: BudgetData[] = [];

    project.tasks.map(task => {
      const task_id = 'task_' + task.id;
      const plannedBudget = parseFloat(task.plannedBudget);

      let realTaskBudget = 0;
      let activities: ActivityData[] =[];

      for (const activity of task.activities) {
        let actualBudget = parseFloat(activity.actualBudget);
        let plannedBudget = parseFloat(activity.plannedBudget);
        actualBudget = isNaN(actualBudget) ? 0 : actualBudget;
        plannedBudget = isNaN(plannedBudget) ? 0 : plannedBudget;

        realTaskBudget += actualBudget;

        activities.push({
          name: activity.name,
          plannedBudget: plannedBudget,
          actualBudget: actualBudget
        })
      }

      plannedData.push({
        name: task.name,
        y: isNaN(plannedBudget) ? 0 : plannedBudget,
        drilldown: task_id,
        activities: activities,
      });
      actualData.push({
        name: task.name,
        y: realTaskBudget,
        drilldown: task_id,
        activities: activities,
      });
    });

    return {
      plannedData: plannedData,
      actualData: actualData
    };
  }

  function showTaskBudget() {
    const { plannedData, actualData } = normalizeTaskData(project_data);
    const categories = plannedData.map(o => o.name);
    const title = `Project "${project_data.name}" Budget`;
    const series = [{
        name: "Planned Budget",
        type: null, 
        pointPadding: 0.3,
        data: plannedData
      }, {
        name: "Actual Budget",
        type: null,
        pointPadding: 0.4,
        data: actualData
    }];



Highcharts.chart('task_budget', {
  chart: {
    type: 'column',
    events: {
      load: function() {
        const chart = this;
        const newCategories = categories;
        const newSeries = deepCopy(series);
        chart.customBtn = chart.renderer.button('◁ Go back', 40, 10, function() {
          chart.update({
            xAxis: {
              categories: newCategories
            },
            series: newSeries,
            title: {
              text: title
            }
          }, true, false, false);

          chart.customBtn.hide();
        }).add().hide();
      }
    }
  },  
  title: {
    text: title
  },
  xAxis: {
    categories: categories,
  },
  yAxis: {
    // allowDecimals: false,
    min: 0,
    title: {
      text: "Budget"
    }
  },
  tooltip: {
    shared: true,
    // headerFormat: '<span style="font-size:11px">{point.name}</span><br>',
    // pointFormat: '<span style="color:{point.color}">{series.name}</span>: <b>{point.y:.2f}</b><br/>'
  },
  plotOptions: {
    column: {
      grouping: false,
      shadow: false,
      borderWidth: 0,

      // dataLabels: {
      //   enabled: true
      // },
      point: {
        events: {
          click: function() {
            const point = this, chart = point.series.chart,
            drilldown = point.drilldown;
            
            if (!drilldown)
              return
            
            const data = plannedData.find(o => o.drilldown === drilldown);  

            if (!data) {
              return;
            }

            const activities = data.activities;
            const newSeries = deepCopy(series).map(o => ({...o, data: []}));
            const newCategories = activities.map(o => o.name);
            const plannedSeries = activities.map(o => ({name:o.name, y: o.plannedBudget, drilldown: null}));
            const actualSeries = activities.map(o => ({name:o.name, y: o.actualBudget, drilldown: null}));

            newSeries[0].data = plannedSeries;
            newSeries[1].data = actualSeries;

            // data.activities.forEach(activity =>{
            //   newSeries[0].data.push( //planned
            //     {
            //       name: activity.name,
            //       y: activity.plannedBudget,
            //       drilldown: null
            //     }
            //   )
            //   newSeries[1].data.push( //actual
            //     {
            //       name: activity.name,
            //       y: activity.actualBudget,
            //       drilldown: null
            //     }
            //   );
            // });

            chart.update({
              xAxis: {
                categories: newCategories
              },
              series: newSeries,
              title: {
                text: `Task "${project_data.name}" Budget`
              }
            }, true, false, false);

            chart.customBtn.show();
          }
        }
      }
    }
  },
  series: deepCopy(series)
});
  }

onMount(() => {
  showTaskBudget();
})
</script>

<section class="w-full max-h-full overflow-auto">
      
  <div class="relative mt-4 shadow-lg rounded-lg">
    <div id="task_budget" class="rounded-md px-1 pt-6 bg-white dark:bg-[#1f1f20]"></div>
  </div>
      
</section>