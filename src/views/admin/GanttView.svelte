<script lang="ts">
    import SideBarDetail from 'components/Cards/SideBarDetail.svelte'
    import Kanban from './Kanban.svelte';
    import TaskView from './TaskView.svelte';
    import { queryStore, getContextClient, } from '@urql/svelte';
    import type { GetProjectQuery } from '../../gql/graphql';
    import { getProjectQuery } from '../../gql/queries/projectQuery';

    type ProjectType = GetProjectQuery['project']
    type TaskType = ProjectType['tasks'][0]
    type ActivityType = TaskType['activities'][0]
    
   
    // export let location;
    export let project_id: number

    let Gantt;

    const loadGantt =  async () => {
		  Gantt = (await import('./Gantt.svelte')).default;
	  };

    const views = ['Tasks', 'Gantt', 'Kanban'];
    let active_view = views[0];

    let selected_object: ActivityType | TaskType = null;
    let mode: 'activity' | 'task' = null;

    
    $: if (!Gantt && active_view === views[1]) loadGantt();

    let projectsGql = queryStore({
      client:getContextClient(),
      query: getProjectQuery,
      variables: {id: project_id}
    });

</script>

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

<div>
    {#each views as view}
    <button
      class="py-1 px-2 mx-1 bg-white rounded-lg border border-cyan-300"
      class:bg-cyan-100="{view === active_view}"
      on:click="{() => active_view=view}"
    >
        {view}
    </button>
    {/each}
    
    
</div>
{#if $projectsGql.data}
  {#if active_view === views[0]}
      <TaskView project_id="{project_id}" bind:mode bind:selected_object project_data="{$projectsGql.data.project}" />
  {:else if active_view === views[1]}
      <svelte:component this={Gantt} project_data="{$projectsGql.data.project}" bind:mode bind:selected_object/>
  {:else if active_view === views[2]}
      <Kanban project_data="{$projectsGql.data.project}" bind:mode bind:selected_object />
  {/if}
{:else if $projectsGql.fetching}
  fetching...

{:else if $projectsGql.error}
  error: {$projectsGql.error.message}
{/if}



