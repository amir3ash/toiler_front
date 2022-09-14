<script>
  import Project from 'components/Cards/Project.svelte'
import { onMount } from 'svelte';
import { navigate } from 'svelte-routing';
 const url='/gantt/project/'

export let location

  let projects = [];
  async function getProjects(){
    projects = await fetch(url).then(res => res.json());
  }
  
  function onDeleteProject(e){
    const id = e.detail.id;
    projects = projects.filter(o => o.id !== id)
  }
</script>

<div class="flex flex-wrap">

  {#await getProjects()}
    waiting
  {:then _ } 

    {#each projects.filter(p => !p.actual_end_date) as project (project.id)}

      <div class="w-full lg:w-4/12 px-4">
        <Project on:delete="{onDeleteProject}" {...project}/>
      </div>
      
    {/each}

  {/await}
    

  <div class="w-full lg:w-4/12 px-4">
    <button 
      class="p-4 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-50 text-blueGray-700 text-xl font-medium border-2 border-slate-500 border-dashed hover:bg-slate-100"
      on:click="{() => navigate('/f/projects/new')}"
      >
      Add New Project 
    </button>
  </div>

</div>

<hr class="mt-6 border-b-1 border-blueGray-300" />

<div class="mt-6 flex flex-wrap">
  
  {#each projects.filter(p => p.actual_end_date) as project (project.id)}

      <div class="w-full lg:w-4/12 px-4">
        <Project on:delete="{onDeleteProject}" {...project}/>
      </div>
      
    {/each}

</div>