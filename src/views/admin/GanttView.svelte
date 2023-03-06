<script lang="ts">
    import SideBarDetail from '../../components/Cards/SideBarDetail.svelte'
    import Kanban from './Kanban.svelte';
    import TaskView from './TaskView.svelte';
    import { queryStore, getContextClient, } from '@urql/svelte';
    import type { GetProjectQuery } from '../../gql/graphql';
    import { getProjectQuery } from '../../gql/queries/projectQuery';
    import LL from '../../i18n/i18n-svelte';
    import { user } from '../../stores';
    import { navigate } from 'svelte-routing';
    import { onMount } from 'svelte';
    import { send_json_data } from '../../utils/get_cookie';
    import { showAlert } from '../../utils/errors';

    type ProjectType = GetProjectQuery['project']
    type TaskType = ProjectType['tasks'][0]
    type ActivityType = TaskType['activities'][0]
    
    const activeKey = 'activeView'; // localStorege key
   
    // export let location;
    export let project_id: number

    let Gantt, PerEmployee, Budget;

    const loadGantt =  async () => {
		  Gantt = (await import('./Gantt.svelte')).default;
	  };
    const loadPerEmployee = async () => {
      PerEmployee = (await import('./PerEmployee.svelte')).default;
    }
    const loadBudget = async () => {
      Budget = (await import('./BudgetView.svelte')).default;
    }

    const views = [
      $LL.ganttView.TASKS(),
      $LL.ganttView.GANTT(),
      $LL.ganttView.KANBAN(),
      $LL.ganttView.EMPLOYEES(),
      $LL.ganttView.BUDGET(),
    ];

    let activeViewIndx: number;


    let selected_object: ActivityType | TaskType = null;
    let mode: 'activity' | 'task' = null;

    
    $: if (!Gantt && activeViewIndx === 1) loadGantt();
    $: if (!PerEmployee && activeViewIndx === 3) loadPerEmployee();
    $: if (!Budget && activeViewIndx === 4) loadBudget();


    let projectsGql = queryStore({
      client:getContextClient(),
      query: getProjectQuery,
      variables: {id: project_id}
    });
    
    function changeActiveView(viewInx: number){
      activeViewIndx = viewInx;
      localStorage.setItem(activeKey, viewInx.toString())
    }

    function autoSchedule(){
      send_json_data(`/gantt/auto-schedule/${project_id}/`, 'PUT')
      .then(o => window.location.reload())
      .catch(r => showAlert(r))
    }

    onMount(() => {
      let viewIndex = parseInt(localStorage.getItem(activeKey))

      if (isNaN(viewIndex)){
        viewIndex = 0
        localStorage.setItem(activeKey, viewIndex.toString());
      }
      activeViewIndx = viewIndex;
    })

</script>

<svelte:head>
  <title>
    Toiler -  Project "{$projectsGql.data && $projectsGql.data.project.name}"
  </title>
</svelte:head>

{#if selected_object}
    <div class="absolute mt-24 w-80 z-2 right-0 top-0 rounded-lg shadow-lg bg-white transition-all duration-500 translate-x-0">
        <SideBarDetail
            bind:object="{selected_object}"
            on:close="{() => selected_object=null}"
            on:delete="{e => console.log(e.detail)}"
            mode="{mode}"
            project_id="{project_id}"
        />
    </div>
{/if}

<div class="inline-flex w-full">
    {#each views as view, i}
      {@const isSelected = i === activeViewIndx}
      <button
        class="py-1 px-2 mx-1 shadow bg-white rounded-lg border border-cyan-300 dark:border-cyan-600 dark:bg-slate-800 dark:hover:bg-slate-600 hover:bg-slate-100"
        class:bg-cyan-100="{isSelected}"
        class:dark:bg-slate-700="{isSelected}"
        class:dark:text-cyan-500="{isSelected}"
        on:click="{() => changeActiveView(i)}"
      >
          {view}
      </button>
    {/each}

    {#if $projectsGql.data}
      {#if $projectsGql.data.project.projectManagerId === $user.id}
        <div class="flex ml-auto">
          {#if activeViewIndx === 1}
            <button
              class="w-fit py-1 px-2 mx-1 font-bold shadow-md bg-white rounded-lg border border-teal-200 dark:border-teal-600 dark:bg-slate-800 dark:hover:bg-slate-600 hover:bg-slate-100"
              on:click="{()=>autoSchedule()}"
            >
            {$LL.ganttView.SCHEDULE()}
            </button>
          {/if}

          <button
            class="w-fit py-1 px-2 mx-1 font-bold shadow-md bg-white rounded-lg border border-teal-400 dark:border-teal-300 dark:bg-slate-800 dark:hover:bg-slate-600 hover:bg-slate-100"
            aria-label="edit project"
            on:click="{()=>navigate(`/f/projects/${$projectsGql.data.project.id}/`)}"
          >
            {$projectsGql.data.project.name}
          </button>
        </div>
      {:else}
        <div aria-label="project's name" class="w-fit py-1 px-2 mx-1 ml-auto font-bold shadow-md bg-white rounded-lg border border-teal-400 dark:border-teal-300 dark:bg-slate-800">
          {$projectsGql.data.project.name}
        </div>
      {/if} 
    {/if}
</div>
{#if $projectsGql.data}
  {#if activeViewIndx === 0}
      <TaskView project_id="{project_id}" bind:mode bind:selected_object project_data="{$projectsGql.data.project}" />
  {:else if activeViewIndx === 1}
      <svelte:component this={Gantt} project_data="{$projectsGql.data.project}" bind:mode bind:selected_object/>
  {:else if activeViewIndx === 2}
      <Kanban project_data="{$projectsGql.data.project}" bind:mode bind:selected_object />
  {:else if activeViewIndx === 3}
      <svelte:component this={PerEmployee} project_data="{$projectsGql.data.project}" bind:mode bind:selected_object/>
  {:else if activeViewIndx === 4}
      <svelte:component this={Budget} project_data="{$projectsGql.data.project}"/>
  {/if}
{:else if $projectsGql.fetching}
  {$LL.ganttView.FETCHING()} ...

{:else if $projectsGql.error}
  error: {$projectsGql.error.message}
{/if}



