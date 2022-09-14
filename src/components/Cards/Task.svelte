<script>
  import Subtask from "./Subtask.svelte"
  
  export let name = "Task name";
  export let id = 0;
  export let checked = true;
  export let minitasks=[];

  function handle_enter(e){
    if (e.key === 'Enter' || e.keyCode === 13) {
      this.blur();
    }
  }

  function update_name(){
    return -1
  }

</script>

<div
  class="w-full relative flex flex-col min-w-0 break-words mb-6 shadow-lg rounded bg-white">

  <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full max-w-full flex-grow flex-1">
        <h6 class="text-blueGray-700 mb-1 text font-semibold">
          <input bind:value={name} class="bg-transparent focus:border-slate-500" on:keypress={handle_enter} on:change="{update_name}">
        </h6>
        
          {#each minitasks as minitask (minitask.id)}
            <Subtask {...minitask}/>
          {/each}
      
      </div>
    </div>
  </div>
  
</div>