<script lang="ts">
  import Project from 'components/Cards/Project.svelte'
import { onMount } from 'svelte';
import { navigate } from 'svelte-routing';
import { queryStore, gql, getContextClient } from '@urql/svelte';
import type { GanttProject } from '../../gql/graphql';
import LL from '../../i18n/i18n-svelte';


export let location

  let projectsGql = queryStore<{projects: GanttProject[]}>({
      client:getContextClient(),
      query: gql(`
        {
          projects {
            id
            name
            plannedStartDate
            plannedEndDate
            actualStartDate
            actualEndDate
            description
          }
        }
      `),
    });

    let projects: GanttProject[] = []

    $: if ($projectsGql.data){
      projects = $projectsGql.data.projects
    }
  
  function onDeleteProject(e){
    const id = e.detail.id;
    projects = projects.filter(o => o.id !== id);
  }
</script>

<div class="flex flex-wrap">

  {#if $projectsGql.fetching}
    waiting
  {:else if $projectsGql.error}
    <p>Oh no... {$projectsGql.error.message}</p>
  {:else} 

    {#each projects.filter(p => !p.actualEndDate) as project (project.id)}

      <div class="w-full lg:w-4/12 px-4">
        <Project on:delete="{onDeleteProject}" {...project}/>
      </div>
      
    {/each}

  {/if} 
    

  <div class="w-full lg:w-4/12 px-4">
    <button 
      class="p-4 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-50 text-blueGray-700 text-xl font-medium border-2 border-slate-500 border-dashed hover:bg-slate-100"
      on:click="{() => navigate('/f/projects/new')}"
      >
      {$LL.project.ADD_PROJECT()} 
    </button>
  </div>

</div>

<hr class="mt-6 border-b-1 border-blueGray-300" />

<div class="mt-6 flex flex-wrap">
  
    {#each projects.filter(p => p.actualEndDate) as project (project.id)}

      <div class="w-full lg:w-4/12 px-4">
        <Project on:delete="{onDeleteProject}" {...project}/>
      </div>
      
    {/each}

</div>