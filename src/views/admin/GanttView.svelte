<script>
    // import { onMount } from 'svelte';
    // import { user } from '../../stores'
    import SideBarDetail from 'components/Cards/SideBarDetail.svelte'

    import Kanban from './Kanban.svelte';
    import TaskView from './TaskView.svelte';


    // export let location;
    export let project_id

    let Gantt;

    const loadGantt =  async () => {
		Gantt = (await import('./Gantt.svelte')).default;
	};

    const views = ['Tasks   ', 'Gantt', 'Kanban'];
    let active_view = views[0];

    let selected_object=null;
    let mode=null;

    
    $: if (!Gantt && active_view === views[1]) loadGantt();

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

{#if active_view === views[0]}
    <TaskView project_id="{project_id}" bind:mode bind:selected_object />
{:else if active_view === views[1]}
    <svelte:component this={Gantt} project_id="{project_id}" bind:mode bind:selected_object/>
{:else if active_view === views[2]}
    <Kanban project_id="{project_id}" bind:mode bind:selected_object />
{/if}



