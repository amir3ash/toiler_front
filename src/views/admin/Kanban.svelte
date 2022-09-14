<script>
    import VariableSizedInput from '../../utils/VariableSizedInput.svelte'
    import { onMount } from 'svelte';
    import { user, search_text } from '../../stores'
    import { send_json_data } from '../../utils/get_cookie'
    import { showAlert } from '../../utils/errors';
    import AvatarDropdown from 'components/Dropdowns/AvatarDropdown.svelte'
    
    export let project_id;
    export let mode;
    export let selected_object;
    mode = 'activity'

    let states=[];
    let activities=[];
    fetch(`/gantt/${project_id}/state/`)
    .then(res => res.json())
    .then(data => states=data)
    
    fetch(`/gantt/${project_id}/activity/?verbose=true`)
    .then(res => res.json())
    .then(data => activities=data)

    function updateState(id, name){
        if(id){
            send_json_data(`/gantt/state/${id}/`, 'PATCH', {
                name: name,
            })
            .then(data => {
                const index = states.findIndex(o => o.id === id);
                states[index]=data;
                states=states;
            })
        }
        else {
            send_json_data('/gantt/state/', 'POST', {
                name: name,
                project: project_id
            })
            .then(data => states=[...states, data])
        }
    }

    function deleteState(id){
        send_json_data(`/gantt/state/${id}/`, 'DELETE', '', true)
        .then(res => {
            if(res.ok)
                states = states.filter(o => o.id !== id)
        })
        .catch(data => showAlert(data))
    }
</script>

<section class="w-full max-h-full overflow-auto">
    <div class="flex mt-4 pb-8 min-w-max flex-nowrap justify-start">
        {#each states as state(state.id)}
            <div class="text-center mx-2 p-2 w-72 rounded-lg bg-white shadow">
                <div class="flex p-1 mb-2 border-b border-slate-400">
                    <h3 class="w-full uppercase">
                        <VariableSizedInput value="{state.name}" on:click_enter="{e => updateState(state.id, e.detail.value)}"/>
                    </h3>
                    <button on:click="{()=>deleteState(state.id)}" class="px-2 text-slate-300 hover:text-rose-700" aria-label="delete state">
                        <i class="fa fa-trash"></i>
                    </button>
                </div>
                
                

                {#each activities.filter(o => (o.state && o.state.id || o.state) === state.id).filter(o=>o.name.includes($search_text)) as activity(activity.id)}
                    <div class="flex justify-between mx-1 p-2 text-left shadow-md border rounded border-lime-200">
                        <button on:click="{() =>{selected_object=activity}}">
                            {activity.name}
                        </button>
                        <div class="min-w-max p-0">
                            {#each activity.assignees as {user: assignee}}
                                <AvatarDropdown  user="{assignee}"/>
                                <!-- <span class="w-8 h-8 ml-auto bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                                    {#if assignee.avatar}
                                        <img class="w-full rounded-full align-middle border-none shadow-lg" src="{assignee.avatar}" alt="{assignee.username}'s avatar">
                                    {/if}
                                </span> -->
                            {/each}
                        </div>
                    </div>
                {/each}
            
            </div>
        {/each}

        <div class="text-center mx-2 p-2 w-72 rounded-lg bg-slate-50 shadow">
            <h3 class="w-full mb-2 p-1 uppercase border-b border-slate-400  ">
                <VariableSizedInput 
                    on:click_enter="{e => updateState(null, e.detail.value)}"
                    placeholder="State name"
                    min_width="110px"
                    classes="bg-slate-50"
                />
            </h3>
        </div>
        
    </div>
</section>