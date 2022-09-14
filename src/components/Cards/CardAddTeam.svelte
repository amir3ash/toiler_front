<script>
    import { send_json_data } from '../../utils/get_cookie';

    export let project_id;

    let promise=fetch(`/gantt/team/`)

    let team_name='';
    
    function add_new_team(){
        console.debug(team_name)
        const url = '/gantt/team/';
        const data = {
            name: team_name,
            project: project_id,
        };
        
        if (team_name != '')
        send_json_data(url, 'POST', data).then(d => {
            team_name = '';
        })
        .catch(e => console.warn('err', e))
    }
</script>

<div class="p-2 m-2 bg-white rounded-md shadow-md">
    <h6 class="ml-2 mt-2 px-1 text-lg uppercase">
        Teams
    </h6>
    <div class="flex flex-wrap items-center">
      <div class="relative w-full max-w-full flex-grow flex-1">
        <div class="m-2">
          <div class="text-xs mt-2 uppercase text-slate-500">
                <lable for="#team-name">
                    Team name:
                </lable>
                <div class="mt-1 flex text-slate-700">
                    <input
                        class="rounded-lg pl-1 p-1 mr-2 text-sm border border-slate-300"
                        placeholder="Team name"
                        id="team-name"
                        bind:value="{team_name}"
                    />
                   
                   <button
                      class="rounded-lg px-2 text-center text-sm border border-slate-300 hover:border-orange-400"
                      on:click="{() => {add_new_team()}}"
                   >Add</button>
                </div>
          </div>
          
          <div class="flex flex-col text-xs mt-4 text-slate-500">
            <div class="uppercase">
                Teams:
            </div>
            <div class="p-2 flex flex-wrap rounded-lg text-sm text-slate-700">
                {#await promise.then(d => d.json())}
                    loading ...
                {:then teams} 
                    {#each teams as {name}}
                        <div class="py-0 pl-2 m-1 inline-flex rounded-xl w-fit border border-rose-400">
                            <div class="py-1">
                                {name}
                            </div>
                            <button class="text-rose-500 py-1 px-2">
                                <i class="fas fa-ellipsis-v"></i>
                            </button>
                        </div>
                    {/each}
                {/await}
                
            </div>
          </div>
          
        </div>
        
      </div>
    </div>
  
  </div>