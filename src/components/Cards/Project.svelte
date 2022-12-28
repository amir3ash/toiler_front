<script lang="ts">
  import ProjectDropdown from '../Dropdowns/ProjectDropdown.svelte'
  import 'flatpickr/dist/flatpickr.css';
import { navigate } from 'svelte-routing';
import { send_json_data } from '../../utils/get_cookie';
import { createEventDispatcher } from 'svelte';
import LL from './../../i18n/i18n-svelte'


	export let id;
	export let name='Project name';
	export let plannedStartDate='2022-05-04'
	export let plannedEndDate='2022-06-01';
	export let actualStartDate='2022-05-01'
	export let actualEndDate: string|null
	export let description="";

	// export let teams=[]
	// export let roles=[]
  
  const dispatch = createEventDispatcher();

  function delete_project(){
    if (id === null) { return }

    const url=`/gantt/project/${id}/`;

    send_json_data(url, 'DELETE', {}, true)
    .then(d => {
        dispatch('delete', {
			    id: id
		    })
    })
    .catch(e => console.warn('err', e))
  }

  let dead_line_border = ''
  if (!actualEndDate && new Date(plannedEndDate) < new Date())
    dead_line_border = 'border-2 border-red-300 rounded-md'

  let TR = $LL.project;

</script>



<div
  class="relative flex flex-col min-w-0 break-words w-full mb-6 text-left shadow-lg rounded bg-white {dead_line_border}">
  <div class="rounded-t mb-0 px-4 py-3 bg-transparent">
    <div class="flex flex-wrap items-center">
      <div class="relative w-full max-w-full flex-grow flex-1">
        <div class="flex">
          <h6 class="mb-1 mr-1 w-full text-blueGray-700 text-xl font-medium ">
            <button class="w-full rounded-md text-left hover:bg-slate-100" on:click="{() => navigate(`view/${id}/`)}">
              {name}
            </button>
          </h6>
          <ProjectDropdown 
            on:click_delete="{delete_project}"
            on:click_edit="{()=>navigate(`/f/projects/${id}/`)}"
          />
        </div>
        <div class="m-2">
          
          <div class="text-xs mt-2 text-slate-500">
            <div class="w-fit">
              {$LL.PLAN()}:
            </div>
            <div class="flex text-slate-700">
              <div class="rounded-lg px-1 mr-2 text-center text-xs border border-slate-300">
                {TR.DATE({d: plannedStartDate})} <small class="mx-0.5">{$LL.TO()}</small> {TR.DATE({d:plannedEndDate})}
              </div>
            </div>
          </div>

          <div class="text-xs mt-2 text-slate-500">
            {#if actualStartDate}
              <div class="w-fit">
                {TR.STARTED()}:
              </div>
            <div class="flex text-slate-700">
              <div class="rounded-lg px-1 mr-2 text-center text-xs border border-slate-300">
                {TR.DATE({d:actualStartDate})} 
              </div>
            </div>

            {:else}
            <div class="w-fit">
              {TR.NOT_STARTED()}
            </div>
            {/if}
            
          </div>

          <div class="text-xs mt-2 text-slate-500">
            {#if actualEndDate}
              <div class="w-fit">
                {TR.FINISHED()}:
              </div>
              
              <div class="flex text-slate-700">
                <div class="rounded-lg px-1 mr-2 text-center text-xs border border-slate-300">
                  {TR.DATE({d:actualEndDate})}
                </div>
              </div>
            
            {:else if actualStartDate}
              <div class="w-fit">
                {TR.NOT_FINISHED()}
              </div>
            {/if}
          </div>

         {#if description}
          <div class="text-xs mt-2 text-slate-500">
            <div class="w-fit">
              {$LL.DESCRIPTION()}:
            </div>
            <div class="flex text-slate-700">
              <div class="rounded-lg p-2 mr-2 w-full text-xs border border-slate-300">
                {description}
              </div>
            </div>
          </div>
         {/if}
          

        </div>
      </div>
    </div>
  </div>
  
</div>